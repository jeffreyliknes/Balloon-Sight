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
    console.error("Missing RESEND_API_KEY");
    throw new Error("RESEND_API_KEY is required to send reports.");
  }

  try {
    const resend = getResend();
    await resend.emails.send({
      from: `Balloon Sight <${process.env.REPORT_SENDER_EMAIL || 'reports@balloonsight.com'}>`,
      to: email,
      subject: "Your AI Visibility Report is Ready",
      html: "<p>Your report is attached.</p>",
      attachments: [{ filename: "report.pdf", content: pdf }]
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
