import { NextResponse } from "next/server";

/**
 * Diagnostic endpoint to check environment variable status in production
 * Security: Only accessible in development or with secret token
 */
export async function GET(req: Request) {
  // Security check: Require secret token in production
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const secretToken = process.env.DEBUG_SECRET_TOKEN;

  // In production, require token unless in development
  if (process.env.NODE_ENV === "production" && secretToken && token !== secretToken) {
    return NextResponse.json(
      { error: "Unauthorized. Token required in production." },
      { status: 401 }
    );
  }

  // Helper function to mask sensitive values
  const maskValue = (value: string | undefined, prefixLength = 4, suffixLength = 4): string => {
    if (!value) return "undefined";
    if (value.length <= prefixLength + suffixLength) return "***";
    return `${value.substring(0, prefixLength)}***${value.substring(value.length - suffixLength)}`;
  };

  // Check environment variables
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePriceId = process.env.STRIPE_PRICE_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const resendKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.REPORT_SENDER_EMAIL;

  // Validation results
  const checks = {
    STRIPE_SECRET_KEY: {
      exists: !!stripeSecretKey,
      isLive: stripeSecretKey?.startsWith("sk_live_") || false,
      isTest: stripeSecretKey?.startsWith("sk_test_") || false,
      masked: maskValue(stripeSecretKey),
      status: stripeSecretKey?.startsWith("sk_live_") ? "✅" : stripeSecretKey?.startsWith("sk_test_") ? "🔴" : "❌",
      message: !stripeSecretKey
        ? "Missing"
        : stripeSecretKey.startsWith("sk_test_")
        ? "Using TEST key in production!"
        : stripeSecretKey.startsWith("sk_live_")
        ? "Valid live key"
        : "Invalid format",
    },
    STRIPE_PRICE_ID: {
      exists: !!stripePriceId,
      isPriceId: stripePriceId?.startsWith("price_") || false,
      isProductId: stripePriceId?.startsWith("prod_") || false,
      masked: maskValue(stripePriceId),
      status: stripePriceId?.startsWith("price_") ? "✅" : stripePriceId?.startsWith("prod_") ? "🔴" : "❌",
      message: !stripePriceId
        ? "Missing"
        : stripePriceId.startsWith("prod_")
        ? "Using Product ID instead of Price ID!"
        : stripePriceId.startsWith("price_")
        ? "Valid Price ID"
        : "Invalid format",
    },
    NEXT_PUBLIC_BASE_URL: {
      exists: !!baseUrl,
      isProduction: baseUrl === "https://balloonsight.com",
      isLocalhost: baseUrl?.includes("localhost") || false,
      value: baseUrl || "undefined",
      status: baseUrl === "https://balloonsight.com" ? "✅" : baseUrl?.includes("localhost") ? "🔴" : "🟡",
      message: !baseUrl
        ? "Missing"
        : baseUrl === "https://balloonsight.com"
        ? "Correct production URL"
        : baseUrl.includes("localhost")
        ? "Using localhost in production!"
        : "May be incorrect",
    },
    STRIPE_WEBHOOK_SECRET: {
      exists: !!webhookSecret,
      isWebhookSecret: webhookSecret?.startsWith("whsec_") || false,
      masked: maskValue(webhookSecret),
      status: webhookSecret?.startsWith("whsec_") ? "✅" : "❌",
      message: !webhookSecret
        ? "Missing"
        : webhookSecret.startsWith("whsec_")
        ? "Valid webhook secret"
        : "Invalid format (should start with whsec_)",
    },
    RESEND_API_KEY: {
      exists: !!resendKey,
      isResendKey: resendKey?.startsWith("re_") || false,
      masked: maskValue(resendKey),
      status: resendKey?.startsWith("re_") ? "✅" : "❌",
      message: !resendKey ? "Missing" : resendKey.startsWith("re_") ? "Valid Resend key" : "Invalid format",
    },
    REPORT_SENDER_EMAIL: {
      exists: !!senderEmail,
      value: senderEmail || "undefined",
      status: !!senderEmail ? "✅" : "❌",
      message: !senderEmail ? "Missing" : "Set",
    },
  };

  // Count issues
  const broken = Object.values(checks).filter((c) => c.status === "🔴").length;
  const suspicious = Object.values(checks).filter((c) => c.status === "🟡").length;
  const working = Object.values(checks).filter((c) => c.status === "✅").length;

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    timestamp: new Date().toISOString(),
    summary: {
      working,
      suspicious,
      broken,
      total: Object.keys(checks).length,
    },
    checks,
  });
}

