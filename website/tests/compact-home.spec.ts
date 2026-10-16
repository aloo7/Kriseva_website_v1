import { test, expect } from 'playwright/test';

for (const viewport of [
  { width: 1440, height: 900, maxScreens: 1.7 },
  { width: 390, height: 844, maxScreens: 1.7 },
  { width: 320, height: 568, maxScreens: 2.5 },
]) {
  test(`compact home has a short first pass at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const dimensions = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      screen: innerHeight,
      pageWidth: document.documentElement.scrollWidth,
      screenWidth: innerWidth,
    }));
    expect(dimensions.height / dimensions.screen).toBeLessThanOrEqual(viewport.maxScreens);
    expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.screenWidth + 1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('From paperwork to proof.');
    await expect(page.locator('#pillars a[href="/tas"]')).toBeVisible();
    await expect(page.locator('#pillars a[href="/evaluator"]')).toBeVisible();
  });
}

test('the primary story is concise and every phase leads to a clear next step', async ({ page }) => {
  await page.goto('/');
  const phases = page.locator('[data-stage-button]');
  await expect(phases).toHaveCount(3);
  await expect(phases.nth(0)).toContainText('The gap');
  await expect(phases.nth(1)).toContainText('The bridge');
  await expect(phases.nth(2)).toContainText('Your next step');
  for (const phase of await phases.all()) {
    await phase.click();
    const words = await page.locator('[data-quick-copy]').evaluateAll((elements) => elements
      .filter((el) => el.getClientRects().length)
      .map((el) => el.textContent || '').join(' ').trim().split(/\s+/).length);
    expect(words).toBeLessThanOrEqual(100);
    await expect(page.locator('#pillars a[href="/tas"]')).toBeVisible();
    await expect(page.locator('#pillars a[href="/evaluator"]')).toBeVisible();
    await expect(page.locator('[data-bridge] a[href="/contact?intent=demo"]')).toBeVisible();
  }
  // Long-form answers have dedicated routes, without a second homepage essay.
  await expect(page.locator('main .span, main .exa, main .zoom, main .plans-teaser, main .faq')).toHaveCount(0);
  const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(structuredData.some((text) => JSON.parse(text)['@type'] === 'FAQPage')).toBe(false);
});

test('larger text reflows instead of being clipped to meet the height target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('#pillars a[href="/tas"]')).toBeVisible();
  await expect(page.locator('#pillars a[href="/evaluator"]')).toBeVisible();
});

test('without JavaScript the complete brief and product paths remain available', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL + '/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('#pillars a[href="/tas"]')).toBeVisible();
  await expect(page.locator('#pillars a[href="/evaluator"]')).toBeVisible();
  await expect(page.locator('[data-story="2"]')).toBeVisible();
  await expect(page.locator('footer')).toContainText('Proof');
  await context.close();
});
