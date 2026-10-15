# Kriseva bridge experience implementation plan

Goal: make the bridge a clear, memorable explanation of Kriseva and make all public routes easy to use across representative devices, orientations and browser preferences.

## Design and alternatives

Use the existing Astro, locally hosted IBM Plex, paper, navy and brass design language. The signature is a dimensional architectural SVG, drawn specifically for this site. Detailed manufacturing, drone, satellite and ground station artwork stands opposite a generic procurement institution and launch complex. The bridge carries evidence between them. No institution relationship is implied.

Considered: WebGL with Three.js for freely rotating 3D, an exported video, and native SVG with CSS and a small controller. Native SVG is selected because it gives crisp editable detail, clear text alternatives, direct focus controls, and a finished illustration without JavaScript. WebGL introduces rendering and device cost without helping explain the crossing. Video sacrifices responsive composition and user-controlled states. Motion's MIT SVG tooling and MDN viewport/motion guidance were reviewed; this change does not require another runtime dependency.

## Interaction and responsive contract

- The full hero is normal page content. No forced scroll distance or scroll hijacking. Book a demo and product links remain reachable.
- A framed diagram has four focus views: Overview, Suppliers, The bridge, Buyers. Each is a real button with clear selection state and a descriptive caption. SVG viewBox changes preserve geometric detail without page overflow.
- Three explanatory stages: the paper gap, the two products, evidence crossing. Selecting a stage updates the illustration and readable caption. A guided animation demonstrates the crossing, with pause/resume and replay. Reduced motion, JavaScript failure and no JavaScript show a complete bridge with a readable explanation.
- Ambient motion is deliberate: hover, orbital drift, transmissions, flag movement, river light and evidence traffic. It pauses when outside the viewport or the tab is hidden. No strobe, high-rate lights, cursor effects, or motion required to understand content.
- At narrow widths retain all supplier/buyer facts as normal HTML, never use miniature SVG text as the only source of meaning. Focus views make details inspectable by touch. Compact landscape and zoom use normal document flow.
- Existing claims, sourced statistics and routing remain evidence-bound. No new customer, accuracy, funding or institution claims.

## Tasks and ownership

- [x] Baseline: preserve screenshots, verify origin/main and clean checkout, create isolated working branch.
- [x] Art: BridgeSuppliers.astro and BridgeBuyers.astro contain detailed vector shores with scoped ambient CSS.
- [x] Hero: BridgeHero.astro composes artwork, dimensional bridge, story controls, focus views, caption, statistics and robust responsive layout.
- [x] Controller: bridge.ts drives reversible construction tracks, guided playback, user controls, viewBox selection, live motion preferences, viewport and visibility suspension.
- [x] Site usability: SiteHeader.astro, site.ts, site.css and bounded form fixes address focus, orientation changes, touch targets, overflow and recovery.
- [x] Validation: production build, Astro type check, copy/public-output checks, existing accessibility/motion/static/responsive tests, plus targeted interaction regression tests. Save screenshots and QA result in docs.
- [x] Independent review: inspect final code and visual evidence, repair material findings, record company-brain receipt. Publish via a feature branch and PR, leaving main's automatic deployment to the normal merge path.

## Verification matrix

Chromium, WebKit and Firefox where available. Phone widths 320, 360, 390, 430; portrait and 844x390 landscape. Tablet 768x1024 and 1024x768. Laptop 1280x720 and 1440x900. Wide 1920 and 2560. Desktop-site mobile context at 980px. Reflow equivalent of 200 and 400 percent zoom using 640px and 320px CSS viewports. Touch and keyboard, short-height navigation, no JavaScript, reduced motion at load and toggled live, pause/replay, each focus view, form validation and all internal routes. Verify no horizontal page overflow, readable text, visible focus, meaningful touch sizes and no script errors.

Emulation verifies CSS and browser behavior. It cannot certify every physical phone, embedded browser, hardware keyboard or OS display mode; report that limit plainly.

## Review focus

1. Changing orientation with a menu open must restore page scrolling and a usable focus location.
2. Reduced motion toggled during playback must show the completed diagram and stop movement.
3. A visitor returning to a background tab must not see a giant jump or an endless offscreen animation loop.
4. At 320px and short landscape, controls and forms must remain reachable without horizontal page scrolling.
5. With JavaScript absent or failing, content and product/demo links must remain available.

## Completion evidence

See [verification report](BRIDGE_EXPERIENCE_QA_2026-10-16.md). Implementation, responsive verification and independent review are complete. Production publication follows the pull request merge.

References reviewed: [Motion SVG documentation](https://motion.dev/docs/svg-effect), [Motion source](https://github.com/motiondivision/motion), [MDN viewport concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/CSSOM_view/Viewport_concepts), [W3C motion-preference technique](https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR40).
