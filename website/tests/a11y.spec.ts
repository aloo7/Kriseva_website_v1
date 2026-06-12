// a11y.spec.ts
// axe-core accessibility audit per route. Fails the build on any
// `serious` or `critical` violation.
//
// Run: `npm run qa:a11y`
//
// Notes:
// - We exclude rules that fire on Astro's hashed `data-astro-cid-*` attrs (none
//   today, but kept as a placeholder).
// - We do NOT exclude colour-contrast rules — those are load-bearing for the
//   institutional palette claim.

import { test, expect } from 'playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { routes } from './_routes';

const SEVERITIES = ['serious', 'critical'] as const;

for (const { path, label } of routes) {
  test(`a11y · ${label} (${path})`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    // Let the entrance choreography settle: contrast is judged at the
    // page's steady state, not mid-fade (axe blends partial opacity into
    // the text colour and false-fails an element it caught animating).
    await page.waitForTimeout(2400);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const blocking = results.violations.filter((v) =>
      SEVERITIES.includes(v.impact as (typeof SEVERITIES)[number]),
    );

    if (blocking.length) {
      const summary = blocking
        .map(
          (v) =>
            `  ${v.impact?.toUpperCase()} · ${v.id} · ${v.help}\n    nodes: ${v.nodes.length}`,
        )
        .join('\n');
      throw new Error(
        `axe found ${blocking.length} blocking violation(s) on ${path}:\n${summary}`,
      );
    }

    // Soft signal: log moderate/minor counts without failing.
    const advisory = results.violations.filter((v) => !SEVERITIES.includes(v.impact as (typeof SEVERITIES)[number]));
    if (advisory.length) {
      console.log(`  ⚠ ${path} — ${advisory.length} non-blocking axe note(s) (review in test output).`);
    }

    expect(blocking).toEqual([]);
  });
}
