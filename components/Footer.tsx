"use client";

import { BalloonSightLogo } from "@/components/BalloonSightLogo";

export function Footer() {
  return (
    <footer className="w-full bg-brand-primary text-white py-12 md:py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 font-serif font-bold text-2xl tracking-tight mb-6 text-white">
                <BalloonSightLogo size={40} />
                BalloonSight
              </div>
              <p className="text-white/70 max-w-md leading-relaxed text-lg">
                  Optimize your digital footprint for the new era of AI-powered search.
              </p>
          </div>
          <div>
              <h4 className="font-bold text-lg mb-6 text-accent">Product</h4>
              <ul className="space-y-4 text-white/80 font-medium">
                  <li><a href="/#features" className="hover:text-white hover:underline">How It Works</a></li>
                  <li><a href="/#pricing" className="hover:text-white hover:underline">Pricing</a></li>
                  <li><a href="/faq" className="hover:text-white hover:underline">FAQ</a></li>
              </ul>
          </div>
          <div>
              <h4 className="font-bold text-lg mb-6 text-accent">Company</h4>
              <ul className="space-y-4 text-white/80 font-medium">
                  <li><a href="/contact" className="hover:text-white hover:underline">Contact</a></li>
              </ul>
          </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} BalloonSight Inc. All rights reserved.
      </div>
    </footer>
  );
}

