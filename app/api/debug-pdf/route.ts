import { NextResponse } from "next/server";
import { generateReportData } from "@/lib/generateReportData";
import { generateFullReport } from "@/lib/reportTemplate";
import { generatePdf } from "@/lib/pdf";
import { analyzeHtml } from "@/actions/analyze-url";
import { getBaseUrl } from "@/lib/utils";
import * as cheerio from "cheerio";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url") || "https://www.tokemping.hu/en";

    console.log("🔍 [debug-pdf] Starting PDF generation for URL:", url);

    // Scrape the website
    const domainUrl = url.startsWith('http') ? url : `https://${url}`;
    const baseUrl = getBaseUrl();
    const scrapeUrl = `${baseUrl}/api/scrape?url=${encodeURIComponent(domainUrl)}`;
    
    console.log("🔍 [debug-pdf] Fetching from:", scrapeUrl);
    const scrapeRes = await fetch(scrapeUrl);
    if (!scrapeRes.ok) {
      const errorData = await scrapeRes.json().catch(() => ({ error: scrapeRes.statusText }));
      throw new Error(`Failed to scrape: ${errorData.error || scrapeRes.statusText}`);
    }
    
    const scrapeData = await scrapeRes.json();
    const htmlContent = scrapeData.html;
    const responseTime = scrapeData.time || 0;
    
    if (!htmlContent) {
      throw new Error("No HTML content retrieved from website");
    }
    
    console.log("🔍 [debug-pdf] Scraped HTML length:", htmlContent.length);

    // Extract text content
    const $ = cheerio.load(htmlContent);
    const textContent = $("body").text().replace(/\s+/g, " ").trim();
    
    console.log("🔍 [debug-pdf] Text content length:", textContent.length);

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
    
    console.log("🔍 [debug-pdf] Metadata extracted:", {
      title: metadata.title?.substring(0, 50),
      metaDescription: metadata.metaDescription?.substring(0, 50),
      jsonLdCount: metadata.jsonLd?.length || 0
    });

    // Run technical analysis
    console.log("🔍 [debug-pdf] Running technical analysis...");
    const analysisResult = await analyzeHtml(htmlContent, domainUrl, responseTime);
    const urlObj = new URL(domainUrl);
    
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
    
    console.log("🔍 [debug-pdf] Technical data:", technical);
    console.log("🔍 [debug-pdf] Calling generateReportData...");
    
    // Generate complete ReportData with AI-powered content
    const reportData = await generateReportData(domainUrl, htmlContent, textContent, metadata, technical);
    
    console.log("🔍 [debug-pdf] Report data generated:", {
      score: reportData.score,
      persona: reportData.persona?.recommendedAudience?.substring(0, 50),
      h1: reportData.contentPack?.h1?.substring(0, 50)
    });

    // Generate PDF
    console.log("🔍 [debug-pdf] Generating PDF...");
    const html = generateFullReport(domainUrl, reportData);
    const pdfBuffer = await generatePdf(html);
    
    console.log("✅ [debug-pdf] PDF generated successfully!");

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="debug-report.pdf"',
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("❌ [debug-pdf] Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate PDF",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

