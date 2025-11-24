import { NextResponse } from "next/server";
import { generatePdf } from "@/lib/pdf";
import { generateFullReport } from "@/lib/reportTemplate";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { domain, data } = body;

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    // Generate HTML report
    const html = generateFullReport(domain, data || {});

    // Generate PDF from HTML
    const pdfBuffer = await generatePdf(html);

    // Return PDF as response (convert Buffer to Uint8Array for NextResponse)
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="balloonsight-report-${domain.replace(/[^a-z0-9]/gi, '-')}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating PDF report:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF report", details: error.message },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for testing
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json(
      { error: "Domain parameter is required. Use: /api/generate-report?domain=example.com" },
      { status: 400 }
    );
  }

  try {
    // Generate HTML report with sample data for testing (new structure)
    const sampleData = {
      score: 72,
      persona: {
        currentAudience: "General business professionals seeking digital solutions",
        recommendedAudience: "Small to medium businesses looking to improve their AI visibility",
        positioning: "The trusted partner for businesses wanting to be discovered by AI systems",
        tone: "Professional, approachable, and results-focused"
      },
      contentPack: {
        h1: "Transform Your Website's AI Visibility",
        h2s: [
          "Why AI Visibility Matters",
          "How We Help You Get Discovered",
          "Get Started Today"
        ],
        metaDescription: "Improve your website's visibility to AI systems. Get discovered by ChatGPT, Google's AI, and other AI assistants. Professional AI visibility analysis and optimization.",
        introParagraph: "In the age of AI-powered search, your website needs to be optimized for AI systems, not just search engines. We help businesses improve their AI visibility so they can be discovered and recommended by AI assistants like ChatGPT, Claude, and Google's AI."
      },
      faq: {
        items: [
          {
            question: "What is AI visibility?",
            answer: "AI visibility refers to how easily AI systems like ChatGPT, Claude, and Google's AI can discover, understand, and recommend your website to users. It's the new frontier of digital marketing."
          },
          {
            question: "Why does AI visibility matter?",
            answer: "As more people use AI assistants for search and recommendations, being visible to AI systems becomes crucial for business growth. AI systems need structured data and clear content to understand and recommend your services."
          },
          {
            question: "How do you improve AI visibility?",
            answer: "We analyze your website's technical setup, content structure, schema markup, and persona clarity. Then we provide actionable recommendations and ready-to-use content optimized for AI understanding."
          },
          {
            question: "How long does it take to see results?",
            answer: "After implementing our recommendations, AI systems typically re-crawl your site within days to weeks. Most clients see improved AI visibility within 2-4 weeks of implementation."
          }
        ]
      },
      technical: {
        robots: "Configured - AI bots allowed",
        sitemap: "Present at /sitemap.xml",
        schema: "2 JSON-LD schemas detected",
        performance: "Good - 75/100",
        mobile: "Responsive design",
        security: "HTTPS enabled"
      },
      recommendedContentBlock: "We help businesses improve their AI visibility so they can be discovered and recommended by AI assistants. Our comprehensive analysis identifies exactly what AI systems need to understand and recommend your services. Get your AI Visibility Report today and start optimizing for the future of search."
    };

    const html = generateFullReport(domain, sampleData);
    const pdfBuffer = await generatePdf(html);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="balloonsight-report-${domain.replace(/[^a-z0-9]/gi, '-')}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating PDF report:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF report", details: error.message },
      { status: 500 }
    );
  }
}

