import { test, expect, devices, type Browser, type BrowserContextOptions, type Page } from 'playwright/test';

const phoneScreen = { width: 393, height: 852 };

async function phonePage(browser: Browser, browserName: string, options: BrowserContextOptions = {}) {
  const descriptor = devices[browserName === 'webkit' ? 'iPhone 13' : 'Pixel 7'];
  const context = await browser.newContext({
    ...descriptor,
    // Firefox has no isMobile emulation. It still exercises the touch and
    // screen/layout mismatch checks without being called a mobile browser.
    ...(browserName === 'firefox' ? { isMobile: false } : {}),
    ...options,
  });
  const page = await context.newPage();
  return { context, page };
}

async function expectReadableBrief(page: Page, scaled = false) {
  const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width + 1);
  const overflowing = await page.locator('main a, main button, header a, header button, footer a').evaluateAll((elements) => elements.flatMap((element) => {
    const box = element.getBoundingClientRect();
    if (!box.width || !box.height || getComputedStyle(element).visibility === 'hidden') return [];
    return box.left >= -1 && box.right <= innerWidth + 1 ? [] : [element.textContent?.trim()];
  }));
  expect(overflowing, 'visible homepage actions stay inside the layout viewport').toEqual([]);
  const caption = page.locator('#film-summary');
  await expect(caption).toBeVisible();
  const font = await caption.evaluate((element, useScreenRatio) => {
    const ratio = useScreenRatio ? screen.width / innerWidth : 1;
    return parseFloat(getComputedStyle(element).fontSize) * ratio;
  }, scaled);
  expect(font, 'HTML story text remains readable at the physical screen scale').toBeGreaterThanOrEqual(15.8);
  for (const href of ['/tas', '/evaluator']) await expect(page.locator(`#pillars a[href="${href}"]`)).toBeVisible();
}

async function expectPhysicalTargets(page: Page) {
  const undersized = await page.locator('main button, main a, header button, footer a').evaluateAll((elements) => {
    const ratio = screen.width / innerWidth;
    return elements.flatMap((element) => {
      const box = element.getBoundingClientRect();
      if (!box.width || !box.height || getComputedStyle(element).visibility === 'hidden') return [];
      const width = box.width * ratio;
      const height = box.height * ratio;
      return width >= 43.8 && height >= 43.8 ? [] : [{ text: element.textContent?.trim(), width, height }];
    });
  });
  expect(undersized, 'controls have at least 44px targets after layout-to-screen scaling').toEqual([]);
  const overlappingFooterTargets = await page.locator('footer nav a').evaluateAll((links) => {
    const boxes = links.map((link) => link.getBoundingClientRect());
    return boxes.some((box, index) => boxes.slice(index + 1).some((other) =>
      Math.min(box.right, other.right) - Math.max(box.left, other.left) > 1
      && Math.min(box.bottom, other.bottom) - Math.max(box.top, other.top) > 1));
  });
  expect(overlappingFooterTargets, 'footer targets must not overlap when text is enlarged').toBe(false);
}

test('phone browser descriptors keep the ordinary mobile viewport', async ({ browser, browserName, baseURL }) => {
  test.skip(browserName === 'firefox', 'Firefox does not support mobile browser emulation');
  const { context, page } = await phonePage(browser, browserName);
  try {
    await page.goto(baseURL + '/');
    await expect(page.locator('html')).not.toHaveAttribute('data-phone-layout', '');
    await expectReadableBrief(page);
    await expect(page.locator('[data-sheet-trigger]')).toBeVisible();
  } finally { await context.close(); }
});

test('normal landscape phones are not mistaken for a wide layout mismatch', async ({ browser, browserName, baseURL }) => {
  const { context, page } = await phonePage(browser, browserName, {
    viewport: { width: 852, height: 393 }, screen: { width: 852, height: 393 },
  });
  try {
    await page.goto(baseURL + '/');
    await expect(page.locator('html')).not.toHaveAttribute('data-phone-layout', '');
    await expectReadableBrief(page);
    await expect(page.locator('[data-sheet-trigger]')).toBeVisible();
  } finally { await context.close(); }
});

test('a simulated wide layout on a narrow touch screen keeps readable controls', async ({ browser, browserName, baseURL }) => {
  test.skip(browserName === 'firefox', 'Firefox ignores screen dimensions that differ from its layout viewport');
  const { context, page } = await phonePage(browser, browserName, {
    viewport: { width: 980, height: 1865 }, screen: phoneScreen,
  });
  try {
    await page.goto(baseURL + '/');
    await expect(page.locator('html')).toHaveAttribute('data-phone-layout', '');
    const scale = await page.locator('html').evaluate((root) => parseFloat(root.style.getPropertyValue('--phone-layout-scale')));
    expect(scale).toBeCloseTo(980 / 393, 2);
    await expectReadableBrief(page, true);
    await expectPhysicalTargets(page);
    await expect(page.locator('.hdr__cta')).toBeHidden();
    await page.locator('[data-sheet-trigger]').click();
    await expect(page.locator('[data-sheet]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-sheet]')).toBeHidden();
    await page.setViewportSize({ width: 393, height: 852 });
    // Playwright's mobile WebKit viewport override emits no resize or media
    // event here. A browser's desktop-site toggle reloads the page; exercise
    // that path in WebKit and live resizing in Chromium.
    if (browserName === 'webkit') await page.reload();
    await expect(page.locator('html')).not.toHaveAttribute('data-phone-layout', '');
    await expectReadableBrief(page);
  } finally { await context.close(); }
});

test('wide layout comfort supports enlarged text and reduced motion', async ({ browser, browserName, baseURL }) => {
  test.skip(browserName === 'firefox', 'Firefox ignores screen dimensions that differ from its layout viewport');
  const { context, page } = await phonePage(browser, browserName, {
    viewport: { width: 980, height: 1865 }, screen: phoneScreen, reducedMotion: 'reduce',
  });
  try {
    await page.goto(baseURL + '/');
    await expect(page.locator('html')).toHaveAttribute('data-phone-layout', '');
    // Apply text enlargement in addition to, rather than replacing, the
    // screen/layout correction. This models a larger default font size.
    const normalSize = await page.locator('html').evaluate((root) => parseFloat(getComputedStyle(root).fontSize));
    await page.addStyleTag({ content: ':root[data-phone-layout] { font-size: calc(200% * var(--phone-layout-scale, 1)); }' });
    await expect.poll(() => page.locator('html').evaluate((root) => parseFloat(getComputedStyle(root).fontSize)))
      .toBeCloseTo(normalSize * 2, 1);
    await expectReadableBrief(page, true);
    await expectPhysicalTargets(page);
    const running = await page.locator('[data-film]').evaluate((root) => root.getAnimations({ subtree: true })
      .filter((animation) => animation.playState === 'running' && Number(animation.effect?.getTiming().duration) > 50).length);
    expect(running).toBe(0);
    const meta = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(meta).toBe('width=device-width, initial-scale=1, viewport-fit=cover');
  } finally { await context.close(); }
});

test('the comfort correction is scoped to the homepage', async ({ browser, browserName, baseURL }) => {
  const { context, page } = await phonePage(browser, browserName, {
    viewport: { width: 980, height: 1865 }, screen: phoneScreen,
  });
  try {
    await page.goto(baseURL + '/tas');
    await expect(page.locator('html')).not.toHaveAttribute('data-phone-layout', '');
    await expect(page.locator('html')).toHaveCSS('font-size', '16px');
  } finally { await context.close(); }
});
