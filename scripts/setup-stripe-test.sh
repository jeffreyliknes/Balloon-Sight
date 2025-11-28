#!/bin/bash

# Stripe Test Environment Setup Script
# This script helps you set up the Stripe test environment

echo "🎈 BalloonSight - Stripe Test Environment Setup"
echo "=============================================="
echo ""

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo "❌ Stripe CLI is not installed."
    echo ""
    echo "Install it with:"
    echo "  brew install stripe/stripe-cli/stripe"
    echo ""
    echo "Or download from: https://github.com/stripe/stripe-cli/releases"
    exit 1
fi

echo "✅ Stripe CLI is installed"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Resend API Key (for email delivery)
RESEND_API_KEY=re_YOUR_RESEND_API_KEY_HERE
REPORT_SENDER_EMAIL=reports@yourdomain.com

# OpenAI API Key (for AI-powered report generation)
OPENAI_API_KEY=sk-YOUR_OPENAI_API_KEY_HERE

# Brand Color (optional)
BRAND_COLOR_PRIMARY=#551121
EOF
    echo "✅ Created .env.local file"
    echo ""
    echo "⚠️  Please edit .env.local and add your API keys"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Check if user is logged in to Stripe CLI
echo "🔐 Checking Stripe CLI login status..."
if stripe config --list &> /dev/null; then
    echo "✅ Stripe CLI is configured"
else
    echo "⚠️  Stripe CLI is not logged in"
    echo ""
    echo "Run: stripe login"
    echo ""
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Get your Stripe test API key:"
echo "   → https://dashboard.stripe.com/test/apikeys"
echo "   → Copy the Secret key (sk_test_...)"
echo "   → Add to .env.local as STRIPE_SECRET_KEY"
echo ""
echo "2. Start webhook forwarding (in a separate terminal):"
echo "   → stripe listen --forward-to localhost:3000/api/stripe-webhook"
echo "   → Copy the webhook secret (whsec_...)"
echo "   → Add to .env.local as STRIPE_WEBHOOK_SECRET"
echo ""
echo "3. Add other required API keys to .env.local:"
echo "   → RESEND_API_KEY (for email)"
echo "   → OPENAI_API_KEY (for AI content)"
echo ""
echo "4. Start your development server:"
echo "   → npm run dev"
echo ""
echo "5. Test with Stripe test card:"
echo "   → Card: 4242 4242 4242 4242"
echo "   → Any future expiry, any CVC"
echo ""
echo "📖 For detailed instructions, see: STRIPE_TEST_SETUP.md"
echo ""

