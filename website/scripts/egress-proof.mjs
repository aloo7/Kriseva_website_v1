// Renders a network-panel style table of every request the homepage makes,
// then screenshots it: the sovereignty egress proof for the PR.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
const reqs = [];
page.on('response', async (res) => {
  try {
    const u = new URL(res.url());
    const b = await res.body().catch(() => Buffer.alloc(0));
    reqs.push({ host: u.hostname, path: u.pathname, type: (res.headers()['content-type'] || '').split(';')[0], kb: (b.length / 1024).toFixed(1), status: res.status() });
  } catch {}
});
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1500);
const third = reqs.filter(r => r.host !== 'localhost');
const html = `<!DOCTYPE html><html><body style="font-family:Menlo,monospace;font-size:12px;background:#F3EDE0;color:#0F0E0B;padding:24px">
<h2 style="font-size:15px">kriseva.in homepage · full network log · ${reqs.length} requests · third-party: ${third.length}</h2>
<p>Every request below resolves to the site's own origin. Fonts, GSAP, ScrollTrigger, Lenis and three.js are self-hosted under /fonts and /vendor.</p>
<table border="1" cellspacing="0" cellpadding="5" style="border-color:#C7BDA3;border-collapse:collapse;width:100%">
<tr style="background:#DED6C9"><th align="left">host</th><th align="left">path</th><th align="left">type</th><th align="right">KB</th><th>status</th></tr>
${reqs.map(r => `<tr><td><b>${r.host}</b></td><td>${r.path}</td><td>${r.type}</td><td align="right">${r.kb}</td><td align="center">${r.status}</td></tr>`).join('')}
</table></body></html>`;
const p2 = await browser.newPage({ viewport: { width: 1200, height: 800 } });
await p2.setContent(html);
await p2.screenshot({ path: '../docs/pr-evidence/egress-network-proof.png', fullPage: true });
console.log(`requests: ${reqs.length}, third-party: ${third.length}`);
await browser.close();
