import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/utils";

/**
 * Diagnostic endpoint to check base URL resolution in production
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

  const baseUrl = getBaseUrl();
  const vercel = process.env.VERCEL;
  const nextPublicBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const vercelUrl = process.env.VERCEL_URL;

  // Expected values
  const expectedBaseUrl = "https://balloonsight.com";
  const isCorrect = baseUrl === expectedBaseUrl;

  // Check what getBaseUrl() would return for success/cancel URLs
  const successUrl = `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${baseUrl}/payment/cancelled`;

  return NextResponse.json({
    resolved: {
      baseUrl,
      isCorrect,
      expected: expectedBaseUrl,
      status: isCorrect ? "✅ Correct" : "🔴 Incorrect",
    },
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: vercel,
      NEXT_PUBLIC_BASE_URL: nextPublicBaseUrl || "undefined",
      VERCEL_URL: vercelUrl || "undefined",
    },
    urls: {
      successUrl,
      cancelUrl,
    },
    analysis: {
      issue: !isCorrect
        ? `Base URL is "${baseUrl}" but should be "${expectedBaseUrl}". Check NEXT_PUBLIC_BASE_URL or VERCEL_URL.`
        : "Base URL is correctly resolved.",
      recommendation: !nextPublicBaseUrl
        ? "Set NEXT_PUBLIC_BASE_URL=https://balloonsight.com in Vercel environment variables"
        : nextPublicBaseUrl !== expectedBaseUrl
        ? `NEXT_PUBLIC_BASE_URL is set to "${nextPublicBaseUrl}" but should be "${expectedBaseUrl}"`
        : "Base URL configuration is correct.",
    },
    timestamp: new Date().toISOString(),
  });
}

