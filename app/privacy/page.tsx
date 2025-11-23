"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function PrivacyPage() {
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
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Privacy Policy</h1>
            <p className="text-brand-primary/60 text-sm mb-8">Last updated: January 2025</p>

            <div className="prose prose-lg max-w-none text-brand-primary/80 space-y-8">
                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">1. Introduction</h2>
                    <p className="mb-4">
                        BalloonSight ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI visibility analysis service.
                    </p>
                    <p>
                        BalloonSight is operated by Jeffrey Liknes as an individual, unregistered business located at 22 Cougar Ridge Bay SW, Calgary, Alberta, T3H 5C4, Canada. By using BalloonSight, you consent to the data practices described in this policy.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">2. Personal Data We Collect</h2>
                    <p className="mb-4">We collect the following personal information:</p>
                    
                    <h3 className="text-xl font-bold text-brand-primary mb-3">2.1 Email Address</h3>
                    <p className="mb-4">
                        We collect your email address when you purchase a full PDF report. This email is used solely for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Delivering your purchased PDF report</li>
                        <li>Sending payment receipts</li>
                        <li>Communicating about your purchase if necessary</li>
                    </ul>
                    <p className="mb-4">
                        We do not use your email for marketing purposes unless you explicitly opt in. You may request deletion of your email data at any time (see Section 10).
                    </p>

                    <h3 className="text-xl font-bold text-brand-primary mb-3">2.2 Domain Information</h3>
                    <p className="mb-4">
                        When you submit a domain for scanning, we collect the domain URL you provide. This domain information is used to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Perform the AI visibility analysis</li>
                        <li>Generate your report</li>
                        <li>Store anonymized scan results for model improvement</li>
                    </ul>

                    <h3 className="text-xl font-bold text-brand-primary mb-3">2.3 Analytics Data</h3>
                    <p className="mb-4">
                        We use Google Analytics and Google Tag Manager to collect anonymized usage statistics, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Page views and navigation patterns</li>
                        <li>Device and browser information</li>
                        <li>Geographic location (country/city level, not precise)</li>
                        <li>Referral sources</li>
                    </ul>
                    <p>
                        This analytics data is aggregated and cannot be used to identify individual users.
                    </p>

                    <h3 className="text-xl font-bold text-brand-primary mb-3">2.4 Anonymized Scan Output</h3>
                    <p>
                        We store anonymized scan results and domain data to improve our scoring models. This data is stripped of any personal identifiers and cannot be linked back to your email address or identity.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">3. Data We Do NOT Collect</h2>
                    <p className="mb-4">We do not collect or store:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Credit card numbers or payment information:</strong> All payments are processed directly by Stripe. We never see, store, or process your credit card details.</li>
                        <li><strong>Linkable personal identifiers:</strong> Beyond your email address (used only for report delivery), we do not collect names, addresses, phone numbers, or other personally identifiable information.</li>
                        <li><strong>Precise location data:</strong> Analytics provide only general geographic information (country/city level).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">4. How We Use Your Data</h2>
                    <p className="mb-4">We use collected data for the following purposes:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Providing the AI visibility scanning and report generation service</li>
                        <li>Delivering purchased PDF reports to your email</li>
                        <li>Sending payment receipts and transaction confirmations</li>
                        <li>Improving our scoring algorithms using anonymized data</li>
                        <li>Understanding service usage through analytics to improve user experience</li>
                        <li>Responding to customer support inquiries</li>
                    </ul>
                    <p>
                        We do not sell, rent, or share your personal information with third parties except as described in Section 8 (Data Sharing).
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">5. Anonymization Process</h2>
                    <p className="mb-4">
                        To improve our scoring models, we anonymize scan results by:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Removing all personal identifiers (email addresses, names, etc.)</li>
                        <li>Storing only technical scan data (schema scores, persona classifications, crawlability metrics)</li>
                        <li>Separating anonymized scan data from any personally identifiable information</li>
                        <li>Ensuring anonymized data cannot be re-identified or linked to individual users</li>
                    </ul>
                    <p>
                        This anonymized data helps us improve the accuracy and relevance of our AI visibility scoring system.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">6. Cookies and Analytics</h2>
                    <p className="mb-4">
                        We use cookies and similar tracking technologies through Google Analytics and Google Tag Manager to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Track website usage and performance</li>
                        <li>Understand how users interact with our service</li>
                        <li>Improve website functionality and user experience</li>
                    </ul>
                    <p className="mb-4">
                        You can control cookies through your browser settings. However, disabling cookies may affect website functionality.
                    </p>
                    <p>
                        Google Analytics data is processed according to Google's Privacy Policy. We do not use Google Analytics to collect personally identifiable information.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">7. Legal Basis for Processing (GDPR)</h2>
                    <p className="mb-4">
                        If you are located in the European Economic Area (EEA), we process your personal data based on:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Contractual necessity:</strong> Processing your email and domain data is necessary to fulfill our contract to provide the scanning and report service you purchased.</li>
                        <li><strong>Legitimate interests:</strong> Using anonymized data to improve our scoring models serves our legitimate interest in providing better services.</li>
                        <li><strong>Consent:</strong> Analytics data collection is based on your consent, which you can withdraw by adjusting your browser settings.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">8. Your Rights</h2>
                    
                    <h3 className="text-xl font-bold text-brand-primary mb-3">8.1 GDPR Rights (European Users)</h3>
                    <p className="mb-4">If you are in the EEA, you have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Access:</strong> Request a copy of your personal data</li>
                        <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
                        <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                        <li><strong>Restriction:</strong> Request limitation of processing</li>
                        <li><strong>Data portability:</strong> Receive your data in a structured format</li>
                        <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
                        <li><strong>Withdraw consent:</strong> Withdraw consent for analytics at any time</li>
                    </ul>

                    <h3 className="text-xl font-bold text-brand-primary mb-3">8.2 CCPA Rights (California Users)</h3>
                    <p className="mb-4">If you are a California resident, you have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Know:</strong> Request disclosure of personal information collected</li>
                        <li><strong>Delete:</strong> Request deletion of personal information</li>
                        <li><strong>Opt-out:</strong> Opt-out of sale of personal information (we do not sell personal information)</li>
                        <li><strong>Non-discrimination:</strong> Not be discriminated against for exercising your rights</li>
                    </ul>

                    <h3 className="text-xl font-bold text-brand-primary mb-3">8.3 Canadian Privacy Rights (PIPEDA)</h3>
                    <p className="mb-4">Under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Access your personal information</li>
                        <li>Request correction of inaccurate information</li>
                        <li>File a complaint with the Privacy Commissioner of Canada</li>
                    </ul>

                    <p>
                        To exercise any of these rights, contact us at jeff.liknes@gmail.com. We will respond within 30 days.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">9. Data Retention</h2>
                    <p className="mb-4">
                        We retain your personal data as follows:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li><strong>Email addresses:</strong> Retained until you request deletion or for up to 3 years after your last purchase, whichever comes first</li>
                        <li><strong>Anonymized scan data:</strong> Retained indefinitely for model improvement purposes, as it cannot be linked to personal identifiers</li>
                        <li><strong>Analytics data:</strong> Retained according to Google Analytics' retention policies (typically 26 months)</li>
                    </ul>
                    <p>
                        You may request deletion of your email data at any time (see Section 10).
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">10. How to Request Deletion</h2>
                    <p className="mb-4">
                        To request deletion of your personal data (email address), send an email to jeff.liknes@gmail.com with the subject line "Data Deletion Request" and include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Your email address associated with the account</li>
                        <li>Confirmation that you want your data deleted</li>
                    </ul>
                    <p>
                        We will process your request within 30 days and confirm deletion. Note that anonymized scan data cannot be deleted as it cannot be linked to your identity.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">11. Data Sharing</h2>
                    <p className="mb-4">We share your data only in the following circumstances:</p>
                    
                    <h3 className="text-xl font-bold text-brand-primary mb-3">11.1 Payment Processing</h3>
                    <p className="mb-4">
                        Payment information is processed directly by Stripe. We do not receive, store, or have access to your credit card details. Stripe's use of your information is governed by their Privacy Policy.
                    </p>

                    <h3 className="text-xl font-bold text-brand-primary mb-3">11.2 Analytics</h3>
                    <p className="mb-4">
                        We use Google Analytics and Google Tag Manager, which may process anonymized usage data. Google's use of this data is governed by their Privacy Policy.
                    </p>

                    <h3 className="text-xl font-bold text-brand-primary mb-3">11.3 Legal Requirements</h3>
                    <p>
                        We may disclose personal information if required by law, court order, or government regulation, or to protect our rights, property, or safety, or that of our users.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">12. Data Security</h2>
                    <p className="mb-4">
                        We implement reasonable technical and organizational measures to protect your personal information, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Secure data transmission using encryption (HTTPS)</li>
                        <li>Limited access to personal data on a need-to-know basis</li>
                        <li>Regular security assessments</li>
                        <li>Secure storage of email addresses</li>
                    </ul>
                    <p>
                        However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">13. Children's Privacy</h2>
                    <p>
                        BalloonSight is not intended for users under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately at jeff.liknes@gmail.com, and we will delete such information.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">14. International Data Transfers</h2>
                    <p className="mb-4">
                        Your data may be transferred to and processed in countries other than your country of residence, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Canada (where our servers are located)</li>
                        <li>United States (for Stripe payment processing and Google Analytics)</li>
                    </ul>
                    <p>
                        By using BalloonSight, you consent to the transfer of your data to these countries. We ensure appropriate safeguards are in place, including standard contractual clauses where applicable.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">15. Changes to This Privacy Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of BalloonSight after changes constitutes acceptance of the updated policy.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">16. Contact Information</h2>
                    <p className="mb-4">
                        If you have questions about this Privacy Policy or wish to exercise your rights, please contact:
                    </p>
                    <p className="mb-2">
                        <strong>BalloonSight</strong><br />
                        Jeffrey Liknes<br />
                        22 Cougar Ridge Bay SW<br />
                        Calgary, Alberta, T3H 5C4<br />
                        Canada<br />
                        Email: jeff.liknes@gmail.com
                    </p>
                    <p className="mt-4">
                        For complaints under PIPEDA, you may also contact the Privacy Commissioner of Canada at <a href="https://www.priv.gc.ca" className="text-accent underline">www.priv.gc.ca</a>.
                    </p>
                </section>
            </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

