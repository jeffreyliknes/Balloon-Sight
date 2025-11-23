"use client";

import { BalloonSightLogo } from "@/components/BalloonSightLogo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-brand-primary flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[40px] p-12 max-w-lg w-full shadow-2xl flex flex-col items-center"
      >
        <div className="mb-8 p-4 bg-secondary/10 rounded-full">
            <BalloonSightLogo size={80} />
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-brand-primary mb-4">Payment Successful!</h1>
        <p className="text-brand-primary/70 text-lg font-medium mb-8">
          Thank you for upgrading to Pro. Your deep-dive audit is ready to start.
        </p>

        <Link href="/">
          <Button className="h-14 px-10 rounded-full bg-secondary hover:bg-secondary/90 text-white text-lg font-bold shadow-lg">
            Run Your Pro Scan
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}

