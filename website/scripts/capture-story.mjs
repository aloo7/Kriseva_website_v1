#!/usr/bin/env node
// capture-story.mjs
// Drives the homepage with REAL motion (WebGL + ScrollTrigger live), records a
// scroll-through video, screenshots each act, asserts the act-1 counter, and
// captures console errors. This is the "look at it yourself" evidence for the
// animation work (R3/FIX C) — it verifies the animations actually run, not just
// that the code exists.
//
//   node scripts/capture-story.mjs --url http://localhost:4321/ --w 1440 --h 900
//
import { chromium } from 'playwright';
import { mkdir, writeFile, readdir, rename } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, x, i, arr) => { if (x.startsWith('--')) a.push([x.slice(2), arr[i + 1]]); return a; }, []),
);
const PAGE_URL = args.url || 'http://localhost:4321/';
const VW = parseInt(args.w || '1440', 10);
const VH = parseInt(args.h || '900', 10);
const OUT = resolve(new URL('..', import.meta.url).pathname, 'tests/.v8-proof/story');
const VIDDIR = resolve(OUT, `vid-${VW}`);

// section anchors → act labels for per-act stills
const ACTS = [
  ['#top', 'act0-hero'],
  ['#clock', 'act1-clock'],
  ['#rooms', 'act2-rooms'],
  ['#turn', 'act3-turn'],
  ['#platform', 'act3-platform'],
  ['#console', 'act4-console'],
  ['#bidability', 'act4-bidability'],
  ['#evidence', 'act5-matrix'],
  ['#audit', 'act5-audit'],
  ['#sovereignty', 'act6-boundary'],
];

const run = async () => {
  await mkdir(VIDDIR, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: VW, height: VH }, deviceScaleFactor: 1,
    recordVideo: { dir: VIDDIR, size: { width: VW, height: VH } },
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await page.goto(PAGE_URL, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(1500); // hero first paint + webfonts

  // smooth wheel-scroll top -> bottom so Lenis + ScrollTrigger run naturally
  const yearSamples = [];
  let bottom = false;
  for (let i = 0; i < 90 && !bottom; i++) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(180);
    // sample the act-1 counter whenever the clock is on screen
    try {
      const s = await page.evaluate(() => {
        const box = document.getElementById('yearBox');
        const n = document.getElementById('yearN');
        if (!box) return null;
        const r = box.getBoundingClientRect();
        if (r.top > window.innerHeight || r.bottom < 0) return null;
        return { aged: box.classList.contains('aged'), n: n ? n.textContent : '', text: box.innerText.replace(/\s+/g, ' ').trim() };
      });
      if (s) yearSamples.push(s);
    } catch (e) {}
    bottom = await page.evaluate(() => window.scrollY + window.innerHeight >= document.body.scrollHeight - 6);
  }
  await page.waitForTimeout(600);

  // per-act stills: jump to each anchor, let the scrub settle, screenshot
  await mkdir(OUT, { recursive: true });
  for (const [sel, label] of ACTS) {
    try {
      await page.evaluate((s) => { const el = document.querySelector(s); if (el) el.scrollIntoView({ block: 'start' }); }, sel);
      await page.waitForTimeout(900);
      await page.screenshot({ path: resolve(OUT, `${VW}-${label}.png`) });
    } catch (e) {}
  }

  await ctx.close(); // finalizes the video file
  await browser.close();

  // rename the (hashed) video file to a stable name
  let videoName = '';
  try {
    const files = (await readdir(VIDDIR)).filter((f) => f.endsWith('.webm'));
    if (files[0]) { videoName = `story-${VW}.webm`; await rename(resolve(VIDDIR, files[0]), resolve(OUT, videoName)); }
  } catch (e) {}

  // assess the year counter
  const sawNumber = yearSamples.some((s) => /^[1-7]$/.test(s.n) && !s.aged);
  const sawAged = yearSamples.some((s) => s.aged && /years later/i.test(s.text));
  const sawPlaceholder = yearSamples.some((s) => /YEAR\s*N\b/i.test(s.text) || s.n === 'N');

  const report = {
    url: PAGE_URL, viewport: `${VW}x${VH}`,
    consoleErrors: errors,
    yearCounter: {
      samples: yearSamples.length,
      countedUpAsNumber: sawNumber,
      agedToYearsLater: sawAged,
      showedLiteralPlaceholder: sawPlaceholder,
      distinctValues: [...new Set(yearSamples.map((s) => (s.aged ? 'years-later' : s.n)))],
    },
    video: videoName, acts: ACTS.map((a) => `${VW}-${a[1]}.png`),
  };
  await writeFile(resolve(OUT, `story-${VW}.json`), JSON.stringify(report, null, 2));

  console.log(`\n=== STORY CAPTURE @ ${VW}x${VH} ===`);
  console.log(`console errors        : ${errors.length}`);
  errors.slice(0, 8).forEach((e) => console.log('   ! ' + e));
  console.log(`year counter samples  : ${yearSamples.length}`);
  console.log(`  counted up as number: ${sawNumber}`);
  console.log(`  aged to "years later": ${sawAged}`);
  console.log(`  literal "YEAR N"     : ${sawPlaceholder}   <-- must be false`);
  console.log(`  distinct values seen : ${report.yearCounter.distinctValues.join(', ')}`);
  console.log(`video                 : ${videoName || '(none)'}`);
  console.log(`act stills            : ${report.acts.length}`);
  if (errors.length || sawPlaceholder) process.exitCode = 3;
};

run().catch((e) => { console.error(e); process.exit(2); });
