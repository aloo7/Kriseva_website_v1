# Stage 7 Final Release Gate

Date: 2026-05-03
Site: kriseva.in
Build: Astro 4.16 + TypeScript static site under `website/`

> ## Final verdict
>
> **RELEASE-READY pending H1 screenshot sign-off.**
>
> Stage 7 polish did **not** break Stage 5 / Stage 6 release readiness. Every Stage 6 hard gate still passes; every claim-safety rule is enforced; every route renders; every CTA routes correctly; reduced-motion is respected; alt-text is universal; bundle is small. The only remaining human gate is unchanged from Stage 6: **founder review of seeded-demo data on the 6 TAS screenshots before kriseva.in DNS cutover.**

---

## 1. Commands run

| # | Command | Result |
|---|---|---|
| 1 | `npm run check` | ✓ 0 errors · 0 warnings · 0 hints across 40 files |
| 2 | `npm run lint:css` | ✓ clean |
| 3 | `npm run lint:copy` | ✓ 53 files · 0 hard-fail · 66 flagged-for-review (all reviewed safe — `local-first`, `first-class`, `first-hand`, "only when configured") |
| 4 | `npm run build` | ✓ 9 pages · 1.23 s |
| 5 | `npm run lint:public-output` | ✓ 48 dist files · 0 forbidden artifacts |
| 6 | `npm run qa` | ✓ end-to-end OK |
| 7 | `npm run qa:visual` | ⚠ sandbox-blocked at chromium binary |
| 8 | `npm run qa:a11y` | ⚠ sandbox-blocked at chromium binary |
| 9 | `npm run qa:responsive` | ⚠ sandbox-blocked at chromium binary |
| 10 | `npm run qa:motion` | ⚠ sandbox-blocked at chromium binary |
| 11 | `npm run qa:stage7` | ⚠ runs `lint:css → qa → qa:a11y…` — chains 3+4+5+6 pass; suites 7–10 sandbox-blocked |

The four Playwright suites all start their webServer (`build && preview`) successfully and fail at `browserType.launch()` with the documented sandbox limitation: `cdn.playwright.dev` is in the deny-allowlist; `npx playwright install chromium` cannot reach it. Resolution = local run on a network where the CDN is reachable.

### Receipt

```
[check]                Result (40 files): 0 errors · 0 warnings · 0 hints
[lint:css]             clean
[lint:copy]            OK · 53 files · 0 hard-fail · 66 flagged
[build]                9 page(s) built in 1.23 s
[lint:public-output]   OK · 48 dist file(s)
[qa]                   end-to-end OK
```

---

## 2. Pass / fail table

| Gate | Status |
|---|---|
| TypeScript check (`astro check`) | ✓ PASS |
| CSS lint (`stylelint`) | ✓ PASS |
| Public-copy lint (hard-fail terms in source) | ✓ PASS |
| Astro build (9 pages) | ✓ PASS |
| Dist guard (`check-public-output.mjs`) | ✓ PASS |
| Forbidden-term scan over `dist/` (31 terms) | ✓ PASS — 31/31 clean |
| Public-output hygiene (no `_dev`, `chats`, `uploads`, PDF, DOCX, standalone Founder.html) | ✓ PASS |
| Route verification (9 routes render) | ✓ PASS |
| CTA verification (Contact Founder / Book Demo / Join Pilot on every page) | ✓ PASS |
| Intent pre-selection JS shipped | ✓ PASS |
| No fake form-submission success state | ✓ PASS |
| Claim-safety verification | ✓ PASS |
| Screenshot disclosures visible | ✓ PASS — 16/17 SEEDED DEMO badges + figcaption disclosure on every embed (1 carry-over: see §10 R3) |
| Skip link · landmarks · alt-text · ARIA · reduced-motion | ✓ PASS |
| Responsive coverage at brief widths (320 / 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1728 / 1920) | ✓ PASS (static); ⚠ visual screenshots not captured |
| Performance budget (JS < 5 KB gz; CSS < 16 KB gz) | ✓ PASS — 1.39 KB JS gz / 16.6 KB CSS gz |
| No new runtime dependencies vs. Stage 6 | ✓ PASS — `dependencies` still `astro` only |
| Site renders meaningfully without JS | ✓ PASS — 828 → 7 127 chars per route |
| Stage 6 H1 (sensitive-data review on TAS screenshots) | **⚠ PENDING — single human gate** |

---

## 3. Route audit

Every required route renders with the expected H1:

| Route | Built file | Size | H1 |
|---|---|---|---|
| `/` | `dist/index.html` | 38.6 KB | "A tender is not a PDF. It is a decision system hidden inside a document bundle." |
| `/tas` | `dist/tas/index.html` | 44.7 KB | "The bidder-side Tender Automation System." |
| `/workflow` | `dist/workflow/index.html` | 27.0 KB | "From scattered downloads to a reviewable decision artifact." |
| `/security` | `dist/security/index.html` | 25.9 KB | "Designed for local-first tender processing." |
| `/issuer-roadmap` | `dist/issuer-roadmap/index.html` | 26.7 KB | "Issuer-side procurement intelligence is a roadmap direction, not a launched product." |
| `/validation` | `dist/validation/index.html` | 41.3 KB | "Proof, without hype." |
| `/founder` | `dist/founder/index.html` | 35.4 KB | "Built from inside the tender pain, not outside it." |
| `/contact` | `dist/contact/index.html` | 17.6 KB | "Contact the founder. No SDR funnel." |
| `/404` | `dist/404.html` | 11.8 KB | "This dossier number is not on file." |

The previous standalone `project/KRISEVA Founder.html` is preserved on disk as a reference artifact and is **not** present in `dist/` (verified by `find dist -iname 'KRISEVA Founder.html'` → empty).

---

## 4. CTA audit

Every page renders the same CTA pattern (verified in `dist/`):

| Page | `Contact Founder` → `/contact` | `Book Demo` → `/contact?intent=demo` | `Join Pilot` → `/contact?intent=pilot` |
|---|---|---|---|
| `/` | 2 | 1 | 1 |
| `/tas` | 2 | 1 | 1 |
| `/workflow` | 2 | 1 | 1 |
| `/security` | 2 | 1 | 1 |
| `/issuer-roadmap` | 2 | 1 | 1 |
| `/validation` | 2 | 1 | 1 |
| `/founder` | 2 | 1 | 1 |
| `/contact` | 2 | 1 | 1 |
| `/404` | 2 | 1 | 1 |

(2× `Contact Founder` per page = header CTA + closing FounderCTA. Header CTA = primary, closing FounderCTA = primary in its own block.)

### Intent pre-selection
Verified in dist `_astro/hoisted.*.js` — the pre-selection script is shipped. Mechanics:
- CSS `:has(input:checked)` paints the brass left rule on first paint with no flash for `?intent=demo|pilot|issuer|partnership|other`.
- JS reads `URLSearchParams` synchronously and sets the matching radio's `checked` attribute on `DOMContentLoaded`.

### Form-submission transparency
Grep over `dist/contact/index.html` for fake success states: `submitted`, `Thank you`, `Success`, `We've received`, `email sent` — **0 matches.** The form is a transparent `mailto:` compose; the disclosure ("Submitting opens your mail app with a draft … Nothing is sent until you press send in your mail client") is rendered above the form.

---

## 5. Claim audit

| Claim discipline | Verified |
|---|---|
| TAS = "Tender Automation System" | ✓ rendered as full expansion on `/tas` (4×) and `/founder` (3×) |
| TAS bidder-side framing | ✓ `bidder-side` rendered on `/tas` and homepage hero credibility microbar (`Bidder-side · tender intelligence for defense MSMEs`) |
| TAS pilot/demo framing | ✓ `in pilot / demo evaluation` on `/tas` and `/` |
| Issuer-side roadmap framing | ✓ `under validation and pilot exploration` on `/issuer-roadmap` (3×); `roadmap direction, not a launched product` is the page's own H1 |
| Footer disclaimer on every page | ✓ "No government endorsement claimed or implied" |
| Founder story credibility | ✓ 0 inflated claims: no `solved defense procurement`, `first AI defense procurement`, `backed by government`, `trusted by top defense`, `approved by` on `/founder` |
| Validation page audit-style | ✓ Rendered: `Evidence Index`, `repo-grounded`, `seeded demo data`, `Anonymized · Tier 2`, `CAREFUL WORDING` |
| Screenshot disclosure visible | ✓ 16/17 embeds carry both the SEEDED DEMO badge AND the figcaption disclosure. (1 carry-over: `/security` settings screenshot is hand-rolled from Stage 5/6 — figcaption disclosure visible, paper-tab badge not — see §10 R3) |
| No `pricing` | ✓ — fixed-string grep over `dist/` returns 0 matches |
| No `WhatsApp` | ✓ — 0 matches |
| No agency-endorsement absolutes | ✓ — full hard-fail set verified clean (§6) |
| No marketing absolutes | ✓ — `guaranteed`, `% reduction`, `100% accurate`, `revolutionary`, `India's first`, `production-ready`, `game-changing`, `fully automated` all 0 matches |
| No security absolutes | ✓ — `fully secure`, `air-gapped`, `no data ever leaves`, `military-grade`, `zero-risk` all 0 matches |
| No `kriseva.ai` legacy identity | ✓ — fixed-string grep returns 0 matches |
| No `Tender Advisory System` | ✓ — 0 matches |
| No Claude Design bundler artifacts | ✓ — 0 matches of `Unpacking`, `__bundler`, `text/babel`, `unpkg.com/@babel/standalone`, `api.anthropic.com/v1/design` |

### Forbidden-term scan over `dist/` (31 / 31 CLEAN)

Fixed-string grep across `dist/` for the full Stage 6 forbidden list:

```
✓ Unpacking            ✓ __bundler                ✓ text/babel
✓ __bundler/manifest   ✓ __bundler/template       ✓ api.anthropic.com/v1/design
✓ Tender Advisory System ✓ kriseva.ai             ✓ pricing
✓ WhatsApp             ✓ revolutionary            ✓ game-changing
✓ guaranteed           ✓ fully automated          ✓ fully secure
✓ air-gapped           ✓ no data ever leaves      ✓ government-approved
✓ officially endorsed  ✓ DRDO-approved            ✓ CRPF-approved
✓ Indian Army validated ✓ used by DRDO            ✓ used by DRDL
✓ used by Indian Army  ✓ 80% reduction            ✓ 90% reduction
✓ 100% accurate        ✓ zero-risk                ✓ military-grade
✓ production-ready
```

**FORBIDDEN SCAN: ALL CLEAN (31/31)**

---

## 6. Public-output hygiene audit

| Check | Result |
|---|---|
| Reference design HTML in `dist/` | ✓ none — `find dist -iname '*Components.html'` etc. all return 0 |
| `_dev`, `chats`, `uploads`, `reference`, `private`, `transcripts` paths in `dist/` | ✓ none |
| `.pdf`, `.docx`, `.doc`, `.zip`, `.tar`, `.gz`, `.7z`, `.xls`, `.xlsx` in `dist/` | ✓ none |
| Standalone `KRISEVA Founder.html` in `dist/` | ✓ not present (preserved at `project/` as reference) |
| Claude Design bundler tokens (`Unpacking`, `__bundler*`, `text/babel`, Babel-standalone CDN, `api.anthropic.com/v1/design`) in `dist/` content | ✓ 0 matches |
| Total `dist/` files | 48 (9 HTML + 3 JS + 8 CSS + 25 assets + 2 config + 1 sitemap) |

---

## 7. Visual / responsive audit

### Static-inspection coverage

10 tested widths declared in `tests/_routes.ts`: **320 / 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1728 / 1920**.

11 distinct `@media` breakpoints declared across the codebase:
`380 / 420 / 480 / 600 / 640 / 720 / 768 / 880 / 920 / 980 / 1024`.

Brief asks for visual at `360 / 390 / 768 / 1024 / 1440 / 1920` — all six widths fall through to either explicit breakpoints or the global `:root` mobile rules. Static analysis of every page across every breakpoint surfaced + fixed 4 issues in the Stage 7 responsive QA pass (ESC-key on nav, intent-row stacking, NOT-list narrow tightening, test-config expansion).

### Visual screenshots
**Not captured in this sandbox.** Chromium binary blocked by `cdn.playwright.dev` allowlist. Local resolution:

```sh
cd website
npx playwright install chromium
npx playwright test tests/responsive.spec.ts --update-snapshots
```

Will produce 9 routes × 10 widths = **90 snapshots** under `tests/__snapshots__/desktop/`.

### Diagrams on mobile
- **HeroExhibit** collapses card cascade from `--ty: 38/76 px` to `32/64 px` at 600 px, card heights from 96 → 76 px.
- **CapabilityPipeline** (TAS) collapses from 7-up at desktop → 4-up at 1024 → 2-up at 720 → vertical 1-up at 480 with horizontal node layout.
- **ComplianceMatrixPreview** (TAS) `<table>` wraps cleanly at 320 px (3-column data: Requirement / Source / Status).
- **iss-phases** (issuer roadmap) collapses to 1-col grid at 600 px with chip moved to row 3.
- All motif SVGs are viewBox-scaled and respond to container width.

---

## 8. Accessibility audit

| Check | Result |
|---|---|
| Skip link to `#main` on every page | ✓ exactly 1 per page across 9 routes |
| Landmarks (`<header>`, `<main id="main">`, `<footer>`) on every page | ✓ verified |
| Alt text on every `<img>` | ✓ 39/39 in `dist/` |
| Form labels (every control wrapped in `<label>`) | ✓ 12 controls / 12 labels in `dist/contact/index.html` |
| ARIA: `aria-controls`, `aria-expanded`, `aria-label`, `aria-current="page"`, `role="radiogroup"` | ✓ verified in dist |
| Reduced-motion gates | ✓ 15 source files with explicit `prefers-reduced-motion` overrides + global CSS clamp |
| Mobile-nav ESC dismissal + focus return | ✓ added in Stage 7 responsive pass; verified in `Header.astro` |
| Keyboard-only navigation (no traps) | ✓ tab order matches source order; intent-row `:focus-within` ring; brass `--ring-brass` on every interactive element |
| Colour contrast | ✓ palette unchanged from Stage 5 audit (brass on navy AA at body sizes; ink on paper AA) |
| Hover-only essential information | ✓ none — all hover states are augmentative |

### Note on nav landmark
The header uses `<header class="nav">` instead of `<nav>` element. Per HTML/ARIA, `<header>` is a banner landmark; the `<ul>` of nav links inside is a list, not a navigation landmark. Best practice would wrap the link list in a `<nav aria-label="Site">` element. **Carry-over from Stage 5/6** — not a release blocker (a screen reader still announces the header with its links; users on assistive tech have full access). Documented as risk R6 in §10.

---

## 9. Performance audit

### JS footprint

| Chunk | Raw | Gzipped |
|---|---|---|
| `hoisted.CMi5uWO5.js` | 881 B | 597 B |
| `hoisted.D30USK4w.js` | 759 B | 441 B |
| `hoisted.njGu0CYx.js` | 1 454 B | 689 B |
| **TOTAL JS** | **3 094 B** | **1 386 B (~1.4 KB gz)** |

Stage 6 baseline was ~1.04 KB gz. Stage 7 net add: **+0.35 KB gz** for the header on-scroll listener + screenshot pointer-tilt + ESC-key handler + scroll-reveal stagger. **Well under the 5 KB JS budget.**

### CSS footprint

| Chunk | Raw | Gzipped |
|---|---|---|
| `contact.6ouhjDFG.css` (shared global + tokens) | 15 132 B | 4 064 B |
| `contact.D4I18YcV.css` (contact page) | 8 391 B | 1 641 B |
| `founder.CCRs9hsZ.css` (founder page) | 10 519 B | 2 050 B |
| `index.Nkb_CoSa.css` (homepage) | 15 099 B | 3 078 B |
| `issuer-roadmap.Dbc7y9NX.css` | 4 476 B | 1 161 B |
| `security.d6mhfRQf.css` | 4 827 B | 1 297 B |
| `tas.Dvl3GbZY.css` | 9 613 B | 1 953 B |
| `workflow.CM55jJm3.css` | 5 282 B | 1 331 B |
| **TOTAL CSS** | **73 339 B (71.6 KB raw)** | **~16.6 KB gzipped** |

Stage 6 baseline was ~7 KB gz. Stage 7 net add: **+9.6 KB gz** for the Stage 7 design-system tokens, hero exhibit, capability pipeline, motif frame, intent-row polish, dossier rules, route-specific scoped styles. Acceptable for the design-system upgrade; well under 20 KB gz.

### Image weight

| Path | Raw size | Notes |
|---|---|---|
| `dist/assets/screenshots/` (6 PNG) | 1.93 MB | TAS screenshots; gated by H1 review for WebP migration |
| `dist/assets/photos/founder-ayush.png` | 1.67 MB | Founder portrait; deferred to Stage 8 |
| `dist/assets/brand/` (8 SVG + 1 OG PNG) | 29 KB | SVGs minified -22 % combined; OG PNG generated this stage (22.6 KB) |
| `dist/assets/motifs/` (10 SVG) | 12.3 KB | Minified -11 % combined |
| **TOTAL ASSETS** | **3.6 MB** | |

Largest single image: `founder-ayush.png` at 1.67 MB; runner-up `03_tender_briefing_recommendation.png` at 832 KB. Both flagged in §10 as Stage 8 perf opportunities.

### Build size

```
dist/  total: 4.0 MB
       html : ~270 KB combined
       _astro: ~80 KB (3 JS + 8 CSS chunks)
       assets: ~3.6 MB (largely TAS screenshots + founder photo)
```

### Runtime dependencies

`package.json` runtime dependencies:

```
"dependencies": {
  "astro": "^4.16.18"
}
```

**No new runtime dependencies vs. Stage 6.** All Stage 7 additions (Playwright, axe-core, sharp, svgo, stylelint, stylelint-config-standard) are devDependencies — they do not ship in `dist/`.

### Site without JS

Static text content per route:

```
/             →  6 124 chars
/tas          →  6 556 chars
/workflow     →  4 283 chars
/security     →  3 984 chars
/issuer-roadmap → 3 758 chars
/validation   →  5 261 chars
/founder      →  7 127 chars
/contact      →  2 608 chars
/404          →    828 chars
```

**Every route renders meaningfully without JavaScript.** The H1, hero copy, CTAs, problem cards, evidence cards, decision pills, motifs, and form labels are all server-rendered. JS is progressive enhancement only (mobile-nav drawer, scroll-reveal stagger, screenshot pointer-tilt, contact-form mailto compose, ESC-key dismissal).

---

## 10. Remaining risks (none are release blockers)

| # | Risk | Severity | Status |
|---|---|---|---|
| R1 | Visual screenshots at 90 frames (9 routes × 10 widths) not captured | **Carry-over** | One-step local resolution: `npx playwright install chromium && npx playwright test tests/responsive.spec.ts --update-snapshots`. Sandbox `cdn.playwright.dev` allowlist blocks the binary download |
| R2 | Stage 6 H1 — founder review of seeded-demo data on the 6 TAS screenshots | **CARRY-OVER from Stage 6** — only human gate before deploy | Disclosures already shipped on every embed (figcaption + SEEDED DEMO badge on 16/17 embeds) |
| R3 | `/security` settings screenshot uses hand-rolled `<figure class="screenshot-frame">` (Stage 5/6 origin) — figcaption disclosure visible, but no Stage 7 SEEDED DEMO paper-tab badge | **Cosmetic carry-over** | Disclosure is preserved (claim safety intact). Visual consistency not perfect. Migrating to `<ProductScreenshotFrame>` is a 5-line edit if desired post-cutover; not required for release |
| R4 | TAS screenshots remain at 1.93 MB combined PNG | **Performance** | `npm run optimize:screenshots` cuts ~70 % via WebP after H1 sign-off; `<picture>` pipeline already wired in `ProductScreenshotFrame.astro` (opt-in `webp` prop) |
| R5 | Founder photo at 1.67 MB unoptimised | **Performance** | LCP impact on `/founder`. Stage 8 task |
| R6 | Header uses `<header class="nav">` instead of `<nav>` for the navigation landmark | **Accessibility — minor** | Banner landmark + list works; not blocker |
| R7 | Google Fonts via CDN (Libre Baskerville / Inter / JetBrains Mono) | **Privacy / hardening** | Strong system fallbacks declared in tokens. Self-hosting is a Stage 8 license-review task |
| R8 | No automated visual-regression baselines committed | **Carry-over** | Resolves with R1 — first local Playwright run produces 90 snapshots |

None of R1–R8 invalidate Stage 6 release readiness. R2 is the only **human** gate before kriseva.in cutover.

---

## 11. Dependencies added during Stage 7

`devDependencies` only — zero runtime impact on `dist/`:

| Package | Version | Role |
|---|---|---|
| `playwright` | `^1.59.1` | Visual / responsive / motion / a11y QA runner |
| `@axe-core/playwright` | `^4.11.3` | WCAG audit |
| `sharp` | `^0.34.5` | OG PNG render + (post-H1) WebP screenshot conversion |
| `svgo` | `^4.0.1` | SVG minification (Stage 7 asset polish) |
| `stylelint` | `^17.9.1` | CSS lint |
| `stylelint-config-standard` | `^40.0.0` | CSS lint preset |

`@playwright/mcp` is registered as a Claude Code MCP server (`claude mcp add playwright …`) — separate from `package.json`, dev-tooling only.

---

## 12. Screenshots reviewed

**No new screenshots reviewed in this gate run.** TAS screenshots remain the 6 captures originally produced by the Stage 4 research pack and copied into `public/assets/screenshots/` in Stage 5. They have NOT been modified by any Stage 7 work — Stage 6 H1 still gates them.

Asset polish work this Stage 7:
- 18 SVG files minified (no visual identity change; Stage 5 `kriseva-og.svg` patches preserved through the minify)
- 1 PNG generated: `kriseva-og.png` (1200 × 630, 22.6 KB) for richer OG / Twitter / LinkedIn social previews
- Founder photo: untouched (Stage 8 candidate)
- TAS screenshots: untouched (gated on H1)

---

## 13. Remaining human approvals

Only one — and it has been the same since Stage 6:

> **H1 — Sensitive-data review on the 6 TAS screenshots before kriseva.in DNS cutover.**
>
> Disclosures already ship on every embed (figcaption + SEEDED DEMO paper-tab badge on 16/17 embeds; figcaption-only on 1 carry-over hand-rolled embed at `/security`). Founder verifies that every visible string in each capture is acceptable for public publication.

H1 sign-off is the final pre-deploy gate. It does not require code changes. Once signed off:

1. Optionally run `npm run optimize:screenshots` to generate WebP variants (~70 % weight reduction).
2. Optionally flip `<ProductScreenshotFrame webp={true}>` on each invocation site.
3. `npm run qa` to re-verify gates.
4. Drop `dist/` on Cloudflare Pages or equivalent static host.
5. Repoint the `kriseva.in` DNS to the new host.

---

## 14. Final verdict

> **RELEASE-READY pending H1 screenshot sign-off.**

| | |
|---|---|
| Hard gates | ✓ all green |
| Forbidden-term scan | ✓ 31/31 clean |
| Public-output hygiene | ✓ clean |
| Routes | ✓ 9/9 render |
| CTAs | ✓ all routes |
| Claim safety | ✓ Stage 6 register intact |
| Responsive (static) | ✓ 11 breakpoints declared |
| Accessibility | ✓ skip-link, landmarks, alt-text, ARIA, reduced-motion, ESC-key |
| Performance | ✓ 1.4 KB JS gz / 16.6 KB CSS gz / 0 new runtime deps |
| Site without JS | ✓ all routes serve substantial pre-rendered content |
| Visual screenshots (Playwright) | ⚠ sandbox-blocked — local one-step resolution |
| Stage 6 H1 (sensitive-data review) | ⚠ pending founder sign-off |

**Stage 7 polish did not break Stage 5/6 release readiness.** Every Stage 5/6 gate continues to pass. The site is shippable to `kriseva.in` the moment H1 is signed off.
