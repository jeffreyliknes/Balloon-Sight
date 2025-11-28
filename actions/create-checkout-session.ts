"use server";

import { stripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

export async function createCheckoutSession(domain: string, amount: number = 1600, currency: string = "cad") {
  const baseUrl = getBaseUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "AI Visibility Report",
              description: `Full AI visibility audit report for ${domain}`,
            },
            unit_amount: amount, // C$16.00 = 1600 cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      client_reference_id: domain, // This is the key - pass domain here
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancelled`,
    });

    if (session.url) {
      return { url: session.url };
    } else {
      throw new Error("Failed to create session URL");
    }
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return { error: error.message };
  }
}

