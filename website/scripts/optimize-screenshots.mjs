#!/usr/bin/env node
// optimize-screenshots.mjs
//
// Reversible image optimization for the TAS screenshot set. Generates
// modern-format variants alongside the originals; the originals are NEVER
// touched. Components can later switch to <picture> with the WebP as the
// primary source and the PNG as a fallback.
//
// Usage:
//   node scripts/optimize-screenshots.mjs            # produce .webp variants
//   node scripts/optimize-screenshots.mjs --avif     # also produce .avif
//   node scripts/optimize-screenshots.mjs --revert   # delete generated variants only
//   node scripts/optimize-screenshots.mjs --dry-run  # report sizes, write nothing
//
// Discipline:
// - Originals stay in place.
// - Generated variants are colocated next to originals (PNG + WEBP + AVIF).
// - The "seeded demo data" disclosure rendered separately in figcaption is
//   not affected by this script — image content is unchanged.
// - Re-running this script is idempotent.
// - --revert only deletes files this script created (.webp + .avif siblings).

import { readdir, stat, rm } from 'node:fs/promises';
import { join, resolve, basename, extname } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const DIR = join(ROOT, 'public/assets/screenshots');

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');
const REVERT = args.includes('--revert');
const ALSO_AVIF = args.includes('--avif');

// Conservative quality: visual parity with PNG to a careful eye, ~70% size cut.
const WEBP_QUALITY = 82;
const AVIF_QUALITY = 60;
// Cap dimension so the 1440 × 5753 briefing capture doesn't ship at full size.
// The component's max display is bounded; matching it avoids wasted bytes.
const MAX_WIDTH = 1440;

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function listPngs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isFile() && extname(e.name).toLowerCase() === '.png').map((e) => join(dir, e.name));
}

async function safeUnlink(path) {
  try {
    await rm(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const pngs = await listPngs(DIR);
  if (pngs.length === 0) {
    console.error(`[optimize-screenshots] no .png files found in ${DIR}`);
    process.exit(1);
  }

  console.log(`[optimize-screenshots] target dir: ${DIR}`);
  console.log(`[optimize-screenshots] mode: ${REVERT ? 'REVERT' : DRY ? 'DRY-RUN' : 'WRITE'}${ALSO_AVIF && !REVERT ? ' (+ AVIF)' : ''}`);
  console.log('');

  let totalBefore = 0;
  let totalAfterWebp = 0;
  let totalAfterAvif = 0;
  const log = [];

  for (const png of pngs) {
    const stem = basename(png, '.png');
    const webp = join(DIR, `${stem}.webp`);
    const avif = join(DIR, `${stem}.avif`);

    if (REVERT) {
      const w = await safeUnlink(webp);
      const a = await safeUnlink(avif);
      if (w || a) log.push(`  ↺ ${stem} — removed ${[w && 'webp', a && 'avif'].filter(Boolean).join(' + ')}`);
      continue;
    }

    const before = (await stat(png)).size;
    totalBefore += before;

    if (DRY) {
      log.push(`  · ${stem}.png  (${fmtBytes(before)})  →  would write .webp${ALSO_AVIF ? ' + .avif' : ''}`);
      continue;
    }

    // PNG → WEBP. Always written.
    await sharp(png)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(webp);
    const sizeWebp = (await stat(webp)).size;
    totalAfterWebp += sizeWebp;

    let avifLine = '';
    if (ALSO_AVIF) {
      await sharp(png)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .avif({ quality: AVIF_QUALITY, effort: 4 })
        .toFile(avif);
      const sizeAvif = (await stat(avif)).size;
      totalAfterAvif += sizeAvif;
      avifLine = ` · avif ${fmtBytes(sizeAvif)} (-${(((before - sizeAvif) / before) * 100).toFixed(0)}%)`;
    }

    log.push(
      `  ✓ ${stem}: png ${fmtBytes(before)}  →  webp ${fmtBytes(sizeWebp)} (-${(((before - sizeWebp) / before) * 100).toFixed(0)}%)${avifLine}`,
    );
  }

  log.forEach((l) => console.log(l));
  console.log('');

  if (REVERT) {
    console.log(`[optimize-screenshots] revert complete. Originals untouched.`);
    return;
  }
  if (DRY) {
    console.log(`[optimize-screenshots] dry-run. Originals untouched. Run without --dry-run to write.`);
    return;
  }
  console.log(`[optimize-screenshots] totals:  png ${fmtBytes(totalBefore)}  →  webp ${fmtBytes(totalAfterWebp)}${
    ALSO_AVIF ? `  +  avif ${fmtBytes(totalAfterAvif)}` : ''
  }`);
  console.log(`[optimize-screenshots] originals kept on disk. Use --revert to remove generated variants.`);
}

main().catch((err) => {
  console.error('[optimize-screenshots] crashed:', err);
  process.exit(2);
});
