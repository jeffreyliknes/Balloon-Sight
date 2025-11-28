# Stripe Test Environment Setup Guide

This guide will help you set up a local test environment for Stripe payments using the Stripe CLI.

## Prerequisites

1. **Stripe Account**: Sign up at https://stripe.com (free)
2. **Stripe CLI**: Install the Stripe CLI tool
3. **Node.js**: Ensure you have Node.js installed

## Step 1: Install Stripe CLI

### macOS
```bash
brew install stripe/stripe-cli/stripe
```

### Linux
```bash
# Download from: https://github.com/stripe/stripe-cli/releases
# Or use package manager
```

### Windows
Download from: https://github.com/stripe/stripe-cli/releases

Verify installation:
```bash
stripe --version
```

## Step 2: Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authenticate with Stripe. After successful login, the CLI will be connected to your Stripe account.

## Step 3: Get Your Stripe Test API Key

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_...`)
3. Add it to `.env.local`:
   ```bash
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
   ```

## Step 4: Set Up Webhook Forwarding

In a **separate terminal window**, run:

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

You should see output like:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef...
```

**Copy the webhook signing secret** (starts with `whsec_...`)

## Step 5: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your values:

   ```bash
   # Stripe Test Key (from Step 3)
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
   
   # Webhook Secret (from Step 4)
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
   
   # Base URL (for local development)
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   
   # Resend API Key (for email delivery)
   RESEND_API_KEY=re_YOUR_RESEND_API_KEY_HERE
   
   # Email sender (must be verified in Resend)
   REPORT_SENDER_EMAIL=reports@yourdomain.com
   
   # OpenAI API Key (for AI report generation)
   OPENAI_API_KEY=sk-YOUR_OPENAI_API_KEY_HERE
   ```

## Step 6: Start Your Development Server

In your main terminal:

```bash
npm run dev
```

Your app should start at `http://localhost:3000`

## Step 7: Keep Webhook Listener Running

**Important**: Keep the `stripe listen` command running in a separate terminal while testing. This forwards webhook events to your local server.

## Testing the Integration

### 1. Test Payment Flow

1. Navigate to `http://localhost:3000`
2. Enter a test domain URL
3. Click "Download Full Report — C$12"
4. You'll be redirected to Stripe's test payment page

### 2. Use Test Card Numbers

Stripe provides test card numbers for testing:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Declined Payment:**
- Card: `4000 0000 0000 0002`
- (Use same expiry, CVC, ZIP as above)

### 3. Monitor Webhook Events

In your `stripe listen` terminal, you should see:
```
2024-01-01 12:00:00   --> checkout.session.completed [evt_xxx]
2024-01-01 12:00:00  <--  [200] POST http://localhost:3000/api/stripe-webhook [evt_xxx]
```

### 4. Verify Success Page

After successful payment:
- You should be redirected to `/payment/success?session_id=cs_test_...`
- Click "Download PDF Report" button
- PDF should download automatically
- Check your email for the backup copy

## Troubleshooting

### Webhook Not Receiving Events

1. **Check if `stripe listen` is running**
   - Must be running in a separate terminal
   - Should show "Ready!" message

2. **Verify webhook secret**
   - Must match the secret shown by `stripe listen`
   - Check `.env.local` has correct `STRIPE_WEBHOOK_SECRET`

3. **Check server logs**
   - Look for errors in your Next.js console
   - Check webhook endpoint is accessible

### Payment Not Processing

1. **Verify API key**
   - Must be a test key (`sk_test_...`)
   - Check it's in `.env.local` as `STRIPE_SECRET_KEY`

2. **Check Payment Link**
   - Verify the Payment Link URL in `app/page.tsx`
   - Ensure it's a test mode Payment Link

### PDF Not Generating

1. **Check webhook logs**
   - Look for errors in `stripe listen` output
   - Check Next.js server logs

2. **Verify dependencies**
   - OpenAI API key is set (for AI content)
   - Resend API key is set (for email)
   - All environment variables are loaded

### Download Not Working

1. **Check session ID**
   - Success URL must include `{CHECKOUT_SESSION_ID}`
   - Verify Payment Link configuration in Stripe Dashboard

2. **Verify payment status**
   - Payment must be completed
   - Check Stripe Dashboard for payment status

## Quick Test Checklist

- [ ] Stripe CLI installed and logged in
- [ ] `stripe listen` running in separate terminal
- [ ] `.env.local` file created with all variables
- [ ] Development server running (`npm run dev`)
- [ ] Test payment completed successfully
- [ ] Webhook events received (check `stripe listen` output)
- [ ] PDF download works on success page
- [ ] Email received with PDF attachment

## Next Steps

Once local testing works:
1. Set up production Stripe keys
2. Configure production webhook endpoint
3. Update Payment Link with production URLs
4. Test with small real payment before going live

## Useful Commands

```bash
# View recent webhook events
stripe events list

# Trigger a test webhook event
stripe trigger checkout.session.completed

# View logs from Stripe CLI
stripe logs tail

# Test webhook endpoint manually
curl -X POST http://localhost:3000/api/stripe-webhook \
  -H "stripe-signature: test" \
  -d "{}"
```

## Resources

- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Dashboard](https://dashboard.stripe.com/test)

