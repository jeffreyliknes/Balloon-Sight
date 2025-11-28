// AI Visibility Upgrade Kit - Full PDF Report Template
// This template generates a comprehensive PDF report

// Brand Colors
const BRAND_COLORS = {
  deepRed: "#551121",
  terracotta: "#D77C56",
  sandYellow: "#F2D781",
  aquaGreen: "#A7D2D1",
  pastelPeach: "#F6D6CA"
};

// SVG Icon Functions - Inline SVG icons for PDF
function getIconSVG(iconName: string, color: string = BRAND_COLORS.deepRed, size: number = 24): string {
  const icons: Record<string, string> = {
    user: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    pencil: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    question: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12V14" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 18H12.01" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    schema: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="${color}" stroke-width="2"/>
      <path d="M9 9H15M9 12H15M9 15H12" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    wrench: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.7 6.3C15.0905 6.69053 15.3237 7.22099 15.3237 7.775C15.3237 8.32901 15.0905 8.85947 14.7 9.25L9.25 14.7C8.85947 15.0905 8.32901 15.3237 7.775 15.3237C7.22099 15.3237 6.69053 15.0905 6.3 14.7L3.525 11.925L5.925 9.525L3.525 7.125L6.3 4.35C6.69053 3.95947 7.22099 3.72632 7.775 3.72632C8.32901 3.72632 8.85947 3.95947 9.25 4.35L14.7 6.3Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M19.5 19.5L15.5 15.5" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    home: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 22V12H15V22" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    chart: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3V21H21" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 16L11 12L15 8L21 14" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    gauge: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="${color}" stroke-width="2"/>
      <path d="M12 6V12L16 14" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  };
  return icons[iconName] || '';
}

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
  // New fields for enhanced AI analysis
  scoreBreakdown?: {
    contentClarityScore: number;      // 0-100
    schemaScore: number;              // 0-100
    metadataScore: number;            // 0-100
    aiReadabilityScore: number;      // 0-100
    personaAlignmentScore: number;   // 0-100
    overallScore: number;            // average
  };
  aiVisibilityInsights?: {
    aiInterpretation: string;
    valuePropositionClarity: string;
    intentCommunication: string;
    ambiguityDetected: string;
    summarizationEase: string;
  };
  keywordIntent?: {
    primaryIntent: string;
    secondaryIntent: string;
    recommendedKeywords: string[];    // 5 keywords
    contentWeaknesses: string[];     // 5 weaknesses
  };
  trustEAT?: {
    authoritativenessScore: number;   // 0-100
    trustSignalsScore: number;        // 0-100
    contentFreshnessScore: number;   // 0-100
    uxClarityScore: number;          // 0-100
    issuesExplanation: string;
  };
  quickWins?: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;  // 10 items
  // Legacy support for existing data structure
  categories?: any;
  rawJsonLd?: any[];
}

export function generateFullReport(domain: string, data: Partial<ReportData> = {}): string {
  const reportDate = data.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const brandColor = BRAND_COLORS.deepRed;
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
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      color: #1a1a1a; 
      font-size: 14.5px;
      line-height: 1.8;
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
      background: linear-gradient(180deg, ${BRAND_COLORS.deepRed} 0%, #3c0d18 100%);
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
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      font-size: 120px;
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
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      color: ${BRAND_COLORS.deepRed};
      font-size: 42px;
      margin-top: 50px;
      margin-bottom: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
      border-bottom: 3px solid ${BRAND_COLORS.deepRed};
      padding-bottom: 12px;
    }
    
    h2 {
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      color: ${BRAND_COLORS.deepRed};
      font-size: 26px;
      margin-top: 40px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    
    h3 {
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      color: ${BRAND_COLORS.deepRed};
      font-size: 20px;
      margin-top: 20px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    /* Section Headers with Icons */
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
    }
    
    /* Report Sections */
    .report-section {
      margin: 40px 0;
      padding: 20px;
      background: ${BRAND_COLORS.pastelPeach}15;
      border-radius: 8px;
      border-left: 4px solid ${BRAND_COLORS.deepRed};
    }
    
    .section-content {
      color: #555;
      line-height: 1.8;
      padding: 20px 0;
    }
    
    /* Highlight Boxes */
    .highlight-box {
      background: ${BRAND_COLORS.sandYellow}30;
      border-left: 4px solid ${BRAND_COLORS.terracotta};
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    /* Score Bars */
    .score-bar-container {
      margin: 16px 0;
    }
    
    .score-bar-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
    
    .score-bar {
      height: 24px;
      background: #e0e0e0;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
    }
    
    .score-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, ${BRAND_COLORS.deepRed} 0%, ${BRAND_COLORS.terracotta} 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 8px;
      color: white;
      font-size: 12px;
      font-weight: 600;
      transition: width 0.3s ease;
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
      border: 1px solid ${BRAND_COLORS.aquaGreen}40;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
      margin: 28px 0;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: ${BRAND_COLORS.deepRed};
      margin-bottom: 12px;
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
      color: ${BRAND_COLORS.deepRed};
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
      color: ${BRAND_COLORS.deepRed};
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
      background: linear-gradient(180deg, ${BRAND_COLORS.deepRed} 0%, #3c0d18 100%);
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
      background: ${BRAND_COLORS.terracotta};
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
      color: ${BRAND_COLORS.deepRed}80;
      border-top: 1px solid ${BRAND_COLORS.aquaGreen}30;
      padding-top: 10px;
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
      color: ${BRAND_COLORS.deepRed};
      font-weight: bold;
      font-size: 18px;
    }
    
    /* Quick Wins Checklist */
    .quick-wins-list {
      list-style: none;
      padding: 0;
    }
    
    .quick-win-item {
      padding: 12px 0;
      padding-left: 32px;
      position: relative;
      border-bottom: 1px solid #eee;
    }
    
    .quick-win-item:last-child {
      border-bottom: none;
    }
    
    .quick-win-checkbox {
      position: absolute;
      left: 0;
      top: 14px;
      width: 20px;
      height: 20px;
      border: 2px solid ${BRAND_COLORS.deepRed};
      border-radius: 4px;
      background: white;
    }
    
    .quick-win-priority {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-left: 8px;
      text-transform: uppercase;
    }
    
    .priority-high {
      background: ${BRAND_COLORS.terracotta}30;
      color: ${BRAND_COLORS.deepRed};
    }
    
    .priority-medium {
      background: ${BRAND_COLORS.sandYellow}40;
      color: #8b6914;
    }
    
    .priority-low {
      background: ${BRAND_COLORS.aquaGreen}40;
      color: #2d5f5e;
    }
    
    /* Trust Score Cards */
    .trust-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    
    .trust-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      border: 2px solid ${BRAND_COLORS.aquaGreen}40;
      text-align: center;
    }
    
    .trust-score {
      font-size: 36px;
      font-weight: 700;
      color: ${BRAND_COLORS.deepRed};
      margin: 10px 0;
    }
    
    .trust-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Two Column Layout */
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin: 20px 0;
    }
    
    .intent-card {
      background: ${BRAND_COLORS.pastelPeach}30;
      border-left: 4px solid ${BRAND_COLORS.terracotta};
      padding: 20px;
      border-radius: 8px;
    }
    
    .keyword-tag {
      display: inline-block;
      background: ${BRAND_COLORS.aquaGreen}30;
      color: ${BRAND_COLORS.deepRed};
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 13px;
      margin: 4px 4px 4px 0;
      font-weight: 500;
    }
    
    .weakness-item {
      padding: 8px 0;
      padding-left: 24px;
      position: relative;
    }
    
    .weakness-item:before {
      content: "⚠";
      position: absolute;
      left: 0;
      color: ${BRAND_COLORS.terracotta};
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
    <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin: 30px 0;">
      <div style="width: 80px; height: 80px; color: white;">${getIconSVG('gauge', 'white', 80)}</div>
      <div class="score-large">${score}</div>
    </div>
    <div class="cover-subtitle">AI Visibility Score</div>
    <div class="cover-domain">${domain}</div>
    <div class="cover-date">${reportDate}</div>
  </div>

  <!-- PAGE 2: Executive Summary -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('chart', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">Executive Summary</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
    <section class="report-section">
      <div class="score-large" style="color: ${BRAND_COLORS.deepRed}; font-size: 72px; margin: 30px 0;">${score}/100</div>
      <p class="section-content">
        Your website's AI Visibility Score is <strong>${score}/100</strong>. This report provides a comprehensive 
        analysis of how AI systems perceive and understand your website, along with actionable recommendations 
        to improve your visibility.
      </p>
    </section>
    
    <section class="report-section">
      <h2>What You Get in This Report</h2>
      <ul>
        <li>Persona Strategy: Current audience analysis and recommended positioning</li>
        <li>Content Upgrade Pack: Ready-to-use headlines, meta descriptions, and content blocks</li>
        <li>Complete FAQ Page: Questions and answers optimized for AI understanding</li>
        <li>Schema Markup: Copy-paste JSON-LD code for FAQ and Organization</li>
        <li>Technical Overview: Current status of robots.txt, sitemap, schema, and more</li>
        <li>Recommended Homepage Content: Ready-to-implement content block</li>
      </ul>
    </section>
    
    <section class="report-section">
      <h2>Key Findings</h2>
      <p class="section-content">
        ${score >= 80 
          ? "Your website shows strong AI visibility. The recommendations in this report will help you maintain and improve your position."
          : score >= 60
          ? "Your website has good foundations but needs optimization in key areas. Follow the action plan to improve your score."
          : "Your website requires significant improvements for AI visibility. Prioritize the recommendations in this report to see substantial gains."
        }
      </p>
    </section>
  </div>

  ${data.scoreBreakdown ? `
  <!-- PAGE 2.5: Score Breakdown -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('gauge', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">Score Breakdown</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
    <section class="report-section">
      <p class="section-content">Detailed breakdown of your AI visibility score across key dimensions.</p>
      
      <div class="score-bar-container">
        <div class="score-bar-label">
          <span>Content Clarity</span>
          <span>${data.scoreBreakdown.contentClarityScore}%</span>
        </div>
        <div class="score-bar">
          <div class="score-bar-fill" style="width: ${data.scoreBreakdown.contentClarityScore}%;">${data.scoreBreakdown.contentClarityScore}%</div>
        </div>
      </div>
      
      <div class="score-bar-container">
        <div class="score-bar-label">
          <span>Schema Markup</span>
          <span>${data.scoreBreakdown.schemaScore}%</span>
        </div>
        <div class="score-bar">
          <div class="score-bar-fill" style="width: ${data.scoreBreakdown.schemaScore}%;">${data.scoreBreakdown.schemaScore}%</div>
        </div>
      </div>
      
      <div class="score-bar-container">
        <div class="score-bar-label">
          <span>Metadata Quality</span>
          <span>${data.scoreBreakdown.metadataScore}%</span>
        </div>
        <div class="score-bar">
          <div class="score-bar-fill" style="width: ${data.scoreBreakdown.metadataScore}%;">${data.scoreBreakdown.metadataScore}%</div>
        </div>
      </div>
      
      <div class="score-bar-container">
        <div class="score-bar-label">
          <span>AI Readability</span>
          <span>${data.scoreBreakdown.aiReadabilityScore}%</span>
        </div>
        <div class="score-bar">
          <div class="score-bar-fill" style="width: ${data.scoreBreakdown.aiReadabilityScore}%;">${data.scoreBreakdown.aiReadabilityScore}%</div>
        </div>
      </div>
      
      <div class="score-bar-container">
        <div class="score-bar-label">
          <span>Persona Alignment</span>
          <span>${data.scoreBreakdown.personaAlignmentScore}%</span>
        </div>
        <div class="score-bar">
          <div class="score-bar-fill" style="width: ${data.scoreBreakdown.personaAlignmentScore}%;">${data.scoreBreakdown.personaAlignmentScore}%</div>
        </div>
      </div>
      
      <div class="score-bar-container" style="margin-top: 30px;">
        <div class="score-bar-label">
          <span style="font-size: 18px; font-weight: 700;">Overall Score</span>
          <span style="font-size: 18px; font-weight: 700;">${data.scoreBreakdown.overallScore}%</span>
        </div>
        <div class="score-bar" style="height: 32px;">
          <div class="score-bar-fill" style="width: ${data.scoreBreakdown.overallScore}%; font-size: 16px;">${data.scoreBreakdown.overallScore}%</div>
        </div>
      </div>
    </section>
  </div>
  ` : ''}

  <!-- PAGE 3: Persona Strategy -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('user', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">Persona Strategy</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
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
    
    <section class="report-section" style="margin-top: 40px;">
      <h2>Why This Matters</h2>
      <p class="section-content">
        AI systems need clear signals about who you serve and what problems you solve. By refining your 
        persona and positioning, you make it easier for AI assistants to recommend your services to 
        the right people at the right time.
      </p>
    </section>
  </div>

  ${data.aiVisibilityInsights ? `
  <!-- PAGE 3.5: AI Visibility Insights -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('chart', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">AI Visibility Insights</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
    <section class="report-section">
      <p class="section-content">How AI systems interpret and understand your website.</p>
      
      <div class="highlight-box">
        <h3 style="color: ${BRAND_COLORS.deepRed}; margin-bottom: 12px;">AI Interpretation</h3>
        <p class="section-content">${data.aiVisibilityInsights.aiInterpretation}</p>
      </div>
      
      <div class="highlight-box">
        <h3 style="color: ${BRAND_COLORS.deepRed}; margin-bottom: 12px;">Value Proposition Clarity</h3>
        <p class="section-content">${data.aiVisibilityInsights.valuePropositionClarity}</p>
      </div>
      
      <div class="highlight-box">
        <h3 style="color: ${BRAND_COLORS.deepRed}; margin-bottom: 12px;">Intent Communication</h3>
        <p class="section-content">${data.aiVisibilityInsights.intentCommunication}</p>
      </div>
      
      <div class="highlight-box">
        <h3 style="color: ${BRAND_COLORS.deepRed}; margin-bottom: 12px;">Ambiguity Detection</h3>
        <p class="section-content">${data.aiVisibilityInsights.ambiguityDetected}</p>
      </div>
      
      <div class="highlight-box">
        <h3 style="color: ${BRAND_COLORS.deepRed}; margin-bottom: 12px;">Summarization Ease</h3>
        <p class="section-content">${data.aiVisibilityInsights.summarizationEase}</p>
      </div>
    </section>
  </div>
  ` : ''}

  ${data.keywordIntent ? `
  <!-- PAGE 4: Keyword & Intent Recommendations -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('pencil', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">Keyword & Intent Recommendations</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
    <section class="report-section">
      <div class="two-column">
        <div class="intent-card">
          <h3 style="color: ${BRAND_COLORS.deepRed}; margin-bottom: 12px;">Primary Intent</h3>
          <p class="section-content">${data.keywordIntent.primaryIntent}</p>
        </div>
        <div class="intent-card">
          <h3 style="color: ${BRAND_COLORS.deepRed}; margin-bottom: 12px;">Secondary Intent</h3>
          <p class="section-content">${data.keywordIntent.secondaryIntent}</p>
        </div>
      </div>
      
      <div style="margin-top: 30px;">
        <h3 style="color: ${BRAND_COLORS.deepRed}; margin-bottom: 16px;">Recommended Keywords for AI Agents</h3>
        <div>
          ${data.keywordIntent.recommendedKeywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
        </div>
      </div>
      
      <div style="margin-top: 30px;">
        <h3 style="color: ${BRAND_COLORS.deepRed}; margin-bottom: 16px;">Content Weaknesses</h3>
        <ul style="list-style: none; padding: 0;">
          ${data.keywordIntent.contentWeaknesses.map(weakness => `<li class="weakness-item">${weakness}</li>`).join('')}
        </ul>
      </div>
    </section>
  </div>
  ` : ''}

  <!-- PAGE 5: Content Upgrade Pack -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('pencil', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">Content Upgrade Pack</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
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

  <!-- PAGE 6: FAQ Page -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('question', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">Complete FAQ Page</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
    <p style="color: #666; margin-bottom: 30px;">
      Pre-written FAQ content optimized for AI understanding. Use this on your website's FAQ page.
    </p>
    
    ${faqItems.map((item, index) => `
      <div class="section-card">
        <div class="faq-question">Q${index + 1}: ${item.question}</div>
        <div class="faq-answer">${item.answer}</div>
      </div>
    `).join('')}
    
    <section class="report-section" style="margin-top: 40px;">
      <h2>Implementation Tips</h2>
      <ul>
        <li>Place these FAQs on a dedicated /faq page</li>
        <li>Use proper HTML structure with &lt;h2&gt; for questions and &lt;p&gt; for answers</li>
        <li>Add the FAQ Schema markup from the next page to enhance AI understanding</li>
      </ul>
    </section>
  </div>

  <!-- PAGE 7: FAQ Schema -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('schema', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">FAQ Schema (JSON-LD)</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
    <p style="color: #666; margin-bottom: 30px;">
      Copy and paste this code into your FAQ page's &lt;head&gt; section or before the closing &lt;/body&gt; tag.
    </p>
    
    <div class="code-block">&lt;script type="application/ld+json"&gt;
${JSON.stringify(data.faqSchema || generateDefaultFAQSchema(faqItems), null, 2)}
&lt;/script&gt;</div>
    
    <section class="report-section" style="margin-top: 30px;">
      <h2>How to Use</h2>
      <ol style="padding-left: 24px; color: #555;">
        <li>Copy the entire code block above</li>
        <li>Paste it into your FAQ page HTML</li>
        <li>Update the questions and answers to match your content</li>
        <li>Validate using Google's Rich Results Test</li>
      </ol>
    </section>
  </div>

  <!-- PAGE 8: Organization Schema -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('schema', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">Organization Schema (JSON-LD)</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
    <p style="color: #666; margin-bottom: 30px;">
      Copy and paste this code into your homepage's &lt;head&gt; section or before the closing &lt;/body&gt; tag.
    </p>
    
    <div class="code-block">&lt;script type="application/ld+json"&gt;
${JSON.stringify(data.orgSchema || generateDefaultOrgSchema(domain), null, 2)}
&lt;/script&gt;</div>
    
    <section class="report-section" style="margin-top: 30px;">
      <h2>How to Use</h2>
      <ol style="padding-left: 24px; color: #555;">
        <li>Copy the entire code block above</li>
        <li>Update the organization name, URL, and contact information</li>
        <li>Add your logo URL and social media profiles</li>
        <li>Paste it into your homepage HTML</li>
        <li>Validate using Google's Rich Results Test</li>
      </ol>
    </section>
  </div>

  <!-- PAGE 9: Technical Overview -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('wrench', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">Technical Overview</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
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
    
    <section class="report-section" style="margin-top: 40px;">
      <h2>Technical Recommendations</h2>
      <ul>
        <li>Ensure robots.txt allows AI crawlers (GPTBot, CCBot, Google-Extended)</li>
        <li>Submit your sitemap.xml to Google Search Console</li>
        <li>Add schema markup to all key pages</li>
        <li>Optimize page load speed for better AI crawling</li>
        <li>Ensure mobile responsiveness</li>
        <li>Use HTTPS across all pages</li>
      </ul>
    </section>
  </div>

  ${data.quickWins && data.quickWins.length > 0 ? `
  <!-- PAGE 10: 10 Quick Wins -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('pencil', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">10 Quick Wins</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
    <section class="report-section">
      <p class="section-content">Actionable improvements you can implement immediately to boost your AI visibility score.</p>
      
      ${data.quickWins.filter(w => w.priority === 'high').length > 0 ? `
      <h3 style="color: ${BRAND_COLORS.deepRed}; margin-top: 30px; margin-bottom: 16px;">High Priority</h3>
      <ul class="quick-wins-list">
        ${data.quickWins.filter(w => w.priority === 'high').map(win => `
          <li class="quick-win-item">
            <div class="quick-win-checkbox"></div>
            <strong>${win.title}</strong>
            <span class="quick-win-priority priority-high">High</span>
            <p style="margin: 8px 0 0 0; color: #666;">${win.description}</p>
          </li>
        `).join('')}
      </ul>
      ` : ''}
      
      ${data.quickWins.filter(w => w.priority === 'medium').length > 0 ? `
      <h3 style="color: ${BRAND_COLORS.deepRed}; margin-top: 30px; margin-bottom: 16px;">Medium Priority</h3>
      <ul class="quick-wins-list">
        ${data.quickWins.filter(w => w.priority === 'medium').map(win => `
          <li class="quick-win-item">
            <div class="quick-win-checkbox"></div>
            <strong>${win.title}</strong>
            <span class="quick-win-priority priority-medium">Medium</span>
            <p style="margin: 8px 0 0 0; color: #666;">${win.description}</p>
          </li>
        `).join('')}
      </ul>
      ` : ''}
      
      ${data.quickWins.filter(w => w.priority === 'low').length > 0 ? `
      <h3 style="color: ${BRAND_COLORS.deepRed}; margin-top: 30px; margin-bottom: 16px;">Low Priority</h3>
      <ul class="quick-wins-list">
        ${data.quickWins.filter(w => w.priority === 'low').map(win => `
          <li class="quick-win-item">
            <div class="quick-win-checkbox"></div>
            <strong>${win.title}</strong>
            <span class="quick-win-priority priority-low">Low</span>
            <p style="margin: 8px 0 0 0; color: #666;">${win.description}</p>
          </li>
        `).join('')}
      </ul>
      ` : ''}
    </section>
  </div>
  ` : ''}

  ${data.trustEAT ? `
  <!-- PAGE 11: E-E-A-T / Trust -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('chart', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">E-E-A-T / Trust Signals</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
    <section class="report-section">
      <p class="section-content">Assessment of your website's trustworthiness, expertise, authoritativeness, and user experience.</p>
      
      <div class="trust-grid">
        <div class="trust-card">
          <div class="trust-label">Authoritativeness</div>
          <div class="trust-score">${data.trustEAT.authoritativenessScore}</div>
        </div>
        <div class="trust-card">
          <div class="trust-label">Trust Signals</div>
          <div class="trust-score">${data.trustEAT.trustSignalsScore}</div>
        </div>
        <div class="trust-card">
          <div class="trust-label">Content Freshness</div>
          <div class="trust-score">${data.trustEAT.contentFreshnessScore}</div>
        </div>
        <div class="trust-card">
          <div class="trust-label">UX Clarity</div>
          <div class="trust-score">${data.trustEAT.uxClarityScore}</div>
        </div>
      </div>
      
      <div class="highlight-box" style="margin-top: 30px;">
        <h3 style="color: ${BRAND_COLORS.deepRed}; margin-bottom: 12px;">Issues & Recommendations</h3>
        <p class="section-content">${data.trustEAT.issuesExplanation}</p>
      </div>
    </section>
  </div>
  ` : ''}

  <!-- PAGE 12: Recommended Homepage Content Block -->
  <div class="page">
    <div class="section-header">
      <div class="icon-wrapper">${getIconSVG('home', BRAND_COLORS.deepRed)}</div>
      <h1 style="margin: 0; border: none; padding: 0;">Recommended Homepage Content Block</h1>
    </div>
    <div class="footer">BalloonSight – AI Visibility Report – balloonsight.com</div>
    <p style="color: #666; margin-bottom: 30px;">
      Use this content block on your homepage to improve AI understanding of your value proposition.
    </p>
    
    <div class="section-card">
      <div class="code-block">${data.recommendedContentBlock || `Welcome to ${domain}. We provide exceptional services tailored to your needs. Our team is dedicated to delivering results that exceed expectations. Contact us today to learn how we can help you achieve your goals.`}</div>
    </div>
    
    <section class="report-section" style="margin-top: 30px;">
      <h2>Where to Place This</h2>
      <ul>
        <li>Hero section (below your main headline)</li>
        <li>About section on homepage</li>
        <li>Top of your main content area</li>
      </ul>
    </section>
    
    <section class="report-section">
      <h2>Customization Tips</h2>
      <p class="section-content">
        Customize this content to match your brand voice and specific offerings. Make sure it clearly 
        communicates who you serve, what problems you solve, and why customers should choose you.
      </p>
    </section>
  </div>

  <!-- PAGE 13: Closing Page -->
  <div class="page page-closing">
    <div class="closing-logo">
      <img src="${logoUrl}" alt="BalloonSight Logo" style="width: 140px; height: auto;" onerror="this.style.display='none';" />
    </div>
    <div class="closing-divider"></div>
    <div class="closing-message">
      <p style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; font-size: 28px; font-weight: 700; color: white; margin-bottom: 20px;">
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
