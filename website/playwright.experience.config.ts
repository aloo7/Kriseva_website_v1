import { defineConfig } from 'playwright/test';
import base from './playwright.config';

// Production-build checks for the bridge, accessibility, reflow and recovery.
export default defineConfig({
  ...base,
  testMatch: ['atmosphere.spec.ts', 'home-film.spec.ts', 'compact-home.spec.ts', 'bridge-experience.spec.ts', 'mobile-device.spec.ts', 'motion.spec.ts', 'site-usability.spec.ts', 'a11y.spec.ts', 'qa-static.spec.ts'],
  outputDir: './tests/.output/experience',
  workers: process.env.CI ? 2 : 3,
  use: { ...base.use, baseURL: 'http://127.0.0.1:4322' },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4322',
    url: 'http://127.0.0.1:4322', reuseExistingServer: !process.env.CI,
    timeout: 180000, stdout: 'ignore', stderr: 'pipe',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
    { name: 'webkit', use: { browserName: 'webkit', viewport: { width: 1440, height: 900 } } },
    { name: 'firefox', use: { browserName: 'firefox', viewport: { width: 1440, height: 900 } } },
  ],
});
