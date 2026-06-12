// visual.spec.ts
// Full-page screenshot regression for every route at desktop width.
// Snapshots stay on disk under tests/__snapshots__.
//
// First run: `npx playwright test tests/visual.spec.ts --update-snapshots`
// Subsequent runs: `npm run qa:visual`

import { test, expect } from 'playwright/test';
import { routes, intentDeepLinks } from './_routes';

for (const { path, label } of routes) {
  test(`visual · ${label} (${path})`, async ({ page }) => {
    await page.goto(path);
    // Settle: wait for fonts + first paint.
    await page.waitForLoadState('networkidle');
    // Force scroll-reveal elements to their final state so the screenshot is
    // deterministic (v1 .reveal → .is-visible; v6 .rv → .in; homepage GSAP
    // reveals get inline final state).
    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      document.querySelectorAll('.rv').forEach((el) => {
        el.classList.add('in');
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
      document.querySelectorAll('.ln-in').forEach((el) => {
        (el as HTMLElement).style.transform = 'none';
      });
    });
    await expect(page).toHaveScreenshot(`${label}.png`, {
      fullPage: true,
    });
  });
}

// Bonus: contact page with intent deep-links — verifies the radio pre-select
// also renders correctly under visual regression.
for (const { path, label } of intentDeepLinks) {
  test(`visual · ${label} (${path})`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    });
    await expect(page).toHaveScreenshot(`${label}.png`, { fullPage: true });
  });
}
