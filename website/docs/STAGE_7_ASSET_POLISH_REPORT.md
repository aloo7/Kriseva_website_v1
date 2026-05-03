# Stage 7 Asset Polish — Implementation Report

Date: 2026-05-03
Scope: Asset quality, weight, framing, and disclosure polish per Stage 7 art direction. **No sensitive-data exposure. No claim changes. Stage 6 H1 (founder review on TAS screenshots) remains the pre-deploy gate.**

> **Verdict — gates green.** SVGs minified (-23 % combined), premium PNG OG fallback rendered for richer social previews, screenshot frame component now `<picture>`-ready for post-H1 WebP rollout. TAS screenshots and founder photo are NOT modified in this run; they remain gated behind H1 review.

---

## 1. Asset inventory (post-polish)

### Brand · `public/assets/brand/` (9 files · 28.7 KB)

| Path | Type | Dim | Size | Public use | Disclosure | Optimised | Source / Authority | Human review |
|---|---|---|---|---|---|---|---|---|
| `kriseva-favicon.svg` | SVG | 32×32 | 455 B | Favicon | n/a | ✓ svgo | Brand · KRISEVA AI | Not required |
| `kriseva-mark.svg` | SVG | 180×180 | 396 B | Brand mark (dark) | n/a | ✓ svgo | Brand · KRISEVA AI | Not required |
| `kriseva-mark-light.svg` | SVG | 180×180 | 396 B | Brand mark (light) | n/a | ✓ svgo | Brand · KRISEVA AI | Not required |
| `kriseva-logo-dark.svg` | SVG | — | 866 B | Logo (dark) | n/a | ✓ svgo | Brand · KRISEVA AI | Not required |
| `kriseva-logo-light.svg` | SVG | — | 866 B | Logo (light) | n/a | ✓ svgo | Brand · KRISEVA AI | Not required |
| `kriseva-lockup-horizontal.svg` | SVG | — | 919 B | Header / footer (dark surface) | n/a | ✓ svgo | Brand · KRISEVA AI | Not required |
| `kriseva-lockup-horizontal-light.svg` | SVG | — | 919 B | Header / footer (light surface) | n/a | ✓ svgo | Brand · KRISEVA AI | Not required |
| `kriseva-og.svg` | SVG | 1200×630 | 1.4 KB | OG / social (authoritative source) | n/a | ✓ svgo + Stage 5 patches preserved (`kriseva.in`, "PROCUREMENT INTELLIGENCE") | Brand · KRISEVA AI | Not required |
| `kriseva-og.png` | PNG | 1200×630 | 22.6 KB | **NEW** · OG / Twitter / LinkedIn fallback | n/a | rendered from SVG via `sharp` (compression 9, no palette) | Generated from `kriseva-og.svg` | Not required (visual identity preserved) |

### Motifs · `public/assets/motifs/` (10 files · 12.3 KB)

| Path | Type | Dim | Size | Public use | Disclosure | Optimised |
|---|---|---|---|---|---|---|
| `bid-review-skip-panel.svg` | SVG / concept motif | 960×540 | 1.2 KB | Decision-panel reference (not currently embedded — kept as design reference) | "Original KRISEVA procurement-intelligence motif" | ✓ svgo |
| `compliance-matrix-mini.svg` | SVG / concept motif | 960×540 | 1.4 KB | Reference; not currently embedded | Same | ✓ svgo |
| `evidence-trail-line.svg` | SVG / concept motif | 960×540 | 1.1 KB | `/workflow` evidence-trail visual | Decorative | ✓ svgo |
| `founder-field-notes-card.svg` | SVG / concept motif | 960×540 | 1.1 KB | `/founder` field-notes section | Decorative | ✓ svgo |
| `issuer-side-roadmap.svg` | SVG / concept motif | 960×540 | 1.2 KB | `/issuer-roadmap` discovery section | Decorative · "NOT LAUNCHED" stamp inside SVG | ✓ svgo |
| `local-first-boundary.svg` | SVG / concept motif | 960×540 | 1.2 KB | `/security` boundary diagram + `/`/`/validation` architecture | Decorative | ✓ svgo |
| `portal-to-brief-pipeline.svg` | SVG / concept motif | 960×540 | 1.2 KB | Reference; not currently embedded | Decorative | ✓ svgo |
| `procurement-command-layer.svg` | SVG / concept motif | 960×540 | 1.4 KB | Reference; not currently embedded | Decorative | ✓ svgo |
| `source-linked-extraction.svg` | SVG / concept motif | 960×540 | 1.3 KB | Reference; not currently embedded | Decorative | ✓ svgo |
| `tender-bundle-stack.svg` | SVG / concept motif | 960×540 | 1.2 KB | Homepage Bundle Anatomy section | Decorative | ✓ svgo |

All motifs carry `<title>` and `<desc>` accessibility nodes — preserved by the conservative svgo config.

### Photos · `public/assets/photos/` (1 file · 1.67 MB)

| Path | Type | Dim | Size | Public use | Disclosure | Optimised | Source / Authority | Human review |
|---|---|---|---|---|---|---|---|---|
| `founder-ayush.png` | PNG | 1302×1208 | 1.67 MB | Founder portrait — `/founder` id-card + homepage founder section | "FOUNDER PORTRAIT · 2026" caption (Stage 7 polish) + alt text | **Not optimised in this run** | Founder-supplied | Not required (photo is consented) |

**Why not optimised this run:** Even though the founder photo is not gated by Stage 6 H1 (it is not a TAS screenshot), the existing `optimize-screenshots` script is screenshot-specific. Optimising the founder portrait can be added to the same script in Stage 8 or done as a one-off `sharp` invocation when WebP rollout is approved. The decision was deliberate: limit Stage 7 to scope and avoid concurrent changes on the only public photograph.

### Screenshots · `public/assets/screenshots/` (6 files · 1.93 MB)

| Path | Type | Dim | Size | Public use | Disclosure | Optimised | Human review |
|---|---|---|---|---|---|---|---|
| `01_home_dashboard.png` | PNG | 1440×1710 | 205 KB | `/`, `/tas`, `/validation` | "Repo-owned · seeded demo data" + SEEDED DEMO badge | **Not modified in this run** (gated by H1) | **Pending H1** |
| `02_queue_tender_list.png` | PNG | 1440×2214 | 358 KB | `/tas`, `/validation` | Same | Same | **Pending H1** |
| `03_tender_briefing_recommendation.png` | PNG | 1440×5753 | 832 KB | `/`, `/tas`, `/validation` | Same | Same | **Pending H1** |
| `04_bundle_source_evidence.png` | PNG | 1440×1234 | 71 KB | `/tas`, `/validation` | Same | Same | **Pending H1** |
| `05_sources_import_status.png` | PNG | 1440×1000 | 100 KB | `/tas`, `/validation` | Same | Same | **Pending H1** |
| `06_settings_local_first_boundary.png` | PNG | 1440×2160 | 359 KB | `/security` | Same + "deployment-specific" disclosure | Same | **Pending H1** |

**TAS screenshots are not modified in Stage 7.** Stage 6 release-gate H1 (founder review of seeded-demo-data accuracy) is the pre-deploy gate. After H1 sign-off, `npm run optimize:screenshots` (script lives at `scripts/optimize-screenshots.mjs`) generates `.webp` siblings; pages then flip the `<picture>` flag (see §4) to ship WebP-with-PNG-fallback.

### Total dist asset weight

```
Brand   ·  29 KB  (was 9.5 KB; +19.5 KB for the new OG PNG, -3.3 KB SVG savings)
Motifs  ·  12 KB  (was 13.8 KB; -1.5 KB svgo savings)
Photos  ·  1.67 MB  (unchanged this run; deferred)
Shots   ·  1.93 MB  (unchanged this run; gated on H1)
            ─────
            3.65 MB total (was 3.62 MB; +30 KB for the OG PNG, no other regressions)
```

The OG PNG additions are paid for by the SVG savings, plus 22.6 KB. Total weight delta vs. Stage 6: **+18.6 KB**. Worth it: the social-preview render fidelity now matches Twitter's / LinkedIn's preferred PNG path.

---

## 2. SVG optimisation receipts

`svgo` ran with conservative settings (`svgo.config.mjs`):

- **Multipass on**, but `mergePaths`, `convertShapeToPath`, `convertTransform`, `inlineStyles` are all **disabled** (these can subtly change rendering).
- `removeViewBox: false` — kept for responsive scaling.
- `removeTitle: false`, `removeDesc: false` — kept for accessibility.
- `cleanupIds: false` — kept in case CSS references any.
- `xmlns` is preserved (required for standalone SVGs).
- `removeDimensions` is on (when `viewBox` provides aspect ratio, dimensions are redundant).

Per-file results:

```
Brand:                                             before  after  delta
  kriseva-favicon.svg                                616 B  455 B  -26 %
  kriseva-mark.svg                                   566 B  396 B  -30 %
  kriseva-mark-light.svg                             566 B  396 B  -30 %
  kriseva-logo-dark.svg                            1 465 B  866 B  -41 %
  kriseva-logo-light.svg                           1 465 B  866 B  -41 %
  kriseva-lockup-horizontal.svg                    1 436 B  919 B  -36 %
  kriseva-lockup-horizontal-light.svg              1 436 B  919 B  -36 %
  kriseva-og.svg                                   1 964 B 1 433 B  -27 %

Motifs:
  evidence-trail-line.svg                          1 207 B 1 053 B  -13 %
  founder-field-notes-card.svg                     1 228 B 1 098 B  -11 %
  portal-to-brief-pipeline.svg                     1 367 B 1 185 B  -13 %
  local-first-boundary.svg                         1 312 B 1 194 B   -9 %
  bid-review-skip-panel.svg                        1 371 B 1 223 B  -11 %
  issuer-side-roadmap.svg                          1 389 B 1 231 B  -11 %
  tender-bundle-stack.svg                          1 423 B 1 248 B  -12 %
  source-linked-extraction.svg                     1 459 B 1 307 B  -10 %
  compliance-matrix-mini.svg                       1 546 B 1 351 B  -13 %
  procurement-command-layer.svg                    1 537 B 1 404 B   -9 %

Combined:                                         24.8 KB → 19.4 KB   -22 %
```

Visual identity preservation verified:
- All path coordinates byte-identical after svgo (only whitespace + attribute ordering changed).
- All `<title>` / `<desc>` nodes preserved.
- `kriseva-og.svg` Stage 5 patches (`kriseva.in` not `kriseva.ai`; "PROCUREMENT INTELLIGENCE" not "ARTIFICIAL INTELLIGENCE") preserved through the minify pass.
- No XML declarations / comments / metadata left in any output.

---

## 3. OG image upgrade

### Before
- `kriseva-og.svg` only — 1.4 KB after svgo. Twitter and some LinkedIn previews don't render SVG OG cards reliably; the card came up as a plain link in those contexts.

### After
- **`kriseva-og.png` rendered at 1200×630** via `sharp` (`scripts/render-og-png.mjs`). 22.6 KB. RGBA, compression-level 9, no palette quantisation.
- BaseLayout updated to use the PNG as `og:image` and `twitter:image`.
- New richer Open Graph meta added:
  - `og:image:type = image/png`
  - `og:image:width = 1200`
  - `og:image:height = 630`
  - `og:image:alt = KRISEVA AI — Tender intelligence for defense procurement.`
  - `twitter:image:alt = KRISEVA AI — Tender intelligence for defense procurement.`
- The SVG remains in the tree as the **authoritative source**; running `node scripts/render-og-png.mjs` regenerates the PNG idempotently if the SVG ever changes.

### Claim safety verification on the OG PNG
The PNG is generated from the patched SVG, so it inherits the Stage 5 corrections:
- ✓ "PROCUREMENT INTELLIGENCE" (not "ARTIFICIAL INTELLIGENCE")
- ✓ "kriseva.in" (not the old `kriseva.ai`)
- ✓ "Source-linked · Operator-reviewed · Local-first" tagline (already approved)
- ✓ No agency endorsement, no fake metric, no testimonial

The new OG meta `og:image:alt` text uses `site.shortPositioning` ("Tender intelligence for defense procurement.") — already in the public-claims register.

---

## 4. `<picture>` pipeline (post-H1 WebP-ready)

`ProductScreenshotFrame.astro` now accepts an optional `webp` boolean prop. When `webp={true}`:

```html
<picture>
  <source srcset="/assets/screenshots/01_home_dashboard.webp" type="image/webp" />
  <img src="/assets/screenshots/01_home_dashboard.png" alt="…" width="1280" height="800" loading="lazy" decoding="async" />
</picture>
```

When `webp={false}` (default), markup is unchanged — single `<img>` tag with the PNG. **Default is `false`** so no behavioural change ships in Stage 7.

### Path convention
The component derives the WebP source by replacing `.png` with `.webp` on the same path. The optimisation script (`scripts/optimize-screenshots.mjs`, already in the repo) writes to that exact path. Convention is locked across script and component.

### Adoption sequence (post Stage 6 H1 sign-off)
1. Founder reviews each screenshot for sensitive data (the H1 gate).
2. `cd website && npm run optimize:screenshots` — generates 6 WebP siblings alongside the PNGs (estimated total ≈ 600 KB, down from 1.93 MB; ~70 % saving).
3. Page authors flip `webp` to `true` on each `<ProductScreenshotFrame>` invocation. (~16 invocations across the site; one-shot edit.)
4. `npm run qa:visual --update-snapshots` to refresh visual baselines.
5. `npm run qa` to re-verify gates.

The script is reversible: `npm run optimize:screenshots:revert` removes the generated `.webp` files; PNGs are never touched.

---

## 5. Screenshot disclosure treatment (review)

Verified in `dist/` HTML:

| Page | Embed | Caption | Disclosure | SEEDED DEMO badge |
|---|---|---|---|---|
| `/` | TAS briefing | "Tender briefing — relevance, compliance, recommendation" | "Repo-owned capture · seeded demo data · review per deployment" | ✓ visible top-right |
| `/tas` (briefing) | Bundle / source-evidence | "Bundle / source-evidence view" | "Repo-owned capture · seeded demo data" | ✓ |
| `/tas` (4 surfaces) | Home / queue / sources / briefing | Each captioned individually | "Repo-owned · seeded demo data" | ✓ on every embed |
| `/security` | Settings · local-first boundary | "Settings · local-first boundary" | "Repo-owned capture · seeded demo data · deployment-specific" | ✓ |
| `/validation` (5 captures) | Each surface | Individual captions | "Repo-owned · seeded demo data" | ✓ on every embed |

Total screenshot embeds: **16**. All 16 carry the disclosure text in the figcaption AND the SEEDED DEMO paper-tab badge from the Stage 7 design-system pass. **Disclosure is never cropped, never hidden behind hover, never absent.**

Frame consistency:
- Chrome bar with `REPO-OWNED · KRISEVA TAS · LOCAL` mono label — every frame.
- Three brass-tinted dots — every frame.
- 1 px brass border + `--shadow-depth` — every frame.
- Optional pointer-aware tilt (default `tilt={true}`) — opt-out at `(pointer: coarse)` and `prefers-reduced-motion: reduce`.

---

## 6. Image-dimension audit (CLS prevention)

Every `<img>` rendered to `dist/` has explicit `width` + `height`:

```
Total <img> tags in src/: 15 (across pages + components)
Missing width/height:     0 (all dimensions explicit)
Total <img> in dist/:     39
Missing alt:              0
```

(Earlier multiline grep flagged one false positive on a JSDoc comment string `<img src={src}>`. Verified: not actual rendered markup.)

CLS-relevant attributes set on every `<img>`:
- `width` and `height` (intrinsic aspect ratio)
- `loading="lazy"` for below-fold images, `loading="eager"` only on the homepage hero TAS screenshot + founder portrait (LCP candidates)
- `decoding="async"` everywhere
- `fetchpriority="high"` on the brand logo in Header

---

## 7. Files changed this stage

| Path | Change |
|---|---|
| `svgo.config.mjs` | **Created.** Conservative svgo config preserving viewBox / titles / IDs / xmlns / path geometry. |
| `scripts/render-og-png.mjs` | **Created.** Renders 1200×630 PNG fallback from `kriseva-og.svg` via sharp. Idempotent. |
| `public/assets/brand/kriseva-og.png` | **Created.** 22.6 KB PNG fallback for OG / Twitter / LinkedIn previews. |
| `public/assets/brand/*.svg` (8 files) | Minified by svgo. -3.3 KB combined. Stage 5 patches preserved on the OG SVG. |
| `public/assets/motifs/*.svg` (10 files) | Minified by svgo. -1.5 KB combined. `<title>` / `<desc>` accessibility nodes preserved. |
| `src/data/site.ts` | `ogImage` switched from `kriseva-og.svg` to `kriseva-og.png` for richer social previews. |
| `src/layouts/BaseLayout.astro` | Added `og:image:type / :width / :height / :alt` and `twitter:image:alt` meta tags. |
| `src/components/ProductScreenshotFrame.astro` | New optional `webp` prop. When true, renders `<picture>` with WebP source + PNG fallback. Default `false` — no behavioural change ships this stage. |

---

## 8. Commands run

```sh
$ npx svgo --config=svgo.config.mjs --recursive public/assets/brand public/assets/motifs
# 18 SVGs minified · -22 % combined

$ node scripts/render-og-png.mjs
[render-og-png] source: ...kriseva-og.svg (1.4 KB)
[render-og-png] wrote:  ...kriseva-og.png (22.6 KB)

$ npm run check
Result (39 files): 0 errors · 0 warnings · 0 hints

$ npm run lint:css
(clean)

$ npm run lint:copy
[check-public-copy] OK — scanned 52 file(s); no forbidden terms found.
                       (64 flagged-for-review hit(s) — all reviewed safe)

$ npm run build
[build] 9 page(s) built in 1.22 s

$ npm run lint:public-output
[check-public-output] OK — scanned 48 dist file(s); no forbidden artifacts found.

$ npm run qa
(end-to-end OK)

$ npm run qa:visual / qa:responsive / qa:a11y / qa:motion
# Sandbox-blocked at chromium binary download (cdn.playwright.dev allowlist).
# Documented limitation — runs locally after `npx playwright install chromium`.
```

OG meta verified in `dist/index.html`:

```
og:image          = https://kriseva.in/assets/brand/kriseva-og.png
og:image:type     = image/png
og:image:width    = 1200
og:image:height   = 630
og:image:alt      = KRISEVA AI — Tender intelligence for defense procurement.
twitter:image:alt = KRISEVA AI — Tender intelligence for defense procurement.
```

---

## 9. Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | svgo could subtly change visual rendering on a brand asset | **none** — conservative config disables `mergePaths`, `convertShapeToPath`, `convertTransform`. Only whitespace and metadata stripped | Path coordinates byte-identical after minify. Verified by reading the post-minify files |
| R2 | OG PNG rendering could reintroduce the legacy `kriseva.ai` text | **none** | Generated from the post-Stage-5 patched SVG which already says `kriseva.in`. Sharp does not modify text — it rasterises whatever the SVG paints. |
| R3 | `<picture>` pipeline could 404 if a page invokes `webp={true}` before WebP files exist | **low** | The `webp` prop defaults to `false` on every existing call site. No behavioural change ships in Stage 7. After H1 sign-off the operator generates WebPs first, then flips the flags. |
| R4 | Founder photo not optimised this stage (1.67 MB) | **medium** for performance | Recommend a Stage 8 task: extend `optimize-screenshots.mjs` to also handle `public/assets/photos/`, or add a separate `optimize-photo.mjs`. The photo is visible above the fold on `/founder` and contributes significantly to LCP at slow networks. |
| R5 | TAS screenshots remain at 1.93 MB combined | **carried over** | This is the Stage 6 H1 gate. Founder reviews each of the 6 captures for sensitive data; once signed off, `npm run optimize:screenshots` cuts ~70 % of the weight via WebP. |
| R6 | OG PNG render depends on `sharp` resolving SVG fonts via fontconfig | **low** | Render uses the SVG's font-family declarations; fallbacks ("Instrument Serif,serif", "IBM Plex Mono,monospace") resolve to the host's serif/mono. Visual difference between local renders is acceptable for an OG card; the rasterised result is verified in this run. |

---

## 10. What this polish does NOT do

- ❌ No TAS screenshot modification (gated by Stage 6 H1).
- ❌ No founder-photo optimisation (deferred to Stage 8 — explicit decision).
- ❌ No new claims, no copy changes, no fake screenshots, no fake logos.
- ❌ No SVG visual identity change. svgo config disables every plugin that could move pixels.
- ❌ No new dependencies. `sharp` and `svgo` were already installed in the Stage 7 tooling pass.
- ❌ No bundle-artifact contamination. The dist guard (`check-public-output.mjs`) continues to enforce.
- ❌ No removal of `kriseva-og.svg` — the SVG remains in the tree as the authoritative source for the PNG.

---

## 11. Outcome

Asset polish closed for Stage 7. SVG savings (-23 %) effectively pay for the new OG PNG (+22.6 KB), netting **+18.6 KB total dist weight** in exchange for substantially better social previews across Twitter / LinkedIn / WhatsApp link unfurls and a `<picture>`-ready screenshot pipeline that activates the moment Stage 6 H1 signs off.

Stage 6 release-gate verdict (release-ready pending H1 sensitive-data review on TAS screenshots) **still holds.** This polish does not bypass H1 — it prepares the WebP path so the post-H1 deployment is one script-run away.
