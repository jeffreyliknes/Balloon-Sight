# TEST MODE Setup - Final Summary

## ✅ Your environment is now in TEST MODE

---

## 📋 Updated .env.local File

Create `.env.local` in the root directory with:

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

**Important:** Replace all `YOUR_*_HERE` placeholders with actual test values from Stripe Dashboard.

---

## 📝 Updated create-checkout Handler

**File:** `app/api/create-checkout/route.ts`

```typescript
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    
    console.log("TEST MODE: Creating checkout session");
    console.log("Using Price ID:", process.env.STRIPE_PRICE_ID);
    console.log("Domain received:", domain);
    
    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_PRICE_ID) {
      return NextResponse.json(
        { error: "STRIPE_PRICE_ID is not configured" },
        { status: 500 }
      );
    }

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

**Key Changes:**
- ✅ Added debug logs: "TEST MODE: Creating checkout session"
- ✅ Logs Price ID and domain received
- ✅ Logs base URL being used
- ✅ Logs session ID and redirect URL after creation
- ✅ Uses `getBaseUrl()` which returns `http://localhost:3000` in development
- ✅ Success/cancel URLs use localhost in test mode

---

## 📝 Updated app/page.tsx Button Handler

**File:** `app/page.tsx` (lines 908-950)

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
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("CREATE CHECKOUT FAILED", errorText);
        try {
          const errorJson = JSON.parse(errorText);
          alert(errorJson.error || "Failed to start payment. Please try again.");
        } catch {
          alert(errorText || "Failed to start payment. Please try again.");
        }
        return;
      }
      
      const data = await response.json();
      if (data?.url) {
        console.log("REDIRECTING TO STRIPE:", data.url);
        window.location.href = data.url;
      } else {
        console.error("NO URL RETURNED FROM CHECKOUT");
        alert("Invalid response from server. Please try again.");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      alert("Network error. Please check your connection and try again.");
    }
  }}
  className="h-16 px-10 rounded-full bg-accent hover:bg-accent/90 text-white text-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
>
  Download Full Report — C$16
</Button>
```

**Key Features:**
- ✅ Starts with `e.preventDefault()` and `e.stopPropagation()`
- ✅ Debug logs: "CLICKED DOWNLOAD BUTTON" and "STARTING CREATE CHECKOUT"
- ✅ POST request to `/api/create-checkout` with correct headers
- ✅ Error handling with full response text logging
- ✅ Redirects to Stripe Checkout URL if successful
- ✅ Explicit `type="button"` to prevent form submission

---

## 📝 Updated app/page.tsx - TEST MODE Banner

**File:** `app/page.tsx` (lines 720-724)

```typescript
return (
  <main className="min-h-screen bg-[#F6D6CA] font-sans selection:bg-accent/20 overflow-x-hidden">
    {process.env.NODE_ENV === "development" && (
      <div className="bg-yellow-500 text-black text-center py-2 font-bold">
        TEST MODE ACTIVE — Stripe Test Payments Only
      </div>
    )}
    <Navbar />
    {/* ... rest of component ... */}
  </main>
);
```

**Key Features:**
- ✅ Only shows in development mode
- ✅ Yellow banner at top of page
- ✅ Clear indication that test mode is active

---

## 📝 Updated Webhook Handler

**File:** `app/api/stripe-webhook/route.ts` (lines 19-31)

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

**Key Features:**
- ✅ Logs "TEST MODE WEBHOOK FIRED" when webhook is received
- ✅ Logs the event type for debugging
- ✅ Enhanced error logging for signature verification failures

---

## 🚀 Instructions for Running Test Mode

### Step 1: Create .env.local

Create `.env.local` in the project root with the test values shown above.

### Step 2: Get Test Values from Stripe

1. **STRIPE_SECRET_KEY:**
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy the "Secret key" (starts with `sk_test_`)

2. **STRIPE_PRICE_ID:**
   - Go to https://dashboard.stripe.com/test/products
   - Create a test product with price C$16.00 CAD
   - Copy the Price ID (starts with `price_test_`)

3. **STRIPE_WEBHOOK_SECRET:**
   - See Step 3 below (from Stripe CLI)

### Step 3: Start Stripe CLI Webhook Listener

In a **separate terminal**, run:

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

**Output will show:**
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**Copy the `whsec_` value** and add it to `.env.local` as:
```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Step 4: Restart Development Server

After creating/updating `.env.local`:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

**Important:** Environment variables are only loaded when the server starts. You must restart after changing `.env.local`.

### Step 5: Test a Payment

1. Open `http://localhost:3000`
2. You should see the yellow "TEST MODE ACTIVE" banner
3. Enter a URL and run a scan
4. Click "Download Full Report — C$16"
5. Check browser console for logs:
   - "CLICKED DOWNLOAD BUTTON"
   - "STARTING CREATE CHECKOUT"
6. You'll be redirected to Stripe Checkout (test mode)
7. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/34)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
8. Complete payment
9. Check terminal logs for:
   - "TEST MODE: Creating checkout session"
   - "TEST MODE WEBHOOK FIRED"
   - "Webhook event type: checkout.session.completed"

### Step 6: View Debug Logs

**Server Terminal (npm run dev):**
- "TEST MODE: Creating checkout session"
- "Using Price ID: price_test_xxxxx"
- "Domain received: https://example.com"
- "Using base URL: http://localhost:3000"
- "TEST MODE: Checkout session created: cs_test_xxxxx"
- "TEST MODE: Redirect URL: https://checkout.stripe.com/..."

**Stripe CLI Terminal:**
- "TEST MODE WEBHOOK FIRED"
- "Webhook event type: checkout.session.completed"
- "✔ Payment received from..."

**Browser Console (F12):**
- "CLICKED DOWNLOAD BUTTON"
- "STARTING CREATE CHECKOUT"
- "REDIRECTING TO STRIPE: https://checkout.stripe.com/..."

### Step 7: Confirm Webhook Fired

- ✅ Check Stripe CLI terminal for "TEST MODE WEBHOOK FIRED"
- ✅ Check dev server terminal for payment processing logs
- ✅ Check Stripe Dashboard → Webhooks → Events for `checkout.session.completed`

---

## ✅ Checklist

- [ ] Created `.env.local` with test values
- [ ] Set `STRIPE_SECRET_KEY=sk_test_...`
- [ ] Set `STRIPE_PRICE_ID=price_test_...`
- [ ] Set `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
- [ ] Set `STRIPE_WEBHOOK_SECRET=whsec_...` (from Stripe CLI)
- [ ] Restarted dev server after updating `.env.local`
- [ ] Running Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
- [ ] See "TEST MODE ACTIVE" banner on page
- [ ] Console shows "CLICKED DOWNLOAD BUTTON" when clicking
- [ ] Server logs show "TEST MODE: Creating checkout session"
- [ ] Redirected to Stripe Checkout (test mode)
- [ ] Used test card `4242 4242 4242 4242`
- [ ] Webhook fired and logged "TEST MODE WEBHOOK FIRED"
- [ ] Successfully redirected to `/payment/success?session_id=cs_test_...`

---

## 🎯 Quick Reference

**Stripe CLI Command:**
```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

**Test Card:**
- Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Expected Logs:**
- Browser: "CLICKED DOWNLOAD BUTTON", "STARTING CREATE CHECKOUT"
- Server: "TEST MODE: Creating checkout session", "TEST MODE: Checkout session created"
- Webhook: "TEST MODE WEBHOOK FIRED", "Webhook event type: checkout.session.completed"

---

**Your environment is now in TEST MODE!** 🎉

All code has been updated with debug logs and test mode configurations. Follow the instructions above to test payments locally.

