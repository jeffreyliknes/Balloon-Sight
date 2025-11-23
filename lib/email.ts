import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReportEmail(to: string, domain: string, pdfBuffer: Buffer) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is missing");
    return;
  }

  try {
    await resend.emails.send({
      from: 'BalloonSight Reports <reports@balloonsight.com>',
      to: [to],
      subject: `Your AI Visibility Report for ${domain}`,
      html: `
        <h1>Your Report is Ready!</h1>
        <p>Thanks for using BalloonSight. Attached is your deep-dive analysis for <strong>${domain}</strong>.</p>
        <p>Cheers,<br>The BalloonSight Team</p>
      `,
      attachments: [
        {
          filename: `BalloonSight-Report-${domain}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

