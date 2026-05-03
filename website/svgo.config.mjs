// Conservative svgo config for KRISEVA brand + motif assets.
// Goals: strip metadata + comments + redundant attributes; preserve viewBox,
// IDs, accessible <title>/<desc>, attribute names, and exact path geometry.
//
// What we DO remove:
//   - XML declaration / DOCTYPE / comments / metadata
//   - Empty defs/groups, hidden elements
//   - Default attribute values
//   - Editor-tool metadata (Inkscape, Illustrator)
//
// What we DO NOT remove or change:
//   - viewBox (responsive scaling depends on it)
//   - <title>/<desc> (accessibility)
//   - Path geometry / coordinates
//   - Stroke/fill properties (visual identity)
//   - Existing IDs (some referenced by CSS via class selectors)

export default {
  multipass: true,
  js2svg: { indent: 2, pretty: false },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // KEEP viewBox — we need it for responsive scaling.
          removeViewBox: false,
          // KEEP IDs — some may be referenced by CSS or aria-labelledby.
          cleanupIds: false,
          // KEEP titles/descriptions — accessibility.
          removeTitle: false,
          removeDesc: false,
          // Don't aggressively merge paths — could change rendering subtly.
          mergePaths: false,
          // Don't convert shapes to paths — preserves source readability.
          convertShapeToPath: false,
          // Don't apply transforms — could change subpixel positioning.
          convertTransform: false,
          // Don't rename IDs — leaves references intact.
          inlineStyles: false,
        },
      },
    },
    // KEEP xmlns — standalone SVGs (loaded via <img src>) require it. Only
    // strip dimensions where viewBox provides aspect ratio.
    'removeDimensions',
  ],
};
