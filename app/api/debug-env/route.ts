import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    stripePaymentLink: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL,
    nodeEnv: process.env.NODE_ENV
  });
}

