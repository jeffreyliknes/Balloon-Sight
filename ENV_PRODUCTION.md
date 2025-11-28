# Production Environment Variables for Vercel

This document lists all environment variables that must be configured in your Vercel Dashboard for production deployment.

## ⚠️ CRITICAL: Production vs Local

- **Local (`.env.local`)**: Uses TEST keys (`sk_test_...`, `whsec_...` from Stripe CLI)
- **Production (Vercel)**: Uses LIVE keys (`sk_live_...`, `whsec_...` from Stripe Dashboard)

**NEVER** put production keys in `.env.local` or commit them to git!

---

## Required Production Variables

Add these in: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### 1. Stripe Configuration (LIVE MODE)

```bash
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY_HERE
```

**How to get:**
1. Go to https://dashboard.stripe.com/apikeys (make sure you're in **Live mode**)
2. Copy the **Secret key** (starts with `sk_live_...`)
3. Add to Vercel as `STRIPE_SECRET_KEY`

---

### 2. Stripe Webhook Secret (PRODUCTION)

```bash
STRIPE_WEBHOOK_SECRET=whsec_YOUR_PRODUCTION_WEBHOOK_SECRET_HERE
```

**How to get:**
1. Go to https://dashboard.stripe.com/webhooks (make sure you're in **Live mode**)
2. Click on your webhook endpoint (or create one)
3. Click "Reveal" next to "Signing secret"
4. Copy the secret (starts with `whsec_...`)
5. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

**⚠️ CRITICAL:** 
- Webhook secrets ALWAYS start with `whsec_` (NEVER `sk_`)
- If you see `sk_` in a webhook secret, it's WRONG!

**Webhook Endpoint URL:**
```
https://yourdomain.com/api/stripe-webhook
```

**Required Events:**
- `checkout.session.completed`

---

### 3. Application Base URL (PRODUCTION)

```bash
NEXT_PUBLIC_BASE_URL=https://balloonsight.com
```

Replace `balloonsight.com` with your actual production domain.

---

### 4. Resend Email Configuration

```bash
RESEND_API_KEY=re_YOUR_PRODUCTION_RESEND_KEY_HERE
```

**How to get:**
1. Go to https://resend.com/api-keys
2. Copy your API key (starts with `re_...`)
3. Add to Vercel as `RESEND_API_KEY`

```bash
REPORT_SENDER_EMAIL=report@balloonsight.com
```

**⚠️ IMPORTANT:**
- Must use `report@balloonsight.com` (not `reports@` or `outreach@`)
- This email must be verified in your Resend domain settings
- Domain must be verified in Resend Dashboard → Domains

---

### 5. OpenAI API Configuration

```bash
OPENAI_API_KEY=sk-YOUR_PRODUCTION_OPENAI_KEY_HERE
```

**How to get:**
1. Go to https://platform.openai.com/api-keys
2. Create or copy your API key (starts with `sk-...`)
3. Add to Vercel as `OPENAI_API_KEY`

---

### 6. Optional Configuration

```bash
BRAND_COLOR_PRIMARY=#551121
```

Optional brand color for PDF reports. Defaults to `#551121` if not set.

---

## Environment Variable Checklist

Before deploying to production, verify:

- [ ] `STRIPE_SECRET_KEY` = `sk_live_...` (NOT `sk_test_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` = `whsec_...` (NOT `sk_...`)
- [ ] `NEXT_PUBLIC_BASE_URL` = `https://yourdomain.com` (NOT `http://localhost:3000`)
- [ ] `REPORT_SENDER_EMAIL` = `report@balloonsight.com` (verified in Resend)
- [ ] `RESEND_API_KEY` = Production key from Resend
- [ ] `OPENAI_API_KEY` = Production key from OpenAI
- [ ] All variables are set in Vercel Dashboard (not just `.env.local`)

---

## How Stripe Webhook + Resend Email Connect

### Payment Flow:

1. **User completes payment** → Stripe Payment Link redirects to success page
2. **Stripe sends webhook** → `checkout.session.completed` event to `/api/stripe-webhook`
3. **Webhook handler verifies signature** → Uses `STRIPE_WEBHOOK_SECRET` to validate request
4. **Handler retrieves session** → Uses `STRIPE_SECRET_KEY` to get payment details
5. **Handler generates PDF** → Uses OpenAI API to create report content
6. **Handler sends email** → Uses Resend API with `REPORT_SENDER_EMAIL` to deliver PDF
7. **Success page** → User can also download PDF immediately via `/api/download-report`

### Environment Variables Used:

- `STRIPE_WEBHOOK_SECRET` → Validates webhook is from Stripe (security)
- `STRIPE_SECRET_KEY` → Retrieves payment session data from Stripe
- `OPENAI_API_KEY` → Generates AI-powered report content
- `RESEND_API_KEY` → Sends email via Resend service
- `REPORT_SENDER_EMAIL` → Email address that sends the PDF
- `NEXT_PUBLIC_BASE_URL` → Used for internal API calls and redirects

---

## Testing Production Setup

After setting all variables in Vercel:

1. **Deploy to Vercel**
2. **Test webhook endpoint:**
   - Go to Stripe Dashboard → Webhooks
   - Click "Send test webhook"
   - Select `checkout.session.completed`
   - Verify it reaches your endpoint successfully
3. **Test payment flow:**
   - Make a small test payment
   - Verify webhook is received
   - Check email is sent
   - Verify PDF download works

---

## Security Best Practices

1. ✅ **Never commit** `.env.local` to git (already in `.gitignore`)
2. ✅ **Use different keys** for test vs production
3. ✅ **Rotate keys** if compromised
4. ✅ **Monitor webhook events** in Stripe Dashboard
5. ✅ **Verify webhook signatures** (already implemented in code)
6. ✅ **Use environment-specific values** (test for local, live for production)

---

## Troubleshooting

### Webhook Not Working in Production

1. Check webhook endpoint URL is correct in Stripe Dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` matches the one in Stripe Dashboard
3. Check Vercel logs for webhook errors
4. Ensure webhook is in **Live mode** (not Test mode)

### Email Not Sending

1. Verify `REPORT_SENDER_EMAIL` is verified in Resend Dashboard
2. Check domain is verified in Resend
3. Verify `RESEND_API_KEY` is correct
4. Check Vercel logs for Resend errors

### Payment Issues

1. Verify `STRIPE_SECRET_KEY` is a **live** key (`sk_live_...`)
2. Ensure Payment Link is in **Live mode**
3. Check Stripe Dashboard for payment status

---

## Quick Reference

| Variable | Local (`.env.local`) | Production (Vercel) |
|----------|---------------------|---------------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (from CLI) | `whsec_...` (from Dashboard) |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | `https://balloonsight.com` |
| `REPORT_SENDER_EMAIL` | `report@balloonsight.com` | `report@balloonsight.com` |
| `RESEND_API_KEY` | Test key (optional) | Production key |
| `OPENAI_API_KEY` | Same (can reuse) | Same (can reuse) |

---

## Support

- Stripe Dashboard: https://dashboard.stripe.com
- Resend Dashboard: https://resend.com
- Vercel Dashboard: https://vercel.com/dashboard

