import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const routes = [['/', 'home'], ['/tas/', 'tas'], ['/evaluator/', 'evaluator'], ['/workflow/', 'workflow'], ['/security/', 'security'], ['/validation/', 'validation'], ['/founder/', 'founder'], ['/contact/', 'contact'], ['/definitely-not-a-page', '404']];
await mkdir('shots/pr-evidence', { recursive: true });
const browser = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, '1440'], [390, 844, '390']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const [route, label] of routes) {
    await page.goto('http://localhost:4321' + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      document.querySelectorAll('.rv').forEach((el) => { el.classList.add('in'); el.style.opacity = '1'; el.style.transform = 'none'; });
      document.querySelectorAll('.ln-in').forEach((el) => { el.style.transform = 'none'; });
    });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `shots/pr-evidence/${label}-${tag}.png`, fullPage: true });
  }
  await page.close();
}
await browser.close();
console.log('18 evidence captures done');
