# Fix: Access Denied Error

## The Problem
Your app is trying to use a placeholder Payment Link URL: `buy.stripe.com/test_YOUR_TEST_PAYMENT_LINK_ID`

You need to create a real test Payment Link in Stripe and add it to your `.env.local` file.

## Quick Fix (5 minutes)

### Step 1: Create Test Payment Link in Stripe

1. **Go to Stripe Dashboard** (make sure you're in **Test mode**):
   - Visit: https://dashboard.stripe.com/test
   - Toggle the mode switch at the top to **"Test mode"** (should be orange/purple)

2. **Create a Payment Link**:
   - Go to **Products** → **Payment Links**
   - Click **"Create payment link"**
   - Set the price: **C$12.00 CAD**
   - Configure **Success URL**:
     ```
     http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}
     ```
     ⚠️ **Important:** Make sure to include `{CHECKOUT_SESSION_ID}` exactly as shown
   - Configure **Cancel URL**:
     ```
     http://localhost:3000/payment/cancelled
     ```
   - Click **"Save"** or **"Create"**

3. **Copy the Payment Link URL**:
   - After creating, you'll see the Payment Link URL
   - It should look like: `https://buy.stripe.com/test/abc123xyz456`
   - **Copy this entire URL**

### Step 2: Add to `.env.local`

1. **Open or create** `.env.local` in your project root

2. **Add this line** (replace with your actual Payment Link URL):
   ```bash
   NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL=https://buy.stripe.com/test/YOUR_ACTUAL_LINK_ID
   ```

   **Example:**
   ```bash
   NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL=https://buy.stripe.com/test/a1b2c3d4e5f6
   ```

3. **Save the file**

### Step 3: Restart Your Dev Server

1. **Stop** your dev server (Ctrl+C)
2. **Restart** it:
   ```bash
   npm run dev
   ```

### Step 4: Test Again

1. Go to `http://localhost:3000`
2. Enter a test URL
3. Click "Download Full Report — C$12"
4. You should now be redirected to the correct Stripe payment page (not the error)

## Verify Your Setup

Your `.env.local` should have at minimum:
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL=https://buy.stripe.com/test/...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Common Mistakes

❌ **Wrong:** `https://buy.stripe.com/test_YOUR_TEST_PAYMENT_LINK_ID` (placeholder)
✅ **Correct:** `https://buy.stripe.com/test/abc123xyz` (actual link)

❌ **Wrong:** Missing `/test/` in the URL
✅ **Correct:** URL contains `/test/` for test mode

❌ **Wrong:** Success URL doesn't include `{CHECKOUT_SESSION_ID}`
✅ **Correct:** Success URL must be: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}`

## Still Having Issues?

1. **Verify you're in Test mode** in Stripe Dashboard (orange/purple theme)
2. **Check the Payment Link URL** starts with `https://buy.stripe.com/test/`
3. **Restart your dev server** after changing `.env.local`
4. **Clear browser cache** if the old URL is cached

