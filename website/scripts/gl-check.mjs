import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
const state = await page.evaluate(() => ({
  fallback: document.documentElement.classList.contains('hero-fallback'),
  three: typeof window.THREE !== 'undefined',
  labelsLive: document.getElementById('heroLabels').classList.contains('live'),
  labelCount: document.getElementById('heroLabels').children.length,
  canvasW: document.getElementById('webgl').width,
}));
console.log(JSON.stringify(state), 'errors:', errors.length ? errors : 'none');
// scroll into the pinned hero to confirm scrub works
await page.mouse.wheel(0, 1200);
await page.waitForTimeout(1200);
await page.screenshot({ path: 'shots/phase3/gl-hero-scrubbed.png' });
await browser.close();
