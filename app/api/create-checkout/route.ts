import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    
    console.log("PRODUCTION MODE:", env.isProduction);
    console.log("STRIPE PRICE ID:", env.stripePriceId);
    console.log("BASE URL:", env.baseUrl);
    console.log("Domain received:", domain);
    
    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    if (!env.stripePriceId) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_ID is not configured" },
        { status: 500 }
      );
    }
    
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: env.stripePriceId,
          quantity: 1,
        },
      ],
      client_reference_id: domain,
      metadata: { domain },
      success_url: `${env.baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.baseUrl}/payment/cancelled`,
    });

    console.log("Checkout session created:", session.id);
    console.log("Redirect URL:", session.url);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

