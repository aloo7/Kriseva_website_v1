# Stage 5 Preflight Audit

Date: 2026-05-02
Scope: Pre-execution audit for Stage 5 — the full production website build for KRISEVA AI.

> **Status: PREFLIGHT ONLY.** Stage 5 has **not** started. The standalone `project/KRISEVA Founder.html` produced earlier is a single-page reference artifact; it is not the production website and must not be shipped as one.

---

## 1. Current Repo Structure

```
/home/claude/repo
├── README.md                          # Claude Design handoff instructions
├── .git/                              # Single commit: "Claude Design handoff: kriseva website"
├── chats/                             # 16 raw transcript files (chat1.md … chat16.md) — INTERNAL
├── project/                           # Claude Design export (HTML/JSX/CSS prototypes)
│   ├── KRISEVA Founder.html           # Standalone production HTML (Founder page only)
│   ├── KRISEVA Homepage.html          # Prototype: React+Babel CDN entry
│   ├── KRISEVA TAS.html               # Prototype: React+Babel CDN entry
│   ├── KRISEVA Workflow.html          # Prototype: React+Babel CDN entry
│   ├── KRISEVA Issuer.html            # Prototype: React+Babel CDN entry
│   ├── KRISEVA Security.html          # Prototype: React+Babel CDN entry
│   ├── KRISEVA Validation.html        # Prototype: React+Babel CDN entry
│   ├── styles.css                     # Shared design-token CSS
│   ├── shared.jsx                     # Shared components (nav, footer, primitives)
│   ├── {hp,tas,wf,is,sec,val,founder}-{app,top,mid,bottom}.jsx   # Per-page sections
│   ├── assets/
│   │   ├── brand/                     # 8 KRISEVA brand SVGs (PUBLIC-SAFE)
│   │   ├── motifs/                    # 10 generated original SVG motifs (PUBLIC-SAFE)
│   │   ├── photos/founder-ayush.png   # Founder portrait (PUBLIC-SAFE)
│   │   └── screenshots/               # 7 TAS UI captures (REVIEW BEFORE PUBLIC USE)
│   ├── _dev/                          # Internal sandbox + QA — DO NOT DEPLOY
│   ├── screenshots/                   # 8 dev/QA captures of homepage iterations — DO NOT DEPLOY
│   └── uploads/                       # Source-of-truth research pack — DO NOT DEPLOY
└── docs/                              # Created this run
    └── STAGE_5_PREFLIGHT.md           # This file
```

`git status --short` at audit time: `M project/KRISEVA Founder.html` (the standalone rebuild from the previous run; preserved on disk as a content/visual reference).

---

## 2. Framework Detection

**No production website framework is present.**

Confirmed signals:
- No `package.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `requirements.txt`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Gemfile`, or `composer.json` anywhere in the tree.
- No `next.config.*`, `astro.config.*`, `nuxt.config.*`, `svelte.config.*`, `vite.config.*`, `eleventy.config.*`, `gatsby-config.*`, `remix.config.*`.
- No `node_modules/`, `dist/`, `build/`, `.next/`, `_site/`, `public/`.
- No CI configuration (`.github/`, `.gitlab-ci.yml`, `vercel.json`, `netlify.toml`, `wrangler.toml`).

What does exist in `project/` is a **Claude Design prototype runtime**: each `KRISEVA *.html` page (except the rebuilt `KRISEVA Founder.html`) loads React 18 + ReactDOM + `@babel/standalone` from `unpkg.com` and transforms `*.jsx` files in the browser. This is acceptable as a design preview but not as a production website (no build, no SSR/SSG, no caching strategy, ~600 KB of CDN JS per page just to render static dossier copy).

**Conclusion:** Stage 5 must scaffold a real site; it cannot inherit from anything in-place.

### No Claude Design bundler artifacts detected
Grep for `Unpacking`, `__bundler`, `blob:`, `Babel.transform` across `project/**/*.html` and `project/**/*.jsx` returns no matches. The prototype uses the public Babel-standalone CDN only. There is **nothing to strip**, but Stage 5 must still avoid copying any of:
- React/ReactDOM CDN `<script>` tags
- `@babel/standalone` `<script>` tags
- `<script type="text/babel" src="*.jsx">` loader patterns
- Any future `__bundler/manifest`, `__bundler/template`, or blob-based runtime loaders

---

## 3. Location of Reference Files

### 3a. Design source (visual/content reference only)

| Reference | Path | Use as |
|---|---|---|
| Sitemap-defining HTML prototypes | `project/KRISEVA *.html` | **Visual + structural reference.** Read for layout, tokens, copy. Do not deploy. |
| Per-section JSX | `project/{hp,tas,wf,is,sec,val,founder}-{app,top,mid,bottom}.jsx` | Source of truth for section composition + final QA-approved copy. |
| Shared primitives | `project/shared.jsx` | Component vocabulary: `KrisevaFooter`, `SectionLabel`, `Badge`, `CtaGroup`, `WorkflowStep`, `CapCard`, `ScreenshotFrame`. |
| Design tokens / base CSS | `project/styles.css` | Authoritative tokens (navy/brass/paper palette, type scale, radii, spacing, motion, breakpoints). |
| Standalone Founder page | `project/KRISEVA Founder.html` | Reference implementation showing how a prototype page de-Reacts into framework-agnostic HTML/CSS/JS. |

### 3b. Stage-4 decision documents (read before building)

All under `project/uploads/` — these are the agreed Stage 4 outputs that bind Stage 5 wording and scope.

| Doc | Why Stage 5 needs it |
|---|---|
| `EXECUTIVE_SUMMARY.md` | Core narrative + design direction. |
| `CLAIM_REGISTER.md` | **Hard binding.** Every public claim must map to a "Verified and safe to publish" or "Safe with careful wording" row. |
| `NEXT_AGENT_INSTRUCTIONS.md` | Inputs the prior agent expected this run to read first. |
| `RESEARCH_LIMITATIONS.md` | What was not captured / not attempted (CAPTCHA bypass, login flows, etc.) — informs honest copy. |
| `SCREENSHOT_INVENTORY.md` | Which TAS captures are usable, with seeded-demo-data caveats. |
| `SOURCE_BIBLIOGRAPHY.md` | What is reference-only vs. repo-owned. No government logos, no portal seals as assets. |
| `technical_stack_recommendation.md` | "Static or SSR site with minimal client JavaScript … semantic HTML, CSS variables, responsive images, reduced-motion … avoid heavy animation libraries." |
| `suggested_sitemap.md` | Canonical 8-route sitemap (Home → Contact). |
| `suggested_component_map.md` | Component inventory for the build. |
| `suggested_asset_usage.md` | Which motif belongs on which page. |
| `suggested_animation_map.md` | Motion budget per section (parallax ≤ 10 px, single-pulse, 40 ms stagger). |
| `suggested_copy_blocks.md` | Pre-approved hero / TAS / local-first / issuer-side / CTA copy. |
| `deployment_and_qa_notes.md` | QA gates: visual QA across breakpoints, no horizontal overflow, claim-register compliance, no sensitive content in screenshots, privacy copy on forms, no public exposure of TAS backend. |

### 3c. Stage-4 internal QA report

`project/_dev/QA_REPORT.md` — final claim/visual/responsive/a11y/perf audit from Stage 4. Confirms the canonical sitemap (8 public pages + 1 internal Design System page) and lists every QA-driven copy correction. **Authoritative for final wording**, but file itself stays internal.

---

## 4. Public-Safe Assets

The following are repo-owned, originally generated for KRISEVA, and approved by Stage 4 for public deployment:

### Brand (`project/assets/brand/`)
- `kriseva-favicon.svg`
- `kriseva-mark.svg`, `kriseva-mark-light.svg`
- `kriseva-logo-dark.svg`, `kriseva-logo-light.svg`
- `kriseva-lockup-horizontal.svg`, `kriseva-lockup-horizontal-light.svg`
- `kriseva-og.svg`

### Motifs (`project/assets/motifs/`) — 10 generated original SVGs
- `tender-bundle-stack.svg`
- `portal-to-brief-pipeline.svg`
- `source-linked-extraction.svg`
- `compliance-matrix-mini.svg`
- `bid-review-skip-panel.svg`
- `evidence-trail-line.svg`
- `local-first-boundary.svg`
- `issuer-side-roadmap.svg`
- `procurement-command-layer.svg`
- `founder-field-notes-card.svg`

### Photos (`project/assets/photos/`)
- `founder-ayush.png`

### TAS UI screenshots (`project/assets/screenshots/`) — **REVIEW BEFORE USE**
Per `SCREENSHOT_INVENTORY.md`, these are real `http://127.0.0.1:8000` captures and may include **seeded demo/local database state**. Each must pass a sensitive-data review before going live. Seven captures available:
- `01_home_dashboard.png` (route `/home`)
- `02_queue_tender_list.png` (route `/queue`)
- `03_tender_briefing_recommendation.png` (route `/briefing/demo_003_e7b461`)
- `04_bundle_source_evidence.png` (route `/bundle/demo_003_e7b461`)
- `05_sources_import_status.png` (route `/sources`)
- `06_settings_local_first_boundary.png` (route `/settings/the-boundary`)
- `09_history_decisions.png` (route `/history`)

(`07` and `08` exist in `uploads/` but were not promoted into `assets/screenshots/` and per the inventory `08_settings_library_import.png` is a duplicate; treat both as research-only.)

### External (must be referenced via build pipeline)
- Google Fonts: **Libre Baskerville**, **Inter**, **JetBrains Mono**. Self-host or `<link>` per the prototype; do not bundle webfont binaries from third-party CDNs without license check.

---

## 5. Files / Folders That MUST NOT Be Deployed

Anything in this list must be excluded from the production build output and excluded from the published Git artifact (via `.gitignore` for build outputs and via deploy-time copy rules for source). If the host is GitHub Pages or similar that publishes from a branch, these paths must live outside the publish root.

| Path | Why excluded |
|---|---|
| `chats/` (all 16 transcripts) | Raw founder/agent transcripts, internal positioning, unredacted reasoning. **Never publish.** |
| `project/_dev/` | Internal sandbox: design-system explorations, decision-panel prototypes, dossier-card variants, contact-form drafts, `QA_REPORT.md`. Internal only. |
| `project/screenshots/` | Stage-4 dev/QA screenshots of the design prototype itself (homepage iterations). Not product proof; not for public site. |
| `project/uploads/` | Source-of-truth research pack: `CLAIM_REGISTER.md`, `EXECUTIVE_SUMMARY.md`, `RESEARCH_LIMITATIONS.md`, `SCREENSHOT_INVENTORY.md`, `SOURCE_BIBLIOGRAPHY.md`, `NEXT_AGENT_INSTRUCTIONS.md`, technical/stack/sitemap/component/animation/copy/asset notes, founder docx, ChatGPT image, duplicate screenshots, miscellaneous SVG drafts. Internal only. |
| `project/uploads/*.docx` | `KRISEVA AI - Founder and Contact Details.docx` — internal source doc. |
| `project/uploads/ChatGPT Image *.png` | External tool output, not an approved asset. |
| `project/*.jsx`, `project/KRISEVA *.html` (the React+Babel prototypes), `project/styles.css` | Useful as reference inputs for Stage 5. The CDN-loaded React prototype must not be deployed as the public site. The Stage-5 build will produce its own static output that derives from these files but does not include their runtime. |
| Any TAS backend route, port, or admin URL | `http://127.0.0.1:8000` and any subroute (`/home`, `/queue`, `/briefing/*`, `/bundle/*`, `/sources`, `/settings/*`, `/history`, `/health/runtime`) belong to the local TAS app and **must not** be linked from, embedded in, or proxied through the public website. |
| Any government portal logo, seal, or captured screenshot | Per `SOURCE_BIBLIOGRAPHY.md` — public portals are reference-only. |
| Future Claude Design bundler artifacts | If any later asset re-import introduces `Unpacking…`, `__bundler/manifest`, `__bundler/template`, or blob loaders, strip them before they enter `website/`. |

A `.gitignore` plus a documented "publish root = `website/dist/`" rule will enforce this; specifics are part of the actual scaffold step.

---

## 6. Recommended Stage 5 Implementation Path

### 6a. Site location
**New `website/` directory at the repo root.** No existing app to reuse; the prototype is in `project/` and stays there as input. This keeps Stage 5 hermetic and reversible.

```
website/
├── package.json
├── (framework config files)
├── public/                   # static passthrough: brand SVGs, motifs, photos, OG image, robots.txt, sitemap.xml
├── src/
│   ├── pages/                # one route per sitemap entry
│   ├── components/           # nav, footer, badges, dossier card, decision panel, evidence trail, etc.
│   ├── styles/               # tokens.css (extracted from project/styles.css), global.css, per-component co-located styles
│   └── data/                 # copy blocks pulled from suggested_copy_blocks.md + per-page JSX
└── README.md                 # build/run/deploy instructions
```

### 6b. Recommended framework: **Astro**
Best fit for the constraint set ("static or SSR with minimal client JavaScript … semantic HTML, CSS variables, responsive images, reduced-motion support … avoid heavy animation libraries"):

- Ships zero JS by default; per-component opt-in islands for the hamburger nav and the IntersectionObserver scroll-reveal.
- Native MDX/Markdown for the founder note + claim disclaimers, without buying into a full React runtime.
- First-class image optimisation (`<Image>` for `founder-ayush.png` and the TAS captures).
- Static output → host on any static target (Cloudflare Pages, Netlify, GitHub Pages, S3+CloudFront).
- The existing `*.jsx` section files port near-1:1 into `.astro` components, so the Stage-4 copy/structure carries forward without re-derivation.

**Acceptable alternates**, in order of preference if Astro is rejected:
1. **Eleventy (11ty) + tokens-only CSS** — even less JS; needs hand-rolled component layer.
2. **Next.js with `output: 'export'`** — fine, but heavier than the brief asks for.
3. **Vanilla multi-file HTML/CSS/JS** — viable (the standalone `KRISEVA Founder.html` proves the pattern), but maintainability degrades fast across 8 pages with shared nav/footer/CSS.

### 6c. Sitemap (canonical, from `suggested_sitemap.md` + `_dev/QA_REPORT.md`)
| Route | Source page | Priority |
|---|---|---|
| `/` | `KRISEVA Homepage.html` | P0 |
| `/tas` | `KRISEVA TAS.html` | P0 |
| `/workflow` | `KRISEVA Workflow.html` | P0 |
| `/security` | `KRISEVA Security.html` | P0 |
| `/issuer-roadmap` | `KRISEVA Issuer.html` | P1 |
| `/validation` | `KRISEVA Validation.html` | P1 |
| `/founder` | `KRISEVA Founder.html` | P0 |
| `/contact` | `project/_dev/KRISEVA Contact.html` + `project/_dev/contact-*.jsx` | P0 |

Internal-only `KRISEVA Design System.html` does **not** ship; it remains in `_dev/` as an internal reference.

### 6d. Build phases (for the actual Stage 5 run)
1. **Scaffold** — `npm create astro@latest website -- --template minimal --typescript strict --install --git no`. Wire `tokens.css` from `project/styles.css`. Add `Layout.astro` with shared nav + footer. Configure `astro:image`, set `site` URL, add sitemap + RSS plugins (sitemap only).
2. **Shared components** — port `KrisevaNav`, `KrisevaFooter`, `SectionLabel`, `Badge`, `CtaGroup`, `WorkflowStep`, `CapCard`, `ScreenshotFrame` from `shared.jsx` into Astro components.
3. **Page ports**, in priority order: `/founder` → `/` → `/tas` → `/workflow` → `/security` → `/contact` → `/validation` → `/issuer-roadmap`. Each port reads its three JSX section files + the QA-corrected copy and outputs a static page.
4. **Asset migration** — copy `project/assets/{brand,motifs,photos}` into `website/public/assets/`. Run sensitive-data review on `project/assets/screenshots/`; promote only the cleared captures.
5. **Claim QA** — every CTA, headline, body paragraph, badge, footer line cross-checked against `CLAIM_REGISTER.md` before merge. Use `_dev/QA_REPORT.md` as the diff reference.
6. **Deployment QA** — desktop / tablet / mobile visual QA, no horizontal overflow, reduced-motion verified, axe-core run, OG image set, favicon set, `robots.txt` + `sitemap.xml` emitted, contact form privacy copy live before the form is wired to anything live.
7. **Hosting decision** — recommend Cloudflare Pages (zero-cost, global edge, built-in `_headers`/`_redirects`). Confirmed acceptable since the public site is static and unauthenticated.

### 6e. Out of scope for Stage 5
- Wiring the contact form to a real backend. Stage 5 ships the form with `mailto:` fallback + a documented endpoint stub. Live submissions require privacy-policy + DPA review per `deployment_and_qa_notes.md`.
- Any embed of the local TAS app, `/health/runtime`, or any `127.0.0.1:8000` route.
- Any pricing page (`README.md` of the research pack: "No pricing page").
- Any issuer-side page that frames issuer-side intelligence as a launched product.

---

## 7. Risks & Assumptions

### Risks
| # | Risk | Mitigation |
|---|---|---|
| R1 | Drift from `CLAIM_REGISTER.md` during the port | Every page must include a per-page claim audit checklist in its PR description. Block merge if any "Do not publish yet" row is matched. |
| R2 | TAS demo data leaking via screenshots (R2 is the highest practical risk) | Sensitive-data review pass before any screenshot enters `website/public/`. If unsure, replace with motif SVG. |
| R3 | Government portal logos accidentally introduced via screenshot reuse | Hard rule: only the 7 cleared TAS captures + 10 motif SVGs + brand SVGs + founder portrait may appear on the public site. |
| R4 | Adopting a heavier framework than the brief allows ("avoid heavy animation libraries") | Recommended stack (Astro) chosen specifically to honour this; reject any PR that adds Framer Motion, GSAP, Lottie, or React full-runtime imports without an explicit decision in `docs/`. |
| R5 | Implementer treats `KRISEVA Founder.html` (the standalone artifact) as the deployment target | This document. The standalone file is reference content for the `/founder` route only. |
| R6 | `chats/`, `_dev/`, `uploads/` accidentally included in the publish root | Astro's publish root is `dist/`. None of those directories are inputs to Astro by default. Add a deploy-time safety check that fails the build if any of those names appear under `dist/`. |
| R7 | Internal TAS routes accidentally linked from the public site | Lint rule: search `dist/**/*.html` for `127.0.0.1`, `:8000`, `/queue`, `/briefing/`, `/bundle/`, `/health/`, `/settings/`, `/sources`, `/history` and fail the build on hit. |

### Assumptions
| # | Assumption |
|---|---|
| A1 | Stage 5 runs in this repo, not a separate one. The `website/` directory will live alongside `project/`, `chats/`, `docs/`. |
| A2 | The user wants a real production website, not another standalone HTML page. The standalone `KRISEVA Founder.html` is reference content; the real `/founder` route will be rebuilt as part of Stage 5 from the same Stage-4 inputs. |
| A3 | Hosting target is static (Cloudflare Pages or equivalent) unless the user later requests SSR for a contact-form backend. |
| A4 | Google Fonts via `<link>` is acceptable for now; a self-hosted-fonts pass is a future hardening step, not Stage 5 P0. |
| A5 | Custom domain `kriseva.in` will be repointed once Stage 5 ships. The current `kriseva.in` GoDaddy/Airo surface (per `SOURCE_BIBLIOGRAPHY.md`) is not a constraint. |
| A6 | The user, not this agent, decides when Stage 5 actually starts. This file is a precondition; it does not authorise the build. |

---

## 8. Outcome of Preflight

- Repo audited; no destructive operations required or attempted.
- No production framework detected; safest path is a new `website/` directory using Astro.
- A placeholder `website/` directory was created (`website/README.md` only) so the location is reserved and visible in `git status`. No source files, no config, no dependencies were added.
- The standalone `project/KRISEVA Founder.html` is preserved on disk as a reference artifact for the `/founder` route port.
- The user's go-ahead is required before scaffolding the Astro project and beginning the page ports.
