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
| 38 | Evaluator one-liner (spelling revision) | `evaluator.astro`, `index.astro` (vol II) | "Kriseva Evaluator is an issuer-side, committee-assist bid evaluation system for government and defence procurement organisations." | "Kriseva Evaluator is an issuer-side, committee-assist bid evaluation system for government and defense procurement organizations." | Safe with care | Founder ruling 2026-06-09 (two co-equal products); `docs/CORPORATE_SITE_V2_DECISIONS.md` (D-012) | Low | Revised 2026-08-15 (W08) — British to US spelling standardization per D-012 ("defence"→"defense", "organisations"→"organizations"); no change to claim substance. Cascades to the byte-identical `portfolioV2.evaluator-purpose` reuse (see V2-20 below) so the site carries one spelling standard | No |

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

---

## V2 extension (2026-08-13)

Scope: Phase 2 claims work order under `docs/CORPORATE_SITE_V2_ARCHITECTURE.md` (§3, §5, §11, §15). Adds the company positioning set, capability tiles, sector statements, portfolio card copy, the full ATTEST claim set, an EVALUATOR maturity update, trust-pillar copy, and proof-row copy to `website/src/data/publicClaims.ts`. Nothing above this line is modified; existing claims, ids, and wording stay byte-identical, the lint deny-list is untouched, and ratchet items A1–A6 remain locked.

Source discipline: ATTEST and EVALUATOR facts are derived only from items marked `DOCUMENTED` in the local, untracked `docs/v2-handoffs/ATTEST_EVALUATOR_FACTS.md`. Evidence pointers below cite the underlying company source paths that file names (e.g. `ATTEST_PROBLEM_STATEMENT.md`, `01_PRODUCTS/evaluator/README.md`), never the handoff file itself, since this register is public. The IFSCA enforcement statistic is excluded per architecture §11. No agency names beyond already-registered wording, no real tender identifiers, no stakeholder identities or roles beyond register-approved anonymized phrases, no percentages.

**Claim count.** `publicClaims.ts` held 51 registered claims before this extension. This extension adds 54 claims across 8 new groups (companyV2 5, capabilityV2 6, sectorV2 2, portfolioV2 18, attestV2 12, evaluatorV2 4, trustV2 4, proofV2 3). Of the 54, 1 is a `do-not-publish` tripwire (no live wording: `attestV2.do-not-publish-enforcement-stat`) and 1 is a `do-not-publish` PENDING-FABLE candidate not authorized for publication (`attestV2.regulator-name-pending`, A8). `evaluatorV2.e2e-candidate` (V2-47, A7) was adjudicated to `safe-with-care` per D-011 on 2026-08-13 (see A7 note below) and is no longer counted among the `do-not-publish` entries. **Total registered claims after this extension: 105.**

New ids use the `<groupV2>.<name>` pattern (e.g. `companyV2.sentence`, matching the existing `<group>.<name>` convention). Ids marked "Reuses claim id: X" carry byte-identical wording copied from the cited pre-V2 claim; the pre-V2 claim itself was not edited.

### companyV2 (company positioning, wording exact per architecture §3)

| # | Claim id | Page / section | Approved wording | Category | Evidence | Risk | Human approval? |
|---|---|---|---|---|---|---|---|
| V2-1 | `companyV2.sentence` | site.ts, index.astro, /company | "KRISEVA AI builds evidence-first AI systems for high-stakes institutional decisions." | Verified and safe | Architecture §3; ATTEST_PROBLEM_STATEMENT.md (line 22); evaluator README (lines 3-4) | Low | No |
| V2-2 | `companyV2.hero-headline` | HeroCorporate (index.astro) | "The evidence layer for high-stakes institutional decisions." | Verified and safe | Architecture §3 | Low | No |
| V2-3 | `companyV2.hero-support` | HeroCorporate (index.astro) | "KRISEVA builds systems that turn institutional document bundles into decisions a named human can defend. Sources sealed. Conflicts surfaced. Every decision recorded." | Safe with care | Architecture §3; ATTEST_PROBLEM_STATEMENT.md (line 22); evaluator README (§2.3, §9) | Medium | No |
| V2-4 | `companyV2.hero-meta-sectors` | HeroCorporate meta chip | "Defense procurement · Regulated finance" | Safe with care | Architecture §3 | Medium (caveat: names two domains, not parity of maturity) | No |
| V2-5 | `companyV2.hero-meta-status` | HeroCorporate meta chip | "Pilot and research stage · No endorsement claimed" | Verified and safe | Architecture §3; reuses `boundary.notClaimed` | Low | No |

### capabilityV2 (six Evidence Spine tiles, architecture §6, capability claims only)

Page / section column extended at W11b (2026-08-15) to add `/defense` and
`/finance`: both sector pages render `spineStations` (`src/data/company.ts`),
which reads its six descriptions from these same six claim ids, so the
registered surface now matches where the wording actually renders.

| # | Claim id | Page / section | Approved wording | Category | Evidence | Risk | Human approval? |
|---|---|---|---|---|---|---|---|
| V2-6 | `capabilityV2.source` (SOURCE) | EvidenceSpine, CapabilityGrid, /defense, /finance | "Every source document is sealed on arrival, and any change to the expected reporting template is detected automatically." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 22) | Medium (ATTEST-documented; do not extend to EVALUATOR as identical) | No |
| V2-7 | `capabilityV2.evidence` (EVIDENCE) | EvidenceSpine, CapabilityGrid, /defense, /finance | "Every value is checked through three independent extraction paths, and confidence comes from where they agree, not from any single path." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 22); evaluator README (§172-184) | Medium | No |
| V2-8 | `capabilityV2.conflict` (CONFLICT) | EvidenceSpine, CapabilityGrid, /defense, /finance | "When the extraction paths disagree, the system surfaces the conflict instead of resolving it silently." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 22); evaluator README (line 22, §111-123) | Medium | No |
| V2-9 | `capabilityV2.human-review` (HUMAN REVIEW) | EvidenceSpine, CapabilityGrid, /defense, /finance | "Every exception routes to a named human, who records a stated reason before the record moves forward." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 22); evaluator README (§115-124) | Medium | No |
| V2-10 | `capabilityV2.decision` (DECISION) | EvidenceSpine, CapabilityGrid, /defense, /finance | "The system recommends. A named human makes and records the decision; the system does not hold decision authority." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (lines 24-25); evaluator README (lines 3-4) | Medium | No |
| V2-11 | `capabilityV2.retained-record` (RETAINED RECORD) | EvidenceSpine, CapabilityGrid, /defense, /finance | "Every decision is written to an append-only record that cannot be edited after the fact." | Safe with care | evaluator README (§2.3); reuses `evaluator.audit-chain`; attest-public-export/README.md (lines 34-39) | Medium (EVALUATOR is DB-trigger-verified; ATTEST is a demonstration export, not production-hardened) | No |

### sectorV2 (one defense statement, one regulated-finance statement)

| # | Claim id | Page / section | Approved wording | Category | Evidence | Risk | Human approval? |
|---|---|---|---|---|---|---|---|
| V2-12 | `sectorV2.defense` | SectorPanels, /defense | "KRISEVA serves defense procurement with two systems: TAS for bidders, in pilot and demo evaluation, and EVALUATOR for evaluation committees, a working prototype." | Safe with care | Architecture §5 item 4, §7; reuses `tas.status`, `evaluator.one-liner`, `evaluator.eval-status` | Medium (must render beside `boundary.notClaimed`) | No |
| V2-13 | `sectorV2.finance` | SectorPanels, /finance | "In regulated finance, ATTEST is a research-stage, human-reviewed prototype for evidence-first regulatory filing review, tested on synthetic demonstration data, and not connected to any regulator system." | Safe with care | attest-public-export/README.md (lines 1, 5, 40-41); 00_CONTROL/STATUS.md (lines 26-27) | Medium (mandatory §11 maturity framing; no regulator name) | No |

### portfolioV2 (per product: purpose, primary user, three capability bullets, maturity line)

TAS and EVALUATOR rows are byte-identical reuse of already-registered wording (see Evidence column for source id); nothing here re-invents registered TAS or EVALUATOR claims.

| # | Claim id | Page / section | Approved wording | Category | Evidence | Risk | Human approval? |
|---|---|---|---|---|---|---|---|
| V2-14 | `portfolioV2.tas-purpose` | PortfolioCards | "KRISEVA TAS is a bidder-side tender intelligence and bid-review system for defense MSMEs and defense-tech companies." | Verified and safe | Reuses `tas.long-line` | Low | No |
| V2-15 | `portfolioV2.tas-primary-user` | PortfolioCards | "Defense MSMEs and defense-tech bid teams." | Verified and safe | Reuses `positioning.bidder-msme`, `tas.long-line` | Low | No |
| V2-16 | `portfolioV2.tas-cap-1` | PortfolioCards | "Treats tenders as bundles of bid documents, specifications, BOQs, ATCs, corrigenda, annexures, and supporting files." | Verified and safe | Reuses `tas.bundle-thesis` | Low | No |
| V2-17 | `portfolioV2.tas-cap-2` | PortfolioCards | "Parses PDF, DOCX, XLSX, TXT, and CSV tender files locally." | Verified and safe | Reuses `tas.parsing` | Low | No |
| V2-18 | `portfolioV2.tas-cap-3` | PortfolioCards | "Generates operator review briefs with BID, REVIEW, or SKIP recommendations." | Safe with care | Reuses `tas.recommendation` | Medium | No |
| V2-19 | `portfolioV2.tas-maturity` | PortfolioCards | "TAS is in pilot and demo evaluation, not a production SaaS." | Safe with care | Reuses `tas.status` (ratchet A4) | Medium | No |
| V2-20 | `portfolioV2.evaluator-purpose` | PortfolioCards | "Kriseva Evaluator is an issuer-side, committee-assist bid evaluation system for government and defense procurement organizations." | Safe with care | Reuses `evaluator.one-liner`; wording revised 2026-08-15 (W08) to US spelling per D-012, see row 38 above | Medium (never name the agency) | No |
| V2-21 | `portfolioV2.evaluator-primary-user` | PortfolioCards | "Government and defense procurement evaluation committees." | Safe with care | Reuses `evaluator.one-liner`, `evaluator.positioning` | Medium (no agency name) | No |
| V2-22 | `portfolioV2.evaluator-cap-1` | PortfolioCards | "A six-state verdict model. The two uncertain states auto-route to a human; nothing is disqualified silently." | Safe with care | Reuses `evaluator.six-state` | Medium | No |
| V2-23 | `portfolioV2.evaluator-cap-2` | PortfolioCards | "Three-path convergence reasoning on every criterion." | Safe with care | Reuses `evaluator.three-path` | Medium | No |
| V2-24 | `portfolioV2.evaluator-cap-3` | PortfolioCards | "A hash-chained, append-only audit log. A single edited verdict breaks the chain; tamper is visible." | Safe with care | Reuses `evaluator.audit-chain` | Medium | No |
| V2-25 | `portfolioV2.evaluator-maturity` | PortfolioCards | "Working prototype. In active evaluation with a central armed police force." | Safe with care | Architecture §7; reuses `evaluator.eval-status` | Medium (no end-to-end framing here, see evaluatorV2 PENDING-FABLE) | No |
| V2-26 | `portfolioV2.attest-purpose` | PortfolioCards | "ATTEST is a research-stage prototype that reviews regulatory filing evidence for regulated-finance compliance teams, sealing sources and surfacing conflicts for a named human to resolve." | Safe with care | attest-public-export/README.md (line 1); ATTEST_PROBLEM_STATEMENT.md (line 22) | Medium (must render beside V2-31 maturity line) | No |
| V2-27 | `portfolioV2.attest-primary-user` | PortfolioCards | "Compliance officers at regulated financial entities." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 11) | Medium (generalized, no regulator/regime named) | No |
| V2-28 | `portfolioV2.attest-cap-1` | PortfolioCards | "Seals every source document on arrival and detects when the reporting template changes." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 22) | Medium | No |
| V2-29 | `portfolioV2.attest-cap-2` | PortfolioCards | "Populates each filing value through three independent extraction paths and surfaces disagreement instead of resolving it silently." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 22) | Medium | No |
| V2-30 | `portfolioV2.attest-cap-3` | PortfolioCards | "Binds every value in the filed return to the page and region that produced it, with a linked document reference." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 22) | Medium | No |
| V2-31 | `portfolioV2.attest-maturity` | PortfolioCards, /attest, /finance | "Research-stage, human-reviewed prototype. Synthetic demonstration data. Not connected to any regulator system. No customers, no pilots." | Verified and safe | attest-public-export/README.md (lines 1, 5, 40-41); 00_CONTROL/STATUS.md (lines 26-27) | Low (mandatory §11 statement) | No |

### attestV2 (full ATTEST claim set, architecture §11)

| # | Claim id | Page / section | Approved wording | Category | Evidence | Risk | Human approval? |
|---|---|---|---|---|---|---|---|
| V2-32 | `attestV2.source-sealing` | /attest | "ATTEST seals every source document on arrival and detects when the regulator's reporting template changes." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 22) | Medium (generic "the regulator", no name) | No |
| V2-33 | `attestV2.three-path` | /attest | "ATTEST populates each filing value through three independent extraction paths and surfaces any disagreement between them rather than resolving it silently." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 22) | Medium | No |
| V2-34 | `attestV2.provenance` | /attest | "Every cell in the filed return is bound to the page and region that produced it, with a linked document reference." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 22) | Medium | No |
| V2-35 | `attestV2.human-review` | /attest | "Every exception, conflicting evidence, an unsupported claim, or a missing source, routes to a named human who states a reason in the interface." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 22) | Medium | No |
| V2-36 | `attestV2.non-interpretive` | /attest | "ATTEST does not interpret regulation, state what a rule requires, give legal or regulatory advice, or claim a number is correct. It surfaces evidence; a named human decides." | Verified and safe | ATTEST_PROBLEM_STATEMENT.md (lines 24-25) | Low | No |
| V2-37 | `attestV2.demo-hub` | /attest, ProofRow | "A public demonstration hub is live, published 12 August 2026, built on synthetic demo data with a deterministic review workflow." | Verified and safe | attest-public-export/README.md (lines 7-8) | Low (always pair with synthetic-data label) | No |
| V2-38 | `attestV2.maturity-research-stage` | /attest, /finance, PortfolioCards | "ATTEST is a research-stage, human-reviewed prototype." | Verified and safe | attest-public-export/README.md (line 1) | Low (mandatory §11) | No |
| V2-39 | `attestV2.maturity-synthetic-data` | /attest, /finance, PortfolioCards | "ATTEST demonstrations run on synthetic demonstration data, not real filings or real customer data." | Verified and safe | attest-public-export/README.md (line 5) | Low (mandatory §11) | No |
| V2-40 | `attestV2.maturity-no-regulator-connection` | /attest, /finance, PortfolioCards | "ATTEST is not connected to any regulator system." | Verified and safe | attest-public-export/README.md (lines 40-41) | Low (mandatory §11) | No |
| V2-41 | `attestV2.maturity-no-customers` | /attest, /finance, PortfolioCards | "ATTEST has no customers and no pilots." | Verified and safe | 00_CONTROL/STATUS.md (lines 26-27) | Low (mandatory §11) | No |
| V2-42 | `attestV2.do-not-publish-enforcement-stat` | never appears | "(Reserved. The excluded IFSCA enforcement-trend statistic is not for publication on any v2 surface.)" | Do not publish | Architecture §11 | High | No (tripwire only) |
| V2-43 | `attestV2.regulator-name-pending` | not used | "(Reserved. No regulator name is used in any ATTEST v2 public claim.)" | Do not publish | Architecture §11, §15 item 3(b) | High | **Yes, PENDING-FABLE** |

### evaluatorV2 (maturity update claims)

Hard constraints applied: no agency names, no tender identifiers, no stakeholder roles or identities, no test counts, no percentages.

| # | Claim id | Page / section | Approved wording | Category | Evidence | Risk | Human approval? |
|---|---|---|---|---|---|---|---|
| V2-44 | `evaluatorV2.functional-verified` | /evaluator, /capabilities | "The core evaluation components of EVALUATOR, document ingestion, the hash-chained audit log, the pattern-intelligence layer, the committee-triggered external-verification stack, and the recommendation memorandum generator, are built and functionally verified." | Safe with care | evaluator README (§9, Functional components verified) | Medium (component-level only) | No |
| V2-45 | `evaluatorV2.roadmap-boundary` | /evaluator (boundaries) | "Multi-tender breadth, cross-tender bidder identity, and production authentication are wired or planned, not yet demonstrated end to end." | Verified and safe | evaluator README (§9 wired, §9 PLANNED) | Low (self-limiting) | No |
| V2-46 | `evaluatorV2.maturity-working-prototype` | /evaluator, /defense, /capabilities | "EVALUATOR is a working prototype." | Safe with care | Architecture §7, §5 item 4 | Medium | No |
| V2-47 | `evaluatorV2.e2e-candidate` | /evaluator, /evidence | "EVALUATOR has run a complete evaluation cycle on a real, publicly issued defense-sector tender using synthetic bidder submissions, with all six verdict states demonstrated." | Safe with care | evaluator README (§9 shipping list); COMPLETION_SUMMARY.md; docs/CORPORATE_SITE_V2_DECISIONS.md (D-011) | Medium (synthetic-bidder qualifier is load-bearing and inseparable; see caveat) | No — adjudicated 2026-08-13 (D-011) |

### trustV2 (four trust-pillar sentences, architecture §12)

| # | Claim id | Page / section | Approved wording | Category | Evidence | Risk | Human approval? |
|---|---|---|---|---|---|---|---|
| V2-48 | `trustV2.local-first` | TrustStrip, /security | "Designed for local-first tender processing, with local database, local file storage, and local model routes where configured." | Safe with care | Reuses `security.local-first`, `security.local-routes`, `security.boundary` (claims 15-17) | Medium | No |
| V2-49 | `trustV2.audit-records` | TrustStrip, /security | "A hash-chained, append-only audit log. A single edited verdict breaks the chain; tamper is visible." | Safe with care | Reuses `evaluator.audit-chain` | Medium | No |
| V2-50 | `trustV2.human-in-command` | TrustStrip, /security | "Recommendations, never autonomous authority. Every material decision is made and recorded by a named human." | Safe with care | Reuses `tas.recommendation`; ATTEST_PROBLEM_STATEMENT.md (lines 24-25); evaluator README (lines 3-4) | Medium | No |
| V2-51 | `trustV2.claims-discipline` | TrustStrip, ProofRow, /company, /evidence | "Every material public claim on this site is registered, evidence-mapped, and checked by an automated lint gate before it can publish." | Verified and safe | This register (golden rule); `website/scripts/check-public-copy.mjs` | Low | No |

### proofV2 (homepage Selected Proof row, architecture §5 item 7)

| # | Claim id | Page / section | Approved wording | Category | Evidence | Risk | Human approval? |
|---|---|---|---|---|---|---|---|
| V2-52 | `proofV2.claims-discipline` | ProofRow | "Every material public claim on this site is registered, evidence-mapped, and checked by an automated lint gate before it can publish." | Verified and safe | Reuses `trustV2.claims-discipline` | Low | No |
| V2-53 | `proofV2.attest-hub` | ProofRow | "A public demonstration hub is live, published 12 August 2026, built on synthetic demo data with a deterministic review workflow." | Verified and safe | Reuses `attestV2.demo-hub` | Low (pair with synthetic-data label) | No |
| V2-54 | `proofV2.tas-status` | ProofRow | "TAS is in pilot and demo evaluation, not a production SaaS." | Safe with care | Reuses `tas.status` (ratchet A4) | Medium | No |

### W11b claims addition (2026-08-15)

Mechanical registration of two claims the W09-W10 receipt (`docs/v2-handoffs/W09-W10-receipt.md`, untracked) flagged as gaps: no registered claim named ATTEST's three-state evidence vocabulary directly, and `attest.astro`'s "not claimed" list used `trustV2.human-in-command` (a sitewide trust-pillar claim, not an ATTEST-specific boundary statement) as a stand-in. Both claims are adjudicated by the control plane per this work order, applied mechanically. Nothing above this section is modified; existing claims, ids, and wording stay byte-identical.

| # | Claim id | Page / section | Approved wording | Category | Evidence | Risk | Human approval? |
|---|---|---|---|---|---|---|---|
| V2-55 | `attestV2.evidence-states` | /attest, /finance | "ATTEST classifies every populated field as supported, conflicting, or unsupported, and routes conflicts to a named human for resolution." | Safe with care | ATTEST_PROBLEM_STATEMENT.md (line 22) | Medium (caveat: research-prototype context, e.g. the research-prototype MaturityChip or maturity-research-stage wording, must be visible on the same rendering surface; never render in isolation) | No |
| V2-56 | `attestV2.not-claimed` | /attest | "ATTEST does not interpret regulation, determine compliance, submit filings, or connect to any regulator system. No customers, no pilots, no accuracy claims." | Verified and safe | ATTEST_PROBLEM_STATEMENT.md (lines 24-25); attest-public-export/README.md (lines 40-41); 00_CONTROL/STATUS.md (lines 26-27) | Low (a boundary statement) | No |

`attest.astro`'s not-claimed list now cites `attestV2.not-claimed` in place of the `trustV2.human-in-command` stand-in. The demonstration list on the same page splits its former five-item merge back into six items now that "evidence states" (`attestV2.evidence-states`) and "named-human resolution" (`attestV2.human-review`) are two distinct registered claims.

**Claim count update.** `publicClaims.ts` held 105 registered claims before this addition (per the V2 extension total above). This addition registers 2 more claims, both in the `attestV2` group. **Total registered claims after this addition: 107.**

### V2 claims requiring human approval before publish (appended to A1–A6; those items are unchanged)

| # | Claim id | Reason |
|---|---|---|
| A7 | `evaluatorV2.e2e-candidate` (V2-47) | Architecture §15 item 3(a): the exact "working prototype, demonstrated end-to-end" wording, stripped of agency name, tender identifier, and counts per the Phase 2 hard constraints, is drafted but not cleared. Fable must rule whether the stripped claim is still an accurate, non-misleading representation before it can move to a publishable category. **ADJUDICATED 2026-08-13 (D-011):** cleared to `safe-with-care` in the exact wording "EVALUATOR has run a complete evaluation cycle on a real, publicly issued defense-sector tender using synthetic bidder submissions, with all six verdict states demonstrated." The synthetic-bidder qualifier is permanently inseparable from the claim; no agency name, tender identifier, page count, bidder count, or criterion count may ever accompany it; permitted surfaces are `evaluator.astro` and `/evidence` only, never the homepage or sector pages. This entry no longer blocks publication in that exact wording; any paraphrase, dropped qualifier, or surface expansion reopens the block. |
| A8 | `attestV2.regulator-name-pending` (V2-43) | Architecture §15 item 3(b): whether any regulator name may appear on /finance or /attest, even in neutral descriptive context, is undecided. Default is to avoid entirely; every attestV2 and sectorV2.finance claim in this extension follows that default. **Adjudicated: default avoid stands (D-012).** |

A7 was adjudicated 2026-08-13 per D-011 (see row above) and no longer blocks the exact approved wording on its two permitted surfaces; it continues to block any paraphrase, agency name, tender identifier, count, or surface beyond `evaluator.astro` and `/evidence`. A8 remains reserved per D-012: no page in this extension names a regulator, and A8 continues to block the `do-not-publish` candidate wording above from ever being promoted to a publishable category absent documented, written regulator engagement.
