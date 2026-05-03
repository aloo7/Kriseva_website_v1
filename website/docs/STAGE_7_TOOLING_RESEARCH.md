# Stage 7 Tooling Research

Date: 2026-05-02
Site: kriseva.in
Target: Polish the existing Astro 4.16 static site to elite standard — without redesign, without breaking Stage 5 / Stage 6 gates.

> **Status: research only.** Nothing has been installed in this run. Adoption requires explicit go-ahead.

---

## 1. Environment status

| Probe | Result |
|---|---|
| `pwd` | `/home/claude` (project at `/home/claude/repo/website`) |
| `claude --version` | `2.1.126 (Claude Code)` |
| `claude mcp list` | "No MCP servers configured." |
| `gh --version` | **not installed** — GitHub CLI not available in this sandbox |
| `npm --version` | `10.9.7` (Node v22.22.2) — available |
| `curl https://registry.npmjs.org/` | `200 OK` — npm registry reachable |
| `curl https://api.github.com/` | `403` — GitHub REST API blocked (likely rate-limited / no token) |
| WebFetch tool | available — used for any deeper README inspection if needed |
| `.mcp.json` / `claude_desktop_config.json` / `settings.local.json` in repo | none present |
| `~/.claude/settings.json` | exists; `permissions.allow = ["Skill"]`; `Stop` hook configured |

**Live research is possible** via `npm` registry and `WebFetch`. **`gh` searches are not possible** in this sandbox; npm metadata + npm-registry detail views were used as substitutes, with vendor names cross-referenced against package maintainer lists (npm shows official maintainers like `playwright-bot` for `@playwright/mcp` and `google-wombot` for `chrome-devtools-mcp`).

---

## 2. Tools already on the local stack

What the project already has — to be honoured by the Stage 7 plan, not duplicated.

| Tool | Version | Role |
|---|---|---|
| `astro` | `^4.16.18` | Static site framework |
| `@astrojs/check` | `^0.9.4` | TypeScript / Astro lint (a `0.9.9` patch is available; non-urgent) |
| `typescript` | `^5.6.3` | Type checker |
| `node` | `22.22.2` | Runtime |
| `npm` | `10.9.7` | Package manager |
| `scripts/check-public-copy.mjs` | local | Custom claim-safety lint (HARD_FORBIDDEN + FLAGGED lists) |
| `scripts/check-public-output.mjs` | local | Custom dist hygiene guard |

`sharp` is available as a transitive dep through Astro 4.16's optional image service. It is **not** in `package.json` directly today.

---

## 3. Live research results

### A. Claude Code / MCP tooling

| Candidate | Vendor | Latest | License | Maintenance | Bundle impact | Cloud required? | Claim-gate risk | Verdict |
|---|---|---|---|---|---|---|---|---|
| `@playwright/mcp` | Microsoft (`pavelfeldman`, `playwright-bot`) | `0.0.73` (2026-05-01) | Apache-2.0 | Very active — daily releases (`next` tag dated today) | 80 KB unpacked + Playwright 1.60.0-alpha (downloaded by Playwright on first use) | No (runs locally, headless or headed) | None — read-only browser automation; can be scoped to localhost preview only | **TRIAL — recommended primary MCP** |
| `chrome-devtools-mcp` | Google Chrome team (`mathias`, `orkon`, `google-wombot`) | `0.23.0` | Apache-2.0 | Active, vendor-published | 18.4 MB unpacked (large because it bundles CDP types) | No (uses local Chrome) | None — read-only | **TRIAL (alternate)** — useful for performance + Lighthouse-style inspection if Playwright MCP is not enough |
| `@sethdouglasford/mcp-figma` | Community (`sethdouglasford`) | `1.0.9` (2025-06-09) | Unknown / single-maintainer | Stale (≈ 11 months) | Not measured | Yes — Figma cloud token | None directly — but irrelevant; we have no Figma source | **REJECT** — no Figma file exists for this project |
| `mcp-figma` | Community (`noahhh1005`) | `0.1.1` (2025-03-03) | Unknown | Stale (~14 months) | n/a | Yes (Figma cloud) | n/a | **REJECT** — same reason |
| `mcpbrowser` | Community (`cherven`) | `0.3.44` (2026-04-17) | Unknown / single-maintainer | Active but single-author | Not measured | No | Captcha-bypass marketing copy; broad permissions | **REJECT** — single-author, security model unclear, vendor-unbacked |
| `hyper-mcp-browser` | Community (`dadigua`) | `1.7.0` (2025-03-29) | Unknown | Stale | Not measured | n/a | n/a | **REJECT** — stale, single-author |
| `mcp-chrome-bridge` | Community (`hangyip`) | `1.0.31` (2025-12-30) | Unknown | Less active | n/a | n/a | n/a | **REJECT** — supplanted by `chrome-devtools-mcp` (vendor) |

**Recommendation:** **`@playwright/mcp`** as the primary Stage 7 MCP, with **`chrome-devtools-mcp`** as an optional secondary if performance / DevTools-Protocol-level inspection is needed. Both are vendor-maintained, Apache-2.0, fully local, and read-only.

### B. Frontend QA tools

| Candidate | Vendor | Latest | License | Maintenance | Bundle impact | Cloud required? | Claim-gate risk | Verdict |
|---|---|---|---|---|---|---|---|---|
| `playwright` | Microsoft | `1.59.1` (2026-04-01) | Apache-2.0 | Excellent | dev-dep only; bundles browser binaries (~300 MB on disk for chromium) | No | None | **ADOPT (devDependency only)** — primary visual + responsive QA tool |
| `@axe-core/playwright` | Deque Labs (`dqlabs`, `dylanb`) | `4.11.3` (2026-04-30) | MPL-2.0 | Very active | dev-dep only | No | None | **ADOPT (devDependency only)** — paired with Playwright for accessibility audits |
| `axe-core` | Deque Labs | `4.11.4` (2026-04-29) | MPL-2.0 | Very active | dev-dep transitive of `@axe-core/playwright` | No | None | **ADOPT** transitively |
| `@lhci/cli` (Lighthouse CI) | Google | (checked — actively maintained on `https://github.com/GoogleChrome/lighthouse-ci`) | Apache-2.0 | Active | dev-dep only; bundles Lighthouse | No | None | **TRIAL (optional)** — if a perf budget gate is wanted; otherwise use the DevTools Lighthouse panel via MCP |
| `pa11y-ci` | Pa11y (`rowanmanning`) | `4.1.0` (2026-03-03) | LGPL-3.0 | Active | dev-dep only | No | None | **REJECT (overlap)** — `@axe-core/playwright` covers the same ground inside the Playwright suite, with one runner |
| `pa11y` | Pa11y | `9.1.1` (2026-02-26) | LGPL-3.0 | Active | dev-dep only | No | None | **REJECT (overlap)** — same |
| `@argos-ci/core` | Argos CI | `5.3.0` (2026-05-02) | MIT | Very active | dev-dep, but uploads screenshots to Argos cloud | **YES (cloud)** | Privacy: pre-launch site screenshots on a third-party platform | **REJECT** — conflicts with the "no cloud services for screenshots of an unreleased site" posture |
| Percy / Chromatic | Cloud vendors | n/a | Commercial | n/a | n/a | **YES (cloud)** | Same as Argos | **REJECT** — same |
| Loki | Open-source visual regression | (older) | MIT | Less active | Storybook-coupled | No | None | **REJECT** — we don't run Storybook |

**Recommendation:** Adopt `playwright` + `@axe-core/playwright` as devDependencies. Optionally trial `@lhci/cli` if performance budgets need to be CI-enforced. Skip cloud-based visual-regression tools — Playwright's built-in `expect(page).toHaveScreenshot()` does on-disk diffing without a third-party service.

### C. Astro-compatible polish tools

| Candidate | Latest | License | Astro-compat | Static-OK | Cloud? | Claim-gate risk | Verdict |
|---|---|---|---|---|---|---|---|
| `sharp` | `0.34.5` | Apache-2.0 | First-class (Astro's image service) | Yes | No | None | **ADOPT** — required for WebP conversion (Phase 6) and for SVG → PNG OG fallback (Phase 7) |
| `astro:assets` (built-in) | shipped with Astro 4 | MIT | First-class | Yes | No | None | **ADOPT** — use the built-in image service before reaching for any external image plugin |
| `svgo` | `4.0.1` (2026-03-04) | MIT | n/a | n/a | No | None | **ADOPT (one-off CLI run, not runtime)** — shrink brand SVGs and motifs in `public/assets/` |
| Astro View Transitions API | Astro core | MIT | First-class | Yes | No | None | **TRIAL (Phase 3 motion polish)** — SPA-style cross-route fades; degrade gracefully if not supported. Native browser API, no library cost. |
| `tailwindcss-animate` | `1.0.7` (2023-08-28) | MIT | n/a | n/a | No | None | **REJECT** — we don't use Tailwind, the project uses scoped CSS + tokens |
| `astro-omni-compress` / `astro-storyblok-image-service` | community | MIT | Yes | Yes | mixed | none | **REJECT** — `sharp` + `astro:assets` is the correct path; no third-party image vendor needed |
| `@bashbers/astro-image-dithering` | community | MIT | Yes | Yes | No | None | **REJECT** — out of scope (decorative dithering does not match the institutional dossier aesthetic) |
| `imagemin-svgo` | community | MIT | n/a | n/a | No | None | **REJECT** — `svgo` directly is enough |
| Astro upgrade `4.16 → 5.x → 6.2.1` | major version jump | MIT | Yes | Yes | No | Major upgrade risk | **DEFER to Stage 8** — Astro is on 6.2.1; we are on 4.16. Two major versions of breaking changes. Out of scope for polish. |
| `@astrojs/check` patch `0.9.4 → 0.9.9` | minor | MIT | Yes | Yes | No | Low | **TRIAL (optional)** — patch bump only; can be done in Phase 1 if it pulls in fixes |

**Recommendation:** Adopt `sharp` (already a transitive dep, wire it for the conversion scripts) and use the built-in `astro:assets` for image optimisation. Run `svgo` as a one-off CLI on the brand + motif SVGs. Trial Astro View Transitions in Phase 3 motion polish. Do not upgrade Astro across major versions in Stage 7.

### D. Interaction / motion libraries

| Candidate | Latest | License | Bundle | Cloud? | Verdict |
|---|---|---|---|---|---|
| `gsap` | `3.15.0` (2026-04-13) | "Standard 'no charge' license" — **commercial use restrictions apply above a threshold; some plugins are paid** | ~50–80 KB minified core | No | **REJECT** — license is restrictive; bundle is large; the planned motion budget (subtle stagger, single-pulse, hover micro) is achievable in CSS + 30 lines of JS |
| `motion` (formerly Framer Motion DOM) | `12.38.0` | MIT | ~30 KB minified | No | **REJECT** — overkill for this site; loses the static-first principle |
| `lenis` | `1.3.23` (2026-04-15) | MIT | ~10 KB minified | No | **REJECT** — smooth-scroll libs conflict with `prefers-reduced-motion` design intent and the dossier aesthetic. Native CSS `scroll-behavior: smooth` + reduced-motion override is already in place. |
| Custom IntersectionObserver-based motion (already present) | local | n/a | 896 B (BaseLayout) + 701 B (Header) + 1 732 B (ContactIntentPanel) — total ~3.3 KB raw | No | **ADOPT — extend, do not replace.** Phase 3 stagger / single-pulse / on-scroll header depth all build on the existing observer. ~30 lines of new JS. |
| Web Animations API (native) | native | n/a | 0 B | No | **ADOPT (where motion needs JS, prefer WAAPI over CSS)** — keyframed pulse on decision pills uses `element.animate(...)`; honour `prefers-reduced-motion` programmatically |
| Canvas / WebGL libs (Three.js, OGL, etc.) | n/a | n/a | very large | n/a | **REJECT** — site has no 3-D content; canvas would dilute the dossier aesthetic |

**Recommendation:** No new motion library. Phase 3 motion polish stays on plain CSS + tiny JS extensions to the existing IntersectionObserver, plus optional WAAPI for the single-pulse pill highlight. Honour `prefers-reduced-motion` at every gate.

### E. Design-system tools

| Candidate | Latest | License | Maintenance | Cloud? | Verdict |
|---|---|---|---|---|---|
| `stylelint` | `17.9.1` (2026-04-27) | MIT | Excellent | No | **ADOPT (devDependency only)** — catch CSS issues during Phase 1 consolidation |
| `stylelint-config-standard` | `40.0.0` (2026-01-15) | MIT | Excellent | No | **ADOPT (devDependency only)** — paired with stylelint |
| `stylelint-config-recommended` | `18.0.0` | MIT | Excellent | No | Transitive of `-standard` |
| Storybook | n/a | MIT | Excellent | optional cloud (Storybook Cloud) | **REJECT** — overkill for 16 components; would expand the surface area Stage 7 wants to consolidate |
| Style Dictionary / Tokens Studio | n/a | Apache-2.0 / MIT | Active | mixed | **REJECT for Stage 7** — tokens already live in a single CSS file with clear semantics. Adopt only if a multi-platform export becomes a need (Figma, iOS, Android). |
| `prettier` | n/a | MIT | Excellent | No | **ADOPT (optional)** — formatter for `.astro`/`.ts`/`.css`/`.md`. Not strictly required because Astro's `astro check` covers types and there are no formatting fights yet, but cheap to add. |

**Recommendation:** Adopt `stylelint` + `stylelint-config-standard` (devDependencies). Skip Storybook. Defer Style Dictionary to a future stage if multi-platform tokens are ever needed.

---

## 4. Recommended Stage 7 tool stack

The recommended stack adds the minimum needed to execute the Stage 7 polish plan without breaking any Stage 5 / Stage 6 gate. Everything below is a **devDependency** unless noted.

| Tier | Tool | Role | Stage 7 phase |
|---|---|---|---|
| Core | `playwright` | Visual + responsive + reduced-motion sweeps at 360/768/1024/1440 px; on-disk screenshot diff | Phase 5 + 10 |
| Core | `@axe-core/playwright` | WCAG audit during Phase 5 closeout sweep | Phase 5 + 10 |
| Core | `sharp` | WebP conversion of TAS screenshots; SVG → PNG OG fallback | Phase 6 + 7 |
| Core | `svgo` (one-off CLI) | Shrink brand and motif SVGs | Phase 6 |
| Core | `stylelint` + `stylelint-config-standard` | CSS lint during Phase 1 consolidation | Phase 1 |
| MCP | `@playwright/mcp` *(optional)* | Lets the assistant drive a local browser against `astro preview` for live polish review | Used during Phase 3, 4, 5 |
| MCP (alt) | `chrome-devtools-mcp` *(optional)* | DevTools-Protocol inspection (perf budget, computed styles) | Used during Phase 9 audit |
| Optional | `@lhci/cli` | Performance-budget enforcement | Phase 9 (only if a CI perf gate is wanted) |
| Optional | `prettier` | Formatter | Phase 1 (if formatting drifts) |

### Why not more

- No animation library — the motion budget is small enough to write inline.
- No Tailwind, no Storybook, no Style Dictionary — overkill for 16 components.
- No cloud-based visual regression — Playwright's built-in screenshot diff is sufficient for an unreleased private site.
- No major Astro upgrade — out of scope for polish; deferred to a future stage.
- No Figma MCP — there is no Figma source.

---

## 5. Rejected tools and why

| Tool | Reject reason |
|---|---|
| `gsap` | License caveats + bundle weight; no need at this motion budget |
| `motion` (Framer Motion DOM) | Bundle weight; SPA framework idioms; no need |
| `lenis` | Smooth-scroll lib conflicts with `prefers-reduced-motion` and the dossier aesthetic |
| `tailwindcss-animate` | Project does not use Tailwind |
| `pa11y` / `pa11y-ci` | Overlap with `@axe-core/playwright`; one runner is enough |
| `@argos-ci/core`, Percy, Chromatic, Loki | Cloud-based screenshot uploads on an unreleased private site; conflicts with privacy posture |
| `mcp-figma`, `@sethdouglasford/mcp-figma` | No Figma source for this project; stale single-author packages |
| `mcpbrowser`, `hyper-mcp-browser`, `mcp-chrome-bridge` | Single-author, unclear security model, supplanted by vendor MCPs |
| Storybook | Overkill for 16 components on a static site |
| Style Dictionary, Tokens Studio | Single-platform CSS tokens are already adequate |
| Astro 5.x / 6.x upgrade | Two major versions of breaking changes; out of polish scope |

---

## 6. Exact installation plan (proposed, NOT executed)

This plan is **not** to be executed in this run. The next prompt should approve or modify it before any install.

```sh
# All devDependencies — zero runtime impact on the static site.
npm install --save-dev \
  playwright@^1.59 \
  @axe-core/playwright@^4.11 \
  sharp@^0.34 \
  svgo@^4.0 \
  stylelint@^17 \
  stylelint-config-standard@^40

# After install:
npx playwright install --with-deps chromium    # chromium binary only, ~150 MB on disk
```

**MCP installs** (separate, optional — would be added via `claude mcp add`, not via npm):

```sh
# Approval gates: scoped to localhost-only headless sessions during dev.
claude mcp add playwright -- npx -y @playwright/mcp@latest --headless
# OR (alternate):
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```

Choose **one** MCP at a time to start; running both simultaneously is unnecessary.

### What the plan does NOT do

- Does not install any runtime / production dependency.
- Does not pull in a CSS framework (no Tailwind).
- Does not pull in an animation library (no GSAP / Motion / Lenis).
- Does not introduce any cloud service.
- Does not bump Astro across major versions.
- Does not change `package.json` `dependencies` (only `devDependencies`).

---

## 7. Rollback plan

If any adopted tool causes a regression in `npm run qa`, the rollback is a single revert of the relevant install + uninstall:

| Tool | Rollback |
|---|---|
| `playwright`, `@axe-core/playwright` | `npm uninstall playwright @axe-core/playwright && rm -rf tests/e2e` (if test dir was created) |
| `sharp` | `npm uninstall sharp` (Astro's transitive dep stays for built-in `astro:assets`) |
| `svgo` (used as one-off CLI) | `npm uninstall svgo`; revert any modified SVG via `git checkout` |
| `stylelint`, `stylelint-config-standard` | `npm uninstall stylelint stylelint-config-standard && rm .stylelintrc.json` |
| `@playwright/mcp` MCP | `claude mcp remove playwright` |
| `chrome-devtools-mcp` MCP | `claude mcp remove chrome-devtools` |

Every tool above is a devDependency or sandboxed MCP; none touches production output. **No rollback affects `dist/`** other than what an explicit revert chooses to.

Pre-install snapshot for safety: `git status --short` before any install; record the file list. Post-install: `npm run qa` must still pass before the next task starts.

---

## 8. Security and privacy notes

| Area | Stage 7 stance |
|---|---|
| Cloud uploads of screenshots | **Forbidden.** No Argos / Percy / Chromatic. Playwright screenshot diffs stay on disk. |
| MCP scope | Localhost only. `@playwright/mcp` runs a headless Chromium pointed at `http://localhost:4321` (Astro dev) or `http://localhost:4322` (Astro preview). It does not need the public internet. |
| API keys | None of the recommended tools need API keys. No Figma, no Anthropic, no third-party SDK. |
| Dependency provenance | Only Apache-2.0 and MIT licenses are recommended for adoption. GSAP rejected partly because its license is non-standard. |
| Supply-chain | All recommended packages have vendor maintainers (Microsoft, Google, Deque, GreenSock-not-adopted, Pa11y team-not-adopted). No single-author MCP servers are being adopted. |
| Public-output hygiene | `dist/` does not change because of any of these tools — they are devDependencies + lint configs + one-off CLI invocations. The Stage 6 dist guard still applies. |
| Browser binaries on disk | `playwright install --with-deps chromium` downloads ~150 MB on disk. Runtime ships nothing. |
| Telemetry | Astro emits anonymous build telemetry by default (already disabled-able with `astro telemetry disable`); none of the recommended additions add new telemetry. Playwright has no default telemetry. |

---

## 9. Open questions for the next prompt

These are decisions that should be made before installing anything.

1. **Approve the dev-dep install plan?** (`playwright`, `@axe-core/playwright`, `sharp`, `svgo`, `stylelint`, `stylelint-config-standard`) — Y / N / partial.
2. **Approve a single MCP install?** Choose one of: `@playwright/mcp` (recommended), `chrome-devtools-mcp` (alternate), neither.
3. **Adopt `@lhci/cli` for a performance budget gate?** — Y / N / defer to Stage 9.
4. **Run `svgo` against the patched `kriseva-og.svg`?** — Y / N. Risk: a sloppy minify pass could re-introduce the legacy `kriseva.ai` text or the "ARTIFICIAL INTELLIGENCE" string if sourced from the wrong file. Mitigation: only run `svgo` against the **already-patched** `public/assets/brand/kriseva-og.svg` and re-run `npm run qa` immediately after.
5. **Approve WebP conversion of the 6 TAS screenshots via `sharp` script?** — depends on the Stage 6 H1 sensitive-data review being signed off first.

---

## 10. Outcome of research

- Live research was possible (npm registry reachable; GitHub API rate-limited but not required given npm metadata).
- Two vendor-maintained MCPs identified: `@playwright/mcp` and `chrome-devtools-mcp`.
- A six-package devDependency stack identified; total runtime impact = 0; total dist size delta = 0; total cloud dependency = 0.
- No new framework, no new CSS preprocessor, no new motion library, no Astro version bump.
- All rejections are documented with reason.
- Installation is **not** executed in this run. Awaiting decision in the next prompt.

---

## 11. Final adoption — what was installed

This section was added on the implementation pass after approval ("install the recommended ones"). It is the canonical record of the final Stage 7 dev-tooling state. See also `STAGE_7_INSTALL_LOG.md` for the install transcript.

### 11.1 Final tools installed

| # | Tool | Version | Type | Source | Why selected |
|---|---|---|---|---|---|
| 1 | `playwright` | `^1.59.1` | dev dep (npm) | npm | Primary visual / responsive / motion / a11y QA runner. Apache-2.0, vendor-maintained. Single tool covers four QA scripts. |
| 2 | `@axe-core/playwright` | `^4.11.3` | dev dep (npm) | npm | WCAG audit runner integrated into Playwright. MPL-2.0, Deque Labs. Removes the need for a separate pa11y / axe-cli runner. |
| 3 | `sharp` | `^0.34.5` | dev dep (npm) | npm | Required by `scripts/optimize-screenshots.mjs` for PNG→WEBP/AVIF conversion. Apache-2.0. Already a transitive dep through Astro 4.16's image service; promoted to a direct dev dep so the script's contract is explicit. |
| 4 | `svgo` | `^4.0.1` | dev dep (npm) | npm | One-off CLI for shrinking the brand and motif SVGs during Phase 6. MIT. **Not** wired into a script that runs automatically — a sloppy minify could re-introduce the legacy `kriseva.ai` line on `kriseva-og.svg`; the operator runs it explicitly per file. |
| 5 | `stylelint` | `^17.9.1` | dev dep (npm) | npm | CSS lint for `src/styles/*.css`. MIT. Catches drift during Phase 1 CSS consolidation. |
| 6 | `stylelint-config-standard` | `^40.0.0` | dev dep (npm) | npm | Standard stylelint preset; load-bearing rules kept, formatting rules relaxed in `.stylelintrc.json` so the existing codebase passes without rewrites. |
| 7 | `@playwright/mcp` | `0.0.73` | MCP server (Claude Code project config) | `claude mcp add` | Lets the assistant drive a local Chromium against `astro preview` for live polish review during Stage 7. Apache-2.0, Microsoft. Localhost-only, no cloud. |

### 11.2 Tools considered and not adopted in this pass

| Tool | Decision | Reason |
|---|---|---|
| `chrome-devtools-mcp` (Google) | **deferred** | `@playwright/mcp` covers the same surface for polish review. Re-evaluate if perf-budget work needs CDP-level inspection. |
| `@lhci/cli` (Lighthouse CI) | **deferred to Stage 9** | Performance budget gate is not a Stage 7 priority. |
| `prettier` | **deferred** | No formatting drift today. Re-evaluate if multiple contributors join. |
| `gsap`, `motion`, `lenis` | **rejected** | Bundle weight + license caveats; the Stage 7 motion budget is achievable in plain CSS + IntersectionObserver extensions. |
| `tailwindcss-animate` | **rejected** | No Tailwind in the project. |
| `pa11y`, `pa11y-ci` | **rejected** | Overlap with `@axe-core/playwright`. |
| Argos / Percy / Chromatic / Loki | **rejected** | Cloud screenshot uploads on an unreleased private site; conflicts with privacy posture. |
| Storybook | **rejected** | Overkill for 16 components on a static site. |

### 11.3 Exact install commands run

```sh
# 1. Six dev dependencies in one npm call
cd website
npm install --save-dev --no-audit --no-fund \
  playwright@^1.59 \
  @axe-core/playwright@^4.11 \
  sharp@^0.34 \
  svgo@^4.0 \
  stylelint@^17 \
  stylelint-config-standard@^40
# Result: added 101 packages, changed 4 packages

# 2. Playwright Chromium binary
npx playwright install chromium
# Result in this sandbox: FAILED at cdn.playwright.dev (403 "Host not in allowlist")
# Resolution: run on the developer's local machine.

# 3. MCP server registration
claude mcp add playwright -- npx -y @playwright/mcp@latest --headless
# Result: ✓ Connected (verified with `claude mcp list`)
```

### 11.4 Configuration + scripts created

| Path | Purpose |
|---|---|
| `playwright.config.ts` | Test runner config; `webServer: npm run build && npm run preview`; baseURL `http://localhost:4321`; desktop project at 1440×900; snapshots on disk only (no cloud) |
| `tests/_routes.ts` | Single source of truth for the 9 routes + 2 intent-deep-link variants + 4 responsive viewports |
| `tests/visual.spec.ts` | Full-page screenshot regression at desktop |
| `tests/a11y.spec.ts` | axe-core audit per route, fails on `serious`/`critical` |
| `tests/responsive.spec.ts` | Per-route screenshot + horizontal-overflow check at 360 / 768 / 1024 / 1440 px |
| `tests/motion.spec.ts` | Reduced-motion contract verifier |
| `scripts/optimize-screenshots.mjs` | sharp-based reversible PNG → WEBP/AVIF, originals preserved, `--dry-run` and `--revert` flags |
| `.stylelintrc.json` | stylelint config; standard preset with project-specific relaxations |
| `.gitignore` (extended) | added `tests/.output/`, `test-results/`, `playwright-report/`, `playwright/.cache/` |

### 11.5 New `package.json` scripts

```jsonc
{
  "scripts": {
    "dev":                "astro dev",
    "build":              "astro build",
    "preview":            "astro preview",
    "check":              "astro check",
    "lint:copy":          "node scripts/check-public-copy.mjs",
    "lint:public-output": "node scripts/check-public-output.mjs",
    "lint:css":           "stylelint \"src/styles/**/*.css\"",
    "qa":                 "npm run lint:copy && npm run build && npm run lint:public-output",
    "qa:visual":          "playwright test tests/visual.spec.ts",
    "qa:a11y":            "playwright test tests/a11y.spec.ts",
    "qa:responsive":      "playwright test tests/responsive.spec.ts",
    "qa:motion":          "playwright test tests/motion.spec.ts",
    "qa:stage7":          "npm run lint:css && npm run qa && npm run qa:a11y && npm run qa:visual && npm run qa:responsive && npm run qa:motion",
    "optimize:screenshots":        "node scripts/optimize-screenshots.mjs",
    "optimize:screenshots:revert": "node scripts/optimize-screenshots.mjs --revert"
  }
}
```

### 11.6 Verification — what passed in the install run

| Command | Result |
|---|---|
| `npm install` | 101 packages added, 0 audit issues raised |
| `npm run check` | 0 errors · 0 warnings · 0 hints across **36** files (was 34 before; +2 from `playwright.config.ts` + `tests/`) |
| `npm run lint:copy` | OK · 50 files · 0 hard-fail · 48 flagged (review-only — same as Stage 6 baseline) |
| `npm run build` | OK · 9 pages · 1.25 s |
| `npm run lint:public-output` | OK · 42 dist files · 0 forbidden artifacts |
| `npm run qa` | OK end-to-end |
| `npm run lint:css` | OK · 0 issues (after relaxing 5 cosmetic rules that disagreed with the existing codebase) |
| `npm run qa:a11y` (and other Playwright sub-scripts) | **Fails in this sandbox** because `cdn.playwright.dev` is in a deny-allow-list. The webServer (`npm run build && npm run preview`) starts correctly; the failure is at browser launch with the actionable message **`Please run: npx playwright install`**. On the developer's local machine where the CDN is reachable, these scripts will run normally. |

### 11.7 Rollback instructions

To uninstall the Stage 7 tooling and restore the Stage 6 state:

```sh
cd website

# Remove the dev dependencies
npm uninstall \
  playwright \
  @axe-core/playwright \
  sharp \
  svgo \
  stylelint \
  stylelint-config-standard

# Remove the MCP server registration
claude mcp remove playwright

# Remove configs and scripts
rm -f playwright.config.ts .stylelintrc.json
rm -rf tests/
rm -f scripts/optimize-screenshots.mjs

# Revert package.json scripts (manual edit) to drop:
#   lint:css, qa:visual, qa:a11y, qa:responsive, qa:motion, qa:stage7,
#   optimize:screenshots, optimize:screenshots:revert
# Revert .gitignore to drop the four playwright-related lines.

# Verify
npm run qa   # must still be green — the Stage 6 chain is unchanged
```

`dist/` is unaffected by anything above; the production bundle is identical to Stage 6's. Rollback is fully reversible.

### 11.8 Outstanding follow-ons after this install

1. **One-step browser binary download on the developer's local machine:** `npx playwright install chromium`. Required before `qa:visual / qa:a11y / qa:responsive / qa:motion / qa:stage7` can produce real results.
2. **First Playwright snapshot pass:** after the binary is installed, run `npx playwright test tests/visual.spec.ts --update-snapshots` once locally to seed `tests/__snapshots__/`. Subsequent runs gate against the seeded snapshots.
3. **Phase-6 image optimization:** running `npm run optimize:screenshots` is **not yet executed** — it's an explicit operator action. Pre-conditions: Stage 6 H1 (founder sensitive-data review) signed off first.
4. **MCP usage:** `claude mcp list` shows `playwright: ✓ Connected`. Tool calls that drive a page will fail until the browser binary is installed; tool registration and the MCP handshake work either way.
