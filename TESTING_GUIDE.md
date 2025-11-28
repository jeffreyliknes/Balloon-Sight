# Testing Your Stripe Integration

## Quick Start Testing

Follow these steps to test your Stripe payment flow end-to-end.

## Step 1: Start Webhook Forwarding (Terminal 1)

Open a terminal and run:

```bash
npm run stripe:webhook
```

**OR** manually:

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

**Important:** 
- Keep this terminal open while testing
- You should see: `Ready! Your webhook signing secret is whsec_...`
- Copy the webhook secret if you haven't added it to `.env.local` yet

## Step 2: Start Development Server (Terminal 2)

Open a **second terminal** and run:

```bash
npm run dev
```

Your app should start at `http://localhost:3000`

## Step 3: Test the Payment Flow

### 3.1 Navigate to Your App
1. Open your browser to `http://localhost:3000`
2. Enter a test URL (e.g., `https://example.com`)
3. Click "Scan your site now"
4. Wait for the analysis to complete

### 3.2 Initiate Payment
1. Scroll to the results section
2. Click the **"Download Full Report — C$12"** button
3. You'll be redirected to Stripe's test payment page

### 3.3 Use Test Card
On the Stripe payment page, use these test card details:

**Successful Payment:**
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** Any future date (e.g., `12/34`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP/Postal Code:** Any 5 digits (e.g., `12345`)

**Other Test Cards:**
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

### 3.4 Complete Payment
1. Fill in the test card details
2. Click "Pay"
3. You should be redirected to `/payment/success?session_id=cs_test_...`

## Step 4: Verify Everything Works

### Check Webhook Events
In Terminal 1 (where `stripe listen` is running), you should see:
```
2024-01-01 12:00:00   --> checkout.session.completed [evt_xxx]
2024-01-01 12:00:00  <--  [200] POST http://localhost:3000/api/stripe-webhook [evt_xxx]
```

### Check Success Page
1. On the success page, click **"Download PDF Report"**
2. The PDF should download automatically
3. Check your email inbox for the backup copy

### Check Server Logs
In Terminal 2 (dev server), you should see:
```
✔ Payment received from [email] for domain: [your-domain]
📤 PDF sent to [email]
```

## Troubleshooting

### Webhook Not Receiving Events
- ✅ Make sure `stripe listen` is running in Terminal 1
- ✅ Verify `STRIPE_WEBHOOK_SECRET` in `.env.local` matches the secret from `stripe listen`
- ✅ Check that your dev server is running on port 3000

### Payment Fails
- ✅ Verify `STRIPE_SECRET_KEY` in `.env.local` starts with `sk_test_...`
- ✅ Make sure you're using a test mode Payment Link (URL should contain `/test/`)
- ✅ Check Stripe Dashboard is in **Test mode** (toggle at top)

### PDF Not Generating
- ✅ Check webhook logs in Terminal 1 for errors
- ✅ Verify all environment variables are set:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `OPENAI_API_KEY` (for AI content)
  - `RESEND_API_KEY` (for email)
  - `REPORT_SENDER_EMAIL`
- ✅ Check Next.js server logs in Terminal 2

### Download Not Working
- ✅ Verify the success URL includes `{CHECKOUT_SESSION_ID}` in your Payment Link settings
- ✅ Check that payment status is "completed" in Stripe Dashboard
- ✅ Try checking your email - the report should be sent there as backup

## Quick Test Checklist

Before testing, verify:
- [ ] Stripe CLI is installed (`stripe --version`)
- [ ] Logged into Stripe CLI (`stripe login`)
- [ ] `.env.local` has all required variables
- [ ] `STRIPE_SECRET_KEY` starts with `sk_test_...`
- [ ] `STRIPE_WEBHOOK_SECRET` is set (from `stripe listen`)
- [ ] Payment Link URL is a test mode link (contains `/test/`)

During testing:
- [ ] Webhook forwarding is running (`stripe listen`)
- [ ] Dev server is running (`npm run dev`)
- [ ] Test payment completes successfully
- [ ] Webhook events appear in Terminal 1
- [ ] PDF downloads on success page
- [ ] Email received with PDF attachment

## Testing Different Scenarios

### Test Successful Payment
Use card: `4242 4242 4242 4242`
- Should redirect to success page
- PDF should download
- Email should be sent

### Test Declined Payment
Use card: `4000 0000 0000 0002`
- Payment should be declined
- Should redirect to cancelled page
- No webhook event should fire

### Test Payment Requiring Authentication
Use card: `4000 0025 0000 3155`
- Should show 3D Secure authentication
- Complete authentication to proceed
- Should work like successful payment

## Useful Commands

```bash
# View recent webhook events
stripe events list

# Trigger a test webhook event manually
stripe trigger checkout.session.completed

# View Stripe CLI logs
stripe logs tail

# Check your Stripe test mode dashboard
# Visit: https://dashboard.stripe.com/test
```

## Next Steps

Once local testing works:
1. Test with different domains/URLs
2. Test edge cases (invalid URLs, network errors, etc.)
3. Set up production Stripe keys when ready
4. Configure production webhook endpoint
5. Test with a small real payment before going live

