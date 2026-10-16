# Mobile film verification

Date: 16 October 2026. Branch: `codex/mobile-motion-2026-10-16`.

## Result

The homepage now uses a 24-second illustrated film, with separately composed 4:5 phone and 16:9 wider-screen files. The optional detailed bridge has its own `/bridge` route. The local production build and hosted branch preview passed verification. Production remains on the previous merged release until this revision is merged.

| Check | Result |
| --- | --- |
| Astro diagnostics | 114 files, zero errors, warnings or hints |
| Build and public-copy guard | Passed; 23 soft review hits inspected, no forbidden terms |
| Public output guard | Passed, including only the two specifically allowed original MP4s |
| CSS lint | Passed |
| Browser experience | 271 passed, 5 explicitly skipped, zero failed |
| Engines | Chromium, WebKit and Firefox |
| Hosted playback | 15 passed across all three engines |
| Byte-range delivery | 15 Node tests passed; deployed partial responses verified |
| Reflow | 182 of 182 route/viewport combinations passed |
| Internal links | 72 checked, zero broken |
| Portrait composition | Runtime/layout/contrast passed, 45 of 45 contrast checks |
| Wide composition | Runtime/layout/contrast passed, 45 of 45 contrast checks |
| Film delivery | Both 24.000 seconds, 30 fps, H.264, yuv420p, no audio |

The five browser skips are three unsupported Firefox mobile-emulation/screen-override cases and two duplicate software-GPU integrations. The real shader integration runs in Chromium; missing-WebGL fallback is exercised in all three engines. Composition lint reports seven structural warnings in each format for the compact six-scene file. These are maintainability suggestions, with no runtime, layout or contrast errors. The timeline remains editable and deterministic.

## Behavior checked

- No automatic film playback or MP4 request before interaction.
- Explicit play, pause, replay and chapter seeking, including before metadata loads.
- Portrait/wide changes preserve playback position, including an active playback state.
- Video failure leaves the transcript and product links available.
- No-JavaScript visitors retain native video, transcript and product navigation.
- Reduced-motion visitors receive a still; playback remains an explicit choice.
- Offscreen or hidden film and bridge animation pause.
- Ordinary mobile portrait and landscape layouts, a 320px viewport, 200 percent text and the controlled 980-layout/393-screen simulation remain usable.
- Effective touch targets in the wide-layout simulation are at least 44px after scaling. Footer controls do not overlap with enlarged text.
- The real Paper shader stays within its pixel cap, stops advancing when paused, resumes correctly and permanently falls back after a lost WebGL context.
- Existing accessibility, keyboard navigation, route, contact-draft and mocked form-outcome checks continue to pass.

The final full suite includes the skip-link correction and playback-readiness changes. The deployed preview serves byte-range requests for the two film files, so browsers can seek before the complete download finishes. The player preserves a requested chapter until that position is seekable. Both complete hosted video files match local SHA256, and 1,024-byte range requests return 206 with the correct Content-Range. All 13 hosted route titles match the tested build.

## Visual evidence

Screenshots were reviewed as local artifacts, alongside six proof frames from each rendered film. These are development test outputs, not physical-device captures.

- [Phone homepage](mobile-motion-evidence/phone.png)
- [320px homepage](mobile-motion-evidence/narrow.png)
- [Landscape](mobile-motion-evidence/landscape.png)
- [Desktop](mobile-motion-evidence/desktop.png)
- [Controlled wide-layout phone simulation](mobile-motion-evidence/phone-wide.png)
- [Supplier close view](mobile-motion-evidence/phone-suppliers.png)
- [Buyer close view](mobile-motion-evidence/phone-buyers.png)
- [Portrait film proof](../videos/kriseva-explainer/snapshots/portrait/contact-sheet.jpg)
- [Wide film proof](../videos/kriseva-explainer/snapshots/wide/contact-sheet.jpg)
- [Dimensions](mobile-motion-evidence/measurements.json)
- [Media hashes and verification record](mobile-motion-evidence/verification.json)

The wide-layout screenshot uses its declared viewport rather than Chromium's full-page capture, which temporarily alters the emulated viewport. The measurements are recorded before capture. Mobile WebKit's viewport override emits no resize event for the simulated desktop-site switch, so that particular return-to-mobile test uses a page reload. Chromium exercises live resize. Normal phone landscape is tested independently.

## Tools, limits and remaining review

Inspo MCP was installed and exercised for reference discovery. Seven selected Design Taste skills were installed. Website runtime dependencies are pinned Motion 14.3.0 and Paper Shaders 0.0.81. Hyperframes 0.8.163 and GSAP 3.14.2 authored/rendered the film. See the separate research report for all three references, compatibility, licenses and declined installations.

The dependency audit reports inherited vulnerabilities in the existing tree; the newly added Motion and Paper package families are not flagged. A framework/dependency remediation should be handled separately, with its own compatibility verification.

Physical Android and iPhone checks remain outstanding, particularly real browser desktop-site mode, browser chrome, rotation, low-power devices and connection quality. No visitor-comprehension, engagement or conversion result is claimed. The 24-second duration is measured; the intended 15 to 30 second first-page understanding is a design target.

Local browser UI was disabled by Work settings during this session. Project Playwright regression against local and hosted builds and Hyperframes rendering were used for development verification; no alternative UI automation was used to bypass that setting. Contact delivery was not tested with a real send.

Hosted runtime reviewed: [immutable preview](https://314c67f4-kriseva.aloolifts.workers.dev), runtime commit `0421b435`. [PR #9](https://github.com/aloo7/Kriseva_website_v1/pull/9) remains open. Final documentation and test-command changes do not alter the visitor runtime.
