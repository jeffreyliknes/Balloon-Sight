"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BalloonSightLogo } from "@/components/BalloonSightLogo";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-brand-primary relative z-50">
      <div className="w-full px-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto py-6">
        <Link href="/" className="flex items-center gap-3 font-serif font-black text-3xl tracking-tight text-white z-50">
             <BalloonSightLogo size={200} />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-bold text-white/90">
          <Link href="/#examples" className="hover:text-accent transition-colors">Examples</Link>
          <Link href="/#pricing" className="hover:text-accent transition-colors">Pricing</Link>
          <Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link>
          <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="default" 
            className="bg-accent text-white hover:bg-accent/90 rounded-lg px-6 h-10 shadow-lg font-serif"
          >
            Scan your site now
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white z-50 relative" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-[#551121] absolute top-full left-0 w-full border-t border-white/10 overflow-hidden shadow-xl"
            >
                <div className="flex flex-col p-6 space-y-6 font-bold text-white text-center">
                    <Link href="/#examples" onClick={() => setIsOpen(false)} className="py-2 border-b border-white/5">Examples</Link>
                    <Link href="/#pricing" onClick={() => setIsOpen(false)} className="py-2 border-b border-white/5">Pricing</Link>
                    <Link href="/faq" onClick={() => setIsOpen(false)} className="py-2 border-b border-white/5">FAQ</Link>
                    <Link href="/contact" onClick={() => setIsOpen(false)} className="py-2 border-b border-white/5">Contact</Link>
                    <Button 
                        onClick={() => {
                            window.location.href = '/';
                            setIsOpen(false);
                        }}
                        className="bg-accent text-white w-full mt-4"
                    >
                        Scan your site now
                    </Button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
