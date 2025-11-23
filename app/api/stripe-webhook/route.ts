import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { generatePdf } from "@/lib/pdf";
import { generateFullReport } from "@/lib/reportTemplate";
import { sendReport } from "@/lib/sendReport";
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
    const email = session.customer_details?.email || session.customer_email;
    // Support both client_reference_id (Payment Links) and metadata.domain (Checkout API)
    const domain = session.client_reference_id || session.metadata?.domain;

    console.log("✔ Payment received from", email, "for domain:", domain);

    if (domain && email) {
      try {
        // 1. Run Full Analysis (Deep Scan)
        // Fetch content
        const res = await fetch(domain.startsWith('http') ? domain : `https://${domain}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BalloonSight/1.0)' }
        });
        const htmlContent = await res.text();
        
        // Analyze
        const results = await analyzeHtml(htmlContent, domain, 100); 

        // 2. Generate Report
        const html = generateFullReport(domain, results);
        const pdf = await generatePdf(html);

        // 3. Send Email
        await sendReport(email, pdf);

        console.log("📤 PDF sent to", email);
      } catch (err) {
        console.error("Failed to process report:", err);
      }
    } else {
        console.error("Missing domain or email in session");
    }
  }

  return NextResponse.json({ received: true });
}
