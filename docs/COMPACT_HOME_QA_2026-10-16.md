# Compact homepage verification

16 October 2026. This revision follows the founder's request for a minimal first-page experience that can be understood in 15 to 30 seconds. It supersedes the earlier homepage composition while retaining the detailed bridge illustration.

## The experience

1. The gap: a short headline and audience sentence.
2. The bridge: three selectable beats and an optional 12-second animation.
3. The next step: TAS for suppliers, Evaluator for buyers, or a demo enquiry.

The first pass has 42 words of primary copy in its default state. That count excludes controls, artwork annotations and the illustration's long accessibility description. The 15 to 30 second duration is a design target, not measured visitor dwell time. People may skip directly to their product or spend longer exploring the illustration.

The eight long sections after the hero, homepage market statistics and large homepage footer have been removed from the first page. Dedicated product, proof, security, company, plans, resources and contact routes remain. Their existing full footers are unchanged. FAQ structured data was removed from the homepage because its FAQs are no longer displayed there.

## Length measured in the browser

| Viewport | Before at 6d8daca | Compact version | Reduction |
| --- | ---: | ---: | ---: |
| 1440x900 desktop | 10,567px | 1,116px / 1.24 screens | 89% |
| 390x844 phone | 15,418px | 1,106px / 1.31 screens | 93% |
| 320x568 narrow phone | not measured | 1,118px / 1.97 screens | not compared |
| 844x390 landscape | not measured | 1,012px | not compared |

The mobile description uses 16px body text. Controls retain a minimum 44px target. At enlarged text sizes the layout grows and wraps; it is not clipped to keep an arbitrary page height.

## Executed verification

- 231 production-build tests passed across Chromium, Firefox and WebKit, including 18 new compact-home cases.
- All 168 route/viewport combinations passed; 69 internal links and anchor targets checked, none broken.
- Astro diagnostics: 0 errors, warnings or hints. CSS lint, public copy and public output checks passed. Review-only copy hits include source comments and were inspected.
- Keyboard, JavaScript-free content, live reduced-motion, pause/replay, larger text and mobile navigation remain covered by the experience suite.
- All three story phases were exercised in the visible in-app browser and its preview was refreshed.

The compact-home tests pin the page-height upper bounds, concise primary copy, direct next steps, valid structured data, enlarged-text reflow and static fallback. The wider suite retains the detailed bridge and site usability checks. No real contact messages were sent.

An enlarged-text overflow was traced to the four illustration-view buttons and fixed with a grid that adapts to text size. A running headline entrance transition was also removed, keeping the short introduction immediate and making the pause-motion behavior consistent.

## Evidence and reproduction

- [Desktop](compact-home-evidence/home-1440.png)
- [Phone](compact-home-evidence/home-390.png)
- [Narrow phone](compact-home-evidence/home-320.png)
- [Landscape](compact-home-evidence/home-844.png)
- [In-app preview](compact-home-evidence/inapp-preview.png)
- [Measurements](compact-home-evidence/measurements.json), [baseline](compact-home-evidence/before.json), [test summary](compact-home-evidence/verification.json), [reflow results](compact-home-evidence/reflow-results.json)

From `website/`, run `npm run qa`, `npm run check`, `npm run lint:css` and `npm run qa:experience`. With the production preview running on 4322, run `npm run qa:reflow`.

The existing PR #8 and its hosted preview carry this revision. Production remains unchanged until merge. Browser/device contexts are emulated; physical-device behavior and real contact-mail delivery remain unverified.
