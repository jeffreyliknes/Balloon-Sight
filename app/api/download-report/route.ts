import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { generatePdf } from "@/lib/pdf";
import { generateFullReport } from "@/lib/reportTemplate";
import { generateReportData } from "@/lib/generateReportData";
import { analyzeHtml } from "@/actions/analyze-url";
import * as cheerio from "cheerio";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Verify payment session with Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (error: any) {
      console.error("Error retrieving Stripe session:", error);
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 400 }
      );
    }

    // Verify payment was completed
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 402 }
      );
    }

    // Extract domain from client_reference_id (Payment Links) or metadata (Checkout API)
    const domain = (session as any).client_reference_id || session.metadata?.domain;

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found in session" },
        { status: 400 }
      );
    }

    console.log("📥 Generating PDF for download - Session:", sessionId, "Domain:", domain);

    // 1. Run Full Analysis (Deep Scan) - same logic as webhook
    const domainUrl = domain.startsWith('http') ? domain : `https://${domain}`;
    // Construct the full URL for the internal API call
    // In production (Vercel), use VERCEL_URL or production URL (never localhost)
    // In local development, use localhost
    let baseUrl: string;
    if (process.env.VERCEL_URL) {
      // Production: use Vercel URL
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes('localhost')) {
      // Production: use explicit production URL (if set and not localhost)
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    } else {
      // Local development: use localhost
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    }
    const scrapeUrl = `${baseUrl}/api/scrape?url=${encodeURIComponent(domainUrl)}`;
    
    let scrapeRes;
    try {
      scrapeRes = await fetch(scrapeUrl, { 
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });
    } catch (error: any) {
      if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        throw new Error("Request timed out while fetching website data. Please try again or check your email.");
      }
      throw new Error(`Failed to connect to scraping service: ${error.message}`);
    }
    
    if (!scrapeRes.ok) {
      const errorData = await scrapeRes.json().catch(() => ({ error: scrapeRes.statusText }));
      throw new Error(`Failed to fetch website data: ${errorData.error || scrapeRes.statusText}`);
    }
    
    let scrapeData;
    try {
      scrapeData = await scrapeRes.json();
    } catch (error: any) {
      throw new Error("Invalid response from scraping service. Please try again.");
    }
    
    const htmlContent = scrapeData.html;
    const responseTime = scrapeData.time || 0;
    
    if (!htmlContent) {
      throw new Error("No content retrieved from website. Please verify the domain is accessible.");
    }
    
    // Extract clean text content
    const $ = cheerio.load(htmlContent);
    const textContent = $("body").text().replace(/\s+/g, " ").trim();
    
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
    
    // Run technical analysis
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
    
    // Generate complete ReportData with AI-powered content
    let reportData;
    try {
      reportData = await generateReportData(domain, htmlContent, textContent, metadata, technical);
    } catch (error: any) {
      console.error("Error generating report data:", error);
      throw new Error(`Failed to generate report content: ${error.message || "Unknown error"}`);
    }

    // Generate Report PDF
    let html, pdf;
    try {
      html = generateFullReport(domain, reportData);
    } catch (error: any) {
      console.error("Error generating HTML report:", error);
      throw new Error("Failed to generate report template. Please try again.");
    }
    
    try {
      pdf = await generatePdf(html);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF. This may be due to server resources. Please check your email for the report.");
    }
    
    if (!pdf || pdf.length === 0) {
      throw new Error("Generated PDF is empty. Please try again or check your email.");
    }

    // Return PDF with download headers
    const sanitizedDomain = domain.replace(/[^a-z0-9]/gi, '-');
    const filename = `balloonsight-report-${sanitizedDomain}.pdf`;
    // Use RFC 5987 format for better browser compatibility and special character support
    const encodedFilename = encodeURIComponent(filename);

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Error generating PDF for download:", error);
    
    // Provide user-friendly error messages
    const errorMessage = error.message || "Failed to generate PDF report";
    const isUserError = errorMessage.includes("timeout") || 
                       errorMessage.includes("email") ||
                       errorMessage.includes("try again");
    
    return NextResponse.json(
      { 
        error: errorMessage,
        // Only include details in development
        ...(process.env.NODE_ENV === "development" && { details: error.stack })
      },
      { status: isUserError ? 400 : 500 }
    );
  }
}

