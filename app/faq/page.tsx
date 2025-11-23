"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

const faqs = [
  {
    q: "What is AI visibility?",
    a: "AI visibility measures how likely your site is to appear in AI search results (ChatGPT, Perplexity, Gemini, Claude). Unlike traditional SEO, AI models read summaries, not keyword rankings. Your schema, persona clarity, and technical signals determine if you get cited."
  },
  {
    q: "How is this different from SEO?",
    a: "Traditional SEO optimizes for Google's algorithm. AI visibility optimizes for how AI models understand and cite your site. AI doesn't crawl pages like search engines—it reads summaries. Schema, persona, and niche positioning matter more than keywords."
  },
  {
    q: "Do I need to pay to scan my website?",
    a: "No. The initial scan is free. You get your AI Visibility Score (0-100) and persona analysis instantly. Pay C$12 only if you want the full PDF report with detailed breakdowns, prioritized fixes, and actionable recommendations."
  },
  {
    q: "How long does the report take?",
    a: "The free scan takes ~30 seconds. The full PDF report is generated and emailed to you within 10–60 seconds after payment. No waiting, no delays."
  },
  {
    q: "Do you store my website data?",
    a: "We temporarily process scan results to generate your report, but we do not permanently store your website data. Your privacy matters. We only keep what's necessary for report delivery."
  },
  {
    q: "What if my score is low?",
    a: "Low scores are fixable. Our report prioritizes fixes by business impact. Start with schema, then persona clarity, then crawlability. Most sites see improvements within days of implementing our recommendations."
  },
  {
    q: "Can I scan multiple sites?",
    a: "Yes. Each scan is C$12. Scan as many sites as you need. No subscription, no limits. Pay per insight."
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

