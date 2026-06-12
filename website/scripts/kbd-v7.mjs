import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
async function tabTo(sel, max = 140) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate((s) => document.activeElement && document.activeElement.matches(s), sel)) return true;
  }
  return false;
}
await page.goto('http://localhost:4321/evaluator/', { waitUntil: 'networkidle' });
let ok = await tabTo('#cviB');
await page.keyboard.press('Enter');
await page.waitForTimeout(800);
const why = await page.evaluate(() => document.getElementById('cviWhy').textContent.includes('Turnover'));
console.log(`cvi: tab-reach=${ok} enter-switches=${why} aria-live=${await page.evaluate(() => document.getElementById('cviWhy').getAttribute('aria-live'))}`);
await page.goto('http://localhost:4321/tas/', { waitUntil: 'networkidle' });
ok = await tabTo('.bna-row');
await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
await page.keyboard.press('Enter');
const det = await page.evaluate(() => ({ t: document.getElementById('bnaDetail').textContent.length > 40, live: document.getElementById('bnaDetail').getAttribute('aria-live') }));
console.log(`bna: tab-reach=${ok} enter-updates=${det.t} aria-live=${det.live}`);
await browser.close();
