# Stage 7 Art Direction

Date: 2026-05-03
Site: kriseva.in
Scope: Premium polish art-direction reference for the existing Astro site. Implementation lives in `STAGE_7_POLISH_PLAN.md`.

> **Stage 7 takes the site from credible-and-shippable to dossier-grade institutional craft.** Every choice below serves the same job: convince a defense-procurement reader that this product was built by people who understand the work, not by a marketing team. No flashy SaaS aesthetic, no neon, no 3D, no scroll-jacking. The aesthetic is *quiet authority*.

---

## 1. Visual DNA — the language already on the page

### The brand mark

The KRISEVA mark is a stylised letter-K composed of:
- A **horizontal index bar** at the top (suggestive of a register entry or a dossier tab)
- A **single brass observation orb** above the bar
- A **vertical spine** with two diagonal arrows pivoting from a centre point (the decision pivot)

The orb is the signature element — a single, deliberate, brass-coloured marker on a navy field. It reads as **a compass dot, a decision marker, a flagged field**. Stage 7 promotes this orb to a recurring UI primitive (see §3, "the decision dot").

### The motif vocabulary (10 SVGs in `public/assets/motifs/`)

Reading the SVG source files directly, the motifs share an internal grammar:

- **Outer field:** `#071426` (deeper navy than `--navy-deep`)
- **Inner panel:** `#0c1b30` with a `#b78a45` brass hairline at `8 px` radius
- **Paper cards:** `#f2ead9` (paper, slightly cooler than `--paper`)
- **Mono labels:** `#b78a45` for tags, `#d8cfbd` for body, `#15253b` ink on paper
- **Border style:** continuous `1 px` for committed boundaries, **dashed (`5 5` or `8 7`)** for *crossable* boundaries (network egress, "not launched")
- **Card stacking:** offset `26 px` with progressive lightening (top-most = lightest)
- **Decision colours:** `#123225` forest (BID) · `#6b4a12` ochre (REVIEW) · `#6a1d1b` oxblood (SKIP) — read against paper, not navy

### What this means for Stage 7

The site already speaks this language in the screenshots and motifs. Stage 7 makes the *layout* speak it too. Every polish decision below echoes one of these grammar rules.

| Motif rule | Where Stage 7 applies it |
|---|---|
| Brass hairline on navy panel at 8 px radius | All `card`, `dossier-card`, `evidence-card`, `screenshot-frame` borders |
| Dashed boundary = "crossable / not committed" | The egress arrows on `/security`, the "NOT LAUNCHED" framing on `/issuer-roadmap` |
| Paper card on navy = "operator's surface" | Founder id-card on `/`, founder photo treatment on `/founder`, decision pills on `/tas` |
| Stacked offset cards | Homepage hero — bundle reveal |
| Bezier evidence path | Workflow page — clause → field → brief animation |
| Decision colours only on paper | Prevent the BID/REVIEW/SKIP palette from contaminating navy surfaces |

---

## 2. Refined design system

### 2.1 Colour — by role, not by hex

The current `tokens.css` lists colours by name (`--navy-deep`, `--brass`). Stage 7 adds **roles** so a future change can repalette without sweeping CSS. Names below are proposed; existing tokens stay as their backing values.

| Role | Backing token | Use |
|---|---|---|
| `--surface-deep` | `--navy-deep` `#04112A` | Hero darks; section--deep backgrounds |
| `--surface-base` | `--navy-dark` `#06101F` | Default body background |
| `--surface-rise` | `--navy` `#0A1F44` | Raised sections (`section--navy`) |
| `--surface-edge` | `--navy-line` `#10233b` | Card backgrounds inside navy sections |
| `--surface-paper` | `--paper` `#F4EFE1` | Paper sections |
| `--surface-paper-rise` | `--paper-light` `#FAF8F5` | Cards inside paper sections |
| `--ink-primary` | `--ink` `#111827` | Text on paper |
| `--ink-secondary` | `--ink-soft` `#1f2937` | Body text on paper |
| `--text-primary` | `--paper` | Headlines on navy |
| `--text-secondary` | `--paper-mute` `#e5dcc9` | Body on navy |
| `--text-quiet` | `--slate-600` `#5f6a78` | Captions, meta, "discipline lines" |
| `--accent-primary` | `--brass` `#C18A3E` | The decision dot, eyebrow labels, key emphasis |
| `--accent-soft` | `--brass-soft` `#b78437` | Hover-state brass |
| `--accent-line` | `rgba(193,138,62,0.34)` | Hairline rules |
| `--accent-line-soft` | `rgba(193,138,62,0.16)` | Inner divider rules |
| `--accent-glow` | `rgba(193,138,62,0.06)` | Tinted IS-card backgrounds |
| `--decision-bid` | `#2f6b4f` | BID pill (paper context only) |
| `--decision-review` | `#9a6a20` | REVIEW pill (paper context only) |
| `--decision-skip` | `#9a352c` | SKIP pill (paper context only) |
| `--state-warn-bg` | `rgba(154,53,44,0.06)` | "NOT" anti-claim card backgrounds |
| `--state-good-bg` | `rgba(47,107,79,0.06)` | "WITH TAS" workflow column |

**Discipline:** the accent palette is brass-only. **No additional accent hues.** Decision colours appear *only on paper*, never as a panel background on navy. The "egress" / "not committed" status uses the dashed brass line, never a new colour.

### 2.2 Typography scale

Current scale (`global.css`) is fluid `clamp()` based. Stage 7 refines two things: tighter tracking on serif headlines, and a separate "discipline-line" mono treatment.

| Role | Family | Weight | Size | Tracking | Line height |
|---|---|---|---|---|---|
| `display` (h1) | Libre Baskerville | 700 | `clamp(2rem, 5vw, 3.2rem)` | `-0.012em` (new) | `1.08` |
| `headline` (h2) | Libre Baskerville | 700 | `clamp(1.6rem, 3.5vw, 2.4rem)` | `-0.008em` (new) | `1.2` |
| `subhead` (h3) | Libre Baskerville | 700 | `clamp(1.18rem, 2.5vw, 1.6rem)` | `-0.004em` (new) | `1.3` |
| `field-label` (h4) | Inter | 600 | `1.05rem` | `0` | `1.45` |
| `body-large` | Inter | 400 | `1.06rem` | `0` | `1.7` |
| `body` | Inter | 400 | `1rem` | `0` | `1.65` |
| `body-small` | Inter | 400 | `0.92rem` | `0` | `1.6` |
| `eyebrow` | JetBrains Mono | 500 | `0.72rem` | `0.18em` | `1.4` (uppercase) |
| `meta` | JetBrains Mono | 500 | `0.66rem` | `0.14em` | `1.4` (uppercase) |
| `discipline` | JetBrains Mono | 400 | `0.62rem` | `0.06em` | `1.4` (sentence case) |
| `quote-pull` | Libre Baskerville italic | 400 italic | `1.32rem` | `0` | `1.45` |

**Why italic Libre Baskerville for pull quotes?** Because the founder note quotes a person speaking from inside the workflow; italic serif reads as a primary source, not a marketing line.

**Drop the small caps.** Don't introduce `font-variant: small-caps` anywhere; the mono labels already carry that role.

### 2.3 Spacing scale — institutional rhythm

The current site uses one section spacing token (`--section-y: 96px / 56px`). Stage 7 adds two more so rhythm reads cinematic at desktop, dense at mobile.

| Token | Desktop | Mobile (≤768) | Use |
|---|---|---|---|
| `--section-y-tight` | `64px` | `40px` | Closing CTA blocks, contact form |
| `--section-y` (existing) | `96px` | `56px` | Default section vertical |
| `--section-y-loose` | `128px` | `72px` | Homepage hero, founder hero, validation hero |
| `--gap-section-bar` | `12px` | `12px` | Between eyebrow + headline + lede |
| `--gap-grid` | `18px` | `12px` | Card-grid gaps |
| `--gap-grid-loose` | `32px` | `20px` | Two-column grid gaps with figure on one side |

### 2.4 Grid system

12-column grid implied by content shape, not explicit. Three layouts dominate:

- **Hero asymmetric** — `1.4fr 1fr` (copy left, identity-card right) with `56px` gap, falling to single-column at 880 px.
- **Editorial split** — `0.85fr 1.15fr` (caption left, primary visual right). Used by founder-note + field-notes + validation arch.
- **Card matrix** — `repeat(3, 1fr)` → `repeat(2, 1fr)` at 980 → single at 640 px.

**New for Stage 7: a 1280 px breakpoint** that holds the hero asymmetric to `1.4fr 1fr` but eases gaps from `56px` to `64px`. At 1440 px the gap relaxes to `72px`. This matches the dossier-page rhythm where wider paper makes wider margins.

### 2.5 Border / hairline system

The site has two hairlines today (`--hairline`, `--hairline-soft`). Stage 7 names a third for **disciplinary boundaries**.

| Token | Style | Use |
|---|---|---|
| `--rule-edge` | `1px solid rgba(193,138,62,0.34)` | Section + card outer borders |
| `--rule-soft` | `1px solid rgba(193,138,62,0.16)` | Inner dividers, list separators |
| `--rule-dashed` | `1px dashed rgba(193,138,62,0.55)` | "Crossable" boundaries — egress arrow, "not launched" outline, "deployment-specific" lines |
| `--rule-paper` | `1px solid rgba(16,35,59,0.18)` | All borders inside paper sections |

**Dashed rule discipline:** dashed always means *the boundary is documented and crossable* (egress, deployment-specific, not-yet-launched). It is never decorative. Where the motif uses dashed strokes (`local-first-boundary.svg`, `issuer-side-roadmap.svg`), the page borrows the same code.

### 2.6 Paper / dossier surface system

Three surface treatments, each with a different elevation cue.

| Surface | Background | Border | Shadow | When |
|---|---|---|---|---|
| `paper-flat` | `var(--paper)` | none | none | The page background of paper sections |
| `paper-card` | `var(--paper-light)` | `var(--rule-paper)` | `0 8px 24px rgba(3,10,20,.06)` | Standard paper card (form, dossier card) |
| `paper-id` | `var(--paper)` | `1px solid rgba(193,138,62,0.45)` + 6 px brass top stripe | `var(--shadow-lift)` | The founder identity card and any "registered" surface |

The 6 px brass stripe at the top of the identity card is **kept** — it is the strongest dossier-grade visual signal on the site and reads as a paper folder tab.

### 2.7 Shadow / depth system

| Token | Elevation | Use |
|---|---|---|
| `--shadow-quiet` | `0 4px 12px rgba(3,10,20,.18)` | Flat-card hover |
| `--shadow-lift` (existing) | `0 18px 50px rgba(3,10,20,.22)` | Identity card, hero asides |
| `--shadow-depth` (existing) | `0 24px 80px rgba(0,0,0,.35)` | Screenshot frames |
| `--shadow-card-hover` (new) | `0 22px 60px rgba(3,10,20,.28)` | Dossier-card hover replacement |
| `--ring-brass` (new) | `0 0 0 3px rgba(193,138,62,.32)` | Anchor-target highlight + focus-within ring |

Depth is built only with shadow + 1 px translate. **No glow filters, no blurred radials, no internal soft-shadows.** Defense procurement does not need bloom.

### 2.8 Motion durations and easing

| Token | Duration | Easing | Use |
|---|---|---|---|
| `--micro` (existing) | `140ms` | `ease-out` | Hover state, link colour, button bg |
| `--motion-precise` (new) | `220ms` | `cubic-bezier(.2,.7,.2,1)` | Drawer open, tab switch |
| `--section-ease` (existing) | `420ms` | `cubic-bezier(.2,.7,.2,1)` | Scroll reveal, view-transition fade |
| `--motion-pulse` (new) | `1200ms` | `cubic-bezier(.2,.7,.2,1)` | Decision pill single-pulse, anchor target ring |
| `--motion-stagger` (new) | `40ms` | linear | Per-item delay in grid stagger |

**Motion budget:** total client-visible motion per page must stay below ~4 seconds of cumulative animation when entering. No looped animations anywhere except the (already-present) brass-stripe shimmer on the founder identity card — and even that should be gate-checked at Phase 4.

### 2.9 Reduced-motion behaviour

Already gated four ways (preflight §3). Stage 7 makes the contract **explicit and one-line per motion**:

- Scroll reveal → instantly visible.
- Stagger → no delay; all simultaneous instant-visible.
- Decision pulse → no pulse; pill renders in final state.
- Anchor ring → ring appears statically and fades in 300 ms (still acceptable under reduced motion because it is a state indicator, not decoration).
- Header on-scroll shadow → shadow appears with no transition.
- Page transition → no fade, instant swap.

This contract goes in a single CSS comment block in `tokens.css` so future contributors know what to honour.

### 2.10 Mobile layout principles

Mobile is not "desktop, scaled". The 360–640 px range gets its own composition rules.

1. **Hero never falls below the fold.** Hero compresses to a single column with the headline above the identity-card or visual.
2. **Identity cards become full-width.** `founder-id-card` drops the 6 px stripe to 4 px and tightens internal padding from `26px 28px` to `20px 22px`.
3. **Stacked dossier cards (homepage hero) drop to 2 cards instead of 3.** The third card was always implied; it's not load-bearing on small screens.
4. **Eyebrow + headline gap drops** from `16px` to `12px` to keep above-fold density.
5. **Mono-labels stay at the desktop size** (`0.62rem` / `0.66rem`). Reducing them further makes the eyebrow vanish on iPhone SE (320 px-class).
6. **CTAs stack full-width** below ~480 px; never inline.
7. **Footer columns collapse** in this order: 3 → 2 (Home + Pages | Contact) → 1.
8. **Tables on mobile become "field labels above value" layouts** — no horizontal scroll.

---

## 3. Signature interactions — page-specific moments

Each signature is one moment per page. They are restrained, never gimmicky, always reduced-motion-safe.

### 3.1 Homepage — Hero "tender bundle reveal"

**Effect:** As the homepage hero enters the viewport (or on first load), three offset paper cards in the hero aside settle into place from a stacked, slightly-rotated position into their final dossier-stack alignment.

**Mechanics:**
- Use `tender-bundle-stack.svg` motif as the visual.
- On entry, animate the three `<g>` rectangles inside the SVG via CSS transforms (`translateY` + `rotate`) over `420ms` with `--motion-stagger` between cards (40 ms).
- Once settled, the brass observation orb at the bottom-right corner of the top card subtly pulses once (single pulse, `--motion-pulse`).
- Reduced-motion: cards render in final position; orb does not pulse.

**Why:** This single moment establishes the bundle thesis visually before the reader has read it. It earns its complexity by being the only such moment on the homepage.

### 3.2 TAS — Source-linked extraction hover

**Effect:** When a reader hovers a row in the **compliance matrix preview** or focuses an `EvidenceCard` on the TAS page, a thin brass connector line draws from the row to the source citation in 220 ms.

**Mechanics:**
- Use `:hover` and `:focus-within` on `.matrix-table tr`.
- The connector is a `::before` pseudo-element with `transform: scaleX(0)` resting → `scaleX(1)` on hover, `transform-origin: left`.
- Reduced-motion: line appears static (no scale animation) at full length.

**Why:** The site says "every claim points back to a clause and a page." The hover moment makes the *connection* legible, not just the words.

### 3.3 Workflow — Evidence trail draw-on-enter

**Effect:** The evidence-trail bezier path on `/workflow` (using `evidence-trail-line.svg`) draws itself once when the section enters the viewport. The 5 nodes (DOC → PAGE → CLAUSE → FIELD → BRIEF) light their ring (brass) one after the other as the path passes them.

**Mechanics:**
- SVG `<path>` with `stroke-dasharray` + `stroke-dashoffset` animation over `1200 ms` (`--motion-pulse` × 1).
- `<circle>` rings transition `stroke-width: 0 → 2px` at staggered offsets.
- Single-shot: once it draws, it stays drawn for the rest of the session.
- Reduced-motion: path renders fully drawn from frame 1; circles are pre-lit.

**Why:** This is the visual proof of the clause-to-decision pipeline. Drawing it once communicates the linearity and the auditability.

### 3.4 Decision pills — single pulse on first viewport entry

**Effect:** When the BID / REVIEW / SKIP decision section enters the viewport, each pill receives a single brass-light border pulse, staggered by 40 ms.

**Mechanics:**
- WAAPI (`element.animate(...)`) with `boxShadow` keyframes from `0 0 0 0 rgba(193,138,62,0)` to `0 0 0 4px rgba(193,138,62,.32)` and back, over `--motion-pulse`.
- One-shot per pill per session.
- Reduced-motion: no pulse.

**Why:** It is the decision moment. Drawing the eye to the three pills once — never repeating — frames them as buttons that *make a decision*, not as labels.

### 3.5 Screenshot frame — pointer-aware tilt with hard limits

**Effect:** Hovering a `ProductScreenshotFrame` produces a very slight pointer-tracked tilt (no more than `1.2deg` on either axis), with a soft brass edge highlight on the side closest to the pointer.

**Mechanics:**
- CSS custom properties updated by a pointermove listener: `--mx`, `--my`. Listener throttled with `requestAnimationFrame`.
- `transform: rotateX(...) rotateY(...)` clamped via `clamp()` with `1.2deg` max.
- Listener is added only on the first hover entry and removed when the frame leaves the viewport.
- Reduced-motion: listener never installed; frame stays flat.
- Pointer-coarse media (`@media (pointer: coarse)`): listener never installed; touch-only devices keep flat frames.

**Why:** Premium hover feedback without entering "tilt-card SaaS" territory. Hard 1.2° limit is the difference between *premium* and *cheesy*.

### 3.6 Founder field-notes reveal

**Effect:** On `/founder`, the Field-Notes section's three notes (`field note 01 / 02 / 03` — already in the SVG motif) reveal one at a time as the user scrolls into view, each preceded by a brass underline that draws from left to right.

**Mechanics:**
- IntersectionObserver targets the field-notes block.
- A small custom-property `--reveal-step` cycles 0 → 1 → 2 → 3 over 1.2 s.
- Each note has `transition-delay: calc(var(--reveal-step) * 240ms)`.
- Reduced-motion: all notes render simultaneously, no underlines.

**Why:** The field-notes card is where the founder thesis is most condensed. Reveal forces the reader to *read each line*, which is the point.

### 3.7 Contact intent selector — anchor-state focus

**Effect:** Selecting an intent radio (Demo / Pilot / Issuer / Partnership / Other) on the contact page makes the chosen row's brass left-rule extend full-height of the row. URL `?intent=demo` deep-link gets the same visual (no flash of wrong intent first).

**Mechanics:**
- Pure CSS via `:has(:checked)` — supported across modern browsers; sets a `border-left: 2px solid var(--brass)` on the row.
- The query-param handler script (already present) runs synchronously before paint via `<script>` placed in `<head>` defer, so the correct row paints checked on first render.
- Reduced-motion: no transition; instant rule swap.

**Why:** The `?intent=` URL is a serious affordance. The visual settling needs to confirm "yes, the system is listening" without animation overhead.

### 3.8 Anchor-target arrival ring

**Effect:** When a reader clicks an in-page link (e.g. footer "TAS" → `/tas#capabilities`) and arrives at the section, the section heading receives a brass left-rule pulse that fades in 1.2 s.

**Mechanics:**
- CSS-only `:target` selector. Animation key-frames a `box-shadow: -3px 0 0 var(--brass)` value in then fades out.
- One-shot per navigation.
- Reduced-motion: rule appears static for 0.3 s and fades.

**Why:** Arrival confirmation. Reduces the "did the link work?" cognitive moment.

### 3.9 The decision dot — brand-mark callback

**Effect:** A small brass orb (`6 px` radius, `--accent-primary`) becomes a recurring micro-element. It marks:
- The leading bullet on every "discipline line" in the footer
- The status indicator on `(in pilot)` `(roadmap)` chips
- The leading element on every numbered timeline entry on `/founder`

**Mechanics:** A reusable Astro component or CSS class `.dot-brass`. No animation by default; on the founder timeline, a focus ring appears when the timeline row is hovered.

**Why:** The brand mark already uses this orb. Repeating it across the UI quietly ties every page back to the mark. It is the single most efficient piece of brand reinforcement available.

---

## 4. Page-specific polish targets

Each section captures one art-direction line and 3-5 specific moves. Numbers map back to the polish plan.

### 4.1 Homepage `/` — *cinematic procurement intelligence*

**Direction:** A reader lands and within 800 ms of paint sees three things: the thesis, the bundle visual settling, and the three CTAs. No more.

- Apply §3.1 hero bundle reveal.
- Tighten the "Defense procurement is document intelligence…" paragraph: `--font-large` lede, then the four problem-thesis cards `paper-card` surface.
- The TAS preview section gets a *windowed* TAS screenshot (clip the 5 753 px tall original to ~720 px visible, with a faint brass top/bottom mask line indicating it continues).
- Issuer-side roadmap preview block uses `--rule-dashed` left edge (the "not committed" rule).
- Validation strip becomes 3 columns at desktop with `--rule-soft` separators.
- Closing founder CTA on navy surface with `paper-id` portrait card.

### 4.2 TAS `/tas` — *product operating room*

**Direction:** The TAS page is the operator's command room. Reader should feel the surface tension of a system that *runs operations*.

- Keep the 9-capability grid; tighten card hover (§3 + Phase 4.2 of plan).
- The compliance matrix preview gets §3.2 hover.
- The three-cell BID/REVIEW/SKIP grid gets §3.4 single pulse.
- Screenshot frames get §3.5 tilt.
- "Boundaries" (`tas-not`) section: each `NOT` card uses `--rule-dashed` left edge — these are *not committed* claims, the dashed rule confirms it visually.
- Add a small "Procurement command layer" caption under the dashboard screenshot using `--font-mono` discipline copy.

### 4.3 Workflow `/workflow` — *before / after transformation*

**Direction:** A reader scrolling the page should physically *feel* the transition from manual chaos to structured intelligence.

- The "Before TAS" column gets a slightly desaturated red-on-paper tone (already present); the "With TAS" column gets the brass border treatment.
- 8-step pipeline becomes a vertical timeline with §3.3 evidence-trail draw on entry; the 8 evidence-cards inherit the connecting line.
- Closing visual uses `evidence-trail-line.svg` with the §3.3 draw-on-enter signature.
- Add a small `mono` caption under each step: `Source · ${something}` using existing source meta.

### 4.4 Security `/security` — *boundary map*

**Direction:** A reader should leave with one thought: *the boundaries here are documented, not assumed*.

- Promote the existing `local-first-boundary.svg` to the page's primary visual; use the dashed bridge stroke as a recurring rule for every external integration mentioned in the boundary table.
- "Inside the boundary" table gets a faint paper inset; "Across the boundary" table gets dashed left-rules per row.
- The "What we will not call this" anti-claim list becomes more prominent — paper-card surface, brass rule on top, mono header `WE DO NOT CALL THIS`.
- Settings screenshot frame uses §3.5 tilt; treat it as the operator's actual surface, not a marketing image.

### 4.5 Issuer roadmap `/issuer-roadmap` — *restrained strategic memo*

**Direction:** The page is a *memo*, not a brochure. Every visual must read as "deliberately understated".

- Status banner becomes more typographic: large mono label "ROADMAP / VALIDATION / PILOT EXPLORATION" stacked over the body sentence, with `--rule-edge` framing.
- Capability sketches become 2 columns × 3 rows on desktop (currently 3×2). Slows the read; matches the memo cadence.
- Add a `--rule-dashed` underline on every "(roadmap)" badge.
- The closing stakeholder discovery section gets a brass-stamped quote treatment with `font-style: italic` and `quote-pull` typography. No real quote published — the styling marks the *form* in case Tier-1 named-permission ever lands.

### 4.6 Validation `/validation` — *audit-room proof page*

**Direction:** This is where a reader who doesn't trust marketing comes to read evidence. The page should *feel* like a clean audit room.

- Add a "SEEDED DEMO" badge to every screenshot frame as a paper-tab on the top-right corner of each frame (in addition to the figcaption).
- The test-count careful sentence gets its own `paper-card` surface with `--rule-dashed` border (the dashed rule signals "carefully worded; not the marketing line").
- Stakeholder-discovery cards stack vertically on desktop instead of 2-up — gives each card more breathing room and matches the memo cadence.
- The architecture proof section gets a small mono label under the SVG: `Source: `local-first-boundary.svg` motif · Stage 6 reference`.

### 4.7 Founder `/founder` — *editorial field-notes story*

**Direction:** Long-read editorial dossier. Quiet, slow, deliberate.

- Founder hero ribbon: tighten the dossier metadata (`DOSSIER · KRISEVA-FNDR-01`) with `meta` typography and `--rule-soft` separators.
- Founder identity card: keep the 6 px brass stripe; refine the photo treatment to a `1px solid var(--accent-line)` frame + `var(--shadow-lift)`.
- The four observation rows become a numbered ledger with `OBSERVED · 01`, `OBSERVED · 02`, `OBSERVED · 03`, `INFERRED · 04` — the numbering is the dossier signature.
- Field-notes section gets §3.6 reveal.
- Timeline stays as-is structurally; refine the rail line to use `--rule-dashed` for the "Roadmap" entry and solid for the others (visual consistency with the rule discipline).
- Operating principles cards get `--shadow-card-hover` on hover.

### 4.8 Contact `/contact` — *high-conversion founder conversation page*

**Direction:** Make it feel like writing a direct note, not filling a SaaS form.

- The intent radio group gets §3.7 anchor-state focus.
- "What this conversation is" list moves above the form on mobile, beside it on desktop.
- The "Compose Email" button gets a small `→` icon (using a 12 × 12 inline SVG, not an icon font) that subtly travels right on hover.
- Direct email line uses `eyebrow` typography and is rendered as `<a class="mailto-direct" …>` so a future enhancement can bind a copy-to-clipboard micro to it without touching the form.
- Form labels are kept in mono — they read as "fields", which fits the dossier register.

### 4.9 404 — *quietly in-character*

**Direction:** Even the 404 should feel like a dossier missing-page report.

- Headline already reads "This dossier number is not on file." — keep.
- Add a faint `mono` line below: `Reference · ${pathname}` (rendered server-side from `Astro.url.pathname`).
- 404 still publishes the 4 standard route CTAs and has no other links.

---

## 5. Anti-patterns — what the polish must NOT become

### 5.1 Trust-harming patterns (forbidden)

- ❌ Stock-photo backgrounds, especially of soldiers, fighter jets, or government buildings
- ❌ Stock illustrations of "AI" abstractions (orbs, brains, chips)
- ❌ Hero auto-rotating taglines or word-cycling animations
- ❌ Fake live counters, fake activity feeds, fake "currently in use" badges
- ❌ Government emblems, defense PSU logos, agency names rendered as visual elements
- ❌ Logo walls (real or fake)
- ❌ Testimonial carousels
- ❌ Pricing card + "contact for enterprise" pattern
- ❌ Cookie-consent banner styled to look like a security feature
- ❌ A "trusted by" strip of any kind

### 5.2 First-paint-harming patterns (forbidden)

- ❌ Loading splash / pre-loader / skeleton-as-aesthetic
- ❌ Custom cursor on desktop
- ❌ Background canvas / WebGL backgrounds
- ❌ Animated gradient backgrounds
- ❌ Web fonts that block FCP (the existing setup uses `display=swap`; keep it)
- ❌ Lottie or other JSON animation files
- ❌ Inline base64 video or background video
- ❌ JavaScript-required hero text
- ❌ Layout-shift-causing fonts (every text element has `font-display: swap` and a strong fallback already)

### 5.3 Claim-safety-compromising patterns (forbidden)

- ❌ Any visual that implies live-product status for issuer-side
- ❌ Any badge / shield icon that reads as "security certified" or "approved"
- ❌ Charts or graphs of fake metrics ("decision time saved", "tenders processed")
- ❌ Any dashboard mock-up beyond the existing screenshots
- ❌ Country flags, military insignia, defense ranks
- ❌ Any government portal logo as an asset
- ❌ Any defensive-style cipher / typewriter text effect that implies classified material — we are *not* a classified-document UI
- ❌ The word "platform" — we use "product" and "system"

### 5.4 Generic-AI-SaaS patterns (forbidden)

- ❌ Purple / violet / fuchsia accents
- ❌ Glass-morphism panels
- ❌ Aurora / mesh gradients
- ❌ Soft pastel decoration
- ❌ Sticker-style icons
- ❌ "Get started for free" CTA
- ❌ "Powered by [LLM]" attribution
- ❌ Any decorative typography motion (typewriter, blur-in, etc.)
- ❌ Bento-grid hero layouts
- ❌ "Built with [framework]" badges
- ❌ A "Made by humans" footer joke
- ❌ A chatbot widget on any page

### 5.5 Performance-cliff patterns (forbidden)

- ❌ Shipping a font binary > 60 KB total
- ❌ Adding any animation library larger than 5 KB minified
- ❌ Adding any third-party JS to the public bundle
- ❌ Lazy-loading the LCP image
- ❌ Using more than 3 distinct font weights total (currently: serif 400+700, sans 400+500+600+700, mono 400+500 — already at the limit)
- ❌ Over-specifying breakpoints (5 is the limit: 360 / 640 / 768 / 1024 / 1280)
- ❌ Using `100vh` (use `100dvh` if needed)

---

## 6. Implementation guardrails for Stage 7

These are restated from `STAGE_7_PREFLIGHT.md` §8 because they govern every art-direction decision:

- **Approved copy is not editable.** Every claim wording lives in `docs/PUBLIC_CLAIMS_REGISTER.md`. Polish changes layout, not language.
- **Reduced motion is a release gate.** No motion ships without an instant-final fallback path verified by toggling `prefers-reduced-motion: reduce`.
- **Static-first is non-negotiable.** Core content renders without JavaScript. Motion and interaction are progressive enhancement only.
- **No new third-party JS.** Total client JS stays under ~5 KB gzipped.
- **No cloud-based services.** Visual regression stays on disk via Playwright. No Argos / Percy / Chromatic.
- **No Astro major-version bump.** Stay on 4.16 for Stage 7.
- **All 9 routes must continue to render.** Polish is non-destructive per route.
- **`npm run qa` must remain green** end-to-end at every commit.

---

## 7. Decision tree for "should this go in?"

For any candidate polish move, ask in order:

1. **Does the motif vocabulary already use this?**
   - Yes → adopt with the existing palette & shape rules. Stop.
   - No → continue.
2. **Does it serve information architecture?**
   - Yes → continue.
   - No → reject.
3. **Does it work without JavaScript?**
   - Yes → continue.
   - No → can the JS be < 200 B and reduced-motion-safe? If no, reject.
4. **Does it pass at 360 px?**
   - Yes → continue.
   - No → either downgrade for mobile (cleaner version) or reject.
5. **Does it match a published claim?**
   - Yes → continue.
   - No → reject (would be unsupported aesthetic implication).
6. **Does it harm trust at any breakpoint?**
   - No → adopt.
   - Yes → reject.

This tree is the discipline. If a move makes it through all six, it earns its place. If it can't, it doesn't ship in Stage 7.

---

## 8. What this art direction does NOT do

- Does not change the route map.
- Does not change any approved claim wording.
- Does not introduce a new framework, library, or runtime.
- Does not propose a redesign — every move maps to the existing motif vocabulary.
- Does not add tracking, consent banners, or third-party services.
- Does not commit to a final visual; the polish plan is where each move is gated by `npm run qa`.

The next document in the chain is `STAGE_7_POLISH_PLAN.md`. Each polish-plan task references one signature, one page-section, or one design-system extension defined in this art direction.
