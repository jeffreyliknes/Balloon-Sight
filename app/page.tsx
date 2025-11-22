"use client";

import { useState, useTransition } from "react";
import { analyzeHtml } from "@/actions/analyze-url";
import { AnalysisResult } from "@/lib/types";
import { ScoreGauge } from "@/components/ScoreGauge";
import { AnalysisCard } from "@/components/AnalysisCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Database, Layout, FileText, Sparkles, AlertCircle, ArrowRight, Loader2, Map, Compass, Check, ShieldCheck, TrendingUp, Globe, Smartphone, MessageSquare, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BalloonSightLogo } from "@/components/BalloonSightLogo";

// --- Components ---

function Navbar() {
  return (
    <nav className="w-full bg-brand-primary relative z-10">
      <div className="w-full px-6 md:px-12 flex items-center justify-between max-w-7xl mx-auto py-6">
        <div className="flex items-center gap-3 font-serif font-black text-3xl tracking-tight text-white">
          <div className="bg-white/10 p-1.5 rounded-full backdrop-blur-sm">
               <BalloonSightLogo size={52} />
          </div>
          <span>BalloonSight</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-bold text-white/90">
          <a href="#features" className="hover:text-accent transition-colors">Why It Matters</a>
          <a href="#pricing" className="hover:text-accent transition-colors">Plans</a>
          <Button variant="default" className="bg-accent text-white hover:bg-accent/90 rounded-lg px-6 h-10 shadow-lg font-serif">
            Start Analysis
          </Button>
        </div>
      </div>
    </nav>
  );
}

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
                        <span>SEO for the AI Era</span> <ArrowRight size={14}/>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-white leading-[1.05]">
                        Don't just rank. <br/> Be understood.
                    </h1>
                    <p className="text-xl text-white/80 font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                        AI models don't read keywords—they read identity. We analyze your technical signals and brand voice to help you own your niche in AI search.
                    </p>
                </motion.div>

                {/* Input Box */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-stretch gap-3 max-w-lg mx-auto lg:mx-0"
                >
                    <Button 
                        onClick={handleAnalyze} 
                        disabled={isPending}
                        className="h-14 px-8 rounded-lg bg-accent hover:bg-accent/90 text-white text-lg font-bold shadow-lg shrink-0 uppercase tracking-wide font-sans"
                    >
                        {isPending ? <Loader2 className="animate-spin" /> : "Audit My Site"}
                    </Button>
                </motion.div>

                 {/* Analysis Input */}
                 <div className="max-w-md mx-auto lg:mx-0 bg-white/10 p-4 rounded-xl mt-8 border border-white/10 backdrop-blur-sm">
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
                 </div>
            </div>

            {/* Right Column: Image Placeholder */}
            <div className="relative h-[500px] w-full hidden lg:block">
                 <div className="absolute top-0 right-0 w-4/5 h-full bg-white/5 rounded-tl-[100px] rounded-br-[100px] overflow-hidden border-4 border-white/10 flex items-center justify-center">
                     <div className="text-center p-8">
                        <div className="text-9xl font-black text-white/10 mb-4">92</div>
                        <div className="text-white/40 font-bold uppercase tracking-widest">AI Visibility Score</div>
                     </div>
                 </div>
            </div>
       </div>
    </section>
  );
}

function StatsSection() {
    return (
        <section className="w-full bg-[#6B1D2F] py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="text-white space-y-6">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold">Stop blending in.</h2>
                    <p className="text-white/70 text-lg max-w-md">
                        Generic content gets ignored by LLMs. To be cited as an authority, you need clear entities, structured data, and a distinct persona. BalloonSight helps you fix the technical gaps that keep you hidden.
                    </p>
                    <Button className="bg-accent text-white font-bold px-8 py-6 rounded-lg uppercase tracking-wide">See How It Works</Button>
                </div>
                
                <div className="space-y-4">
                    {/* Stat Bar 1 - Peach */}
                    <div className="bg-[#F6D6CA] p-6 rounded-xl flex items-center justify-between">
                         <div>
                             <div className="text-3xl font-serif font-bold text-brand-primary">Technical <span className="text-xl opacity-70">Signals</span></div>
                             <div className="text-brand-primary text-xs font-bold uppercase tracking-widest mt-1">Schema, Headings, Crawlability</div>
                         </div>
                    </div>
                    {/* Stat Bar 2 - Teal */}
                    <div className="bg-secondary p-6 rounded-xl flex items-center justify-between">
                         <div>
                             <div className="text-3xl font-serif font-bold text-brand-primary">Semantic <span className="text-xl opacity-70">Clarity</span></div>
                             <div className="text-brand-primary text-xs font-bold uppercase tracking-widest mt-1">Entities & Context</div>
                         </div>
                    </div>
                    {/* Stat Bar 3 - Yellow */}
                    <div className="bg-warning p-6 rounded-xl flex items-center justify-between">
                         <div>
                             <div className="text-3xl font-serif font-bold text-brand-primary">Persona <span className="text-xl opacity-70">Alignment</span></div>
                             <div className="text-brand-primary text-xs font-bold uppercase tracking-widest mt-1">Tone & Brand Voice</div>
                         </div>
                    </div>
                    {/* Stat Bar 4 - Orange */}
                    <div className="bg-accent p-6 rounded-xl flex items-center justify-between">
                         <div>
                             <div className="text-3xl font-serif font-bold text-brand-primary">Niche <span className="text-xl opacity-70">Authority</span></div>
                             <div className="text-brand-primary text-xs font-bold uppercase tracking-widest mt-1">Topic Depth & Focus</div>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function FeaturesGrid() {
    return (
        <section className="w-full bg-[#F6D6CA] py-24 text-brand-primary">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                 <div className="mb-16 max-w-lg">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">What we measure.</h2>
                    <p className="text-lg font-medium opacity-80">We decode how AI models see your site, translating complex signals into a simple, actionable visibility score.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     <div className="bg-white p-8 rounded-xl h-64 flex flex-col justify-between hover:shadow-xl transition-shadow cursor-pointer group">
                         <div className="w-14 h-14 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                             <Sparkles size={28} />
                         </div>
                         <div>
                            <h3 className="font-bold uppercase text-sm tracking-wide mb-2">Persona Detection</h3>
                            <p className="text-sm opacity-70">Does your tone match your audience? We identify if you sound like an Expert, a Merchant, or a Robot.</p>
                         </div>
                     </div>
                     <div className="bg-white p-8 rounded-xl h-64 flex flex-col justify-between hover:shadow-xl transition-shadow cursor-pointer group">
                         <div className="w-14 h-14 rounded-lg bg-warning/20 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                             <Database size={28} />
                         </div>
                         <div>
                            <h3 className="font-bold uppercase text-sm tracking-wide mb-2">Structured Data</h3>
                            <p className="text-sm opacity-70">Validate your JSON-LD schema. Ensure AI agents clearly understand your products and entities.</p>
                         </div>
                     </div>
                     <div className="bg-white p-8 rounded-xl h-64 flex flex-col justify-between hover:shadow-xl transition-shadow cursor-pointer group">
                         <div className="w-14 h-14 rounded-lg bg-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                             <Eye size={28} />
                         </div>
                         <div>
                            <h3 className="font-bold uppercase text-sm tracking-wide mb-2">AI Accessibility</h3>
                            <p className="text-sm opacity-70">Can GPTBot crawl your site? We check robots.txt, sitemaps, and block status for major LLMs.</p>
                         </div>
                     </div>
                     <div className="bg-white p-8 rounded-xl h-64 flex flex-col justify-between hover:shadow-xl transition-shadow cursor-pointer group">
                         <div className="w-14 h-14 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                             <Layout size={28} />
                         </div>
                         <div>
                            <h3 className="font-bold uppercase text-sm tracking-wide mb-2">Semantic Hierarchy</h3>
                            <p className="text-sm opacity-70">Check your heading structure and HTML tags to ensure content priority is clear to machines.</p>
                         </div>
                     </div>
                 </div>
            </div>
        </section>
    )
}

// --- Main Page Component ---

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
            <section id="results" className="w-full bg-white py-24 text-brand-primary">
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
                            <Button onClick={() => setResult(null)} variant="outline" className="rounded-full border-2 border-brand-primary/20 font-bold hover:bg-brand-primary/5 text-brand-primary">
                                Start New Audit
                            </Button>
                        </div>

                        {/* Scores & Persona */}
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

                        {/* Detail Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <AnalysisCard 
                                title="Crawlability & Access" 
                                category={result.categories.accessibility} 
                                icon={<Eye className="w-6 h-6 text-brand-primary" />}
                            />
                            <AnalysisCard 
                                title="Structured Data Schema" 
                                category={result.categories.structuredData} 
                                icon={<Database className="w-6 h-6 text-brand-primary" />}
                            />
                            <AnalysisCard 
                                title="Semantic HTML Structure" 
                                category={result.categories.semanticStructure} 
                                icon={<Layout className="w-6 h-6 text-brand-primary" />}
                            />
                            <AnalysisCard 
                                title="Content Signals" 
                                category={result.categories.contentPersona} 
                                icon={<FileText className="w-6 h-6 text-brand-primary" />}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>
        )}
      </AnimatePresence>

      <StatsSection />
      
      <FeaturesGrid />

      {/* Footer */}
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
                      <li><a href="#" className="hover:text-white hover:underline">How It Works</a></li>
                      <li><a href="#" className="hover:text-white hover:underline">Pricing</a></li>
                      <li><a href="#" className="hover:text-white hover:underline">API Docs</a></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-lg mb-6 text-accent">Company</h4>
                  <ul className="space-y-4 text-white/80 font-medium">
                      <li><a href="#" className="hover:text-white hover:underline">About Us</a></li>
                      <li><a href="#" className="hover:text-white hover:underline">Blog</a></li>
                      <li><a href="#" className="hover:text-white hover:underline">Contact</a></li>
                  </ul>
              </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
              © 2025 BalloonSight Inc. All rights reserved.
          </div>
      </footer>

    </main>
  );
}
