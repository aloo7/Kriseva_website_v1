#!/usr/bin/env node
// check-public-copy.mjs
//
// Scans deployable public source for forbidden terms (claim register +
// build-spec hard-fail terms) and emits warnings for flagged-for-review
// terms. Excludes docs, reference dirs, and this script itself so legitimate
// examples in audit notes do not trip the gate.
//
// Output codes:
//   exit 0  → no hard-fail terms (flagged warnings may still be present)
//   exit 1  → at least one hard-fail term in deployable public copy
//   exit 2  → script crashed
//
// Two lists:
//   HARD_FORBIDDEN — anything matching this list fails the build
//   FLAGGED        — anything matching this list emits a [warn] line but
//                    does NOT fail the build (legitimate uses are common,
//                    so a human reviews each occurrence)

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, relative, sep } from 'node:path';

const ROOT = resolve(new URL('..', import.meta.url).pathname);

// Folders we DO scan (deployable source).
const INCLUDE_DIRS = ['src/pages', 'src/components', 'src/data'];
// Plus public/, but with strong excludes (see EXCLUDE_PATHS below).
const INCLUDE_PUBLIC = 'public';

// Font-drift scan: CSS-scoped dirs (layouts/styles) must not reintroduce a
// Google Fonts CDN reference or a non-canonical font family (Brand System v1:
// Instrument Serif + IBM Plex Sans/Mono/Serif, self-hosted, no CDN).
const FONT_SCAN_DIRS = ['src/layouts', 'src/styles'];
const FONT_FORBIDDEN = [
  /fonts\.googleapis\.com/i,
  /fonts\.gstatic\.com/i,
  /["']Libre Baskerville["']/i,
  /["']Inter["']/i,
  /["']JetBrains Mono["']/i,
];

// Hard exclusions — these never get scanned.
const EXCLUDE_PATHS = [
  'node_modules',
  '.astro',
  'dist',
  'docs',
  'scripts',
  'reference',
  'public/reference',
  'public/private',
];

// ─────────────────────────────────────────────────────────────────────────
// HARD-FORBIDDEN — public output must not contain any of these.
// String entries: literal substring, case-insensitive.
// RegExp entries: treated as case-insensitive regex (do not include /g).
// ─────────────────────────────────────────────────────────────────────────
const HARD_FORBIDDEN = [
  // Claude Design bundler / runtime artifacts
  'Unpacking',
  '__bundler',
  'text/babel',
  '__bundler/manifest',
  '__bundler/template',
  'api.anthropic.com/v1/design',
  // Brand
  'Tender Advisory System',
  'kriseva.ai',
  // Commercial / channel
  /\bpricing\b/i,
  'WhatsApp',
  // Government / agency endorsement
  'government-approved',
  'officially endorsed',
  'DRDO-approved',
  'CRPF-approved',
  'Indian Army validated',
  'used by DRDO',
  'used by DRDL',
  'used by Indian Army',
  // Marketing absolutes
  /\bguaranteed\b/i,
  '80% reduction',
  '90% reduction',
  '100% accurate',
  // New Stage 6 marketing absolutes
  /\brevolutionary\b/i,
  /\bgame-changing\b/i,
  /\bfully\s+automated\b/i,
  /\bfully\s+replaces\b/i,
  /\bIndia['’]s\s+first\b/i,
  /\bproduction-ready\b/i,
  // Security absolutes
  'fully secure',
  'air-gapped',
  'no data ever leaves',
  'military-grade',
  'zero-risk',
];

// ─────────────────────────────────────────────────────────────────────────
// FLAGGED — emits warnings for human review, does NOT fail the build.
// "best", "first", "only" appear naturally in content (e.g. "first-class",
// "only when configured"); the warn output lets a human verify each use.
// ─────────────────────────────────────────────────────────────────────────
const FLAGGED = [
  /\bbest\b/i,
  /\bfirst\b/i,
  /\bonly\b/i,
  /\btrusted\s+by\b/i,
  /\bapproved\s+by\b/i,
  /\bendorsed\s+by\b/i,
  /\benterprise-grade\b/i,
  /\bbattle-tested\b/i,
  /\bindustry-leading\b/i,
];

const TEXT_EXT = new Set([
  '.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.css', '.scss', '.html', '.json', '.txt', '.xml', '.svg',
  '.md', '.mdx',
]);

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    const rel = relative(ROOT, full).split(sep).join('/');
    if (EXCLUDE_PATHS.some((p) => rel === p || rel.startsWith(p + '/'))) continue;
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (e.isFile()) {
      const dot = e.name.lastIndexOf('.');
      const ext = dot === -1 ? '' : e.name.slice(dot).toLowerCase();
      if (TEXT_EXT.has(ext)) yield full;
    }
  }
}

function lineForIndex(content, idx) {
  return content.slice(0, idx).split('\n').length;
}

function findAllHits(content, patterns) {
  const hits = [];
  for (const pattern of patterns) {
    if (pattern instanceof RegExp) {
      const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g';
      const re = new RegExp(pattern.source, flags.includes('i') ? flags : flags + 'i');
      let m;
      while ((m = re.exec(content)) !== null) {
        hits.push({
          pattern: String(pattern),
          example: m[0],
          line: lineForIndex(content, m.index),
        });
        if (m.index === re.lastIndex) re.lastIndex++; // safety
      }
    } else {
      const lower = content.toLowerCase();
      const needle = String(pattern).toLowerCase();
      let from = 0;
      while (true) {
        const idx = lower.indexOf(needle, from);
        if (idx === -1) break;
        hits.push({
          pattern: String(pattern),
          example: content.slice(idx, idx + needle.length),
          line: lineForIndex(content, idx),
        });
        from = idx + needle.length;
      }
    }
  }
  return hits;
}

async function main() {
  const targets = [];
  for (const dir of INCLUDE_DIRS) {
    const abs = join(ROOT, dir);
    try { await stat(abs); } catch { continue; }
    for await (const f of walk(abs)) targets.push(f);
  }
  const pubAbs = join(ROOT, INCLUDE_PUBLIC);
  try { await stat(pubAbs); for await (const f of walk(pubAbs)) targets.push(f); } catch {}

  let scanned = 0;
  const hardFailures = [];
  const flagged = [];

  for (const f of targets) {
    scanned++;
    const content = await readFile(f, 'utf8');
    const hard = findAllHits(content, HARD_FORBIDDEN);
    const soft = findAllHits(content, FLAGGED);
    if (hard.length) hardFailures.push({ file: relative(ROOT, f), hits: hard });
    if (soft.length) flagged.push({ file: relative(ROOT, f), hits: soft });
  }

  // Font-drift scan (Brand System v1): layouts/styles must not reintroduce a
  // Google Fonts CDN reference or a non-canonical font family.
  for (const dir of FONT_SCAN_DIRS) {
    const abs = join(ROOT, dir);
    try { await stat(abs); } catch { continue; }
    for await (const f of walk(abs)) {
      scanned++;
      const content = await readFile(f, 'utf8');
      const hits = findAllHits(content, FONT_FORBIDDEN);
      if (hits.length) hardFailures.push({ file: relative(ROOT, f), hits });
    }
  }

  // The Cloudflare _headers CSP must also not allow Google Fonts origins.
  for (const extra of ['public/_headers']) {
    const abs = join(ROOT, extra);
    try { await stat(abs); } catch { continue; }
    scanned++;
    const content = await readFile(abs, 'utf8');
    const hits = findAllHits(content, FONT_FORBIDDEN);
    if (hits.length) hardFailures.push({ file: extra, hits });
  }

  // Always emit flagged warnings (informational; do not affect exit code).
  if (flagged.length) {
    const totalSoft = flagged.reduce((n, x) => n + x.hits.length, 0);
    console.warn(`\n[check-public-copy] FLAGGED — ${totalSoft} soft hit(s) across ${flagged.length} file(s) (review-only, no fail):\n`);
    for (const { file, hits } of flagged) {
      console.warn(`  ⚠ ${file}`);
      for (const h of hits) {
        console.warn(`      line ${h.line}  pattern: ${h.pattern}  match: ${JSON.stringify(h.example)}`);
      }
    }
    console.warn('');
  }

  if (hardFailures.length) {
    const totalHard = hardFailures.reduce((n, x) => n + x.hits.length, 0);
    console.error(`[check-public-copy] FAILED — ${totalHard} hard-fail hit(s) across ${hardFailures.length} file(s).\n`);
    for (const { file, hits } of hardFailures) {
      console.error(`  ✗ ${file}`);
      for (const h of hits) {
        console.error(`      line ${h.line}  pattern: ${h.pattern}  match: ${JSON.stringify(h.example)}`);
      }
    }
    console.error('\nFix the wording above before deploying.');
    process.exit(1);
  }

  const flaggedSummary = flagged.length
    ? ` (${flagged.reduce((n, x) => n + x.hits.length, 0)} flagged-for-review hit(s) above — verify each manually)`
    : '';
  console.log(`[check-public-copy] OK — scanned ${scanned} file(s); no forbidden terms found.${flaggedSummary}`);
}

main().catch((err) => {
  console.error('[check-public-copy] crashed:', err);
  process.exit(2);
});
