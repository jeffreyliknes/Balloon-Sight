"use client";

import { BalloonSightLogo } from "@/components/BalloonSightLogo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    if (!sessionId) {
      setDownloadError("Session ID not found. Your report has been sent to your email. Please check your inbox.");
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);
    setDownloadSuccess(false);

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
      
      let response;
      try {
        response = await fetch(`/api/download-report?session_id=${encodeURIComponent(sessionId)}`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error("Request timed out. The report generation is taking longer than expected. Please check your email for the report.");
        }
        throw new Error("Network error. Please check your connection and try again, or check your email for the report.");
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to download PDF" }));
        const errorMessage = errorData.error || `Server error: ${response.status}`;
        // If payment not completed or session invalid, suggest checking email
        if (response.status === 402 || response.status === 400) {
          throw new Error(`${errorMessage}. Your report will be sent to your email shortly.`);
        }
        // For server errors, suggest checking email as backup
        if (response.status >= 500) {
          throw new Error(`${errorMessage}. Please check your email for the report.`);
        }
        throw new Error(errorMessage);
      }

      // Verify content type
      const contentType = response.headers.get("Content-Type");
      if (contentType && !contentType.includes("application/pdf")) {
        throw new Error("Invalid response format. Please check your email for the report.");
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Verify blob is not empty
      if (blob.size === 0) {
        throw new Error("Downloaded file is empty. Please try again or check your email for the report.");
      }
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "balloonsight-report.pdf";
      if (contentDisposition) {
        // Try RFC 5987 format first (filename*=UTF-8''...)
        let filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)/i);
        if (filenameMatch) {
          filename = decodeURIComponent(filenameMatch[1]);
        } else {
          // Try standard format with quotes
          filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          } else {
            // Try unquoted format
            filenameMatch = contentDisposition.match(/filename=([^;]+)/);
            if (filenameMatch) {
              filename = filenameMatch[1].trim();
            }
          }
        }
        // Clean up any remaining quotes or whitespace
        filename = filename.replace(/^["']|["']$/g, '').trim();
      }

      // Create download link and trigger download
      try {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setDownloadSuccess(true);
      } catch (downloadError: any) {
        throw new Error(`Failed to trigger download: ${downloadError.message}. Please check your email for the report.`);
      }
    } catch (error: any) {
      console.error("Download error:", error);
      setDownloadError(error.message || "Failed to download PDF. Please check your email for the report.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-primary flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[40px] p-12 max-w-lg w-full shadow-2xl flex flex-col items-center"
      >
        <div className="mb-8 p-4 bg-brand-primary rounded-full">
            <BalloonSightLogo size={80} />
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-brand-primary mb-4">Payment Successful!</h1>
        <p className="text-brand-primary/70 text-lg font-medium mb-6">
          Your AI Visibility Report is ready!
        </p>
        <p className="text-brand-primary/60 text-sm mb-8">
          Download your report now or check your email for a copy.
        </p>

        <div className="w-full space-y-4 mb-6">
          {sessionId ? (
            <Button 
              onClick={handleDownload}
              disabled={isDownloading || downloadSuccess}
              className="h-14 px-10 rounded-full bg-accent hover:bg-accent/90 text-white text-lg font-bold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating PDF...
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Download Complete!
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF Report
                </>
              )}
            </Button>
          ) : (
            <div className="p-4 bg-brand-primary/5 border-2 border-brand-primary/20 rounded-lg">
              <p className="text-brand-primary/80 font-medium mb-2">
                Your report is being generated and will be sent to your email shortly.
              </p>
              <p className="text-brand-primary/60 text-sm">
                Please check your inbox (and spam folder) for the PDF report.
              </p>
            </div>
          )}

          {downloadError && (
            <div className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{downloadError}</span>
            </div>
          )}

          {downloadSuccess && (
            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Report downloaded successfully! Check your email for a backup copy.</span>
            </div>
          )}
        </div>

        <div className="w-full pt-4 border-t border-brand-primary/10">
          <Link href="/">
            <Button 
              variant="outline" 
              className="h-12 px-8 rounded-full border-2 border-brand-primary/40 bg-brand-primary text-white font-bold hover:bg-white hover:text-brand-primary hover:border-brand-primary/60 w-full transition-colors"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-brand-primary flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white rounded-[40px] p-12 max-w-lg w-full shadow-2xl flex flex-col items-center">
          <div className="mb-8 p-4 bg-brand-primary rounded-full">
            <BalloonSightLogo size={80} />
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          <p className="text-brand-primary/70 text-lg font-medium mt-4">Loading...</p>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}

