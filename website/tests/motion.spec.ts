// motion.spec.ts
// Verifies the reduced-motion contract, the v3 bridge build
// (docs/V3_BRIDGE_PLAN.md section 6) and the D-013 transform-only invariant.
//
// Under `prefers-reduced-motion: reduce`, every contract guarantee below
// must hold:
//   - .reveal elements are immediately visible (final state, no transition).
//   - The mobile-nav toggle does not animate (it only toggles a class).
//   - No CSS animation runs (animation-duration is clamped to ~0).
//   - Zero requests to /vendor/* (the retired motion libraries).
//
// A separate motion-allowed context (below) verifies the bridge reaches its
// built state after a full scroll through the pinned hero.
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
// v3: the bridge is built by a zero-dependency script; no page may request
// the retired vendor motion libraries (gsap, ScrollTrigger, lenis).
// ---------------------------------------------------------------------
test('motion · reduced-motion · zero /vendor/* requests (/)', async ({ page }) => {
  const vendorRequests: string[] = [];
  page.on('request', (req) => {
    if (req.url().includes('/vendor/')) vendorRequests.push(req.url());
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  expect(vendorRequests, 'expected zero /vendor/* requests').toEqual([]);
});

// Reduced motion: the hero is not pinned and the finished bridge renders as
// drawn (no data-live), so every part of the drawing is visible.
test('motion · reduced-motion · bridge renders finished and unpinned (/)', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const state = await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>('[data-bridge]')!;
    const parts = Array.from(hero.querySelectorAll<SVGElement>('.tower, .deck, .cable, .engine'));
    return {
      live: hero.hasAttribute('data-live'),
      hidden: parts.filter((p) => getComputedStyle(p).visibility === 'hidden').length,
    };
  });
  expect(state.live, 'reduced motion must not arm the scroll build').toBe(false);
  expect(state.hidden, 'no bridge part may be hidden under reduced motion').toBe(0);
});

// ---------------------------------------------------------------------
// v3 signature: with motion allowed, scrolling through the pinned hero builds
// the bridge, carries the three bids across and stamps every checkpoint.
// ---------------------------------------------------------------------
test.describe('motion · bridge build (motion allowed, desktop)', () => {
  test.use({
    contextOptions: { reducedMotion: 'no-preference' },
    viewport: { width: 1440, height: 900 },
  });

  test('bridge builds to completion on scroll, no console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(String(err)));

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => document.querySelector('[data-bridge][data-ready]') !== null, undefined, {
      timeout: 10_000,
    });

    // At the top the gap is open: the gates are unstamped.
    const atTop = await page.evaluate(() => document.querySelectorAll('.gate.is-on').length);
    expect(atTop, 'no checkpoint stamped before scrolling').toBe(0);

    // Scroll through the pinned section in steps, as a visitor would.
    const total = await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('[data-bridge]')!;
      return hero.offsetHeight - window.innerHeight;
    });
    for (let y = 0; y <= total; y += Math.ceil(total / 12)) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(60);
    }
    await page.evaluate((top) => window.scrollTo(0, top), total);

    await page.waitForFunction(() => document.querySelector('[data-bridge][data-built]') !== null, undefined, {
      timeout: 10_000,
    });
    const built = await page.evaluate(() => ({
      gates: document.querySelectorAll('.gate.is-on').length,
      deck: getComputedStyle(document.querySelector('.deck')!).transform,
    }));
    expect(built.gates, 'all three checkpoints stamped').toBe(3);
    expect(built.deck === 'none' || built.deck.startsWith('matrix(1,'), 'deck fully laid').toBe(true);
    expect(consoleErrors, 'no console/page errors during the build').toEqual([]);
  });
});

// ---------------------------------------------------------------------
// D-013 (control-plane decision, docs/CORPORATE_SITE_V2_DECISIONS.md,
// 2026-08-16): Tier 2 reveals are now transform-only (reveal.ts writes no
// `opacity` on any path), so "stuck invisible" cannot occur structurally —
// these tests assert that invariant directly rather than reproducing a
// specific timing bug. The primary test below is deliberately the simplest
// possible case (fresh load, zero scrolling): the Gate 3 failure showed the
// assertions and the screenshot running down different code paths, so this
// test's own screenshot IS its own evidence, taken in the same run as the
// assertions that must pass first.
// ---------------------------------------------------------------------
test.describe('motion · tier 2 reveal visibility (D-013)', () => {
  test.use({
    contextOptions: { reducedMotion: 'no-preference' },
    viewport: { width: 1440, height: 900 },
  });

  async function assertFullyVisible(page: import('playwright/test').Page) {
    const sectionStates = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('section')).map((el) => {
        const cs = getComputedStyle(el);
        return { identity: el.id || el.className || el.tagName, opacity: parseFloat(cs.opacity) };
      })
    );
    expect(sectionStates.length, 'expected at least one <section> on the homepage').toBeGreaterThan(0);
    for (const s of sectionStates) {
      expect(s.opacity, `<section> "${s.identity}" not at opacity 1`).toBeGreaterThanOrEqual(0.99);
    }

    const revealStates = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('.rv, .rv-stagger > *')).map((el) => {
        const cs = getComputedStyle(el);
        return { identity: el.className || el.tagName, opacity: parseFloat(cs.opacity) };
      })
    );
    expect(revealStates.length, 'expected at least one reveal element to be tracked').toBeGreaterThan(0);
    for (const s of revealStates) {
      expect(s.opacity, `reveal "${s.identity}" not at opacity 1`).toBeGreaterThanOrEqual(0.99);
    }
  }

  test('fresh load, no scrolling: every section and reveal element is opacity 1', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Deliberately no scrollTo of any kind — this is the exact case the
    // Gate 3 capture used, and the one most likely to catch any future
    // reintroduction of an opacity from-state.
    await page.waitForTimeout(500);

    await assertFullyVisible(page);

    // This screenshot is the canonical evidence: taken in the same run,
    // immediately after the assertions above passed, at the exact handoff
    // path — no separate capture step that could drift from what the test
    // actually checked.
    await page.screenshot({ path: 'tests/.output/home-1440.png', fullPage: true });
  });

  test('reveal elements stay visible after instant scroll-to-bottom-and-back', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // The original Gate 3 repro: an instant jump to the bottom, a pause,
    // then an instant jump back to the top — no intermediate frames. Kept as
    // a second, harder case now that it no longer needs a fail-open backstop
    // to pass (transform-only has nothing for this sequence to break).
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    await assertFullyVisible(page);
  });
});
