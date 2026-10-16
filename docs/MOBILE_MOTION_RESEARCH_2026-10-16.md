# Mobile design and motion research

Date: 16 October 2026

Scope: Research the three posts supplied by Ayush, distinguish useful production tools from reference resources, and translate the findings into a better phone experience for the compact Kriseva homepage. This report records research and implementation decisions. It does not claim that installing a tool proves design quality, device compatibility or user engagement.

Status: research and selected tool installation are complete. The final implementation uses a 24-second film as the homepage explanation and an optional interactive bridge. See MOBILE_MOTION_QA_2026-10-16.md for actual verification outcomes.

## Recommendation

Use Inspo MCP to study real mobile compositions, selected design skills to sharpen the design and review process, and Paper Shaders for a small, optional atmospheric layer. Keep the explanation, bridge, labels, navigation and calls to action in accessible HTML and SVG. Improve mobile composition and scale before adding decorative movement.

The important change is a deliberately composed phone experience. A complete landscape illustration shrunk into a phone is not sufficient. A phone should open on a legible headline and a close view of the bridge, with clear controls to move between the suppliers, crossing and buyers. Desktop can retain the wider establishing view. Both should tell the same short story.

## Evidence and limits

- The original X pages returned an access error to the web reader. Their content was recovered through public, read-only endpoints without signing in, reading cookies or changing an account.
- Nutlope's post text and media metadata were verified using X's own syndication response. The attached video was not visually inspected. Its existence, resolution and duration are metadata findings only.
- Roundtable's full text was recovered through FxTwitter. X's public oEmbed response corroborated the opening, first four entries and publication date. This is a secondary recovery of the full list, corroborated in part by X.
- Repository READMEs, source files, license files, GitHub metadata and npm metadata were used for installation and compatibility decisions. Repository contents can change after this report.
- External README and skill instructions are source material to assess. They do not override the user's request, local engineering rules or credential boundaries.
- No research finding establishes that a device was physically tested. Browser emulation, visual review and physical-device checks must be reported separately.

## Post 1: Nutlope introduces Inspo

Original: <https://x.com/nutlope/status/2099547343112564921>

Published: 14 September 2026 at 17:14:28 UTC.

Recovered primary response: <https://cdn.syndication.twimg.com/tweet-result?id=2099547343112564921&lang=en&token=0>

The post introduces Inspo as a design MCP for Claude Code, Codex and OpenCode. It describes searching more than 800 websites for relevant design inspiration and gives `npx inspo-mcp install` as the setup command. It does not name a motion renderer. The attached demo has a reported duration of 20.778 seconds and resolution of 1920 by 1080. No claim about the video's visual details is made here.

### What Inspo actually provides

The current primary documentation describes 832 production sites, 2,320 captured pages, 68 canonical reference components and 15 MCP tools. Captures have desktop and mobile versions, palettes, fonts, detected technology, composition analysis and per-site `DESIGN.md` information. These catalogue counts are a dated snapshot, rather than a required feature of our implementation.

Its job is to provide examples and evidence before an agent writes UI. It does not render our scene, animate the bridge, test our CSS or make our site responsive automatically.

Useful tools for this task:

| Tool | Practical use |
| --- | --- |
| `recommend` | Find a small mobile reference set from the actual design brief. |
| `get_screen` | Inspect the real capture and composition before accepting the textual description. |
| `get_design_system` | Examine type hierarchy, palette roles, spacing and container choices. |
| `compare` | Identify useful similarities and deliberate differences between two to four references. |
| `find_components` | Study a particular navigation, hero or control pattern. |
| `get_reference_jsx` | Read a canonical component only when its structure is relevant. Adapt to Astro rather than adding React solely for it. |
| `get_filters` | Discover accepted filter values instead of inventing them. |

Sources:

- Repository: <https://github.com/Nutlope/inspo>
- Official MCP guide: <https://inspomcp.dev/mcp>
- Tool and transport documentation: <https://github.com/Nutlope/inspo/blob/main/apps/mcp/README.md>
- Installer source: <https://github.com/Nutlope/inspo/blob/main/apps/mcp/src/install.ts>
- License: <https://github.com/Nutlope/inspo/blob/main/LICENSE>
- Capture credits: <https://inspomcp.dev/colophon>

### Installed connection and exercised calls

The main implementation session installed the hosted Inspo connection for Codex, with a successful server initialization reporting version `hosted-0e1e636`. The endpoint is `https://inspomcp.dev/api/mcp`. The documented Codex command is:

```sh
codex mcp add inspo --url https://inspomcp.dev/api/mcp
```

This is also the command issued by the reviewed official installer for Codex. The hosted service needs no account or API key. It adds no website runtime package. A client may need to restart before a newly registered MCP appears as native tools in that client.

The research session successfully called the live endpoint through read-only JSON-RPC for `tools/list` and `recommend`. The latter used a Kriseva-specific brief with `device: "mobile"`, `vibe: "technical"`, `pageType: "landing"` and `macrostructure: "map-diagram"`.

The current npm metadata reports `inspo-mcp` version `0.1.16`, Node 18 or newer, no declared package dependencies and no install lifecycle script. For the npm installer, targeting Codex specifically avoids changing other detected editors:

```sh
npx -y inspo-mcp@0.1.16 install --client codex --dry-run
npx -y inspo-mcp@0.1.16 install --client codex -y
```

This report does not claim that the npm command was run. Registry metadata: <https://registry.npmjs.org/inspo-mcp/latest>.

### Findings from the live recommendation

The tailored call returned Bauhaus Clock, Clay, Arrows, Factory and Zora. The useful lessons are composition, hierarchy and visual emphasis, not a requirement to adopt their branding.

| Reference | Useful lesson for Kriseva |
| --- | --- |
| Bauhaus Clock | One dominant visual, a strong headline and one accent shared between artwork and controls. |
| Clay | A physical metaphor can create depth while copy and the main action remain clear. |
| Arrows | Technical clarity through type hierarchy and blue/neutral colour relationships. |
| Factory | Restrained typography and precise technical framing. |
| Zora | Material depth and softer transitions without filling every space with UI. |

Example mobile captures returned by the MCP:

- Bauhaus Clock: <https://0nme3pk5am3urwa9.public.blob.vercel-storage.com/captures/bauhausclock-com/mobile.384.webp?v=1779917245>
- Clay: <https://0nme3pk5am3urwa9.public.blob.vercel-storage.com/captures/clay-com/mobile.384.webp?v=1780313033>
- Arrows: <https://0nme3pk5am3urwa9.public.blob.vercel-storage.com/captures/arrows-to/mobile.384.webp?v=1779917087>

The result includes generic advice about fitting the first viewport and spacing sections generously. Treat that as design input. A rigid `100svh` frame can crop content in short landscape windows, and large section gaps can undermine the requested compact page. Content, browser bars, enlarged text and available height should determine the final layout.

The catalogue can also contain inconsistent metadata. One Factory result described a dark scene while labelling its mode light. Inspect actual captures and use the source site's design as a reference, rather than treating every extracted label as authoritative.

Inspo code is MIT licensed. Its captured screenshots remain the work of the original designers. The license is not a blanket right to reuse their logos, illustrations or commercial typefaces in our website.

## Post 2: Roundtable's ten design repositories

Original: <https://x.com/RoundtableSpace/status/2110255627704455591>

Published: 14 October 2026 at 06:25:22 UTC according to the recovered post.

Recovery and corroboration:

- Full post: <https://api.fxtwitter.com/RoundtableSpace/status/2110255627704455591>
- X oEmbed: <https://publish.twitter.com/oembed?url=https://twitter.com/RoundtableSpace/status/2110255627704455591>

This is a list of ten design repositories. No attached video was reported by the recovered response. It must not be conflated with a different Roundtable post about a motion video kit.

### Repository assessment

| Repository from the post | What it provides | License and access findings | Decision for Kriseva |
| --- | --- | --- | --- |
| [Superdesign](https://github.com/superdesigndev/superdesign) | The linked repository is a historical IDE design tool. Its README points to a newer skill project. | Historical project has mixed AGPLv3 and Enterprise licensing. Current [superdesign-skill](https://github.com/superdesigndev/superdesign-skill) is MIT. The current CLI workflow requires an external account and login. | Review the current skill as an optional design workflow. Do not install the old extension or treat its old license as the new skill's license. Cloud login is not needed for the present implementation. |
| [Better Design](https://github.com/marvkr/better-design) | Design skill and MCP-backed design workflow. | Repository skill is MIT. The hosted endpoint describes an API key requirement. npm `better-design` version 0.44.0 identifies a different repository, `better-designs/better-design-plugin`, so it is not interchangeable without review. | Read or install the reviewed skill selectively. Do not claim live MCP use without a working connection. Avoid running the npm installer merely because it shares a name. |
| [Design Taste](https://github.com/madebymustafa/design-taste) | Twenty-four specialist design and review skills. | MIT. The repository's installation script attempts to install all skills into every detected agent. | Use selected skills relevant to this page. Core, motion, typography, accessibility, landing-page and web-performance guidance are the useful subset. Avoid an unscoped installer that changes every agent. |
| [Canvas UI](https://github.com/DavidHDev/canvas-ui) | Visual components, including vanilla integration and HTML-in-canvas experiments. | MIT with Commons Clause restrictions. Commercial end products are allowed, but selling or redistributing the components themselves is restricted. HTML-in-canvas can require a browser flag or origin trial. | Study visual techniques. Do not make the phone hero depend on an experimental capture API. Any component reuse needs its exact license and normal-browser fallback reviewed. |
| [Paper Shaders](https://github.com/paper-design/shaders) | GPU-rendered visual materials and atmospheric effects, with a vanilla JavaScript mount. | Apache-2.0. The reviewed npm version is `@paper-design/shaders@0.0.81`. The package has no dependencies or install lifecycle script. | Best direct fit for a small optional Astro visual layer. Pin the exact version. Keep meaningful content outside the canvas. |
| [UI Layouts](https://github.com/ui-layouts/ui-layouts) | UI component examples. The repository redirects to `ui-layouts/uilayouts`. | MIT. Components use React, Tailwind and Motion. | Use as reference. Do not introduce React and Tailwind into this Astro page to obtain a minor visual effect. |
| [Hyperiux Components](https://github.com/Hyperiux-Immersive/Hyperiux) | Not verified from the supplied repository. | The supplied repository returned 404 during research. No license or installability was established. | Do not install or invent a replacement. |
| [Motion Primitives](https://github.com/ibelick/motion-primitives) | React, Motion and Tailwind component primitives. | MIT. The project describes itself as beta. | Useful interaction reference. Adopt only if a specific component's value justifies its framework cost; not required for this Astro hero. |
| [Cursify](https://github.com/ui-layouts/cursify) | Pointer and cursor effects. | GitHub reported no license, and no root license was found in the reviewed tree. | Omit. Cursor effects do not solve the phone composition and touch-control problem. Do not assume reuse rights. |
| [Trickle UI Kit](https://github.com/akaieuan/trickle) | Not verified from the supplied repository. | The supplied repository returned 404 during research. No license or installability was established. | Do not install or invent capabilities. |

Reviewed source snapshots reported by the repository research:

- Historical Superdesign: `49e2b9dd9615c6dae936b326b1ddb85d4f1d6f19`.
- Design Taste: `c4a6bff0871eb4b15371b0e7d2751628b0ed4608`.
- Better Design: `e146625f3041ef8089a2013587435fc763dc3b15`.
- Current Superdesign skill: `f9f05cd988c247dce6c072eaf9ac6b162f2ffc4b`.
- Paper Shaders: `43cd68db79fa0b1759f72ffc941b3238e2a3954c`.
- Canvas UI: `a04a99b235299ee79a123a16ccb2e6cf9da74b6b`.
- UI Layouts: `88d827d7ec342917ca06f6894e5add65fabbe5d8`.
- Motion Primitives: `120f64f6ca60348e251f929e9c81f11ccbe45eda`.
- Cursify: `b3a173c33f12e74550389c9555f9ce85c30c46f6`.

These are research snapshots. They do not mean all four packages were installed or used at runtime.

## Why references, skills and renderers are different

| Category | Examples here | What it changes |
| --- | --- | --- |
| Reference source | Inspo, component galleries | Gives the designer and agent real compositions to study. |
| Agent guidance | Design Taste, Better Design, Superdesign skill | Improves the design process, critique and implementation decisions. |
| Runtime renderer | Paper Shaders, native SVG/CSS | Produces pixels or motion in the visitor's browser. |
| Verification | Browser tools and project tests | Checks whether the implemented page actually works at the tested sizes and states. |

Adding more resources in one category does not replace another. A shader does not fix a shrunken layout, and an inspiration MCP does not animate the bridge. A modern result requires deliberate composition, an appropriate rendering method and visible review.

## Additional motion runtime selected for implementation

The main session added exact versions `motion@14.3.0` and `@paper-design/shaders@0.0.81` to the website with npm install scripts disabled. Motion is MIT licensed. It is an additional engineering choice informed by this research, not a tool explicitly named by either supplied post.

Motion's vanilla JavaScript API can animate HTML and SVG without a React component tree. Its `animate` control supports timed transitions and sequences, making it appropriate for deliberate chapter changes and camera movement. Paper provides the decorative material field. Using those distinct responsibilities avoids requiring an all-canvas interface.

Use the smallest Motion entry point that supports the actual effect. A package name alone is not a bundle-size or frame-rate guarantee. Prefer transforms and opacity where they express the intended movement, and check the real rendering cost of SVG view changes and canvas updates. Respect the shared pause state across every runtime.

Primary sources:

- Motion animation API: <https://motion.dev/docs/animate>
- Performance guidance: <https://motion.dev/docs/performance>
- License: <https://github.com/motiondivision/motion/blob/main/LICENSE.md>
- Exact package metadata: <https://registry.npmjs.org/motion/14.3.0>

## Screenshot diagnosis

The supplied screenshot shows a portrait phone browser displaying a wide, desktop-like composition. The headline and supporting copy share a horizontal row; the bridge retains its full wide scene; product paths share a row; labels and controls are very small relative to the physical screen. A large blank area follows the page content.

That is visible evidence of weak phone presentation in this capture. It does not, on its own, establish the exact CSS viewport width, browser zoom or whether Chrome's desktop-site setting is active. A phone screenshot measured in image pixels is not a CSS viewport measurement.

The current source includes a `width=device-width, initial-scale=1, viewport-fit=cover` viewport declaration. Therefore, this report does not diagnose the image as a missing viewport meta tag. A desktop-site viewport, browser state, cached output or a layout breakpoint can produce different causes that need live reproduction.

Regardless of that cause, the composition needs improvement: artwork details should become legible, the hierarchy should feel intentional, and the controls should read as touch controls. We should support both normal mobile mode and a desktop viewport requested by a phone browser. Pointer and hover capabilities, viewport height and width all matter. Width alone is not an adequate proxy for the device.

## Initial direction, superseded by the film request

1. Make the phone layout a purposeful stacked composition. Use larger, clean sans-serif display type, a short supporting sentence and one clear primary action. Maintain the compact three-part story.
2. Give the illustration more vertical presence on phones. Use controlled close views so satellites, suppliers, bridge and launch center remain recognizable. A wider establishing view can remain available. Avoid clipping essential meaning or hiding all context.
3. Place a concise, visible phase title with the scene. Use one obvious set of touch controls. Keep autoplay, play/pause and phase changes predictable, with a static readable state when motion is disabled.
4. Render the atmosphere with a restrained shader behind the bridge. Navy depth, a subtle light field and slight material movement can improve the stage without obscuring evidence paths, labels or controls. Use a static CSS background when GPU rendering is unavailable.
5. Keep the bridge and meaningful content in SVG and DOM. Retain no-JavaScript understanding, keyboard access, screen-reader descriptions and product links.
6. Make the two product paths larger and clearer on phones. Their spacing and type should communicate two choices immediately, rather than appearing as a compressed desktop table.
7. Reduce visual noise. Remove fine decorative text at phone scale, duplicate controls and unnecessary borders. Meaningful labels should stay readable; decorative detail can remain in the illustration without becoming required reading.
8. Account for browser bars and rotation with available-height rules and natural scrolling. Avoid forcing every device into a single fixed-height frame. Enlarged text must be allowed to increase page height.

## Paper Shaders implementation constraints

The reviewed version exposes `ShaderMount`, shader fragment exports and colour utilities that can be used without React. The source includes visibility and offscreen handling, `setSpeed`, deterministic `setFrame`, uniform updates and disposal. Version pinning is recommended by the project because the `0.0.x` API can change.

Sources:

- Package and documentation: <https://github.com/paper-design/shaders>
- Mount implementation: <https://github.com/paper-design/shaders/blob/main/packages/shaders/src/shader-mount.ts>
- npm metadata: <https://registry.npmjs.org/@paper-design%2Fshaders/latest>

Required application choices:

- Catch a failed WebGL2 initialization and keep a finished static background.
- Load and run the effect only where it provides value. Reduced motion, data-saving preferences, hidden tabs and offscreen content should receive an appropriately quiet state.
- Explicitly cap rendering resolution. The reviewed defaults include a minimum pixel ratio of 2 and an 8.3-million-pixel maximum, which are excessive starting points for a small mobile background. A pixel ratio around 1 and a substantially lower pixel cap, such as 750,000, are a starting assessment to validate on the actual effect.
- Pause real work when the motion control is paused. Freezing only visible CSS while a canvas continues rendering is insufficient.
- Dispose the mount and listeners during page teardown and handle repeated navigation without duplicate canvases.
- Keep the canvas decorative and out of the accessibility tree. Never bake essential labels, controls or product claims into it.
- Test the real shader on the chosen mobile viewports. Its GPU cost is not measured by package size alone.

This is an intentional amendment to the earlier native-only bridge decision: the meaningful illustration remains SVG, while a bounded decorative GPU layer may enhance the stage. It does not justify moving the entire interface into canvas or requiring WebGL for the page to work.

## Verification before calling the revision complete

Check portrait widths of at least 320, 360, 390 and 430 CSS pixels; short and tall landscape windows; tablet orientations; common laptop windows; a phone browser requesting a desktop layout; coarse-pointer and no-hover behavior; enlarged text; reduced motion; data saving; no JavaScript; missing WebGL2; paused animation; tab visibility; rotation and repeated navigation.

For each important state, verify legible type, reachable touch targets, no horizontal overflow, no clipping, a coherent static composition, clear product paths, working keyboard focus and a clean console. Record screenshots of both the complete page and its initial viewport. Automated checks should include behavior and layout, with human visual review of the resulting composition.

The requested 15 to 30 second first pass is a design target. It is not a measured engagement outcome. Browser checks cannot replace an actual phone review, including Chrome browser modes and rotation. Keep those limitations explicit in the release receipt.

## Installation outcome boundary

Confirmed installations reported by the main implementation session:

- Hosted Inspo MCP for Codex, successfully initialized as `hosted-0e1e636`. The research session successfully exercised its read-only live tools.
- Seven Design Taste skills using the built-in skill installer from pinned source revision `c4a6bff0871eb4b15371b0e7d2751628b0ed4608`: core, motion, typography, accessibility, landing-page, web-performance and GSAP guidance.
- Website dependencies `motion@14.3.0` and `@paper-design/shaders@0.0.81`, added with install scripts disabled.

Implemented: bold sans-serif typography, a near-white and navy presentation, a 24-second film in separately composed phone and wide formats, readable chapter controls and a transcript. The optional `/bridge` route has close camera views, semantic HTML labels, a bounded shader and motion/WebGL fallbacks. The phone-layout helper handles the controlled wide-layout simulation. GSAP 3.14.2 is used in the editable film composition, not shipped as a homepage animation runtime. Hyperframes 0.8.163 rendered both local H.264 deliverables. Physical-device review remains outstanding.

Other tools above are reviewed, optional, unavailable or unsuitable for this particular Astro page. This report does not claim that all of them were installed, authenticated or used. No payment, cloud sign-in, account setting change or external content publication was performed by the research agent.

## Post 3: creative software controlled by agents

Original: <https://x.com/TeddyinMedia/status/2108473264192336345>

Published: 9 October 2026 at 08:22:54 UTC. Full text recovered through the public FxTwitter endpoint, with X syndication metadata inspected. Attached video metadata reports 47.296 seconds at 16:9. The reference video itself was not visually reviewed. Its text is a tool list, not a prescribed visual style or a reusable licensed template.

The useful lesson is to make an actual editable composition and render it. A growing set of integrations can act inside creative software, but the required host application and license still matter.

| Tool in the post | Verified capability and practical limit | Decision for this film |
| --- | --- | --- |
| [Remotion](https://www.remotion.dev/) | Code-driven compositions. Official [MCP documentation](https://www.remotion.dev/docs/ai/mcp) deprecates the MCP and recommends Agent Skills. Official [pricing](https://www.remotion.dev/docs/license/pricing) requires a company license for organizations of four or more people. | Existing Remotion skill guidance was reviewed. No deprecated MCP installed and no paid license assumed or purchased. |
| [DaVinci Resolve community MCP](https://github.com/EddieRivers/davinci-resolve-mcp-free) | MIT bridge running inside Resolve 18+, including its free edition. The README documents loopback request guards and limitations on keyframes and Fusion parameters. | Useful for editing existing footage and grading. This task can render original graphics directly without installing a host application or exposing a persistent editing bridge. Not installed. |
| [Blackmagic announcement](https://www.blackmagicdesign.com/media/partial/release/20260908-03) | Official Resolve 21.1 release confirms AI assistant integration for project analysis, media organization, settings and rendering. | Confirms the direction of the post. It does not establish that every feature is available in this Mac's current setup. No application installed. |
| [CapCut MCP](https://github.com/burnshall-ui/capcut-mcp) | MIT Elixir/OTP server edits local draft JSON. The documented requirements specify Windows, CapCut, Erlang 28 and Elixir 1.19+. | Poor fit for this macOS Astro source workflow. Not installed. |
| [Photoshop Windows-first MCP](https://github.com/Vaxaxas/photoshop-mcp-windows-first) | MIT unofficial server; README claims Windows/macOS support but emphasizes Windows tooling and requires Photoshop. Quick-start clone instructions point to a different owner, which should be reconciled before execution. | No raster-editing requirement or verified host setup for this film. Not installed. |
| [Adobe registry](https://developer.adobe.com/internals/mcp-registry-web-app) | Official registry URL resolves, but the static reader returned no inspectable content. | No connector capability or successful connection inferred from the empty response. Existing Figma and Canva integrations remain available. |
| [FL Studio MCP](https://github.com/alansork/fl-studio-mcp) | MIT server uses local files and MIDI to control FL Studio. Piano-roll changes require an in-app script step. | The film is silent-first and needs no music-production workstation. Not installed. |
| [Ableton MCP](https://github.com/rokbag/ableton-mcp) | MIT bridge requires Python 3.11+ and Live 11 or 12 with Control Surface support. | No audio-production requirement. Not installed. |

Repository API requests were partially rate limited. Primary repository pages and READMEs supplied the compatibility and license findings above; no unsupported maintenance or security guarantee is claimed.

### Chosen render workflow

[Hyperframes](https://github.com/heygen-com/hyperframes), Apache 2.0, renders seekable HTML compositions to video and supports local preview and checks. Version 0.8.163 was run successfully for this project. The editable source uses a paused GSAP timeline, local fonts and original SVG-derived artwork. The portrait and wide compositions both render to exactly 24 seconds, 30 fps, H.264 and yuv420p. No external footage, music or artwork from the supplied posts was reused.

The CLI and authoring contract were used successfully. The optional automatic skill-repository installation stalled after project creation and was interrupted; the full Hyperframes skill bundle is not claimed as installed. Local composition, preview, check and render commands all worked. No cloud publication, app subscription or payment was made.

The homepage receives native video rather than a live rendering framework. This makes playback independent of WebGL and keeps the heavy composition tooling out of visitors' browsers. The detailed interactive bridge is a separate optional route.
