// responsive.spec.ts
// Verifies every route at the four canonical breakpoints documented in
// STAGE_7_ART_DIRECTION.md §2.4. Two checks per (route × viewport):
//   1. No horizontal overflow (`document.documentElement.scrollWidth` must
//      equal the viewport width within a 1 px tolerance).
//   2. Full-page screenshot snapshot for visual regression.
//
// Run: `npm run qa:responsive`

import { test, expect } from 'playwright/test';
import { routes, responsiveViewports } from './_routes';

for (const vp of responsiveViewports) {
  for (const { path, label } of routes) {
    test(`responsive · ${vp.label} · ${label} (${path})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // 1. No horizontal overflow.
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `horizontal overflow at ${vp.label} on ${path}`).toBeLessThanOrEqual(
        clientWidth + 1,
      );

      // 2. Force scroll-reveal elements visible for deterministic screenshots.
      await page.evaluate(() => {
        document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      });

      // 3. Visual snapshot.
      await expect(page).toHaveScreenshot(`${vp.label}__${label}.png`, {
        fullPage: true,
      });
    });
  }
}
