import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET(req: Request) {
  // Only allow in production (Vercel)
  if (!process.env.VERCEL) {
    return NextResponse.json(
      { error: "Not running in production. This endpoint is only available on Vercel." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    vercel: process.env.VERCEL,
    isProduction: env.isProduction,
    baseUrl: env.baseUrl,
    stripeSecretKey: env.stripeSecretKey ? env.stripeSecretKey.slice(0, 7) + "..." : "MISSING",
    stripePriceId: env.stripePriceId || "MISSING",
    webhookSecret: env.stripeWebhookSecret ? env.stripeWebhookSecret.slice(0, 7) + "..." : "MISSING",
    resendApiKey: env.resendApiKey ? env.resendApiKey.slice(0, 7) + "..." : "MISSING",
    senderEmail: env.senderEmail || "MISSING",
    timestamp: new Date().toISOString(),
  });
}
