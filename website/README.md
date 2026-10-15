# Kriseva public website

Astro static pages with local fonts, custom SVG artwork, scoped CSS and small TypeScript controllers. There is no additional animation or 3D runtime dependency.

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

## Verification

```sh
npm run check
npm run lint:css
npm run qa
npx playwright install chromium firefox webkit
npm run qa:experience
```

The experience suite runs the production build in Chromium, Firefox and WebKit. It covers the bridge controls, keyboard and touch layouts, navigation focus, text enlargement, reduced motion, JavaScript-free content, accessibility, contact draft recovery and mocked form outcomes. It does not send real contact messages.

With production preview running on port 4322, check all 12 routes at 14 viewport configurations and verify internal links:

```sh
npm run qa:reflow
```

The JSON result is saved to `output/playwright/reflow-results.json`. Runtime browser artifacts are ignored by Git. Dated visual evidence and the review report are in `../docs/bridge-experience-evidence/` and `../docs/BRIDGE_EXPERIENCE_QA_2026-10-16.md`.

## Bridge components

`BridgeHero.astro` owns the responsive frame, copy and controls. `home/bridge/BridgeScene.astro` owns the bridge structure; `BridgeSuppliers.astro` and `BridgeBuyers.astro` own the detailed shores. `src/scripts/bridge.ts` drives construction tracks, playback, focus views, live motion preferences and visibility suspension.

The complete bridge and explanation render without JavaScript. Ambient motion starts only when accessible controls are ready. Reduced motion shows the finished diagram; visitors can still inspect each focus view and read every story step.
