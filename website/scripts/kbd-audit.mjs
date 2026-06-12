// Keyboard audit: tab reach, activation, aria-live wiring on the
// interactive modules. WCAG 2.1.1 / 2.4.7 / 4.1.2 evidence.
import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function tabTo(sel, max = 120) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    const hit = await page.evaluate((s) => document.activeElement && document.activeElement.matches(s), sel);
    if (hit) return true;
  }
  return false;
}
const out = [];

await page.goto('http://localhost:4321/tas/', { waitUntil: 'networkidle' });
let ok = await tabTo('.pstep');
await page.keyboard.press('Enter');
const pipeDetail = await page.evaluate(() => document.getElementById('pipeDetail').textContent.length > 10);
out.push(`tas pipeline: tab-reach=${ok} enter-updates-detail=${pipeDetail}`);

await page.goto('http://localhost:4321/evaluator/', { waitUntil: 'networkidle' });
ok = await tabTo('#verifyBtn');
await page.keyboard.press('Enter');
await page.waitForTimeout(2200);
const chainStatus = await page.evaluate(() => document.getElementById('chainStatus').textContent);
const live = await page.evaluate(() => document.getElementById('chainStatus').getAttribute('aria-live'));
out.push(`evaluator chain: tab-reach=${ok} verify-status="${chainStatus.slice(0, 32)}..." aria-live=${live}`);

await page.goto('http://localhost:4321/security/', { waitUntil: 'networkidle' });
ok = await tabTo('.asset');
await page.keyboard.press('Enter');
const bdetail = await page.evaluate(() => ({
  text: document.getElementById('bdetail').textContent.length > 40,
  live: document.getElementById('bdetail').getAttribute('aria-live'),
  pressed: document.activeElement.getAttribute('aria-pressed'),
}));
out.push(`security boundary: tab-reach=${ok} enter-selects=${bdetail.pressed} detail-updates=${bdetail.text} aria-live=${bdetail.live}`);

await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
ok = await tabTo('.mcell');
await page.keyboard.press('Enter');
const mxd = await page.evaluate(() => document.getElementById('mxd').textContent.includes('·'));
out.push(`home matrix: tab-reach=${ok} enter-updates-detail=${mxd}`);

const ring = await page.evaluate(() => {
  const el = document.activeElement;
  const cs = getComputedStyle(el);
  return cs.outlineStyle !== 'none' || parseInt(cs.outlineWidth) > 0;
});
out.push(`focus-visible outline on active element: ${ring}`);

await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:4321/tas/', { waitUntil: 'networkidle' });
ok = await tabTo('#menuBtn', 30);
await page.keyboard.press('Enter');
const menu = await page.evaluate(() => ({
  open: document.getElementById('mobilePanel').classList.contains('open'),
  expanded: document.getElementById('menuBtn').getAttribute('aria-expanded'),
}));
out.push(`mobile menu: tab-reach=${ok} opens=${menu.open} aria-expanded=${menu.expanded}`);

console.log(out.join('\n'));
await browser.close();
