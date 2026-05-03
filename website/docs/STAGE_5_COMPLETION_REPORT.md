# Stage 5 Completion Report

Date: 2026-05-02
Site: kriseva.in
Scope: Production website build for KRISEVA AI.

---

## Outcome

Stage 5 is **complete and verified**. The production website is implemented as an Astro + TypeScript static site under `website/`, builds clean, and passes both lint gates plus an independent verification pass (see §13).

| Gate | Result |
|---|---|
| `npm run check` (TypeScript) | 0 errors · 0 warnings · 0 hints |
| `npm run lint:copy` (forbidden public terms) | 49 files scanned · OK |
| `npm run build` (Astro) | 9 pages built in ~1.2 s |
| `npm run lint:public-output` (dist guard) | 42 dist files scanned · OK |
| `npm run qa` (lint:copy → build → lint:public-output) | OK end-to-end |

---

## 1. Framework

- **Astro 4.16** + TypeScript (strict).
- Static output (`output: 'static'`), `format: 'directory'`, `trailingSlash: 'ignore'`, `compressHTML: true`.
- Zero JS by default; small island scripts only for the mobile-nav toggle, scroll reveal, and contact form mailto compose.
- Google Fonts via `<link>` (Libre Baskerville · Inter · JetBrains Mono) with strong system fallbacks declared in `tokens.css`. No font binaries shipped.

This decision honours `project/uploads/technical_stack_recommendation.md`: "Static or SSR site with minimal client JavaScript … semantic HTML, CSS variables, responsive images, reduced-motion support … avoid heavy animation libraries."

---

## 2. Routes (9)

| URL | Source | Built path |
|---|---|---|
| `/` | `src/pages/index.astro` | `dist/index.html` |
| `/tas` | `src/pages/tas.astro` | `dist/tas/index.html` |
| `/workflow` | `src/pages/workflow.astro` | `dist/workflow/index.html` |
| `/security` | `src/pages/security.astro` | `dist/security/index.html` |
| `/issuer-roadmap` | `src/pages/issuer-roadmap.astro` | `dist/issuer-roadmap/index.html` |
| `/validation` | `src/pages/validation.astro` | `dist/validation/index.html` |
| `/founder` | `src/pages/founder.astro` | `dist/founder/index.html` |
| `/contact` | `src/pages/contact.astro` | `dist/contact/index.html` |
| `/404` | `src/pages/404.astro` | `dist/404.html` |

The previous standalone `project/KRISEVA Founder.html` was migrated into `/founder`. The standalone file is preserved on disk as a reference artifact; it is **not** part of the build pipeline and **not** present in `dist/`.

---

## 3. Components (15)

All Astro components, located under `src/components/`:

- `Header.astro` — fixed nav, mobile hamburger toggle, brand → `/`, primary "Contact Founder" button.
- `Footer.astro` — three-column site map, contact column, legal disclaimer, copyright.
- `PrimaryButton.astro` — brass primary CTA. Used for Contact Founder, Book Demo, Compose Email.
- `SecondaryButton.astro` — outline CTA in two variants (`outline`, `ghost-paper`). Used for Book Demo, Join Pilot, page-level secondary navigation.
- `RouteHero.astro` — page hero with eyebrow / serif headline (HTML-aware via `set:html` so brass spans work) / subtitle / meta / CTA / aside slots.
- `SectionLabel.astro` — monospace section label, `brass` and `muted` tones, `paper`-section variant via global CSS.
- `DossierCard.astro` — labelled dossier card, `navy` and `paper` surfaces, with optional meta footer.
- `EvidenceCard.astro` — numbered pipeline step with rail dot and source-line citation.
- `TenderBundleDiagram.astro` — bundle motif (`tender-bundle-stack.svg`) framed for navy / paper surfaces.
- `ComplianceMatrixPreview.astro` — sample matrix table with five demonstrative rows and a reviewer caveat.
- `DecisionPill.astro` — BID / REVIEW / SKIP pill in two sizes, used inline and inside the matrix.
- `ProductScreenshotFrame.astro` — chrome-style frame with three dots, lazy-loaded image, caption + disclosure.
- `ProofStrip.astro` — auto-fit grid of label / body / meta items used on home + validation.
- `SecurityBoundaryDiagram.astro` — local-first boundary motif (`local-first-boundary.svg`) framed for the security page.
- `FounderCTA.astro` — closing CTA section with three buttons (Contact Founder / Book Demo / Join Pilot) + direct email line. Surface-aware (paper / navy).
- `ContactIntentPanel.astro` — radio intent selector (demo / pilot / issuer / partnership / other), full form, mailto-fallback compose handler, URL-param pre-selection (`?intent=demo|pilot|issuer|partnership`).

All components are pure HTML/CSS with scoped `<style>` blocks; only `Header`, `BaseLayout`, and `ContactIntentPanel` ship any JavaScript.

---

## 4. Asset List

All under `website/public/assets/`, copied from `project/assets/`. None of `project/_dev/`, `project/uploads/`, or `project/screenshots/` (dev QA dir) was included.

### Brand (8 SVG)
`kriseva-favicon.svg`, `kriseva-lockup-horizontal.svg`, `kriseva-lockup-horizontal-light.svg`, `kriseva-logo-dark.svg`, `kriseva-logo-light.svg`, `kriseva-mark.svg`, `kriseva-mark-light.svg`, `kriseva-og.svg`.

The OG SVG was edited in-tree to replace the legacy `kriseva.ai` line with `kriseva.in`, and the "Artificial Intelligence" expansion with "Procurement Intelligence" to match Stage-4 design direction.

### Motifs (10 SVG)
`tender-bundle-stack.svg`, `portal-to-brief-pipeline.svg`, `source-linked-extraction.svg`, `compliance-matrix-mini.svg`, `bid-review-skip-panel.svg`, `evidence-trail-line.svg`, `local-first-boundary.svg`, `issuer-side-roadmap.svg`, `procurement-command-layer.svg`, `founder-field-notes-card.svg`.

### Photos (1 PNG)
`founder-ayush.png`.

### TAS screenshots (6 PNG, repo-owned)
`01_home_dashboard.png`, `02_queue_tender_list.png`, `03_tender_briefing_recommendation.png`, `04_bundle_source_evidence.png`, `05_sources_import_status.png`, `06_settings_local_first_boundary.png`. Every embed declares `seeded demo data` disclosure.

The Stage-5 brief mentioned optional WebP conversion (`tas-*.webp`). Conversion tooling was not introduced into the build to keep the dependency surface minimal; PNGs are served with explicit `width`/`height` and `loading="lazy"` (the home + security hero shots use `loading="eager"` to be ready above the fold). WebP migration is a Stage-6 hardening task.

---

## 5. Files Created / Changed

### Created in this run

```
docs/STAGE_5_PREFLIGHT.md                        (preflight audit; written before Stage 5 build began)
website/.gitignore
website/README.md                                (placeholder updated context)
website/package.json
website/astro.config.mjs
website/tsconfig.json
website/src/layouts/BaseLayout.astro
website/src/styles/tokens.css
website/src/styles/global.css
website/src/data/site.ts
website/src/data/navigation.ts
website/src/data/routes.ts
website/src/data/claims.ts
website/src/components/Header.astro
website/src/components/Footer.astro
website/src/components/PrimaryButton.astro
website/src/components/SecondaryButton.astro
website/src/components/RouteHero.astro
website/src/components/SectionLabel.astro
website/src/components/DossierCard.astro
website/src/components/EvidenceCard.astro
website/src/components/TenderBundleDiagram.astro
website/src/components/ComplianceMatrixPreview.astro
website/src/components/DecisionPill.astro
website/src/components/ProductScreenshotFrame.astro
website/src/components/ProofStrip.astro
website/src/components/SecurityBoundaryDiagram.astro
website/src/components/FounderCTA.astro
website/src/components/ContactIntentPanel.astro
website/src/pages/index.astro
website/src/pages/tas.astro
website/src/pages/workflow.astro
website/src/pages/security.astro
website/src/pages/issuer-roadmap.astro
website/src/pages/validation.astro
website/src/pages/founder.astro
website/src/pages/contact.astro
website/src/pages/404.astro
website/public/robots.txt
website/public/sitemap.xml
website/public/assets/brand/   (8 files copied)
website/public/assets/motifs/  (10 files copied)
website/public/assets/photos/  (1 file copied)
website/public/assets/screenshots/ (6 files copied)
website/scripts/check-public-copy.mjs
website/scripts/check-public-output.mjs
website/docs/STAGE_5_COMPLETION_REPORT.md
website/src/env.d.ts                             (auto-generated by Astro on build)
```

### Edited

- `website/public/assets/brand/kriseva-og.svg` — replaced `kriseva.ai` with `kriseva.in`; replaced "ARTIFICIAL INTELLIGENCE" with "PROCUREMENT INTELLIGENCE"; refreshed bottom tagline to "Source-linked · Operator-reviewed · Local-first".

### Untouched / preserved as reference

- `project/` (entire Claude Design export) — visual + content reference, not deployed.
- `chats/` (16 transcripts) — internal, not deployed.
- `docs/STAGE_5_PREFLIGHT.md` (top-level docs) — internal, not deployed.

---

## 6. Commands Run

```sh
cd website
npm install --no-audit --no-fund --prefer-offline   # 402 packages, 20s
npm run lint:copy                                    # OK (49 files)
npm run build                                        # 9 pages in 1.23s
npm run lint:public-output                           # OK (42 dist files)
npm run check                                        # 0/0/0
npm run qa                                           # full chain OK
```

Local preview is available with `npm run preview`, dev with `npm run dev`. Neither was run as part of the production build pipeline.

---

## 7. Build Result

```
9 page(s) built in 1.23s
dist/
├── 404.html
├── index.html
├── contact/index.html
├── founder/index.html
├── issuer-roadmap/index.html
├── security/index.html
├── tas/index.html
├── validation/index.html
├── workflow/index.html
├── robots.txt
├── sitemap.xml
├── _astro/  (3 CSS chunks, 2 hoisted JS chunks — < 2 KB combined gzipped)
└── assets/  (25 brand + motif + photo + screenshot files)
```

Total dist files: 42. Total client JS shipped: 1.78 KB raw / 1.03 KB gzipped (mobile nav + scroll reveal + contact form mailto compose).

---

## 8. Lint Results

### Public-copy lint (`scripts/check-public-copy.mjs`)
Scans `src/pages/`, `src/components/`, `src/data/`, and `public/` (excluding `docs/`, `scripts/`, `reference/`, `dist/`, `node_modules/`). Uses a list of forbidden substrings + regex patterns covering Claude Design bundler artifacts, `kriseva.ai`, pricing, WhatsApp, government-endorsement language, marketing absolutes ("guaranteed", "80% reduction", "100% accurate"), and security absolutes ("fully secure", "air-gapped", "no data ever leaves", "military-grade", "zero-risk").

Initial run flagged 4 files with 13 hits — all in legitimate "we will not call this" copy on the security and founder pages plus the legacy `kriseva.ai` token in `kriseva-og.svg`. Each was reworded to preserve meaning without echoing the forbidden phrase verbatim, and the SVG was edited in place.

Final run: **49 files scanned, no forbidden terms.**

### Dist guard (`scripts/check-public-output.mjs`)
Scans `dist/` for forbidden path fragments (`_dev/`, `reference/`, `chats/`, `uploads/`, `private/`, internal report filenames), forbidden extensions (`.docx`, `.pdf`, `.zip`, `.tar`, `.gz`, `.7z`, `.mp4`, `.mov`), reference design HTML names (`KRISEVA Components.html`, etc.), and forbidden in-content tokens (Claude Design bundler signatures, Babel-standalone CDN, `api.anthropic.com/v1/design`).

Result: **42 dist files scanned, no forbidden artifacts.**

---

## 9. Acceptance Criteria — Verified

| # | Criterion | Status |
|---|---|---|
| 1 | All required routes exist | ✓ `/`, `/tas`, `/workflow`, `/security`, `/issuer-roadmap`, `/validation`, `/founder`, `/contact`, `/404` |
| 2 | Founder standalone migrated into `/founder` | ✓ ported into `src/pages/founder.astro` using shared layout + components; standalone preserved as reference outside `website/` |
| 3 | Navigation uses real routes, not hash sections | ✓ `src/data/navigation.ts`, `Header.astro`, `Footer.astro` |
| 4 | Public screenshots copied/used | ✓ 6 captures under `public/assets/screenshots/` with disclosure on every embed |
| 5 | No Claude Design bundler artifacts deployed | ✓ verified by `lint:public-output` and grep against `dist/` |
| 6 | No internal/private docs/assets in built output | ✓ `_dev/`, `uploads/`, `chats/` excluded by Astro convention; dist guard enforces |
| 7 | No pricing | ✓ enforced by `lint:copy` |
| 8 | No WhatsApp CTA | ✓ enforced by `lint:copy` |
| 9 | No unsupported government validation claims | ✓ enforced by `lint:copy` (multiple variants) |
| 10 | No old `kriseva.ai` identity | ✓ enforced by `lint:copy`; legacy OG SVG line patched |
| 11 | Primary CTA above the fold | ✓ Contact Founder / Book Demo / Join Pilot in `index.astro` `<RouteHero>` `cta` slot, immediately under the H1 |
| 12 | Mobile navigation works | ✓ `Header.astro` script: hamburger toggle, escape via link click, `aria-expanded` + `aria-controls` set, body padding for fixed nav |
| 13 | `npm run qa` passes | ✓ end-to-end |
| 14 | Completion report exists | ✓ this file |

---

## 10. Accessibility / Responsive / Performance Notes

- Skip link to `#main` (top of every page).
- Semantic landmarks: `<header>`, `<main id="main">`, `<footer>`, plus `<aside>` and `<article>` where appropriate.
- `aria-current="page"` on the active nav link.
- `aria-expanded` + `aria-controls` on the mobile nav toggle.
- All interactive elements receive a `:focus-visible` brass outline.
- `prefers-reduced-motion: reduce` resets reveal animations and disables smooth scroll.
- Images use explicit `width`/`height` to avoid layout shift; below-fold imagery is `loading="lazy"` and `decoding="async"`.
- Breakpoints honoured: 360 px (single-col), 480 px, 640 px, 720 px, 768 px, 880 px, 920 px, 980 px, 1024 px, 1200 px (max). Manual review at the standard widths showed no horizontal overflow.
- Total client JS (gzipped): ~1 KB. No tracking, no analytics, no third-party scripts other than Google Fonts CSS.

---

## 11. Known Risks / What Remains for Stage 6

| # | Item | Notes |
|---|---|---|
| K1 | TAS screenshots embed seeded demo data | Disclosure is on every capture, but a sensitive-data review by the founder before public deploy is still recommended. |
| K2 | Contact form is a mailto compose, not a backend | Intentional and disclosed in the form (`Submitting opens your mail app with a draft … nothing is sent until you press send in your mail client`). Stage 6 can wire a real backend (Formspree / Cloudflare Function / inbox-only SMTP relay) once a privacy policy + DPA are in place. |
| K3 | Google Fonts via CDN | Self-hosting with a license check is a Stage-6 hardening task. Falls back gracefully to Georgia / Inter system / SFMono if the CDN fails. |
| K4 | No automated visual-regression testing | Build is QA-clean; visual QA is a manual step. Stage 6 candidates: Playwright snapshot suite at the 5 standard breakpoints. |
| K5 | No server-side analytics / consent banner | Site has no tracking. If marketing decides to add a consent-aware analytics library later, scope it in Stage 6 with a privacy notice. |
| K6 | Sitemap is hand-emitted | Adequate for 8 routes. Stage 6 can swap in `@astrojs/sitemap` once routes grow or hreflang/i18n becomes a concern. |
| K7 | OG image is a static SVG | Most platforms render SVG OG fine; Twitter prefers PNG/JPG. Stage 6 can add a derived `kriseva-og.png` next to the SVG if Twitter previews matter. |
| K8 | No hosting wired | Recommended target: Cloudflare Pages (zero-cost, edge cache, `_headers` / `_redirects` support). Repo is build-clean — drop `dist/` on any static host. |
| K9 | TypeScript path aliases declared, lightly used | `@components/*`, `@layouts/*`, etc., are configured in `tsconfig.json` but pages currently use relative imports. Either migrate or remove aliases in Stage 6 — non-blocking. |

---

## 12. Hard-Restriction Audit (one final pass)

All restrictions from the Stage-5 brief verified against `dist/`:

- ✓ No pricing page or pricing language anywhere.
- ✓ No WhatsApp CTA.
- ✓ No `kriseva.ai` reference (legacy OG SVG patched).
- ✓ All identity points to `kriseva.in` / `ayush@kriseva.in`.
- ✓ No "government-approved", "DRDO-approved", "CRPF-approved", "Indian Army validated", "officially endorsed", "used by DRDO", "used by DRDL", "used by Indian Army".
- ✓ No "guaranteed", "80% reduction", "90% reduction", "100% accurate".
- ✓ No "fully secure", "air-gapped", "no data ever leaves", "military-grade", "zero-risk".
- ✓ "TAS" expanded only as "Tender Automation System".
- ✓ No neon / cyberpunk / cartoon styling. Aesthetic is institutional dossier (deep navy, antique brass, paper).
- ✓ No fake logos, fake clients, fake partner badges, fake metrics.
- ✓ No public exposure of the local TAS app, no `127.0.0.1:8000` references, no internal `/queue` `/briefing` `/bundle` `/sources` `/settings` `/history` route links.
- ✓ Issuer-side framed only as "Roadmap · Validation · Pilot Exploration".

Stage 5 is shippable.

---

## 13. Independent Verification Pass

A second-pass verification was run against the built site after the initial build/lint chain passed. Goal: prove the site is real, routed, buildable, and clean — independently of the lint scripts.

### 13a. Commands Run

```sh
cd website

# 1. Site structure
ls src/pages/                              # 9 .astro files
find dist -name '*.html' | sort            # 9 built HTML files

# 2. Standalone Founder is not deployed
ls -la "../project/KRISEVA Founder.html"   # exists at project/ (reference)
find dist -iname '*founder*' -type f       # only /founder/index.html, css chunk, motif, photo
grep -lE "unpkg.com/react|unpkg.com/@babel|text/babel" dist -r  # zero matches

# 3. QA chain
npm run lint:copy                          # OK · 49 files
npm run build                              # 9 pages built · 1.14s
npm run lint:public-output                 # OK · 42 dist files
npm run qa                                 # OK end-to-end

# 4. Verification term list — fixed-string search across dist/
for term in <18 terms>; do grep -rliF "$term" dist/; done

# 5. Forbidden artifacts in dist/
find dist -type f \( -name '*.pdf' -o -name '*.docx' -o ... \)
find dist \( -path '*_dev*' -o -path '*chats*' -o -path '*uploads*' ... \)

# 6. A11y / responsive primitives
# Skip-link count per page; CSS chunks containing focus-visible / prefers-reduced-motion
# JS chunks containing matchMedia / aria-expanded handlers
# <img> tags missing alt; <input>/<select>/<textarea> wrapping <label> count

# 7. CTA hrefs
grep -oE 'href="[^"]*"[^>]*>(Contact Founder|Book Demo|Join Pilot)<' dist/**/*.html

# 8. SEO meta
# Per-page title / description / canonical / og:title / og:image / twitter:card
```

### 13b. Pass / Fail Per Verification Task

| # | Task | Result |
|---|---|---|
| 1 | Site structure — all 9 routes (`/`, `/tas`, `/workflow`, `/security`, `/issuer-roadmap`, `/validation`, `/founder`, `/contact`, `/404`) present in `src/pages/` and `dist/` | **PASS** |
| 2 | Standalone `KRISEVA Founder.html` is not the deployed website. It exists at `project/KRISEVA Founder.html` as reference; `/founder` is built through Astro using shared `BaseLayout`, `Header`, `Footer`, `FounderCTA`, `DossierCard`, `SectionLabel`. No React/Babel CDN tags in `dist/`. | **PASS** |
| 3 | `npm run lint:copy` (49 files OK) · `npm run build` (9 pages, 1.14s) · `npm run lint:public-output` (42 files OK) · `npm run qa` (end-to-end OK) | **PASS** |
| 4 | Fixed-string grep across `dist/` for all 18 verification terms — zero matches. (Initial regex grep produced a false-positive on `kriseva.ai` because the `.` was matching the space in the brand name "KRISEVA AI"; switching to `grep -F` confirmed no literal `kriseva.ai` occurrences anywhere.) | **PASS** |
| 5 | `dist/` contains no reference design HTML, no `_dev/`, no transcripts, no `uploads/`, no `.pdf` / `.docx` / `.zip` / `.mp4` / `.mov`, no Claude Design bundle artifacts. Verified by directory walk + extension filter + path-fragment filter. | **PASS** |
| 6 | A11y / responsive primitives: skip link present on all 9 pages · `:focus-visible` styles in shared CSS · `prefers-reduced-motion` media query in shared CSS · scroll-reveal JS gates on `matchMedia('(prefers-reduced-motion: reduce)')` · mobile nav has `aria-controls`, `aria-expanded`, `aria-label` and is keyboard-operable (`<button>` element, focus-visible) · 0 `<img>` tags without `alt` · all 12 form controls wrapped in `<label>` blocks · `role="radiogroup"` + `aria-label` on the contact intent group · core content rendered statically (5 800–7 000 chars visible text per page; no client-only rendering for content) | **PASS** |
| 7 | CTA href behaviour: `Contact Founder` → `/contact` on every page · `Book Demo` → `/contact?intent=demo` on every page · `Join Pilot` → `/contact?intent=pilot` on every page · contact form pre-selects intent from URL query parameter | **PASS** |
| 8 | SEO meta: every route has unique `<title>`, `<meta name="description">`, `<link rel="canonical">` on `https://kriseva.in`, `og:title` / `og:description` / `og:image` / `og:url` / `og:type` / `og:locale` / `og:site_name`, and `twitter:card` / `twitter:title` / `twitter:description` / `twitter:image` · `dist/sitemap.xml` lists 8 routes · `dist/robots.txt` exists with `Allow: /` and sitemap reference | **PASS** |

### 13c. Fixes Made During Verification

| Issue | Fix |
|---|---|
| Canonical URLs were emitted with a trailing slash (`https://kriseva.in/tas/`) while `sitemap.xml` listed the same routes without trailing slashes (`https://kriseva.in/tas`). Could be read by a search engine as two URLs for the same page. | Updated `src/layouts/BaseLayout.astro` to normalise canonical paths: root stays `/`, every other route strips its trailing slash before being passed into `new URL(...)`. Rebuilt; canonical now matches sitemap on every route. |

No other fixes were required. Initial regex grep produced a false positive on `kriseva.ai` (regex `.` matched the space in brand name "KRISEVA AI") — re-running with fixed-string `grep -F` confirmed zero literal occurrences. The lint script `check-public-copy.mjs` already uses `String.prototype.indexOf` for substring matching, which treats the dot as a literal character; no change needed there.

### 13d. Independent Build & QA Receipts

```text
$ npm run lint:copy
[check-public-copy] OK — scanned 49 file(s); no forbidden terms found.

$ npm run build
[build] 9 page(s) built in 1.14s
[build] Complete!

$ npm run lint:public-output
[check-public-output] OK — scanned 42 dist file(s); no forbidden artifacts found.

$ npm run qa
[check-public-copy] OK — scanned 49 file(s); no forbidden terms found.
[build] 9 page(s) built in 1.18s
[build] Complete!
[check-public-output] OK — scanned 42 dist file(s); no forbidden artifacts found.

$ # Final fixed-string sweep across dist/ for every verification term
ALL CLEAN
```

### 13e. Unresolved Risks

Carried forward from §11 of this report — none introduced by the verification pass:

- **K1** TAS screenshots embed seeded demo data. Disclosure is on every embed; founder review before public deploy is recommended.
- **K2** Contact form is a transparent mailto compose, not a backend. Real form backend is a Stage-6 task (requires privacy policy + DPA).
- **K3** Google Fonts via CDN. Self-hosting is a Stage-6 hardening task.
- **K4** No automated visual-regression suite. Visual QA is currently manual.
- **K5** No analytics / consent banner. None planned in Stage 5.
- **K6** Sitemap is hand-emitted. Adequate for 8 routes.
- **K7** OG image is SVG. PNG fallback for Twitter is a Stage-6 niceity.
- **K8** No hosting wired. Recommended target: Cloudflare Pages.
- **K9** TS path aliases declared, lightly used. Cleanup-only; non-blocking.

None of K1–K9 block deployment. K1 (sensitive-data review on screenshots) is the only one that is a meaningful pre-flight gate before pointing kriseva.in at the new site.

### 13f. Stage 6 Readiness

**Stage 6 can begin.** Acceptance criteria from the build brief are satisfied, both lint gates pass, build produces 9 routes, all required CTAs and SEO meta are in place, and no internal/private artifacts leak into `dist/`.

Recommended Stage 6 scope, in priority order:
1. Sensitive-data review on the 6 TAS screenshots (K1 gate).
2. Hosting wiring — Cloudflare Pages or equivalent — with `_headers` (CSP, HSTS, frame-ancestors), `_redirects` (404 fallback), and DNS cutover.
3. Contact form backend (privacy policy + DPA review first).
4. Self-hosted webfonts + PNG OG fallback.
5. Visual regression suite at the 5 standard breakpoints.
6. Optional WebP migration for the screenshot set.

