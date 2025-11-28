/**
 * Centralized environment variable management
 * Ensures production (Vercel) uses ONLY Vercel env vars
 * Local dev uses .env.local
 */

// Production environment check
const isProduction = process.env.VERCEL === "1";

// Validate production environment variables
if (isProduction) {
  const missing: string[] = [];
  
  if (!process.env.STRIPE_SECRET_KEY) missing.push("STRIPE_SECRET_KEY");
  if (!process.env.STRIPE_PRICE_ID) missing.push("STRIPE_PRICE_ID");
  if (!process.env.STRIPE_WEBHOOK_SECRET) missing.push("STRIPE_WEBHOOK_SECRET");
  if (!process.env.NEXT_PUBLIC_BASE_URL) missing.push("NEXT_PUBLIC_BASE_URL");
  if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
  if (!process.env.REPORT_SENDER_EMAIL) missing.push("REPORT_SENDER_EMAIL");

  if (missing.length > 0) {
    console.error("❌ Missing production environment variables:", missing);
    throw new Error(`Missing production environment variables: ${missing.join(", ")}`);
  }
}

export const env = {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripePriceId: process.env.STRIPE_PRICE_ID!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  resendApiKey: process.env.RESEND_API_KEY!,
  senderEmail: process.env.REPORT_SENDER_EMAIL!,
  baseUrl:
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL === "1" ? "https://balloonsight.com" : "http://localhost:3000"),
  isProduction,
};

