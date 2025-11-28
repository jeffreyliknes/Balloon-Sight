# Production Debug Report - BalloonSight

**Generated:** $(date)
**Target:** https://balloonsight.com

## Summary

This report provides a comprehensive diagnostic analysis of the live production deployment on Vercel, focusing on Stripe Checkout Session configuration, environment variables, redirect URLs, and webhook functionality.

---

## 🟢 Working

### Code Structure
- ✅ **Checkout Route** (`app/api/create-checkout/route.ts`)
  - Uses `process.env.STRIPE_PRICE_ID` (not hardcoded)
  - `success_url` includes `{CHECKOUT_SESSION_ID}` placeholder
  - `cancel_url` points to `/payment/cancelled`
  - Uses `getBaseUrl()` function (not hardcoded URL)
  - Both `client_reference_id` and `metadata.domain` are set correctly

- ✅ **Frontend Button** (`app/page.tsx`)
  - Calls `/api/create-checkout` API endpoint
  - Does NOT redirect to Payment Links
  - No references to `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL`
  - No hardcoded Stripe URLs

- ✅ **Base URL Logic** (`lib/utils.ts`)
  - Production logic: `process.env.NEXT_PUBLIC_BASE_URL || https://${process.env.VERCEL_URL || 'balloonsight.com'}`
  - Checks `process.env.VERCEL === "1"` correctly
  - Falls back to localhost in development

- ✅ **Webhook Handler** (`app/api/stripe-webhook/route.ts`)
  - Uses `process.env.STRIPE_WEBHOOK_SECRET` for signature verification
  - Handles `checkout.session.completed` events
  - Extracts domain from both `client_reference_id` and `metadata.domain`
  - Uses `getBaseUrl()` for internal API calls

- ✅ **Download Report Endpoint** (`app/api/download-report/route.ts`)
  - Retrieves session by `session_id`
  - Extracts domain from both `client_reference_id` and `metadata.domain`
  - Compatible with Checkout Sessions

- ✅ **Payment Link Cleanup**
  - No `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_URL` references in `app/` directory
  - No `buy.stripe.com` URLs in code
  - No Payment Link redirect logic remaining

---

## 🟡 Suspicious (Requires Live Testing)

### Environment Variables
The following checks require testing the live endpoints to verify:

1. **STRIPE_SECRET_KEY**
   - ⚠️ **Action Required:** Test live endpoint to verify it starts with `sk_live_` (not `sk_test_`)
   - **Test:** Call `https://balloonsight.com/api/debug-env-live?token=YOUR_SECRET_TOKEN`

2. **STRIPE_PRICE_ID**
   - ⚠️ **Action Required:** Verify it starts with `price_` (not `prod_`)
   - **Test:** Check diagnostic endpoint response

3. **NEXT_PUBLIC_BASE_URL**
   - ⚠️ **Action Required:** Verify it equals `https://balloonsight.com` (not localhost)
   - **Test:** Call `https://balloonsight.com/api/debug-base-url?token=YOUR_SECRET_TOKEN`

4. **STRIPE_WEBHOOK_SECRET**
   - ⚠️ **Action Required:** Verify it starts with `whsec_` and is the LIVE webhook secret
   - **Test:** Check diagnostic endpoint response

5. **RESEND_API_KEY & REPORT_SENDER_EMAIL**
   - ⚠️ **Action Required:** Verify both are set and valid
   - **Test:** Check diagnostic endpoint response

### Live Endpoint Testing
- ⚠️ **Action Required:** Test `POST https://balloonsight.com/api/create-checkout`
  - **Expected:** Returns `{ "url": "https://checkout.stripe.com/c/pay/cs_live_..." }`
  - **Check:** URL should start with `https://checkout.stripe.com/c/pay/` (not `buy.stripe.com`)
  - **Check:** URL should contain `cs_live_` (not `cs_test_`)

---

## 🔴 Broken (Requires Immediate Fix)

### Potential Issues (Requires Live Verification)

1. **Environment Variables Not Set in Vercel**
   - If diagnostic endpoints return missing values, add them in Vercel Dashboard
   - **Fix:** Vercel Dashboard → Project → Settings → Environment Variables

2. **Wrong Base URL**
   - If `getBaseUrl()` returns localhost or wrong domain
   - **Fix:** Set `NEXT_PUBLIC_BASE_URL=https://balloonsight.com` in Vercel

3. **Test Keys in Production**
   - If `STRIPE_SECRET_KEY` starts with `sk_test_` instead of `sk_live_`
   - **Fix:** Replace with live key from Stripe Dashboard (Live mode)

4. **Wrong Price ID**
   - If `STRIPE_PRICE_ID` starts with `prod_` instead of `price_`
   - **Fix:** Use Price ID (starts with `price_`) not Product ID

5. **Webhook Not Configured**
   - If webhook secret is missing or incorrect
   - **Fix:** Configure webhook in Stripe Dashboard (Live mode) → Copy signing secret

---

## Diagnostic Endpoints

### 1. Environment Variable Check
**Endpoint:** `GET https://balloonsight.com/api/debug-env-live?token=YOUR_SECRET_TOKEN`

**Response includes:**
- Status of all environment variables
- Masked values (first 4 + last 4 characters)
- Validation results (✅/🟡/🔴)

**Security:** Requires `DEBUG_SECRET_TOKEN` query parameter in production

### 2. Base URL Resolution
**Endpoint:** `GET https://balloonsight.com/api/debug-base-url?token=YOUR_SECRET_TOKEN`

**Response includes:**
- Resolved base URL
- Environment variable values
- Success/cancel URL examples
- Analysis and recommendations

**Security:** Requires `DEBUG_SECRET_TOKEN` query parameter in production

---

## Testing Checklist

### Step 1: Test Diagnostic Endpoints
```bash
# Set a secret token in Vercel (optional, for production security)
# DEBUG_SECRET_TOKEN=your-secret-token

# Test environment variables
curl "https://balloonsight.com/api/debug-env-live?token=YOUR_SECRET_TOKEN"

# Test base URL resolution
curl "https://balloonsight.com/api/debug-base-url?token=YOUR_SECRET_TOKEN"
```

### Step 2: Test Checkout Endpoint
```bash
curl -X POST https://balloonsight.com/api/create-checkout \
  -H "Content-Type: application/json" \
  -d '{"domain": "https://example.com"}'
```

**Expected Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_live_..."
}
```

**Check:**
- ✅ URL starts with `https://checkout.stripe.com/c/pay/`
- ✅ URL contains `cs_live_` (not `cs_test_`)
- ❌ If URL starts with `buy.stripe.com` → Still using Payment Links
- ❌ If URL is undefined → Environment variables broken

### Step 3: Verify Stripe Dashboard
1. Go to Stripe Dashboard (Live mode)
2. Check recent Checkout Sessions
3. Verify:
   - `client_reference_id` is set
   - `metadata.domain` is set
   - `success_url` contains `{CHECKOUT_SESSION_ID}`
   - `cancel_url` points to `https://balloonsight.com/payment/cancelled`

### Step 4: Test Webhook
1. Check Vercel function logs for `/api/stripe-webhook`
2. Look for:
   - ✅ Successful webhook calls
   - ❌ Signature verification errors
   - ❌ Report generation errors
   - ❌ Email sending errors

---

## Fix Instructions

### If Environment Variables Are Missing

1. **Go to Vercel Dashboard**
   - Navigate to: Project → Settings → Environment Variables

2. **Add Required Variables:**
   ```
   STRIPE_SECRET_KEY=sk_live_... (from Stripe Dashboard, Live mode)
   STRIPE_PRICE_ID=price_... (from Stripe Dashboard, Live mode)
   NEXT_PUBLIC_BASE_URL=https://balloonsight.com
   STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe Dashboard, Live mode webhook)
   RESEND_API_KEY=re_... (from Resend Dashboard)
   REPORT_SENDER_EMAIL=report@balloonsight.com
   ```

3. **Redeploy**
   - Changes require redeployment
   - Vercel will automatically redeploy or trigger manually

### If Base URL Is Wrong

1. **Set in Vercel:**
   ```
   NEXT_PUBLIC_BASE_URL=https://balloonsight.com
   ```

2. **Verify:**
   - Call `/api/debug-base-url` endpoint
   - Should return `baseUrl: "https://balloonsight.com"`

### If Using Test Keys

1. **Get Live Keys from Stripe:**
   - Go to https://dashboard.stripe.com/apikeys (Live mode)
   - Copy Secret key (starts with `sk_live_`)
   - Go to https://dashboard.stripe.com/webhooks (Live mode)
   - Copy webhook signing secret (starts with `whsec_`)

2. **Update in Vercel:**
   - Replace test keys with live keys
   - Redeploy

### If Webhook Not Working

1. **Configure Webhook in Stripe:**
   - Go to https://dashboard.stripe.com/webhooks (Live mode)
   - Add endpoint: `https://balloonsight.com/api/stripe-webhook`
   - Select event: `checkout.session.completed`
   - Copy signing secret

2. **Update in Vercel:**
   - Set `STRIPE_WEBHOOK_SECRET` to the signing secret
   - Redeploy

3. **Test:**
   - Complete a test payment
   - Check Vercel logs for webhook activity

### If Checkout URL Is Wrong

1. **Verify Code is Deployed:**
   - Check that latest code is deployed to Vercel
   - Verify `app/api/create-checkout/route.ts` exists in deployment

2. **Check Environment Variables:**
   - Verify `STRIPE_PRICE_ID` is set correctly
   - Verify `STRIPE_SECRET_KEY` is live key

3. **Clear Build Cache:**
   - In Vercel, trigger a new deployment
   - This clears any cached builds

---

## Common Issues & Solutions

### Issue: Redirect goes to wrong URL after payment
**Cause:** `NEXT_PUBLIC_BASE_URL` not set or incorrect
**Fix:** Set `NEXT_PUBLIC_BASE_URL=https://balloonsight.com` in Vercel

### Issue: Checkout session not created
**Cause:** `STRIPE_PRICE_ID` missing or invalid
**Fix:** Verify Price ID in Stripe Dashboard, update in Vercel

### Issue: Webhook not receiving events
**Cause:** Webhook secret incorrect or webhook not configured
**Fix:** Reconfigure webhook in Stripe Dashboard, update secret in Vercel

### Issue: Domain not passed to webhook
**Cause:** Checkout session not setting `metadata.domain`
**Fix:** Verify code in `app/api/create-checkout/route.ts` sets `metadata: { domain }`

### Issue: Success page doesn't show session_id
**Cause:** `success_url` missing `{CHECKOUT_SESSION_ID}` placeholder
**Fix:** Verify `success_url` in checkout route includes placeholder

---

## Next Steps

1. **Test Diagnostic Endpoints**
   - Call `/api/debug-env-live` to check environment variables
   - Call `/api/debug-base-url` to verify base URL resolution

2. **Test Checkout Flow**
   - Make a test payment
   - Verify redirect to success page with `session_id`
   - Check Stripe Dashboard for session details

3. **Monitor Webhook Logs**
   - Check Vercel function logs for webhook activity
   - Verify PDF generation and email sending

4. **Fix Any Issues Found**
   - Follow fix instructions above
   - Redeploy after making changes

---

## Security Notes

- Diagnostic endpoints require `DEBUG_SECRET_TOKEN` in production
- Set `DEBUG_SECRET_TOKEN` in Vercel environment variables for production security
- Diagnostic endpoints mask sensitive values (only show first/last 4 characters)
- Consider disabling diagnostic endpoints in production after debugging

---

## Files Created

- `app/api/debug-env-live/route.ts` - Environment variable diagnostic endpoint
- `app/api/debug-base-url/route.ts` - Base URL resolution diagnostic endpoint
- `PRODUCTION_DEBUG_REPORT.md` - This diagnostic report

---

**Report Generated:** $(date)
**Status:** Ready for live testing

