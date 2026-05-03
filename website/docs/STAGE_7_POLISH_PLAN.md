# Stage 7 Polish Plan

Date: 2026-05-02
Site: kriseva.in
Source: `website/docs/STAGE_7_PREFLIGHT.md`

This is the working checklist for Stage 7. Each task is small, scoped, and gate-verified. Stage 7 is a polish pass — premium craft, not redesign. Every task obeys the **non-negotiable guardrails** in §8 of the preflight.

---

## Working principles

- **Premium, not noisy.** Polish makes the site quieter, not louder.
- **One task at a time.** Each box ticks, then `npm run qa` runs, then the next.
- **No copy changes** beyond label-level refinements that preserve approved claims.
- **No new dependencies** without approval. Stage 7 should ship with the same `package.json` deps unless an explicit task adds one with a recorded reason.
- **Reduced motion is a release gate.** Every motion task gets a reduced-motion path verified before close.
- **Static-first.** Core content keeps rendering with JS off. Polish only enhances.

---

## Verification per task

For every task tick, run:

```sh
npm run qa
```

and a visual sweep at the four standard widths: **360 / 768 / 1024 / 1440 px**.

Close a task only if:
- `npm run qa` exits 0.
- No new `lint:copy` flagged-for-review hits, or — if there are — every new hit is documented in `docs/STAGE_6_CLAIMS_AUDIT.md` §7 with a "Safe — reason" verdict.
- Visual sweep shows no horizontal overflow at any of the four widths.
- `prefers-reduced-motion` reduced-motion preview confirms the motion is disabled or instantly-final.

---

## Phase 1 — Foundation polish

These run first because everything else builds on them.

### 1.1 CSS consolidation — extract repeated inline patterns into utilities

- [ ] Audit the 57 inline `style="..."` attributes across pages. Group by pattern: ~3 dominant clusters expected (mono-eyebrow label, dossier-meta line, section-bar flex container).
- [ ] Add the resulting utility classes to `src/styles/global.css` (3–5 classes max).
- [ ] Replace inline styles on the highest-traffic pages first: `index.astro`, `tas.astro`, `validation.astro`, `founder.astro`, `security.astro`.
- [ ] Verify no rendered-output changes via `npm run build && diff dist/_astro/*.css` snapshot.
- **Guardrail check:** no copy change; `npm run qa` clean.

### 1.2 Tokens — add missing semantic tokens

- [ ] `--space-section-tight: 64px` (used implicitly by `padding-top:80px;padding-bottom:88px;` on contact / field-notes / founder-cta).
- [ ] `--shadow-card-hover: 0 22px 60px rgba(3,10,20,0.28)` for the Phase-2 card-hover refinement.
- [ ] `--ring-brass: 0 0 0 3px rgba(193, 138, 62, 0.32)` for focus-within / anchor-target highlight.
- [ ] No palette changes. No new fonts.
- **Guardrail check:** `npm run qa` clean.

### 1.3 Reduced-motion path — single source

- [ ] Currently three places implement reduced-motion gating. Consolidate the prose in a single CSS comment block in `tokens.css` listing every gate so future polish doesn't drift.
- [ ] Add an end-to-end test note in `docs/STAGE_6_CLAIMS_AUDIT.md` §7 that reduced motion was verified at this stage.
- **Guardrail check:** observable reduced-motion behaviour unchanged.

---

## Phase 2 — Visual rhythm

### 2.1 Section rhythm at desktop

- [ ] Add a `--section-y` desktop-tight breakpoint at `min-width: 1024px and max-width: 1280px` if rhythm reads stiff (currently always 96 px on desktop).
- [ ] Target outcome: hero → next section → next section reads more cinematic, less stacked.
- [ ] Verify on `index.astro` and `tas.astro`.
- **Guardrail check:** no horizontal overflow; no copy change.

### 2.2 Headline tracking

- [ ] Add `letter-spacing: -0.01em` to `h1` and `h2` in `global.css` (serif heads only).
- [ ] Verify with the homepage hero ("A tender is not a PDF…") at 360 px and 1440 px.
- **Guardrail check:** approved wording untouched; visual delta only.

### 2.3 First-paragraph emphasis on `/`

- [ ] Add a subtle first-line accent (`::first-line { letter-spacing: 0.01em; color: var(--ink); }`) to the homepage problem-thesis paragraph (`.problem__lede`).
- [ ] Optional only — close as "skipped, design does not need it" if the visual delta isn't a clear improvement.
- **Guardrail check:** copy unchanged.

---

## Phase 3 — Motion polish

### 3.1 Stagger reveal for grid children

- [ ] Modify `BaseLayout.astro` scroll-reveal so when an element with `.reveal` is itself a grid (`.problem__grid`, `.tas-caps`, `.iss-grid`, `.founder-pri__grid`), its children animate in with a 40 ms stagger via `transition-delay: calc(var(--index) * 40ms)`.
- [ ] Implementation: walk children at observe-time, set `--index` on each via inline custom property; CSS picks up the delay.
- [ ] Verify reduced-motion path: no stagger, all visible immediately.
- **Guardrail check:** total client JS still < 5 KB gzipped.

### 3.2 Single-pulse highlight on decision pills

- [ ] When the decision section enters viewport on `index.astro` or `tas.astro`, `.decision-pill--bid`, `.decision-pill--review`, `.decision-pill--skip` get a single non-looping pulse (1.2 s, ease-out) on the pill border.
- [ ] No looped animation. No on-hover continuation.
- [ ] Verify reduced-motion path: pills stay static.

### 3.3 Header on-scroll depth cue

- [ ] When `window.scrollY > 16`, header gets `box-shadow: 0 8px 24px rgba(3,10,20,0.28)` and a slightly stronger `border-bottom`.
- [ ] Single throttled scroll listener (rAF-coalesced).
- [ ] Verify reduced-motion path: shadow appears instantly with no transition.

### 3.4 Anchor-target highlight

- [ ] When user clicks a same-page anchor (`#section`), the target heading briefly receives a brass left-rule (1.5 s ease-out, single pulse).
- [ ] CSS-only via `:target` selector; no JS needed.
- [ ] Verify reduced-motion path: rule appears statically for 0.3 s then fades.

---

## Phase 4 — Interaction polish

### 4.1 Buttons hover micro

- [ ] Standardize: every `.btn` hovers with `transform: translateY(-1px)` + `box-shadow: var(--shadow-lift)` for primary, lighter shadow for outline.
- [ ] Reduced-motion: shadow only, no translate.
- [ ] Verify both `.btn--primary`, `.btn--ghost-paper`, `.btn--sm` variants on every page that uses them.

### 4.2 Card hover refinement

- [ ] Tighten `.dossier-card`, `.principle-card`, `.tas-decision__cell`, `.cap-card` (where it exists) hover: existing `transform: translateY(-2px)` keeps; add `border-color` brightening to `var(--brass)` from current `rgba(193,138,62,0.45)`.
- [ ] Verify on `tas.astro` capabilities grid + `founder.astro` operating principles grid.

### 4.3 Header nav underline-on-hover

- [ ] Add a 1 px brass underline that grows from left on hover for desktop nav links. Mobile nav drawer keeps current behaviour (color shift only).
- [ ] Reduced-motion: solid underline appears instantly.

### 4.4 Form intent radio focus ring

- [ ] On `ContactIntentPanel.astro`, add `:focus-within` ring on `.contact-form__intent-row` so the entire labelled row glows when its radio is keyboard-focused.
- [ ] Verify with keyboard navigation only.

---

## Phase 5 — Responsive QA

### 5.1 Founder hero id-card at 1024 px

- [ ] Currently the id-card switches to single-column at 880 px. Verify 1024 px doesn't cramp the right column.
- [ ] If the id-card photo height (`280px`) feels heavy at 1024 px, tighten to a `clamp(220px, 22vw, 280px)`.

### 5.2 Validation page wide screenshot row

- [ ] On `validation.astro`, the 5th screenshot uses `.val-shots__wide` (`grid-column: 1 / -1`). At 1024 px this works; at 880–1023 px the surrounding row pairs may look slightly off-rhythm. Verify and tighten if needed.

### 5.3 Founder operating-principles grid at 980 px

- [ ] Currently `repeat(3, 1fr)` until 980 px, then 2 cols, then 1 col at 640 px. The 980 px breakpoint is correct; just confirm the 5th card doesn't orphan at 980–1100 px (5 cards in 3 cols leaves 2 cards in row 2).
- [ ] If orphan looks awkward, swap to a `flex-wrap` with `flex-grow` so the orphan row expands.

### 5.4 1280 px tablet-desktop middle ground

- [ ] Add a 1280 px breakpoint check on every page. Common slip: copy reads bigger than design intent because container hits `--max-w: 1200 px` early.
- [ ] No global change unless visible inconsistency exists.

---

## Phase 6 — Image hygiene

### 6.1 WebP conversion for TAS screenshots

- [ ] Convert the 6 PNGs in `public/assets/screenshots/` to WebP (target ~70 % size cut on the 1.9 MB total).
- [ ] Use `<picture>` with PNG fallback so the dist guard's PNG-presence check still passes.
- [ ] Update `ProductScreenshotFrame.astro` to accept either a single src (PNG) or a paired src (WebP + PNG fallback).
- [ ] Founder photo (`founder-ayush.png`) is small enough to leave as PNG.
- **Decision blocker:** does the build environment have `sharp` / `cwebp`? If neither, document the conversion as Stage 8 hosting-side and skip this task. Astro 4.16 ships with `sharp`; verify before starting.

### 6.2 LCP image preload on `/`

- [ ] Add `<link rel="preload" as="image" href="/assets/screenshots/03_tender_briefing_recommendation.png">` to `BaseLayout.astro` only when `Astro.url.pathname === '/'`.
- [ ] Verify First Contentful Paint and Largest Contentful Paint via `astro preview` + DevTools Performance.

### 6.3 Founder portrait priority hint

- [ ] Add `loading="eager"` and `fetchpriority="high"` to the founder portrait on `/founder` (above-the-fold).
- [ ] Already partially set; verify and tighten.

---

## Phase 7 — SEO + sharing polish

### 7.1 PNG OG fallback

- [ ] Generate a 1200 × 630 PNG version of `kriseva-og.svg` (Twitter and many LinkedIn previews don't render SVG OG).
- [ ] Save as `public/assets/brand/kriseva-og.png`.
- [ ] Switch `og:image` and `twitter:image` to the PNG.
- [ ] Keep the SVG for any future internal use.
- **Guardrail check:** no `kriseva.ai` text, no "ARTIFICIAL INTELLIGENCE" text — must mirror the Stage 5 patches.

### 7.2 Per-route OG image (optional)

- [ ] Skip unless time remains. If pursued: per-page `og:image` using a route-specific motif (e.g. local-first boundary on `/security`).
- [ ] Default OG keeps the brand card.

### 7.3 OG title format audit

- [ ] Currently: `Founder — KRISEVA AI`. Acceptable.
- [ ] Verify that the homepage (`/`) keeps the long-form title `KRISEVA AI — Procurement Intelligence for India's Defense Ecosystem` and does not double-append " — KRISEVA AI".
- [ ] BaseLayout already has the conditional; just spot-check the built output.

---

## Phase 8 — Verification & proof surface polish

### 8.1 Validation page synthetic-data badge

- [ ] On `validation.astro`, add a small per-frame "SEEDED DEMO" badge to the screenshot frame component (`ProductScreenshotFrame.astro`) so the disclosure is visible without reading the figcaption.
- [ ] Tier-2 wording in the figcaption stays.
- [ ] No copy change.

### 8.2 Issuer roadmap status banner emphasis

- [ ] Tighten the visual link between the status banner ("Issuer-side procurement intelligence is a roadmap direction…") and the capability sketches grid below it.
- [ ] Possible: add a brass left-rule on the status banner that visually points toward the next section.

### 8.3 Founder timeline rail polish

- [ ] Slightly tighten the timeline rail line so it reads as a dossier index. Currently a single 1 px line; consider a 1 px line + a 0.5 px brass dot pattern (CSS only).
- [ ] Reduced-motion: pattern stays static.

### 8.4 Compliance matrix preview row hover

- [ ] On `ComplianceMatrixPreview.astro`, add a subtle row-hover (background darkens 4 %) so the matrix feels like a real audit surface.
- [ ] Keyboard focus on the row should also trigger the hover state.

---

## Phase 9 — Performance / hosting prep

### 9.1 Cache-Control recommendations document

- [ ] Add `docs/STAGE_7_HOSTING_NOTES.md` with recommended `_headers` and `_redirects` rules for Cloudflare Pages or equivalent.
- [ ] Notes only; not deployed.

### 9.2 Self-hosted fonts (optional, Stage 8 candidate)

- [ ] Decision: stay on Google Fonts CDN with `&display=swap`, or self-host the three families (Libre Baskerville / Inter / JetBrains Mono).
- [ ] If self-hosting: verify the SIL Open Font License headers are preserved alongside the served files.
- [ ] Default for Stage 7: stay on CDN. Document the option only.

### 9.3 Final size budget audit

- [ ] After every Stage 7 task is closed, run a final budget pass:
   - Total JS shipped (gzipped) ≤ 5 KB
   - Total CSS shipped (gzipped) ≤ 12 KB
   - Largest single image ≤ 250 KB after WebP (currently 816 KB PNG)
- [ ] Record results in `STAGE_7_COMPLETION_REPORT.md` (to be created at end of Stage 7).

---

## Phase 10 — Closeout

### 10.1 Re-run Stage 6 gate verification

- [ ] After all Stage 7 tasks are closed, re-run every check from `docs/STAGE_6_FINAL_RELEASE_GATE.md` §6 + §7.
- [ ] Forbidden phrase scan: 31 / 31 still clean.
- [ ] Risky phrase review: every flagged hit accounted for.
- [ ] Page-positioning audit: every page still passes.
- [ ] Output hygiene: dist still clean.

### 10.2 Visual sweep at 360 / 768 / 1024 / 1440 px

- [ ] Manual sweep of every route at every breakpoint.
- [ ] Screenshot diff vs. Stage 6 baseline for sanity.

### 10.3 Reduced-motion sweep

- [ ] Toggle `prefers-reduced-motion` in DevTools and walk every route.
- [ ] Confirm every Stage 7 motion has an instant-final fallback.

### 10.4 Stage 7 completion report

- [ ] Create `docs/STAGE_7_COMPLETION_REPORT.md` with:
   - tasks closed (this checklist with ticked boxes)
   - performance budget results
   - visual-QA receipts
   - any task explicitly skipped, with reason
   - any new flagged-for-review hit and its verdict
   - readiness statement: "Stage 7 closed; site remains release-ready pending Stage 6 H1 founder sign-off."

---

## Tasks NOT in Stage 7 (deferred to Stage 8 or later)

These were considered and intentionally deferred:

| # | Task | Defer reason |
|---|---|---|
| D1 | Backend wiring for the contact form | Requires privacy policy + DPA review first. |
| D2 | Analytics / tracking | Requires consent-banner + privacy-policy work. None planned. |
| D3 | Multi-language support | Single-language (English) is the target. |
| D4 | Self-hosted fonts | Stays on Google CDN with `&display=swap` and strong system fallbacks. License-review work for Stage 8. |
| D5 | A formal visual-regression test suite (Playwright snapshot) | Stage 8 hosting/CI work. |
| D6 | New routes (e.g. blog, careers, press) | None requested. |
| D7 | Cookie banner / consent UX | Site collects no cookies. |
| D8 | CI/CD wiring (GitHub Actions, deploy hook) | Stage 8 hosting work. |
| D9 | Sensitive-data review on TAS screenshots | Founder gate, not engineering. (Stage 6 H1.) |

---

## Stage 7 entry conditions

Confirmed at preflight (`STAGE_7_PREFLIGHT.md` §5):

```
[check-public-copy]    OK · scanned 50 file(s) · 0 hard-fail · 48 flagged
[build]                OK · 9 page(s) built in 2.56 s
[check-public-output]  OK · scanned 42 dist file(s)
```

Stage 7 is cleared to begin once a single phase is selected. Recommended starting phase: **Phase 1 — Foundation polish** (CSS consolidation + tokens + reduced-motion documentation), because every later phase depends on it.

No package installations and no source edits are performed by the preflight or this plan. The next action is the user's decision to start Phase 1 or to reorder the phases.
