// @ts-check
import { defineConfig } from 'astro/config';

// KRISEVA AI public website — Astro static site config.
// Output is fully static under dist/. No SSR endpoints, no server adapter.
export default defineConfig({
  // The apex kriseva.in DNS is dead (NXDOMAIN, audit 2026-06-12); www is the
  // only resolving host. TODO(founder): when apex DNS is fixed and a
  // canonical host is chosen, flip here + V6Head + index.astro head +
  // sitemap.xml + robots.txt together.
  site: 'https://www.kriseva.in',
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
