import { chromium, devices } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

// Reproduce the visual evidence against a production preview. The wide-phone
// case is a controlled simulation, not a claim about a physical Chrome setting.
const out = '../docs/mobile-motion-evidence';
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const measurements = [];
for (const [name, options] of [
  ['phone', { ...devices['iPhone 13'], deviceScaleFactor: 1 }],
  ['narrow', { viewport: { width: 320, height: 568 }, screen: { width: 320, height: 568 }, isMobile: true, hasTouch: true }],
  ['landscape', { viewport: { width: 844, height: 390 }, screen: { width: 844, height: 390 }, isMobile: true, hasTouch: true }],
  ['desktop', { viewport: { width: 1440, height: 900 } }],
  ['phone-wide', { viewport: { width: 980, height: 2130 }, screen: { width: 393, height: 852 }, isMobile: true, hasTouch: true, deviceScaleFactor: 393 / 980 }],
]) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/');
  await page.locator('[data-film-ready]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  if (name === 'phone-wide') await page.waitForFunction(() => document.documentElement.hasAttribute('data-phone-layout'));
  await page.evaluate(() => window.scrollTo(0, 0));
  measurements.push({ name, ...await page.evaluate(() => ({
    width: innerWidth, height: innerHeight, screenWidth: screen.width,
    pageWidth: document.documentElement.scrollWidth,
    pageHeight: document.documentElement.scrollHeight,
    rootFont: getComputedStyle(document.documentElement).fontSize,
    comfort: document.documentElement.hasAttribute('data-phone-layout'),
  })) });
  // Chromium full-page screenshots temporarily resize a mismatched screen
  // context. Keep that controlled simulation at its declared viewport.
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: name !== 'phone-wide' });
  if (name === 'phone') {
    await page.goto('http://127.0.0.1:4322/bridge');
    await page.locator('[data-ready]').waitFor();
    await page.locator('[data-motion-toggle]').click();
    for (const view of ['suppliers', 'buyers']) {
    await page.locator(`[data-view="${view}"]`).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${out}/phone-${view}.png`, fullPage: true });
    }
  }
  await context.close();
}
await browser.close();
await writeFile(`${out}/measurements.json`, JSON.stringify(measurements, null, 2) + '\n');
console.log(JSON.stringify(measurements));
