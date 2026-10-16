# Bridge experience verification

16 October 2026. Baseline: main at `915eeee`. Working branch: `codex/bridge-experience-2026-10-16`.

The previous hero cropped the shores on phones and required a long pinned scroll to reveal its explanation. The replacement is a complete, inspectable diagram in normal document flow, with detailed spacecraft, manufacturing and launch infrastructure, four focus views, a three-step story and explicit playback controls.

## Implemented

- Detailed satellite bus, blue solar-cell arrays, hovering quad-drone, precision factory bays, clean-room glazing, robot arm, loading area and ground station.
- Generic procurement institution with dome, columns, entrance depth and flag; launch vehicle, boosters, service gantry, control building and radar.
- Dimensional bridge towers, secondary cables, truss, railings, piers, river detail and evidence traffic. Specimen bid documents cross the answer, evidence and decision checkpoints during the guided story.
- A complete initial diagram, supplier/bridge/buyer detail views, keyboard-operable story controls, pause/resume/replay, offscreen suspension and live reduced-motion handling.
- A static, readable JavaScript-free experience. Ambient motion starts only after accessible controls are available.
- Navigation focus containment, Escape return, breakpoint cleanup, enlarged-text reflow, no-JavaScript links, safe-area support and visible keyboard contrast.
- Contact draft recovery, failure preservation, duplicate-send guard and fresh-plan precedence. Tests mock the endpoint and send no real messages.
- Short-landscape plan-bar clearance, reduced-motion delay cleanup, stamp overflow containment and correct grouping of source excerpts in TAS.

## Executed checks

| Check | Result |
| --- | --- |
| Production build | 12 routes built |
| Astro diagnostics | 0 errors, warnings or hints |
| CSS lint | Passed |
| Public copy and output guards | Passed; existing review-only copy hits inspected |
| Chromium, WebKit and Firefox | 213 tests passed across five suites |
| Final compact-toolbar style recheck | 66 bridge tests passed across all three engines |
| Route and viewport matrix | 168 of 168 passed |
| Internal links and anchor targets | 71 checked, 0 broken |
| Independent review | Four material findings fixed and rechecked; no material findings left |

The 213 tests cover 22 bridge cases, 17 motion cases, 8 usability cases, 12 accessibility routes and 12 JavaScript-free routes in each of the three browser engines. The accessibility suites use axe WCAG A/AA and best-practice rules. A test pass is automated evidence, not a blanket claim of accessibility certification.

The route matrix covers 320, 360, 390 and 430px phones; 844x390 landscape; 768x1024 and 1024x768 tablets; a touch context at 980px for desktop-site mode; 1280x720 laptop; 1440x900 desktop; 1920x1080 and 2560x1440 wide screens; 640px and 320px zoom-reflow equivalents. A separate test enlarges the root text size to 200 percent and exercises opening, Escape, reset and focus return.

## Visual evidence

- [Desktop overview](bridge-experience-evidence/overview-desktop.png)
- [Supplier details](bridge-experience-evidence/suppliers-desktop.png)
- [Buyer details](bridge-experience-evidence/buyers-desktop.png)
- [Phone overview](bridge-experience-evidence/mobile-overview.png)
- [Phone supplier focus](bridge-experience-evidence/mobile-suppliers.png)
- [Phone landscape](bridge-experience-evidence/phone-landscape.png)
- [Recorded story and shore exploration](bridge-experience-evidence/bridge-story.webm)
- [Machine-readable verification summary](bridge-experience-evidence/verification-summary.json)
- [All route and viewport results](bridge-experience-evidence/reflow-results.json)

The home HTML, including inline vector art, is 165,570 bytes uncompressed and 30,529 bytes gzipped. Its shared script is 12,781 bytes uncompressed and 4,886 bytes gzipped. These file sizes exclude fonts and other page assets. No runtime dependency was added. The inspected production page requested only local assets; this is local build evidence, not a field performance measurement.

## Reproduce

From `website/`:

```sh
npm ci
npx playwright install chromium firefox webkit
npm run check
npm run lint:css
npm run qa
npm run qa:experience
```

With production preview on port4322, run `npm run qa:reflow`. The experience config starts a production build and preview when the port is free; it reuses an existing local preview. In CI it starts a fresh one.

## Release state and limits

The branch is ready for review and a pull request. `main` deploys through the existing Cloudflare connection after merge. This work does not claim a production deployment before that merge.

Browsers and device contexts were emulated on this Mac. No physical iPhone/Android rotation, embedded in-app browser or hardware-specific safe-area test was performed. The contact form's real mail delivery was not exercised. These limits remain explicit rather than being inferred from passing frontend checks.
