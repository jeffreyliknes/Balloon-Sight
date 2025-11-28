// AI Visibility Upgrade Kit - Full PDF Report Template
// This template generates a comprehensive 10-page PDF report

export interface ReportData {
  domain: string;
  score: number;
  date?: string;
  persona?: {
    currentAudience?: string;
    recommendedAudience?: string;
    positioning?: string;
    tone?: string;
  };
  contentPack?: {
    h1?: string;
    h2s?: string[];
    metaDescription?: string;
    introParagraph?: string;
  };
  faq?: {
    items?: Array<{ question: string; answer: string }>;
  };
  faqSchema?: any;
  orgSchema?: any;
  recommendedContentBlock?: string;
  technical?: {
    robots?: string;
    sitemap?: string;
    schema?: string;
    performance?: string;
    mobile?: string;
    security?: string;
  };
  // Legacy support for existing data structure
  categories?: any;
  rawJsonLd?: any[];
}

export function generateFullReport(domain: string, data: Partial<ReportData> = {}): string {
  const reportDate = data.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const brandColor = process.env.BRAND_COLOR_PRIMARY || "#551121";
  const score = data.score || 0;
  
  // Generate logo URL - use absolute URL for Puppeteer
  const baseUrl = process.env.VERCEL === "1" 
    ? (process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL || 'balloonsight.com'}`)
    : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
  const logoUrl = `${baseUrl}/balloonsight-logo.png`;
  
  // Extract persona data with defaults
  const persona = data.persona || {
    currentAudience: "General audience",
    recommendedAudience: "Targeted niche market",
    positioning: "Clear value proposition needed",
    tone: "Professional and approachable"
  };

  // Extract content pack with defaults
  const contentPack = data.contentPack || {
    h1: "Your Main Headline Here",
    h2s: ["Subheading 1", "Subheading 2", "Subheading 3"],
    metaDescription: "Your meta description for search engines and AI systems",
    introParagraph: "Your compelling introduction paragraph that clearly communicates your value proposition."
  };

  // Extract FAQ data
  const faqItems = data.faq?.items || [
    { question: "What services do you offer?", answer: "We provide comprehensive solutions tailored to your needs." },
    { question: "How can I get started?", answer: "Contact us today to begin your journey." }
  ];

  // Extract technical data
  const technical = data.technical || {
    robots: "Configured",
    sitemap: "Present",
    schema: "Detected",
    performance: "Good",
    mobile: "Responsive",
    security: "HTTPS Enabled"
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      color: #1a1a1a; 
      font-size: 14.5px;
      line-height: 1.7;
      background: white;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 40px;
      position: relative;
      page-break-after: always;
      background: white;
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    /* PAGE 1 - Cover Page with Brand Color Background */
    .page-cover {
      background: linear-gradient(180deg, #551121 0%, #3c0d18 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 60px 40px;
    }
    
    .logo-container {
      margin-bottom: 50px;
    }
    
    .logo-container img {
      width: 200px;
      height: auto;
      display: block;
      margin: 0 auto;
      filter: brightness(0) invert(1); /* Make logo white */
    }
    
    .score-large {
      font-family: "Cormorant Garamond", "Times New Roman", Georgia, serif;
      font-size: 110px;
      font-weight: 700;
      letter-spacing: 1px;
      color: white;
      text-align: center;
      line-height: 1;
      margin: 40px 0;
    }
    
    .cover-subtitle {
      font-size: 24px;
      color: white;
      margin-top: 30px;
      font-weight: 300;
      letter-spacing: 1px;
    }
    
    .cover-domain {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.9);
      margin-top: 20px;
      font-weight: 400;
    }
    
    .cover-date {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 40px;
    }
    
    /* General Page Styling */
    h1 {
      font-family: "Cormorant Garamond", "Times New Roman", Georgia, serif;
      color: ${brandColor};
      font-size: 36px;
      margin-bottom: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
      border-bottom: 3px solid ${brandColor};
      padding-bottom: 12px;
    }
    
    h2 {
      font-family: "Cormorant Garamond", "Times New Roman", Georgia, serif;
      color: ${brandColor};
      font-size: 26px;
      margin-top: 40px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    
    h3 {
      font-family: "Cormorant Garamond", "Times New Roman", Georgia, serif;
      color: ${brandColor};
      font-size: 20px;
      margin-top: 20px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    p {
      margin-bottom: 16px;
      color: #333;
    }
    
    /* Code Blocks */
    .code-block {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 18px;
      border-radius: 8px;
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 13px;
      line-height: 1.6;
      margin: 16px 0;
      box-shadow: inset 0 0 4px rgba(0,0,0,0.2);
    }
    
    /* Section Styling */
    .section {
      margin: 40px 0;
    }
    
    /* Card Components */
    .section-card {
      background: white;
      border-radius: 10px;
      padding: 22px 28px;
      border: 1px solid #eee;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
      margin: 28px 0;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: ${brandColor};
      margin-bottom: 12px;
    }
    
    .section-content {
      color: #555;
      line-height: 1.8;
    }
    
    /* Persona Strategy Section */
    .persona-box {
      background: white;
      border-radius: 10px;
      padding: 22px 28px;
      border: 1px solid #eee;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
      margin: 28px 0;
    }
    
    .persona-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #999;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .persona-value {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    
    /* Content Pack Section */
    .content-item {
      margin-bottom: 24px;
    }
    
    .content-label {
      font-size: 14px;
      font-weight: 600;
      color: ${brandColor};
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* FAQ Section */
    .faq-item {
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid #eee;
    }
    
    .faq-item:last-child {
      border-bottom: none;
    }
    
    .faq-question {
      font-size: 16px;
      font-weight: 600;
      color: ${brandColor};
      margin-bottom: 8px;
    }
    
    .faq-answer {
      font-size: 15px;
      color: #555;
      line-height: 1.7;
    }
    
    /* Technical Overview */
    .tech-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 20px;
    }
    
    .tech-item {
      background: white;
      border-radius: 10px;
      padding: 22px 28px;
      border: 1px solid #eee;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    }
    
    .tech-label {
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 12px;
    }
    
    .tech-status {
      font-size: 14px;
      color: #666;
    }
    
    /* Status Badges */
    .badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }
    
    .badge-ok {
      background: #e6f7ea;
      color: #167a27;
    }
    
    .badge-missing {
      background: #ffe5e5;
      color: #d32f2f;
      font-weight: 700;
      border: 1px solid #d32f2f;
    }
    
    .badge-partial {
      background: #fff6e0;
      color: #ad7200;
    }
    
    /* Closing Page */
    .page-closing {
      background: linear-gradient(180deg, #551121 0%, #3c0d18 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    
    .closing-logo {
      margin-bottom: 40px;
    }
    
    .closing-logo img {
      width: 140px;
      height: auto;
    }
    
    .closing-divider {
      width: 100px;
      height: 2px;
      background: ${brandColor};
      margin: 30px auto;
    }
    
    .closing-message {
      font-size: 18px;
      color: white;
      line-height: 1.8;
      max-width: 500px;
    }
    
    /* Page Footer */
    .footer {
      position: absolute;
      bottom: 20px;
      left: 40px;
      right: 40px;
      text-align: center;
      font-size: 12px;
      color: #888;
    }
    
    /* List Styling */
    ul {
      list-style: none;
      padding: 0;
    }
    
    li {
      padding: 8px 0;
      padding-left: 24px;
      position: relative;
    }
    
    li:before {
      content: "•";
      position: absolute;
      left: 0;
      color: ${brandColor};
      font-weight: bold;
      font-size: 18px;
    }
    
    /* Utility Classes */
    .page-break {
      page-break-before: always;
    }
    
    .spacer {
      height: 30px;
    }
  </style>
</head>
<body>
  <!-- PAGE 1: Cover Page -->
  <div class="page page-cover">
    <div class="logo-container">
      <img 
        src="${logoUrl}" 
        alt="BalloonSight Logo" 
        style="
          width: 200px;
          height: auto;
          display: block;
          margin: 0 auto 50px auto;
          filter: brightness(0) invert(1);
        "
        onerror="this.style.display='none';" 
      />
    </div>
    <div class="score-large">${score}</div>
    <div class="cover-subtitle">AI Visibility Score</div>
    <div class="cover-domain">${domain}</div>
    <div class="cover-date">${reportDate}</div>
  </div>

  <!-- PAGE 2: Executive Summary -->
  <div class="page">
    <h1>📊 Executive Summary</h1>
    <div class="footer">BalloonSight – AI Visibility Report | Page 2</div>
    <div class="section">
      <div class="score-large" style="color: ${brandColor}; font-size: 72px; margin: 30px 0;">${score}/100</div>
      <p class="section-content">
        Your website's AI Visibility Score is <strong>${score}/100</strong>. This report provides a comprehensive 
        analysis of how AI systems perceive and understand your website, along with actionable recommendations 
        to improve your visibility.
      </p>
    </div>
    
    <div class="section">
      <h2>What You Get in This Report</h2>
      <ul>
        <li>Persona Strategy: Current audience analysis and recommended positioning</li>
        <li>Content Upgrade Pack: Ready-to-use headlines, meta descriptions, and content blocks</li>
        <li>Complete FAQ Page: Questions and answers optimized for AI understanding</li>
        <li>Schema Markup: Copy-paste JSON-LD code for FAQ and Organization</li>
        <li>Technical Overview: Current status of robots.txt, sitemap, schema, and more</li>
        <li>Recommended Homepage Content: Ready-to-implement content block</li>
      </ul>
    </div>
    
    <div class="section">
      <h2>Key Findings</h2>
      <p class="section-content">
        ${score >= 80 
          ? "Your website shows strong AI visibility. The recommendations in this report will help you maintain and improve your position."
          : score >= 60
          ? "Your website has good foundations but needs optimization in key areas. Follow the action plan to improve your score."
          : "Your website requires significant improvements for AI visibility. Prioritize the recommendations in this report to see substantial gains."
        }
      </p>
    </div>
  </div>

  <!-- PAGE 3: Persona Strategy -->
  <div class="page">
    <h1>👤 Persona Strategy</h1>
    <div class="footer">BalloonSight – AI Visibility Report | Page 3</div>
    <p style="color: #666; margin-bottom: 30px;">
      Understanding your current audience and optimizing your positioning for AI systems.
    </p>
    
    <div class="persona-box">
      <div class="persona-label">Current Audience Detected</div>
      <div class="persona-value">${persona.currentAudience}</div>
    </div>
    
    <div class="persona-box">
      <div class="persona-label">Recommended Niche Audience</div>
      <div class="persona-value">${persona.recommendedAudience}</div>
    </div>
    
    <div class="persona-box">
      <div class="persona-label">Positioning Statement</div>
      <div class="persona-value">${persona.positioning}</div>
    </div>
    
    <div class="persona-box">
      <div class="persona-label">Suggested Tone</div>
      <div class="persona-value">${persona.tone}</div>
    </div>
    
    <div class="section" style="margin-top: 40px;">
      <h2>Why This Matters</h2>
      <p class="section-content">
        AI systems need clear signals about who you serve and what problems you solve. By refining your 
        persona and positioning, you make it easier for AI assistants to recommend your services to 
        the right people at the right time.
      </p>
    </div>
  </div>

  <!-- PAGE 4: Content Upgrade Pack -->
  <div class="page">
    <h1>✏️ Content Upgrade Pack</h1>
    <div class="footer">BalloonSight – AI Visibility Report | Page 4</div>
    <p style="color: #666; margin-bottom: 30px;">
      Ready-to-use content optimized for AI visibility. Copy and paste these directly into your website.
    </p>
    
    <div class="content-item">
      <div class="content-label">Recommended H1</div>
      <div class="code-block">${contentPack.h1}</div>
    </div>
    
    <div class="content-item">
      <div class="content-label">Recommended H2s</div>
      ${contentPack.h2s && contentPack.h2s.length > 0 
        ? contentPack.h2s.map(h2 => `<div class="code-block">${h2}</div>`).join('')
        : '<div class="code-block">Subheading 1\nSubheading 2\nSubheading 3</div>'
      }
    </div>
    
    <div class="content-item">
      <div class="content-label">Meta Description</div>
      <div class="code-block">${contentPack.metaDescription}</div>
      <p style="font-size: 13px; color: #999; margin-top: 8px;">
        Add this to your &lt;meta name="description"&gt; tag in the &lt;head&gt; section.
      </p>
    </div>
    
    <div class="content-item">
      <div class="content-label">Intro Paragraph</div>
      <div class="code-block">${contentPack.introParagraph}</div>
      <p style="font-size: 13px; color: #999; margin-top: 8px;">
        Use this as your homepage hero section introduction.
      </p>
    </div>
  </div>

  <!-- PAGE 5: FAQ Page -->
  <div class="page">
    <h1>❓ Complete FAQ Page</h1>
    <div class="footer">BalloonSight – AI Visibility Report | Page 5</div>
    <p style="color: #666; margin-bottom: 30px;">
      Pre-written FAQ content optimized for AI understanding. Use this on your website's FAQ page.
    </p>
    
    ${faqItems.map((item, index) => `
      <div class="section-card">
        <div class="faq-question">Q${index + 1}: ${item.question}</div>
        <div class="faq-answer">${item.answer}</div>
      </div>
    `).join('')}
    
    <div class="section" style="margin-top: 40px;">
      <h2>Implementation Tips</h2>
      <ul>
        <li>Place these FAQs on a dedicated /faq page</li>
        <li>Use proper HTML structure with &lt;h2&gt; for questions and &lt;p&gt; for answers</li>
        <li>Add the FAQ Schema markup from the next page to enhance AI understanding</li>
      </ul>
    </div>
  </div>

  <!-- PAGE 6: FAQ Schema -->
  <div class="page">
    <h1>🧩 FAQ Schema (JSON-LD)</h1>
    <div class="footer">BalloonSight – AI Visibility Report | Page 6</div>
    <p style="color: #666; margin-bottom: 30px;">
      Copy and paste this code into your FAQ page's &lt;head&gt; section or before the closing &lt;/body&gt; tag.
    </p>
    
    <div class="code-block">&lt;script type="application/ld+json"&gt;
${JSON.stringify(data.faqSchema || generateDefaultFAQSchema(faqItems), null, 2)}
&lt;/script&gt;</div>
    
    <div class="section" style="margin-top: 30px;">
      <h2>How to Use</h2>
      <ol style="padding-left: 24px; color: #555;">
        <li>Copy the entire code block above</li>
        <li>Paste it into your FAQ page HTML</li>
        <li>Update the questions and answers to match your content</li>
        <li>Validate using Google's Rich Results Test</li>
      </ol>
    </div>
  </div>

  <!-- PAGE 7: Organization Schema -->
  <div class="page">
    <h1>🧩 Organization Schema (JSON-LD)</h1>
    <div class="footer">BalloonSight – AI Visibility Report | Page 7</div>
    <p style="color: #666; margin-bottom: 30px;">
      Copy and paste this code into your homepage's &lt;head&gt; section or before the closing &lt;/body&gt; tag.
    </p>
    
    <div class="code-block">&lt;script type="application/ld+json"&gt;
${JSON.stringify(data.orgSchema || generateDefaultOrgSchema(domain), null, 2)}
&lt;/script&gt;</div>
    
    <div class="section" style="margin-top: 30px;">
      <h2>How to Use</h2>
      <ol style="padding-left: 24px; color: #555;">
        <li>Copy the entire code block above</li>
        <li>Update the organization name, URL, and contact information</li>
        <li>Add your logo URL and social media profiles</li>
        <li>Paste it into your homepage HTML</li>
        <li>Validate using Google's Rich Results Test</li>
      </ol>
    </div>
  </div>

  <!-- PAGE 8: Technical Overview -->
  <div class="page">
    <h1>🔧 Technical Overview</h1>
    <div class="footer">BalloonSight – AI Visibility Report | Page 8</div>
    <p style="color: #666; margin-bottom: 30px;">
      Current status of technical elements that affect AI visibility.
    </p>
    
    <div class="tech-grid">
      ${(() => {
        const getBadgeClass = (status: string | undefined) => {
          if (!status) return 'badge-missing';
          const statusLower = status.toLowerCase();
          if (statusLower.includes('ok') || statusLower.includes('configured') || statusLower.includes('present') || statusLower.includes('detected') || statusLower.includes('https') || statusLower.includes('good') || statusLower.includes('responsive')) {
            return 'badge-ok';
          } else if (statusLower.includes('partial')) {
            return 'badge-partial';
          } else {
            return 'badge-missing';
          }
        };
        return `
      <div class="tech-item">
        <div class="tech-label">🤖 Robots.txt</div>
        <span class="badge ${getBadgeClass(technical.robots)}">${technical.robots || 'Unknown'}</span>
      </div>
      
      <div class="tech-item">
        <div class="tech-label">🗺️ Sitemap.xml</div>
        <span class="badge ${getBadgeClass(technical.sitemap)}">${technical.sitemap || 'Unknown'}</span>
      </div>
      
      <div class="tech-item">
        <div class="tech-label">📋 Schema Markup</div>
        <span class="badge ${getBadgeClass(technical.schema)}">${technical.schema || 'Unknown'}</span>
      </div>
      
      <div class="tech-item">
        <div class="tech-label">⚡ Performance</div>
        <span class="badge ${getBadgeClass(technical.performance)}">${technical.performance || 'Unknown'}</span>
      </div>
      
      <div class="tech-item">
        <div class="tech-label">📱 Mobile</div>
        <span class="badge ${getBadgeClass(technical.mobile)}">${technical.mobile || 'Unknown'}</span>
      </div>
      
      <div class="tech-item">
        <div class="tech-label">🔒 Security (HTTPS)</div>
        <span class="badge ${getBadgeClass(technical.security)}">${technical.security || 'Unknown'}</span>
      </div>
        `;
      })()}
    </div>
    
    <div class="section" style="margin-top: 40px;">
      <h2>Technical Recommendations</h2>
      <ul>
        <li>Ensure robots.txt allows AI crawlers (GPTBot, CCBot, Google-Extended)</li>
        <li>Submit your sitemap.xml to Google Search Console</li>
        <li>Add schema markup to all key pages</li>
        <li>Optimize page load speed for better AI crawling</li>
        <li>Ensure mobile responsiveness</li>
        <li>Use HTTPS across all pages</li>
      </ul>
    </div>
  </div>

  <!-- PAGE 9: Recommended Homepage Content Block -->
  <div class="page">
    <h1>🏠 Recommended Homepage Content Block</h1>
    <div class="footer">BalloonSight – AI Visibility Report | Page 9</div>
    <p style="color: #666; margin-bottom: 30px;">
      Use this content block on your homepage to improve AI understanding of your value proposition.
    </p>
    
    <div class="section-card">
      <div class="code-block">${data.recommendedContentBlock || `Welcome to ${domain}. We provide exceptional services tailored to your needs. Our team is dedicated to delivering results that exceed expectations. Contact us today to learn how we can help you achieve your goals.`}</div>
    </div>
    
    <div class="section" style="margin-top: 30px;">
      <h2>Where to Place This</h2>
      <ul>
        <li>Hero section (below your main headline)</li>
        <li>About section on homepage</li>
        <li>Top of your main content area</li>
      </ul>
    </div>
    
    <div class="section">
      <h2>Customization Tips</h2>
      <p class="section-content">
        Customize this content to match your brand voice and specific offerings. Make sure it clearly 
        communicates who you serve, what problems you solve, and why customers should choose you.
      </p>
    </div>
  </div>

  <!-- PAGE 10: Closing Page -->
  <div class="page page-closing">
    <div class="closing-logo">
      <img src="${logoUrl}" alt="BalloonSight Logo" style="width: 140px; height: auto;" onerror="this.style.display='none';" />
    </div>
    <div class="closing-divider"></div>
    <div class="closing-message">
      <p style="font-family: 'Cormorant Garamond', 'Times New Roman', Georgia, serif; font-size: 28px; font-weight: 700; color: white; margin-bottom: 20px;">
        Thank you for using BalloonSight.
      </p>
      <p style="font-size: 18px; color: rgba(255, 255, 255, 0.9); margin-top: 10px;">
        🎈 Your website is now more visible to AI systems.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// Helper function to generate default FAQ Schema
function generateDefaultFAQSchema(faqItems: Array<{ question: string; answer: string }>): any {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

// Helper function to generate default Organization Schema
function generateDefaultOrgSchema(domain: string): any {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": domain.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    "url": domain.startsWith('http') ? domain : `https://${domain}`,
    "logo": domain.startsWith('http') 
      ? `${domain}/logo.png` 
      : `https://${domain}/logo.png`,
    "sameAs": []
  };
}
