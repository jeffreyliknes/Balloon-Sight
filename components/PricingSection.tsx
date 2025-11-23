"use client";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

export function PricingSection() {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    setLoadingPriceId(priceId);
    const result = await createCheckoutSession(priceId);
    if (result.url) {
      window.location.href = result.url;
    } else {
      console.error("Checkout error:", result.error);
      setLoadingPriceId(null);
    }
  };

  return (
    <section id="pricing" className="w-full bg-[#F6D6CA] py-24 text-brand-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Simple Pricing</h2>
          <p className="text-lg font-medium opacity-80">
            Start with a free audit, or upgrade for deep-dive insights and competitor analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1: Free */}
          <div className="bg-white/50 p-8 rounded-2xl border-2 border-white/50 flex flex-col relative">
            <div className="mb-6">
              <h3 className="text-xl font-bold font-serif mb-2">Hobbyist</h3>
              <div className="text-4xl font-black">$0</div>
              <p className="text-sm opacity-70 font-medium mt-2">Forever free</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm font-bold opacity-80">
                <Check size={18} className="text-secondary shrink-0" />
                <span>Basic Visibility Score</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold opacity-80">
                <Check size={18} className="text-secondary shrink-0" />
                <span>Persona Detection</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold opacity-80">
                <Check size={18} className="text-secondary shrink-0" />
                <span>3 Scans / Month</span>
              </li>
            </ul>
            <Button className="w-full bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 rounded-full font-bold" disabled>
              Current Plan
            </Button>
          </div>

          {/* Tier 2: Pro (Highlighted) */}
          <div className="bg-white p-8 rounded-2xl border-4 border-secondary shadow-xl scale-105 relative z-10 flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Most Popular
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold font-serif mb-2 text-secondary">Professional</h3>
              <div className="text-4xl font-black">C$12</div>
              <p className="text-sm opacity-70 font-medium mt-2">One-time payment</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm font-bold">
                <Check size={18} className="text-secondary shrink-0 stroke-[3px]" />
                <span>Everything in Hobbyist</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold">
                <Check size={18} className="text-secondary shrink-0 stroke-[3px]" />
                <span>Deep Dive Technical Analysis</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold">
                <Check size={18} className="text-secondary shrink-0 stroke-[3px]" />
                <span>Competitor Comparison</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold">
                <Check size={18} className="text-secondary shrink-0 stroke-[3px]" />
                <span>Downloadable PDF Report</span>
              </li>
            </ul>
            <Button 
              onClick={() => handleCheckout("price_12345_pro")} // Placeholder Price ID
              className="w-full bg-secondary text-white hover:bg-secondary/90 rounded-full font-bold h-12 text-lg shadow-lg"
              disabled={loadingPriceId === "price_12345_pro"}
            >
              {loadingPriceId === "price_12345_pro" ? <Loader2 className="animate-spin" /> : "Get Pro Audit"}
            </Button>
          </div>

          {/* Tier 3: Agency */}
          <div className="bg-white/80 p-8 rounded-2xl border-2 border-brand-primary/10 flex flex-col relative">
            <div className="mb-6">
              <h3 className="text-xl font-bold font-serif mb-2">Agency</h3>
              <div className="text-4xl font-black">$99</div>
              <p className="text-sm opacity-70 font-medium mt-2">Per month</p>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm font-bold opacity-80">
                <Check size={18} className="text-secondary shrink-0" />
                <span>Unlimited Scans</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold opacity-80">
                <Check size={18} className="text-secondary shrink-0" />
                <span>White-label Reports</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold opacity-80">
                <Check size={18} className="text-secondary shrink-0" />
                <span>API Access</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold opacity-80">
                <Check size={18} className="text-secondary shrink-0" />
                <span>Priority Support</span>
              </li>
            </ul>
            <Button 
               onClick={() => handleCheckout("price_12345_agency")} // Placeholder Price ID
               className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 rounded-full font-bold"
               disabled={loadingPriceId === "price_12345_agency"}
            >
               {loadingPriceId === "price_12345_agency" ? <Loader2 className="animate-spin" /> : "Contact Sales"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

