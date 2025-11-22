"use server";

import OpenAI from "openai";
import * as cheerio from "cheerio";
import { AnalysisResult, CategoryResult, CheckResult } from "@/lib/types";

export async function analyzeHtml(inputHtml: string, inputUrl: string, responseTime: number = 0): Promise<AnalysisResult> {
  // Ensure URL has protocol
  const url = inputUrl.startsWith("http") ? inputUrl : `https://${inputUrl}`;
  const urlObj = new URL(url);

  const $ = cheerio.load(inputHtml);

  // 1. Accessibility Checks
  // We pass responseTime from the client/API route if available
  const accessibilityChecks = await runAccessibilityChecks(urlObj, responseTime);

  // 2. Structured Data Checks
  const structuredDataChecks = runStructuredDataChecks($);

  // 3. Semantic Structure Checks
  const semanticChecks = runSemanticChecks($);

  // 4. Content & Persona Checks
  const contentChecks = runContentChecks($);

  // Calculate Scores
  const accessibilityScore = calculateCategoryScore(accessibilityChecks);
  const structuredDataScore = calculateCategoryScore(structuredDataChecks);
  const semanticScore = calculateCategoryScore(semanticChecks);
  const contentScore = calculateCategoryScore(contentChecks);

  const overallScore = Math.round(
    (accessibilityScore + structuredDataScore + semanticScore + contentScore) / 4
  );

  // Determine Persona (Heuristic or AI)
  const persona = await determinePersona($, $("body").text().substring(0, 1500));

  return {
    score: overallScore,
    url: url,
    persona: persona,
    categories: {
      accessibility: {
        score: accessibilityScore,
        status: getStatus(accessibilityScore),
        checks: accessibilityChecks,
      },
      structuredData: {
        score: structuredDataScore,
        status: getStatus(structuredDataScore),
        checks: structuredDataChecks,
      },
      semanticStructure: {
        score: semanticScore,
        status: getStatus(semanticScore),
        checks: semanticChecks,
      },
      contentPersona: {
        score: contentScore,
        status: getStatus(contentScore),
        checks: contentChecks,
      },
    },
    rawJsonLd: extractJsonLd($),
  };
}

// --- Check Implementations ---

async function runAccessibilityChecks(
  url: URL,
  responseTime: number
): Promise<CheckResult[]> {
  const checks: CheckResult[] = [];

  // Robots.txt Check
  let robotsBlocked = false;
  try {
    // This fetch happens on the server (in the Server Action), so it's safe from CORS issues.
    // The main HTML is now fetched via /api/scrape, but robots.txt is still a separate asset.
    const robotsUrl = `${url.origin}/robots.txt`;
    const robotsRes = await fetch(robotsUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (compatible; BalloonSight/1.0; +http://example.com/bot)",
        },
        // We can also set a short timeout for robots.txt
        signal: AbortSignal.timeout(5000) 
    });
    
    if (robotsRes.ok) {
      const robotsTxt = await robotsRes.text();
      // Simple check for AI bots
      const blockedAgents = ["GPTBot", "CCBot", "Google-Extended"];
      const disallowed = blockedAgents.filter((agent) =>
        new RegExp(`User-agent:\\s*${agent}[\\s\\S]*?Disallow:\\s*/`, "i").test(robotsTxt)
      );

      if (disallowed.length > 0) {
        robotsBlocked = true;
        checks.push({
          id: "robots-txt",
          label: "Robots.txt Permissions",
          status: "fail",
          message: `Blocked AI bots found: ${disallowed.join(", ")}`,
          fix: "Remove 'Disallow' rules for GPTBot, CCBot, and Google-Extended in robots.txt.",
        });
      } else {
        checks.push({
          id: "robots-txt",
          label: "Robots.txt Permissions",
          status: "pass",
          message: "AI bots are allowed.",
        });
      }
    } else {
        // If no robots.txt, it's generally open, so pass
         checks.push({
          id: "robots-txt",
          label: "Robots.txt Permissions",
          status: "pass",
          message: "No robots.txt found (assumed open).",
        });
    }
  } catch (e) {
      checks.push({
          id: "robots-txt",
          label: "Robots.txt Permissions",
          status: "warning",
          message: "Could not fetch robots.txt.",
        });
  }

  // Response Time (Passed from the scrape)
  if (responseTime > 0) {
      if (responseTime < 800) {
        checks.push({
          id: "ttb",
          label: "Time to First Byte",
          status: "pass",
          message: `Fast response: ${responseTime}ms`,
        });
      } else if (responseTime < 2000) {
        checks.push({
          id: "ttb",
          label: "Time to First Byte",
          status: "warning",
          message: `Moderate response: ${responseTime}ms`,
          fix: "Optimize server response time or use caching.",
        });
      } else {
        checks.push({
          id: "ttb",
          label: "Time to First Byte",
          status: "fail",
          message: `Slow response: ${responseTime}ms`,
          fix: "Reduce server load or implement a CDN.",
        });
      }
  }

  return checks;
}

function runStructuredDataChecks($: cheerio.CheerioAPI): CheckResult[] {
  const checks: CheckResult[] = [];
  const jsonLdScripts = $('script[type="application/ld+json"]');

  if (jsonLdScripts.length > 0) {
    checks.push({
      id: "json-ld",
      label: "JSON-LD Presence",
      status: "pass",
      message: `Found ${jsonLdScripts.length} JSON-LD scripts.`,
    });

    let foundKeySchemas = false;
    jsonLdScripts.each((_, el) => {
        try {
            const data = JSON.parse($(el).html() || "{}");
            const type = data["@type"];
            if (["Organization", "Product", "Article", "FAQPage"].includes(type)) {
                foundKeySchemas = true;
            }
        } catch(e) {}
    });

    if(foundKeySchemas) {
        checks.push({
            id: "schema-types",
            label: "Key Schema Types",
            status: "pass",
            message: "Found Organization, Product, Article, or FAQPage schema.",
        });
    } else {
         checks.push({
            id: "schema-types",
            label: "Key Schema Types",
            status: "warning",
            message: "No high-value schemas (Product, Article, etc.) found.",
            fix: "Add structured data for your specific content type.",
        });
    }

  } else {
    checks.push({
      id: "json-ld",
      label: "JSON-LD Presence",
      status: "fail",
      message: "No JSON-LD structured data found.",
      fix: "Add <script type='application/ld+json'> tags with schema.org data.",
    });
  }

  // Meta Tags
  const ogTitle = $('meta[property="og:title"]').attr("content");
  if (ogTitle) {
    checks.push({
      id: "meta-og",
      label: "Open Graph Tags",
      status: "pass",
      message: "Open Graph tags detected.",
    });
  } else {
    checks.push({
      id: "meta-og",
      label: "Open Graph Tags",
      status: "warning",
      message: "Missing Open Graph tags.",
      fix: "Add og:title, og:description, and og:image tags.",
    });
  }

  return checks;
}

function runSemanticChecks($: cheerio.CheerioAPI): CheckResult[] {
  const checks: CheckResult[] = [];

  // HTML5 Semantic Tags
  const semanticTags = ["article", "main", "nav", "aside"];
  const foundTags = semanticTags.filter((tag) => $(tag).length > 0);

  if (foundTags.length >= 3) {
    checks.push({
      id: "semantic-tags",
      label: "HTML5 Semantic Tags",
      status: "pass",
      message: `Good use of semantic tags (${foundTags.join(", ")}).`,
    });
  } else {
    checks.push({
      id: "semantic-tags",
      label: "HTML5 Semantic Tags",
      status: "warning",
      message: `Few semantic tags found (only ${foundTags.join(", ") || "none"}).`,
      fix: "Wrap content in <main>, <article>, <nav>, etc.",
    });
  }

  // Heading Hierarchy
  const h1Count = $("h1").length;
  if (h1Count === 1) {
    checks.push({
      id: "h1-check",
      label: "H1 Tag Presence",
      status: "pass",
      message: "Exactly one H1 tag found.",
    });
  } else if (h1Count === 0) {
    checks.push({
      id: "h1-check",
      label: "H1 Tag Presence",
      status: "fail",
      message: "No H1 tag found.",
      fix: "Add a single H1 tag representing the page title.",
    });
  } else {
    checks.push({
      id: "h1-check",
      label: "H1 Tag Presence",
      status: "warning",
      message: "Multiple H1 tags found.",
      fix: "Ensure only one H1 exists per page for clear hierarchy.",
    });
  }

  return checks;
}

function runContentChecks($: cheerio.CheerioAPI): CheckResult[] {
  const checks: CheckResult[] = [];
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const htmlLength = $("html").html()?.length || 0;
  const textLength = bodyText.length;
  
  // Text to HTML Ratio
  const ratio = htmlLength > 0 ? textLength / htmlLength : 0;
  
  if (ratio > 0.10) { // arbitrary threshold check
     checks.push({
      id: "text-ratio",
      label: "Text-to-HTML Ratio",
      status: "pass",
      message: `Good text density (${(ratio * 100).toFixed(1)}%).`,
    });
  } else {
     checks.push({
      id: "text-ratio",
      label: "Text-to-HTML Ratio",
      status: "warning",
      message: `Low text density (${(ratio * 100).toFixed(1)}%).`,
      fix: "Reduce code bloat or increase text content.",
    });
  }

  // Freshness (very basic check)
  const dateRegex = /\b\d{4}-\d{2}-\d{2}\b|\b(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2},\s\d{4}\b/;
  if (dateRegex.test(bodyText)) {
      checks.push({
      id: "date-check",
      label: "Content Freshness",
      status: "pass",
      message: "Dates detected in content.",
    });
  } else {
       checks.push({
      id: "date-check",
      label: "Content Freshness",
      status: "warning",
      message: "No dates detected.",
      fix: "Include publication or modified dates for timeliness.",
    });
  }

  return checks;
}


// --- Helpers ---

function calculateCategoryScore(checks: CheckResult[]): number {
  if (checks.length === 0) return 0;
  let total = 0;
  checks.forEach((c) => {
    if (c.status === "pass") total += 100;
    else if (c.status === "warning") total += 50;
    else total += 0;
  });
  return Math.round(total / checks.length);
}

function getStatus(score: number): "pass" | "fail" | "warning" {
  if (score >= 80) return "pass";
  if (score >= 50) return "warning";
  return "fail";
}

async function determinePersona($: cheerio.CheerioAPI, sampleText: string): Promise<{ archetype: string; description: string }> {
  const apiKey = process.env.OPENAI_API_KEY;

  // 1. IF API KEY exists, use OpenAI
  if (apiKey) {
      try {
          const openai = new OpenAI({ apiKey });
          const completion = await openai.chat.completions.create({
              messages: [
                  { role: "system", content: "You are an expert brand strategist. Analyze the provided website text. Identify the 'Brand Archetype' (e.g. The Sage, The Explorer, The Jester). Provide the archetype name and a 1-sentence description of their tone. Format: Archetype Name|Description" },
                  { role: "user", content: sampleText.substring(0, 2000) }
              ],
              model: "gpt-3.5-turbo",
          });

          const content = completion.choices[0].message.content || "";
          const parts = content.split("|");
          if (parts.length === 2) {
              return { archetype: parts[0].trim(), description: parts[1].trim() };
          }
      } catch (e) {
          console.error("OpenAI API Failed:", e);
          // Fallback to heuristic on error
      }
  }

  // 2. Fallback Heuristic (if no key or error)
  const text = $("main").text().toLowerCase();
  
  if (text.includes("documentation") || text.includes("api") || text.includes("install")) {
      return { archetype: "The Technician", description: "Technical, precise, and instructional. Focuses on 'how-to'." };
  }
  if (text.includes("buy") || text.includes("price") || text.includes("shop") || text.includes("cart")) {
      return { archetype: "The Merchant", description: "Transactional, product-focused. Focuses on value and conversion." };
  }
  if (text.includes("research") || text.includes("study") || text.includes("analysis") || text.includes("report")) {
      return { archetype: "The Expert", description: "Authoritative, data-driven, and detailed. Focuses on credibility." };
  }
  
  return { archetype: "The Generalist", description: "Balanced mix of information and engagement. Adapts to a broad audience." };
}

function extractJsonLd($: cheerio.CheerioAPI): any[] {
  const data: any[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html();
      if (content) data.push(JSON.parse(content));
    } catch (e) {}
  });
  return data;
}

function createErrorResult(url: string, message: string): AnalysisResult {
    return {
        score: 0,
        url,
        persona: { archetype: "Unknown", description: "Could not analyze." },
        categories: {
            accessibility: { score: 0, status: "fail", checks: [{ id: "error", label: "Error", status: "fail", message }] },
            structuredData: { score: 0, status: "fail", checks: [] },
            semanticStructure: { score: 0, status: "fail", checks: [] },
            contentPersona: { score: 0, status: "fail", checks: [] },
        }
    }
}
