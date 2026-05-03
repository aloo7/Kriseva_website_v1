#!/usr/bin/env node
// render-og-png.mjs
//
// One-off CLI: render `public/assets/brand/kriseva-og.svg` to a 1200×630
// PNG fallback at `public/assets/brand/kriseva-og.png`. Twitter and LinkedIn
// OG previews historically render PNG more reliably than SVG; the PNG is the
// `og:image` and `twitter:image` target. The SVG stays in the tree as the
// authoritative source.
//
// Usage:
//   node scripts/render-og-png.mjs
//
// Reversible:
//   rm public/assets/brand/kriseva-og.png

import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SVG = resolve(ROOT, 'public/assets/brand/kriseva-og.svg');
const PNG = resolve(ROOT, 'public/assets/brand/kriseva-og.png');

function fmt(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  const before = await stat(SVG);
  console.log(`[render-og-png] source: ${SVG} (${fmt(before.size)})`);

  await sharp(SVG, { density: 200 })
    .resize(1200, 630, { fit: 'contain', background: '#04112a' })
    .png({ compressionLevel: 9, palette: false })
    .toFile(PNG);

  const after = await stat(PNG);
  console.log(`[render-og-png] wrote:  ${PNG} (${fmt(after.size)})`);
  console.log(`[render-og-png] done. The PNG is now used as og:image / twitter:image; the SVG remains as the authoritative source.`);
}

main().catch((err) => {
  console.error('[render-og-png] crashed:', err);
  process.exit(2);
});
