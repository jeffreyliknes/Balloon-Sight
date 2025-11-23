import puppeteer from "puppeteer";

export async function generatePdf(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true, // "new" is deprecated/default now
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Vital for some environments
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" }
  });

  await browser.close();
  return Buffer.from(pdf);
}

