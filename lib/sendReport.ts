import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY. Please set it in your environment variables.");
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

export async function sendReport(email: string, pdf: Buffer) {
  if (!process.env.RESEND_API_KEY) {
    console.error("❌ Missing RESEND_API_KEY");
    throw new Error("RESEND_API_KEY is required to send reports.");
  }

  if (!process.env.REPORT_SENDER_EMAIL) {
    console.error("❌ Missing REPORT_SENDER_EMAIL");
    throw new Error("REPORT_SENDER_EMAIL is required to send reports.");
  }

  try {
    const resend = getResend();
    const result = await resend.emails.send({
      from: `BalloonSight <${process.env.REPORT_SENDER_EMAIL}>`,
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
      from: process.env.REPORT_SENDER_EMAIL
    });
    
    return result;
  } catch (error: any) {
    console.error("❌ Error sending email:", error);
    console.error("Email error details:", {
      message: error.message,
      name: error.name,
      statusCode: error.statusCode,
      email,
      hasResendKey: !!process.env.RESEND_API_KEY,
      senderEmail: process.env.REPORT_SENDER_EMAIL
    });
    throw error;
  }
}
