# Stage 7 Install Log

Date: 2026-05-03
Scope: Record of the Stage 7 tooling install per `STAGE_7_TOOLING_RESEARCH.md` §6.

> **Status: install successful.** All recommended tools installed; `npm run qa` re-verified green; one environment-specific follow-on is documented (Playwright Chromium binary).

---

## 1. What was installed

### Six dev dependencies (`package.json`)

```diff
   "devDependencies": {
     "@astrojs/check": "^0.9.4",
+    "@axe-core/playwright": "^4.11.3",
+    "playwright": "^1.59.1",
+    "sharp": "^0.34.5",
+    "stylelint": "^17.9.1",
+    "stylelint-config-standard": "^40.0.0",
+    "svgo": "^4.0.1",
     "typescript": "^5.6.3"
   }
```

`npm install` summary: **101 packages added, 4 changed**. No production-dependency changes.

### One MCP server (registered in Claude Code project config)

```sh
claude mcp add playwright -- npx -y @playwright/mcp@latest --headless
# Added stdio MCP server playwright with command: npx -y @playwright/mcp@latest --headless to local config
# File modified: /root/.claude.json  [project: /home/claude/repo/website]
```

`claude mcp list` reports:

```
playwright: npx -y @playwright/mcp@latest --headless - ✓ Connected
```

The MCP starts and connects; tool invocations that actually drive a browser still require the Chromium binary (see §3 below).

---

## 2. Installed-version smoke test

```
sharp       0.34.5  (libvips bindings active — aom 3.13.1, cairo 1.18.4, ...)
svgo        4.0.1
stylelint   17.9.1
axe-core    4.11.4   (transitive of @axe-core/playwright)
playwright  1.59.1
```

Each package resolved its CLI / version successfully.

---

## 3. Environment-specific follow-on: Playwright Chromium binary

`npx playwright install chromium` failed in this sandbox. The sandbox blocks Playwright's content CDN with "Host not in allowlist":

```
Download failed: server returned code 403 body 'Host not in allowlist'.
URL: https://cdn.playwright.dev/builds/cft/147.0.7727.15/linux64/chrome-linux64.zip
```

`https://playwright.azureedge.net/` and `https://cdn.playwright.dev/` both return `403` from this host.

**Resolution:** run the binary install on the developer's local machine (or any environment that allows `cdn.playwright.dev`). The npm package and all CLI tools are installed correctly; only the browser binary is missing.

```sh
# Run this on your local dev machine before kicking off Phase 5 / Phase 10 visual sweeps:
cd website
npx playwright install chromium
# Optional: include OS-level deps (needs sudo on Linux):
# npx playwright install --with-deps chromium
```

This is also the only follow-on required for `@playwright/mcp` to drive an actual page — until the binary is present, tool invocations against URLs will fail with the same "browser missing" message; tool *registration* and the MCP handshake work either way.

---

## 4. QA re-verification after install

```
$ npm run qa
[check-public-copy]    OK · scanned 50 file(s) · 0 hard-fail · 48 flagged (review-only)
[build]                OK · 9 page(s) built in 1.95s
[check-public-output]  OK · scanned 42 dist file(s) · 0 forbidden artifacts
```

All Stage 5 / Stage 6 gates remain green. **`dist/` is unchanged** by the install (no new runtime dependency).

---

## 5. Files touched by this run

| Path | Change |
|---|---|
| `website/package.json` | 6 new lines under `devDependencies` |
| `website/package-lock.json` | regenerated to reflect 101 added packages |
| `/root/.claude.json` | local Claude Code project config — registered the `playwright` MCP server |
| `website/node_modules/` | populated (devDeps only) |

No source files in `src/`, no files in `public/`, no files in `scripts/`, no files in `dist/` were modified.

---

## 6. Rollback

If anything regresses, revert with:

```sh
cd website
npm uninstall \
  playwright \
  @axe-core/playwright \
  sharp \
  svgo \
  stylelint \
  stylelint-config-standard

claude mcp remove playwright
```

This restores `package.json` to its Stage 6 state. `dist/` stays as-is.

---

## 7. Outcome

- ✓ Six dev dependencies installed.
- ✓ `@playwright/mcp` registered and connected.
- ✓ All CLI tools verified at their installed versions.
- ✓ `npm run qa` still passes end-to-end.
- ✓ No source / `dist/` changes.
- ⚠ Playwright Chromium binary download blocked by sandbox CDN allowlist; documented as a one-step follow-on on the developer's local machine.

Stage 7 Phase 1 (foundation polish) is now unblocked. Phases that depend on the browser binary (Phase 5 responsive QA sweep, Phase 10 visual sweep + reduced-motion sweep, any `@playwright/mcp` page navigation) should run on a network that allows `cdn.playwright.dev`.
