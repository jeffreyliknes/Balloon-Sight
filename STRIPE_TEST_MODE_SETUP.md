# Switching to Stripe Test Mode

## Issue
Your Payment Link is currently in **Live mode**, but you're trying to use test cards. You need to use a **Test mode** Payment Link for local development.

## Solution: Create a Test Mode Payment Link

### Step 1: Switch to Test Mode in Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. **Toggle the mode switch** at the top from "Live mode" to **"Test mode"**
3. The dashboard will turn orange/purple to indicate test mode

### Step 2: Create or Find Your Test Payment Link

**Option A: Create a New Test Payment Link**

1. In Test mode, go to **Products** → **Payment Links**
2. Click **"Create payment link"** or edit your existing link
3. Set price: **C$12.00 CAD**
4. Configure **Success URL**:
   ```
   http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}
   ```
5. Configure **Cancel URL**:
   ```
   http://localhost:3000/payment/cancelled
   ```
6. Save and copy the Payment Link URL (starts with `https://buy.stripe.com/test/...`)

**Option B: Use Existing Test Link**

1. In Test mode, go to **Products** → **Payment Links**
2. Find your existing link
3. Copy the URL (should start with `https://buy.stripe.com/test/...`)

### Step 3: Update Your Environment Variable

The code now uses an environment variable for the Payment Link URL. Update `.env.local`:

1. Open `.env.local`
2. Find `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL`
3. Replace `https://buy.stripe.com/test_YOUR_TEST_PAYMENT_LINK_ID` with your actual test Payment Link URL

Example:
```bash
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL=https://buy.stripe.com/test/abc123xyz
```

**Note:** The code automatically uses this environment variable, so you don't need to edit `app/page.tsx` anymore.

### Step 4: Verify Your Test API Key

Make sure your `.env.local` has a **test** Stripe key:

1. In Test mode, go to **Developers** → **API keys**
2. Copy the **Secret key** (starts with `sk_test_...`)
3. Add it to `.env.local`:
   ```bash
   STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_TEST_KEY_HERE
   ```

## Test Cards for Test Mode

Once in test mode, you can use:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

Any future expiry date, any CVC.

## Quick Checklist

- [ ] Stripe Dashboard is in **Test mode** (orange/purple)
- [ ] Payment Link URL starts with `https://buy.stripe.com/test/...`
- [ ] Success URL includes `{CHECKOUT_SESSION_ID}`
- [ ] `.env.local` has `STRIPE_SECRET_KEY=sk_test_...`
- [ ] Webhook forwarding is running (`npm run stripe:webhook`)

## Important Notes

- **Test mode Payment Links** have URLs like: `https://buy.stripe.com/test/...`
- **Live mode Payment Links** have URLs like: `https://buy.stripe.com/...` (no `/test/`)
- Always use test mode for local development
- Switch to live mode only when deploying to production

