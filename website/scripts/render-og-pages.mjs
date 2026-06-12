#!/usr/bin/env node
// render-og-pages.mjs (X8)
// Build-time per-page OG images, 1200x630, typeset on the brand tokens
// (paper / ink / brass, Instrument Serif + IBM Plex Mono) with the same
// self-hosted woff2 faces the site ships. Chromium (Playwright) renders;
// no third-party service, no network.
//
// Usage:  node scripts/render-og-pages.mjs
// Output: public/og/<slug>.png  (wired through V6Head ogImage)

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const FONTS = `file://${ROOT}/public/fonts`;
const OUT = resolve(ROOT, 'public/og');

const PAGES = [
  { slug: 'tas',        kicker: 'Vol. I · bidder-side · KRISEVA TAS',        title: 'The bundle becomes a brief\nthe team can sign.' },
  { slug: 'evaluator',  kicker: 'Vol. II · issuer-side · KRISEVA EVALUATOR', title: 'Six verdict states.\nNone of them silent.' },
  { slug: 'security',   kicker: 'The Boundary · sovereign-by-design',        title: 'Local-first.\nZero silent egress.' },
  { slug: 'workflow',   kicker: 'The workflow · evidence-linked',            title: 'From portal noise\nto a signed decision.' },
  { slug: 'validation', kicker: 'Validation · status-labelled',              title: 'What is on the record.' },
  { slug: 'founder',    kicker: 'The founder · direct',                      title: 'Founder-led.\nEvidence-first.' },
  { slug: 'contact',    kicker: 'Contact · no SDR funnel',                   title: 'Speak directly\nto the founder.' },
];

const html = (p) => `<!DOCTYPE html><html><head><style>
@font-face{font-family:'Instrument Serif';src:url('${FONTS}/instrument-serif-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:'Instrument Serif';font-style:italic;src:url('${FONTS}/instrument-serif-latin-400-italic.woff2') format('woff2')}
@font-face{font-family:'IBM Plex Mono';src:url('${FONTS}/ibm-plex-mono-latin-500-normal.woff2') format('woff2')}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#DED6C9;color:#0F0E0B;position:relative;
  font-family:'Instrument Serif',serif;overflow:hidden;padding:64px 72px}
.frame{position:absolute;inset:26px;border:1px solid #C7BDA3}
.frame::before,.frame::after{content:"";position:absolute;width:22px;height:22px}
.frame::before{top:-1px;left:-1px;border-top:2px solid #0F0E0B;border-left:2px solid #0F0E0B}
.frame::after{bottom:-1px;right:-1px;border-bottom:2px solid #0F0E0B;border-right:2px solid #0F0E0B}
.brand{display:flex;align-items:center;gap:14px;font-family:'IBM Plex Mono',monospace;
  font-size:24px;letter-spacing:.34em;font-weight:500}
.brand img{width:44px;height:44px;display:block}
.kick{margin-top:78px;font-family:'IBM Plex Mono',monospace;font-size:19px;letter-spacing:.24em;
  text-transform:uppercase;color:#8A5C16}
h1{margin-top:26px;font-weight:400;font-size:84px;line-height:1.04;letter-spacing:-0.02em;white-space:pre-line}
.foot{position:absolute;left:72px;right:72px;bottom:58px;display:flex;justify-content:space-between;
  border-top:1px solid #C7BDA3;padding-top:20px;font-family:'IBM Plex Mono',monospace;
  font-size:16px;letter-spacing:.2em;text-transform:uppercase;color:#4E4838}
</style></head><body>
<div class="frame"></div>
<div class="brand"><img src="${FONTS.replace('/fonts', '/assets/brand/kriseva-mark.svg')}" alt="">KRISEVA</div>
<div class="kick">${p.kicker}</div>
<h1>${p.title}</h1>
<div class="foot"><span>Deterministic · Auditable · Evidence-linked</span><span>www.kriseva.in</span></div>
</body></html>`;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const p of PAGES) {
  await page.setContent(html(p), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}/${p.slug}.png` });
  console.log(`og/${p.slug}.png`);
}
await browser.close();
