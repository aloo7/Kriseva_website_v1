# Compact homepage: 15 to 30 second first pass

The founder asked for a minimal, highly impactful first page with clear phases. This revision replaces the long homepage with one contained story; it retains the detailed bridge artwork and all dedicated routes.

## Three parts

1. Understand: "From paperwork to proof." One sentence identifies suppliers, procurement and Kriseva.
2. See: the bridge, its three selectable beats and optional 12-second guided animation. No forced timer, scroll pin or automatic navigation.
3. Choose: direct supplier and buyer paths to TAS and Evaluator, with a demo link and proof/security links.

The 15 to 30 second duration is a design target for a first pass, not a measured visitor-dwell or conversion claim. The illustration can be explored for longer voluntarily.

## Scope

- Render only BridgeHero on the homepage; remove the eight follow-on explanatory sections and homepage FAQ schema. Preserve the existing detail pages and component files.
- Shorten the intro and story captions. Remove homepage market statistics.
- Compact the frame and paths while retaining readable text and 44px controls. Preserve diagram view selection, reduced motion, no-JavaScript fallback and pause/replay.
- Use a compact homepage footer. Keep the complete footer on the other routes.
- Keep the existing PR #8 and hosted preview; do not merge or change production.

## Acceptance

- Three short phases, clearly labelled; direct product paths and demo always available without waiting for playback.
- Primary headline, explanation and product-choice copy at most 100 words, excluding artwork annotations and control labels.
- At normal text size, full homepage at most 1.7 viewport heights at1440x900 and390x844; at320x568 at most2.5. These are upper bounds; text enlargement must reflow rather than be clipped to meet a height target.
- No page overflow across the existing viewport matrix. Keyboard, touch, live reduced-motion and JavaScript-free routes remain usable.
- Run the production build, Astro and CSS checks, existing three-engine experience suite, added compact-home regression checks and the route/link matrix. Inspect desktop and phone screenshots.

## Alternatives

Selected: one compact overview with optional playback and direct next steps. A forced timed slideshow would delay visitors who already know their path; hiding the entire website behind an animation would impair keyboard and JavaScript-free use. A smaller font or truncated long page would retain the original attention problem.
