# Stripe TEST MODE Setup Guide

## Your environment is now in TEST MODE

This guide will help you set up and test Stripe payments locally using test mode.

---

## 1. Create .env.local File

Create a `.env.local` file in the root of your project with the following content:

```bash
# Stripe Test Keys (TEST MODE)
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Test Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Test Price ID
STRIPE_PRICE_ID=price_test_YOUR_TEST_PRICE_ID_HERE

# Test Resend API key (optional local-only)
RESEND_API_KEY=re_test_YOUR_RESEND_KEY_HERE

# Report sender email
REPORT_SENDER_EMAIL=report@balloonsight.com

# OpenAI (local only)
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_KEY_HERE
```

### How to get test values:

1. **STRIPE_SECRET_KEY**: 
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy the "Secret key" (starts with `sk_test_`)

2. **STRIPE_PRICE_ID**:
   - Go to https://dashboard.stripe.com/test/products
   - Create a test product with a price of C$16.00 CAD
   - Copy the Price ID (starts with `price_test_`)

3. **STRIPE_WEBHOOK_SECRET**:
   - See step 7 below (from Stripe CLI)

4. **RESEND_API_KEY** (optional):
   - Use your test Resend key if you have one
   - Or use the same key for testing

5. **OPENAI_API_KEY**:
   - Use your OpenAI API key for local testing

---

## 2. Updated Environment Variables

All environment variables should be set in `.env.local`:

- ✅ `STRIPE_SECRET_KEY` - Test key (starts with `sk_test_`)
- ✅ `STRIPE_WEBHOOK_SECRET` - From Stripe CLI (starts with `whsec_`)
- ✅ `NEXT_PUBLIC_BASE_URL` - `http://localhost:3000`
- ✅ `STRIPE_PRICE_ID` - Test price ID (starts with `price_test_`)
- ✅ `RESEND_API_KEY` - Test or production key
- ✅ `REPORT_SENDER_EMAIL` - `report@balloonsight.com`
- ✅ `OPENAI_API_KEY` - Your OpenAI key

---

## 3. Restart Development Server

After creating/updating `.env.local`:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

**Important:** Environment variables are only loaded when the server starts. You must restart after changing `.env.local`.

---

## 4. Run Stripe CLI Webhook Listener

In a **separate terminal window**, run:

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

This will:
- Forward webhook events from Stripe to your local server
- Display a webhook signing secret (starts with `whsec_`)
- Copy this secret and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

**Example output:**
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

Copy the `whsec_` value and add it to `.env.local`, then restart your dev server.

---

## 5. How to Test a Payment

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Start Stripe CLI webhook listener** (in another terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```

3. **Open your app:**
   - Go to `http://localhost:3000`
   - You should see a yellow "TEST MODE ACTIVE" banner at the top

4. **Run a test scan:**
   - Enter a URL (e.g., `https://example.com`)
   - Click "Scan your site now"
   - Wait for results

5. **Click "Download Full Report — C$16"**
   - You should see console logs:
     - "CLICKED DOWNLOAD BUTTON"
     - "STARTING CREATE CHECKOUT"

6. **Complete test payment:**
   - You'll be redirected to Stripe Checkout (test mode)
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date (e.g., 12/34)
   - Any CVC (e.g., 123)
   - Any ZIP code (e.g., 12345)

7. **After payment:**
   - You'll be redirected to `/payment/success?session_id=cs_test_xxxxx`
   - The webhook should fire automatically
   - Check your terminal for webhook logs

---

## 6. View Debug Logs

### Server-side logs (Terminal running `npm run dev`):

You should see:
```
TEST MODE: Creating checkout session
Using Price ID: price_test_xxxxx
Domain received: https://example.com
Using base URL: http://localhost:3000
TEST MODE: Checkout session created: cs_test_xxxxx
TEST MODE: Redirect URL: https://checkout.stripe.com/c/pay/cs_test_xxxxx
```

### Webhook logs (Terminal running `stripe listen`):

You should see:
```
TEST MODE WEBHOOK FIRED
Webhook event type: checkout.session.completed
✔ Payment received from test@example.com for domain: https://example.com
```

### Browser console logs:

Open DevTools (F12) and check the Console tab. You should see:
```
CLICKED DOWNLOAD BUTTON
STARTING CREATE CHECKOUT
REDIRECTING TO STRIPE: https://checkout.stripe.com/c/pay/cs_test_xxxxx
```

---

## 7. Confirm the Webhook Fired

### Check Stripe CLI terminal:
- Look for: `TEST MODE WEBHOOK FIRED`
- Look for: `Webhook event type: checkout.session.completed`
- Look for: `✔ Payment received from...`

### Check dev server terminal:
- Look for: `✔ Payment received from...`
- Look for: `📤 PDF sent to...`
- Look for any error messages

### Check Stripe Dashboard:
- Go to https://dashboard.stripe.com/test/webhooks
- Click on your webhook endpoint
- Check "Events" tab for recent `checkout.session.completed` events

---

## 8. Updated Code Files

### app/api/create-checkout/route.ts

```typescript
export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    
    console.log("TEST MODE: Creating checkout session");
    console.log("Using Price ID:", process.env.STRIPE_PRICE_ID);
    console.log("Domain received:", domain);
    
    // ... validation code ...
    
    const baseUrl = getBaseUrl();
    console.log("Using base URL:", baseUrl);
    
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      client_reference_id: domain,
      metadata: { domain },
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancelled`,
    });

    console.log("TEST MODE: Checkout session created:", session.id);
    console.log("TEST MODE: Redirect URL:", session.url);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
```

### app/api/stripe-webhook/route.ts

```typescript
try {
  event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  
  console.log("TEST MODE WEBHOOK FIRED");
  console.log("Webhook event type:", event.type);
} catch (error: any) {
  console.error("TEST MODE: Webhook signature verification failed:", error.message);
  return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
}
```

### app/page.tsx - Button Handler

```typescript
<Button 
  id="download-report-button"
  type="button"
  onClick={async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("CLICKED DOWNLOAD BUTTON");
    console.log("STARTING CREATE CHECKOUT");
    
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: result.url }),
      });
      
      // ... error handling ...
      
      const data = await response.json();
      if (data?.url) {
        console.log("REDIRECTING TO STRIPE:", data.url);
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
    }
  }}
>
  Download Full Report — C$16
</Button>
```

### app/page.tsx - TEST MODE Banner

```typescript
{process.env.NODE_ENV === "development" && (
  <div className="bg-yellow-500 text-black text-center py-2 font-bold">
    TEST MODE ACTIVE — Stripe Test Payments Only
  </div>
)}
```

---

## 9. Test Mode Checklist

- [ ] Created `.env.local` file with test values
- [ ] Set `STRIPE_SECRET_KEY` to test key (`sk_test_...`)
- [ ] Set `STRIPE_PRICE_ID` to test price ID (`price_test_...`)
- [ ] Set `NEXT_PUBLIC_BASE_URL` to `http://localhost:3000`
- [ ] Set `STRIPE_WEBHOOK_SECRET` from Stripe CLI
- [ ] Restarted dev server after updating `.env.local`
- [ ] Running Stripe CLI webhook listener
- [ ] See "TEST MODE ACTIVE" banner on page
- [ ] Console shows "CLICKED DOWNLOAD BUTTON" when clicking
- [ ] Server logs show "TEST MODE: Creating checkout session"
- [ ] Redirected to Stripe Checkout (test mode)
- [ ] Used test card `4242 4242 4242 4242`
- [ ] Webhook fired and logged "TEST MODE WEBHOOK FIRED"
- [ ] Successfully redirected to `/payment/success?session_id=cs_test_...`
- [ ] PDF report generated and sent via email

---

## 10. Common Issues

### Issue: "STRIPE_SECRET_KEY is missing"
**Fix:** Make sure `.env.local` exists and contains `STRIPE_SECRET_KEY=sk_test_...`

### Issue: Webhook not firing
**Fix:** 
- Make sure Stripe CLI is running: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
- Check that `STRIPE_WEBHOOK_SECRET` in `.env.local` matches the secret from Stripe CLI
- Restart dev server after updating webhook secret

### Issue: Wrong base URL
**Fix:** Set `NEXT_PUBLIC_BASE_URL=http://localhost:3000` in `.env.local`

### Issue: Using live keys instead of test keys
**Fix:** Make sure all keys in `.env.local` start with:
- `sk_test_` (not `sk_live_`)
- `price_test_` (not `price_`)
- `whsec_` (webhook secret format is the same for test/live)

---

## 11. Switching Back to Production

When ready to deploy to production:

1. **Remove or rename `.env.local`** (so it doesn't override production env vars)
2. **Set production env vars in Vercel Dashboard:**
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_PRICE_ID=price_...` (live price ID)
   - `STRIPE_WEBHOOK_SECRET=whsec_...` (from Stripe Dashboard, Live mode)
   - `NEXT_PUBLIC_BASE_URL=https://balloonsight.com`
3. **Deploy to Vercel**
4. **Configure webhook in Stripe Dashboard (Live mode):**
   - Endpoint: `https://balloonsight.com/api/stripe-webhook`
   - Event: `checkout.session.completed`

---

## Quick Reference

### Stripe CLI Command:
```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

### Test Card:
- Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Expected Console Logs:
- "CLICKED DOWNLOAD BUTTON"
- "STARTING CREATE CHECKOUT"
- "TEST MODE: Creating checkout session"
- "TEST MODE WEBHOOK FIRED"
- "REDIRECTING TO STRIPE: https://checkout.stripe.com/c/pay/cs_test_..."

---

**Your environment is now in TEST MODE!** 🎉

Follow the steps above to test payments locally without using live Stripe keys.

