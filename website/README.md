# Kriseva public website

Astro static pages with local fonts, original SVG artwork and TypeScript controllers. The homepage uses local MP4 files and native video controls. Motion 14.3.0 and Paper Shaders 0.0.81 load only on the optional interactive bridge route.

## Development

```sh
npm ci
npm run dev
```

The usual local URL is http://localhost:4321. To inspect the production output:

```sh
npm run qa
npm run preview -- --host 127.0.0.1 --port 4322
```

Do not replace an existing preview listener without checking ownership.

## Verification

```sh
npm run check
npm run lint:css
npm run qa
npx playwright install chromium firefox webkit
npm run qa:experience
npm run qa:reflow
node scripts/capture-mobile-motion.mjs
```

The experience suite checks the production build in Chromium, Firefox and WebKit: film playback and seeking, rotation, video failures, mobile sizing, bridge controls, WebGL failure, reduced motion, keyboard navigation, enlarged text, JavaScript-free content, accessibility and mocked contact outcomes. Software-GPU integration runs once in Chromium. Unsupported Firefox mobile emulation cases are explicitly skipped. Tests do not send real contact messages.

The reflow check covers all 13 routes at 14 viewport configurations and internal links. Runtime artifacts live in ignored `output/playwright/`. Curated screenshots, measurements and the final report live in `../docs/mobile-motion-evidence/` and `../docs/MOBILE_MOTION_QA_2026-10-16.md`.

Browser emulation is not physical-device verification. A real Android browser desktop-site toggle, iPhone rotation and mobile browser chrome remain manual review items.

## Homepage and bridge

`HomeStory.astro` owns the concise homepage. `home-film.ts` selects the portrait or wide MP4, preserves the playhead across source changes, supports explicit chapter selection and pauses hidden/offscreen playback. `preload="none"` avoids a video download until interaction. A transcript and the two product paths remain usable when playback fails or JavaScript is disabled.

`/bridge` uses `BridgeHero.astro`, the original detailed SVG shores and structure, and `bridge.ts` for camera and story control. `crossing-atmosphere.ts` adds one optional low-power shader with a pixel cap and permanent SVG fallback after context loss. The main homepage does not load the bridge animation packages.

`phone-layout.js` and `phone-layout.css` apply only to the home and bridge pages. They compensate for a small touch screen receiving an unusually wide layout viewport, without changing zoom or disabling user text enlargement.

Public distribution licenses are in `public/licenses/`. The editable film, local assets and deterministic render commands live in `../videos/kriseva-explainer/`.
