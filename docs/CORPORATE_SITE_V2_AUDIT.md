# CORPORATE SITE V2 AUDIT

**Date**: 2026-08-13
**Repository**: kriseva-website-v1 (branch main, commit deb3dff)
**Scope**: Read-only analysis of website/ Astro application

---

## Part A: Repository Inventory (2026-08-13)

### 1. Repository Structure (Top Two Levels)

```
kriseva-website-v1/
├── docs/                 # Stage 6 documentation, claims audit, release gates
├── website/              # Astro application (primary)
├── worker/               # Cloudflare Workers entry point (worker/index.ts)
├── project/              # Meta (not audited)
├── wrangler.jsonc        # Workers config
├── README.md
```

**website/ Structure:**
```
website/
├── src/
│   ├── pages/            # Route files (Astro static routes)
│   ├── components/       # Reusable Astro/TSX components
│   ├── layouts/          # Page layout templates
│   ├── data/             # TypeScript data & config exports
│   ├── styles/           # CSS (StyleLint enforced)
├── public/               # Static assets (6.7M total)
├── functions/            # Cloudflare Functions (API)
├── scripts/              # Build/QA scripts (21 utilities)
├── tests/                # Playwright QA suite
├── package.json
├── astro.config.mjs
├── playwright.config.ts
├── tsconfig.json
├── .stylelintrc.json
├── svgo.config.mjs
```

---

### 2. Package & Dependencies

**Name**: kriseva-website (v1.0.0)
**Type**: ES module (private)
**Description**: KRISEVA AI public website — procurement intelligence for India's defense ecosystem

#### Dependencies
- `astro`: ^4.16.18 (primary framework)

#### DevDependencies
- `@astrojs/check`: ^0.9.4
- `@axe-core/playwright`: ^4.11.3 (accessibility testing)
- `playwright`: ^1.59.1 (visual, a11y, responsive, motion QA)
- `sharp`: ^0.34.5 (image optimization)
- `stylelint`: ^17.9.1 (CSS linting)
- `stylelint-config-standard`: ^40.0.0
- `svgo`: ^4.0.1 (SVG optimization)
- `typescript`: ^5.6.3

#### NPM Scripts
| Script | Purpose |
|--------|---------|
| `dev` | `astro dev` (local development) |
| `build` | `astro build` (production static build) |
| `preview` | `astro preview` (test built site) |
| `check` | `astro check` (type checking) |
| `lint:copy` | Validate public copy via `check-public-copy.mjs` |
| `lint:public-output` | Validate built HTML via `check-public-output.mjs` |
| `lint:css` | StyleLint CSS in src/styles/ |
| `qa` | Full QA: lint:copy + build + lint:public-output |
| `qa:visual` | Playwright visual regression (index.astro, all routes) |
| `qa:a11y` | Playwright axe-core accessibility audit |
| `qa:responsive` | Playwright responsive breakpoint tests |
| `qa:motion` | Playwright GSAP/ScrollTrigger motion tests |
| `qa:stage7` | Complete CI flow: lint:css + qa + qa:a11y + qa:visual + qa:responsive + qa:motion |
| `optimize:screenshots` | Sharp image optimization batch |

---

### 3. Astro Configuration

**File**: `astro.config.mjs`

| Setting | Value | Notes |
|---------|-------|-------|
| Site URL | `https://www.kriseva.in` | Apex DNS is NXDOMAIN (audit 2026-06-12); www is resolving host. TODO: flip when apex DNS fixed. |
| Output Mode | `static` | Fully static under dist/. No SSR, no server adapter. |
| Trailing Slash | `ignore` | Canonical URL format neutral. |
| Build Format | `directory` | Directories over flat HTML file structure. |
| HTML Compression | `true` | Production HTML minified. |
| CSS Minification | `true` | Vite build option. |

---

### 4. Route Map

**Total Routes**: 9 active + 2 archived

| Route | File | Lines | Status | Notes |
|-------|------|-------|--------|-------|
| `/` | `index.astro` | 2,455 | Active | Homepage. Primary narrative, hero exhibit, pipeline, console demo, field evidence, audit strip. |
| `/tas` | `tas.astro` | 319 | Active | KRISEVA TAS product page. Bidder-side workflow. |
| `/workflow` | `workflow.astro` | 155 | Active | TAS workflow walkthrough. |
| `/security` | `security.astro` | 177 | Active | Local-first architecture, boundary zones, threat model. |
| `/evaluator` | `evaluator.astro` | 453 | Active | Issuer-side bid evaluation product. Three-path convergence, audit chain. |
| `/validation` | `validation.astro` | 114 | Active | Validation roadmap and measurement framework. |
| `/founder` | `founder.astro` | 98 | Active | Founder bio, Ayush Tiwary. |
| `/contact` | `contact.astro` | 173 | Active | Contact form, intent routing (demo / pilot / partnership / issuer). |
| `/404.astro` | `404.astro` | 19 | Active | 404 error page. |
| `_index_v1_archive.astro` | (archive) | 512 | Archived | Legacy homepage snapshot. Kept for reference. |
| `_issuer-roadmap_archive.astro` | (archive) | 337 | Archived | Legacy issuer roadmap. Superseded by `/evaluator`. |

**Dynamic Routes**: None. All routes are static .astro files.

---

### 5. Components & Layouts

**Components**: 25 Astro components under `src/components/` and `src/layouts/`

#### Largest Components (by line count)
| Component | Lines | Purpose |
|-----------|-------|---------|
| `HeroExhibit.astro` | 403 | Hero section WebGL/Canvas exhibit (three.js, GSAP). |
| `ContactIntentPanel.astro` | 300 | Contact form with intent routing (demo/pilot/partnership/issuer). |
| `CapabilityPipeline.astro` | 288 | Six-stage pipeline visualization (interactive, state-driven). |
| `ProductScreenshotFrame.astro` | 222 | Product screenshot carousel with metadata. |
| `Header.astro` | 212 | Primary header with nav, founder CTA, logo. |
| `Footer.astro` | 154 | Site footer with sitemap, social, build stamp. |
| `VerdictSimulator.astro` | 127 | Interactive bid evaluation simulator. |
| `ComplianceMatrixPreview.astro` | 122 | Compliance requirements matrix. |
| `DossierCard.astro` | 120 | Evidence dossier card component. |
| `MotifFrame.astro` | 104 | Reusable frame for visual sections. |

#### All Components (alphabetical)
- `DecisionPill.astro` (36)
- `DossierCard.astro` (120)
- `EvidenceCard.astro` (91)
- `FounderCTA.astro` (94)
- `Footer.astro` (154)
- `Header.astro` (212)
- `HeroExhibit.astro` (403)
- `MotifFrame.astro` (104)
- `Plate.astro` (43)
- `PrimaryButton.astro` (93)
- `ProofStrip.astro` (74)
- `RouteHero.astro` (85)
- `SecondaryButton.astro` (15)
- `SectionHead.astro` (17)
- `SectionLabel.astro` (26)
- `SecurityBoundaryDiagram.astro` (57)
- `TenderBundleDiagram.astro` (64)
- `V6Footer.astro` (45)
- `V6Head.astro` (94)
- `V6Nav.astro` (61)
- `VerdictSimulator.astro` (127)
- `ProductScreenshotFrame.astro` (222)
- `ContactIntentPanel.astro` (300)
- `CapabilityPipeline.astro` (288)
- `ComplianceMatrixPreview.astro` (122)

#### Layouts
- `BaseLayout.astro` (113): Base HTML skeleton, meta, fonts, scripts.
- `V6Layout.astro` (59): V6 variant layout wrapper.

**Oversized Files (>500 lines)**: None. Largest is HeroExhibit.astro at 403 lines.

---

### 6. Data Layer

**Files**: 5 TypeScript data modules under `src/data/`

| File | Lines | Purpose & Exports |
|------|-------|-------------------|
| `publicClaims.ts` | 580 | **Stage 6 claim register.** Single source of truth for public-facing claims. Exports: `publicClaims` (51 claims), `claimsByCategory`, `getClaim()`, `approvedWordingForSurface()`. Categories: verified-and-safe, safe-with-care, needs-measurement, do-not-publish. |
| `claims.ts` | 72 | **Pre-approved copy blocks.** Exports: `claims` const (thesis, product one-liner/long-line, parsing, metadata, compliance, recommendation, OCR, DefProc, GeM, local-first, issuer status, product status, not-claimed list, no-endorsement disclaimer). |
| `site.ts` | 42 | **Site identity & SEO defaults.** Exports: `site` const (name, legal name, domain, URL, positioning, email, founder details, product info, thesis, defaults for title/description/OG image/favicon/locale/theme color). |
| `navigation.ts` | 27 | **Header + footer navigation.** Exports: `headerLinks` (6 items), `footerSitemap` (8 items). Routes: /tas, /workflow, /security, /evaluator, /validation, /founder, /contact. |
| `routes.ts` | 21 | **Canonical route table.** Exports: `routes` const (home, tas, workflow, security, evaluator, issuerRoadmap, validation, founder, contact, contactWithIntent function). |

---

### 7. Claims Architecture

**File**: `src/data/publicClaims.ts` (580 lines)

#### Claim States (Categories)
1. **verified-and-safe**: Publishable as-is. No paraphrase needed.
2. **safe-with-care**: Publishable only with exact, careful wording committed in the file. Includes optional caveat field.
3. **needs-measurement**: Cannot publish until measurement evidence exists in repo.
4. **do-not-publish**: Tripwire. Never publish. Included to flag unauthorized use.

#### Claim Structure (TypeScript Interface)
```typescript
interface PublicClaim {
  id: string;                    // Stable audit ID
  wording: string;               // Exact public wording (no paraphrase)
  category: ClaimCategory;       // One of four states above
  evidence: string[];            // Repo-relative paths to evidence
  surface: string;               // Page or component where rendered
  caveat?: string;               // Free-text caveat (safe-with-care only)
}
```

#### Claim Count
- **Total claims**: 51
- Organized by category:
  - positioning (identity & thesis)
  - product (TAS features & architecture)
  - evaluator (issuer-side bid evaluation)
  - issuer (issuer roadmap & scope)
  - stakeholder (operator, buyer, evaluator views)
  - validation (measurement & pilot status)
  - fieldRecord (audit logging, reproducibility)
  - founder (Ayush Tiwary background)
  - boundaries (local-first, data boundary)
  - storyV7 (homepage narrative sections)

#### Documentation References
- `docs/PUBLIC_CLAIMS_REGISTER.md`: Master register with categories, lint enforcement (hard-fail + flagged for review), all 51 claims, surfaces audited, claims requiring human approval.
- `docs/STAGE_6_CLAIMS_AUDIT.md`: Surfaces audited (9 pages, 16 components, 5 data files, 1 layout, metadata, alt text, contact labels, public assets, built output), claims changed/removed/retained, claims needing measurement.
- `docs/STAGE_6_FINAL_RELEASE_GATE.md`: Build receipts, lint results, route audit, forbidden phrase scan, risky phrase review, page-positioning verification (7 routes).

---

### 8. Motion Stack

**Libraries**: GSAP, ScrollTrigger, Lenis (smooth scroll), three.js (3D WebGL)

#### Vendor Files (Public)
| Library | File | Size | Load Strategy |
|---------|------|------|---|
| GSAP | `/vendor/gsap-3.12.5.min.js` | 71K | Deferred script (index.astro) |
| ScrollTrigger | `/vendor/ScrollTrigger-3.12.5.min.js` | ~50K (est) | Deferred script (index.astro) |
| Lenis | `/vendor/lenis-1.3.23.min.js` | ~40K (est) | Deferred script (index.astro) |
| Three.js | `/vendor/three-r128.min.js` | 589K | Conditional deferred (WebGL capable devices only) |

#### Usage Locations
- **HeroExhibit.astro**: three.js WebGL canvas (hero exhibit), GSAP animation.
- **index.astro**: GSAP (timeline), ScrollTrigger (scroll-driven animation), Lenis (smooth scroll). Includes device detection (three.js loads only on WebGL-capable devices).
- **Tests/motion.spec.ts**: Playwright tests for GSAP/ScrollTrigger animation states during scroll.

**Inline Script**: `document.getElementById('threeLoader')` conditional loader in index.astro frontmatter.

---

### 9. Assets & Performance

**Total Public Directory Size**: 6.7M

#### 20 Largest Files
| File | Size | Type | Content |
|------|------|------|---------|
| `founder-ayush.png` | 1.6M | Image | Founder photo |
| `03_tender_briefing_recommendation.png` | 813K | Screenshot | Product UI |
| `three-r128.min.js` | 589K | Library | 3D WebGL (three.js) |
| `06_settings_local_first_boundary.png` | 350K | Screenshot | Security boundary UI |
| `02_queue_tender_list.png` | 350K | Screenshot | Queue list UI |
| `console_bundle.jpg` | 294K | Image | Console preview |
| `tas-console-loop.mp4` | 284K | Video | Working loop (MP4) |
| `tas-console-loop.webm` | 271K | Video | Working loop (WebM) |
| `01_home_dashboard.png` | 201K | Screenshot | Dashboard UI |
| `console_briefing.jpg` | 160K | Image | Briefing console |
| `console_gem_scanner.jpg` | 154K | Image | GeM scanner UI |
| `console_home.jpg` | 149K | Image | Home console |
| `dossier.pdf` | 126K | PDF | Evidence dossier |
| `console_decisions.jpg` | 104K | Image | Decisions console |
| `05_sources_import_status.png` | 98K | Screenshot | Import status UI |
| `console_boundary_zones.jpg` | 83K | Image | Boundary zones |
| `founder_ayush.jpg` | 82K | Image | Founder JPEG variant |
| `tas-console-loop-poster.jpg` | 80K | Image | Video poster |
| `gsap-3.12.5.min.js` | 71K | Library | Animation engine |
| `04_bundle_source_evidence.png` | 70K | Screenshot | Evidence bundle UI |

**Asset Categories**
- Screenshots (product UI): 6 images (70-813K each)
- Console/demo images: 6 images (83-294K each)
- Founder/team photos: 2 images (82K-1.6M)
- Video (TAS console loop): MP4 + WebM + poster (271K + 284K + 80K)
- Libraries (3D/animation): three.js (589K), GSAP (71K), etc.
- PDF (evidence dossier): 126K
- Fonts, SVG, misc: remainder

---

### 10. SEO & Metadata

**Handled By**:
- **Astro global config**: `astro.config.mjs` (site URL, output mode)
- **Layouts**: `BaseLayout.astro` (meta charset, viewport, canonical link, OG tags, Twitter card, JSON-LD schema)
- **Index page**: `index.astro` (title, description, OG meta, schema.org Organization + founder Person type)
- **Route pages**: Each page sets own title/description frontmatter
- **Sitemap**: Auto-generated by Astro (XML sitemap for all routes)
- **Robots**: Manual `/public/robots.txt` (not audited)

**Meta Tags**:
- Title: Dynamic per page (index: "KRISEVA · Deterministic, auditable procurement intelligence...")
- Description: Dynamic per page (index: "A tender is not a PDF...")
- Canonical: `<link rel="canonical" href="https://www.kriseva.in/">` (homepage)
- OG (Open Graph): og:type, og:site_name, og:title, og:description, og:url, og:image (1200x630)
- Twitter: twitter:card (summary_large_image), twitter:title, twitter:description, twitter:image
- Schema.org: JSON-LD Organization (name, URL, email, founder Person type with jobTitle, alumni, email) + "knowsAbout" array
- Theme Color: `#DED6C9` (meta tag)
- Favicon: `/assets/v6/favicon.svg`

**Fonts**: Self-hosted, zero CDN (Instrument Serif, IBM Plex Sans, IBM Plex Mono). Preloaded in head via link rel="preload".

---

### 11. External Origins (Third-Party)

**Minimal external dependency**. Audit of src/ and public/ shows:

| Origin | Usage | Purpose |
|--------|-------|---------|
| `https://schema.org` | JSON-LD schema context | Structured data for search engines |
| `http://www.w3.org/2000/svg` | SVG namespace | SVG element declarations |
| `https://www.kriseva.in` | Canonical, OG meta, schema URL | Self-referential (same domain) |

**No External CDNs**:
- Fonts: Self-hosted (no Google Fonts, Typekit, etc.)
- JS libraries: Vendored locally (/vendor/)
- Analytics: None
- Tracking pixels: None
- Third-party widgets: None

---

### 12. QA & Testing Tooling

**Playwright Test Suite** (Stage 7 QA)

| Test File | Dimensions | Purpose |
|-----------|-----------|---------|
| `a11y.spec.ts` (2.0K) | All routes (9 pages) | axe-core accessibility audit (WCAG). Desktop Chrome @ 1440x900. |
| `visual.spec.ts` (1.8K) | Key routes (index, tas, evaluator, security, founder, contact) | Visual regression snapshots. Desktop Chrome @ 1440x900. Baseline snapshots in `tests/__snapshots__/`. |
| `responsive.spec.ts` (2.0K) | Key routes | Responsive breakpoint testing (mobile, tablet, desktop). Verifies layout stability. |
| `motion.spec.ts` (2.6K) | Homepage (index.astro) | GSAP/ScrollTrigger animation state validation. Scroll-driven trigger testing. |

**Configuration**: `playwright.config.ts`
- Framework: Playwright (Chromium desktop)
- Test dir: `./tests/`
- Snapshots: `./tests/__snapshots__/`
- Output: `./tests/.output/`
- WebServer: Production build (npm run build && npm run preview), not dev server
- Viewport: Desktop Chrome 1440x900
- Parallel: Enabled (fullParallel: true)
- CI mode: 2 workers, 1 retry, forbidOnly enforced
- Animation handling: Disabled by default (stable screenshots); motion tests opt in
- Tolerance: maxDiffPixelRatio 0.01 (catches real regressions, ignores subpixel font rendering)

**Build & Lint Scripts** (in src/scripts/):
- `check-public-copy.mjs` (9.6K): Validates claim wording usage, forbidden phrases, risky phrases
- `check-public-output.mjs` (6.0K): Validates built HTML output (links, meta, structure)
- `lint:css` (stylelint): CSS validation (standard config)
- `qa` macro: lint:copy + build + lint:public-output
- `qa:stage7` macro: Full CI flow (lint:css + qa + all Playwright tests)

**Support Scripts**:
- `axe-dump.mjs`: Dump axe-core violations
- `egress-audit.mjs`: Scan for external domain egress
- `kbd-audit.mjs`: Keyboard navigation audit
- `scan-quality.mjs`: Quality scanning utility
- `render-dossier.mjs`: Generate evidence dossier
- `capture-story.mjs`, `shoot-page.mjs`: Screenshot capture utilities
- `optimize-screenshots.mjs`: Sharp-based image optimization with revert capability
- `pr-evidence.mjs`: PR evidence logging

**No Unit Tests**: Only E2E/visual/a11y tests. No Jest, Vitest, or component-level tests.

---

### 13. Cloudflare Workers & Deployment

**wrangler.jsonc**:
```jsonc
{
  "name": "kriseva",
  "compatibility_date": "2025-01-01",
  "workers_dev": true,
  "preview_urls": true,
  "main": "worker/index.ts",
  "assets": {
    "directory": "./website/dist",
    "binding": "ASSETS",
    "not_found_handling": "404-page"
  },
  "observability": {
    "enabled": true
  }
}
```

**Worker** (`worker/index.ts`, 20 lines):
- Entry: Cloudflare Workers main
- Static fallback: ASSETS binding (website/dist directory)
- Single dynamic route: `/api/lead` (POST form handler, delegates to `website/functions/api/_lead-core.ts`)
- All other paths: Served from static build
- Status: Manual secret setup required (MAILCHANNELS_API_KEY for email forwarding)

**Summary**:
- Astro static site (dist/) on Cloudflare Pages/Workers
- Lead form endpoint routed through Mailchannels (founder-gated, requires API key secret)
- No SSR, no dynamic compute beyond email forwarding

---

### 14. Homepage (index.astro)

**File Size**: 2,455 lines
**Build-Time Processing**: 
- Extracts 9 claims from publicClaims.ts (claim registry baking)
- Generates build SHA, claims SHA, build date
- No runtime dependencies on publicClaims (static baking)

#### Top-Level Sections (Sequential)
1. **Hero** (#top): "A tender is a decision system" thesis. WebGL exhibit (three.js conditional), scroll cue.
2. **Clock** (#clock): Procurement cycle visualization (year-by-year motion).
3. **Two Rooms** (#rooms): Bidder side vs issuer side problem framing (bundle/checks diagrams).
4. **The Turn** (#turn): Narrative transition.
5. **Thesis** (#thesis): Core value prop statement (text-only).
6. **Platform / Pipeline** (#platform): Six-stage deterministic pipeline (interactive, folio counter).
7. **Console Demo** (#console): Working TAS console loop video (14s, muted, synthetic data).
8. **Marquee Band** (#mq1, #mq2): Scrolling text marquees.
9. **Bundle Trace** (#bundletrace): From verdict to PDF page (visual proof).
10. **Bidability** (#bidability): Radar chart (6 dimensions, interactive).
11. **Field Evidence Filmstrip** (#fieldstrip): Five product screenshots (carousel).
12. **Evidence Matrix** (#evidence): Evaluation matrix section.
13. **Audit Chain** (#audit): Deterministic audit logging (navy background).
14. **Sovereignty** (#sovereignty): Data residency / local-first architecture (sunken background).
15. **Mission** (#mission): Company mission statement.
16. **Key Figures** (#figures): Metrics, stats (aria-label).
17. **Record** (#record): IIT PAN, educational background (sunken background).
18. **Contact** (#contact): Contact CTA section.
19. **Tour Chip** (#tourChip): Guided walk dialog (managed via JavaScript).

**Total Sections**: 18 distinct sections + tour chip

**Motion**: GSAP timeline, ScrollTrigger scroll-driven animations, Lenis smooth scroll, three.js hero (device-conditional load).

**Load Performance**:
- Fonts: Preloaded woff2 (5 font files)
- Three.js: Conditional load (device check inline script)
- GSAP/Lenis: Deferred scripts
- Images: Console loop video has poster (lazy load)

---

### 15. PROGRAM_STATE.md

**File Status**: Does not exist in working tree.
- Searched: `/Users/aloo/Downloads/kriseva-website-v1` (all branches)
- Expected path: `docs/rebuild/PROGRAM_STATE.md` (per KRISEVA project CLAUDE.md)
- Status: No rebuild program state file found. No v2 rebuild tracking.

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| **Routes (active)** | 9 |
| **Routes (archived)** | 2 |
| **Components** | 25 |
| **Layouts** | 2 |
| **Data modules** | 5 |
| **Public claims** | 51 |
| **Homepage line count** | 2,455 |
| **Homepage sections** | 18 |
| **Test suites** | 4 (a11y, visual, responsive, motion) |
| **QA/build scripts** | 21 |
| **Largest asset** | 1.6M (founder photo) |
| **Total public size** | 6.7M |
| **Dependencies** | 1 (astro) |
| **DevDependencies** | 8 |
| **Playwright browsers** | 1 (Chromium desktop) |
| **Motion libraries** | 4 (GSAP, ScrollTrigger, Lenis, three.js) |
| **Oversized components (>500 lines)** | 0 |

---

## Structural Observations

### Strengths
1. **Claims system**: Rigorous, auditable, stage-gated with categories and evidence pointers
2. **QA pipeline**: Comprehensive (a11y, visual, responsive, motion, lint, copy validation)
3. **Build process**: Static, secure (no SSR), with post-build validation
4. **Component organization**: Focused, single-responsibility, <500 lines each
5. **Data layer**: Single source of truth for routes, nav, claims, site identity
6. **Performance**: Minimal external dependencies, self-hosted fonts, conditional library loading

### Risks & Structural Concerns
1. **Homepage scale**: 2,455 lines in a single .astro file; hard to maintain or refactor
2. **Motion complexity**: GSAP/ScrollTrigger/Lenis in single page; difficult to test interactions
3. **Build timestamp**: Homepage embeds git SHA/date at build time; loses value on cached/CDN builds
4. **No unit tests**: Only E2E tests; zero component-level or logic isolation
5. **Claim evidence**: Evidence links are text pointers; no automated link verification

---

## Recommended Redesign Entry Points (V2)

1. **Homepage decomposition**: Split 2,455-line homepage into 5-7 smaller components or page sections
2. **Motion abstraction**: Extract GSAP orchestration into a reusable animation controller
3. **Claim registry automation**: Add CI check that validates evidence file paths exist
4. **Component test coverage**: Add Vitest unit tests for interactive components (pipeline, radar, etc.)
5. **Static asset optimization**: Use Astro image component for automatic srcset/WebP generation

---

**Audit completed**: 2026-08-13
**Auditor**: Repository inventory worker
**Verification scope**: Read-only; no modifications made
