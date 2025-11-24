import OpenAI from "openai";
import * as cheerio from "cheerio";
import { analyzeHtml } from "@/actions/analyze-url";
import { ReportData } from "@/lib/reportTemplate";

/**
 * Generates complete ReportData for a domain based on scraped content
 * Uses AI to create domain-specific content (persona, FAQs, content pack, etc.)
 */
export async function generateReportData(
  domain: string,
  rawHTML: string,
  textContent: string
): Promise<ReportData> {
  const $ = cheerio.load(rawHTML);
  const url = domain.startsWith("http") ? domain : `https://${domain}`;
  const urlObj = new URL(url);

  // 1. Run technical analysis
  const analysisResult = await analyzeHtml(rawHTML, domain, 0);

  // 2. Extract technical information
  const technical = {
    robots: getTechnicalStatus(analysisResult, "robots-txt"),
    sitemap: await checkSitemap(urlObj),
    schema: analysisResult.rawJsonLd && analysisResult.rawJsonLd.length > 0 
      ? `${analysisResult.rawJsonLd.length} JSON-LD schema(s) detected`
      : "No schema detected",
    performance: getPerformanceStatus(analysisResult),
    mobile: checkMobileFriendly($),
    security: urlObj.protocol === "https:" ? "HTTPS enabled" : "HTTP only"
  };

  // 3. Use AI to generate domain-specific content
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Fallback to basic data if no API key
    return generateFallbackReportData(domain, analysisResult, technical);
  }

  try {
    const openai = new OpenAI({ apiKey });
    
    // Generate all AI-powered content in parallel
    const [personaData, contentPack, faqData, recommendedContent] = await Promise.all([
      generatePersonaStrategy(openai, textContent, $),
      generateContentPack(openai, textContent, $),
      generateFAQ(openai, textContent, $),
      generateRecommendedContentBlock(openai, textContent, $)
    ]);

    // Generate schemas
    const faqSchema = generateFAQSchema(faqData.items);
    const orgSchema = await generateOrganizationSchema(openai, domain, $, textContent);

    return {
      domain,
      score: analysisResult.score,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      persona: personaData,
      contentPack,
      faq: { items: faqData.items },
      faqSchema,
      orgSchema,
      recommendedContentBlock: recommendedContent,
      technical
    };
  } catch (error) {
    console.error("Error generating AI content:", error);
    return generateFallbackReportData(domain, analysisResult, technical);
  }
}

// --- AI Generation Functions ---

async function generatePersonaStrategy(
  openai: OpenAI,
  textContent: string,
  $: cheerio.CheerioAPI
): Promise<{ currentAudience: string; recommendedAudience: string; positioning: string; tone: string }> {
  const prompt = `Analyze this website content and provide persona strategy:

${textContent.substring(0, 3000)}

Provide a JSON object with these exact keys:
- currentAudience: Who the site is actually attracting now (1 sentence)
- recommendedAudience: Who they should target for better AI visibility (1 sentence)
- positioning: A clear positioning statement (1 sentence)
- tone: Suggested brand tone (3-4 words, comma-separated)

Return ONLY valid JSON, no markdown, no explanations.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a brand strategist. Return only valid JSON." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  try {
    const data = JSON.parse(completion.choices[0].message.content || "{}");
    return {
      currentAudience: data.currentAudience || "General audience",
      recommendedAudience: data.recommendedAudience || "Targeted niche market",
      positioning: data.positioning || "Clear value proposition needed",
      tone: data.tone || "Professional and approachable"
    };
  } catch {
    return {
      currentAudience: "General audience",
      recommendedAudience: "Targeted niche market",
      positioning: "Clear value proposition needed",
      tone: "Professional and approachable"
    };
  }
}

async function generateContentPack(
  openai: OpenAI,
  textContent: string,
  $: cheerio.CheerioAPI
): Promise<{ h1: string; h2s: string[]; metaDescription: string; introParagraph: string }> {
  const h1 = $("h1").first().text().trim() || "";
  const existingH2s = $("h2").map((_, el) => $(el).text().trim()).get().slice(0, 5);
  const metaDesc = $('meta[name="description"]').attr("content") || "";

  const prompt = `Based on this website content, generate optimized content:

${textContent.substring(0, 3000)}

Current H1: ${h1}
Existing H2s: ${existingH2s.join(", ")}

Generate:
1. A compelling H1 (target the recommended niche audience, NOT about AI visibility)
2. 3-5 H2 subheadings (array)
3. A meta description (150-160 characters, optimized for search and AI)
4. An intro paragraph for homepage hero section (80-120 words, compelling, about the business)

Return JSON with keys: h1, h2s (array), metaDescription, introParagraph
ONLY valid JSON, no markdown.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a content strategist. Return only valid JSON." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.8
  });

  try {
    const data = JSON.parse(completion.choices[0].message.content || "{}");
    return {
      h1: data.h1 || h1 || "Welcome",
      h2s: Array.isArray(data.h2s) ? data.h2s : (data.h2s ? [data.h2s] : ["Section 1", "Section 2", "Section 3"]),
      metaDescription: data.metaDescription || metaDesc || "Professional services and solutions",
      introParagraph: data.introParagraph || "We provide exceptional services tailored to your needs."
    };
  } catch {
    return {
      h1: h1 || "Welcome",
      h2s: existingH2s.length > 0 ? existingH2s : ["Section 1", "Section 2", "Section 3"],
      metaDescription: metaDesc || "Professional services and solutions",
      introParagraph: "We provide exceptional services tailored to your needs."
    };
  }
}

async function generateFAQ(
  openai: OpenAI,
  textContent: string,
  $: cheerio.CheerioAPI
): Promise<{ items: Array<{ question: string; answer: string }> }> {
  // Check if FAQ already exists on page
  const existingFAQs: Array<{ question: string; answer: string }> = [];
  $("h2, h3, dt").each((_, el) => {
    const text = $(el).text().trim();
    if (text.match(/^\?|^Q:|question/i) || text.length < 100) {
      const next = $(el).next();
      if (next.length && (next.is("p") || next.is("dd"))) {
        existingFAQs.push({
          question: text.replace(/^[?Q:]\s*/i, ""),
          answer: next.text().trim().substring(0, 300)
        });
      }
    }
  });

  const prompt = `Based on this website content, generate 6-8 relevant FAQ items:

${textContent.substring(0, 3000)}

${existingFAQs.length > 0 ? `Existing FAQs found: ${JSON.stringify(existingFAQs)}` : ""}

Generate FAQs that are:
- Relevant to this business
- Common questions customers would ask
- Specific to their industry/service type
- Helpful for AI systems to understand the business

Return JSON with key "items" containing array of {question, answer} objects.
Each answer should be 2-4 sentences.
ONLY valid JSON, no markdown.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a content strategist. Return only valid JSON." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  try {
    const data = JSON.parse(completion.choices[0].message.content || "{}");
    const items = Array.isArray(data.items) ? data.items : [];
    
    // Ensure we have at least 6 items
    if (items.length < 6 && existingFAQs.length > 0) {
      items.push(...existingFAQs.slice(0, 6 - items.length));
    }
    
    return {
      items: items.length >= 6 ? items.slice(0, 8) : [
        { question: "What services do you offer?", answer: "We provide comprehensive solutions tailored to your needs." },
        { question: "How can I get started?", answer: "Contact us today to begin your journey." },
        { question: "What are your business hours?", answer: "We are available during standard business hours." },
        { question: "Do you offer support?", answer: "Yes, we provide ongoing support for all our clients." },
        { question: "What is your pricing?", answer: "Pricing varies based on your specific requirements." },
        { question: "How long does it take?", answer: "Timeline depends on the scope of your project." }
      ]
    };
  } catch {
    return {
      items: existingFAQs.length > 0 ? existingFAQs : [
        { question: "What services do you offer?", answer: "We provide comprehensive solutions tailored to your needs." },
        { question: "How can I get started?", answer: "Contact us today to begin your journey." }
      ]
    };
  }
}

async function generateRecommendedContentBlock(
  openai: OpenAI,
  textContent: string,
  $: cheerio.CheerioAPI
): Promise<string> {
  const prompt = `Write a compelling homepage content block (120-160 words) for this business:

${textContent.substring(0, 3000)}

The content should:
- Summarize their value proposition
- Identify their niche audience
- Highlight their specialty
- Mention key features/amenities (if applicable)
- Convey their vibe/style
- Explain why people choose them

Write in their brand voice. Do NOT mention AI visibility or BalloonSight.
Return ONLY the paragraph text, no JSON, no markdown, no quotes.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a copywriter. Return only the paragraph text." },
      { role: "user", content: prompt }
    ],
    temperature: 0.8,
    max_tokens: 300
  });

  const content = completion.choices[0].message.content?.trim() || "";
  return content || "We provide exceptional services tailored to your needs. Our team is dedicated to delivering results that exceed expectations.";
}

async function generateOrganizationSchema(
  openai: OpenAI,
  domain: string,
  $: cheerio.CheerioAPI,
  textContent: string
): Promise<any> {
  // Extract existing schema if present
  const existingSchemas = $('script[type="application/ld+json"]');
  let orgSchema: any = null;
  
  existingSchemas.each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || "{}");
      if (data["@type"] === "Organization" || data["@type"] === "LocalBusiness" || 
          data["@type"] === "Hotel" || data["@type"] === "LodgingBusiness") {
        orgSchema = data;
        return false; // break
      }
    } catch {}
  });

  // Extract basic info
  const name = $('meta[property="og:site_name"]').attr("content") || 
               $("title").text().split("|")[0].trim() || 
               domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const logo = $('meta[property="og:image"]').attr("content") || 
               $('link[rel="icon"]').attr("href") || 
               `${domain}/logo.png`;
  const description = $('meta[name="description"]').attr("content") || 
                      $('meta[property="og:description"]').attr("content") || 
                      textContent.substring(0, 200);

  // Try to extract address/phone from content or existing schema
  const addressMatch = textContent.match(/(\d+[\s\w]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|way|lane|ln)[\s\w,]+(?:[A-Z]{2}|[A-Za-z\s]+)\s\d{5})/i);
  const phoneMatch = textContent.match(/(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);

  if (orgSchema) {
    // Enhance existing schema
    orgSchema.name = orgSchema.name || name;
    orgSchema.url = orgSchema.url || domain;
    orgSchema.logo = orgSchema.logo || logo;
    orgSchema.description = orgSchema.description || description;
    return orgSchema;
  }

  // Generate new schema
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": domain,
    "logo": logo.startsWith("http") ? logo : `${domain}${logo.startsWith("/") ? "" : "/"}${logo}`,
    "description": description
  };

  if (addressMatch) {
    schema.address = {
      "@type": "PostalAddress",
      "streetAddress": addressMatch[0]
    };
  }

  if (phoneMatch) {
    schema.telephone = phoneMatch[0];
  }

  // Try to determine business type from content
  const lowerText = textContent.toLowerCase();
  if (lowerText.includes("hotel") || lowerText.includes("apartment") || lowerText.includes("lodging")) {
    schema["@type"] = "LodgingBusiness";
  } else if (lowerText.includes("restaurant") || lowerText.includes("cafe") || lowerText.includes("food")) {
    schema["@type"] = "Restaurant";
  } else if (lowerText.includes("product") || lowerText.includes("shop") || lowerText.includes("store")) {
    schema["@type"] = "Store";
  }

  return schema;
}

function generateFAQSchema(faqItems: Array<{ question: string; answer: string }>): any {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

// --- Helper Functions ---

function getTechnicalStatus(result: any, checkId: string): string {
  for (const category of Object.values(result.categories || {}) as any[]) {
    const check = category.checks?.find((c: any) => c.id === checkId);
    if (check) {
      if (check.status === "pass") return "Configured correctly";
      if (check.status === "warning") return "Needs attention";
      return "Missing or incorrect";
    }
  }
  return "Unknown";
}

async function checkSitemap(url: URL): Promise<string> {
  try {
    const sitemapUrl = `${url.origin}/sitemap.xml`;
    const res = await fetch(sitemapUrl, { signal: AbortSignal.timeout(5000) });
    if (res.ok) return "Present at /sitemap.xml";
    return "Not found";
  } catch {
    return "Not found";
  }
}

function getPerformanceStatus(result: any): string {
  const score = result.categories?.accessibility?.score || 0;
  if (score >= 80) return `Excellent - ${score}/100`;
  if (score >= 60) return `Good - ${score}/100`;
  return `Needs improvement - ${score}/100`;
}

function checkMobileFriendly($: cheerio.CheerioAPI): string {
  const viewport = $('meta[name="viewport"]').attr("content");
  if (viewport) return "Responsive design";
  return "Unknown";
}

function generateFallbackReportData(
  domain: string,
  analysisResult: any,
  technical: any
): ReportData {
  return {
    domain,
    score: analysisResult.score,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    persona: {
      currentAudience: "General audience",
      recommendedAudience: "Targeted niche market",
      positioning: "Clear value proposition needed",
      tone: "Professional and approachable"
    },
    contentPack: {
      h1: "Welcome",
      h2s: ["Section 1", "Section 2", "Section 3"],
      metaDescription: "Professional services and solutions",
      introParagraph: "We provide exceptional services tailored to your needs."
    },
    faq: {
      items: [
        { question: "What services do you offer?", answer: "We provide comprehensive solutions tailored to your needs." },
        { question: "How can I get started?", answer: "Contact us today to begin your journey." }
      ]
    },
    faqSchema: generateFAQSchema([
      { question: "What services do you offer?", answer: "We provide comprehensive solutions tailored to your needs." }
    ]),
    orgSchema: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": domain.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      "url": domain
    },
    recommendedContentBlock: "We provide exceptional services tailored to your needs. Our team is dedicated to delivering results that exceed expectations.",
    technical
  };
}

