#!/usr/bin/env node
// check-public-output.mjs
// Post-build guard. Fails if dist/ contains anything that should not ship:
// reference design HTML, Claude Design bundler files, _dev / transcripts /
// stakeholder notes / .docx / .pdf / internal reports / raw uploads / private
// folders. Run after `astro build`.

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve, relative, sep } from 'node:path';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const DIST = join(ROOT, 'dist');

// Forbidden filename / path fragments. Any dist path that includes one fails.
const FORBIDDEN_PATH_FRAGMENTS = [
  '_dev/',
  'reference/',
  'chats/',
  'uploads/',
  'private/',
  'CLAIM_REGISTER',
  'EXECUTIVE_SUMMARY',
  'RESEARCH_LIMITATIONS',
  'SCREENSHOT_INVENTORY',
  'SOURCE_BIBLIOGRAPHY',
  'NEXT_AGENT_INSTRUCTIONS',
  'STAGE_5_PREFLIGHT',
  'STAGE_5_COMPLETION',
  'QA_REPORT',
];

// Forbidden file extensions in dist/.
const FORBIDDEN_EXT = ['.docx', '.pdf', '.zip', '.tar', '.gz', '.7z', '.mp4', '.mov'];

// Forbidden filenames specifically for Claude Design reference HTML.
const FORBIDDEN_HTML_NAMES = [
  'kriseva-claim-safe-components',
  'kriseva-components',
  'kriseva-decision-panel',
  'kriseva-design-system',
  'kriseva-display-components',
  'kriseva-dossier-card',
  'kriseva-evidence-trail',
  'kriseva-nav-footer',
  'kriseva-ai.html', // logo-export shell
  'kriseva-tas.html',
  'kriseva-homepage.html',
  'kriseva-workflow.html',
  'kriseva-security.html',
  'kriseva-validation.html',
  'kriseva-issuer.html',
  'kriseva-founder.html',
];

// Forbidden in-content tokens that signal a design-runtime / bundler leaked
// into the built HTML/JS/CSS in dist/.
const FORBIDDEN_CONTENT = [
  'Unpacking',
  '__bundler',
  '__bundler/manifest',
  '__bundler/template',
  'text/babel',
  'unpkg.com/@babel/standalone',
  'api.anthropic.com/v1/design',
];

const TEXT_EXT = new Set(['.html', '.js', '.mjs', '.cjs', '.css', '.svg', '.json', '.xml', '.txt']);

async function* walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.isFile()) yield full;
  }
}

async function main() {
  try { await stat(DIST); } catch {
    console.error('[check-public-output] dist/ does not exist. Run `npm run build` first.');
    process.exit(1);
  }

  const failures = [];
  let scanned = 0;

  for await (const f of walk(DIST)) {
    scanned++;
    const rel = relative(DIST, f).split(sep).join('/');
    const lower = rel.toLowerCase();
    const dot = rel.lastIndexOf('.');
    const ext = dot === -1 ? '' : rel.slice(dot).toLowerCase();
    const base = rel.slice(rel.lastIndexOf('/') + 1).toLowerCase();

    // Path fragment block
    for (const frag of FORBIDDEN_PATH_FRAGMENTS) {
      if (lower.includes(frag.toLowerCase())) {
        failures.push({ file: rel, reason: `path includes "${frag}"` });
      }
    }
    // Extension block
    if (FORBIDDEN_EXT.includes(ext)) {
      failures.push({ file: rel, reason: `forbidden extension ${ext}` });
    }
    // Reference HTML names (heuristic: kebab-case filename match)
    if (ext === '.html') {
      const slug = base.replace(/\.html$/, '');
      if (FORBIDDEN_HTML_NAMES.some((n) => slug === n.replace(/\.html$/, ''))) {
        failures.push({ file: rel, reason: 'reference design HTML present in dist/' });
      }
    }
    // Content block
    if (TEXT_EXT.has(ext)) {
      try {
        const content = await readFile(f, 'utf8');
        for (const token of FORBIDDEN_CONTENT) {
          if (content.includes(token)) {
            failures.push({ file: rel, reason: `dist content contains "${token}"` });
            break;
          }
        }
      } catch {}
    }
  }

  if (failures.length) {
    console.error(`\n[check-public-output] FAILED — ${failures.length} forbidden artifact(s) in dist/.\n`);
    for (const f of failures) console.error(`  ✗ ${f.file}\n      ${f.reason}`);
    process.exit(1);
  }
  console.log(`[check-public-output] OK — scanned ${scanned} dist file(s); no forbidden artifacts found.`);
}

main().catch((err) => {
  console.error('[check-public-output] crashed:', err);
  process.exit(2);
});
