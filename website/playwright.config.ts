// playwright.config.ts
// Stage 7 visual / a11y / responsive / motion QA. Local-only — no cloud upload,
// no analytics, no test-result hosting. Screenshots and snapshots stay on disk.
//
// Browser binary is downloaded by `npx playwright install chromium`; if it has
// not been installed yet, every test in this suite will fail with a clear
// "browser missing" message rather than a silent pass. That is intentional.

import { defineConfig, devices } from 'playwright/test';

const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  outputDir: './tests/.output',
  snapshotDir: './tests/__snapshots__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list']],

  use: {
    baseURL: BASE_URL,
    headless: true,
    ignoreHTTPSErrors: true,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    // Disable animations by default for stable screenshots; individual tests
    // can opt back in via context options.
    contextOptions: {
      reducedMotion: 'no-preference',
    },
  },

  // Snapshot tolerance — small enough to catch real regressions, large enough
  // to ignore subpixel font-rendering differences across machines.
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
    },
  },

  // Build then preview the static site. The webServer is the production build,
  // not the dev server, so tests reflect what ships.
  webServer: {
    command: 'npm run build && npm run preview',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
});
