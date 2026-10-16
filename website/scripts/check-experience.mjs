// Production route/reflow check. Run after build + preview on port 4322.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const baseURL = process.argv[2] || 'http://127.0.0.1:4322';
const output = process.argv[3] || 'output/playwright/reflow-results.json';
const routes = ['/', '/tas', '/evaluator', '/solutions', '/proof', '/security', '/plans', '/company', '/resources', '/contact', '/attest', '/404'];
const sizes = [
  ['phone-small', 320, 568], ['phone-360', 360, 760], ['phone-390', 390, 844], ['phone-430', 430, 932],
  ['phone-landscape', 844, 390], ['tablet-portrait', 768, 1024], ['tablet-landscape', 1024, 768],
  ['desktop-site-phone', 980, 430], ['laptop', 1280, 720], ['desktop', 1440, 900],
  ['wide', 1920, 1080], ['ultrawide', 2560, 1440], ['zoom-reflow-200', 640, 480], ['zoom-reflow-400', 320, 720],
];
const browser = await chromium.launch();
const results = [];
const links = new Set();
const brokenLinks = [];
try {
  await Promise.all([0, 1].map(async (worker) => {
    for (let index = worker; index < sizes.length; index += 2) {
      const [label, width, height] = sizes[index];
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', ...(label === 'desktop-site-phone' ? { isMobile: true, hasTouch: true } : {}) });
      const page = await context.newPage();
      let errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      for (const path of routes) {
        errors = [];
        const response = await page.goto(new URL(path, baseURL).href);
        await page.evaluate(() => document.fonts.ready);
        if (label === 'desktop') {
          const hrefs = await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.href));
          hrefs.forEach((href) => { if (new URL(href).origin === new URL(baseURL).origin) links.add(href); });
        }
        const dimensions = await page.evaluate(() => {
          const width = document.documentElement.clientWidth;
          const controls = [...document.querySelectorAll('main a, main button, main summary, main input, main textarea, main select')];
          const outOfBounds = controls.flatMap((el) => {
            if (el.id === 'cf-website' || !el.getClientRects().length || getComputedStyle(el).visibility === 'hidden') return [];
            const rect = el.getBoundingClientRect();
            if (!rect.width || !rect.height || (rect.left >= -1 && rect.right <= width + 1)) return [];
            return [{ tag: el.tagName, label: el.textContent?.trim().slice(0, 50) || el.id, left: rect.left, right: rect.right }];
          });
          return { width, scrollWidth: document.documentElement.scrollWidth, outOfBounds };
        });
        results.push({ viewport: label, width, height, path, status: response.status(), ...dimensions, errors: [...errors], passed: response.status() < 400 && dimensions.scrollWidth <= dimensions.width + 1 && !dimensions.outOfBounds.length && !errors.length });
      }
      await context.close();
    }
  }));
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const href of links) {
    const url = new URL(href);
    const response = await page.request.get(href);
    if (!response.ok()) { brokenLinks.push({ href, status: response.status() }); continue; }
    if (url.hash) {
      const html = await response.text();
      const exists = await page.evaluate(({ html, hash }) => !!new DOMParser().parseFromString(html, 'text/html').getElementById(decodeURIComponent(hash.slice(1))), { html, hash: url.hash });
      if (!exists) brokenLinks.push({ href, missingAnchor: url.hash });
    }
  }
  await context.close();
} finally { await browser.close(); }
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify({ baseURL, checkedAt: new Date().toISOString(), results, internalLinks: links.size, brokenLinks }, null, 2));
const failures = results.filter((result) => !result.passed);
console.log(`${results.length - failures.length}/${results.length} route and viewport combinations passed`);
if (failures.length) console.log(JSON.stringify(failures, null, 2));
console.log(`${links.size} internal links checked; ${brokenLinks.length} broken`);
if (brokenLinks.length) console.log(JSON.stringify(brokenLinks, null, 2));
process.exitCode = failures.length || brokenLinks.length ? 1 : 0;
