import OpenAI from "openai";
import * as cheerio from "cheerio";
import { ReportData } from "@/lib/reportTemplate";

interface Metadata {
  title: string | null;
  metaDescription: string | null;
  jsonLd: any[] | null;
}

interface TechnicalInput {
  robots: "OK" | "Missing" | "Blocked" | "Warning";
  sitemap: "OK" | "Missing" | "Warning";
  schema: "OK" | "Partial" | "Missing";
  performance: number | null;
  mobile: "Good" | "Poor" | "Unknown";
  security: "HTTPS" | "Missing";
}

/**
 * Generates complete ReportData for a domain based on scraped content
 * Uses AI to create domain-specific content (persona, FAQs, content pack, etc.)
 */
export async function generateReportData(
  domain: string,
  html: string,
  textContent: string,
  metadata: Metadata,
  technical: TechnicalInput
): Promise<ReportData> {
  const $ = cheerio.load(html);
  const url = domain.startsWith("http") ? domain : `https://${domain}`;

  // Format technical fields for output
  const technicalFormatted = {
    robots: formatRobotsStatus(technical.robots),
    sitemap: formatSitemapStatus(technical.sitemap),
    schema: formatSchemaStatus(technical.schema),
    performance: formatPerformanceStatus(technical.performance),
    mobile: formatMobileStatus(technical.mobile),
    security: formatSecurityStatus(technical.security)
  };

  // 3. Use AI to generate domain-specific content
  const apiKey = process.env.OPENAI_API_KEY;
  
  // Debug logging
  console.log("🔍 [generateReportData] Starting report generation for:", domain);
  console.log("🔍 [generateReportData] Text content length:", textContent.length);
  console.log("🔍 [generateReportData] Text content preview:", textContent.substring(0, 300));
  console.log("🔍 [generateReportData] Has OpenAI API key:", !!apiKey);
  console.log("🔍 [generateReportData] Metadata:", {
    title: metadata.title?.substring(0, 100),
    metaDescription: metadata.metaDescription?.substring(0, 100),
    jsonLdCount: metadata.jsonLd?.length || 0
  });
  
  if (!apiKey) {
    console.warn("⚠️ [generateReportData] No OPENAI_API_KEY found - using fallback data");
    // Fallback to basic data if no API key
    return generateFallbackReportData(domain, technicalFormatted);
  }

  try {
    const openai = new OpenAI({ apiKey });
    
    console.log("✅ [generateReportData] OpenAI client created, generating persona strategy...");
    // First generate persona (needed for content pack)
    const personaData = await generatePersonaStrategy(openai, textContent, $, metadata);
    console.log("✅ [generateReportData] Persona generated:", personaData);
    
    console.log("✅ [generateReportData] Generating content pack, FAQ, and recommended content...");
    // Calculate score and score breakdown
    const score = await calculateScore(textContent, $, metadata, technical);
    const scoreBreakdown = calculateScoreBreakdown(textContent, $, metadata, technical);
    
    // Then generate remaining content in parallel
    const [contentPack, faqData, recommendedContent, aiInsights, keywordIntent, trustEAT] = await Promise.all([
      generateContentPack(openai, textContent, $, metadata, personaData),
      generateFAQ(openai, textContent, $),
      generateRecommendedContentBlock(openai, textContent, $),
      generateAIVisibilityInsights(openai, textContent, metadata),
      generateKeywordIntent(openai, textContent, metadata),
      generateTrustEAT(openai, textContent, metadata, $)
    ]);
    
    // Generate quick wins (synchronous)
    const quickWins = generateQuickWins(textContent, $, metadata, technical);
    
    console.log("✅ [generateReportData] Content generated:", {
      h1: contentPack.h1?.substring(0, 50),
      faqCount: faqData.items.length,
      score,
      scoreBreakdown: scoreBreakdown.overallScore
    });

    // Generate schemas
    console.log("✅ [generateReportData] Generating schemas...");
    const faqSchema = generateFAQSchema(faqData.items);
    const orgSchema = await generateOrganizationSchema(openai, domain, $, textContent, metadata);
    console.log("✅ [generateReportData] Report generation complete!");

    return {
      domain,
      score,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      persona: personaData,
      contentPack,
      faq: { items: faqData.items },
      faqSchema,
      orgSchema,
      recommendedContentBlock: recommendedContent,
      technical: technicalFormatted,
      scoreBreakdown,
      aiVisibilityInsights: aiInsights,
      keywordIntent,
      trustEAT,
      quickWins
    };
  } catch (error) {
    console.error("❌ [generateReportData] Error generating AI content:", error);
    console.error("❌ [generateReportData] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      domain,
      hasApiKey: !!apiKey,
      textContentLength: textContent.length,
      textContentPreview: textContent.substring(0, 200)
    });
    return generateFallbackReportData(domain, technicalFormatted);
  }
}

// --- AI Generation Functions ---

async function generatePersonaStrategy(
  openai: OpenAI,
  textContent: string,
  $: cheerio.CheerioAPI,
  metadata: Metadata
): Promise<{ currentAudience: string; recommendedAudience: string; positioning: string; tone: string }> {
  const prompt = `CRITICAL INSTRUCTIONS:
- You are analyzing the website: ${metadata.title || "the provided website"}
- This is a REAL BUSINESS website (hotel, restaurant, service, etc.)
- DO NOT mention "BalloonSight", "AI visibility", "analysis tools", or any reporting services
- Generate content ONLY about the business itself - their actual services, offerings, and value proposition

You are analyzing a website to determine its persona strategy. Analyze the following content deeply:

${textContent.substring(0, 4000)}

Metadata:
- Title: ${metadata.title || "Not provided"}
- Description: ${metadata.metaDescription || "Not provided"}

Analyze:
1. TONE: What is the writing style? (formal, casual, friendly, professional, etc.)
2. OFFERINGS: What products/services are mentioned?
3. VISUALS: What visual elements are described? (design style, imagery, aesthetics)
4. AMENITIES: What features/benefits are highlighted?
5. PRICE SIGNALS: What pricing cues exist? (premium, budget, mid-range, etc.)
6. STYLE: Overall brand personality and positioning

Based on this analysis:
- currentAudience: Who is the site actually attracting now? Be specific about demographics, psychographics, and behaviors. (1 sentence)
- recommendedAudience: Who should they target for better AI visibility? This must be:
  * Realistic (aligned with what they offer)
  * Profitable (worth targeting)
  * Tightly defined (NOT generic - be specific about niche)
  * Aligned with their offerings (1 sentence)
- positioning: A clear, compelling positioning statement that differentiates them (1 sentence)
- tone: Suggested brand tone (3-4 words, comma-separated)

Return ONLY valid JSON with keys: currentAudience, recommendedAudience, positioning, tone
No markdown, no explanations, no commentary.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an expert brand strategist. Analyze websites and provide strategic persona recommendations. Return only valid JSON." },
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
  $: cheerio.CheerioAPI,
  metadata: Metadata,
  personaData: { recommendedAudience: string; tone: string }
): Promise<{ h1: string; h2s: string[]; metaDescription: string; introParagraph: string }> {
  const h1 = $("h1").first().text().trim() || "";
  const existingH2s = $("h2").map((_, el) => $(el).text().trim()).get().slice(0, 5);
  const metaDesc = metadata.metaDescription || $('meta[name="description"]').attr("content") || "";

  const prompt = `CRITICAL INSTRUCTIONS:
- You are generating content for: ${metadata.title || "the business website"}
- This is a REAL BUSINESS (hotel, restaurant, service, etc.) - NOT BalloonSight or an analysis tool
- DO NOT mention "AI visibility", "BalloonSight", "analysis", "reporting", or any meta-services
- Generate content ONLY about the business itself - their actual services, offerings, amenities, location, etc.

Generate optimized website content for this business. The recommended niche audience is: "${personaData.recommendedAudience}". The brand tone is: "${personaData.tone}".

Website content:
${textContent.substring(0, 4000)}

Current H1: ${h1}
Existing H2s: ${existingH2s.join(", ")}
Current meta description: ${metaDesc}

Generate NEW content targeted to the recommended niche audience:

1. H1: One strong headline that is:
   - Niche-targeted (speaks directly to the recommended audience)
   - Clear and human-readable
   - No marketing fluff
   - About the business itself (hotel rooms, restaurant dishes, services offered, etc.)
   - ABSOLUTELY NOT about AI visibility, BalloonSight, or analysis tools

2. H2s: 3-6 subheadings (array) that create structure for homepage sections:
   - Domain-specific (about their actual offerings)
   - Relevant to the business
   - Create logical flow

3. Meta Description: 160 characters max (exactly)
   - Accurately represents the business
   - Optimized for search and AI
   - No fluff
   - About the business, NOT about analysis or reporting

4. Intro Paragraph: 120-200 words
   - Optimized for the recommended niche
   - Keep brand tone consistent (${personaData.tone})
   - Rewrite their homepage hero text but better
   - About the business itself (what they offer, who they serve, why choose them)
   - ABSOLUTELY NOT about AI visibility or BalloonSight

Return JSON with keys: h1, h2s (array), metaDescription, introParagraph
ONLY valid JSON, no markdown.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a content strategist specializing in niche-targeted copywriting. Return only valid JSON." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.8
  });

  try {
    const data = JSON.parse(completion.choices[0].message.content || "{}");
    return {
      h1: data.h1 || h1 || "Welcome",
      h2s: Array.isArray(data.h2s) ? data.h2s.slice(0, 6) : (data.h2s ? [data.h2s] : ["Section 1", "Section 2", "Section 3"]),
      metaDescription: (data.metaDescription || metaDesc || "Professional services and solutions").substring(0, 160),
      introParagraph: data.introParagraph || "We provide exceptional services tailored to your needs."
    };
  } catch {
    return {
      h1: h1 || "Welcome",
      h2s: existingH2s.length > 0 ? existingH2s : ["Section 1", "Section 2", "Section 3"],
      metaDescription: (metaDesc || "Professional services and solutions").substring(0, 160),
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

  // Determine business type from content
  const lowerText = textContent.toLowerCase();
  let businessType = "general business";
  let faqExamples = "";
  
  if (lowerText.includes("hotel") || lowerText.includes("apartment") || lowerText.includes("lodging") || lowerText.includes("accommodation")) {
    businessType = "hotel/apartment/lodging";
    faqExamples = "Examples: check-in/check-out times, amenities (WiFi, parking, breakfast), location details, long-term stays, cleaning services, cancellation policy, pet policies, payment methods";
  } else if (lowerText.includes("restaurant") || lowerText.includes("cafe") || lowerText.includes("dining")) {
    businessType = "restaurant/cafe";
    faqExamples = "Examples: menu options, dietary restrictions, reservations, hours, group bookings, parking, delivery options";
  } else if (lowerText.includes("rental") || lowerText.includes("property")) {
    businessType = "rental/property";
    faqExamples = "Examples: deposits, cleaning fees, long stays, check-in process, amenities, cancellation, pet policies, minimum stay";
  } else if (lowerText.includes("service") || lowerText.includes("consulting")) {
    businessType = "service/consulting";
    faqExamples = "Examples: pricing, process/workflow, guarantees, timeline, what's included, support, payment terms";
  }

  const prompt = `CRITICAL INSTRUCTIONS:
- You are generating FAQs for a REAL ${businessType} business
- This is NOT BalloonSight or an analysis tool
- DO NOT mention "AI visibility", "BalloonSight", "analysis", or reporting services
- Generate FAQs ONLY about the business itself - their services, offerings, policies, etc.

Generate a complete FAQ page for this ${businessType} business.

Website content:
${textContent.substring(0, 4000)}

${existingFAQs.length > 0 ? `Existing FAQs found: ${JSON.stringify(existingFAQs)}` : ""}

Generate MINIMUM 6 FAQ items that are:
- Tailored to their industry (${businessType})
- Relevant to their real offerings (rooms, services, amenities, etc.)
- Specific to their location (if mentioned)
- Match their persona/brand
- Common questions customers would ask
${faqExamples ? `- Include questions about: ${faqExamples}` : ""}
- ABSOLUTELY NOT about AI visibility, BalloonSight, or analysis tools

Each answer should be 2-4 sentences, helpful and specific.

Return JSON with key "items" containing array of {question, answer} objects.
ONLY valid JSON, no markdown.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a content strategist specializing in FAQ creation. Return only valid JSON." },
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
  const prompt = `CRITICAL INSTRUCTIONS:
- You are writing content for a REAL BUSINESS website (hotel, restaurant, service, etc.)
- This is NOT BalloonSight or an analysis tool
- DO NOT mention "AI visibility", "BalloonSight", "analysis", "reporting", or any meta-services
- Write ONLY about the business itself - their actual offerings, services, amenities, location, etc.

Write a compelling homepage content block (100-150 words) for this business:

${textContent.substring(0, 4000)}

The content must clearly communicate:
- What they offer (specific services/products - hotel rooms, restaurant dishes, services, etc.)
- Who it's for (target audience/niche)
- Why they're unique (differentiation)
- Their vibe/style (brand personality)
- The recommended niche (who should choose them)

Write for BOTH humans AND AIs. Be clear, specific, and compelling.
ABSOLUTELY DO NOT mention AI visibility, BalloonSight, analysis tools, or reporting services.
Return ONLY the paragraph text, no JSON, no markdown, no quotes.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a copywriter specializing in homepage content. Return only the paragraph text." },
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
  textContent: string,
  metadata: Metadata
): Promise<any> {
  // Use existing schema from metadata if available
  let orgSchema: any = null;
  if (metadata.jsonLd && metadata.jsonLd.length > 0) {
    for (const schema of metadata.jsonLd) {
      if (schema["@type"] === "Organization" || schema["@type"] === "LocalBusiness" || 
          schema["@type"] === "Hotel" || schema["@type"] === "LodgingBusiness" ||
          schema["@type"] === "Apartment") {
        orgSchema = schema;
        break;
      }
    }
  }

  // Extract basic info
  const name = metadata.title?.split("|")[0].trim() || 
               $('meta[property="og:site_name"]').attr("content") || 
               $("title").text().split("|")[0].trim() || 
               domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  
  const logo = $('meta[property="og:image"]').attr("content") || 
               $('link[rel="icon"]').attr("href") || 
               `${domain}/logo.png`;
  
  const description = metadata.metaDescription || 
                      $('meta[name="description"]').attr("content") || 
                      $('meta[property="og:description"]').attr("content") || 
                      textContent.substring(0, 200);

  // Try to extract address/phone from content
  const addressMatch = textContent.match(/(\d+[\s\w]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|way|lane|ln)[\s\w,]+(?:[A-Z]{2}|[A-Za-z\s]+)\s\d{5})/i);
  const phoneMatch = textContent.match(/(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);

  // Extract social links
  const sameAs: string[] = [];
  $('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="instagram.com"], a[href*="linkedin.com"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href && !sameAs.includes(href)) {
      sameAs.push(href);
    }
  });

  if (orgSchema) {
    // Enhance existing schema
    orgSchema.name = orgSchema.name || name;
    orgSchema.url = orgSchema.url || domain;
    orgSchema.logo = orgSchema.logo || (logo.startsWith("http") ? logo : `${domain}${logo.startsWith("/") ? "" : "/"}${logo}`);
    orgSchema.description = orgSchema.description || description;
    if (sameAs.length > 0) orgSchema.sameAs = sameAs;
    return orgSchema;
  }

  // Determine correct schema type
  const lowerText = textContent.toLowerCase();
  let schemaType = "Organization";
  
  if (lowerText.includes("hotel") || lowerText.includes("lodging")) {
    schemaType = "Hotel";
  } else if (lowerText.includes("apartment") && (lowerText.includes("rent") || lowerText.includes("stay"))) {
    schemaType = "Apartment";
  } else if (lowerText.includes("apartment") || lowerText.includes("lodging") || lowerText.includes("accommodation")) {
    schemaType = "LodgingBusiness";
  } else if (lowerText.includes("restaurant") || lowerText.includes("cafe") || lowerText.includes("food")) {
    schemaType = "Restaurant";
  } else if (lowerText.includes("shop") || lowerText.includes("store") || lowerText.includes("retail")) {
    schemaType = "Store";
  } else if (lowerText.includes("service") || lowerText.includes("business") || lowerText.includes("company")) {
    schemaType = "LocalBusiness";
  }

  // Generate new schema
  const schema: any = {
    "@context": "https://schema.org",
    "@type": schemaType,
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

  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  } else {
    schema.sameAs = [];
  }

  // Add amenities for lodging businesses
  if (schemaType === "Hotel" || schemaType === "LodgingBusiness" || schemaType === "Apartment") {
    const amenities: string[] = [];
    if (lowerText.includes("wifi") || lowerText.includes("wi-fi")) amenities.push("WiFi");
    if (lowerText.includes("parking")) amenities.push("Parking");
    if (lowerText.includes("breakfast")) amenities.push("Breakfast");
    if (lowerText.includes("gym") || lowerText.includes("fitness")) amenities.push("Fitness Center");
    if (amenities.length > 0) {
      schema.amenityFeature = amenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity
      }));
    }
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

// --- New Generation Functions ---

function calculateScoreBreakdown(
  textContent: string,
  $: cheerio.CheerioAPI,
  metadata: Metadata,
  technical: TechnicalInput
): {
  contentClarityScore: number;
  schemaScore: number;
  metadataScore: number;
  aiReadabilityScore: number;
  personaAlignmentScore: number;
  overallScore: number;
} {
  // Content Clarity Score (0-100)
  let contentClarityScore = 0;
  const hasTitle = !!metadata.title;
  const hasMetaDesc = !!metadata.metaDescription;
  const hasH1 = $("h1").length > 0;
  const h1Quality = hasH1 && $("h1").first().text().trim().length > 10 ? 1 : 0;
  const hasH2s = $("h2").length >= 3;
  contentClarityScore = (hasTitle ? 25 : 0) + (hasMetaDesc ? 25 : 0) + (hasH1 ? 25 : 0) + (hasH2s ? 25 : 0);

  // Schema Score (0-100)
  let schemaScore = 0;
  if (technical.schema === "OK") schemaScore = 100;
  else if (technical.schema === "Partial") schemaScore = 50;
  else schemaScore = 0;

  // Metadata Score (0-100)
  let metadataScore = 0;
  const hasTitleTag = !!metadata.title;
  const hasMetaDescription = !!metadata.metaDescription;
  const hasOGTags = $('meta[property^="og:"]').length > 0;
  metadataScore = (hasTitleTag ? 40 : 0) + (hasMetaDescription ? 40 : 0) + (hasOGTags ? 20 : 0);

  // AI Readability Score (0-100)
  let aiReadabilityScore = 0;
  const semanticTags = ["article", "main", "nav", "aside", "section"].filter(tag => $(tag).length > 0).length;
  const textToHtmlRatio = textContent.length / ($("html").html()?.length || 1);
  const hasStructuredHeadings = $("h1").length > 0 && $("h2").length >= 2;
  aiReadabilityScore = Math.min(semanticTags * 20, 40) + Math.min(Math.floor(textToHtmlRatio * 100), 30) + (hasStructuredHeadings ? 30 : 0);

  // Persona Alignment Score (0-100)
  let personaAlignmentScore = 0;
  const hasValueProp = /value|benefit|solution|problem|help|serve/i.test(textContent);
  const hasAudience = /for|target|audience|customers|clients/i.test(textContent);
  const hasClearPositioning = /unique|different|best|leading|specialized/i.test(textContent);
  personaAlignmentScore = (hasValueProp ? 35 : 0) + (hasAudience ? 35 : 0) + (hasClearPositioning ? 30 : 0);

  // Overall Score (average)
  const overallScore = Math.round(
    (contentClarityScore + schemaScore + metadataScore + aiReadabilityScore + personaAlignmentScore) / 5
  );

  return {
    contentClarityScore: Math.min(Math.max(contentClarityScore, 0), 100),
    schemaScore: Math.min(Math.max(schemaScore, 0), 100),
    metadataScore: Math.min(Math.max(metadataScore, 0), 100),
    aiReadabilityScore: Math.min(Math.max(aiReadabilityScore, 0), 100),
    personaAlignmentScore: Math.min(Math.max(personaAlignmentScore, 0), 100),
    overallScore: Math.min(Math.max(overallScore, 0), 100)
  };
}

async function generateAIVisibilityInsights(
  openai: OpenAI,
  textContent: string,
  metadata: Metadata
): Promise<{
  aiInterpretation: string;
  valuePropositionClarity: string;
  intentCommunication: string;
  ambiguityDetected: string;
  summarizationEase: string;
}> {
  const prompt = `Analyze this website content for AI visibility:

Title: ${metadata.title || "Not provided"}
Description: ${metadata.metaDescription || "Not provided"}
Content: ${textContent.substring(0, 3000)}

Provide analysis in JSON format with these keys:
- aiInterpretation: How well do AI systems interpret this website? (2-3 sentences)
- valuePropositionClarity: How clear is the value proposition? (2-3 sentences)
- intentCommunication: How effectively does the content communicate user intent? (2-3 sentences)
- ambiguityDetected: What ambiguities or unclear elements exist? (2-3 sentences)
- summarizationEase: How easy is it for AI to summarize this content? (2-3 sentences)

Return ONLY valid JSON, no markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI visibility analyst. Analyze websites and provide insights. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const data = JSON.parse(completion.choices[0].message.content || "{}");
    return {
      aiInterpretation: data.aiInterpretation || "AI systems can interpret this website with moderate clarity.",
      valuePropositionClarity: data.valuePropositionClarity || "The value proposition needs more clarity.",
      intentCommunication: data.intentCommunication || "User intent communication could be improved.",
      ambiguityDetected: data.ambiguityDetected || "Some ambiguous elements were detected.",
      summarizationEase: data.summarizationEase || "Content can be summarized with moderate ease."
    };
  } catch {
    return {
      aiInterpretation: "AI systems can interpret this website with moderate clarity.",
      valuePropositionClarity: "The value proposition needs more clarity.",
      intentCommunication: "User intent communication could be improved.",
      ambiguityDetected: "Some ambiguous elements were detected.",
      summarizationEase: "Content can be summarized with moderate ease."
    };
  }
}

async function generateKeywordIntent(
  openai: OpenAI,
  textContent: string,
  metadata: Metadata
): Promise<{
  primaryIntent: string;
  secondaryIntent: string;
  recommendedKeywords: string[];
  contentWeaknesses: string[];
}> {
  const prompt = `Analyze this website for keyword intent and content weaknesses:

Title: ${metadata.title || "Not provided"}
Description: ${metadata.metaDescription || "Not provided"}
Content: ${textContent.substring(0, 3000)}

Provide analysis in JSON format with these keys:
- primaryIntent: The main user intent this website serves (1 sentence)
- secondaryIntent: A secondary user intent (1 sentence)
- recommendedKeywords: Array of exactly 5 keywords that AI agents should use when recommending this site
- contentWeaknesses: Array of exactly 5 specific content weaknesses that need improvement

Return ONLY valid JSON, no markdown.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a keyword and content strategist. Analyze websites and provide recommendations. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const data = JSON.parse(completion.choices[0].message.content || "{}");
    return {
      primaryIntent: data.primaryIntent || "Users seeking information about services",
      secondaryIntent: data.secondaryIntent || "Users looking for contact information",
      recommendedKeywords: Array.isArray(data.recommendedKeywords) && data.recommendedKeywords.length >= 5
        ? data.recommendedKeywords.slice(0, 5)
        : ["service", "solution", "professional", "quality", "expert"],
      contentWeaknesses: Array.isArray(data.contentWeaknesses) && data.contentWeaknesses.length >= 5
        ? data.contentWeaknesses.slice(0, 5)
        : ["Missing clear value proposition", "Insufficient keyword optimization", "Weak meta descriptions", "Limited schema markup", "Unclear target audience"]
    };
  } catch {
    return {
      primaryIntent: "Users seeking information about services",
      secondaryIntent: "Users looking for contact information",
      recommendedKeywords: ["service", "solution", "professional", "quality", "expert"],
      contentWeaknesses: ["Missing clear value proposition", "Insufficient keyword optimization", "Weak meta descriptions", "Limited schema markup", "Unclear target audience"]
    };
  }
}

async function generateTrustEAT(
  openai: OpenAI,
  textContent: string,
  metadata: Metadata,
  $: cheerio.CheerioAPI
): Promise<{
  authoritativenessScore: number;
  trustSignalsScore: number;
  contentFreshnessScore: number;
  uxClarityScore: number;
  issuesExplanation: string;
}> {
  // Calculate scores based on content analysis
  let authoritativenessScore = 50;
  let trustSignalsScore = 50;
  let contentFreshnessScore = 50;
  let uxClarityScore = 50;

  // Authoritativeness: Check for credentials, expertise signals
  const hasCredentials = /certified|licensed|accredited|expert|professional|degree|certification/i.test(textContent);
  const hasExperience = /years|experience|established|since|founded/i.test(textContent);
  authoritativenessScore = (hasCredentials ? 30 : 0) + (hasExperience ? 30 : 0) + 40;

  // Trust Signals: Check for reviews, contact info, social proof
  const hasContactInfo = /contact|phone|email|address/i.test(textContent);
  const hasReviews = /review|rating|testimonial|client|customer/i.test(textContent);
  const hasSocialLinks = $('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"]').length > 0;
  trustSignalsScore = (hasContactInfo ? 35 : 0) + (hasReviews ? 35 : 0) + (hasSocialLinks ? 30 : 0);

  // Content Freshness: Check for dates, updates
  const hasDates = /\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|updated|recent|new|latest/i.test(textContent);
  contentFreshnessScore = hasDates ? 70 : 30;

  // UX Clarity: Check for clear navigation, structure
  const hasNav = $("nav").length > 0;
  const hasFooter = $("footer").length > 0;
  const hasClearHeadings = $("h1").length > 0 && $("h2").length >= 2;
  uxClarityScore = (hasNav ? 30 : 0) + (hasFooter ? 20 : 0) + (hasClearHeadings ? 50 : 0);

  const prompt = `Analyze this website for E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness):

Content: ${textContent.substring(0, 2000)}

Provide a paragraph (3-4 sentences) explaining the main trust and E-E-A-T issues and recommendations.
Return ONLY the paragraph text, no JSON, no markdown, no quotes.`;

  let issuesExplanation = "";
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a trust and E-E-A-T analyst. Analyze websites and provide recommendations. Return only the paragraph text." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });
    issuesExplanation = completion.choices[0].message.content?.trim() || "";
  } catch {
    issuesExplanation = "The website shows moderate trust signals. Consider adding more credentials, testimonials, and clear contact information to improve E-E-A-T scores.";
  }

  if (!issuesExplanation) {
    issuesExplanation = "The website shows moderate trust signals. Consider adding more credentials, testimonials, and clear contact information to improve E-E-A-T scores.";
  }

  return {
    authoritativenessScore: Math.min(Math.max(authoritativenessScore, 0), 100),
    trustSignalsScore: Math.min(Math.max(trustSignalsScore, 0), 100),
    contentFreshnessScore: Math.min(Math.max(contentFreshnessScore, 0), 100),
    uxClarityScore: Math.min(Math.max(uxClarityScore, 0), 100),
    issuesExplanation
  };
}

function generateQuickWins(
  textContent: string,
  $: cheerio.CheerioAPI,
  metadata: Metadata,
  technical: TechnicalInput
): Array<{
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}> {
  const quickWins: Array<{ title: string; description: string; priority: 'high' | 'medium' | 'low' }> = [];

  // High Priority
  if (!metadata.metaDescription) {
    quickWins.push({
      title: "Add Meta Description",
      description: "Create a compelling 150-160 character meta description that clearly communicates your value proposition.",
      priority: "high"
    });
  }

  if (technical.schema === "Missing") {
    quickWins.push({
      title: "Add FAQ Schema",
      description: "Implement FAQPage schema markup to help AI systems understand your frequently asked questions.",
      priority: "high"
    });
  }

  if ($("h1").length === 0 || $("h1").first().text().trim().length < 10) {
    quickWins.push({
      title: "Strengthen H1 Tag",
      description: "Ensure you have a clear, descriptive H1 tag that communicates your main value proposition.",
      priority: "high"
    });
  }

  // Medium Priority
  if ($("h2").length < 3) {
    quickWins.push({
      title: "Add More H2 Headings",
      description: "Add at least 3-5 H2 headings to create better content structure and hierarchy.",
      priority: "medium"
    });
  }

  if ($('img[alt=""]').length > 0 || $('img:not([alt])').length > 0) {
    quickWins.push({
      title: "Improve Image ALT Tags",
      description: "Add descriptive ALT text to all images to improve accessibility and AI understanding.",
      priority: "medium"
    });
  }

  if (technical.sitemap === "Missing") {
    quickWins.push({
      title: "Add Sitemap.xml",
      description: "Create and submit a sitemap.xml file to help search engines and AI crawlers discover all your pages.",
      priority: "medium"
    });
  }

  if ($('a[href^="/"]').length < 5) {
    quickWins.push({
      title: "Add Internal Links",
      description: "Add more internal links between related pages to improve site structure and navigation.",
      priority: "medium"
    });
  }

  // Low Priority
  if (!metadata.title || metadata.title.length < 30) {
    quickWins.push({
      title: "Optimize Page Title",
      description: "Ensure your page title is 50-60 characters and includes your primary keyword.",
      priority: "low"
    });
  }

  if ($('meta[property^="og:"]').length === 0) {
    quickWins.push({
      title: "Add Open Graph Tags",
      description: "Add Open Graph meta tags for better social media sharing and AI understanding.",
      priority: "low"
    });
  }

  if ($('a[href*="about"]').length === 0) {
    quickWins.push({
      title: "Improve About Page",
      description: "Create or enhance your About page with clear information about your expertise and credentials.",
      priority: "low"
    });
  }

  // Ensure we have exactly 10 items
  while (quickWins.length < 10) {
    quickWins.push({
      title: "Review Content Quality",
      description: "Regularly review and update your content to ensure it remains fresh and relevant.",
      priority: "low"
    });
  }

  return quickWins.slice(0, 10);
}

// --- Score Calculation ---

async function calculateScore(
  textContent: string,
  $: cheerio.CheerioAPI,
  metadata: Metadata,
  technical: TechnicalInput
): Promise<number> {
  let score = 0;

  // Clarity (0-15 points)
  const hasTitle = !!metadata.title;
  const hasMetaDesc = !!metadata.metaDescription;
  const hasH1 = $("h1").length > 0;
  score += (hasTitle ? 5 : 0) + (hasMetaDesc ? 5 : 0) + (hasH1 ? 5 : 0);

  // Structure (0-15 points)
  const semanticTags = ["article", "main", "nav", "aside", "section"].filter(tag => $(tag).length > 0).length;
  const h2Count = $("h2").length;
  score += Math.min(semanticTags * 3, 9) + Math.min(Math.floor(h2Count / 2) * 2, 6);

  // Schema (0-15 points)
  if (technical.schema === "OK") score += 15;
  else if (technical.schema === "Partial") score += 8;
  else score += 0;

  // Persona Specificity (0-15 points)
  const textLength = textContent.length;
  const hasValueProp = /value|benefit|solution|problem|help|serve/i.test(textContent);
  const hasAudience = /for|target|audience|customers|clients/i.test(textContent);
  score += (hasValueProp ? 7 : 0) + (hasAudience ? 8 : 0);

  // Content Quality (0-15 points)
  const wordCount = textContent.split(/\s+/).length;
  score += Math.min(Math.floor(wordCount / 100), 15);

  // Technical Readiness (0-15 points)
  let techScore = 0;
  if (technical.robots === "OK") techScore += 3;
  else if (technical.robots === "Warning") techScore += 1;
  if (technical.sitemap === "OK") techScore += 3;
  else if (technical.sitemap === "Warning") techScore += 1;
  if (technical.security === "HTTPS") techScore += 3;
  if (technical.mobile === "Good") techScore += 3;
  if (technical.performance !== null && technical.performance >= 80) techScore += 3;
  else if (technical.performance !== null && technical.performance >= 60) techScore += 1;
  score += techScore;

  // Text Richness (0-10 points)
  const textToHtmlRatio = textContent.length / ($("html").html()?.length || 1);
  score += Math.min(Math.floor(textToHtmlRatio * 50), 10);

  return Math.min(Math.max(score, 0), 100);
}

// --- Technical Field Formatting ---

function formatRobotsStatus(status: "OK" | "Missing" | "Blocked" | "Warning"): string {
  switch (status) {
    case "OK": return "Configured correctly";
    case "Blocked": return "AI bots blocked";
    case "Warning": return "Needs attention";
    case "Missing": return "Not found";
    default: return "Unknown";
  }
}

function formatSitemapStatus(status: "OK" | "Missing" | "Warning"): string {
  switch (status) {
    case "OK": return "Present at /sitemap.xml";
    case "Warning": return "Needs attention";
    case "Missing": return "Not found";
    default: return "Unknown";
  }
}

function formatSchemaStatus(status: "OK" | "Partial" | "Missing"): string {
  switch (status) {
    case "OK": return "Detected";
    case "Partial": return "Partial schema";
    case "Missing": return "No schema detected";
    default: return "Unknown";
  }
}

function formatPerformanceStatus(score: number | null): string {
  if (score === null) return "Unknown";
  if (score >= 80) return `Good - ${score}/100`;
  if (score >= 60) return `Moderate - ${score}/100`;
  return `Needs improvement - ${score}/100`;
}

function formatMobileStatus(status: "Good" | "Poor" | "Unknown"): string {
  switch (status) {
    case "Good": return "Responsive design";
    case "Poor": return "Not mobile-friendly";
    case "Unknown": return "Unknown";
    default: return "Unknown";
  }
}

function formatSecurityStatus(status: "HTTPS" | "Missing"): string {
  switch (status) {
    case "HTTPS": return "HTTPS enabled";
    case "Missing": return "HTTP only";
    default: return "Unknown";
  }
}

// --- Fallback ---

function generateFallbackReportData(
  domain: string,
  technical: any
): ReportData {
  return {
    domain,
    score: 50,
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
      "url": domain,
      "sameAs": []
    },
    recommendedContentBlock: "We provide exceptional services tailored to your needs. Our team is dedicated to delivering results that exceed expectations.",
    technical,
    scoreBreakdown: {
      contentClarityScore: 50,
      schemaScore: 50,
      metadataScore: 50,
      aiReadabilityScore: 50,
      personaAlignmentScore: 50,
      overallScore: 50
    },
    aiVisibilityInsights: {
      aiInterpretation: "AI systems can interpret this website with moderate clarity.",
      valuePropositionClarity: "The value proposition needs more clarity.",
      intentCommunication: "User intent communication could be improved.",
      ambiguityDetected: "Some ambiguous elements were detected.",
      summarizationEase: "Content can be summarized with moderate ease."
    },
    keywordIntent: {
      primaryIntent: "Users seeking information about services",
      secondaryIntent: "Users looking for contact information",
      recommendedKeywords: ["service", "solution", "professional", "quality", "expert"],
      contentWeaknesses: ["Missing clear value proposition", "Insufficient keyword optimization", "Weak meta descriptions", "Limited schema markup", "Unclear target audience"]
    },
    trustEAT: {
      authoritativenessScore: 50,
      trustSignalsScore: 50,
      contentFreshnessScore: 50,
      uxClarityScore: 50,
      issuesExplanation: "The website shows moderate trust signals. Consider adding more credentials, testimonials, and clear contact information to improve E-E-A-T scores."
    },
    quickWins: [
      { title: "Add Meta Description", description: "Create a compelling 150-160 character meta description.", priority: "high" },
      { title: "Add FAQ Schema", description: "Implement FAQPage schema markup.", priority: "high" },
      { title: "Strengthen H1 Tag", description: "Ensure you have a clear, descriptive H1 tag.", priority: "high" },
      { title: "Add More H2 Headings", description: "Add at least 3-5 H2 headings.", priority: "medium" },
      { title: "Improve Image ALT Tags", description: "Add descriptive ALT text to all images.", priority: "medium" },
      { title: "Add Sitemap.xml", description: "Create and submit a sitemap.xml file.", priority: "medium" },
      { title: "Add Internal Links", description: "Add more internal links between related pages.", priority: "medium" },
      { title: "Optimize Page Title", description: "Ensure your page title is 50-60 characters.", priority: "low" },
      { title: "Add Open Graph Tags", description: "Add Open Graph meta tags.", priority: "low" },
      { title: "Improve About Page", description: "Create or enhance your About page.", priority: "low" }
    ]
  };
}
