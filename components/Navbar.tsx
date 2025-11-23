"use client";

import { Button } from "@/components/ui/button";
import { BalloonSightLogo } from "@/components/BalloonSightLogo";

export function Navbar() {
  return (
    <nav className="w-full bg-brand-primary relative z-10">
      <div className="w-full px-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto py-6">
        <div className="flex items-center gap-3 font-serif font-black text-3xl tracking-tight text-white">
             <BalloonSightLogo size={200} />
        </div>
        <div className="hidden md:flex items-center gap-8 font-bold text-white/90">
          <a href="/#features" className="hover:text-accent transition-colors">Why It Matters</a>
          <a href="/#pricing" className="hover:text-accent transition-colors">Plans</a>
          <a href="/faq" className="hover:text-accent transition-colors">FAQ</a>
          <a href="/contact" className="hover:text-accent transition-colors">Contact</a>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="default" 
            className="bg-accent text-white hover:bg-accent/90 rounded-lg px-6 h-10 shadow-lg font-serif"
          >
            Start Analysis
          </Button>
        </div>
      </div>
    </nav>
  );
}

