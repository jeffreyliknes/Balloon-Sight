import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReport(email: string, pdf: Buffer) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return;
  }

  try {
    await resend.emails.send({
      from: `BalloonSight <${process.env.REPORT_SENDER_EMAIL || 'reports@balloonsight.com'}>`,
      to: email,
      subject: "Your AI Visibility Report is Ready",
      html: `
        <div style="font-family: sans-serif; color: #333;">
            <h1 style="color: #551121;">Your Report is Ready</h1>
            <p>Thank you for purchasing the BalloonSight Deep Dive.</p>
            <p>Please find your PDF report attached.</p>
            <p>Best,<br>The BalloonSight Team</p>
        </div>
      `,
      attachments: [{ filename: "BalloonSight-Report.pdf", content: pdf }]
    });
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

