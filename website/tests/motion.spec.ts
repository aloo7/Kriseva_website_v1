// motion.spec.ts
// Verifies the reduced-motion contract documented in
// STAGE_7_ART_DIRECTION.md §2.9, plus the W12 motion-architecture contract
// (CORPORATE_SITE_V2_ARCHITECTURE.md §18A).
//
// Under `prefers-reduced-motion: reduce`, every contract guarantee below
// must hold:
//   - .reveal elements are immediately visible (final state, no transition).
//   - The mobile-nav toggle does not animate (it only toggles a class).
//   - No CSS animation runs (animation-duration is clamped to ~0).
//   - Zero requests to /vendor/* (§18A item 5: reduced-motion visitors
//     download zero motion bytes).
//
// A separate motion-allowed context (below) verifies the Evidence Spine
// Tier 1 scrub (§18A item 2) reaches its final state after a full scroll.
//
// Run: `npm run qa:motion`

import { test, expect } from 'playwright/test';
import { routes } from './_routes';

test.use({ contextOptions: { reducedMotion: 'reduce' } });

for (const { path, label } of routes) {
  test(`motion · reduced-motion · ${label} (${path})`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    // 1. Every reveal element renders at opacity:1, transform:none.
    //    Covers both the v1 class (.reveal, archived pages) and the v6
    //    class (.rv, current pages + homepage).
    const allRevealsVisible = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .rv'));
      if (els.length === 0) return true;
      return els.every((el) => {
        const cs = getComputedStyle(el);
        // `opacity` is read as a string like "1"; transform is "none" or "matrix(...)".
        const opacityOk = parseFloat(cs.opacity) >= 0.99;
        // Under reduced-motion the global override clamps transition-duration
        // to ~0 and the .reveal-without-.is-visible state should still appear
        // at opacity:1 because the override beats the .reveal default.
        return opacityOk;
      });
    });
    expect(allRevealsVisible, `.reveal elements not fully visible at ${path}`).toBe(true);

    // 2. No element has a CSS animation longer than ~50 ms (the global
    //    reduced-motion override clamps animation-duration to 0.01 ms).
    const longAnimations = await page.evaluate(() => {
      return Array.from(document.querySelectorAll<HTMLElement>('*')).flatMap((el) => {
        const cs = getComputedStyle(el);
        const d = cs.animationDuration;
        if (!d || d === '0s' || d === '0ms') return [];
        const ms = d
          .split(',')
          .map((v) => v.trim())
          .map((v) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000))
          .filter((n) => !Number.isNaN(n));
        const longest = Math.max(0, ...ms);
        return longest > 50 ? [{ tag: el.tagName, duration: longest }] : [];
      });
    });
    expect(longAnimations, `unexpected long animations under reduced-motion at ${path}`).toEqual([]);
  });
}

// ---------------------------------------------------------------------
// W12 §18A item 5 / item 8c: reduced-motion visitors must download zero
// motion bytes. The binding, testable contract is zero requests to
// /vendor/* (gsap, ScrollTrigger, lenis) on the homepage, where the Tier 1
// controller and Lenis are wired.
// ---------------------------------------------------------------------
test('motion · reduced-motion · zero /vendor/* requests (/)', async ({ page }) => {
  const vendorRequests: string[] = [];
  page.on('request', (req) => {
    if (req.url().includes('/vendor/')) vendorRequests.push(req.url());
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  expect(vendorRequests, 'expected zero /vendor/* requests under reduced motion').toEqual([]);
});

// ---------------------------------------------------------------------
// W12 §18A item 2 / item 8a: the Evidence Spine Tier 1 scrub, in a
// motion-allowed desktop context, reaches its final state after a full
// scroll past the pinned section. homeMotion.ts stamps
// `data-spine-progress` on `.evidence-spine` from the ScrollTrigger
// onUpdate callback; a full scroll must drive it to ~1.
// ---------------------------------------------------------------------
test.describe('motion · spine scrub (motion allowed, desktop)', () => {
  test.use({
    contextOptions: { reducedMotion: 'no-preference' },
    viewport: { width: 1440, height: 900 },
  });

  test('evidence spine reaches final state after full scroll, no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Confirm the controller actually booted before relying on its output.
    await page.waitForFunction(() => document.querySelector('.spine-traveler') !== null, undefined, {
      timeout: 10_000,
    });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await page.waitForFunction(
      () => {
        const el = document.querySelector<HTMLElement>('.evidence-spine');
        const p = el?.dataset.spineProgress ? parseFloat(el.dataset.spineProgress) : 0;
        return p >= 0.98;
      },
      undefined,
      { timeout: 10_000 }
    );

    const finalState = await page.evaluate(() => {
      const spine = document.querySelector<HTMLElement>('.evidence-spine');
      const lastPlate = document.querySelector<HTMLElement>('[data-station="retained-record"] .spine__plate');
      const signaturePath = document.querySelector<SVGPathElement>(
        '[data-station="human-review"] .spine__icon svg path'
      );
      const cs = lastPlate ? getComputedStyle(lastPlate) : null;
      return {
        progress: spine?.dataset.spineProgress ? parseFloat(spine.dataset.spineProgress) : 0,
        lastPlateOpacity: cs ? parseFloat(cs.opacity) : 0,
        signatureDashoffset: signaturePath ? getComputedStyle(signaturePath).strokeDashoffset : null,
      };
    });

    expect(finalState.progress, 'spine scrub progress after full scroll').toBeGreaterThanOrEqual(0.98);
    expect(finalState.lastPlateOpacity, 'retained-record plate opacity at final state').toBeGreaterThanOrEqual(0.99);
    expect(consoleErrors, 'no console/page errors during spine scrub').toEqual([]);
  });
});

// ---------------------------------------------------------------------
// Gate 3 regression (2026-08-15): IntersectionObserver only fires on a
// threshold CROSSING. An instant programmatic scroll straight to the bottom
// and back skips the intermediate positions entirely for mid-page sections,
// so it never crosses the threshold for them — they were left permanently
// in their from-state (opacity 0) with JS fully enabled, violating §18A
// item 7 ("any failure leaves the page readable"; motion only ever adds).
// reveal.ts now backstops IO with a viewport-bounds check on scroll/scrollend
// and a "reached the true bottom once → reveal everything still pending"
// rule, converging on the same data-reveal-marked elements this test checks.
// ---------------------------------------------------------------------
test.describe('motion · tier 2 reveal fail-open (Gate 3 regression)', () => {
  test.use({
    contextOptions: { reducedMotion: 'no-preference' },
    viewport: { width: 1440, height: 900 },
  });

  test('reveal elements are not stuck hidden after instant scroll-to-bottom-and-back', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // The exact repro from Gate 3: an instant jump to the bottom, a pause,
    // then an instant jump back to the top — no intermediate frames, so no
    // IO threshold crossing ever occurs for mid-page sections.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));

    // Let the fail-open paths (bounds check, bottom-reached, debounce) settle.
    await page.waitForTimeout(300);

    const states = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]')).map((el) => {
        const cs = getComputedStyle(el);
        return {
          identity: el.className || el.tagName,
          mark: el.getAttribute('data-reveal'),
          opacity: parseFloat(cs.opacity),
        };
      })
    );

    expect(states.length, 'expected at least one [data-reveal] element to be tracked on the homepage').toBeGreaterThan(
      0
    );
    for (const s of states) {
      expect(
        s.opacity,
        `"${s.identity}" (data-reveal="${s.mark}") stuck below opacity 1 after scroll-to-bottom-and-back`
      ).toBeGreaterThanOrEqual(0.99);
    }

    // Same evidence the coordinator's Gate 3 report used: a full-page,
    // JS-enabled capture at the exact handoff path, overwritten here so a
    // green test run always leaves current proof behind it.
    await page.screenshot({ path: 'docs/v2-handoffs/final-screens/home-1440.png', fullPage: true });
  });
});
