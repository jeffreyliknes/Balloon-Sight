"use client";

import { useState, useTransition } from "react";
import { analyzeHtml } from "@/actions/analyze-url";
import { AnalysisResult } from "@/lib/types";
import { ScoreGauge } from "@/components/ScoreGauge";
import { PricingSection } from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Database, Layout, FileText, Sparkles, AlertCircle, ArrowRight, Loader2, Map, Compass, Check, ShieldCheck, TrendingUp, Globe, Smartphone, MessageSquare, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";

// --- Components ---

function HeroSection({ 
    url, 
    setUrl, 
    handleAnalyze, 
    isPending, 
    error 
}: { 
    url: string, 
    setUrl: (s: string) => void, 
    handleAnalyze: () => void, 
    isPending: boolean, 
    error: string | null 
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAnalyze();
  };

  return (
    <section className="w-full bg-brand-primary relative overflow-hidden pt-12 pb-24 lg:pb-32">
       <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            {/* Left Column: Text */}
            <div className="space-y-8 text-center lg:text-left">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-brand-primary font-bold text-xs uppercase tracking-widest shadow-sm mb-4">
                        <span>Be the site that AI chooses to remember</span> <ArrowRight size={14}/>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-white leading-[1.05]">
                        Your site is invisible to AI. <br/> Here's why.
                    </h1>
                    <p className="text-xl text-white/80 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                        Google traffic is dying. AI answers are the new search. We scan your site and show you exactly how to become the source that ChatGPT, Perplexity, and Claude remember.
                    </p>
                </motion.div>

                {/* Input Box */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-stretch gap-3 max-w-lg mx-auto lg:mx-0"
                >
                    <div className="flex flex-col sm:flex-row items-stretch gap-3">
                        <Button 
                            onClick={handleAnalyze} 
                            disabled={isPending}
                            className="h-14 px-8 rounded-lg bg-accent hover:bg-accent/90 text-white text-lg font-bold shadow-lg shrink-0 uppercase tracking-wide font-sans"
                        >
                            {isPending ? <Loader2 className="animate-spin" /> : "Scan your site now"}
                        </Button>
                        <Button 
                            onClick={() => document.getElementById("examples")?.scrollIntoView({ behavior: "smooth" })}
                            variant="outline"
                            className="h-14 px-8 rounded-lg bg-white/10 border-2 border-white/20 hover:bg-white/20 text-white text-lg font-bold shrink-0 uppercase tracking-wide font-sans"
                        >
                            View sample report
                        </Button>
                    </div>
                </motion.div>

                 {/* Analysis Input */}
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-md mx-auto lg:mx-0 bg-white/10 p-4 rounded-xl mt-8 border border-white/10 backdrop-blur-sm"
                 >
                     <label className="text-xs text-white/60 uppercase font-bold mb-2 block">Enter URL to Analyze</label>
                     <div className="flex gap-2">
                        <Input 
                            type="url" 
                            placeholder="https://your-domain.com" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-white text-brand-primary border-none h-10"
                        />
                        <Button onClick={handleAnalyze} size="sm" className="bg-white text-brand-primary hover:bg-white/90">Go</Button>
                     </div>
                     {error && <p className="text-accent text-sm mt-2 font-bold">{error}</p>}
                 </motion.div>
            </div>

            {/* Right Column: Hero Image */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative h-[500px] w-full hidden lg:block"
            >
                 <div className="absolute top-0 right-0 w-4/5 h-full bg-white/5 rounded-tl-[100px] rounded-br-[100px] overflow-hidden border-4 border-white/10 flex items-center justify-center">
                     <div className="relative w-full h-full flex items-center justify-center">
                        <Image 
                            src="/hero-travel-poster.png"
                            alt="BalloonSight - Mountain landscape with hot air balloon"
                            fill
                            className="object-cover rounded-tl-[100px] rounded-br-[100px]"
                            priority
                        />
                     </div>
                 </div>
            </motion.div>
       </div>
    </section>
  );
}

function ProblemSection() {
    return (
        <section className="w-full bg-[#6B1D2F] py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-white space-y-6"
                >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold">Why most sites are invisible to AI</h2>
                    <p className="text-white/70 text-lg max-w-md">
                        The shift from Google to AI answers changed everything. AI doesn't crawl pages like search engines—it reads summaries. If your schema is weak, your persona is generic, or your niche is unclear, you're invisible.
                    </p>
                    <p className="text-white/60 text-base max-w-md">
                        <strong className="text-white">The problem:</strong> You can't rely on Google anymore. AI uses summaries, not keyword rankings. Your technical signals and messaging clarity determine if you get cited.
                    </p>
                </motion.div>
                
                <div className="space-y-4">
                    {/* Stat Bar 1 - Peach */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#F6D6CA] p-6 rounded-xl flex items-center justify-between"
                    >
                         <div>
                             <div className="text-3xl font-serif font-bold text-brand-primary">Missing <span className="text-xl opacity-70">Schema</span></div>
                             <div className="text-brand-primary text-xs font-bold uppercase tracking-widest mt-1">No structured data = AI can't understand you</div>
                         </div>
                    </motion.div>
                    {/* Stat Bar 2 - Teal */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-secondary p-6 rounded-xl flex items-center justify-between"
                    >
                         <div>
                             <div className="text-3xl font-serif font-bold text-brand-primary">Generic <span className="text-xl opacity-70">Content</span></div>
                             <div className="text-brand-primary text-xs font-bold uppercase tracking-widest mt-1">No distinct persona = AI ignores you</div>
                         </div>
                    </motion.div>
                    {/* Stat Bar 3 - Yellow */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-warning p-6 rounded-xl flex items-center justify-between"
                    >
                         <div>
                             <div className="text-3xl font-serif font-bold text-brand-primary">Weak <span className="text-xl opacity-70">Niche</span></div>
                             <div className="text-brand-primary text-xs font-bold uppercase tracking-widest mt-1">No clear positioning = no citations</div>
                         </div>
                    </motion.div>
                    {/* Stat Bar 4 - Orange */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-accent p-6 rounded-xl flex items-center justify-between"
                    >
                         <div>
                             <div className="text-3xl font-serif font-bold text-brand-primary">Blocked <span className="text-xl opacity-70">Crawlers</span></div>
                             <div className="text-brand-primary text-xs font-bold uppercase tracking-widest mt-1">GPTBot blocked = zero visibility</div>
                         </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

function HowItWorksSection() {
    return (
        <section className="w-full bg-white py-24 text-brand-primary">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                 >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">How it works</h2>
                    <p className="text-lg font-medium opacity-80 max-w-2xl mx-auto">Three steps. Thirty seconds. One actionable report.</p>
                 </motion.div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-center"
                     >
                         <div className="w-20 h-20 rounded-full bg-brand-primary text-white flex items-center justify-center text-3xl font-black mx-auto mb-6">1</div>
                         <h3 className="text-2xl font-serif font-bold mb-4">Enter your domain</h3>
                         <p className="text-brand-primary/70 font-medium">Paste your URL. We scan your site's technical signals, schema, and content structure.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center"
                     >
                         <div className="w-20 h-20 rounded-full bg-secondary text-white flex items-center justify-center text-3xl font-black mx-auto mb-6">2</div>
                         <h3 className="text-2xl font-serif font-bold mb-4">Get your score</h3>
                         <p className="text-brand-primary/70 font-medium">Instant AI Visibility Score (0-100). See your persona, schema health, and crawlability in ~30 seconds.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-center"
                     >
                         <div className="w-20 h-20 rounded-full bg-accent text-white flex items-center justify-center text-3xl font-black mx-auto mb-6">3</div>
                         <h3 className="text-2xl font-serif font-bold mb-4">Download PDF</h3>
                         <p className="text-brand-primary/70 font-medium">Pay C$12 for the full report. Get prioritized fixes, technical audits, and recommendations—delivered to your inbox.</p>
                     </motion.div>
                 </div>
            </div>
        </section>
    )
}

function WhatYouGetSection() {
    return (
        <section className="w-full bg-[#F6D6CA] py-24 text-brand-primary">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 max-w-lg"
                 >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">What you get</h2>
                    <p className="text-lg font-medium opacity-80">Your complete AI visibility audit, delivered as a professional PDF report.</p>
                 </motion.div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white p-8 rounded-xl hover:shadow-xl transition-shadow"
                     >
                         <div className="w-14 h-14 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary mb-4">
                             <Database size={28} />
                         </div>
                         <h3 className="font-bold text-lg mb-3">Schema & Structured Data Audit</h3>
                         <p className="text-sm opacity-70">Complete JSON-LD validation. Missing schema types, broken markup, and entity clarity scores.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white p-8 rounded-xl hover:shadow-xl transition-shadow"
                     >
                         <div className="w-14 h-14 rounded-lg bg-warning/20 flex items-center justify-center text-brand-primary mb-4">
                             <FileText size={28} />
                         </div>
                         <h3 className="font-bold text-lg mb-3">Metadata & Content Clarity Score</h3>
                         <p className="text-sm opacity-70">Title tags, meta descriptions, heading structure, and content readability for AI parsing.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white p-8 rounded-xl hover:shadow-xl transition-shadow"
                     >
                         <div className="w-14 h-14 rounded-lg bg-accent/20 flex items-center justify-center text-accent mb-4">
                             <Sparkles size={28} />
                         </div>
                         <h3 className="font-bold text-lg mb-3">Persona Clarity + Niche Positioning</h3>
                         <p className="text-sm opacity-70">Brand voice analysis. Are you Expert, Merchant, or Robot? How distinct is your niche?</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white p-8 rounded-xl hover:shadow-xl transition-shadow"
                     >
                         <div className="w-14 h-14 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4">
                             <Eye size={28} />
                         </div>
                         <h3 className="font-bold text-lg mb-3">Crawlability & Technical Visibility</h3>
                         <p className="text-sm opacity-70">GPTBot access, robots.txt, sitemap health, and response times. Can AI actually read your site?</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-white p-8 rounded-xl hover:shadow-xl transition-shadow"
                     >
                         <div className="w-14 h-14 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary mb-4">
                             <TrendingUp size={28} />
                         </div>
                         <h3 className="font-bold text-lg mb-3">Brand Distinctiveness Score</h3>
                         <p className="text-sm opacity-70">How unique is your messaging? Generic content gets ignored. Distinct brands get cited.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-white p-8 rounded-xl hover:shadow-xl transition-shadow"
                     >
                         <div className="w-14 h-14 rounded-lg bg-warning/20 flex items-center justify-center text-brand-primary mb-4">
                             <Check size={28} />
                         </div>
                         <h3 className="font-bold text-lg mb-3">Prioritized Fixes by Impact</h3>
                         <p className="text-sm opacity-70">Actionable recommendations ranked by business impact. Fix what matters first.</p>
                     </motion.div>
                 </div>
            </div>
        </section>
    )
}

function ExamplesSection() {
    return (
        <section id="examples" className="w-full bg-white py-24 text-brand-primary">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                 >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Sample reports</h2>
                    <p className="text-lg font-medium opacity-80 max-w-2xl mx-auto">See how different sites score. Real examples, real insights.</p>
                 </motion.div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#F6D6CA] p-8 rounded-2xl border-2 border-brand-primary/10"
                     >
                         <div className="text-center mb-6">
                             <div className="text-6xl font-black text-brand-primary mb-2">87</div>
                             <div className="text-sm font-bold uppercase tracking-widest text-brand-primary/60">AI Visibility Score</div>
                         </div>
                         <h3 className="font-bold text-xl mb-3">Boutique Hotel</h3>
                         <p className="text-sm opacity-70 mb-4">Strong schema, clear persona, but missing structured reviews. Schema score: 92. Persona: Expert. Niche: Distinct.</p>
                         <div className="space-y-2 text-xs">
                             <div className="flex justify-between"><span className="opacity-70">Schema</span><span className="font-bold">92/100</span></div>
                             <div className="flex justify-between"><span className="opacity-70">Persona</span><span className="font-bold">85/100</span></div>
                             <div className="flex justify-between"><span className="opacity-70">Crawlability</span><span className="font-bold">88/100</span></div>
                         </div>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#F6D6CA] p-8 rounded-2xl border-2 border-brand-primary/10"
                     >
                         <div className="text-center mb-6">
                             <div className="text-6xl font-black text-brand-primary mb-2">42</div>
                             <div className="text-sm font-bold uppercase tracking-widest text-brand-primary/60">AI Visibility Score</div>
                         </div>
                         <h3 className="font-bold text-xl mb-3">SaaS Startup</h3>
                         <p className="text-sm opacity-70 mb-4">Generic messaging, no schema, blocked crawlers. Schema score: 15. Persona: Robot. Niche: Unclear.</p>
                         <div className="space-y-2 text-xs">
                             <div className="flex justify-between"><span className="opacity-70">Schema</span><span className="font-bold">15/100</span></div>
                             <div className="flex justify-between"><span className="opacity-70">Persona</span><span className="font-bold">38/100</span></div>
                             <div className="flex justify-between"><span className="opacity-70">Crawlability</span><span className="font-bold">52/100</span></div>
                         </div>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-[#F6D6CA] p-8 rounded-2xl border-2 border-brand-primary/10"
                     >
                         <div className="text-center mb-6">
                             <div className="text-6xl font-black text-brand-primary mb-2">94</div>
                             <div className="text-sm font-bold uppercase tracking-widest text-brand-primary/60">AI Visibility Score</div>
                         </div>
                         <h3 className="font-bold text-xl mb-3">E-commerce Brand</h3>
                         <p className="text-sm opacity-70 mb-4">Schema-solid, persona-aligned, niche-focused. Schema score: 98. Persona: Merchant. Niche: Authority.</p>
                         <div className="space-y-2 text-xs">
                             <div className="flex justify-between"><span className="opacity-70">Schema</span><span className="font-bold">98/100</span></div>
                             <div className="flex justify-between"><span className="opacity-70">Persona</span><span className="font-bold">91/100</span></div>
                             <div className="flex justify-between"><span className="opacity-70">Crawlability</span><span className="font-bold">96/100</span></div>
                         </div>
                     </motion.div>
                 </div>
            </div>
        </section>
    )
}

function WhyItMattersSection() {
    return (
        <section className="w-full bg-[#6B1D2F] py-24 text-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                 >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Why it matters</h2>
                    <p className="text-lg font-medium text-white/80 max-w-2xl mx-auto">AI search is the new traffic source. Get cited, get bookings, get conversions.</p>
                 </motion.div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white/10 p-8 rounded-xl backdrop-blur-sm"
                     >
                         <div className="w-14 h-14 rounded-lg bg-accent/20 flex items-center justify-center text-accent mb-6">
                             <TrendingUp size={28} />
                         </div>
                         <h3 className="font-bold text-xl mb-4">Traffic</h3>
                         <p className="text-white/80 text-sm">When ChatGPT cites your hotel, bookings spike. When Perplexity recommends your SaaS, signups jump. AI visibility = direct traffic.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white/10 p-8 rounded-xl backdrop-blur-sm"
                     >
                         <div className="w-14 h-14 rounded-lg bg-accent/20 flex items-center justify-center text-accent mb-6">
                             <Globe size={28} />
                         </div>
                         <h3 className="font-bold text-xl mb-4">Bookings</h3>
                         <p className="text-white/80 text-sm">Hotels with schema-solid pages get recommended. E-commerce sites with clear personas get cited. Visibility drives revenue.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white/10 p-8 rounded-xl backdrop-blur-sm"
                     >
                         <div className="w-14 h-14 rounded-lg bg-accent/20 flex items-center justify-center text-accent mb-6">
                             <MessageSquare size={28} />
                         </div>
                         <h3 className="font-bold text-xl mb-4">Conversions</h3>
                         <p className="text-white/80 text-sm">Agencies use our reports to fix client sites. Startups use insights to pivot messaging. Clear recommendations = faster wins.</p>
                     </motion.div>
                 </div>
            </div>
        </section>
    )
}

function WhoItsForSection() {
    return (
        <section className="w-full bg-[#F6D6CA] py-24 text-brand-primary">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                 >
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Who it's for</h2>
                    <p className="text-lg font-medium opacity-80 max-w-2xl mx-auto">Website owners, founders, marketers, and agencies who need AI-ready sites.</p>
                 </motion.div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white p-6 rounded-xl text-center"
                     >
                         <h3 className="font-bold text-lg mb-2">Hotels</h3>
                         <p className="text-xs opacity-70">Get recommended when travelers ask AI for stays.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white p-6 rounded-xl text-center"
                     >
                         <h3 className="font-bold text-lg mb-2">SaaS</h3>
                         <p className="text-xs opacity-70">Become the tool that AI suggests to users.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white p-6 rounded-xl text-center"
                     >
                         <h3 className="font-bold text-lg mb-2">E-commerce</h3>
                         <p className="text-xs opacity-70">Get cited when shoppers ask AI for products.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white p-6 rounded-xl text-center"
                     >
                         <h3 className="font-bold text-lg mb-2">Agencies</h3>
                         <p className="text-xs opacity-70">Fix client sites with actionable reports.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-white p-6 rounded-xl text-center"
                     >
                         <h3 className="font-bold text-lg mb-2">Startups</h3>
                         <p className="text-xs opacity-70">Pivot messaging based on persona clarity.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-white p-6 rounded-xl text-center"
                     >
                         <h3 className="font-bold text-lg mb-2">SME Marketers</h3>
                         <p className="text-xs opacity-70">Optimize for AI without breaking the budget.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="bg-white p-6 rounded-xl text-center"
                     >
                         <h3 className="font-bold text-lg mb-2">Creators</h3>
                         <p className="text-xs opacity-70">Build authority that AI recognizes.</p>
                     </motion.div>
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="bg-white p-6 rounded-xl text-center"
                     >
                         <h3 className="font-bold text-lg mb-2">Founders</h3>
                         <p className="text-xs opacity-70">Make your site AI-ready from day one.</p>
                     </motion.div>
                 </div>
            </div>
        </section>
    )
}

// --- Main Page Component ---
// Updated with FAQ/Contact links
export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAnalyze = () => {
    if (!url) return;
    if (!url.startsWith("http")) {
        setError("Please enter a valid URL starting with http:// or https://");
        return;
    }
    setError(null);
    setResult(null);
    
    startTransition(async () => {
      try {
        // 1. Fetch HTML via our proxy API
        const res = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to fetch URL");
        }
        
        const data = await res.json();
        
        // 2. Pass HTML to Server Action for analysis
        const analysis = await analyzeHtml(data.html, url, data.time);
        setResult(analysis);
        
        // Smooth scroll to results
        setTimeout(() => {
            document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (e: any) {
        setError(e.message || "Something went wrong. Please check the URL and try again.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#F6D6CA] font-sans selection:bg-accent/20 overflow-x-hidden">
      <Navbar />
      
      <HeroSection 
        url={url} 
        setUrl={setUrl} 
        handleAnalyze={handleAnalyze} 
        isPending={isPending}
        error={error}
      />

      {/* Results View (Conditionally Rendered) - Styled to match Hushed Light Section */}
      <AnimatePresence>
        {result && !isPending && (
            <section id="results" className="w-full bg-[#Fdf8f6] py-24 text-brand-primary">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-brand-primary/10 pb-8">
                            <div>
                                <h2 className="text-4xl font-serif font-bold text-brand-primary">Visibility Report</h2>
                                <p className="text-lg text-brand-primary/60 mt-2 font-medium">{result.url}</p>
                            </div>
                            <Button onClick={() => setResult(null)} variant="outline" className="rounded-full border-2 border-brand-primary/50 font-bold hover:bg-brand-primary/5 text-brand-primary">
                                Start New Audit
                            </Button>
                        </div>

                        {/* Scores & Persona - Free Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="col-span-1 border-2 border-brand-primary/5 shadow-none rounded-[24px] flex flex-col items-center justify-center p-8 bg-[#F6D6CA]">
                                <ScoreGauge score={result.score} />
                            </Card>

                            <Card className="col-span-1 md:col-span-2 border-2 border-brand-primary/5 shadow-none rounded-[24px] p-8 bg-brand-primary text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-[100px]" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Badge className="bg-white text-brand-primary hover:bg-white/90 rounded-full px-4 py-1.5 text-sm font-bold">Brand Voice Analysis</Badge>
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-tight">{result.persona.archetype}</h3>
                                    <p className="text-xl text-white/80 leading-relaxed max-w-2xl font-medium">
                                        {result.persona.description}
                                    </p>
                                </div>
                            </Card>
                        </div>

                        {/* Free Preview Notice */}
                        <div className="bg-brand-primary/5 p-6 rounded-2xl border-2 border-brand-primary/10 text-center">
                            <p className="text-lg text-brand-primary/80 font-medium mb-2">
                                This is your free preview. Get the complete breakdown: schema audit, persona analysis, crawlability check, brand distinctiveness score, and prioritized fixes—all in your full PDF report.
                            </p>
                        </div>

                        {/* CTA SECTION */}
                        <div className="mt-12 bg-brand-primary/5 p-10 rounded-[32px] border-2 border-brand-primary/10 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary via-warning to-accent" />
                            <h3 className="text-3xl font-serif font-bold text-brand-primary mb-4">Get your full AI visibility report</h3>
                            <p className="text-lg text-brand-primary/70 mb-8 max-w-2xl mx-auto font-medium">
                                Complete schema audit, metadata clarity score, persona analysis, crawlability check, brand distinctiveness score, and prioritized fixes by business impact—delivered as a professional PDF to your inbox.
                            </p>
                            <Button 
                                onClick={async () => {
                                    // Use Checkout Session API to properly set client_reference_id
                                    try {
                                        const response = await fetch('/api/create-checkout', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ domain: result.url })
                                        });
                                        const data = await response.json();
                                        if (data.url) {
                                            window.location.href = data.url;
                                        } else {
                                            console.error('Failed to create checkout session:', data.error);
                                            alert('Failed to start payment. Please try again.');
                                        }
                                    } catch (error) {
                                        console.error('Error creating checkout session:', error);
                                        alert('Failed to start payment. Please try again.');
                                    }
                                }}
                                className="h-16 px-10 rounded-full bg-accent hover:bg-accent/90 text-white text-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                            >
                                Download Full Report — C$12
                            </Button>
                            <p className="mt-4 text-sm text-brand-primary/50 font-bold uppercase tracking-widest">One-time payment • Instant delivery</p>
                        </div>

                    </motion.div>
                </div>
            </section>
        )}
      </AnimatePresence>

      <ProblemSection />
      
      <HowItWorksSection />

      <WhatYouGetSection />

      <ExamplesSection />

      <WhyItMattersSection />

      <WhoItsForSection />

      <PricingSection />

      <Footer />

    </main>
  );
}
