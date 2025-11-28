import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for the application
 * Production (Vercel): Uses NEXT_PUBLIC_BASE_URL or VERCEL_URL
 * Local development: Uses localhost:3000
 */
export function getBaseUrl(): string {
  if (process.env.VERCEL === "1") {
    // Production on Vercel
    return process.env.NEXT_PUBLIC_BASE_URL || `https://${process.env.VERCEL_URL || 'balloonsight.com'}`;
  }
  // Local development
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

