"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "What does Balloon Sight do?",
    a: "It analyzes your website for AI visibility and creates a full report with recommendations."
  },
  {
    q: "Do I need to pay to scan my website?",
    a: "The initial scan is free. You only pay if you want the full PDF report with detailed breakdowns."
  },
  {
    q: "What formats can I download?",
    a: "Right now we offer a downloadable branded PDF report. More formats will be added soon."
  },
  {
    q: "How long does the report take?",
    a: "Usually between 10–60 seconds after checkout. It is emailed directly to you."
  },
  {
    q: "Do you store my website data?",
    a: "We temporarily process scan results to generate the report, but we do not permanently store your data unless required for future features."
  }
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#F6D6CA] font-sans selection:bg-accent/20">
      <Navbar />
      
      <section className="max-w-3xl mx-auto py-24 px-6 text-brand-primary">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center">Frequently Asked Questions</h1>

            <div className="space-y-6">
                {faqs.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border-2 border-brand-primary/5">
                    <button
                        onClick={() => setOpen(open === idx ? null : idx)}
                        className="w-full text-left flex justify-between items-center text-lg font-bold text-brand-primary"
                    >
                        {item.q}
                        <span className="text-2xl font-light text-brand-primary/50">{open === idx ? "−" : "+"}</span>
                    </button>

                    {open === idx && (
                        <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 text-brand-primary/70 font-medium leading-relaxed"
                        >
                            {item.a}
                        </motion.p>
                    )}
                    </div>
                ))}
            </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

