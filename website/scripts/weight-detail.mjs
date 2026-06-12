import { chromium } from 'playwright';
import { gzipSync } from 'node:zlib';
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const rows = [];
page.on('response', async (res) => {
  try {
    const b = await res.body();
    const ct = res.headers()['content-type'] || '';
    const compressible = /text|javascript|json|svg|css|html/.test(ct);
    const wire = compressible ? gzipSync(b).length : b.length;
    rows.push({ url: new URL(res.url()).pathname, raw: b.length, wire });
  } catch {}
});
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);
rows.sort((a, b) => b.wire - a.wire);
let total = 0;
for (const r of rows) { total += r.wire; }
for (const r of rows.slice(0, 12)) console.log(`${(r.wire/1024).toFixed(0).padStart(6)} KB wire  (${(r.raw/1024).toFixed(0)} KB raw)  ${r.url}`);
console.log(`TOTAL estimated transferred: ${(total/1024/1024).toFixed(2)} MB`);
await browser.close();
