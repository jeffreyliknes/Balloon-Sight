import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { generatePdf } from "@/lib/pdf";
import { generateFullReport } from "@/lib/reportTemplate";
import { sendReport } from "@/lib/sendReport";
import { generateReportData } from "@/lib/generateReportData";
import { analyzeHtml } from "@/actions/analyze-url";
import { getBaseUrl } from "@/lib/utils";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    // Extract customer email from session
    const email = session.customer_details?.email || session.customer_email;
    // Extract domain from client_reference_id (Payment Links) or metadata.domain (Checkout API)
    const domain = session.client_reference_id || session.metadata?.domain;

    console.log("✔ Payment received from", email, "for domain:", domain);
    console.log("🔍 Session details:", {
      hasClientReferenceId: !!session.client_reference_id,
      hasMetadata: !!session.metadata,
      clientReferenceId: session.client_reference_id,
      metadata: session.metadata,
      customerEmail: email
    });

    if (domain && email) {
      try {
        // 1. Run Full Analysis (Deep Scan)
        // Use /api/scrape endpoint for consistent fetching
        const domainUrl = domain.startsWith('http') ? domain : `https://${domain}`;
        const baseUrl = getBaseUrl();
        const scrapeUrl = `${baseUrl}/api/scrape?url=${encodeURIComponent(domainUrl)}`;
        
        const scrapeRes = await fetch(scrapeUrl);
        if (!scrapeRes.ok) {
          const errorData = await scrapeRes.json().catch(() => ({ error: scrapeRes.statusText }));
          throw new Error(`Failed to fetch from /api/scrape: ${errorData.error || scrapeRes.statusText}`);
        }
        const scrapeData = await scrapeRes.json();
        const htmlContent = scrapeData.html;
        const responseTime = scrapeData.time || 0;
        
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
        const reportData = await generateReportData(domain, htmlContent, textContent, metadata, technical);

        // 2. Generate Report PDF
        const html = generateFullReport(domain, reportData);
        const pdf = await generatePdf(html);

        // 3. Send Email
        try {
          await sendReport(email, pdf);
          console.log("📤 PDF sent to", email);
        } catch (emailError: any) {
          console.error("❌ Failed to send email:", emailError);
          console.error("Email error details:", {
            message: emailError.message,
            stack: emailError.stack,
            email,
            hasResendKey: !!process.env.RESEND_API_KEY,
            hasSenderEmail: !!process.env.REPORT_SENDER_EMAIL
          });
          // Don't throw - webhook should still return success even if email fails
        }
      } catch (err) {
        console.error("❌ Failed to process report:", err);
        console.error("Error details:", {
          message: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
          domain,
          email
        });
      }
    } else {
        console.error("❌ Missing domain or email in session");
        console.error("Session data:", {
          hasDomain: !!domain,
          hasEmail: !!email,
          domain,
          email,
          sessionId: session.id
        });
    }
  }

  return NextResponse.json({ received: true });
}
