# BalloonSight - AI Visibility Toolkit

This is a [Next.js](https://nextjs.org) project that analyzes website AI visibility and generates comprehensive PDF reports.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Stripe account (for payments)
- Resend account (for email delivery)
- OpenAI API key (for AI-powered content generation)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see [Stripe Test Setup](#stripe-test-setup) below)

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stripe Test Setup

This project uses Stripe for payment processing. To set up the test environment:

### Quick Setup

1. **Install Stripe CLI** (if not already installed):
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Run the setup script**:
   ```bash
   npm run setup:stripe
   # or
   ./scripts/setup-stripe-test.sh
   ```

4. **Start webhook forwarding** (in a separate terminal):
   ```bash
   npm run stripe:webhook
   # or
   ./scripts/start-stripe-webhook.sh
   ```
   Copy the webhook secret (starts with `whsec_...`) and add it to `.env.local`

5. **Configure `.env.local`** with your API keys:
   - `STRIPE_SECRET_KEY` - Get from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - `STRIPE_WEBHOOK_SECRET` - From step 4 above
   - `RESEND_API_KEY` - Get from [Resend](https://resend.com/api-keys)
   - `OPENAI_API_KEY` - Get from [OpenAI](https://platform.openai.com/api-keys)

### Detailed Setup Guide

For complete instructions, see **[STRIPE_TEST_SETUP.md](./STRIPE_TEST_SETUP.md)**

### Testing Payments

Use Stripe test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Any future expiry date, any CVC

## Environment Variables

Required environment variables (add to `.env.local`):

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=re_...
REPORT_SENDER_EMAIL=reports@yourdomain.com

# AI Content Generation
OPENAI_API_KEY=sk-...

# Optional
BRAND_COLOR_PRIMARY=#551121
```

## Project Structure

- `app/` - Next.js app router pages and API routes
- `components/` - React components
- `lib/` - Utility functions and services
- `actions/` - Server actions
- `scripts/` - Setup and utility scripts

## Key Features

- AI-powered website analysis
- PDF report generation
- Stripe payment integration
- Email delivery via Resend
- Real-time webhook processing

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup:stripe` - Run Stripe test environment setup
- `npm run stripe:webhook` - Start Stripe webhook forwarding

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe CLI Guide](https://stripe.com/docs/stripe-cli)

## Deploy on Vercel

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new).

Make sure to add all environment variables in Vercel's dashboard before deploying.
