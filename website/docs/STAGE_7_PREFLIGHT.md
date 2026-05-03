# Stage 7 Preflight

Date: 2026-05-02
Site: kriseva.in
Build: Astro 4.16 + TypeScript static site under `website/`
Status entering Stage 7: **release-ready** (Stage 6 gate signed off; pending only the H1 sensitive-data review on TAS screenshots).

> **Stage 7 is not a rebuild.** It is a premium polish, interaction, responsiveness, and visual-QA pass on top of a passing build. The bar is "world-class craft" without redesign and without breaking any Stage 5 / Stage 6 gate.

---

## 1. Current site structure

### Repo layout entering Stage 7

```
/home/claude/repo
├── README.md
├── .git/              (single Stage-1 commit; Stage 2–6 work is uncommitted)
├── chats/             (16 transcript files — internal, never deployed)
├── project/           (Stage 1 design export — visual reference only)
│   ├── KRISEVA Founder.html         (preserved as reference; not in dist/)
│   ├── KRISEVA *.html               (reference prototypes)
│   ├── *.jsx, styles.css            (reference source)
│   ├── assets/                      (canonical asset source)
│   ├── _dev/, screenshots/, uploads/  (internal — never deployed)
├── docs/                            (repo-root strategy docs)
│   ├── STAGE_5_PREFLIGHT.md
│   ├── PUBLIC_CLAIMS_REGISTER.md
│   ├── STAGE_6_CLAIMS_AUDIT.md
│   └── STAGE_6_FINAL_RELEASE_GATE.md
└── website/                         (the production site)
    ├── package.json
    ├── astro.config.mjs
    ├── tsconfig.json
    ├── .gitignore
    ├── README.md
    ├── public/                      (static passthrough — assets, robots, sitemap)
    ├── src/
    │   ├── data/                    (5 .ts files)
    │   ├── styles/                  (tokens.css + global.css)
    │   ├── layouts/BaseLayout.astro
    │   ├── components/              (16 Astro components)
    │   └── pages/                   (9 Astro routes)
    ├── scripts/                     (check-public-copy + check-public-output)
    ├── docs/
    │   ├── STAGE_5_COMPLETION_REPORT.md
    │   └── STAGE_7_PREFLIGHT.md     ← this file
    └── dist/                        (build output, regenerated)
```

### Routes (9, all built and verified)

`/` · `/tas` · `/workflow` · `/security` · `/issuer-roadmap` · `/validation` · `/founder` · `/contact` · `/404`

### Page source line counts

```
631  src/pages/founder.astro          (largest — 5 sections + timeline + id-card)
366  src/pages/index.astro
296  src/pages/tas.astro
236  src/pages/validation.astro
233  src/pages/security.astro
199  src/pages/workflow.astro
175  src/pages/issuer-roadmap.astro
 77  src/pages/contact.astro
 42  src/pages/404.astro
2255 total
```

### Built dist footprint

```
dist/  total                 → 3.9 MB
dist/_astro/  CSS + JS       → 48 KB raw (5 chunks)
dist/assets/  static          → 3.6 MB (1.9 MB is screenshots; 1.7 MB is brand/motifs/photo)
9 HTML routes                → 14–35 KB each, all < 36 KB
```

---

## 2. Current component inventory

16 Astro components under `src/components/`. Listed with line count, surface, and presence of scoped style / global style / inline script:

| # | Component | Lines | Has scoped `<style>` | Has `<style is:global>` | Has inline `<script>` |
|---|---|---|---|---|---|
| 1 | `Header.astro` | 135 | ✓ | — | ✓ (mobile-nav toggle) |
| 2 | `Footer.astro` | 117 | ✓ | — | — |
| 3 | `BaseLayout.astro` *(in `layouts/`)* | 101 | — | — | ✓ (scroll reveal observer) |
| 4 | `ContactIntentPanel.astro` | 261 | ✓ | — | ✓ (mailto compose + intent pre-select) |
| 5 | `RouteHero.astro` | 85 | ✓ | — | — |
| 6 | `Footer.astro` shared lockup | (above) | ✓ | — | — |
| 7 | `FounderCTA.astro` | 69 | ✓ | — | — |
| 8 | `DossierCard.astro` | 69 | ✓ | — | — |
| 9 | `EvidenceCard.astro` | 73 | ✓ | — | — |
| 10 | `ProductScreenshotFrame.astro` | 82 | ✓ | — | — |
| 11 | `ProofStrip.astro` | 74 | ✓ | — | — |
| 12 | `TenderBundleDiagram.astro` | 38 | ✓ | — | — |
| 13 | `SecurityBoundaryDiagram.astro` | 36 | ✓ | — | — |
| 14 | `ComplianceMatrixPreview.astro` | 99 | ✓ | — | — |
| 15 | `DecisionPill.astro` | 36 | ✓ | — | — |
| 16 | `PrimaryButton.astro` | 59 | ✓ | ✓ (`.btn` family — global on purpose) | — |
| 17 | `SectionLabel.astro` | 26 | ✓ | ✓ (`.section-label` — global on purpose) | — |
| 18 | `SecondaryButton.astro` | 15 | — | — (delegates to `PrimaryButton`'s global `.btn`) | — |

**Inline-style audit** (number of `style="..."` attributes per page — a polish target, not a defect):

| Page | Inline styles |
|---|---|
| `founder.astro` | 11 |
| `validation.astro` | 11 |
| `security.astro` | 10 |
| `tas.astro` | 8 |
| `issuer-roadmap.astro` | 8 |
| `workflow.astro` | 4 |
| `contact.astro` | 3 |
| `index.astro` | 2 |
| `404.astro` | 0 |
| **total** | **57** |

These are mostly carry-over from the JSX prototype (one-shot `font-family: var(--font-mono); font-size: 0.66rem; …` blocks on labels and meta lines). Stage 7 is a good moment to consolidate the most repeated patterns into 2–3 utility classes.

---

## 3. Current CSS architecture

### Files

```
src/styles/tokens.css   67 lines   — design tokens only
src/styles/global.css  158 lines   — reset, typography, container, section, skip-link, focus, reveal, card, table
                       ──── ─────
                       225 lines total
```

Plus per-component scoped `<style>` blocks (Astro's default scoping) in 15 / 16 components.

### Tokens

- **Palette** — navy (3 shades), brass (4 alpha levels), paper (3 shades), ink, slate, muted, decision-bid/review/skip.
- **Typography** — `--font-serif` (Libre Baskerville → Georgia fallback), `--font-sans` (Inter → system stack), `--font-mono` (JetBrains Mono → IBM Plex Mono → SFMono).
- **Spacing** — single `--gutter` (32 / 18 px) and `--section-y` (96 / 56 px).
- **Surface** — `--hairline`, `--hairline-soft`, `--border-paper`, `--shadow-depth`, `--shadow-lift`.
- **Radii** — `--radius-badge: 4`, `--radius-control: 6`, `--radius-panel: 8`.
- **Motion** — `--micro: 140 ms ease-out`, `--section-ease: 420 ms cubic-bezier(.2,.7,.2,1)`.
- **Layout** — `--max-w: 1200 px`.

### Reduced-motion handling

Three layers, all wired:

1. `global.css:9` — global override that dampens any `animation-duration` / `transition-duration` to 0.01 ms.
2. `global.css:124` — `.reveal` class skip when reduced motion is set.
3. `Header.astro:108` — nav-specific override.
4. `BaseLayout.astro:79` — `matchMedia('(prefers-reduced-motion: reduce)')` gate in the IntersectionObserver bootstrap (so observer never instantiates when motion is off).

### Global vs. scoped

- Scoped (Astro default): every component except `SecondaryButton.astro` (which delegates to `PrimaryButton`'s global `.btn` family).
- Global on purpose: `.btn`, `.btn--primary`, `.btn--sm`, `.btn--ghost-paper`, `.section-label*`, the global `main { padding-top: 64px; }` spacer that lives on `Header.astro:113` so non-header pages still respect the fixed nav.

### Built CSS chunks (Stage 6 dist)

```
dist/_astro/contact.B2YKnAFe.css     5.7 KB   (route-level: contact form scoped CSS)
dist/_astro/contact._8NS0oaI.css     6.9 KB   (shared global.css + base reset)
dist/_astro/founder.CP2u2wMX.css    10.1 KB   (founder's heavy hero/timeline/id-card scoped CSS)
dist/_astro/index.C9TJ5f_X.css       4.2 KB   (homepage scoped CSS)
                                    ─────
                                    26.9 KB raw, ~7 KB gzipped
```

(The Vite chunk names are alphabetical by first-importing component, so `contact._8NS0oaI.css` is the shared chunk despite the misleading prefix.)

---

## 4. JS / island inventory

Three inline `<script>` blocks; no external runtime. Astro hoists them to `dist/_astro/hoisted.*.js`.

| # | Source | Size (raw) | Job |
|---|---|---|---|
| 1 | `BaseLayout.astro:77–99` | 896 B | IntersectionObserver-driven scroll reveal, with `prefers-reduced-motion` gate. Adds `.is-visible` to elements with `.reveal`. |
| 2 | `Header.astro:118–135` | 701 B | Mobile-nav toggle: clicks the hamburger, toggles `.is-open`, syncs `aria-expanded` and `☰` / `✕` glyph. Closes drawer on link click. |
| 3 | `ContactIntentPanel.astro` (script tail) | 1 732 B | Reads `?intent=…`, pre-selects the matching radio. Intercepts form submit, composes `mailto:` URL with all fields URL-encoded, navigates to it. **Never simulates a backend success state.** |
| **Total** | **raw** | **~3.3 KB** | — |

Built (minified + gzip):

```
dist/_astro/hoisted.DWycwKQa.js   881 B raw  /  ~0.6 KB gzipped
dist/_astro/hoisted.XdaRicZw.js   908 B raw  /  ~0.5 KB gzipped
                                  ─────
                                ~1.78 KB raw / ~1.1 KB gzipped total
```

No JS framework runtime. No tracking. No analytics. No third-party JS at all.

---

## 5. Current QA command result

Run at `cd /home/claude/repo/website` on 2026-05-02.

### `npm run qa`

```
> kriseva-website@1.0.0 lint:copy
[check-public-copy] OK — scanned 50 file(s); no forbidden terms found.
                       (48 flagged-for-review hit(s) above — verify each manually)

> kriseva-website@1.0.0 build
[build] 9 page(s) built in 2.56s
[build] Complete!

> kriseva-website@1.0.0 lint:public-output
[check-public-output] OK — scanned 42 dist file(s); no forbidden artifacts found.
```

All four QA gates green. Stage 7 entry conditions satisfied.

---

## 6. High-risk files NOT to touch casually

Touching these without follow-up gate verification can break a Stage 5 / Stage 6 sign-off.

| Path | Why high-risk |
|---|---|
| `src/data/site.ts`, `src/data/claims.ts`, `src/data/publicClaims.ts` | Single sources of truth for every public claim. Editing wording = re-running the Stage 6 audit. |
| `src/data/routes.ts`, `src/data/navigation.ts` | Route table + header/footer; renaming a route silently breaks the dist guard's reference HTML deny list and SEO sitemap. |
| `src/layouts/BaseLayout.astro` | Defines `<title>` formatting, canonical URL builder, OG/Twitter meta, the global scroll-reveal observer. SEO + a11y depend on this; any change must pass the Stage 6 gate `Page-positioning verification` (§7 of the gate report). |
| `src/components/Header.astro` | Fixed-nav z-index + the `:global(main) { padding-top: 64px; }` rule live here. Removing the global rule shifts every page hero behind the nav. |
| `src/components/PrimaryButton.astro` | Owns the global `.btn` family used by every CTA on every page. Editing `.btn` rules ripples everywhere. |
| `src/components/ContactIntentPanel.astro` | The mailto compose script. Any change must preserve "submitting opens your mail app — nothing is sent" guarantee. |
| `src/components/FounderCTA.astro` | Renders the three primary CTAs (`Contact Founder` / `Book Demo` / `Join Pilot`). Surfaces on every page bottom; CTA href changes break the Stage 6 §7 verification. |
| `scripts/check-public-copy.mjs` | Lint authority for hard-fail and flagged terms. Removing a term = lowering the bar. |
| `scripts/check-public-output.mjs` | Dist guard. Removing a path/extension/content rule = lowering the bar. |
| `astro.config.mjs` | `format: 'directory'` + `trailingSlash: 'ignore'` + `compressHTML: true` are load-bearing for SEO meta and dist size. |
| `public/assets/brand/kriseva-og.svg` | Patched in Stage 5 (legacy `kriseva.ai` → `kriseva.in`; "ARTIFICIAL INTELLIGENCE" → "PROCUREMENT INTELLIGENCE"). Re-importing the unpatched original would re-introduce a hard-fail lint failure. |
| `public/assets/screenshots/*.png` | The pre-deploy H1 gate (founder sensitive-data review) hangs off these. Replacing or re-cropping requires a fresh review. |

---

## 7. Recommended polish areas

Pre-research only — concrete proposals belong in `STAGE_7_POLISH_PLAN.md`. Each area lists the polish opportunity and what it must NOT do.

### A. Visual rhythm & typography

- Tighten section-rhythm at 1024–1280 px breakpoint (where `--section-y: 96px` reads slightly stiff).
- Auditing serif headline tracking (negative letter-spacing on H1) for parity across breakpoints.
- Optional: dropcap or first-line accent on the homepage thesis paragraph (paper section).
- **Must not** alter approved headline / body claim wording.

### B. Motion polish

- Refine the IntersectionObserver pattern: stagger reveal of grid children for slightly more cinematic flow on TAS / workflow / founder pages.
- Add a single-pulse highlight (no loop) on the BID/REVIEW/SKIP pills when the decision section enters viewport.
- Add an underline-on-hover micro for header nav links (currently only color shift).
- Honour `prefers-reduced-motion` end-to-end; fall back to instant-visible.
- **Must not** add scroll-jacking, parallax beyond 10 px, or any continuous decorative animation.

### C. Interaction polish

- Header nav: add subtle `box-shadow` on scroll past 16 px (visual depth cue).
- Buttons: hover shadow + 1 px translate-y (already half-implemented in `PrimaryButton`).
- Cards (`DossierCard`, `EvidenceCard`): tighten the existing `transform: translateY(-2px)` micro and make hairline brighter on hover.
- Anchor-target highlight: when a same-page link lands the user at a section, briefly ring the section heading.
- **Must not** introduce any pointer-trapping or hover-only-revealed content.

### D. Responsive QA

- Reverify at 360 / 390 / 768 / 1024 / 1440 px — currently passes Stage 6 visual checks but the founder hero id-card and validation `.val-shots` 5th-screenshot wide span want a closer eye at 1024 px (the wide screenshot can crowd siblings).
- Add an explicit 1280 px breakpoint where appropriate to avoid the "tablet-size desktop" middle ground.
- Tighten the grid breakdown of `principles-grid` (founder operating principles) at 980 px.
- **Must not** introduce horizontal overflow at any breakpoint.

### E. Image hygiene

- Convert the 6 TAS screenshot PNGs to `.webp` (≈ 70 % size cut from current 1.9 MB). Provide PNG fallback via `<picture>`.
- Add explicit `width`/`height` attrs everywhere they are still missing (most images already carry them).
- Consider lazy-loading the founder portrait below the fold on small screens.
- **Must not** alter any "seeded demo data" disclosure text.

### F. CSS consolidation

- Migrate the 57 inline `style="font-family: var(--font-mono); font-size: 0.66rem; …"` patterns into 2–3 utility classes (`.meta-mono`, `.eyebrow-mono`, `.discipline-line`).
- Move repeated section-labelled flex header (e.g. `display:flex; justify-content:space-between; flex-wrap:wrap; gap:16px;`) into a `.section-bar` helper.
- **Must not** change rendered output. CSS consolidation is a refactor, not a redesign.

### G. Accessibility polish

- Add `aria-current="page"` already on header nav links — verified present.
- Tabindex audit on the contact form intent radio group (currently radios receive focus but the `<label>` rows don't show a visible focus indicator; styles need a `:focus-within` ring on `.contact-form__intent-row`).
- Verify `role="img"` + accessible name on the brand SVG mark in header.
- Optional: skip-to-section landmarks on long pages (founder, TAS) — `<nav aria-label="On this page">` with anchors.
- **Must not** remove or change any existing ARIA attribute without verification.

### H. Performance polish

- Set `font-display: swap` (already on; verify it is via the Google Fonts URL — yes, `&display=swap` is set on the link).
- Preload the LCP image where applicable (homepage TAS screenshot is the most likely LCP at desktop).
- Consider a single hairline divider component to replace the in-page `<div class="footer__rule">` / `<hr class="hairline">` patterns.
- Add `Cache-Control` recommendations to `STAGE_7_POLISH_PLAN.md` for the eventual hosting layer.
- **Must not** add a third-party script, analytics, font self-host without license review, or break the static-only output.

### I. SEO + sharing

- Generate a PNG fallback for `kriseva-og.svg` (Twitter and many LinkedIn previews don't render SVG OG cards). 1200 × 630 PNG.
- Verify the OG title/description per route reads cleanly when the brand is appended ("Founder — KRISEVA AI").
- Optional: per-route `og:image` if there's a strong page-specific motif (e.g. local-first boundary on `/security`). Default keeps the brand OG.
- **Must not** add Twitter / LinkedIn / Facebook tracking pixels or Open Graph fields beyond standard meta.

### J. Verification & proof surfaces

- Validation page: improve the visual hierarchy of the synthetic-data disclosure across screenshots (currently lives in figcaption; could be a per-frame badge for stronger signal).
- Issuer roadmap: tighten the visual link between the status banner and the capability sketches grid.
- Founder timeline: very lightly improve the rail line so it looks more like a dossier index than a UI list.
- **Must not** alter the test-count careful sentence on `/validation` or any approved Tier-2 wording.

---

## 8. Non-negotiable guardrails

These are inherited from Stage 5 + Stage 6. Stage 7 inherits all of them and adds none. Any Stage 7 change that violates a guardrail is rolled back.

### Routes

- All 9 routes must continue to exist and render: `/`, `/tas`, `/workflow`, `/security`, `/issuer-roadmap`, `/validation`, `/founder`, `/contact`, `/404`.

### Claim safety

- Every claim on every public surface must trace back to a row in `docs/PUBLIC_CLAIMS_REGISTER.md`.
- No new claim may be introduced without a corresponding register row.
- Test-count careful wording on `/validation` is locked verbatim.
- Tier-1 named validation is reserved; Tier-2 anonymized wording is the only permitted form for stakeholder findings.
- Founder story copy is locked verbatim per Stage 6 brief.

### Lint gates

- `npm run lint:copy` must exit 0 (hard-fail). Flagged-for-review warnings are acceptable; new ones must be reviewed in `STAGE_6_CLAIMS_AUDIT.md` before merge.
- `npm run lint:public-output` must exit 0.
- `npm run build` must complete with 9 routes.
- `npm run qa` (the chained gate) must exit 0.

### CTA behaviour

- `Contact Founder` → `/contact`
- `Book Demo` → `/contact?intent=demo`
- `Join Pilot` → `/contact?intent=pilot`
- All three appear above the fold on the homepage.
- Contact form opens a `mailto:` draft and never simulates a server-side submission.

### Positioning

- TAS is the primary product, bidder-side, in pilot / demo evaluation, not production SaaS.
- Issuer-side procurement intelligence is roadmap / validation / pilot exploration.
- "KRISEVA AI builds procurement intelligence systems for India's defense ecosystem." remains the canonical positioning sentence.

### Forbidden in public output

- No pricing page, no pricing language.
- No WhatsApp CTA.
- No agency-endorsement language (DRDO / DRDL / CRPF / Indian Army / any defense PSU).
- No fixed-percentage performance claims.
- No absolute-security framing (no air-gapped / military-grade / zero-risk language).
- No `kriseva.ai` reference.
- No "Tender Advisory System" wording.
- No Claude Design bundler artifacts (`Unpacking`, `__bundler*`, `text/babel`, `unpkg.com/@babel/standalone`).
- No internal TAS app routes.

### Performance & technology

- Static output only; no SSR, no server adapter.
- No external runtime CDN dependency for core rendering. (Google Fonts CSS via `<link>` is the only external resource and the page renders cleanly with system-font fallbacks if it fails.)
- Total client JS must stay under ~5 KB gzipped.
- `prefers-reduced-motion` must be respected at every animation.
- Core content must remain statically rendered. Anything new must work without JavaScript.
- No analytics / trackers / consent banners are added in Stage 7. (None are present today.)

### Hygiene

- `dist/` must contain zero reference design HTML, zero `_dev` / `chats` / `uploads` paths, zero `.pdf` / `.docx` / `.zip` / `.mp4` / `.mov`, zero standalone `KRISEVA Founder.html`.
- TAS screenshot disclosures ("seeded demo data") on every embed are locked.

---

## 9. Outcome of preflight

- Repo state captured; Stage 7 may begin once the polish plan is drafted (`STAGE_7_POLISH_PLAN.md`).
- No package installations, no source edits, no copy edits performed in this preflight.
- The next step is the polish plan: a tightly scoped checklist that picks specific tasks from §7 (recommended polish areas) and binds each to the guardrails in §8.

A Stage 7 task is acceptable to start only when:
1. It maps to a §7 area.
2. It has no §8 guardrail conflict.
3. It is small enough to verify with `npm run qa` plus a manual visual review at 360 / 768 / 1024 / 1440 px.
4. It does not touch a §6 high-risk file unless the change is explicitly scoped and gate-verified afterwards.
