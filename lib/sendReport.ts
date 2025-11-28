import { Resend } from "resend";
import { env } from "./env";

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    if (!env.resendApiKey) {
      throw new Error("Missing RESEND_API_KEY. Please set it in your environment variables.");
    }
    resendInstance = new Resend(env.resendApiKey);
  }
  return resendInstance;
}

export async function sendReport(email: string, pdf: Buffer) {
  if (!env.resendApiKey) {
    console.error("❌ Missing RESEND_API_KEY");
    throw new Error("RESEND_API_KEY is required to send reports.");
  }

  if (!env.senderEmail) {
    console.error("❌ Missing REPORT_SENDER_EMAIL");
    throw new Error("REPORT_SENDER_EMAIL is required to send reports.");
  }

  try {
    const resend = getResend();
    const result = await resend.emails.send({
      from: `BalloonSight <${env.senderEmail}>`,
      to: email,
      subject: "Your AI Visibility Report is Ready",
      html: "<p>Your AI Visibility Report is attached. Thank you for using BalloonSight!</p>",
      attachments: [{ filename: "balloonsight-report.pdf", content: pdf.toString("base64") }]
    });
    
    if (result.error) {
      throw new Error(result.error.message || "Failed to send email");
    }
    
    // Type-safe access to email ID
    const emailId = result.data && typeof result.data === 'object' && 'id' in result.data 
      ? (result.data as { id: string }).id 
      : undefined;
    
    console.log("✅ Email sent successfully:", {
      emailId: emailId || "unknown",
      to: email,
      from: env.senderEmail
    });
    
    return result;
  } catch (error: any) {
    console.error("❌ Error sending email:", error);
    console.error("Email error details:", {
      message: error.message,
      name: error.name,
      statusCode: error.statusCode,
      email,
      hasResendKey: !!env.resendApiKey,
      senderEmail: env.senderEmail
    });
    throw error;
  }
}
