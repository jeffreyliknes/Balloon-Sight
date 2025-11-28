#!/bin/bash

# Helper script to start Stripe webhook forwarding
# This should be run in a separate terminal while developing

echo "🎈 Starting Stripe webhook forwarding..."
echo ""
echo "This will forward webhook events to: http://localhost:3000/api/stripe-webhook"
echo ""
echo "⚠️  Keep this terminal open while testing payments"
echo ""
echo "Press Ctrl+C to stop"
echo ""
echo "=========================================="
echo ""

stripe listen --forward-to localhost:3000/api/stripe-webhook

