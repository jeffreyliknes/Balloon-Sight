import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReport(email: string, pdf: Buffer) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return;
  }

  try {
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
