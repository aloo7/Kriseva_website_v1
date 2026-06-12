#!/usr/bin/env node
// render-dossier.mjs (X6)
// /dossier.pdf: the one-pager re-typeset in the v6 tokens, print-grade,
// A4, no email gate. Source content: TAS_OnePager.pdf (the field
// instrument plate), re-set with claims-register wording only.
// Deliberately omitted from the original: price-willingness figures
// (commercial; pricing never ships on the public site) and the stale
// test count (the current test claim is validation-page-only by its own
// register caveat).
//
// Usage:  node scripts/render-dossier.mjs
// Output: public/dossier.pdf  (allowlisted in check-public-output.mjs)

import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const FONTS = `file://${ROOT}/public/fonts`;
const sha = (() => { try { return execSync('git rev-parse --short HEAD').toString().trim(); } catch { return 'untracked'; } })();
const date = new Date().toISOString().slice(0, 10);

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Instrument Serif';src:url('${FONTS}/instrument-serif-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:'Instrument Serif';font-style:italic;src:url('${FONTS}/instrument-serif-latin-400-italic.woff2') format('woff2')}
@font-face{font-family:'IBM Plex Sans';src:url('${FONTS}/ibm-plex-sans-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:'IBM Plex Sans';font-weight:600;src:url('${FONTS}/ibm-plex-sans-latin-600-normal.woff2') format('woff2')}
@font-face{font-family:'IBM Plex Mono';src:url('${FONTS}/ibm-plex-mono-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:'IBM Plex Mono';font-weight:500;src:url('${FONTS}/ibm-plex-mono-latin-500-normal.woff2') format('woff2')}
*{margin:0;box-sizing:border-box}
@page{size:A4;margin:0}
body{width:210mm;height:296mm;background:#DED6C9;color:#0F0E0B;font-family:'IBM Plex Sans',sans-serif;
  font-size:9.2pt;line-height:1.5;padding:11mm 12mm;position:relative}
.frame{position:absolute;inset:6mm;border:1px solid #C7BDA3;pointer-events:none}
.frame::before,.frame::after{content:"";position:absolute;width:5mm;height:5mm}
.frame::before{top:-1px;left:-1px;border-top:1.5px solid #0F0E0B;border-left:1.5px solid #0F0E0B}
.frame::after{bottom:-1px;right:-1px;border-bottom:1.5px solid #0F0E0B;border-right:1.5px solid #0F0E0B}
.mono{font-family:'IBM Plex Mono',monospace}
.hdr{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #0F0E0B;padding-bottom:3mm}
.brand{font-family:'IBM Plex Mono',monospace;font-weight:500;font-size:11pt;letter-spacing:.3em}
.brand i{display:inline-block;width:2.4mm;height:2.4mm;border-radius:50%;background:#A87229;font-style:normal}
.fileline{font-family:'IBM Plex Mono',monospace;font-size:6.2pt;letter-spacing:.18em;text-transform:uppercase;color:#4E4838}
h1{font-family:'Instrument Serif',serif;font-weight:400;font-size:23pt;line-height:1.12;letter-spacing:-0.01em;margin:6mm 0 2.5mm;max-width:150mm}
h1 em{font-style:italic;color:#8A5C16}
.dek{color:#4E4838;max-width:130mm}
.k{font-family:'IBM Plex Mono',monospace;font-size:6.4pt;letter-spacing:.22em;text-transform:uppercase;color:#8A5C16;display:block;margin:5.5mm 0 1.6mm}
.vols{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.vol{border-top:1.5px solid #0F0E0B;padding-top:2mm}
.vol b{font-family:'Instrument Serif',serif;font-weight:400;font-size:12.5pt;display:block;margin-bottom:1mm}
.vol .vno{font-family:'IBM Plex Mono',monospace;font-size:6pt;letter-spacing:.2em;text-transform:uppercase;color:#4E4838}
.chips{display:flex;flex-wrap:wrap;gap:1.6mm}
.chip{font-family:'IBM Plex Mono',monospace;font-size:6.4pt;letter-spacing:.12em;text-transform:uppercase;
  border:1px solid #C7BDA3;border-radius:1px;padding:1.2mm 2.2mm;background:#F3EDE0}
.chip.gated{border-style:dashed;background:transparent}
.outcomes{display:grid;grid-template-columns:1fr 1fr 1fr;gap:3mm}
.oc{border:1px solid #C7BDA3;border-radius:1px;background:#F3EDE0;padding:2.4mm 3mm}
.oc b{font-family:'IBM Plex Mono',monospace;font-size:8.6pt;letter-spacing:.18em}
.oc.bid b{color:#8A5C16}.oc.review b{color:#324C6E}.oc.skip b{color:#6E2B26}
.oc span{display:block;font-size:7.6pt;color:#4E4838;margin-top:.8mm}
.states{display:grid;grid-template-columns:repeat(6,1fr);gap:2mm}
.st{border-top:2px solid;padding-top:1.4mm;font-family:'IBM Plex Mono',monospace;font-size:6pt;letter-spacing:.1em;text-transform:uppercase}
.st span{display:block;color:#4E4838;text-transform:none;font-family:'IBM Plex Sans',sans-serif;font-size:7pt;letter-spacing:0;margin-top:.6mm}
.twocol{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.note{font-size:8.6pt;color:#4E4838}
.rec{display:flex;justify-content:space-between;gap:4mm;border-bottom:1px solid #C7BDA3;padding:1.5mm 0;font-size:8.2pt}
.rec .mono{font-size:6.2pt;letter-spacing:.14em;text-transform:uppercase;color:#4E4838;white-space:nowrap;padding-top:.6mm}
.foot{position:absolute;left:12mm;right:12mm;bottom:9mm;border-top:1px solid #0F0E0B;padding-top:2.4mm;
  display:flex;justify-content:space-between;gap:6mm;font-family:'IBM Plex Mono',monospace;font-size:6pt;
  letter-spacing:.14em;text-transform:uppercase;color:#4E4838;line-height:1.9}
</style></head><body>
<div class="frame"></div>
<div class="hdr">
  <span class="brand">KRISEVA <i></i></span>
  <span class="fileline">Dossier · defence procurement intelligence · India · ${date} · ${sha}</span>
</div>

<h1>A tender is not a PDF. It is a <em>decision system</em> hidden inside a document bundle.</h1>
<p class="dek">Deterministic, auditable procurement intelligence for the teams that bid and the committees that evaluate. Every verdict linked to a clause and a page.</p>

<span class="k">The platform · two volumes, one evidence engine</span>
<div class="vols">
  <div class="vol"><span class="vno">Vol. I · bidder-side</span><b>KRISEVA TAS</b>
    KRISEVA TAS helps bid teams discover, parse, score, and review tender opportunities. A scattered bundle becomes a defensible BID / REVIEW / SKIP decision. Recommendation only; the operator signs.</div>
  <div class="vol"><span class="vno">Vol. II · issuer-side</span><b>KRISEVA EVALUATOR</b>
    Kriseva Evaluator is an issuer-side, committee-assist bid evaluation system for government and defence procurement organisations. Three-path convergence reasoning on every criterion; uncertainty routes to humans.</div>
</div>

<span class="k">The bundle, treated as one decision artifact</span>
<div class="chips">
  <span class="chip">BID · main document</span><span class="chip">SPEC · specification</span>
  <span class="chip">BOQ · bill of quantities</span><span class="chip">ATC · additional T&amp;C</span>
  <span class="chip">CORR · corrigenda</span><span class="chip gated">ANN · annexures · auth-gated</span>
  <span class="chip gated">DRW · drawings · auth-gated</span>
</div>

<span class="k">Three outcomes · one grammar · reviewable</span>
<div class="outcomes">
  <div class="oc bid"><b>BID</b><span>local bundle ready · timeline feasible · evidence in place</span></div>
  <div class="oc review"><b>REVIEW</b><span>something is missing or ambiguous · the operator decides</span></div>
  <div class="oc skip"><b>SKIP</b><span>category mismatch or disqualifier · with the clause cited</span></div>
</div>

<span class="k">The verdict model · six states, none silent</span>
<div class="states">
  <div class="st" style="border-color:#3A7A5B">Verified</div>
  <div class="st" style="border-color:#9A7322">Qualified</div>
  <div class="st" style="border-color:#41618C">Req-demo</div>
  <div class="st" style="border-color:#5F6A79">Insufficient<span>→ human</span></div>
  <div class="st" style="border-color:#9C4F43">Missing<span>→ human</span></div>
  <div class="st" style="border-color:#83332D">Failed<span>never silent</span></div>
</div>

<div class="twocol" style="margin-top:5mm">
  <div>
    <span class="k" style="margin-top:0">The boundary · sovereign-by-design</span>
    <p class="note">Designed for local-first tender processing, with local database, local file storage, and local model routes where configured. A hash-chained, append-only audit log: a single edited verdict breaks the chain; tamper is visible. Refused at the architecture: cloud LLM APIs, hosted vector databases, SaaS telemetry, foreign-hosted inference, document contents leaving the network.</p>
    <span class="k">Field notes · from discovery</span>
    <p class="note">In six discovery interviews (2026), operators reported that the large majority of published tenders were irrelevant to them, and that working through one bid still meant a hundred or more pages, by hand. Six interviews: a field observation, not a market statistic.</p>
  </div>
  <div>
    <span class="k" style="margin-top:0">Field record · status-labelled</span>
    <div class="rec"><span>Pan IIT “AI for Bharat” Grand Finalist, from 13,500+ teams</span><span class="mono">validated</span></div>
    <div class="rec"><span>Udyam-registered MSME, on government record</span><span class="mono">on record</span></div>
    <div class="rec"><span>DPIIT Startup-India recognition</span><span class="mono">in process</span></div>
    <div class="rec"><span>Incubated at IIT Gandhinagar · IIEC</span><span class="mono">on record</span></div>
    <div class="rec"><span>In active evaluation with a central armed police force</span><span class="mono">in evaluation</span></div>
    <span class="k">The door</span>
    <p class="note">Ayush Tiwary · Founder · KRISEVA AI<br>ayush@kriseva.in · www.kriseva.in<br>Founder-led, direct. No SDR funnel.</p>
  </div>
</div>

<div class="foot">
  <span>KRISEVA AI Private Limited · no military or government endorsement claimed or implied</span>
  <span>product examples are synthetic / seeded demo data, not a real tender</span>
  <span>copy traces to publicClaims.ts</span>
</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: resolve(ROOT, 'public/dossier.pdf'), format: 'A4', printBackground: true });
await browser.close();
console.log('public/dossier.pdf written');
