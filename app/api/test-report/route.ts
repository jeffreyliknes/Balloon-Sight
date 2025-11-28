import { NextResponse } from "next/server";
import { generatePdf } from "@/lib/pdf";
import { generateFullReport } from "@/lib/reportTemplate";
import { generateReportData } from "@/lib/generateReportData";
import { analyzeHtml } from "@/actions/analyze-url";
import { getBaseUrl } from "@/lib/utils";
import * as cheerio from "cheerio";

/**
 * Development-only route for testing PDF generation locally
 * ⚠️ This route should be disabled or protected in production
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain") || "example.com";
  const debug = searchParams.get("debug") === "true"; // Add ?debug=true to see JSON

  try {
    console.log("🧪 [test-report] Starting test for domain:", domain);
    
    // Scrape the website
    const domainUrl = domain.startsWith('http') ? domain : `https://${domain}`;
    const baseUrl = getBaseUrl();
    const scrapeUrl = `${baseUrl}/api/scrape?url=${encodeURIComponent(domainUrl)}`;
    
    console.log("🧪 [test-report] Fetching from:", scrapeUrl);
    const scrapeRes = await fetch(scrapeUrl);
    if (!scrapeRes.ok) {
      const errorData = await scrapeRes.json().catch(() => ({ error: scrapeRes.statusText }));
      throw new Error(`Failed to scrape: ${errorData.error || scrapeRes.statusText}`);
    }
    
    const scrapeData = await scrapeRes.json();
    const htmlContent = scrapeData.html;
    const responseTime = scrapeData.time || 0;
    
    console.log("🧪 [test-report] Scraped HTML length:", htmlContent.length);
    
    // Extract text content
    const $ = cheerio.load(htmlContent);
    const textContent = $("body").text().replace(/\s+/g, " ").trim();
    
    console.log("🧪 [test-report] Text content length:", textContent.length);
    console.log("🧪 [test-report] Text preview:", textContent.substring(0, 200));
    
    // Extract metadata
    const metadata = {
      title: $("title").text().trim() || $('meta[property="og:title"]').attr("content") || null,
      metaDescription: $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || null,
      jsonLd: (() => {
        const schemas: any[] = [];
        $('script[type="application/ld+json"]').each((_, el) => {
          try {
            const content = $(el).html();
            if (content) schemas.push(JSON.parse(content));
          } catch {}
        });
        return schemas.length > 0 ? schemas : null;
      })()
    };
    
    console.log("🧪 [test-report] Metadata extracted:", {
      title: metadata.title?.substring(0, 50),
      metaDescription: metadata.metaDescription?.substring(0, 50),
      jsonLdCount: metadata.jsonLd?.length || 0
    });
    
    // Run technical analysis
    console.log("🧪 [test-report] Running technical analysis...");
    const analysisResult = await analyzeHtml(htmlContent, domain, responseTime);
    const urlObj = new URL(domain.startsWith("http") ? domain : `https://${domain}`);
    
    // Determine robots status
    let robotsStatus: "OK" | "Missing" | "Blocked" | "Warning" = "Missing";
    const robotsCheck = analysisResult.categories?.accessibility?.checks?.find((c: any) => c.id === "robots-txt");
    if (robotsCheck) {
      if (robotsCheck.status === "pass") robotsStatus = "OK";
      else if (robotsCheck.status === "warning") robotsStatus = "Warning";
      else robotsStatus = "Blocked";
    }
    
    // Check sitemap
    let sitemapStatus: "OK" | "Missing" | "Warning" = "Missing";
    try {
      const sitemapUrl = `${urlObj.origin}/sitemap.xml`;
      const sitemapRes = await fetch(sitemapUrl, { signal: AbortSignal.timeout(5000) });
      if (sitemapRes.ok) sitemapStatus = "OK";
    } catch {}
    
    // Determine schema status
    let schemaStatus: "OK" | "Partial" | "Missing" = "Missing";
    if (metadata.jsonLd && metadata.jsonLd.length > 0) {
      const hasKeySchemas = metadata.jsonLd.some((s: any) => 
        ["Organization", "LocalBusiness", "Hotel", "LodgingBusiness", "Product", "Article", "FAQPage"].includes(s["@type"])
      );
      schemaStatus = hasKeySchemas ? "OK" : "Partial";
    }
    
    // Get performance score
    const performanceScore = analysisResult.categories?.accessibility?.score || null;
    
    // Check mobile
    const viewport = $('meta[name="viewport"]').attr("content");
    const mobileStatus: "Good" | "Poor" | "Unknown" = viewport ? "Good" : "Unknown";
    
    // Check security
    const securityStatus: "HTTPS" | "Missing" = urlObj.protocol === "https:" ? "HTTPS" : "Missing";
    
    // Compile technical data
    const technical = {
      robots: robotsStatus,
      sitemap: sitemapStatus,
      schema: schemaStatus,
      performance: performanceScore,
      mobile: mobileStatus,
      security: securityStatus
    };
    
    console.log("🧪 [test-report] Technical data:", technical);
    console.log("🧪 [test-report] Calling generateReportData...");
    
    // Generate complete ReportData with AI-powered content
    const reportData = await generateReportData(domain, htmlContent, textContent, metadata, technical);
    
    console.log("🧪 [test-report] Report data generated:", {
      score: reportData.score,
      persona: reportData.persona?.recommendedAudience?.substring(0, 50),
      h1: reportData.contentPack?.h1?.substring(0, 50)
    });
    
    // If debug mode, return JSON instead of PDF
    if (debug) {
      return NextResponse.json({
        success: true,
        domain,
        reportData,
        metadata,
        technical,
        textContentPreview: textContent.substring(0, 500)
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    
    // Generate PDF
    console.log("🧪 [test-report] Generating PDF...");
    const html = generateFullReport(domain, reportData);
    const pdfBuffer = await generatePdf(html);
    
    console.log("🧪 [test-report] PDF generated successfully!");
    
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="balloonsight-report-${domain.replace(/[^a-z0-9]/gi, '-')}.pdf"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("❌ [test-report] Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate test PDF report", 
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
