export async function generatePdf(html: string): Promise<Buffer> {
  // Dynamic import to avoid build-time resolution issues
  const puppeteer = await import("puppeteer-core");
  let browser;

  // Check if running in a serverless environment (Vercel)
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // Dynamic import for Vercel - only load when needed
    const chromium = await import("@sparticuz/chromium");
    
    // Configure sparticuz/chromium for Vercel
    chromium.default.setGraphicsMode = false;
    
    browser = await puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: chromium.default.defaultViewport,
      executablePath: await chromium.default.executablePath(),
      headless: chromium.default.headless,
    });
  } else {
    // Local development fallback
    // This requires Google Chrome to be installed on the local machine at standard paths
    const platform = process.platform;
    let executablePath = "";
    
    if (platform === "darwin") {
        executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    } else if (platform === "win32") {
        executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    } else {
        executablePath = "/usr/bin/google-chrome";
    }

    try {
        browser = await puppeteer.default.launch({
            executablePath,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    } catch (e) {
        console.error("Failed to launch local Chrome. Please ensure Google Chrome is installed.", e);
        throw new Error("Local Chrome launch failed.");
    }
  }

  try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
      });

      await browser.close();
      return Buffer.from(pdf);
  } catch (error) {
      if (browser) await browser.close();
      throw error;
  }
}
