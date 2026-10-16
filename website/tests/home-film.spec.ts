import { test, expect } from 'playwright/test';

test('the film is opt-in and the 24-second file plays and pauses', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => { if (request.url().endsWith('.mp4')) requests.push(request.url()); });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('[data-film]')).toHaveAttribute('data-film-ready', '');
  expect(requests).toEqual([]);
  const video = page.locator('video');
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.locator('[data-film-play]').click();
  await expect(page.locator('[data-film-label]')).toHaveText('Pause film');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(0);
  expect(await video.evaluate((element: HTMLVideoElement) => element.duration)).toBeCloseTo(24, 1);
  await page.locator('[data-film-play]').click();
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});

test('chapters work before metadata is loaded and rotation preserves the position', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('[data-film-time="10"]').click();
  const video = page.locator('video');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThanOrEqual(10);
  await page.locator('[data-film-play]').click();
  const time = await video.evaluate((element: HTMLVideoElement) => element.currentTime);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(video).toHaveAttribute('data-format', 'wide');
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThan(0);
  expect(await video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeCloseTo(time, 0);
  expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});

test('reduced motion leaves a complete still and a readable story', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('video').evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await expect(page.locator('video')).toHaveAttribute('poster', /poster\.jpg$/);
  await page.getByText('Read the story', { exact: true }).click();
  await expect(page.locator('.story-home__transcript p')).toContainText('People make the decisions.');
  await expect(page.locator('a[href="/bridge"]')).toBeVisible();
});

test('a blocked video leaves the transcript and product paths usable', async ({ page }) => {
  await page.route('**/*.mp4', (route) => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/');
  await page.locator('[data-film-play]').click();
  await expect(page.locator('[data-film-status]')).toContainText('could not play');
  await page.getByText('Read the story', { exact: true }).click();
  await expect(page.locator('.story-home__transcript p')).toBeVisible();
  await expect(page.locator('#pillars a[href="/tas"]')).toBeVisible();
  await expect(page.locator('#pillars a[href="/evaluator"]')).toBeVisible();
});

test('a failed chapter load resets the controls and leaves a readable fallback', async ({ page }) => {
  await page.route('**/*.mp4', (route) => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/');
  await page.locator('[data-film-time="10"]').click();
  await expect(page.locator('[data-film-status]')).toContainText('could not play');
  await expect(page.locator('[data-film-label]')).toHaveText('Play film');
  await page.getByText('Read the story', { exact: true }).click();
  await expect(page.locator('.story-home__transcript p')).toBeVisible();
  expect(await page.locator('video').evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});
