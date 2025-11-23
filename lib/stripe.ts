import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

function getStripeInstance(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is missing. Please set it in your environment variables.');
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-11-17.clover", // Stripe API version compatible with current SDK
      typescript: true,
    });
  }
  return stripeInstance;
}

// Lazy initialization - only creates instance when accessed at runtime
// This prevents build-time errors when STRIPE_SECRET_KEY is not set
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripeInstance();
    const value = (instance as any)[prop];
    // Return a proxy for objects to handle nested properties (e.g., stripe.webhooks.constructEvent)
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return new Proxy(value, {
        get(target, nestedProp) {
          const nestedValue = target[nestedProp];
          return typeof nestedValue === 'function' ? nestedValue.bind(target) : nestedValue;
        }
      });
    }
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});

