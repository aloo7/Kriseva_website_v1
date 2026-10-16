import { test, expect } from 'playwright/test';

test('mobile navigation contains focus and restores the page after resize', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.locator('[data-sheet-trigger]');
  await menu.click();
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  await expect(page.locator('[data-sheet] summary').first()).toBeFocused();
  await page.locator('[data-sheet] .sheet__cta a').last().focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('.hdr__brand')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('[data-sheet] .sheet__cta a').last()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(page.locator('main')).not.toHaveAttribute('inert', '');
  await menu.click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(page.locator('[data-sheet]')).toBeHidden();
  await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.locator('main')).not.toHaveAttribute('inert', '');
});

test('desktop menus close when keyboard focus leaves the header', async ({ page }) => {
  await page.goto('/tas');
  await page.locator('[data-mega-trigger]').first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-mega]').first()).toBeVisible();
  await page.locator('main a').first().focus();
  await expect(page.locator('[data-mega]').first()).toBeHidden();
});

test('keyboard focus keeps ghost-button text distinct from its fill', async ({ page }) => {
  await page.goto('/plans');
  const button = page.locator('main .btn--ghost').first();
  await page.keyboard.press('Tab');
  await button.focus();
  await expect.poll(() => button.evaluate((el) => {
    const luminance = (color: string) => {
      const channels = color.match(/\d+(?:\.\d+)?/g)!.slice(0, 3).map(Number).map((channel) => {
        const c = channel / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const text = luminance(getComputedStyle(el).color);
    const fill = luminance(getComputedStyle(el, '::before').backgroundColor);
    return (Math.max(text, fill) + 0.05) / (Math.min(text, fill) + 0.05);
  })).toBeGreaterThanOrEqual(4.5);
});

test('contact draft survives refresh and a failed send preserves the note', async ({ page }) => {
  await page.goto('/contact?intent=demo');
  await page.locator('#cf-name').fill('Test visitor');
  await page.locator('#cf-email').fill('visitor@example.test');
  await page.locator('#cf-message').fill('Synthetic test note for the demonstration.');
  await page.reload();
  await expect(page.locator('#cf-name')).toHaveValue('Test visitor');
  await expect(page.locator('#cf-message')).toHaveValue('Synthetic test note for the demonstration.');
  await page.route('**/api/lead', (route) => route.fulfill({ status: 503, body: '{}' }));
  await page.locator('[data-submit]').click();
  await expect(page.locator('[data-status]')).toContainText('Your message did not send');
  await expect(page.locator('#cf-message')).toHaveValue('Synthetic test note for the demonstration.');
  await expect(page.locator('[data-submit]')).toBeEnabled();
  await page.unroute('**/api/lead');
  await page.route('**/api/lead', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
  await page.locator('[data-submit]').click();
  await expect(page.locator('[data-status]')).toContainText('Thank you');
  expect(await page.evaluate(() => sessionStorage.getItem('kriseva-contact-draft'))).toBeNull();
});

test('all primary destinations remain reachable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/');
  const navigation = page.locator('.hdr__fallback');
  await expect(navigation).toBeVisible();
  await expect(navigation.locator('a[href="/tas"]')).toBeVisible();
  await expect(navigation.locator('a[href="/evaluator"]')).toBeVisible();
  await context.close();
});

test('a fresh plan quote replaces an older note and preserves contact details', async ({ page }) => {
  await page.goto('/contact?intent=other');
  await page.locator('#cf-name').fill('Test visitor');
  await page.locator('#cf-org').fill('Synthetic organisation');
  await page.locator('#cf-email').fill('visitor@example.test');
  await page.locator('#cf-message').fill('An older general enquiry saved in this tab.');
  await page.evaluate(() => sessionStorage.setItem('kriseva-quote', 'Side: Supplier: TAS\nModules: Tender intelligence'));
  await page.goto('/contact?intent=quote');
  await expect(page.locator('input[name="topic"][value="quote"]')).toBeChecked();
  await expect(page.locator('#cf-name')).toHaveValue('Test visitor');
  await expect(page.locator('#cf-org')).toHaveValue('Synthetic organisation');
  await expect(page.locator('#cf-email')).toHaveValue('visitor@example.test');
  await expect(page.locator('#cf-message')).toHaveValue(/Modules: Tender intelligence/);
  await expect(page.locator('#cf-message')).not.toHaveValue(/older general enquiry/);
  await expect(page.locator('[data-quote-note]')).toBeVisible();
  await page.locator('#cf-message').fill('Edited quote request for the current plan.');
  await page.reload();
  await expect(page.locator('#cf-message')).toHaveValue('Edited quote request for the current plan.');
  await page.evaluate(() => sessionStorage.setItem('kriseva-quote', 'Side: Buyer: Evaluator\nModules: Source-linked findings'));
  await page.goto('/contact?intent=quote');
  await expect(page.locator('#cf-message')).toHaveValue(/Modules: Source-linked findings/);
  await expect(page.locator('#cf-name')).toHaveValue('Test visitor');
});

test('header reflows when text is enlarged to 200 percent', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/contact');
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await expect(page.locator('[data-sheet-trigger]')).toBeVisible();
    const overflowing = await page.locator('.hdr__bar').evaluate((bar) =>
      Array.from(bar.querySelectorAll<HTMLElement>('a, button')).filter((el) => {
        const box = el.getBoundingClientRect();
        return box.width && (box.left < 0 || box.right > innerWidth);
      }).map((el) => el.className),
    );
    expect(overflowing).toEqual([]);
  }
});

test('enlarged-text navigation restores focus and closes when text size resets', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contact');
  const menu = page.locator('[data-sheet-trigger]');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await expect(menu).toBeVisible();
  await menu.click();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await menu.click();
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  await page.evaluate(() => { document.documentElement.style.fontSize = '100%'; });
  await expect(menu).toBeHidden();
  await expect(page.locator('[data-sheet]')).toBeHidden();
  await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.locator('main')).not.toHaveAttribute('inert', '');
  await expect(page.locator('.hdr__brand')).toBeFocused();
});
