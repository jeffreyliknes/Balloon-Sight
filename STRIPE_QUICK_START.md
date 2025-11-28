# Stripe Test Environment - Quick Start

## One-Time Setup (5 minutes)

### 1. Install Stripe CLI
```bash
brew install stripe/stripe-cli/stripe
```

### 2. Login
```bash
stripe login
```

### 3. Get Your Test API Key
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy **Secret key** (starts with `sk_test_...`)

### 4. Create `.env.local`
```bash
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESEND_API_KEY=re_YOUR_KEY_HERE
OPENAI_API_KEY=sk-YOUR_KEY_HERE
REPORT_SENDER_EMAIL=reports@yourdomain.com
```

## Every Time You Develop

### Terminal 1: Start Webhook Forwarding
```bash
npm run stripe:webhook
# or
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

**Copy the webhook secret** (whsec_...) and add to `.env.local`

### Terminal 2: Start Dev Server
```bash
npm run dev
```

## Test Payment

1. Go to http://localhost:3000
2. Enter a test domain
3. Click "Download Full Report — C$12"
4. Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date
   - CVC: Any 3 digits
5. Complete payment
6. PDF downloads automatically + email sent

## Troubleshooting

- **Webhook not working?** → Check Terminal 1 is running `stripe listen`
- **Payment fails?** → Verify `STRIPE_SECRET_KEY` in `.env.local`
- **No download?** → Check Payment Link success URL includes `{CHECKOUT_SESSION_ID}`

## Full Guide

See [STRIPE_TEST_SETUP.md](./STRIPE_TEST_SETUP.md) for detailed instructions.

