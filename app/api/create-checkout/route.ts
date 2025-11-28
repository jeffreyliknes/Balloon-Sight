import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/actions/create-checkout-session";

export async function POST(req: Request) {
  try {
    // Dev warning: Check if payment link env var is missing (for reference, though we use checkout sessions)
    if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL) {
      console.warn("⚠️ Missing NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL env variable. (Note: This app uses checkout sessions, not payment links)");
    }

    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    const result = await createCheckoutSession(domain);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.url });
  } catch (error: any) {
    console.error("Error in create-checkout API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

