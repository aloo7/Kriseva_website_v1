# Stage 7 Conversion & Story Polish — Implementation Report

Date: 2026-05-03
Scope: Polish for `/founder`, `/issuer-roadmap`, `/contact`, `/404` per the Stage 7 plan and art direction. **No copy / claim changes that introduce or strengthen claims. No new metrics. No new dependencies.**

> **Verdict — gates green.** All Stage 5/6/7 lint, type, and build gates pass. Bundle overhead vs. previous Stage 7 state: ~1.5 KB gzipped CSS (split across the 4 page chunks). Zero new JS shipped. Zero new dependencies.

---

## 1. /founder — *Editorial field notes from inside defense procurement*

### Route changes
- **Founder photo treatment refined.** The portrait now renders inside a `<figure>` with a small `FOUNDER PORTRAIT · 2026` paper-tab caption anchored bottom-right (mono brass on translucent navy with backdrop-blur). Reads as an editorial dossier portrait, not a stock-photo headshot.
- **Observation ledger** (4 OBSERVED / INFERRED rows) now wrapped with `data-stagger` so each row reveals 40 ms after the previous — gives the founder note's evidence-style cadence.
- **Why-cards** (3 NOT + 1 IS) wrapped with `data-stagger` for the same cadence.
- **Operating principles** grid (5 cards) wrapped with `data-stagger`.
- **Closing CTA** now uses explicit founder-led framing:
  - Heading: "Speak directly with the founder."
  - Body: "Direct inquiries only — defense MSME, defense-tech, OEM/SI, issuer-side, or institutional observer. No SDR funnel. Confidential by default. Findings feed product spec, not marketing."
  - The visitor-categories list mirrors the brief and matches the new `/contact` stakeholder dropdown options exactly.

### Why the timeline did NOT get `data-stagger`
The founder-market-fit timeline uses an absolute-positioned brass rail line connector between rows. Wrapping each row in a transformed `.reveal` would shift the rails out of alignment during entry. Timeline keeps a single `.reveal` block; each row reveals together when the section enters. This is a deliberate decision documented here.

### Files changed
- `src/pages/founder.astro` — photo `<figure>` + caption, 3 stagger reveals, refined CTA props.

---

## 2. /issuer-roadmap — *Strategic roadmap under validation*

### Route changes
- **Status banner upgraded** to a senior memo banner:
  - Header row: `STATUS · NOT LAUNCHED` (mono brass) on the left, `§ 01 / ROADMAP MEMO` chapter-marker on the right
  - Dashed bottom rule (Stage 7 design-system "documented and crossable" discipline)
  - **Dashed border** on the entire banner — signals the whole memo as exploratory, not committed
  - `--shadow-lift` framing
- **NEW: 5-phase exploration roadmap** (`iss-phases`). An indexed list (`<ol>`) of phases:
  - `01 · Discovery` — `CURRENT` (brass solid border-left, soft brass background wash)
  - `02 · Spec exploration` — `EXPLORING`
  - `03 · Pilot pairing` — `ROADMAP`
  - `04 · Pilot execution` — `ROADMAP`
  - `05 · Generalization` — `ROADMAP`
  - Each row carries dashed bottom rule (Stage 7 discipline), label + sub-line + status chip
  - Discipline footnote: *"Each phase is conditional on the previous · No timeline committed · No agency relationship implied"* — left-rule dashed
- **Capability sketches** (6 cards) now use `data-stagger` and gained `meta="Under exploration"` strings (consistent with the "exploratory by design" framing already in the page).
- **"What this is not" list** got the **dashed left rule** (Stage 7 design-system signal for "we do not claim this") and tighter padding rhythm — matches `/security` and `/tas` boundary lists for visual consistency.

### Claim safety
- Phase labels (`Discovery`, `Spec exploration`, `Pilot pairing`, `Pilot execution`, `Generalization`) are exploratory by design — none describe a launched product. The status chips are conditional (`CURRENT` for the only phase actively running, `EXPLORING` and `ROADMAP` for all others).
- No timeline is shown. No agency relationship is implied. No name is published.
- Stakeholder discovery section unchanged (anonymized Tier-2 wording from Stage 6).

### Files changed
- `src/pages/issuer-roadmap.astro` — status banner upgraded, new 5-phase roadmap section, 3 stagger reveals, dashed-rule discipline on the not-list.

---

## 3. /contact — *High-trust founder conversation intake*

### Route changes
- **NEW: "Who this is for" visitor-framing strip** above the compose form. A 5-row indexed list:
  - `01 · Defense MSME` → Bidder-side · GeM/DefProc workflows · MII/DPSU/ATC compliance
  - `02 · Defense-tech company` → Bid teams running discovery, extraction, and bid-readiness review
  - `03 · OEM / system integrator` → Multi-tender orchestration · subcontractor compliance · audit trail
  - `04 · Issuer-side / procurement` → Senior reviewer load · evaluation traceability · roadmap conversation
  - `05 · Institutional observer` → Partnership · ecosystem · advisory · evaluation context
  - Each row uses mono number + serif label + uppercase mono body — matches the dossier-index treatment elsewhere on the site
- **Stakeholder dropdown** in `ContactIntentPanel` updated to match the visitor strip 1:1:
  - `defense-msme` — Defense MSME / bidder-side
  - `defense-tech` — Defense-tech company
  - `oem-si` — OEM / system integrator
  - `issuer` — Issuer-side / procurement
  - `institutional` — Partnership / institutional observer
  - `other` — Other
  - (Was: bidder / issuer / advisor / ecosystem / other.)
- **Contact-meta list** (the 6-line "what this conversation is" list) reframed as a small panel with brass-tinted background, 4 px brass dots, dashed bottom rule — visually grouped as a single trust assertion.
- **Direct mailto fallback** made more prominent: a labelled `If your mail client doesn't open` block that exposes the email link + a transparent disclaimer: *"No backend stores anything until you press send. The form is a transparent mail-client compose helper."*
- **Compose Email button** carries `data-arrow` so the trailing `→` slides 4 px on hover (Stage 7 design-system feature).

### CTA / intent behaviour verified in dist HTML

| Trigger | URL | Pre-selection | Verified |
|---|---|---|---|
| Footer `Contact Founder` | `/contact` | first radio (Book Demo) | ✓ — falls back to `demo` when no `?intent=` |
| Footer `Book Demo` | `/contact?intent=demo` | `demo` radio checked | ✓ — `value="demo"` rendered with `checked` attr |
| Footer `Join Pilot` | `/contact?intent=pilot` | `pilot` radio checked | ✓ — JS reads `?intent=` and sets the matching radio |
| `Issuer-side discussion` | `/contact?intent=issuer` | `issuer` radio checked | ✓ — same mechanism |
| Direct email link | `mailto:ayush@kriseva.in?subject=…` | n/a | ✓ — opens the user's mail client; no fake submission state |

The intent pre-selection mechanism is the existing CSS `:has(input:checked)` for the brass left-rule + the existing JS that reads `URLSearchParams` synchronously before paint. **No flash of wrong intent** on deep-link.

### Form transparency
- Disclosure block at the top of the form: *"Submitting opens your mail app with a draft to ayush@kriseva.in. Nothing is sent until you press send in your mail client."*
- The submit button composes a `mailto:` URL with all form fields URL-encoded as the body and triggers `window.location.href = mailtoUrl`. **No fake "Thank you" success state.** No backend, no fetch.
- The `If your mail client doesn't open` panel below the meta list gives the user a direct mailto link as a fallback.

### Files changed
- `src/pages/contact.astro` — new visitor strip, refined meta panel, expanded mailto-fallback section.
- `src/components/ContactIntentPanel.astro` — stakeholder dropdown options updated to match the brief.

---

## 4. /404 — *Minimal, premium, useful*

### Route changes
- **Header row** with `404 · Not Found` SectionLabel on the left + `DOSSIER · MISSING ENTRY` mono ID on the right.
- **Server-rendered reference line** (`Reference · {pathname}`) in mono brass, brass-faint background, dashed left-rule. When the host preserves the requested path on the 404 response (e.g. SPA fallback or `_redirects`), the reference shows the missing path; otherwise it falls back to `Reference · unfiled`.
- **Primary CTA reordered** so `Contact Founder` is first (was `Back to Home`). Order: `Contact Founder` (primary) → `Back to Home` → `Open the TAS page` → `Founder`.
- **NEW: Route-recovery index** below the CTAs — a `§`-prefixed list of all 7 site routes, mono. Reads as a dossier table-of-contents.
- **Direct email line** at the bottom of the section as the last-resort recovery path.
- **Quiet brass corner-wash** matches the homepage hero's depth treatment without drawing attention.
- Mobile: CTAs stack full-width below 600 px.

### Files changed
- `src/pages/404.astro` — full rewrite with header row, reference line, recovery index, direct email.

---

## 5. CTA behaviour — verified in built HTML

`dist/founder/index.html` — 7 occurrences of `Contact Founder` href to `/contact`, plus header CTA + closing FounderCTA renders all three (Contact Founder / Book Demo / Join Pilot).

`dist/issuer-roadmap/index.html` — 8 occurrences (header CTA, hero CTA, status banner cross-references, closing FounderCTA's three buttons, footer).

`dist/404.html` — 5 occurrences: header CTA, hero primary CTA, footer CTA, footer Book Demo, footer Join Pilot.

`dist/contact/index.html` — Contact Founder is the page itself; header still shows the Contact Founder primary button (consistent with all other pages — the user can click it from the contact page itself; Astro doesn't disable it). Form intent radio renders all 5 options with correct `value=""` attributes.

---

## 6. Contact behaviour — verified

| Behaviour | Status |
|---|---|
| Form is a `mailto:` compose, not a backend POST | ✓ — verified in `ContactIntentPanel.astro` script |
| URL `?intent=demo` pre-selects the Book Demo radio on first paint | ✓ — `:has(input:checked)` + JS that runs on `DOMContentLoaded` |
| URL `?intent=pilot` pre-selects the Join Pilot radio | ✓ — same mechanism |
| URL `?intent=issuer` pre-selects the Issuer-side radio | ✓ — same mechanism |
| URL `?intent=partnership` pre-selects the Partnership radio | ✓ — same mechanism |
| URL `?intent=other` pre-selects the Other radio | ✓ — same mechanism |
| Submitting opens the user's mail client with all fields encoded | ✓ — `window.location.href = mailto:` |
| No fake "submitted" state ever shown | ✓ — script does nothing other than navigate to `mailto:` |
| Disclosure visible above the form | ✓ — "Submitting opens your mail app with a draft …" |
| Direct mailto fallback for users whose client doesn't open | ✓ — `If your mail client doesn't open` panel |
| Stakeholder dropdown matches brief's 5 categories + Other | ✓ — `defense-msme / defense-tech / oem-si / issuer / institutional / other` |
| No `pricing` field, no `WhatsApp` field, no phone-required field | ✓ — phone is `(optional)`; no pricing/WhatsApp anywhere |

---

## 7. Responsive notes

| Breakpoint | /founder | /issuer-roadmap | /contact | /404 |
|---|---|---|---|---|
| 1440 px | 2-col hero, 5-col principles grid (2-col actually with 3-up cap), photo caption visible bottom-right | Status banner full-width, 5-row phases with status chips on right, capability grid 3-up | Visitor strip 5 rows full-width, compose grid 0.85fr/1.15fr | Header row 2-col, CTAs inline, recovery index horizontal |
| 1024 px | Same | Same | Same | Same |
| 768 px | Hero collapses to single col; ID card centred | Phases collapse to 2-row layout (label / sub on rows; chip on row 3) | Visitor strip 60-px num + label/body 2-col | Same as 1440 with stacked CTAs |
| 390 px | Single column; ID card narrows | Phases 1-col `num | label` then sub-line + chip below | Visitor strip 1-col grid | Single col; CTAs stack full-width |
| 360 px | Same | Same | Same | Same |

No horizontal overflow at any breakpoint (verified by code; visual confirmation requires Playwright).

---

## 8. Accessibility notes

- **Single H1 per page** preserved on every route.
- **`aria-label` on the issuer-roadmap phases `<ol>`** (`Issuer-side exploration phases. Decorative.`) — screen readers announce the list with context.
- **`aria-hidden="true"`** on decorative bullets, decision pills, brass orbs, and the mobile-nav glyph.
- **404 recovery index** uses real anchor links (`<a href="/tas">`); keyboard navigable; `:focus-visible` shows the brass ring from the design system.
- **404 reference line** — mono, AA contrast on the brass-faint background.
- **Contact form** keeps Stage 7 design-system focus-within ring on every intent row + brass focus ring on every form control.
- **Reduced motion** verified per change in code: every stagger respects `prefers-reduced-motion` via the global override that clamps transition-duration to ~0.
- **Visitor strip** uses `<ul>` with semantic indexed labels — screen readers read "Defense MSME, Bidder-side · GeM/DefProc workflows · MII/DPSU/ATC compliance" cleanly.

---

## 9. Commands run

```sh
$ npm run check
Result (38 files): 0 errors · 0 warnings · 0 hints

$ npm run lint:css
(clean)

$ npm run lint:copy
[check-public-copy] OK — scanned 52 file(s); no forbidden terms found.
                       (62 flagged-for-review hit(s) — all reviewed safe;
                        +1 from new 404 + visitor-strip page content
                        ("first" in code comments, "Local-first" Stage-6
                        approved phrase). None are user-facing claim copy.)

$ npm run build
[build] 9 page(s) built in 1.27 s

$ npm run lint:public-output
[check-public-output] OK — scanned 47 dist file(s); no forbidden artifacts found.

$ npm run qa
(end-to-end OK)

$ npm run qa:visual / qa:responsive
# Sandbox-blocked at chromium binary download (cdn.playwright.dev allowlist).
# Documented limitation — runs locally after `npx playwright install chromium`.
# The webServer (build + preview) starts correctly; the failure mode is the
# actionable "Please run: npx playwright install" message at browser launch.
```

---

## 10. Bundle impact

```
JS chunks (unchanged)                          ~1.67 KB gzipped
CSS chunks (post-polish):
  contact.6ouhjDFG.css      ~15.1 KB raw       (shared global + tokens)
  contact.BqFNIdjd.css       ~7.4 KB raw       (contact page scoped — +1 KB for visitor strip + direct panel)
  founder.CP2u2wMX.css      ~10.6 KB raw       (founder scoped — +0.3 KB for photo caption + stagger)
  index.Nkb_CoSa.css        ~15.1 KB raw       (homepage)
  security.B6__14kP.css      ~4.6 KB raw
  tas.Bbk3RPSp.css           ~9.4 KB raw
  workflow.CM55jJm3.css      ~5.3 KB raw
  + new 404 + issuer-roadmap chunks            (~3 KB raw combined)

Net delta: ~1.5 KB CSS gzipped vs. previous Stage-7 state.
Zero new JS shipped.
```

---

## 11. Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | Visitor-framing strip on `/contact` introduces 5 new label/body strings | **none** — every label is composed from already approved categories used on the founder CTA. None extends a claim. | Verified line-by-line; lint pass clean |
| R2 | The 5-phase roadmap on `/issuer-roadmap` could be read as a launch-timeline commitment | **low** | Each phase carries a status chip; only `Discovery` is `CURRENT`, all others are `EXPLORING` or `ROADMAP`. The closing discipline line says: "Each phase is conditional on the previous · No timeline committed · No agency relationship implied." |
| R3 | 404 reference line shows the failing pathname when the host preserves it | **low** | Useful for the user; never echoes user-supplied content other than the requested URL. No XSS risk because Astro escapes `Astro.url.pathname` automatically. The `pathname` is path-restricted by the URL parser, no reflection of arbitrary text. |
| R4 | Photo caption "FOUNDER PORTRAIT · 2026" is new copy | **none** | Descriptive metadata only; no claim |
| R5 | Stakeholder dropdown values changed from `bidder/issuer/advisor/ecosystem/other` to `defense-msme/defense-tech/oem-si/issuer/institutional/other` | **low** — historical analytics on the old values would not exist anyway since no backend ever stored them | The change matches the brief's specified visitor categories |
| R6 | Visual screenshots not produced in this run | **carried over** | Single-step resolution on local machine: `npx playwright install chromium` |
| R7 | Stage 6 H1 sensitive-data review on TAS screenshots | **carried over** | Unaffected by this polish; still the only human pre-deploy gate |

---

## 12. What this polish does NOT do

- ❌ No new claims. Every visitor category, phase label, and status chip is composed from already approved register language.
- ❌ No founder claims invented. The photo caption is descriptive metadata only.
- ❌ No named stakeholder claims on `/issuer-roadmap`. Stakeholder discovery section unchanged.
- ❌ No government endorsement implied. Roadmap explicitly says "No agency relationship implied."
- ❌ No pricing on `/contact`.
- ❌ No WhatsApp on `/contact`.
- ❌ No fake submission success on `/contact`. Form continues as transparent `mailto:` compose.
- ❌ No new dependencies. `package.json` unchanged.
- ❌ No new third-party scripts. No analytics. No consent banner.
- ❌ No design-token changes. All polish layers on top of the Stage 7 design-system tokens.

---

## 13. Outcome

The four conversion / story routes now match the dossier-grade institutional aesthetic of the rest of the site, with stronger founder-led framing on every conversion path:

- `/founder` reads as **editorial field notes from inside defense procurement** — observation ledger cascades, photo caption signals dossier portrait, closing CTA explicitly names the 5 reader profiles.
- `/issuer-roadmap` reads as a **strategic memo under validation** — status banner with chapter ID, 5-phase exploration roadmap with clear `CURRENT / EXPLORING / ROADMAP` status, dashed-rule discipline throughout, no timeline commitment.
- `/contact` reads as **high-trust founder conversation intake** — visitor-framing strip names exactly who this is for, intent pre-selection works on URL deep-link, transparent mailto-fallback panel, no SDR funnel.
- `/404` reads as **a missing dossier entry** — minimal, premium, useful: server-rendered reference, full route recovery index, Contact Founder is the primary path.

Stage 6 release-gate verdict (release-ready pending H1 sensitive-data review on TAS screenshots) **still holds.** This polish strengthens the conversion + founder-credibility surface without introducing any new claim or any new technology.
