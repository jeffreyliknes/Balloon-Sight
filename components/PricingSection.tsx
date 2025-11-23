"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function PricingSection() {

  return (
    <section id="pricing" className="w-full bg-[#F6D6CA] py-24 text-brand-primary">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Pay per insight</h2>
          <p className="text-lg font-medium opacity-80 max-w-2xl mx-auto">
            Free scan. C$12 for the full PDF report. No subscription. No commitment. Just actionable insights when you need them.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white p-10 rounded-2xl border-4 border-secondary shadow-xl flex flex-col text-center">
            <div className="mb-8">
              <div className="text-5xl font-black text-brand-primary mb-2">C$12</div>
              <p className="text-sm opacity-70 font-medium">One-time scan</p>
            </div>
            <ul className="space-y-4 mb-8 text-left">
              <li className="flex items-start gap-3 text-sm font-bold">
                <Check size={18} className="text-secondary shrink-0 stroke-[3px]" />
                <span>Complete schema & structured data audit</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold">
                <Check size={18} className="text-secondary shrink-0 stroke-[3px]" />
                <span>Metadata & content clarity score</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold">
                <Check size={18} className="text-secondary shrink-0 stroke-[3px]" />
                <span>Persona clarity + niche positioning</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold">
                <Check size={18} className="text-secondary shrink-0 stroke-[3px]" />
                <span>Crawlability & technical visibility check</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold">
                <Check size={18} className="text-secondary shrink-0 stroke-[3px]" />
                <span>Brand distinctiveness score</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold">
                <Check size={18} className="text-secondary shrink-0 stroke-[3px]" />
                <span>Prioritized fixes by business impact</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-bold">
                <Check size={18} className="text-secondary shrink-0 stroke-[3px]" />
                <span>Professional PDF report delivered instantly</span>
              </li>
            </ul>
            <p className="text-xs opacity-60 mb-6 font-medium">Free scan shows score + persona. Full report unlocks everything.</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-secondary text-white hover:bg-secondary/90 rounded-full font-bold h-14 text-lg shadow-lg"
            >
              Start free scan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

