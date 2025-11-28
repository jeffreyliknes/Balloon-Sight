"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F6D6CA] font-sans selection:bg-accent/20">
      <Navbar />
      
      <section className="max-w-2xl mx-auto py-24 px-6 text-brand-primary">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-[32px] p-10 shadow-xl border-2 border-brand-primary/5"
        >
            <h1 className="text-4xl font-serif font-bold mb-6 text-center">Contact Us</h1>

            <p className="text-brand-primary/70 mb-10 text-center font-medium text-lg">
                Have a question, feedback, or need help with your report?
                Fill out the form below and we’ll get back to you.
            </p>

            <form
                action="https://formsubmit.co/team@balloonsight.com"
                method="POST"
                className="space-y-6"
            >
                <input type="hidden" name="_captcha" value="false" />

                <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-brand-primary/60">Your Name</label>
                <Input
                    name="name"
                    required
                    className="bg-brand-primary/5 border-transparent h-12 rounded-xl focus:bg-white transition-colors"
                    placeholder="John Doe"
                />
                </div>

                <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-brand-primary/60">Email</label>
                <Input
                    type="email"
                    name="email"
                    required
                    className="bg-brand-primary/5 border-transparent h-12 rounded-xl focus:bg-white transition-colors"
                    placeholder="you@example.com"
                />
                </div>

                <div>
                <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-brand-primary/60">Message</label>
                <textarea
                    name="message"
                    required
                    className="w-full bg-brand-primary/5 border-transparent p-4 rounded-xl focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/20 min-h-[150px]"
                    placeholder="How can we help?"
                />
                </div>

                <Button
                type="submit"
                className="w-full h-14 text-lg font-bold rounded-full bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg mt-4"
                >
                Send Message
                </Button>
            </form>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

