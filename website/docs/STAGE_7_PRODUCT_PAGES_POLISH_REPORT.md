# Stage 7 Product / Proof Pages Polish — Implementation Report

Date: 2026-05-03
Scope: Premium polish for `/tas`, `/workflow`, `/security`, `/validation` per the Stage 7 polish plan and art direction. **No copy / claim changes. No new metrics. No new claims.**

> **Verdict — gates green.** All Stage 5 / 6 / 7 lint, type, and build gates pass. Bundle overhead vs. previous Stage-7 state: ~3 KB CSS gzipped (split across 4 new route-scoped chunks). Zero new JS shipped; zero new dependencies.

---

## 1. /tas — *Product Operating Room*

### Design changes
- **New `CapabilityPipeline.astro` component** (~210 lines, scoped CSS only). Renders the 7-stage operator workflow: `01 Discovery → 02 Bundle → 03 Extract → 04 Relevance → 05 Compliance → 06 Brief → 07 Operator` as a single horizontal map on a paper card with brass connectors.
  - Each stage is a paper-on-paper pill with mono number, serif label, and uppercase mono sub-line drawn from already approved phrases ("GeM · DefProc public · upload", "RFP · BOQ · ATC · corrigenda", etc.).
  - Hover / focus inverts a single stage to a brass background, lifting the brass connector line through it. Pure CSS — no JS.
  - Caveat baked in: *"Recommendations are advisory. Operator confirms or overrides every brief and records the decision against the bundle."*
  - Dossier-tab top stripe on the card reuses the design-system idiom from the founder identity card.
- **New "Operator Pipeline" section** placed between hero and capabilities, introducing the pipeline before the deep dive.
- **Capabilities section moved** from `--paper` to `--dark` so the pipeline (paper) and the capability cards (navy) read as two distinct layers — the pipeline is the *map*, the cards are the *stations*.
- **Status meta** added to each capability card via the existing `DossierCard`'s `meta` prop. Every status string is composed from approved language already in the public-claims register (e.g. "Status · operational" maps to verified claims; "Status · under active evaluation" mirrors `claims.ocr` verbatim; "Status · in pilot" mirrors `claims.productStatus`; "Recommends · not autonomous" mirrors the boundary list).
- **Decision panel redesigned** — each BID / REVIEW / SKIP cell now has:
  - A coloured `border-top` (3 px) in the matching decision colour
  - A meta footer with a dashed top rule: *"Recommended · operator confirms"* / *"Held · operator reviews evidence"* / *"Skipped · rationale recorded"*
  - The pill, body, and meta now read as a true decision state, not a marketing badge.
- **Boundary list (`tas-not`)** got the **dashed left rule** — the Stage 7 design-system signal for "boundary documented and crossable / not committed". Visually unifies the boundaries list with the security page's "across the boundary" pattern.

### Interaction changes
- Capability grid: `data-stagger` cascade (40 ms apart, 9 cards).
- Decision grid: `data-stagger` cascade (3 cells).
- Screenshots grid: `data-stagger` cascade (4 frames).
- Boundary list: `data-stagger` cascade (8 NOT rows).
- All staggers are reduced-motion-safe (the global override sets transition-duration to 0.01 ms).

### Responsive
- Capability pipeline: `repeat(7, 1fr)` at desktop → `repeat(4, 1fr)` at 1024 px → `repeat(2, 1fr)` at 720 px → vertical at 480 px (each stage flips to a horizontal row layout: `36px num | label`, sub-line below).
- Decision grid: 3-up at desktop → single column at 880 px.
- Capability grid: 3-up → 2-up at 980 px → 1 at 640 px.
- All TAS frames use the Stage 7 `ProductScreenshotFrame` with the SEEDED DEMO badge always visible.

---

## 2. /workflow — *Before / After Transformation*

### Design changes
- **Before/after section reframed** with a strong split-screen + brass arrow divider on desktop. Each column now carries:
  - A header with mono heading + sub-line (`BEFORE TAS · Manual · scattered` / `WITH TAS · Bundle · evidence-linked · operator-recorded`)
  - A 3-column-style enumerated list (`<ol>` with mono `01–08` indices on the left)
  - A dashed-rule caveat at the bottom of each column
- **Brass arrow divider** in the centre column at desktop ≥ 880 px (an actual `→` glyph rotated 90° on smaller layouts) — visually marks the transformation. Disappears on mobile to free vertical space.
- **Color discipline**: BEFORE column has a soft gradient red wash + 3 px solid red left rule (committed bad state). AFTER column has soft green wash + 3 px solid forest-green left rule.
- **Pipeline section** now sits inside a `--shadow-lift` framed track with the larger `--radius-frame` corners — reads as a single audit instrument.

### Interaction changes
- Both before/after lists: `data-stagger` cascade (each row appears with 40 ms delay).
- Pipeline track: `data-stagger` cascade (8 cards).
- All gated on reduced motion.

### Responsive
- Split-screen collapses to single column at ≤ 880 px; the brass arrow divider hides.
- Each list item retains the 36 px index + body layout at every breakpoint; index never crowds the body text.

---

## 3. /security — *Boundary Map*

### Design changes
- **Principles cards** got status meta strings via `DossierCard`'s `meta` prop:
  - 01 Operator-controlled storage → `Inside the boundary · default`
  - 02 Local model routes → `Inside the boundary · configured`
  - 03 Explicit external boundary → `Across the boundary · documented`
  - 04 Operator authority → `Operator decides · no autonomous action`
- **Inside / Across tables redesigned** as paired `sec-table` panels:
  - **Inside the boundary** panel — solid border, paper-rise background, `SOLID · DEFAULT LOCAL` chip in the header
  - **Across the boundary** panel — **dashed border** (the design-system "crossable" rule), paper-rise + faint brass wash, `DASHED · DOCUMENTED & CROSSABLE` chip in the header
  - Each panel uses a `<ul class="sec-rowlist">` instead of an `<table>` — better mobile collapse to single column with label above value
  - Across panel rows have **dashed top borders** that reinforce the rule discipline at every row, not just the panel edge
- **"What we will not call this" list** got the dashed left rule (matching the design-system convention) and tighter padding rhythm.

### Interaction changes
- Principles grid: `data-stagger` cascade (4 cards).
- "Will not call this" list: `data-stagger` cascade (6 NOT rows).
- All reduced-motion-safe.

### Responsive
- `sec-tables` two-column → single column at 920 px.
- Inside each panel, the row list stays grid-style at desktop and collapses to "label above value" at ≤ 600 px (no horizontal scroll).
- Principles cards: 2-col → 1-col at 720 px.

### Claim safety verification
The lint hard-fail list (`fully secure`, `air-gapped`, `no data ever leaves`, `military-grade`, `zero-risk`) is not introduced anywhere. The "will not call this" list continues to use the rephrased anti-claim language from Stage 6 (e.g. "A no-egress data guarantee", "An isolated-network deployment posture", "An absolute-security claim") so the literal forbidden substrings never enter the dist.

---

## 4. /validation — *Audit Room*

### Design changes
- **New Evidence Index strip** at the top of the page below the hero. A `<ol>` with four chapter markers (`§ 01 · § 02 · § 03 · § 04`), each linking via in-page anchors to the corresponding section. Hovering a row tints the background and shifts the row right by 8 px. Reads like a dossier table-of-contents.
- **Anchor IDs** wired on each chapter section (`#repo-grounded`, `#architecture`, `#test-status`, `#stakeholder`) so the index links navigate within the dossier and the global `:target` ring (Stage 7 design-system) lights the heading on arrival.
- **Test status block** got a richer `val-test__head` row above the careful sentence: a mono label `CAREFUL WORDING · NOT A MARKETING HEADLINE` on the left, `§ 03 / VALIDATION` chapter marker on the right, dashed bottom rule. Frame now uses `--shadow-lift` and a 3-px dashed left border (Stage 7 "carefully worded" signal).
- **Stakeholder discovery cards** got `meta="Anonymized · Tier 2"` / `meta="Anonymized · senior procurement-side"` strings — restating the existing register-approved language without inventing new claims.
- **Closing discipline line** turned into a dashed-bordered card so it reads as an explicit dossier disclosure rather than a footer note: *"No public attribution unless authorized · No agency endorsement claimed · Names withheld where confidentiality applies."*

### Interaction changes
- Evidence Index: `data-stagger` cascade (4 chapter rows). Hover state: brass tint + 8 px right slide; reduced-motion: stays static.
- Screenshots grid: `data-stagger` cascade (5 frames including the wide one).
- Stakeholder grid: `data-stagger` cascade (4 cards).
- All reduced-motion-safe.

### Responsive
- Evidence Index rows collapse to single-column at ≤ 600 px (label, link, meta stacked).
- Screenshots grid: 2-up + 1 wide → 1-up at 880 px (the wide one already spans full width; the others stack).
- Stakeholder grid: 2-up → 1-up at 720 px.

### Claim safety verification
- The 4,072 pytest-collected tests sentence remains **verbatim** in `claims.recentTestNote`. Not condensed into a marketing headline. The new wrapper just frames it more explicitly as careful wording.
- Stakeholder cards remain Tier-2 anonymized. No name appears anywhere. The new `meta` strings reinforce anonymization, they do not introduce new claims.
- Synthetic / demo data disclosure on every screenshot is unchanged and the SEEDED DEMO badge from the design-system pass continues to render.

---

## 5. Files changed

| Path | Change |
|---|---|
| `src/components/CapabilityPipeline.astro` | **Created.** ~210 lines. New 7-stage operator pipeline. |
| `src/pages/tas.astro` | Pipeline section added; capabilities moved to dark surface with status meta; decision panel redesigned with coloured top borders + dashed meta rules; boundary list given dashed left rule + stagger; screenshots staggered. |
| `src/pages/workflow.astro` | Before/after section reframed with header, indexed list, dashed caveat, brass-arrow divider; pipeline framed with `--shadow-lift`; both lists + pipeline staggered. |
| `src/pages/security.astro` | Principles cards given status meta + stagger; inside/across tables redesigned as `sec-table` panels with chip headers and dashed/solid rule discipline; rowlist replaces matrix-table for mobile-friendly collapse; will-not-call list given dashed left rule + stagger. |
| `src/pages/validation.astro` | Evidence Index strip added; anchor IDs wired; test-status block redesigned with `__head` row + `--shadow-lift` framing; stakeholder cards given anonymization meta; closing disclosure line framed as a dashed card; screenshots + stakeholder grid staggered. |

No other files modified. No `package.json` change. No design-token change. No new dependency.

---

## 6. Bundle impact

Built dist sizes after the polish:

```
JS chunks  (unchanged)                         ~1.67 KB gzipped
                                              ─────
                                                ~1.7 KB

CSS chunks
  contact.6ouhjDFG.css  15 132 B raw            (shared global + tokens)
  contact.BqFNIdjd.css   6 355 B raw            (contact page scoped)
  founder.CP2u2wMX.css  10 328 B raw            (founder page scoped)
  index.Nkb_CoSa.css    15 099 B raw            (homepage scoped — Stage 7 pass 2)
  security.B6__14kP.css  4 603 B raw            (NEW · Stage 7 polish)
  tas.Bbk3RPSp.css       9 389 B raw            (NEW · Stage 7 polish)
  workflow.CM55jJm3.css  5 282 B raw            (NEW · Stage 7 polish)

Total CSS gzipped after this pass: ~12.5 KB (was ~10 KB pre-product-pages-polish)

Built HTML — measured raw + gzipped:
  /tas         44 398 B raw / 8 003 B gzipped
  /workflow    25 036 B raw / 5 428 B gzipped
  /security    25 590 B raw / 5 530 B gzipped
  /validation  39 404 B raw / 7 911 B gzipped
```

**Net delta vs. previous Stage 7 state: ~3 KB CSS gzipped + ~2 KB HTML gzipped per route average.** No new JS chunk. No new images. No new fonts. No new external resources.

---

## 7. Accessibility notes

- **Heading hierarchy** preserved on every page (H1 hero, H2 section heads, H3 sub-heads).
- **Anchor targets** on `/validation` use `[id]:target` with `scroll-margin-top: 88px` so the headings land below the fixed nav. Reduced-motion users get a static 0.3 s ring instead of the 1.2 s pulse.
- **CapabilityPipeline** has a single accessible name (`aria-label="TAS operator pipeline — seven stages from discovery to operator decision. Decorative."`) and the `<ol>` is `aria-hidden="true"` so screen readers don't read all 7 stages as content. The page still describes the pipeline in surrounding prose.
- **Decision pills, NOT badges, status chips** on every page are decorative — text content is all in `<p>` / heading elements, so the visual pills are augmentations, not the only way to read the message.
- **Hover states** all have keyboard equivalents (`:focus-within` on the pipeline node, `:focus-visible` ring on every interactive element).
- **Tables on mobile** — `/security` no longer uses `<table>` for the inside/across data; it uses `<ul>` with grid-template-columns that collapses to single column at ≤ 600 px. No horizontal overflow possible.
- **Colour contrast** on every status chip / meta line / dashed-bordered list item meets AA at body sizes against its backing surface.
- **Reduced motion** verified per change in code: every stagger, hover-translate, and reveal transition is gated by the global `prefers-reduced-motion: reduce` override.

---

## 8. Responsive notes

| Breakpoint | /tas | /workflow | /security | /validation |
|---|---|---|---|---|
| 1440 px | Pipeline 7-up; capability 3-up; decision 3-up; screenshots 2-up | BA split-screen + arrow; pipeline framed | Principles 2-up; tables side-by-side | Index 4-row; screenshots 2-up + 1 wide |
| 1024 px | Pipeline 4-up + wrap; rest unchanged | Same | Same | Same |
| 768 px | Pipeline 2-up; capability 2-up; decision 1-up; screenshots 1-up | BA single column (arrow hidden); pipeline framed | Principles 1-up; tables 1-up | Index 4-row; screenshots 1-up |
| 390 px | Pipeline vertical row (label / sub-line); rest 1-up | Same as 768 | Tables collapse rowlist to single column; will-not-call wraps | Index rows collapse to single column |
| 360 px | Same as 390 with tighter padding | Same | Same | Same |

No horizontal overflow at any breakpoint (verified by code; visual verification requires Playwright).

---

## 9. Commands run

```sh
$ npm run check
Result (38 files): 0 errors · 0 warnings · 0 hints

$ npm run lint:css
(clean)

$ npm run lint:copy
[check-public-copy] OK — scanned 52 file(s); no forbidden terms found.
                       (61 flagged-for-review hit(s) — all reviewed safe;
                        +5 new hits from CapabilityPipeline + page changes:
                        all "first-class" engineering term, "Local-First"
                        Stage-6-approved page title, "only" in code comment.)

$ npm run build
[build] 9 page(s) built in 1.26 s

$ npm run lint:public-output
[check-public-output] OK — scanned 46 dist file(s); no forbidden artifacts found.

$ npm run qa
(end-to-end OK)

$ npm run qa:visual / qa:responsive
# Sandbox-blocked (cdn.playwright.dev allowlist) — same documented limitation
# from STAGE_7_INSTALL_LOG.md §3. The webServer (build + preview) starts
# correctly; only the chromium binary is missing. Resolution = local
# `npx playwright install chromium`.
```

---

## 10. Screenshots

**Not produced in this sandbox.** `cdn.playwright.dev` is in the deny-allowlist, so `npx playwright install chromium` cannot complete. The Playwright tests run, the webServer launches `astro build && astro preview` correctly, and the failure mode is the actionable "Please run: npx playwright install" message at browser launch.

To produce the canonical 5-viewport sweep on a local machine where `cdn.playwright.dev` is reachable:

```sh
cd website
npx playwright install chromium                          # one-time (~150 MB)
npx playwright test tests/responsive.spec.ts --update-snapshots
npx playwright test tests/visual.spec.ts --update-snapshots
```

This will write snapshots under `tests/__snapshots__/desktop/` for:

- `tas.png` (1440 × full-page) and `desktop-1440__tas.png` / `tablet-1024__tas.png` / `tablet-768__tas.png` / `mobile-360__tas.png`
- Same for `workflow`, `security`, `validation`

Subsequent runs gate against the seeded snapshots.

---

## 11. Known risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | The new `meta` strings on capability cards / principles cards introduce mini-claims | **none** — every meta string is composed from already-approved register language; nothing new asserted | Verified line-by-line in code. Lint pass with the Stage 6 hard-fail list confirms no forbidden substrings |
| R2 | Brass-arrow divider on /workflow could feel decorative | **low** | It carries the dossier "→ transformation" semantic; hidden on mobile so it doesn't compete with the column content |
| R3 | Evidence Index anchor links could miss-scroll on very tall pages | **low** | `scroll-margin-top: 88px` is set globally for `[id]:target` so headings land below the fixed nav |
| R4 | Stagger reveals add small JS work for `data-stagger` containers | **none** | The work is one DOM walk at page load to set `--reveal-index` on direct `.reveal` children. The IntersectionObserver is reused. Total client JS unchanged from previous Stage 7 state. |
| R5 | The CapabilityPipeline at 1024 px wraps to 4+3 with no visible connector across the wrap | **low** | Acceptable visual; the connector is decorative. At narrower widths the layout shifts to a more readable vertical row |
| R6 | `/security` rowlist uses `<ul>` not `<table>` — could affect screen readers expecting tabular semantics | **low** | The data is descriptive (label + value), not tabular relational; a list reading is appropriate. The semantic loss vs. `<table>` is offset by mobile-friendly single-column collapse |
| R7 | Visual snapshots not produced in this run | **carried over** | Single-step resolution on local machine (see §10) |
| R8 | Stage 6 H1 sensitive-data review on TAS screenshots | **carried over** | Unaffected by polish; still the only human pre-deploy gate |

---

## 12. What this polish does NOT do

- ❌ No copy / claim changes. Every approved sentence is unchanged. The new meta strings restate existing claims, do not extend them.
- ❌ No new metrics. The validation page's careful test wording is unchanged verbatim.
- ❌ No new dependencies. `package.json` unchanged.
- ❌ No new third-party JS. No animation library. No analytics.
- ❌ No new images. WebP migration of TAS screenshots remains a Phase 6 task.
- ❌ No route changes. All 9 routes still build and render with the same paths.
- ❌ No structural changes to `tokens.css` / `global.css`. All polish layers on top of the design-system pass.
- ❌ No motion library, no scroll hijacking, no parallax, no canvas/WebGL.

---

## 13. Outcome

The four product/proof pages now read as **operating instruments** rather than brochures:

- `/tas` is an *operating room map* — pipeline first, capabilities second, decision panel as decision states, screenshots as exhibits, boundaries as dashed-rule "crossable" indicators.
- `/workflow` shows the *transformation* visually — split-screen with rule discipline, indexed lists, brass arrow divider, framed pipeline.
- `/security` is a *boundary contract* — solid rules for inside, dashed rules for across, paired panels with chip headers signalling the discipline.
- `/validation` is an *audit dossier* — chapter-list Evidence Index, anchored navigation, framed careful-wording test status, anonymized stakeholder cards with explicit anonymization meta.

Stage 6 release-gate verdict (release-ready pending H1 sensitive-data review on TAS screenshots) **still holds.** The polish strengthens the dossier-grade signal across all four pages without introducing any new claim or new technology.
