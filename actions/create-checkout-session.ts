"use server";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function createCheckoutSession(priceId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
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

