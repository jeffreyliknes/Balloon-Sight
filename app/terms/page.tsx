"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F6D6CA] font-sans selection:bg-accent/20">
      <Navbar />
      
      <section className="max-w-4xl mx-auto py-24 px-6 text-brand-primary">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border-2 border-brand-primary/5"
        >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Terms of Service</h1>
            <p className="text-brand-primary/60 text-sm mb-8">Last updated: January 2025</p>

            <div className="prose prose-lg max-w-none text-brand-primary/80 space-y-8">
                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-4">
                        By accessing or using BalloonSight ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. Your use of BalloonSight constitutes acceptance of these Terms.
                    </p>
                    <p>
                        We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">2. Eligibility</h2>
                    <p>
                        You must be at least 18 years old and have the legal capacity to enter into contracts to use BalloonSight. By using the Service, you represent and warrant that you meet these requirements.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">3. Description of Service</h2>
                    <p className="mb-4">
                        BalloonSight is an AI visibility analysis service that scans websites and generates reports measuring how likely a domain is to appear in AI search results (ChatGPT, Perplexity, Gemini, Claude, etc.). The Service provides:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Free AI Visibility Score (0-100) and persona analysis</li>
                        <li>Paid PDF reports with detailed breakdowns including schema audits, metadata clarity scores, persona analysis, crawlability checks, brand distinctiveness scores, and prioritized fix recommendations</li>
                    </ul>
                    <p>
                        BalloonSight is operated by Jeffrey Liknes as an individual, unregistered business located at 22 Cougar Ridge Bay SW, Calgary, Alberta, T3H 5C4, Canada.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">4. Domain Scanning Restrictions</h2>
                    <p className="mb-4">
                        You may only submit domains that you own or have authorization to scan. You agree not to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Scan domains without proper authorization</li>
                        <li>Use the Service to scan domains for malicious purposes</li>
                        <li>Attempt to overload or disrupt the Service</li>
                        <li>Use automated systems to submit excessive scan requests</li>
                    </ul>
                    <p>
                        BalloonSight reserves the right to refuse or terminate scans that violate these restrictions.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">5. Pricing & Payments</h2>
                    <p className="mb-4">
                        The free scan provides your AI Visibility Score and persona analysis at no cost. Full PDF reports are available for purchase at C$16 CAD per scan.
                    </p>
                    <p className="mb-4">
                        All payments are processed through Stripe, a third-party payment processor. By purchasing a report, you agree to Stripe's terms of service. BalloonSight does not store, process, or have access to your credit card information.
                    </p>
                    <p>
                        All prices are in Canadian Dollars (CAD). Payment is required before report generation and delivery.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">6. Refunds</h2>
                    <p>
                        Refunds are only provided in cases of system error where the Service fails to deliver the purchased report. Refunds are not available for dissatisfaction with report content, scores, or recommendations. To request a refund due to system error, contact team@balloonsight.com within 7 days of purchase.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">7. Intellectual Property</h2>
                    <p className="mb-4">
                        All content, features, and functionality of BalloonSight, including but not limited to text, graphics, logos, and software, are the property of BalloonSight and are protected by Canadian and international copyright, trademark, and other intellectual property laws.
                    </p>
                    <p>
                        You may not reproduce, distribute, modify, or create derivative works from any part of the Service without express written permission.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">8. Ownership of Reports</h2>
                    <p>
                        Upon purchase, you receive a non-exclusive license to use the PDF report for your own business purposes. Reports may not be resold, redistributed, or used for commercial purposes beyond your own use. The underlying analysis methodology, scoring algorithms, and report structure remain the intellectual property of BalloonSight.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">9. Anonymized Data Reuse</h2>
                    <p>
                        BalloonSight stores anonymized scan results and domain data to improve scoring models and service quality. This anonymized data cannot be linked to your personal information or email address. By using the Service, you consent to this anonymized data reuse. See our Privacy Policy for details on data handling.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">10. Limitation of Liability</h2>
                    <p className="mb-4">
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, BALLOONSIGHT AND ITS OPERATOR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
                    </p>
                    <p>
                        BalloonSight's total liability for any claims arising from the Service shall not exceed the amount you paid for the specific report in question.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">11. No Warranty of Results</h2>
                    <p className="mb-4">
                        BalloonSight provides informational reports and does not guarantee search engine or AI ranking outcomes. The Service offers analysis and recommendations based on current best practices, but results may vary.
                    </p>
                    <p className="mb-4">
                        BalloonSight is not responsible for business loss resulting from recommendations in reports. Reports are provided "as is" for informational purposes only.
                    </p>
                    <p>
                        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES of MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">12. Prohibited Uses</h2>
                    <p className="mb-4">You agree not to:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Use the Service for any illegal purpose or in violation of any laws</li>
                        <li>Attempt to reverse engineer, decompile, or extract the Service's algorithms or methodologies</li>
                        <li>Use the Service to harm, harass, or defame others</li>
                        <li>Interfere with or disrupt the Service or servers</li>
                        <li>Use automated systems to abuse or overload the Service</li>
                        <li>Impersonate any person or entity or misrepresent your affiliation</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">13. Termination</h2>
                    <p className="mb-4">
                        BalloonSight reserves the right to suspend or terminate your access to the Service at any time, with or without cause, with or without notice, for any reason including violation of these Terms.
                    </p>
                    <p>
                        Upon termination, your right to use the Service will immediately cease. Sections of these Terms that by their nature should survive termination will survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">14. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of the Province of Alberta, Canada, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Alberta, Canada.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">15. Contact Information</h2>
                    <p className="mb-4">
                        If you have questions about these Terms, please contact:
                    </p>
                    <p className="mb-2">
                        <strong>BalloonSight</strong><br />
                        Jeffrey Liknes<br />
                        22 Cougar Ridge Bay SW<br />
                        Calgary, Alberta, T3H 5C4<br />
                        Canada<br />
                        Email: team@balloonsight.com
                    </p>
                </section>
            </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

