// @ts-check
import { defineConfig } from 'astro/config';

// KRISEVA AI public website — Astro static site config.
// Output is fully static under dist/. No SSR endpoints, no server adapter.
export default defineConfig({
  site: 'https://kriseva.in',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
