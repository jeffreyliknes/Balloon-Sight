import type { Metadata } from "next";
import { Nunito, Fraunces } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "BalloonSight | AI Visibility Optimization Tool",
  description: "Analyze how well AI agents can read and understand your website. Get a visibility score and actionable tips to optimize for ChatGPT, Claude, and Perplexity.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "BalloonSight | Don't just rank. Be understood.",
    description: "Optimize your website for the AI era. Analyze technical signals, schema, and brand voice.",
    url: "https://balloonsight.com",
    siteName: "BalloonSight",
    images: [
      {
        url: "/balloonsight-logo.png",
        width: 800,
        height: 600,
        alt: "BalloonSight Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BalloonSight | AI Visibility Optimization",
    description: "Analyze how well AI agents can read and understand your website.",
    images: ["/balloonsight-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "BalloonSight",
        "applicationCategory": "SEO Tool",
        "operatingSystem": "Web Browser",
        "description": "Analyze how well AI agents can read, understand, and cite your website. Optimize your technical SEO signals for the AI era.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Organization",
          "name": "BalloonSight Inc.",
          "url": "https://balloonsight.com",
          "logo": "https://balloonsight.com/balloonsight-logo.png"
        }
      },
      {
        "@type": "Organization",
        "name": "BalloonSight",
        "url": "https://balloonsight.com",
        "logo": "https://balloonsight.com/logo.png",
        "sameAs": [
          "https://twitter.com/balloonsight",
          "https://linkedin.com/company/balloonsight"
        ]
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TM8CGZWC');`,
          }}
        />
        {/* End Google Tag Manager */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${nunito.variable} ${fraunces.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-accent/20`} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TM8CGZWC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <div className="fixed inset-0 -z-10 h-full w-full bg-background opacity-100 pointer-events-none mix-blend-normal"></div>
        {children}
      </body>
    </html>
  );
}
