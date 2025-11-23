import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { generateReportHtml, generatePdf } from "@/lib/report-generator";
import { sendReportEmail } from "@/lib/email";
import { analyzeHtml } from "@/actions/analyze-url";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

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
    const domain = session.client_reference_id;
    const email = session.customer_details?.email || session.customer_email;

    if (domain && email) {
      console.log(`Processing report for ${domain} to ${email}`);

      // 1. Scrape the domain
      // We need to fetch it here. We can't call our own /api/scrape easily, so we fetch directly.
      try {
        const scrapeRes = await fetch(domain, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BalloonSight/1.0)' }
        });
        const html = await scrapeRes.text();
        
        // 2. Analyze
        // We mock responseTime as 100ms since we are async processing
        const analysis = await analyzeHtml(html, domain, 100);

        // 3. Generate PDF
        const reportHtml = generateReportHtml(domain, analysis);
        const pdfBuffer = await generatePdf(reportHtml);

        // 4. Send Email
        await sendReportEmail(email, domain, pdfBuffer);

      } catch (err) {
        console.error("Failed to generate/send report:", err);
        // We don't fail the webhook response, just log it.
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}

