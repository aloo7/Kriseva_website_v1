import { test, expect, chromium } from 'playwright/test';

test('unavailable WebGL leaves the complete interactive SVG', async ({ page }) => {
  await page.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type === 'webgl2') return null;
      return get.apply(this, [type, ...args] as never);
    } as typeof get;
  });
  await page.goto('/bridge');
  await expect(page.locator('[data-bridge]')).toHaveAttribute('data-ready', '');
  await expect(page.locator('[data-atmosphere] canvas')).toHaveCount(0);
  await expect(page.getByRole('img', { name: 'The Kriseva bridge' })).toBeVisible();
  await page.locator('[data-view="suppliers"]').click();
  await expect(page.locator('[data-view="suppliers"]')).toHaveAttribute('aria-pressed', 'true');
});

test('the real shader stays bounded, pauses and cannot restart after context loss', async ({ browserName, baseURL }) => {
  test.skip(browserName !== 'chromium', 'Software-GPU renderer integration runs once in Chromium; fallback is checked in every engine.');
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  try {
    await page.goto(baseURL + '/bridge');
    await expect(page.locator('[data-bridge]')).toHaveAttribute('data-atmosphere', 'ready', { timeout: 15_000 });
    const pixels = await page.locator('[data-atmosphere] canvas').evaluate((element: HTMLCanvasElement) => element.width * element.height);
    expect(pixels).toBeLessThanOrEqual(752_000);
    const frame = () => page.locator('.crossing__atmosphere').evaluate((host) => (host as HTMLElement & { paperShaderMount: { getCurrentFrame(): number } }).paperShaderMount.getCurrentFrame());
    await page.locator('[data-motion-toggle]').click();
    const stopped = await frame();
    await page.waitForTimeout(180);
    expect(await frame()).toBe(stopped);
    await page.locator('[data-motion-toggle]').click();
    await expect.poll(frame).toBeGreaterThan(stopped);
    await page.locator('[data-atmosphere] canvas').evaluate((element: HTMLCanvasElement) => element.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
    await expect(page.locator('[data-bridge]')).toHaveAttribute('data-atmosphere', 'fallback');
    await expect(page.locator('[data-atmosphere] canvas')).toHaveCount(0);
    await page.locator('[data-motion-toggle]').click();
    await page.locator('[data-motion-toggle]').click();
    await expect(page.locator('[data-atmosphere] canvas')).toHaveCount(0);
    expect(errors).toEqual([]);
  } finally { await browser.close(); }
});
