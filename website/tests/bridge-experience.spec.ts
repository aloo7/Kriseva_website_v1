import { test, expect, type Page } from 'playwright/test';

const views = [
  { id: 'suppliers', box: '0 120 540 560' },
  { id: 'bridge', box: '410 60 780 740' },
  { id: 'buyers', box: '1160 130 440 540' },
  { id: 'overview', box: '0 60 1600 740' },
] as const;

async function openBridge(page: Page) {
  await page.goto('/bridge');
  await expect(page.locator('[data-bridge]')).toHaveAttribute('data-ready', '');
}

async function expectStage(page: Page, stage: number) {
  await expect(page.locator('[data-bridge]')).toHaveAttribute('data-stage', String(stage));
  await expect(page.locator('[data-stage-button][aria-pressed="true"]')).toHaveCount(1);
  await expect(page.locator(`[data-stage-button="${stage}"]`)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-story]:visible')).toHaveCount(1);
  await expect(page.locator(`[data-story="${stage}"]`)).toBeVisible();
  for (const other of [0, 1, 2].filter((value) => value !== stage)) {
    await expect(page.locator(`[data-story="${other}"]`)).toBeHidden();
  }
}

async function sceneState(page: Page) {
  return page.locator('[data-bridge]').evaluate((root) =>
    Array.from(root.querySelectorAll<HTMLElement | SVGElement>('[data-k]')).map((el) => ({
      key: el.getAttribute('data-k'),
      transform: el.style.transform,
      opacity: el.style.opacity,
      dash: el.style.strokeDashoffset,
    })),
  );
}

async function expectViewBox(page: Page, box: string) {
  await expect.poll(() => page.locator('[data-bridge-scene]').evaluate((el) => {
    const view = (el as SVGSVGElement).viewBox.baseVal;
    return [view.x, view.y, view.width, view.height];
  })).toEqual(box.split(' ').map(Number));
}

async function waitForSceneToSettle(page: Page) {
  let previous = '';
  await expect.poll(async () => {
    const state = JSON.stringify(await sceneState(page));
    const stopped = state === previous;
    previous = state;
    return stopped;
  }, { intervals: [100], timeout: 3_000 }).toBe(true);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scroll, 'page must fit the layout viewport').toBeLessThanOrEqual(dimensions.width + 1);
}

async function expectNoRunningBridgeAnimations(page: Page) {
  const running = await page.locator('[data-bridge]').evaluate((root) =>
    root.getAnimations({ subtree: true }).filter((animation) => {
      const duration = animation.effect?.getTiming().duration;
      return animation.playState === 'running' && typeof duration === 'number' && duration > 50;
    }).length,
  );
  expect(running, 'the pause control freezes every ambient bridge animation').toBe(0);
}

test.describe('bridge exploration', () => {
  test('opens as a finished, unpinned illustration with accessible controls', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await openBridge(page);
    const hero = page.locator('[data-bridge]');
    await expect(hero).toHaveAttribute('data-built', '');
    await expect(hero).not.toHaveAttribute('data-live', '');
    await expectViewBox(page, '0 60 1600 740');
    await expect(page.getByRole('img', { name: 'The Kriseva bridge' })).toBeVisible();
    await expect(page.locator('[data-bridge-controls]')).toHaveCount(3);
    for (const controls of await page.locator('[data-bridge-controls]').all()) {
      await expect(controls).toBeVisible();
    }
    await expectStage(page, 2);
    await expect(page.locator('[data-view="overview"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-play-story]')).toHaveAccessibleName('Play the story');
    expect(errors).toEqual([]);
  });

  test('view buttons frame each shore and preserve story selection', async ({ page }) => {
    await openBridge(page);
    for (const view of views) {
      const button = page.locator(`[data-view="${view.id}"]`);
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('[data-view][aria-pressed="true"]')).toHaveCount(1);
      await expectViewBox(page, view.box);
      await expectStage(page, 2);
    }
  });

  test('keyboard selection does not scroll the illustration away', async ({ page, browserName }) => {
    await openBridge(page);
    const supplier = page.locator('[data-view="suppliers"]');
    await supplier.scrollIntoViewIfNeeded();
    await supplier.focus();
    const before = await page.evaluate(() => window.scrollY);
    await page.keyboard.press('Enter');
    await expect(supplier).toHaveAttribute('aria-pressed', 'true');
    await expectViewBox(page, views[0].box);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThanOrEqual(1);
    // WebKit on macOS uses Option+Tab to include buttons in keyboard traversal.
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    await expect(page.locator('[data-view="bridge"]')).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.locator('[data-view="bridge"]')).toHaveAttribute('aria-pressed', 'true');
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThanOrEqual(1);
  });

  test('story steps expose one explanation and never trap page scrolling', async ({ page }) => {
    await openBridge(page);
    for (const stage of [0, 1, 2]) {
      await page.locator(`[data-stage-button="${stage}"]`).click();
      await expectStage(page, stage);
    }
    await page.locator('#pillars').scrollIntoViewIfNeeded();
    expect(await page.locator('[data-bridge]').evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expectStage(page, 2);
    await expect(page.locator('[data-bridge]')).toHaveAttribute('data-built', '');
  });

  test('guided story pauses, resumes, finishes and can replay', async ({ page }) => {
    test.setTimeout(25_000);
    await openBridge(page);
    const play = page.locator('[data-play-story]');
    await play.click();
    await expect(play).toHaveAccessibleName('Pause story');
    await expect(page.locator('[data-bridge]')).not.toHaveAttribute('data-built', '');
    await page.waitForTimeout(180);
    await play.click();
    await expect(play).not.toHaveAccessibleName('Pause story');
    const paused = await sceneState(page);
    await page.waitForTimeout(250);
    expect(await sceneState(page), 'pausing the story preserves its construction frame').toEqual(paused);
    await play.click();
    await expect(play).toHaveAccessibleName('Pause story');
    await expect.poll(async () => JSON.stringify(await sceneState(page))).not.toBe(JSON.stringify(paused));
    await expect(play).toHaveAccessibleName(/^Replay (the )?story$/, { timeout: 14_000 });
    await expect(page.locator('[data-bridge]')).toHaveAttribute('data-built', '');
    await expectStage(page, 2);
    await expect(page.locator('.gate.is-on')).toHaveCount(3);
    await play.click();
    await expect(play).toHaveAccessibleName('Pause story');
    await expect(page.locator('[data-bridge]')).not.toHaveAttribute('data-built', '');
  });

  test('Pause motion freezes ambient animation and active story construction', async ({ page }) => {
    await openBridge(page);
    await page.locator('[data-play-story]').click();
    await expect(page.locator('[data-play-story]')).toHaveAccessibleName('Pause story');
    await page.waitForTimeout(180);
    const motion = page.locator('[data-motion-toggle]');
    await motion.click();
    await expect(motion).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-bridge]')).toHaveAttribute('data-paused', '');
    await expectNoRunningBridgeAnimations(page);
    const paused = await sceneState(page);
    await page.waitForTimeout(250);
    expect(await sceneState(page)).toEqual(paused);
    // Exploration remains available even when all animation is paused.
    await page.locator('[data-view="buyers"]').click();
    await expectViewBox(page, views[2].box);
    await expect(motion).toHaveAttribute('aria-pressed', 'true');
    await motion.click();
    await expect(motion).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('[data-bridge]')).not.toHaveAttribute('data-paused', '');
  });

  test('a manual step interrupts the guided story at the selected explanation', async ({ page }) => {
    await openBridge(page);
    await page.locator('[data-play-story]').click();
    await expect(page.locator('[data-play-story]')).toHaveAccessibleName('Pause story');
    await page.locator('[data-stage-button="1"]').click();
    await expectStage(page, 1);
    await expect(page.locator('[data-play-story]')).not.toHaveAccessibleName('Pause story');
    await waitForSceneToSettle(page);
    const selected = await sceneState(page);
    await page.waitForTimeout(250);
    expect(await sceneState(page)).toEqual(selected);
  });

  test('mobile playback keeps its pause control and the scene visible together', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openBridge(page);
    const play = page.locator('[data-play-story]');
    await play.click();
    await expect(play).toHaveAccessibleName('Pause story');
    await expect.poll(() => page.evaluate(() => {
      const control = document.querySelector('[data-play-story]')!.getBoundingClientRect();
      const scene = document.querySelector('[data-bridge-scene]')!.getBoundingClientRect();
      const header = document.querySelector('header')!.getBoundingClientRect();
      const top = Math.max(0, header.bottom);
      const visibleSceneHeight = Math.max(0, Math.min(innerHeight, scene.bottom) - Math.max(top, scene.top));
      return control.top >= top - 1 && control.bottom <= innerHeight && visibleSceneHeight / scene.height >= .9;
    }), { message: 'playback keeps the control below the header and at least 90% of the illustration in view' }).toBe(true);
    await play.click();
    await expect(play).toHaveAccessibleName('Resume story');
  });

  test('the paper-gap stage has no solid navy seam across the river', async ({ page }) => {
    await openBridge(page);
    await page.locator('[data-stage-button="0"]').click();
    await expectStage(page, 0);
    await waitForSceneToSettle(page);
    const filledGapPoints = await page.locator('[data-bridge-scene]').evaluate((node) => {
      const scene = node as SVGSVGElement;
      const river = scene.querySelector<SVGRectElement>('[fill="url(#k-water)"]')!.getBBox();
      // A shore band may border the water. It must leave the crossing open
      // before construction, including just above the river's top edge.
      const samples = [.25, .5, .75].map((fraction) => new DOMPoint(river.x + river.width * fraction, river.y - 8));
      const shapes = Array.from(scene.querySelectorAll<SVGGeometryElement>('path, rect, polygon, polyline, circle, ellipse'));
      return samples.filter((sample) => shapes.some((shape) => {
        if (shape.closest('defs')) return false;
        const style = getComputedStyle(shape);
        const color = style.fill.match(/[\d.]+/g)?.slice(0, 3).map(Number);
        if (!color || color.length !== 3 || Math.max(...color) > 100 || color[2] <= color[0]) return false;
        let opacity = Number(style.fillOpacity);
        for (let ancestor: Element | null = shape; ancestor && ancestor !== scene; ancestor = ancestor.parentElement) {
          const ancestorStyle = getComputedStyle(ancestor);
          if (ancestorStyle.visibility === 'hidden' || ancestorStyle.display === 'none') return false;
          opacity *= Number(ancestorStyle.opacity);
        }
        if (opacity < .1) return false;
        const matrix = shape.getScreenCTM();
        const sceneMatrix = scene.getScreenCTM();
        if (!matrix || !sceneMatrix) return false;
        try {
          const local = sample.matrixTransform(sceneMatrix).matrixTransform(matrix.inverse());
          return shape.isPointInFill(local);
        } catch {
          return false;
        }
      })).length;
    });
    expect(filledGapPoints, 'the three interior river points have no opaque navy crossing').toBe(0);
  });
});

test.describe('bridge motion preference', () => {
  test('initial reduced motion keeps the finished scene and view exploration', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openBridge(page);
    await expect(page.locator('[data-bridge]')).toHaveAttribute('data-built', '');
    await expect(page.locator('[data-bridge]')).not.toHaveAttribute('data-live', '');
    await expectStage(page, 2);
    await expect(page.locator('[data-play-story]')).toBeHidden();
    await expectNoRunningBridgeAnimations(page);
    await page.locator('[data-view="suppliers"]').click();
    await expectViewBox(page, views[0].box);
  });

  test('switching to reduced motion during playback finishes immediately', async ({ page }) => {
    await openBridge(page);
    await page.locator('[data-play-story]').click();
    await expect(page.locator('[data-play-story]')).toHaveAccessibleName('Pause story');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('[data-bridge]')).toHaveAttribute('data-built', '');
    await expectStage(page, 2);
    await expect(page.locator('[data-play-story]')).toBeHidden();
    await expectNoRunningBridgeAnimations(page);
    const final = await sceneState(page);
    await page.waitForTimeout(200);
    expect(await sceneState(page)).toEqual(final);
    await page.locator('[data-view="bridge"]').click();
    await expectViewBox(page, views[1].box);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect(page.locator('[data-play-story]')).toBeVisible();
    // Changing the system setting does not unexpectedly restart construction.
    await expect(page.locator('[data-bridge]')).toHaveAttribute('data-built', '');
  });

  test('reduced-motion step selection preserves the finished diagram', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openBridge(page);
    const finished = await sceneState(page);
    for (const stage of [0, 1, 2]) {
      await page.locator(`[data-stage-button="${stage}"]`).click();
      await expectStage(page, stage);
      await expect(page.locator('[data-bridge]')).toHaveAttribute('data-built', '');
      expect(await sceneState(page), 'changing the explanation leaves the complete illustration intact').toEqual(finished);
      await expectNoRunningBridgeAnimations(page);
    }
  });
});

test('without JavaScript the illustration, explanation and demo CTA remain usable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto('/bridge');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('img', { name: 'The Kriseva bridge' })).toBeVisible();
    await expect(page.locator('[data-story="2"]')).toBeVisible();
    for (const controls of await page.locator('[data-bridge-controls]').all()) {
      await expect(controls).toBeHidden();
    }
    await expect(page.locator('[data-bridge]')).not.toHaveAttribute('data-live', '');
    const hiddenParts = await page.locator('[data-bridge-scene]').evaluate((scene) =>
      Array.from(scene.querySelectorAll('.tower, .deck, .cable, .engine')).filter((el) =>
        getComputedStyle(el).visibility === 'hidden' || Number(getComputedStyle(el).opacity) === 0,
      ).length,
    );
    expect(hiddenParts, 'the fallback shows the finished bridge').toBe(0);
    await expectNoRunningBridgeAnimations(page);
    await expectNoHorizontalOverflow(page);
    await page.locator('[data-bridge] a[href="/contact?intent=demo"]').click();
    await expect(page).toHaveURL(/\/contact\?intent=demo$/);
  } finally {
    await context.close();
  }
});

const viewports = [
  { name: 'small phone', width: 320, height: 568 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'landscape phone', width: 844, height: 390 },
  { name: 'portrait tablet', width: 768, height: 1024 },
  { name: 'landscape tablet', width: 1024, height: 768 },
  { name: 'laptop', width: 1280, height: 720 },
  { name: 'wide desktop', width: 1920, height: 1080 },
  { name: 'touch desktop site', width: 980, height: 720 },
];

for (const viewport of viewports) {
  test(`bridge fits ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({
      baseURL,
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: viewport.width <= 1024,
      reducedMotion: 'no-preference',
    });
    try {
      const page = await context.newPage();
      await openBridge(page);
      await expectNoHorizontalOverflow(page);
      for (const view of views) {
        const button = page.locator(`[data-view="${view.id}"]`);
        await expect(button).toBeVisible();
        const size = await button.boundingBox();
        expect(Math.round(size!.height * 100) / 100, 'view controls have a touch target at least 44px tall').toBeGreaterThanOrEqual(44);
        await button.click();
        await expect(button).toHaveAttribute('aria-pressed', 'true');
        await expectViewBox(page, view.box);
        await expectNoHorizontalOverflow(page);
      }
      await page.locator('[data-stage-button="1"]').click();
      await expectStage(page, 1);
      await expectNoHorizontalOverflow(page);
      const motion = page.locator('[data-motion-toggle]');
      const size = await motion.boundingBox();
      expect(Math.round(size!.height * 100) / 100, 'motion control remains touch accessible').toBeGreaterThanOrEqual(44);
      await motion.click();
      await expect(motion).toHaveAttribute('aria-pressed', 'true');
    } finally {
      await context.close();
    }
  });
}

test('orientation changes preserve the chosen view and story state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openBridge(page);
  await page.locator('[data-view="buyers"]').click();
  await page.locator('[data-stage-button="1"]').click();
  for (const viewport of [{ width: 844, height: 390 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await expectNoHorizontalOverflow(page);
    await expectViewBox(page, views[2].box);
    await expect(page.locator('[data-view="buyers"]')).toHaveAttribute('aria-pressed', 'true');
    await expectStage(page, 1);
    await expect(page.locator('[data-motion-toggle]')).toBeVisible();
  }
});
