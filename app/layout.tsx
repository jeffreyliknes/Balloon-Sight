import type { Metadata } from "next";
import { Nunito, Fraunces } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "BalloonSight",
  description: "Analyze how well AI agents can read and understand your website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${fraunces.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-accent/20`}>
        <div className="fixed inset-0 -z-10 h-full w-full bg-background opacity-100 pointer-events-none mix-blend-normal"></div>
        {children}
      </body>
    </html>
  );
}

