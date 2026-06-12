#!/usr/bin/env node
// shoot-page.mjs
// Phase-gate screenshot helper for the v6 buildout. Captures a page at a
// given viewport, at the top and at three scroll depths, into a dated dir.
//
// Usage:
//   node scripts/shoot-page.mjs <path> <width>x<height> <label> [outdir]
// Example:
//   node scripts/shoot-page.mjs / 1440x900 home-1440 shots/phase1

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const [, , route = '/', size = '1440x900', label = 'page', outdir = 'shots'] = process.argv;
const [width, height] = size.split('x').map(Number);
const BASE = process.env.SHOOT_BASE || 'http://localhost:4321';

await mkdir(outdir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2500); // fonts + reveal animations settle

const total = await page.evaluate(() => document.documentElement.scrollHeight);
const depths = [0, 0.25, 0.5, 0.75];
for (let i = 0; i < depths.length; i++) {
  const y = Math.round((total - height) * depths[i]);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(1800); // let scrub/reveal catch up
  await page.screenshot({ path: `${outdir}/${label}-d${i}-${Math.round(depths[i] * 100)}pct.png` });
}
// full page capture last (disables fixed elements stacking weirdness is acceptable)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1200);
await page.screenshot({ path: `${outdir}/${label}-full.png`, fullPage: true });
console.log(`captured ${label}: ${depths.length} depths + full @ ${width}x${height}, scrollHeight=${total}`);
await browser.close();
