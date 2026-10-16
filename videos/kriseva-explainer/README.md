# Kriseva in 24 seconds

Original silent-first motion film. Six scenes explain the procurement gap, TAS, evidence crossing, Evaluator and human decision making. There is no voiceover or music. The imagery is illustrative and does not represent customer deployments.

## Edit and render

```sh
node build.mjs
npm run dev
npm run check
npx --yes hyperframes@0.8.163 render --output renders/kriseva-portrait.mp4
cd variants
npx --yes hyperframes@0.8.163 check
npx --yes hyperframes@0.8.163 render --output ../renders/kriseva-wide.mp4
```

The generator writes 720 by 900 and 1280 by 720 HTML compositions. Both use a paused, deterministic GSAP 3.14.2 timeline at 30 fps for exactly 24 seconds. Open the project in Hyperframes preview to edit text, timing or artwork. Keep source changes in `build.mjs` so regeneration is reproducible.

The website's distributable MP4s are in `../../website/public/media/`. Local editor history, thumbnails and duplicate `renders/` files are ignored by Git. Proof frames are in `snapshots/`.

## Provenance and licenses

- Bridge, supplier, government and launch-centre artwork: adapted from this repository's original SVG illustration. Embedded SVG text was removed and replaced by readable film typography.
- Drone and satellite: recomposed from the same owned illustration.
- Film typography: local IBM Plex Sans, SIL Open Font License. See `assets/FONT-LICENSE.txt`.
- Timeline: GSAP 3.14.2, standard GreenSock license, with its source header retained and the license URL recorded in `assets/GSAP-NOTICE.txt`.
- Renderer: Hyperframes 0.8.163, Apache 2.0, used through a pinned local CLI. See https://github.com/heygen-com/hyperframes.

No artwork, music, footage or UI component from the supplied X videos was copied. The posts informed tool evaluation. Runtime, layout and contrast checks do not prove viewer comprehension or physical-device quality.
