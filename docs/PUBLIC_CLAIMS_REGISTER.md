# Public Claims Register — KRISEVA AI

Date: 2026-05-02
Scope: Every claim-bearing string the public website is permitted to publish, classified, evidence-mapped, and locked to approved wording.

This is the single source of truth referenced by `website/src/data/publicClaims.ts` and enforced (in part) by `website/scripts/check-public-copy.mjs`. New public copy must be added here before it goes live on any route.

> **Golden rule.** No product, market, stakeholder, performance, government, security, or roadmap claim is published unless it is supported by evidence in this register. Anything not in this register is an unauthorized claim.

---

## Categories

| # | Category | Meaning |
|---|---|---|
| 1 | **Verified and safe to publish** | Publishable as-is. Wording is fixed; do not paraphrase. |
| 2 | **Safe with careful wording** | Publishable only with the exact careful wording committed below. Paraphrasing requires re-classification. |
| 3 | **Needs measurement** | Not publishable. Numerical / performance claim missing the underlying measurement. |
| 4 | **Do not publish yet** | Never publish. Includes legal-risk language and tripwire phrases monitored by the lint script. |

---

## Lint enforcement

`website/scripts/check-public-copy.mjs` enforces a two-tier deny list against `src/pages`, `src/components`, `src/data`, and deployable `public/`. It does **not** scan `docs/`, `scripts/`, or `reference/`, which is why this register may name forbidden phrases as documentation.

### Hard-fail (build breaks if any appears in deployable public copy)

`Unpacking` · `__bundler` · `__bundler/manifest` · `__bundler/template` · `text/babel` · `api.anthropic.com/v1/design` · `Tender Advisory System` · `kriseva.ai` · `pricing` · `WhatsApp` · `government-approved` · `officially endorsed` · `DRDO-approved` · `CRPF-approved` · `Indian Army validated` · `used by DRDO` · `used by DRDL` · `used by Indian Army` · `guaranteed` · `revolutionary` · `game-changing` · `fully automated` · `fully replaces` · `India's first` · `production-ready` · `80% reduction` · `90% reduction` · `100% accurate` · `fully secure` · `air-gapped` · `no data ever leaves` · `military-grade` · `zero-risk`.

### Flagged for review (build does not fail; human verifies each occurrence)

`best` · `first` · `only` · `trusted by` · `approved by` · `endorsed by` · `enterprise-grade` · `battle-tested` · `industry-leading`.

---

## Master register

The columns are: **claim** · **page / section** · **current public wording** · **approved wording** · **category** · **evidence source** · **risk** · **action taken** · **human approval needed?**

| # | Claim | Page / section | Current public wording | Approved wording | Category | Evidence | Risk | Action | Human approval? |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Company positioning | `index.astro`, `site.ts` | "KRISEVA AI builds procurement intelligence systems for India's defense ecosystem." | unchanged | Verified and safe | `project/uploads/EXECUTIVE_SUMMARY.md` | Low | Retained | No |
| 2 | Hero thesis | `index.astro` | "A tender is not a PDF. It is a decision system hidden inside a document bundle." | unchanged | Verified and safe | `project/uploads/EXECUTIVE_SUMMARY.md`; `project/uploads/suggested_copy_blocks.md` | Low | Retained | No |
| 3 | Bidder-MSME positioning | `index.astro`, `tas.astro` | "KRISEVA TAS helps defense MSMEs and defense-tech teams move from tender discovery to structured bid review." | unchanged | Verified and safe | `project/uploads/CLAIM_REGISTER.md` (row 1); `project/_dev/QA_REPORT.md` §4 | Low | Retained | No |
| 4 | TAS one-liner | `index.astro`, `tas.astro`, `claims.productOneLiner` | "KRISEVA TAS helps bid teams discover, parse, score, and review tender opportunities." | unchanged | Verified and safe | `project/uploads/CLAIM_REGISTER.md` (row 1) | Low | Retained | No |
| 5 | TAS long-form positioning | `tas.astro` hero | "KRISEVA TAS is a bidder-side tender intelligence and bid-review system for defense MSMEs and defense-tech companies." | unchanged | Verified and safe | Stage 6 brief — TAS positioning | Low | Retained | No |
| 6 | TAS pilot status | `tas.astro` hero meta, `index.astro` | "TAS is in pilot and demo evaluation, not a production SaaS." | unchanged | Safe with care | `project/uploads/CLAIM_REGISTER.md` (row 15); `project/_dev/QA_REPORT.md` §1 | Medium | Retained — caveat: auth, tenant isolation, hardening, and deployment audit required before any production-readiness claim | No |
| 7 | Tender bundle thesis | `index.astro`, `tas.astro` | "Treats tenders as bundles of bid documents, specifications, BOQs, ATCs, corrigenda, annexures, and supporting files." | unchanged | Verified and safe | `project/uploads/CLAIM_REGISTER.md` (row 7) | Low | Retained | No |
| 8 | Document parsing | `index.astro`, `tas.astro`, `workflow.astro` | "Parses PDF, DOCX, XLSX, TXT, and CSV tender files locally." | unchanged | Verified and safe | `project/uploads/CLAIM_REGISTER.md` (row 4) | Low | Retained — caveat: no PPT/PPTX or legacy DOC/XLS claim | No |
| 9 | Metadata extraction | `tas.astro` | "Extracts key tender metadata such as buyer fields, dates, values, EMD/ePBG, eligibility signals, and document requirements." | unchanged | Safe with care | `project/uploads/CLAIM_REGISTER.md` (row 8) | Medium | Retained — caveat: do not imply perfect extraction across all formats | No |
| 10 | Compliance extraction | `tas.astro`, `workflow.astro` | "Extracts and structures compliance requirements for human review." | unchanged | Safe with care | `project/uploads/CLAIM_REGISTER.md` (row 9) | Medium | Retained — caveat: never frame as guaranteed/automatic compliance | No |
| 11 | Decision recommendation | `index.astro`, `tas.astro`, `workflow.astro` | "Generates operator review briefs with BID, REVIEW, or SKIP recommendations." | unchanged | Safe with care | `project/uploads/CLAIM_REGISTER.md` (row 10) | Medium | Retained — caveat: recommendation only; no autonomous authority | No |
| 12 | OCR | `tas.astro`, `workflow.astro` | "Includes local OCR support for scanned or low-text PDFs, with OCR quality under active evaluation." | unchanged | Safe with care | `project/uploads/CLAIM_REGISTER.md` (row 11) | Medium | Retained — caveat: WER/CER and table-fidelity metrics required for any stronger claim | No |
| 13 | GeM discovery | `tas.astro` | "Includes live GeM discovery and acquisition support." | unchanged | Verified and safe | `project/uploads/CLAIM_REGISTER.md` (row 5) | Medium | Retained — caveat: portal/session dependency where technical detail appears | No |
| 14 | DefProc | `tas.astro`, `workflow.astro` | "Includes DefProc public discovery and operator-assisted flows for protected documents." | unchanged | Safe with care | `project/uploads/CLAIM_REGISTER.md` (row 6) | Medium | Retained — caveat: never imply CAPTCHA bypass or autonomous protected download | No |
| 15 | Local-first | `index.astro`, `security.astro`, `claims.localFirst` | "Designed for local-first tender processing, with local database, local file storage, and local model routes where configured." | unchanged | Safe with care | `project/uploads/CLAIM_REGISTER.md` (row 2) | Medium | Retained — caveat: portal calls and model downloads may use network when configured; avoid no-egress framing | No |
| 16 | Local model routes | `security.astro` | "Local model routes are available where configured for active pilot workflows." | unchanged | Safe with care | `project/uploads/CLAIM_REGISTER.md` (row 3) | Medium | Retained — caveat: avoid absolute "no external API" framing | No |
| 17 | Deployment boundary | `security.astro` | "External portal access, model integrations, calendar/email integrations, or deployment-specific connectors should be reviewed per deployment boundary." | unchanged | Verified and safe | Stage 6 brief — security copy rules | Low | Retained | No |
| 18 | Issuer-side status | `index.astro`, `issuer-roadmap.astro` | "Issuer-side procurement intelligence is under validation and pilot exploration." | unchanged | Safe with care | `project/uploads/CLAIM_REGISTER.md` (row 12); Stage 6 brief | Medium | Retained — caveat: only described as roadmap / in-development / validation / pilot exploration | No |
| 19 | Issuer-side studying language | `issuer-roadmap.astro` | "KRISEVA is studying AI-assisted technical and financial bid evaluation workflows for government and defense procurement organizations." | unchanged | Safe with care | Stage 6 brief — issuer copy rules | Medium | Retained — caveat: use "studying" / "exploring", never "building" or "deployed" | No |
| 20 | Issuer-side discovery | `issuer-roadmap.astro` | "The need has been validated through senior procurement-side discovery conversations. Names withheld where confidentiality applies." | unchanged | Safe with care | Stage 6 brief — issuer copy rules; `project/uploads/RESEARCH_LIMITATIONS.md` | Medium | Retained — caveat: anonymized unless explicit written/public permission is on record | No |
| 21 | Tier-2 bidder validation | `validation.astro`, `founder.astro` | "Validated through direct stakeholder discovery across defense MSMEs and senior procurement-side stakeholders." | unchanged | Safe with care | Stage 6 brief — Tier 2 wording; `project/uploads/RESEARCH_LIMITATIONS.md` | Medium | Retained — caveat: anonymized unless permission is on record | No |
| 22 | Tier-2 bilateral | `validation.astro` | "Problem validated across both bidder-side and issuer-side workflows." | unchanged | Safe with care | Stage 6 brief — Tier 2 wording | Medium | Retained | No |
| 23 | Tier-2 issuer wording | `issuer-roadmap.astro`, `validation.astro` | "Issuer-side need validated through senior retired paramilitary and defense R&D procurement conversations. Names withheld due to confidentiality." | unchanged | Safe with care | Stage 6 brief — Tier 2 wording | Medium | Retained — caveat: written/public permission required to name anyone | No |
| 24 | Tier-1 named validation | reserved | not currently published | "(none — pending written permission)" | Do not publish yet | Pending: written permission record | High | Reserved; not used | **Yes** — written permission required before any name is published |
| 25 | Test count, repo proof | `validation.astro` only | "A recent internal repo inspection reported 4,072 pytest-collected tests and a passing fast test run for the TAS codebase. Full verification status should be reviewed before using this as a headline production-readiness claim." | unchanged | Safe with care | Stage 6 brief — validation copy rules | High (if condensed) | Retained — caveat carried in same paragraph; never appears on homepage | No |
| 26 | Synthetic / demo data | `tas.astro`, `validation.astro` (every screenshot) | "Repo-owned capture · seeded demo data" | unchanged | Verified and safe | `project/uploads/SCREENSHOT_INVENTORY.md` | Low | Retained on every screenshot embed | No (sensitive-data review still recommended pre-deploy) |
| 27 | Founder observation | `founder.astro` | "Ayush observed procurement workflow bottlenecks while working in the defense technology ecosystem." | unchanged | Verified and safe | Stage 6 brief — founder copy rules | Low | Retained | No |
| 28 | Founder insight | `founder.astro` | "The insight behind KRISEVA came from seeing tender discovery, document review, compliance tracking, and bid/no-bid decisioning happen through fragmented manual workflows." | unchanged | Verified and safe | Stage 6 brief — founder copy rules | Low | Retained | No |
| 29 | Founder thesis | `founder.astro` | "KRISEVA was built around a simple thesis: defense procurement needs auditable intelligence, not generic chatbot summaries." | unchanged | Verified and safe | Stage 6 brief — founder copy rules | Low | Retained | No |
| 30 | Founder education | `founder.astro` id-card, `site.ts` | "IIT Gandhinagar · AI/ML & agentic AI context." | unchanged | Verified and safe | Stage 6 brief — founder details | Low | Retained | No |
| 31 | Founder prior work | `founder.astro` id-card, `site.ts` | "Defense marketing & operations exposure (electronic warfare / anti-drone domain)." | unchanged | Safe with care | Stage 6 brief — founder details | Medium | Retained — caveat: keep wording to "exposure"; do not name the prior employer publicly | No |
| 32 | Boundary / no-endorsement | every footer, `founder.astro` id-card | "No military or government endorsement claimed or implied." | unchanged | Verified and safe | `project/uploads/CLAIM_REGISTER.md` (row 12) | Low | Retained on every page | No |
| 33 | TAS not-claimed list | `tas.astro` (Boundaries section), `claims.notClaimed` | "Autonomous bid submission · win-rate improvement promises · replacing bid teams · working on every portal automatically · CPPP support · production SaaS readiness · agency endorsement · validation by any defense agency." | unchanged | Verified and safe | Stage 6 brief — TAS copy rules; `project/uploads/CLAIM_REGISTER.md` | Low | Retained — actively rendered as a "NOT" list to set boundaries | No |
| 34 | Absolute-security framing | `security.astro` (rendered only as labelled "NOT" anti-claims) | rephrased substrings — e.g. "A no-egress data guarantee", "An isolated-network deployment posture", "An absolute-security claim" | unchanged | Do not publish yet (as positive claim); rephrased substrings only | Stage 6 brief — security copy rules | High (if positive) | Replaced literal forbidden phrases with rephrased substrings already on page | No |
| 35 | Issuer-side endorsement language | never appears | not used | "(forbidden — see lint hard-fail list)" | Do not publish yet | Stage 6 brief — Tier 3 stakeholder rules | High | Tripwire enforced by lint | **Yes** — would require named, written permission before any agency relationship is referenced |
| 36 | CPPP support | not used | not used | "(no claim)" | Do not publish yet | `project/uploads/CLAIM_REGISTER.md` (row 13): no adapter present | High | Excluded from contact-form portal options; not referenced anywhere on site | No |
| 37 | Fixed-percentage time savings | not used | not used | "(no claim)" | Needs measurement | `project/uploads/CLAIM_REGISTER.md` (row 14): manual-vs-TAS timing study not run | High | Excluded; would re-open only with measurement | **Yes** — measurement before any percentage figure is published |

---

## Strict bidder-side language guarantees

Every public surface that mentions TAS must classify it as **bidder-side**. The site achieves this through three repeated phrases:

1. "bidder-side tender intelligence and bid-review system for defense MSMEs and defense-tech companies" — `tas.astro`
2. "TAS — the Tender Automation System — begins on the bidder side because that pain is immediate, validated, and operator-shaped. Issuer-side workflows are on the roadmap, not in the product." — `founder.astro`
3. "Bidder-side first · Issuer-side roadmap" — `founder.astro` operating principles

---

## Pilot / demo language guarantees

Every public surface that hints at TAS readiness must classify it as **pilot / demo evaluation**:

1. "Status · in pilot / demo evaluation · not production SaaS" — `tas.astro` hero meta
2. "Bidder-side TAS in pilot · Issuer-side roadmap under exploration" — `index.astro` hero meta
3. "TAS is in pilot and demo evaluation, not a production SaaS." — `claims.productStatus` (helper string for any future page)

---

## Issuer-side language guarantees

Issuer-side intelligence is **never** described as launched. Every mention is wrapped in roadmap / validation / pilot-exploration framing:

1. Page eyebrow: "Issuer-Side · Roadmap Memo"
2. Hero meta: "Roadmap · Validation · Pilot Exploration · No agency endorsement claimed"
3. Status banner: "Issuer-side procurement intelligence is a roadmap direction, not a launched product."
4. Closing discipline line: "No agency endorsement claimed or implied · No public attribution unless authorized."

---

## Surfaces audited

- `website/src/pages/` — `index.astro`, `tas.astro`, `workflow.astro`, `security.astro`, `issuer-roadmap.astro`, `validation.astro`, `founder.astro`, `contact.astro`, `404.astro`
- `website/src/components/` — all 16 Astro components
- `website/src/data/` — `site.ts`, `navigation.ts`, `routes.ts`, `claims.ts`, `publicClaims.ts`
- `website/src/layouts/` — `BaseLayout.astro`
- Page metadata: every `<title>`, `<meta name="description">`, `<meta property="og:*">`, `<meta name="twitter:*">`, `<link rel="canonical">`
- Image alt text on every `<img>`
- Contact-page form labels, intent labels, intent meta strings, button labels
- `website/public/robots.txt`, `website/public/sitemap.xml`
- Brand SVG text — `kriseva-og.svg` (Stage 5 patched `kriseva.ai` → `kriseva.in`; "ARTIFICIAL INTELLIGENCE" → "PROCUREMENT INTELLIGENCE")
- Built `dist/` — every HTML, CSS, JS, SVG file via the dist guard

---

## Claims requiring human approval before any change

| # | Claim id | Reason |
|---|---|---|
| A1 | `stakeholder.tier-1-named` (#24 above) | Any named stakeholder publication requires explicit written permission on record. |
| A2 | `issuer.do-not-publish` (#35 above) | Any agency-endorsement / agency-validation language for issuer-side requires named, signed, public permission. |
| A3 | `validation.test-count` (#25 above) | The 4,072-test wording is locked. Condensing to a marketing headline ("4,072 tests prove production readiness") requires re-classification with a measurement plan. |
| A4 | `tas.status` ratchet (#6 above) | Removing "in pilot / demo evaluation, not production SaaS" requires a deployment audit on file. |
| A5 | Fixed-percentage performance numbers (#37 above) | Any "% reduction", "% accuracy" etc. requires a measured benchmark. |
| A6 | TAS screenshots `01–05` and `06_settings_local_first_boundary.png` | Sensitive-data review on the seeded demo content before public deploy. |

These are not blockers for shipping the site; the site already ships without making any of them. They are blockers for any future copy change that would weaken the current discipline.
