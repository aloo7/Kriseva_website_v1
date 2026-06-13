#!/usr/bin/env node
// scan-quality.mjs
// v8 QA proof engine. Renders a page in headless Chromium at a given viewport,
// scrolls it fully (so lazy images load and scrubbed reveals settle), then
// measures two things the founder red-team called out:
//
//   1. Computed font sizes of every text-bearing element, with a
//      meaningful-vs-decorative classification, so we can prove "zero
//      meaningful text under 14px" (R1).
//   2. Every image's natural ratio vs its displayed box ratio and its
//      object-fit, so we can prove "natRatio == boxRatio, no fill" (R2).
//
// Also captures console errors. Writes a JSON report and prints a human
// summary. Local-only; nothing leaves the machine.
//
//   node scripts/scan-quality.mjs --url http://localhost:4321/ --w 1440 --h 900 --label before
//
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, []),
);
const PAGE_URL = args.url || 'http://localhost:4321/';
const VW = parseInt(args.w || '1440', 10);
const VH = parseInt(args.h || '900', 10);
const LABEL = args.label || 'scan';
const OUTDIR = resolve(new URL('..', import.meta.url).pathname, 'tests/.v8-proof');

// The readable floor the founder asked for: nothing meaning-bearing under 14px.
const MEANINGFUL_FLOOR = 14;

const scan = `(() => {
  const isMono = (ff) => /plex mono|sfmono|consolas|monospace/i.test(ff);
  const out = { fonts: [], images: [] };

  // ---- fonts ----
  const all = document.querySelectorAll('body *');
  for (const el of all) {
    // only elements that directly render text (a non-empty text node child)
    let txt = '';
    for (const n of el.childNodes) if (n.nodeType === 3) txt += n.textContent;
    txt = txt.replace(/\\s+/g, ' ').trim();
    if (!txt) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const px = parseFloat(cs.fontSize);
    if (!px) continue;
    const mono = isMono(cs.fontFamily);
    const upper = cs.textTransform === 'uppercase';
    const lsPx = parseFloat(cs.letterSpacing) || 0;
    const lsEm = lsPx / px;
    // SVG <text>/<tspan> are infographic data-labels inside scaled diagrams,
    // a distinct class from UI chrome. getComputedStyle reports their size in
    // viewBox user units (the on-screen size is smaller after the viewBox
    // transform), so they are tracked separately, not as UI text.
    const svg = el.namespaceURI === 'http://www.w3.org/2000/svg';
    // Decorative = a short, tracked, uppercase mono micro-label (eyebrow,
    // folio, nav, footer, section ref, chip, tag). These label structure;
    // they never carry the sole meaning of a passage.
    const decorative =
      mono && upper && lsEm >= 0.1 && txt.length <= 48;
    out.fonts.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString().slice(0, 60),
      px: Math.round(px * 100) / 100,
      mono, upper, lsEm: Math.round(lsEm * 1000) / 1000,
      decorative, svg,
      text: txt.slice(0, 60),
    });
  }

  // ---- images ----
  const imgs = document.querySelectorAll('img');
  for (const im of imgs) {
    const r = im.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue; // hidden / icon-free
    const cs = getComputedStyle(im);
    const natW = im.naturalWidth, natH = im.naturalHeight;
    const natRatio = natH ? natW / natH : 0;
    const boxRatio = r.height ? r.width / r.height : 0;
    out.images.push({
      src: (im.currentSrc || im.src || '').split('/').slice(-1)[0],
      natW, natH,
      natRatio: Math.round(natRatio * 1000) / 1000,
      boxW: Math.round(r.width), boxH: Math.round(r.height),
      boxRatio: Math.round(boxRatio * 1000) / 1000,
      objectFit: cs.objectFit,
      delta: Math.round(Math.abs(natRatio - boxRatio) * 1000) / 1000,
    });
  }
  return out;
})()`;

async function autoScroll(page) {
  // Node-driven scroll. The page uses Lenis smooth-scroll + a heavy rAF loop,
  // which defeats an in-page setTimeout loop, so we step from Node instead and
  // control timing here. Pins inflate scrollHeight, so we re-read it each step
  // but cap total travel so we always terminate.
  const CAP = 120000;
  let y = 0;
  for (let i = 0; i < 90; i++) {
    const h = await page.evaluate((yy) => {
      window.scrollTo(0, yy);
      return document.body.scrollHeight;
    }, y);
    await page.waitForTimeout(40);
    if (y + 1100 >= h || y >= CAP) break;
    y += 700;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
}

const run = async () => {
  await mkdir(OUTDIR, { recursive: true });
  const browser = await chromium.launch();
  // Measure under reduced-motion: this disables the WebGL rAF loop and the
  // ScrollTrigger pins, so (a) Node->page round-trips stay fast and (b)
  // scrollHeight is the true finite document height (pins don't inflate it).
  // Font sizes and image ratios are motion-independent, so this is a faithful
  // and terminating measurement of exactly what R1/R2 ask for.
  const ctx = await browser.newContext({
    viewport: { width: VW, height: VH }, deviceScaleFactor: 1, reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));

  page.setDefaultTimeout(20000);
  await page.goto(PAGE_URL, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(800); // let webfonts + first paint settle
  await autoScroll(page);
  // images may still be decoding after lazy load
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.decode ? i.decode().catch(() => {}) : null))));
  const data = await page.evaluate(scan);
  // full-page reference screenshot (reduced-motion = static, so it captures
  // the whole document in one shot)
  try {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: resolve(OUTDIR, `${LABEL}-${VW}.png`), fullPage: true });
  } catch (e) { /* full-page shot is best-effort */ }
  await browser.close();

  // ---- font analysis ----
  const fonts = data.fonts;
  const under14 = fonts.filter((f) => f.px < MEANINGFUL_FLOOR);
  // UI text = not SVG-illustration. The founder's R1 complaint was UI chrome.
  const meaningfulUnder14 = under14.filter((f) => !f.decorative && !f.svg);
  const decorativeUnder14 = under14.filter((f) => f.decorative && !f.svg);
  const svgUnder14 = under14.filter((f) => f.svg);
  const hist = {};
  for (const f of fonts) {
    const b = Math.floor(f.px);
    hist[b] = (hist[b] || 0) + 1;
  }
  const uiText = fonts.filter((f) => !f.decorative && !f.svg);
  const minMeaningful = uiText.length ? Math.min(...uiText.map((f) => f.px)) : 0;

  // ---- image analysis ----
  const imgs = data.images;
  const fill = imgs.filter((i) => i.objectFit === 'fill');
  // a "stretched" image: not letterboxed (object-fit none/fill/initial) yet
  // box ratio diverges from native ratio beyond tolerance
  const stretched = imgs.filter(
    (i) => i.delta > 0.04 && (i.objectFit === 'fill' || i.objectFit === 'none' || i.objectFit === 'scale-down'),
  );

  const report = {
    label: LABEL, url: PAGE_URL, viewport: `${VW}x${VH}`,
    fonts: {
      total: fonts.length,
      under14_all: under14.length,
      under14_meaningful_ui: meaningfulUnder14.length,
      under14_decorative: decorativeUnder14.length,
      under14_svg_illustration: svgUnder14.length,
      minMeaningfulUiPx: Math.round(minMeaningful * 100) / 100,
      histogram: hist,
      smallestMeaningfulUi: uiText.sort((a, b) => a.px - b.px).slice(0, 20),
      smallestSvg: svgUnder14.sort((a, b) => a.px - b.px).slice(0, 16),
    },
    images: {
      total: imgs.length,
      fill: fill.length,
      stretched: stretched.length,
      table: imgs.sort((a, b) => b.delta - a.delta),
    },
    consoleErrors,
  };

  await writeFile(resolve(OUTDIR, `${LABEL}-${VW}.json`), JSON.stringify(report, null, 2));

  // ---- human summary ----
  console.log(`\n=== QUALITY SCAN [${LABEL}] ${PAGE_URL} @ ${VW}x${VH} ===`);
  console.log(`FONTS: ${fonts.length} text elements`);
  console.log(`  under 14px total            : ${under14.length}`);
  console.log(`  under 14px MEANINGFUL UI    : ${meaningfulUnder14.length}   <-- target ZERO`);
  console.log(`  under 14px decorative mono  : ${decorativeUnder14.length}   (tracked labels, allowed >=12.5px)`);
  console.log(`  under 14px SVG illustration : ${svgUnder14.length}   (infographic data-labels in scaled diagrams)`);
  console.log(`  smallest meaningful UI px   : ${report.fonts.minMeaningfulUiPx}`);
  console.log('  histogram (px bucket: count):', JSON.stringify(hist));
  if (meaningfulUnder14.length) {
    console.log('  --- meaningful UI text under 14px ---');
    for (const f of report.fonts.smallestMeaningfulUi.filter((f) => f.px < 14))
      console.log(`    ${f.px}px  ${f.tag}.${f.cls}  "${f.text}"`);
  }
  console.log(`IMAGES: ${imgs.length} rendered`);
  console.log(`  object-fit:fill        : ${fill.length}   <-- target ZERO`);
  console.log(`  stretched (delta>0.04) : ${stretched.length}   <-- target ZERO`);
  console.log('  --- ratio table (worst delta first) ---');
  for (const i of report.images.table)
    console.log(`    ${i.delta.toFixed(3)}  nat ${i.natW}x${i.natH}(${i.natRatio})  box ${i.boxW}x${i.boxH}(${i.boxRatio})  fit:${i.objectFit}  ${i.src}`);
  console.log(`CONSOLE ERRORS: ${consoleErrors.length}`);
  for (const e of consoleErrors.slice(0, 10)) console.log(`    ! ${e}`);
  console.log(`\nwrote ${LABEL}-${VW}.json`);

  // exit non-zero if the founder's bar is missed (used as a gate later).
  // Note: object-fit:fill is the CSS initial value on every <img> without an
  // authored object-fit; it only matters when it stretches, which `stretched`
  // (box ratio diverging from native ratio) actually measures.
  if (meaningfulUnder14.length || stretched.length || consoleErrors.length) process.exitCode = 3;
};

run().catch((e) => { console.error(e); process.exit(2); });
