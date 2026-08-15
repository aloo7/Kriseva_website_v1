// qa-static.spec.ts
//
// W12 deliverable (CORPORATE_SITE_V2_ARCHITECTURE.md §18A item 8b):
// deterministic static-visibility gate. With JavaScript fully disabled,
// every <section> root and the <main> landmark on every route must compute
// opacity:1 and visibility:visible.
//
// This is the enforcement mechanism for the hard rule in §18A item 3: Tier 2
// from-states (and, by extension, the Evidence Spine Tier 1 choreography)
// are applied by JavaScript only, immediately before animating, and never
// baked into static CSS. A JS-disabled visitor — or a motion-script that
// fails outright — must see the exact same, fully visible page as everyone
// else. If a future change ever adds a static `opacity: 0` (or
// `visibility: hidden`) default for a reveal-style pattern, this test fails.
//
// Run: `npm run qa:static`

import { test, expect } from 'playwright/test';

// The 13 live routes (src/pages/*.astro; the archived v8 homepage at
// _index_v8_archive.astro is intentionally excluded). Not sourced from
// tests/_routes.ts: that file predates the v2 sitemap
// (CORPORATE_SITE_V2_ARCHITECTURE.md §4) and still lists retired v8 paths
// (/workflow, /validation) instead of the current route set. Reconciling
// _routes.ts is outside W12's touch-file scope (architecture §16); this
// list is the current, correct one independently.
const routes: { path: string; label: string }[] = [
  { path: '/', label: 'home' },
  { path: '/company', label: 'company' },
  { path: '/capabilities', label: 'capabilities' },
  { path: '/defense', label: 'defense' },
  { path: '/finance', label: 'finance' },
  { path: '/tas', label: 'tas' },
  { path: '/evaluator', label: 'evaluator' },
  { path: '/attest', label: 'attest' },
  { path: '/security', label: 'security' },
  { path: '/evidence', label: 'evidence' },
  { path: '/founder', label: 'founder' },
  { path: '/contact', label: 'contact' },
  { path: '/404', label: '404' },
];

test.use({ javaScriptEnabled: false });

for (const { path, label } of routes) {
  test(`qa:static · JS-disabled · ${label} (${path})`, async ({ page }) => {
    await page.goto(path);

    const main = page.locator('main');
    await expect(main, `main landmark missing at ${path}`).toHaveCount(1);
    const mainState = await main.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { opacity: parseFloat(cs.opacity), visibility: cs.visibility };
    });
    expect(mainState.opacity, `main opacity at ${path}`).toBeGreaterThanOrEqual(0.99);
    expect(mainState.visibility, `main visibility at ${path}`).toBe('visible');

    const sectionStates = await page.evaluate(() =>
      Array.from(document.querySelectorAll('section')).map((el) => {
        const cs = getComputedStyle(el);
        return {
          opacity: parseFloat(cs.opacity),
          visibility: cs.visibility,
          identity: el.id || el.className || el.tagName,
        };
      })
    );

    for (const state of sectionStates) {
      expect(state.opacity, `section "${state.identity}" opacity at ${path}`).toBeGreaterThanOrEqual(0.99);
      expect(state.visibility, `section "${state.identity}" visibility at ${path}`).toBe('visible');
    }
  });
}
