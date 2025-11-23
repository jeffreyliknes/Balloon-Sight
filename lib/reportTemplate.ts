export function generateFullReport(domain: string, results: any = {}) {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const brandColor = process.env.BRAND_COLOR_PRIMARY || "#551121";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.6; }
    h1 { color: ${brandColor}; font-size: 32px; margin-bottom: 10px; }
    h2 { color: ${brandColor}; font-size: 24px; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 40px; }
    h3 { color: #444; font-size: 18px; margin-top: 20px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 60px; border-bottom: 4px solid ${brandColor}; padding-bottom: 20px; }
    .domain { font-size: 18px; font-weight: bold; color: #666; }
    .section { margin-bottom: 30px; }
    ul { list-style: none; padding: 0; }
    li { padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; color: white; }
    .badge-pass { background: #2B6B6E; }
    .badge-fail { background: #E86A5A; }
    footer { margin-top: 80px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
        <h1>AI Visibility Report</h1>
        <div class="domain">${domain}</div>
    </div>
    <div style="text-align: right;">
        <div style="font-size: 14px; color: #999;">${date}</div>
    </div>
  </div>

  <div class="section">
    <h2>Overview</h2>
    <p>This report analyzes how well <strong>${domain}</strong> can be read and interpreted by AI systems, search engines, and LLMs (Large Language Models). High visibility ensures your content is cited and recommended by AI agents.</p>
  </div>

  <div class="section">
    <h2>Key Findings</h2>
    <ul>
      <li>
        <strong>Persona Clarity:</strong> ${results.persona?.archetype || 'Pending'} 
        <br><span style="font-size: 14px; color: #666;">${results.persona?.description || ''}</span>
      </li>
      <li>
        <strong>Schema Detected:</strong> ${results.rawJsonLd?.length > 0 ? 'Yes' : 'No'}
      </li>
      <li>
        <strong>Accessibility Score:</strong> ${results.categories?.accessibility?.score || 0}/100
      </li>
    </ul>
  </div>

  <div class="section">
    <h2>Prioritized Fixes</h2>
    <ul>
      ${results.categories ? Object.values(results.categories).flatMap((c: any) => c.checks).filter((c: any) => c.status === 'fail').map((check: any) => `
        <li>
            <span class="badge badge-fail">FAIL</span> <strong>${check.label}</strong>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #555;">${check.message}</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #777; font-style: italic;">Fix: ${check.fix}</p>
        </li>
      `).join('') : '<li>No critical errors found.</li>'}
    </ul>
  </div>

  <footer>
    © ${new Date().getFullYear()} BalloonSight — balloonsight.com
  </footer>
</body>
</html>
  `;
}

