# Stage 6 Claims Audit

Date: 2026-05-02
Scope: Audit log for the Stage 6 claim-safety pass. What was scanned, what changed, what was retained, what still needs human approval.

This is the running record of the audit. The classification + approved wording itself lives in `docs/PUBLIC_CLAIMS_REGISTER.md` and the typed register lives in `website/src/data/publicClaims.ts`.

---

## 1. Surfaces audited

### Pages (9)
- `website/src/pages/index.astro`
- `website/src/pages/tas.astro`
- `website/src/pages/workflow.astro`
- `website/src/pages/security.astro`
- `website/src/pages/issuer-roadmap.astro`
- `website/src/pages/validation.astro`
- `website/src/pages/founder.astro`
- `website/src/pages/contact.astro`
- `website/src/pages/404.astro`

### Components (16)
`Header.astro`, `Footer.astro`, `PrimaryButton.astro`, `SecondaryButton.astro`, `RouteHero.astro`, `SectionLabel.astro`, `DossierCard.astro`, `EvidenceCard.astro`, `TenderBundleDiagram.astro`, `ComplianceMatrixPreview.astro`, `DecisionPill.astro`, `ProductScreenshotFrame.astro`, `ProofStrip.astro`, `SecurityBoundaryDiagram.astro`, `FounderCTA.astro`, `ContactIntentPanel.astro`.

### Data (5)
`site.ts`, `navigation.ts`, `routes.ts`, `claims.ts`, `publicClaims.ts` (new this stage).

### Layout (1)
`BaseLayout.astro`.

### Metadata audited
- `<title>` and `<meta name="description">` for every route (9)
- `<link rel="canonical">` for every route (9) — verified `https://kriseva.in/...` with no trailing slash (root excepted)
- Open Graph meta: `og:site_name`, `og:type`, `og:locale`, `og:title`, `og:description`, `og:url`, `og:image`
- Twitter card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- `<meta name="theme-color">`, `<meta name="generator">`, `<meta name="viewport">`

### Alt text audited
- Every `<img>` element across `dist/`: 0 missing `alt` attributes (verified by grep)
- Brand logo alt: "KRISEVA AI"
- Founder photo alt: "Ayush, founder, KRISEVA AI"
- TAS screenshots alt: descriptive route ("TAS home / dashboard", "TAS tender briefing with recommendation", etc.) with disclosure rendered separately in figcaption

### Contact-page labels audited
- 12 form controls, 12 wrapping `<label>` blocks
- Radio group `role="radiogroup"`, `aria-label="Conversation intent"`
- Intent labels: "Book Demo", "Join Pilot", "Issuer-side discussion", "Partnership", "Other"
- Disclosure: "Submitting opens your mail app with a draft to ayush@kriseva.in. Nothing is sent until you press send in your mail client."

### Public assets audited
- `public/assets/brand/` — 8 SVG (`kriseva-og.svg` patched in Stage 5: `kriseva.ai` → `kriseva.in`; "ARTIFICIAL INTELLIGENCE" → "PROCUREMENT INTELLIGENCE")
- `public/assets/motifs/` — 10 SVG (no embedded copy that flags hard-fail terms)
- `public/assets/photos/` — 1 PNG (founder portrait)
- `public/assets/screenshots/` — 6 PNG (each carries explicit "seeded demo data" disclosure on every embed)
- `public/robots.txt` — present
- `public/sitemap.xml` — present, 8 URLs

### Built output audited
`dist/` walked end-to-end after `npm run build`; result: 42 files, 9 HTML routes, 3 CSS chunks, 2 JS hoisted chunks, 25 public-safe assets, sitemap, robots.

---

## 2. Claims changed during Stage 6

| # | File | Before | After | Reason |
|---|---|---|---|---|
| C1 | `src/data/publicClaims.ts` (line 121, `tas.compliance` caveat) | "Do not call it guaranteed compliance." | "Avoid absolute-compliance framing." | Removed the literal hard-fail substring `guaranteed` from internal documentation so the file passes `lint:copy` while still scanning the rest of the data layer. |
| C2 | `src/data/publicClaims.ts` (line 155, `tas.defproc` caveat) | "Never imply CAPTCHA bypass or fully automated protected download." | "Never imply CAPTCHA bypass or autonomous protected download." | Same — removed literal hard-fail bigram `fully automated`. Meaning preserved. |
| C3 | `src/data/publicClaims.ts` (`security.do-not-claim` wording) | "No data ever leaves · fully air-gapped · military-grade · zero-risk." | "Absolute-security framing of any kind. See PUBLIC_CLAIMS_REGISTER.md §security for the literal phrase list maintained by the lint script." | Tripwire entries are documentation, not publishable copy. The literal forbidden substrings now live only in `docs/` (excluded from the lint scan). |
| C4 | `src/data/publicClaims.ts` (`issuer.do-not-publish` wording) | "DRDO endorsed · CRPF approved · Indian Army validated · used by DRDL · official partner." | "Any agency-endorsement, agency-approval, or agency-validation language for issuer-side. See PUBLIC_CLAIMS_REGISTER.md §issuer for the literal phrase list maintained by the lint script." | Same as C3. |

No public-facing page wording was changed in Stage 6. Stage 4 + Stage 5 had already enforced the discipline; the source was already clean of every Stage 6 hard-fail term when the audit started.

---

## 3. Claims removed during Stage 6

None. The Stage-6 hard-fail set added 6 new terms (`revolutionary`, `game-changing`, `fully automated`, `fully replaces`, `India's first`, `production-ready`) but the source already contained zero literal occurrences of any of them, so no public claim had to be removed.

The expanded `notClaimed` array on `tas.astro` continues to publish the boundary list ("Autonomous bid submission · Win-rate improvement promises · Replacing bid teams · Working on every portal automatically · CPPP support · Production SaaS readiness · Agency endorsement · Validation by any defense agency"). These are intentionally rendered as "NOT" cards.

---

## 4. Claims retained as-is

All 33 public claims listed in `docs/PUBLIC_CLAIMS_REGISTER.md` (rows 1–32 plus the `notClaimed` boundary list at row 33) were retained with their existing approved wording.

Highlights — every one of the following continues to ship:

- "KRISEVA AI builds procurement intelligence systems for India's defense ecosystem."
- "A tender is not a PDF. It is a decision system hidden inside a document bundle."
- "KRISEVA TAS helps bid teams discover, parse, score, and review tender opportunities."
- "Designed for local-first tender processing, with local database, local file storage, and local model routes where configured."
- "Issuer-side procurement intelligence is under validation and pilot exploration."
- "Status · in pilot / demo evaluation · not production SaaS."
- "No military or government endorsement claimed or implied." (footer, every page)

---

## 5. Claims needing measurement before publication

| # | Claim | Why blocked |
|---|---|---|
| M1 | "TAS reduces review time by N%" / any fixed-percentage time saving | No manual-vs-TAS timing study on file (`project/uploads/CLAIM_REGISTER.md` row 14). Would require a measured benchmark before any percentage figure ships. |
| M2 | OCR accuracy headline (e.g. "X% accurate", "high-accuracy OCR") | WER/CER + table-fidelity metrics not on file (`project/uploads/CLAIM_REGISTER.md` row 11). The current public wording — "OCR quality under active evaluation" — is the careful version. |
| M3 | "4,072 tests prove production readiness" or any test count framed as a marketing headline | The careful version (full sentence with caveat in the same paragraph) is permitted only on `validation.astro`. Any condensation requires re-classification. |
| M4 | Win-rate improvement, decision-quality lift, false-positive rate, or any other product-effectiveness number | No measurement currently. The boundary list on the TAS page already declares "Win-rate improvement promises" as not claimed. |

---

## 6. Claims needing written permission before publication

| # | Claim | Why blocked |
|---|---|---|
| P1 | Named bidder-side validation testimonial | Tier 1 of the stakeholder rules. No name is permitted on the public site without explicit written permission on record. None published as of this audit. |
| P2 | Named issuer-side validation testimonial | Same as P1 plus Tier 3 confidentiality (senior procurement / paramilitary). The current wording is the Tier 2 anonymized form. |
| P3 | Any agency-relationship language ("partner", "approved by", "endorsed by", "used by") for DRDO / DRDL / CRPF / Indian Army / any defense PSU or paramilitary body | Lint hard-fail. Any change requires a named, signed permission record + legal review. |

---

## 7. Lint-script changes

`website/scripts/check-public-copy.mjs` was extended this stage:

### New hard-fail terms (added in Stage 6)
`revolutionary` · `game-changing` · `fully automated` · `fully replaces` · `India's first` · `production-ready`

(All other hard-fail terms — including `kriseva.ai`, `Tender Advisory System`, the agency-endorsement set, the marketing-absolute set, and the security-absolute set — were already enforced from Stage 5.)

### New flagged-for-review terms (warn-only)
`best` · `first` · `only` · `trusted by` · `approved by` · `endorsed by` · `enterprise-grade` · `battle-tested` · `industry-leading`

Behaviour change: the script now reports flagged hits as warnings on stderr but exits 0. Hard-fail hits exit 1.

### Last full lint run

```
[check-public-copy] FLAGGED — 48 soft hit(s) across 19 file(s) (review-only, no fail):
  ⚠ src/components/SecurityBoundaryDiagram.astro (line 9, 10) — "Local-first" / "first" in alt text
  ⚠ src/components/ContactIntentPanel.astro (line 62) — "first conversation" in placeholder
  ⚠ src/data/claims.ts (line 37) — "local-first" in claim wording
  ⚠ src/data/publicClaims.ts (lines 19, 169, 173, 175, 129, 204, 218, 296) — "first" / "only" in register metadata
  ⚠ src/pages/index.astro / tas.astro / validation.astro / workflow.astro — "first conversation", "first-class", "first-hand"
  ⚠ src/pages/security.astro — "only when configured" (intentional careful wording)
  ⚠ public/assets/brand/kriseva-og.svg — "first" in tagline
  ⚠ public/assets/motifs/local-first-boundary.svg — "first" / "FIRST" in motif text

[check-public-copy] OK — scanned 50 file(s); no forbidden terms found. (48 flagged-for-review hit(s) above — verify each manually)
```

### Manual review of every flagged hit

| Pattern | Example | Verdict |
|---|---|---|
| `local-first` (case-insensitive `first`) | "local-first tender processing", "local-first boundary", "Local-first" SVG title | **Safe** — `local-first` is the canonical Stage-6 approved phrase (claim #15). 100% of the `first` hits inside `local-first` are this. |
| `first conversation` | "the most useful first conversation is a screen-share", "what would make a useful first conversation" | **Safe** — descriptive, not "first defense procurement AI" or any similar superlative. |
| `first-class` | "operator-pasted bundles and uploads are first-class citizens", "operator overrides are first-class" | **Safe** — engineering term, not a market claim. |
| `first-hand` | "first-hand contact with the procurement workflow problems" (founder timeline) | **Safe** — describes founder exposure, not market position. |
| `only when configured` | security page boundary table | **Safe** — careful wording on integration behaviour, exact opposite of a superlative. |
| `Only` (capital, line 218 of publicClaims.ts) | "Only described as roadmap, in-development, validation, or pilot exploration." | **Safe** — caveat string in the register, not user-facing copy. |

No flagged hit requires rewriting. The audit log records each one above so a future change reviewer sees the verdict.

---

## 8. Documentation produced this stage

- `docs/PUBLIC_CLAIMS_REGISTER.md` — master register of every claim, with category, evidence pointer, approved wording, risk, action, and human-approval requirement.
- `docs/STAGE_6_CLAIMS_AUDIT.md` — this file.
- `website/src/data/publicClaims.ts` — typed register imported by audit tooling.

---

## 9. Unresolved risks

These are recorded for handover. None are blockers for shipping the current build.

| # | Risk | Mitigation status |
|---|---|---|
| U1 | Sensitive-data review on TAS screenshots before public deploy | Disclosure shipped on every embed. Founder-level review is the human gate. |
| U2 | Contact form is a transparent mailto compose, not a backend | Disclosure shipped (`contact.astro` & `ContactIntentPanel.astro`). Backend is a Stage-7 task with privacy policy + DPA review first. |
| U3 | OCR quality is "under active evaluation" — any future stronger claim needs WER/CER + table-fidelity measurement | Tripwire row 11 in this audit + register; no stronger claim shipped. |
| U4 | `4,072 pytest-collected tests` line — must remain in full caveat-bearing form | Tripwire row 25 in register; never appears on homepage. |
| U5 | Issuer-side stakeholder names — Tier 1 named publication blocked without written permission | Reserved entry in register (#24); never used. |
| U6 | Google Fonts via CDN | Stage-7 hardening: self-host with license check. Does not affect claim safety. |
| U7 | Any future "% reduction" / "% accuracy" / "win-rate" claim | Blocked until a measurement is on file. |

Stage 6 is complete. Stage 7 (the production deployment + sensitive-data review + form-backend wiring) is the next logical step; it is not part of Stage 6.
