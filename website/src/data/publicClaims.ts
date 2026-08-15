// publicClaims.ts
//
// Stage 6 categorized claim register · the single source of truth for every
// claim-bearing string the public website may publish. Each claim has a
// category, evidence pointer, and approved wording. New public copy must use
// strings from here. Pages should not invent claim wording inline.
//
// Categories (per project/uploads/CLAIM_REGISTER.md and Stage 6 brief):
//   1) verified-and-safe · publishable as-is.
//   2) safe-with-care · publishable with the exact careful wording
//                            committed below; do not paraphrase.
//   3) needs-measurement · not publishable until measurement evidence
//                            exists in the repo.
//   4) do-not-publish · never publish; included here as a tripwire.
//
// Evidence sources are repo-relative paths; the audit doc
// docs/STAGE_6_CLAIMS_AUDIT.md links each claim to its evidence.
//
// Whenever you add a public claim, add it here first with its category and
// evidence pointer. Anything missing from this file is an unauthorized claim.

export type ClaimCategory =
  | 'verified-and-safe'
  | 'safe-with-care'
  | 'needs-measurement'
  | 'do-not-publish';

export interface PublicClaim {
  /** Stable id used by audit tooling and the register doc. */
  id: string;
  /** The exact public wording. Do not paraphrase. */
  wording: string;
  /** Classification per Stage 6 brief. */
  category: ClaimCategory;
  /** Repo-relative evidence pointers. */
  evidence: string[];
  /** Page or location where this claim is rendered. */
  surface: string;
  /** Free-text caveat for safe-with-care claims. */
  caveat?: string;
}

// ─────────────────────────────────────────────────────────────────────────
// Identity & positioning
// ─────────────────────────────────────────────────────────────────────────
const positioning: PublicClaim[] = [
  {
    id: 'positioning.company',
    wording: 'KRISEVA AI builds procurement intelligence systems for India’s defense ecosystem.',
    category: 'verified-and-safe',
    evidence: ['project/uploads/EXECUTIVE_SUMMARY.md'],
    surface: 'site.ts (positioning), index.astro (problem-thesis)',
  },
  {
    id: 'positioning.thesis',
    wording: 'A tender is not a PDF. It is a decision system hidden inside a document bundle.',
    category: 'verified-and-safe',
    evidence: ['project/uploads/EXECUTIVE_SUMMARY.md', 'project/uploads/suggested_copy_blocks.md'],
    surface: 'index.astro (hero)',
  },
  {
    id: 'positioning.bidder-msme',
    wording:
      'KRISEVA TAS helps defense MSMEs and defense-tech teams move from tender discovery to structured bid review.',
    category: 'verified-and-safe',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 1)', 'project/_dev/QA_REPORT.md §4'],
    surface: 'index.astro, tas.astro',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// TAS product
// ─────────────────────────────────────────────────────────────────────────
const product: PublicClaim[] = [
  {
    id: 'tas.one-liner',
    wording: 'KRISEVA TAS helps bid teams discover, parse, score, and review tender opportunities.',
    category: 'verified-and-safe',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 1)'],
    surface: 'index.astro, tas.astro, claims.productOneLiner',
  },
  {
    id: 'tas.long-line',
    wording:
      'KRISEVA TAS is a bidder-side tender intelligence and bid-review system for defense MSMEs and defense-tech companies.',
    category: 'verified-and-safe',
    evidence: ['Stage 6 brief · TAS positioning'],
    surface: 'tas.astro hero subtitle',
  },
  {
    id: 'tas.bundle-thesis',
    wording:
      'Treats tenders as bundles of bid documents, specifications, BOQs, ATCs, corrigenda, annexures, and supporting files.',
    category: 'verified-and-safe',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 7)'],
    surface: 'index.astro, tas.astro',
  },
  {
    id: 'tas.parsing',
    wording: 'Parses PDF, DOCX, XLSX, TXT, and CSV tender files locally.',
    category: 'verified-and-safe',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 4) · extractor audit'],
    surface: 'index.astro, tas.astro',
    caveat: 'Do not claim PPT/PPTX or legacy DOC/XLS.',
  },
  {
    id: 'tas.metadata',
    wording:
      'Extracts key tender metadata such as buyer fields, dates, values, EMD/ePBG, eligibility signals, and document requirements.',
    category: 'safe-with-care',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 8)'],
    surface: 'tas.astro, claims.metadata',
    caveat: 'Do not imply perfect extraction across all formats.',
  },
  {
    id: 'tas.compliance',
    wording: 'Extracts and structures compliance requirements for human review.',
    category: 'safe-with-care',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 9)'],
    surface: 'tas.astro, claims.compliance',
    caveat: 'Avoid absolute-compliance framing.',
  },
  {
    id: 'tas.recommendation',
    wording: 'Generates operator review briefs with BID, REVIEW, or SKIP recommendations.',
    category: 'safe-with-care',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 10)'],
    surface: 'index.astro, tas.astro, claims.recommendation',
    caveat: 'Recommendation only; no autonomous authority.',
  },
  {
    id: 'tas.ocr',
    wording:
      'Includes local OCR support for scanned or low-text PDFs, with OCR quality under active evaluation.',
    category: 'safe-with-care',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 11)'],
    surface: 'tas.astro, claims.ocr',
    caveat: 'WER/CER and table-fidelity metrics required before any stronger claim.',
  },
  {
    id: 'tas.gem',
    wording: 'Includes live GeM discovery and acquisition support.',
    category: 'verified-and-safe',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 5)'],
    surface: 'tas.astro, claims.gem',
    caveat: 'Note portal/session dependency where technical detail appears.',
  },
  {
    id: 'tas.defproc',
    wording:
      'Includes DefProc public discovery and operator-assisted flows for protected documents.',
    category: 'safe-with-care',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 6)'],
    surface: 'tas.astro, claims.defproc',
    caveat: 'Never imply CAPTCHA bypass or autonomous protected download.',
  },
  {
    id: 'tas.status',
    wording: 'TAS is in pilot and demo evaluation, not a production SaaS.',
    category: 'safe-with-care',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 15)', 'project/_dev/QA_REPORT.md §1'],
    surface: 'tas.astro hero meta, index.astro, claims.productStatus',
    caveat:
      'Auth, tenant isolation, security hardening, and a deployment audit are required before any production-readiness claim.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Local-first / security posture
// ─────────────────────────────────────────────────────────────────────────
const security: PublicClaim[] = [
  {
    id: 'security.local-first',
    wording:
      'Designed for local-first tender processing, with local database, local file storage, and local model routes where configured.',
    category: 'safe-with-care',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 2)'],
    surface: 'security.astro, index.astro, claims.localFirst',
    caveat:
      'Mention portal calls and model downloads may use network when configured. Avoid absolute "no-egress" framing.',
  },
  {
    id: 'security.local-routes',
    wording:
      'Local model routes are available where configured for active pilot workflows.',
    category: 'safe-with-care',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 3)'],
    surface: 'security.astro, claims.localModelRoutes',
    caveat: 'Do not say "no external API ever".',
  },
  {
    id: 'security.boundary',
    wording:
      'Deployment boundaries should be reviewed per environment, especially where external portals, model endpoints, email, calendar, or other integrations are enabled.',
    category: 'verified-and-safe',
    evidence: ['Stage 6 brief · security copy rules'],
    surface: 'security.astro, claims.localFirstBoundary',
  },
  {
    id: 'security.do-not-claim',
    wording:
      'Absolute-security framing of any kind. See PUBLIC_CLAIMS_REGISTER.md §security for the literal phrase list maintained by the lint script.',
    category: 'do-not-publish',
    evidence: ['Stage 6 brief · security copy rules', 'docs/PUBLIC_CLAIMS_REGISTER.md'],
    surface: 'security.astro renders only labelled "NOT" anti-claims with rephrased substrings.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Kriseva Evaluator (issuer-side product)
//
// Promoted from "roadmap" to shipped, co-equal product by founder ruling
// 2026-06-09 (two co-equal products: TAS bidder-side, Kriseva Evaluator
// issuer-side). Wording below matches the founder-signed v6 homepage.
// Display name: KRISEVA EVALUATOR. The legacy internal codename never
// appears on any public surface.
// ─────────────────────────────────────────────────────────────────────────
const evaluator: PublicClaim[] = [
  {
    id: 'evaluator.one-liner',
    wording:
      'Kriseva Evaluator is an issuer-side, committee-assist bid evaluation system for government and defense procurement organizations.',
    category: 'safe-with-care',
    evidence: ['Founder ruling 2026-06-09 (two co-equal products)', 'KRISEVA_EVALUATOR repo', 'docs/CORPORATE_SITE_V2_DECISIONS.md (D-012)'],
    surface: 'evaluator.astro, index.astro (vol II)',
    caveat:
      'Committee-assist framing only; never name the evaluating agency; no order, contract, or deployment-win claims. Wording revised 2026-08-15 (W08) from British to US spelling ("defence"->"defense", "organisations"->"organizations") per D-012; no change to claim substance.',
  },
  {
    id: 'evaluator.positioning',
    wording:
      'For evaluation committees. Committee-assist bid evaluation that shows its reasoning, routes uncertainty to humans, and leaves a record that cannot be quietly edited.',
    category: 'safe-with-care',
    evidence: ['Founder ruling 2026-06-09 (two co-equal products)', 'KRISEVA_EVALUATOR repo'],
    surface: 'evaluator.astro hero, index.astro (vol II)',
    caveat: 'Never name the evaluating agency; no order claims.',
  },
  {
    id: 'evaluator.three-path',
    wording: 'Three-path convergence reasoning on every criterion.',
    category: 'safe-with-care',
    evidence: ['Founder ruling 2026-06-09 (two co-equal products)', 'KRISEVA_EVALUATOR repo'],
    surface: 'evaluator.astro, index.astro (vol II caps), /capabilities',
    caveat: 'Describe as system architecture; no accuracy percentage without measurement evidence.',
  },
  {
    id: 'evaluator.six-state',
    wording:
      'A six-state verdict model. The two uncertain states auto-route to a human; nothing is disqualified silently.',
    category: 'safe-with-care',
    evidence: ['Founder ruling 2026-06-09 (two co-equal products)', 'KRISEVA_EVALUATOR repo'],
    surface: 'evaluator.astro, index.astro (vol II caps, matrix), /capabilities',
    caveat: 'States: Verified · Qualified · Insufficient · Missing · Requires demonstration · Failed.',
  },
  {
    id: 'evaluator.audit-chain',
    wording:
      'A hash-chained, append-only audit log. A single edited verdict breaks the chain; tamper is visible.',
    category: 'safe-with-care',
    evidence: ['Founder ruling 2026-06-09 (two co-equal products)', 'KRISEVA_EVALUATOR repo'],
    surface: 'evaluator.astro, index.astro (audit section), /capabilities',
    caveat: 'Interactive demos must carry the "simulated for demonstration" disclosure.',
  },
  {
    id: 'evaluator.sovereign',
    wording:
      'On-premise, local LLM, zero egress, built for networks that do not leave the building.',
    category: 'safe-with-care',
    evidence: ['Founder ruling 2026-06-09 (two co-equal products)', 'KRISEVA_EVALUATOR repo'],
    surface: 'evaluator.astro, index.astro (vol II caps)',
    caveat:
      'Deployment posture of the Evaluator product, not a website claim; never extend it to the absolute-security phrases banned by the lint (see PUBLIC_CLAIMS_REGISTER.md §security).',
  },
  {
    id: 'evaluator.eval-status',
    wording: 'In active evaluation with a central armed police force.',
    category: 'safe-with-care',
    evidence: ['Founder ruling 2026-06-09 (two co-equal products)', 'notes/founder-log/FOUNDER_LOG.md'],
    surface: 'evaluator.astro, index.astro (cred band, field record), validation.astro',
    caveat:
      'Agency stays unnamed until explicit written consent is on record; no order claimed, no endorsement implied, no unit or bid specifics.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Issuer-side (legacy roadmap framing - superseded)
// ─────────────────────────────────────────────────────────────────────────
const issuer: PublicClaim[] = [
  {
    id: 'issuer.status',
    wording: 'Issuer-side procurement intelligence is under validation and pilot exploration.',
    category: 'do-not-publish',
    evidence: ['Superseded by founder ruling 2026-06-09 (two co-equal products)'],
    surface: ' · never appears on any public page · (was issuer-roadmap.astro; use evaluator.* claims)',
    caveat:
      'STALE: framed the Evaluator as a roadmap direction. Superseded 2026-06-09; publish evaluator.* wording instead.',
  },
  {
    id: 'issuer.studying',
    wording:
      'KRISEVA is studying AI-assisted technical and financial bid evaluation workflows for government and defense procurement organizations.',
    category: 'do-not-publish',
    evidence: ['Superseded by founder ruling 2026-06-09 (two co-equal products)'],
    surface: ' · never appears on any public page · (was issuer-roadmap.astro; use evaluator.* claims)',
    caveat:
      'STALE: "studying / exploring" framing superseded 2026-06-09; the Evaluator is a shipped, co-equal product.',
  },
  {
    id: 'issuer.discovery',
    wording:
      'The need has been validated through senior procurement-side discovery conversations. Names withheld where confidentiality applies.',
    category: 'safe-with-care',
    evidence: ['Stage 6 brief · issuer copy rules', 'project/uploads/RESEARCH_LIMITATIONS.md'],
    surface: 'issuer-roadmap.astro',
    caveat: 'Anonymized unless explicit written/public permission is on record.',
  },
  {
    id: 'issuer.do-not-publish',
    wording:
      'Any agency-endorsement, agency-approval, or agency-validation language for issuer-side. See PUBLIC_CLAIMS_REGISTER.md §issuer for the literal phrase list maintained by the lint script.',
    category: 'do-not-publish',
    evidence: ['Stage 6 brief · Tier 3 stakeholder rules', 'docs/PUBLIC_CLAIMS_REGISTER.md'],
    surface: ' · never appears on any public page · ',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Stakeholder validation
// ─────────────────────────────────────────────────────────────────────────
const stakeholder: PublicClaim[] = [
  {
    id: 'stakeholder.tier-2-validation',
    wording:
      'Validated through direct stakeholder discovery across defense MSMEs and senior procurement-side stakeholders.',
    category: 'safe-with-care',
    evidence: ['Stage 6 brief · Tier 2 wording', 'project/uploads/RESEARCH_LIMITATIONS.md'],
    surface: 'validation.astro, founder.astro',
    caveat: 'Anonymized unless permission is on record.',
  },
  {
    id: 'stakeholder.tier-2-bilateral',
    wording: 'Problem validated across both bidder-side and issuer-side workflows.',
    category: 'safe-with-care',
    evidence: ['Stage 6 brief · Tier 2 wording'],
    surface: 'validation.astro, founder.astro',
  },
  {
    id: 'stakeholder.tier-2-issuer',
    wording:
      'Issuer-side need validated through senior retired paramilitary and defense R&D procurement conversations. Names withheld due to confidentiality.',
    category: 'safe-with-care',
    evidence: ['Stage 6 brief · Tier 2 wording'],
    surface: 'issuer-roadmap.astro, validation.astro',
  },
  {
    id: 'stakeholder.tier-1-named',
    wording: '(Reserved for any explicit-permission named validation; none currently published.)',
    category: 'do-not-publish',
    evidence: ['Pending: written permission record before any name is published.'],
    surface: ' · not used on any public page yet · ',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Test / repo proof
// ─────────────────────────────────────────────────────────────────────────
const validation: PublicClaim[] = [
  {
    id: 'validation.test-count',
    wording:
      'A recent internal repo inspection reported 4,072 pytest-collected tests and a passing fast test run for the TAS codebase. Full verification status should be reviewed before using this as a headline production-readiness claim.',
    category: 'safe-with-care',
    evidence: ['Stage 6 brief · validation copy rules'],
    surface: 'validation.astro (test-status section only · never on homepage)',
    caveat:
      'Carries its own caveat in the same paragraph. Do not condense to "4,072 tests prove production readiness".',
  },
  {
    id: 'validation.synthetic-data',
    wording:
      'Public-safe TAS captures sourced from a repo-owned local instance. Tender data shown is synthetic / demo content; no real tender data is exposed.',
    category: 'verified-and-safe',
    evidence: ['project/uploads/SCREENSHOT_INVENTORY.md'],
    surface: 'validation.astro, /evidence (synthetic-data policy statement)',
  },
  {
    // Gate 1 correction M2: docs/PUBLIC_CLAIMS_REGISTER.md row 26 registers
    // this exact short-label wording for "every screenshot" on tas.astro /
    // validation.astro, but no stable claim id ever carried it into code -
    // tas.astro instead accreted ~9 ad-hoc, differently-worded disclosure
    // variants (CLAIM_AUDIT_V2.md §1(b) finding 2). This id restores row
    // 26's already-approved wording with a stable id so every screenshot
    // caption on tas.astro renders one locked string. Deliberately separate
    // from validation.synthetic-data (the longer policy-statement sentence
    // used on /evidence, which stays untouched).
    id: 'validation.screenshot-caption',
    wording: 'Repo-owned capture · seeded demo data',
    category: 'verified-and-safe',
    evidence: ['docs/PUBLIC_CLAIMS_REGISTER.md (row 26)', 'project/uploads/SCREENSHOT_INVENTORY.md'],
    surface: 'tas.astro (every screenshot / media embed caption)',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Field record (public, verifiable recognitions; wording matches the
// founder-signed v6 homepage field-record section)
// ─────────────────────────────────────────────────────────────────────────
const fieldRecord: PublicClaim[] = [
  {
    id: 'record.pan-iit',
    wording: 'Pan IIT "AI for Bharat" Grand Finalist, from 13,500+ teams.',
    category: 'verified-and-safe',
    evidence: ['Founder-signed v6 homepage (df836d4)', 'public Pan IIT result'],
    surface: 'index.astro (cred band, field record), validation.astro, /company',
  },
  {
    id: 'record.udyam',
    wording: 'Udyam-registered MSME, on government record.',
    category: 'verified-and-safe',
    evidence: ['Founder-signed v6 homepage (df836d4)', 'Udyam registration record'],
    surface: 'index.astro (field record), validation.astro, /company',
  },
  {
    id: 'record.dpiit',
    wording: 'DPIIT Startup-India recognition, in process.',
    category: 'safe-with-care',
    evidence: ['Founder-signed v6 homepage (df836d4)'],
    surface: 'index.astro (field record), validation.astro, /company',
    caveat: 'Always labelled "in process" until the certificate is on record.',
  },
  {
    id: 'record.iiec',
    wording: 'Incubated at IIT Gandhinagar · IIEC.',
    category: 'verified-and-safe',
    evidence: ['Founder-signed v6 homepage (df836d4)', 'IIEC incubation record'],
    surface: 'index.astro (cred band, field record), validation.astro, founder.astro, /company',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Founder-market fit
// ─────────────────────────────────────────────────────────────────────────
const founder: PublicClaim[] = [
  {
    id: 'founder.observation',
    wording:
      'Ayush observed procurement workflow bottlenecks while working in the defense technology ecosystem.',
    category: 'verified-and-safe',
    evidence: ['Stage 6 brief · founder copy rules'],
    surface: 'founder.astro',
  },
  {
    id: 'founder.insight',
    wording:
      'The insight behind KRISEVA came from seeing tender discovery, document review, compliance tracking, and bid/no-bid decisioning happen through fragmented manual workflows.',
    category: 'verified-and-safe',
    evidence: ['Stage 6 brief · founder copy rules'],
    surface: 'founder.astro',
  },
  {
    id: 'founder.thesis',
    wording:
      'KRISEVA was built around a simple thesis: defense procurement needs auditable intelligence, not generic chatbot summaries.',
    category: 'verified-and-safe',
    evidence: ['Stage 6 brief · founder copy rules'],
    surface: 'founder.astro',
  },
  {
    id: 'founder.education',
    wording: 'IIT Gandhinagar · AI/ML & agentic AI context.',
    category: 'verified-and-safe',
    evidence: ['Stage 6 brief · founder details', 'site.ts'],
    surface: 'founder.astro, site.ts, /contact',
  },
  {
    id: 'founder.prior-work',
    wording: 'Defense marketing & operations exposure (electronic warfare / anti-drone domain).',
    category: 'safe-with-care',
    evidence: ['Stage 6 brief · founder details'],
    surface: 'founder.astro, site.ts',
    caveat: 'Keep wording to "exposure" / "operations work"; do not name the prior employer publicly.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Boundaries · explicit "we do not claim" assertions
// ─────────────────────────────────────────────────────────────────────────
const boundaries: PublicClaim[] = [
  {
    id: 'boundary.notClaimed',
    wording: 'No military or government endorsement claimed or implied.',
    category: 'verified-and-safe',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 12)'],
    surface: 'footer (every page), founder.astro id-card',
  },
  {
    id: 'boundary.list',
    wording:
      'TAS does not claim: autonomous bid submission · win-rate improvement promises · replacing bid teams · working on every portal automatically · CPPP support · production SaaS readiness · agency endorsement · validation by any defense agency.',
    category: 'verified-and-safe',
    evidence: ['Stage 6 brief · TAS copy rules', 'project/uploads/CLAIM_REGISTER.md'],
    surface: 'tas.astro (Boundaries section), claims.notClaimed',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// v7 story spine (Acts 1, 2, 7). Deliberately qualitative: the story
// sections claim no duration, no statistic, and no national outcome.
// ─────────────────────────────────────────────────────────────────────────
const storyV7: PublicClaim[] = [
  {
    id: 'act1.cycle-insight',
    wording: 'The speed of modernization is set by the speed of the cycle.',
    category: 'safe-with-care',
    evidence: ['Founder story mandate (KRISEVA_SITE_V7_MASTER_PROMPT.md)'],
    surface: 'index.astro (Act 1, the nation’s clock)',
    caveat:
      'An insight about cycle speed, not a measured statistic. Never pair with a specific duration, a named program, or "India is behind X" framing.',
  },
  {
    id: 'act1.stage-names',
    wording:
      'Need, approval (AoN), RFP, bids, evaluation, re-evaluation, award: stage names follow DAP 2020, the public procurement rulebook.',
    category: 'safe-with-care',
    evidence: ['DAP 2020 (Defence Acquisition Procedure, public document, Ministry of Defence)'],
    surface: 'index.astro (Act 1 cycle stations + source note)',
    caveat:
      'Stage NAMES only, simplified for a lay reader. The section stays qualitative ("years, not months" register); no per-stage duration may ever be attached.',
  },
  {
    id: 'act2.two-rooms',
    wording: 'Two rooms, one problem: trust in what the documents claim.',
    category: 'verified-and-safe',
    evidence: ['Founder story mandate (KRISEVA_SITE_V7_MASTER_PROMPT.md)', 'EXECUTIVE_SUMMARY.md problem framing'],
    surface: 'index.astro (Act 2 merge line), /company, /defense',
  },
  {
    id: 'dossier.discovery-interviews',
    wording:
      'In six discovery interviews (2026), operators reported that the large majority of published tenders were irrelevant to them, and that working through one bid still meant a hundred or more pages, by hand.',
    category: 'safe-with-care',
    evidence: ['Discovery interview notes, n=6, 2026 (founder records)'],
    surface: 'dossier.pdf (field notes)',
    caveat:
      'Always carries the "six interviews" provenance inline and the line "a field observation, not a market statistic". Never as a percentage, never as a market-size claim.',
  },
  {
    id: 'act7.mission',
    wording:
      'We build so that an honest bid from a small company is not lost to one missed clause, and a committee can defend every verdict, years later, page by page.',
    category: 'safe-with-care',
    evidence: ['Founder story mandate (KRISEVA_SITE_V7_MASTER_PROMPT.md)'],
    surface: 'index.astro (Act 7 mission rows), /company',
    caveat:
      'Commitment framing only ("we build so that..."). Never restate as an achieved outcome, a national-impact statistic, or a government endorsement.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// V2 extension (2026-08-13). Corporate site v2, Phase 2 claims work order.
// Source contract: docs/CORPORATE_SITE_V2_ARCHITECTURE.md §3, §5, §11, §15.
// ATTEST/EVALUATOR facts derive only from items marked DOCUMENTED in the
// local, untracked docs/v2-handoffs/ATTEST_EVALUATOR_FACTS.md; evidence
// pointers below cite the underlying company source paths that file names,
// never the handoff file itself. No agency names beyond already-registered
// wording, no tender identifiers, no stakeholder roles/identities beyond
// register-approved anonymized phrases, no percentages (architecture §15.4).
// ─────────────────────────────────────────────────────────────────────────

// companyV2 (company positioning set, wording exact per architecture §3).
const companyV2: PublicClaim[] = [
  {
    id: 'companyV2.sentence',
    wording: 'KRISEVA AI builds evidence-first AI systems for high-stakes institutional decisions.',
    category: 'verified-and-safe',
    evidence: [
      'docs/CORPORATE_SITE_V2_ARCHITECTURE.md §3',
      '10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)',
      '01_PRODUCTS/evaluator/README.md (lines 3-4)',
    ],
    surface: 'site.ts (positioning v2), index.astro (hero), /company',
  },
  {
    id: 'companyV2.hero-headline',
    wording: 'The evidence layer for high-stakes institutional decisions.',
    category: 'verified-and-safe',
    evidence: ['docs/CORPORATE_SITE_V2_ARCHITECTURE.md §3'],
    surface: 'HeroCorporate (index.astro)',
  },
  {
    id: 'companyV2.hero-support',
    wording:
      'KRISEVA builds systems that turn institutional document bundles into decisions a named human can defend. Sources sealed. Conflicts surfaced. Every decision recorded.',
    category: 'safe-with-care',
    evidence: [
      'docs/CORPORATE_SITE_V2_ARCHITECTURE.md §3',
      '10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)',
      '01_PRODUCTS/evaluator/README.md (§2.3, §9)',
    ],
    surface: 'HeroCorporate (index.astro)',
    caveat:
      'Capability claims only, no market or accuracy claim. "Sources sealed" maps to ATTEST document sealing; "Conflicts surfaced" maps to ATTEST three-path disagreement surfacing and EVALUATOR six-state routing; "Every decision recorded" maps to EVALUATOR hash-chained audit log. Does not imply uniform maturity across products; see attestV2 and evaluatorV2 maturity claims.',
  },
  {
    id: 'companyV2.hero-meta-sectors',
    wording: 'Defense procurement · Regulated finance',
    category: 'safe-with-care',
    evidence: ['docs/CORPORATE_SITE_V2_ARCHITECTURE.md §3'],
    surface: 'HeroCorporate meta chip (index.astro)',
    caveat:
      'Names two domains of work, not parity of product maturity. Defense procurement covers TAS (pilot) and EVALUATOR (working prototype); regulated finance covers ATTEST (research-stage prototype only). Must render beside companyV2.hero-meta-status.',
  },
  {
    id: 'companyV2.hero-meta-status',
    wording: 'Pilot and research stage · No endorsement claimed',
    category: 'verified-and-safe',
    evidence: ['docs/CORPORATE_SITE_V2_ARCHITECTURE.md §3', 'Reuses claim id: boundary.notClaimed'],
    surface: 'HeroCorporate meta chip (index.astro)',
  },
];

// capabilityV2 (six capability tiles mapped to the Evidence Spine stations,
// (architecture §6). Capability claims only, no market claims.
const capabilityV2: PublicClaim[] = [
  {
    id: 'capabilityV2.source',
    wording:
      'Every source document is sealed on arrival, and any change to the expected reporting template is detected automatically.',
    category: 'safe-with-care',
    evidence: ['10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)'],
    surface: 'EvidenceSpine (index.astro), CapabilityGrid (/capabilities), spineStations (/defense, /finance)',
    caveat:
      'Documented and demonstrated in ATTEST. EVALUATOR ingestion (two-tier document router) is analogous but sealing / template-change detection specifically is an ATTEST-documented capability; do not extend to claim identical EVALUATOR implementation.',
  },
  {
    id: 'capabilityV2.evidence',
    wording:
      'Every value is checked through three independent extraction paths, and confidence comes from where they agree, not from any single path.',
    category: 'safe-with-care',
    evidence: [
      '10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)',
      'KRISEVA_EVALUATOR/README.md (§172-184)',
    ],
    surface: 'EvidenceSpine (index.astro), CapabilityGrid (/capabilities), spineStations (/defense, /finance)',
    caveat: 'Shared three-path language across ATTEST and EVALUATOR (architecture §6). No accuracy percentage without measurement evidence.',
  },
  {
    id: 'capabilityV2.conflict',
    wording: 'When the extraction paths disagree, the system surfaces the conflict instead of resolving it silently.',
    category: 'safe-with-care',
    evidence: [
      '10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)',
      '01_PRODUCTS/evaluator/README.md (line 22)',
      'KRISEVA_EVALUATOR/README.md (§111-123)',
    ],
    surface: 'EvidenceSpine (index.astro), CapabilityGrid (/capabilities), spineStations (/defense, /finance)',
    caveat:
      'EVALUATOR expresses this architecturally: two of six verdict states route to human review by construction, so silent disqualification is not possible.',
  },
  {
    id: 'capabilityV2.human-review',
    wording: 'Every exception routes to a named human, who records a stated reason before the record moves forward.',
    category: 'safe-with-care',
    evidence: [
      '10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)',
      'KRISEVA_EVALUATOR/README.md (§115-124)',
    ],
    surface: 'EvidenceSpine (index.astro), CapabilityGrid (/capabilities), spineStations (/defense, /finance)',
    caveat:
      'Human review is a recommendation-routing mechanism, not a claim that any output is pre-approved or validated beyond the stated reason.',
  },
  {
    id: 'capabilityV2.decision',
    wording: 'The system recommends. A named human makes and records the decision; the system does not hold decision authority.',
    category: 'safe-with-care',
    evidence: [
      '10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (lines 24-25)',
      '01_PRODUCTS/evaluator/README.md (lines 3-4)',
    ],
    surface: 'EvidenceSpine (index.astro), CapabilityGrid (/capabilities), spineStations (/defense, /finance)',
    caveat:
      'Reuses the recommendation-only framing already registered for TAS (tas.recommendation) and EVALUATOR (evaluator.positioning); no autonomous authority is ever claimed.',
  },
  {
    id: 'capabilityV2.retained-record',
    wording: 'Every decision is written to an append-only record that cannot be edited after the fact.',
    category: 'safe-with-care',
    evidence: [
      'KRISEVA_EVALUATOR/README.md (§2.3)',
      'Reuses claim id: evaluator.audit-chain',
      '10_GIFT_CITY/05_PRODUCT/prototype/attest-public-export/README.md (lines 34-39)',
    ],
    surface: 'EvidenceSpine (index.astro), CapabilityGrid (/capabilities), spineStations (/defense, /finance)',
    caveat:
      'Verified at the database layer for EVALUATOR (Postgres trigger blocks UPDATE/DELETE). The ATTEST retained record at this stage is a demonstration export (JSON/HTML) from a research prototype, not a production-hardened append-only store; do not imply parity between the two.',
  },
];

// sectorV2 (one defense statement, one regulated-finance statement; finance
// carries the mandatory research-stage framing from architecture §11).
const sectorV2: PublicClaim[] = [
  {
    id: 'sectorV2.defense',
    wording:
      'KRISEVA serves defense procurement with two systems: TAS for bidders, in pilot and demo evaluation, and EVALUATOR for evaluation committees, a working prototype.',
    category: 'safe-with-care',
    evidence: [
      'docs/CORPORATE_SITE_V2_ARCHITECTURE.md §5 item 4, §7',
      'Reuses claim id: tas.status',
      'Reuses claim id: evaluator.one-liner',
      'Reuses claim id: evaluator.eval-status',
    ],
    surface: 'SectorPanels (index.astro), /defense',
    caveat:
      'Always render beside boundary.notClaimed ("No military or government endorsement claimed or implied"). No agency name, no tender identifier.',
  },
  {
    id: 'sectorV2.finance',
    wording:
      'In regulated finance, ATTEST is a research-stage, human-reviewed prototype for evidence-first regulatory filing review, tested on synthetic demonstration data, and not connected to any regulator system.',
    category: 'safe-with-care',
    evidence: [
      '10_GIFT_CITY/05_PRODUCT/prototype/attest-public-export/README.md (line 1, line 5, lines 40-41)',
      '00_CONTROL/STATUS.md (lines 26-27)',
    ],
    surface: 'SectorPanels (index.astro), /finance',
    caveat:
      'Mandatory maturity framing per architecture §11: research-stage, synthetic data, not connected to any regulator system, no customers or pilots claimed. No regulator name; default is to avoid entirely (architecture §11, §15 item 3b, see attestV2.regulator-name-pending).',
  },
];

// portfolioV2 (per product, TAS, EVALUATOR, ATTEST): purpose sentence,
// primary user, three capability bullets, maturity line. TAS and EVALUATOR
// entries reuse existing registered wording verbatim rather than
// re-inventing it; each is byte-identical to its source claim's wording.
const portfolioV2: PublicClaim[] = [
  // TAS
  {
    id: 'portfolioV2.tas-purpose',
    wording: 'KRISEVA TAS is a bidder-side tender intelligence and bid-review system for defense MSMEs and defense-tech companies.',
    category: 'verified-and-safe',
    evidence: ['Reuses claim id: tas.long-line'],
    surface: 'PortfolioCards (index.astro)',
    caveat: 'Byte-identical reuse of tas.long-line for the v2 portfolio card; do not paraphrase further.',
  },
  {
    id: 'portfolioV2.tas-primary-user',
    wording: 'Defense MSMEs and defense-tech bid teams.',
    category: 'verified-and-safe',
    evidence: ['Reuses claim id: positioning.bidder-msme', 'Reuses claim id: tas.long-line'],
    surface: 'PortfolioCards (index.astro)',
  },
  {
    id: 'portfolioV2.tas-cap-1',
    wording: 'Treats tenders as bundles of bid documents, specifications, BOQs, ATCs, corrigenda, annexures, and supporting files.',
    category: 'verified-and-safe',
    evidence: ['Reuses claim id: tas.bundle-thesis'],
    surface: 'PortfolioCards (index.astro)',
    caveat: 'Byte-identical reuse of tas.bundle-thesis for a portfolio card bullet.',
  },
  {
    id: 'portfolioV2.tas-cap-2',
    wording: 'Parses PDF, DOCX, XLSX, TXT, and CSV tender files locally.',
    category: 'verified-and-safe',
    evidence: ['Reuses claim id: tas.parsing'],
    surface: 'PortfolioCards (index.astro)',
    caveat: 'Byte-identical reuse of tas.parsing for a portfolio card bullet. Do not claim PPT/PPTX or legacy DOC/XLS.',
  },
  {
    id: 'portfolioV2.tas-cap-3',
    wording: 'Generates operator review briefs with BID, REVIEW, or SKIP recommendations.',
    category: 'safe-with-care',
    evidence: ['Reuses claim id: tas.recommendation'],
    surface: 'PortfolioCards (index.astro)',
    caveat: 'Byte-identical reuse of tas.recommendation for a portfolio card bullet. Recommendation only; no autonomous authority.',
  },
  {
    id: 'portfolioV2.tas-maturity',
    wording: 'TAS is in pilot and demo evaluation, not a production SaaS.',
    category: 'safe-with-care',
    evidence: ['Reuses claim id: tas.status'],
    surface: 'PortfolioCards (index.astro), /company',
    caveat: 'Byte-identical reuse of tas.status. Ratchet A4 applies: removing this wording requires a deployment audit on file.',
  },
  // EVALUATOR
  {
    id: 'portfolioV2.evaluator-purpose',
    wording: 'Kriseva Evaluator is an issuer-side, committee-assist bid evaluation system for government and defense procurement organizations.',
    category: 'safe-with-care',
    evidence: ['Reuses claim id: evaluator.one-liner', 'docs/CORPORATE_SITE_V2_DECISIONS.md (D-012)'],
    surface: 'PortfolioCards (index.astro)',
    caveat:
      'Byte-identical reuse of evaluator.one-liner. Never name the evaluating agency; no order, contract, or deployment-win claims. Wording revised 2026-08-15 (W08) to US spelling to stay byte-identical with evaluator.one-liner per D-012; no change to claim substance.',
  },
  {
    id: 'portfolioV2.evaluator-primary-user',
    wording: 'Government and defense procurement evaluation committees.',
    category: 'safe-with-care',
    evidence: ['Reuses claim id: evaluator.one-liner', 'Reuses claim id: evaluator.positioning'],
    surface: 'PortfolioCards (index.astro)',
    caveat: 'No agency name.',
  },
  {
    id: 'portfolioV2.evaluator-cap-1',
    wording: 'A six-state verdict model. The two uncertain states auto-route to a human; nothing is disqualified silently.',
    category: 'safe-with-care',
    evidence: ['Reuses claim id: evaluator.six-state'],
    surface: 'PortfolioCards (index.astro)',
    caveat: 'Byte-identical reuse of evaluator.six-state for a portfolio card bullet.',
  },
  {
    id: 'portfolioV2.evaluator-cap-2',
    wording: 'Three-path convergence reasoning on every criterion.',
    category: 'safe-with-care',
    evidence: ['Reuses claim id: evaluator.three-path'],
    surface: 'PortfolioCards (index.astro)',
    caveat: 'Byte-identical reuse of evaluator.three-path. No accuracy percentage without measurement evidence.',
  },
  {
    id: 'portfolioV2.evaluator-cap-3',
    wording: 'A hash-chained, append-only audit log. A single edited verdict breaks the chain; tamper is visible.',
    category: 'safe-with-care',
    evidence: ['Reuses claim id: evaluator.audit-chain'],
    surface: 'PortfolioCards (index.astro)',
    caveat: 'Byte-identical reuse of evaluator.audit-chain. Interactive demos must carry the "simulated for demonstration" disclosure.',
  },
  {
    id: 'portfolioV2.evaluator-maturity',
    wording: 'Working prototype. In active evaluation with a central armed police force.',
    category: 'safe-with-care',
    evidence: ['docs/CORPORATE_SITE_V2_ARCHITECTURE.md §7', 'Reuses claim id: evaluator.eval-status'],
    surface: 'PortfolioCards (index.astro)',
    caveat:
      'Combines the architecture §7 maturity-chip token "working prototype" with evaluator.eval-status reused verbatim. Does not add end-to-end or fully-demonstrated framing; evaluatorV2.e2e-candidate is adjudicated (D-011) but restricted to evaluator.astro and /evidence only, never PortfolioCards or the homepage.',
  },
  // ATTEST
  {
    id: 'portfolioV2.attest-purpose',
    wording:
      'ATTEST is a research-stage prototype that reviews regulatory filing evidence for regulated-finance compliance teams, sealing sources and surfacing conflicts for a named human to resolve.',
    category: 'safe-with-care',
    evidence: [
      '10_GIFT_CITY/05_PRODUCT/prototype/attest-public-export/README.md (line 1)',
      '10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)',
    ],
    surface: 'PortfolioCards (index.astro), /attest, /finance, /capabilities',
    caveat: 'Must always render with portfolioV2.attest-maturity immediately adjacent; never stand alone without the research-stage framing.',
  },
  {
    id: 'portfolioV2.attest-primary-user',
    wording: 'Compliance officers at regulated financial entities.',
    category: 'safe-with-care',
    evidence: ['10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 11)'],
    surface: 'PortfolioCards (index.astro)',
    caveat: 'Generalized from the documented target user (Compliance Officer / Principal Officer at a Registered FME) without naming the regulatory regime or regulator.',
  },
  {
    id: 'portfolioV2.attest-cap-1',
    wording: 'Seals every source document on arrival and detects when the reporting template changes.',
    category: 'safe-with-care',
    evidence: ['10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)'],
    surface: 'PortfolioCards (index.astro)',
  },
  {
    id: 'portfolioV2.attest-cap-2',
    wording: 'Populates each filing value through three independent extraction paths and surfaces disagreement instead of resolving it silently.',
    category: 'safe-with-care',
    evidence: ['10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)'],
    surface: 'PortfolioCards (index.astro)',
  },
  {
    id: 'portfolioV2.attest-cap-3',
    wording: 'Binds every value in the filed return to the page and region that produced it, with a linked document reference.',
    category: 'safe-with-care',
    evidence: ['10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)'],
    surface: 'PortfolioCards (index.astro)',
  },
  {
    id: 'portfolioV2.attest-maturity',
    wording: 'Research-stage, human-reviewed prototype. Synthetic demonstration data. Not connected to any regulator system. No customers, no pilots.',
    category: 'verified-and-safe',
    evidence: [
      '10_GIFT_CITY/05_PRODUCT/prototype/attest-public-export/README.md (line 1, line 5, lines 40-41)',
      '00_CONTROL/STATUS.md (lines 26-27)',
    ],
    surface: 'PortfolioCards (index.astro), /attest, /finance',
    caveat: 'Mandatory maturity statement per architecture §11; must always accompany any ATTEST capability claim.',
  },
];

// attestV2 (full ATTEST claim set under architecture §11 rules). Derived
// only from facts marked DOCUMENTED in the local ATTEST_EVALUATOR_FACTS.md
// handoff; evidence pointers cite the underlying company docs it names.
const attestV2: PublicClaim[] = [
  {
    id: 'attestV2.source-sealing',
    wording: 'ATTEST seals every source document on arrival and detects when the regulator’s reporting template changes.',
    category: 'safe-with-care',
    evidence: ['10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)'],
    surface: '/attest, /capabilities',
    caveat: 'Generic "the regulator" wording; no regulator name, per architecture §11 default.',
  },
  {
    id: 'attestV2.three-path',
    wording:
      'ATTEST populates each filing value through three independent extraction paths and surfaces any disagreement between them rather than resolving it silently.',
    category: 'safe-with-care',
    evidence: ['10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)'],
    surface: '/attest',
  },
  {
    id: 'attestV2.provenance',
    wording: 'Every cell in the filed return is bound to the page and region that produced it, with a linked document reference.',
    category: 'safe-with-care',
    evidence: ['10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)'],
    surface: '/attest',
  },
  {
    id: 'attestV2.human-review',
    wording: 'Every exception, conflicting evidence, an unsupported claim, or a missing source, routes to a named human who states a reason in the interface.',
    category: 'safe-with-care',
    evidence: ['10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)'],
    surface: '/attest, /capabilities',
  },
  {
    id: 'attestV2.non-interpretive',
    wording:
      'ATTEST does not interpret regulation, state what a rule requires, give legal or regulatory advice, or claim a number is correct. It surfaces evidence; a named human decides.',
    category: 'verified-and-safe',
    evidence: ['10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (lines 24-25)'],
    surface: '/attest, /capabilities',
  },
  {
    id: 'attestV2.demo-hub',
    wording: 'A public demonstration hub is live, published 12 August 2026, built on synthetic demo data with a deterministic review workflow.',
    category: 'verified-and-safe',
    evidence: ['10_GIFT_CITY/05_PRODUCT/prototype/attest-public-export/README.md (lines 7-8)'],
    surface: '/attest, ProofRow (index.astro), /evidence',
    caveat: 'Link target: ayushtiwary-ops.github.io/kriseva-attest. Always render with the synthetic-data label.',
  },
  {
    id: 'attestV2.maturity-research-stage',
    wording: 'ATTEST is a research-stage, human-reviewed prototype.',
    category: 'verified-and-safe',
    evidence: ['10_GIFT_CITY/05_PRODUCT/prototype/attest-public-export/README.md (line 1)'],
    surface: '/attest, /finance, PortfolioCards (index.astro), /company',
  },
  {
    id: 'attestV2.maturity-synthetic-data',
    wording: 'ATTEST demonstrations run on synthetic demonstration data, not real filings or real customer data.',
    category: 'verified-and-safe',
    evidence: ['10_GIFT_CITY/05_PRODUCT/prototype/attest-public-export/README.md (line 5)'],
    surface: '/attest, /finance, PortfolioCards (index.astro), /evidence',
  },
  {
    id: 'attestV2.maturity-no-regulator-connection',
    wording: 'ATTEST is not connected to any regulator system.',
    category: 'verified-and-safe',
    evidence: ['10_GIFT_CITY/05_PRODUCT/prototype/attest-public-export/README.md (lines 40-41)'],
    surface: '/attest, /finance, PortfolioCards (index.astro), /evidence',
  },
  {
    id: 'attestV2.maturity-no-customers',
    wording: 'ATTEST has no customers and no pilots.',
    category: 'verified-and-safe',
    evidence: ['00_CONTROL/STATUS.md (lines 26-27)'],
    surface: '/attest, /finance, PortfolioCards (index.astro), /evidence',
  },
  {
    id: 'attestV2.do-not-publish-enforcement-stat',
    wording: '(Reserved. The excluded IFSCA enforcement-trend statistic is not for publication on any v2 surface.)',
    category: 'do-not-publish',
    evidence: ['docs/CORPORATE_SITE_V2_ARCHITECTURE.md §11'],
    surface: ' · never appears on any public page · ',
    caveat: 'Tripwire entry. Architecture §11: the enforcement-trend statistic stays off the site (unverified for publication).',
  },
  {
    id: 'attestV2.regulator-name-pending',
    wording: '(Reserved. No regulator name is used in any ATTEST v2 public claim.)',
    category: 'do-not-publish',
    evidence: ['docs/CORPORATE_SITE_V2_ARCHITECTURE.md §11', 'docs/CORPORATE_SITE_V2_ARCHITECTURE.md §15 item 3(b)'],
    surface: ' · not used on any public page · ',
    caveat:
      'PENDING-FABLE adjudication. Architecture §15 item 3(b) asks whether any regulator name may appear on /finance or /attest. Default per §11 is to avoid entirely; every attestV2 and sectorV2.finance claim in this extension follows that default. This id reserves the decision point for Fable.',
  },
  // W11b addition (2026-08-15): mechanical registration of two claims the
  // W09-W10 receipt flagged as gaps. attestV2.evidence-states names the
  // three-state vocabulary directly (previously only implied through
  // attestV2.human-review). attestV2.not-claimed is a single boundary
  // sentence to replace the trustV2.human-in-command stand-in that page was
  // using on its "not claimed" list (trustV2.human-in-command is a general
  // trust-pillar claim, not an ATTEST-specific boundary statement).
  {
    id: 'attestV2.evidence-states',
    wording:
      'ATTEST classifies every populated field as supported, conflicting, or unsupported, and routes conflicts to a named human for resolution.',
    category: 'safe-with-care',
    evidence: ['10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (line 22)'],
    surface: '/attest, /finance',
    caveat:
      'Research-prototype context must be visible on the rendering surface wherever this claim appears (e.g. the research-prototype MaturityChip or the maturity-research-stage claim in the same view); never render this claim in isolation from that context.',
  },
  {
    id: 'attestV2.not-claimed',
    wording:
      'ATTEST does not interpret regulation, determine compliance, submit filings, or connect to any regulator system. No customers, no pilots, no accuracy claims.',
    category: 'verified-and-safe',
    evidence: [
      '10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (lines 24-25)',
      '10_GIFT_CITY/05_PRODUCT/prototype/attest-public-export/README.md (lines 40-41)',
      '00_CONTROL/STATUS.md (lines 26-27)',
    ],
    surface: '/attest',
  },
];

// evaluatorV2 (maturity update claims). Hard constraints: no agency names,
// no tender identifiers, no stakeholder roles or identities, no test
// counts, no percentages (Phase 2 work order).
//
// evaluatorV2.e2e-candidate adjudicated 2026-08-13 (D-011, W07 claims
// adjudication step): the synthetic-bidder-qualified wording below is
// cleared to safe-with-care for evaluator.astro and /evidence only. See the
// claim's own caveat and docs/PUBLIC_CLAIMS_REGISTER.md A7 for the full
// ruling.
const evaluatorV2: PublicClaim[] = [
  {
    id: 'evaluatorV2.functional-verified',
    wording:
      'The core evaluation components of EVALUATOR, document ingestion, the hash-chained audit log, the pattern-intelligence layer, the committee-triggered external-verification stack, and the recommendation memorandum generator, are built and functionally verified.',
    category: 'safe-with-care',
    evidence: ['01_PRODUCTS/evaluator/README.md (§9, Functional components verified)'],
    surface: '/evaluator, /capabilities',
    caveat:
      'Component-level verification only. Does not claim end-to-end deployment, customer readiness, or a completed full-tender demonstration; see evaluatorV2.e2e-candidate (adjudicated D-011, synthetic-bidder qualifier mandatory).',
  },
  {
    id: 'evaluatorV2.roadmap-boundary',
    wording: 'Multi-tender breadth, cross-tender bidder identity, and production authentication are wired or planned, not yet demonstrated end to end.',
    category: 'verified-and-safe',
    evidence: ['01_PRODUCTS/evaluator/README.md (§9 wired section, §9 PLANNED section)'],
    surface: '/evaluator (boundaries section)',
  },
  {
    id: 'evaluatorV2.maturity-working-prototype',
    wording: 'EVALUATOR is a working prototype.',
    category: 'safe-with-care',
    evidence: ['docs/CORPORATE_SITE_V2_ARCHITECTURE.md §7', 'docs/CORPORATE_SITE_V2_ARCHITECTURE.md §5 item 4'],
    surface: '/evaluator, /defense, /capabilities, /company',
    caveat:
      'Maturity-chip token per architecture §7. Pairs with evaluatorV2.functional-verified and evaluatorV2.roadmap-boundary for the full maturity picture; never combined with end-to-end or demonstrated language beyond the adjudicated evaluatorV2.e2e-candidate wording (D-011).',
  },
  {
    id: 'evaluatorV2.e2e-candidate',
    wording:
      'EVALUATOR has run a complete evaluation cycle on a real, publicly issued defense-sector tender using synthetic bidder submissions, with all six verdict states demonstrated.',
    category: 'safe-with-care',
    evidence: [
      '01_PRODUCTS/evaluator/README.md (§9 shipping list)',
      'COMPLETION_SUMMARY.md',
      'docs/CORPORATE_SITE_V2_DECISIONS.md (D-011)',
    ],
    surface: '/evaluator, /evidence',
    caveat:
      'ADJUDICATED 2026-08-13 (D-011). The synthetic-bidder qualifier is inseparable from this claim and must never be dropped or paraphrased away. No agency name, tender identifier, page count, bidder count, or criterion count may ever accompany it. Permitted surfaces are evaluator.astro and the /evidence page only; never the homepage or sector pages.',
  },
];

// trustV2 (four trust-pillar sentences, architecture §12). Local-first and
// audit-record pillars reuse existing registered wording (claims 15-17 and
// evaluator.audit-chain) rather than inventing new security language.
const trustV2: PublicClaim[] = [
  {
    id: 'trustV2.local-first',
    wording: 'Designed for local-first tender processing, with local database, local file storage, and local model routes where configured.',
    category: 'safe-with-care',
    evidence: ['Reuses claim id: security.local-first', 'Reuses claim id: security.local-routes', 'Reuses claim id: security.boundary'],
    surface: 'TrustStrip (index.astro), /security, /company',
    caveat:
      'Byte-identical reuse of security.local-first (register claims 15-17 territory). Portal calls and model downloads may use network when configured; avoid absolute "no-egress" framing.',
  },
  {
    id: 'trustV2.audit-records',
    wording: 'A hash-chained, append-only audit log. A single edited verdict breaks the chain; tamper is visible.',
    category: 'safe-with-care',
    evidence: ['Reuses claim id: evaluator.audit-chain'],
    surface: 'TrustStrip (index.astro), /security',
    caveat: 'Byte-identical reuse of evaluator.audit-chain. Interactive demos must carry the "simulated for demonstration" disclosure.',
  },
  {
    id: 'trustV2.human-in-command',
    wording: 'Recommendations, never autonomous authority. Every material decision is made and recorded by a named human.',
    category: 'safe-with-care',
    evidence: [
      'Reuses claim id: tas.recommendation',
      '10_GIFT_CITY/05_PRODUCT/problem_statement/ATTEST_PROBLEM_STATEMENT.md (lines 24-25)',
      '01_PRODUCTS/evaluator/README.md (lines 3-4)',
    ],
    surface: 'TrustStrip (index.astro), /security, /company',
    caveat: 'Recommendation and evidence-surfacing only; never claim autonomous authority or that the system itself decides.',
  },
  {
    id: 'trustV2.claims-discipline',
    wording: 'Every material public claim on this site is registered, evidence-mapped, and checked by an automated lint gate before it can publish.',
    category: 'verified-and-safe',
    evidence: ['docs/PUBLIC_CLAIMS_REGISTER.md (golden rule)', 'website/scripts/check-public-copy.mjs'],
    surface: 'TrustStrip (index.astro), ProofRow (index.astro), /company, /evidence',
  },
];

// proofV2 (homepage Selected Proof row, architecture §5 item 7). Reuses
// trustV2 and existing registered wording rather than inventing new claims.
const proofV2: PublicClaim[] = [
  {
    id: 'proofV2.claims-discipline',
    wording: 'Every material public claim on this site is registered, evidence-mapped, and checked by an automated lint gate before it can publish.',
    category: 'verified-and-safe',
    evidence: ['Reuses claim id: trustV2.claims-discipline'],
    surface: 'ProofRow (index.astro)',
    caveat: 'Byte-identical reuse of trustV2.claims-discipline; separate id because ProofRow (§5 item 7) is a distinct homepage component from the Trust Architecture tile (§5 item 6).',
  },
  {
    id: 'proofV2.attest-hub',
    wording: 'A public demonstration hub is live, published 12 August 2026, built on synthetic demo data with a deterministic review workflow.',
    category: 'verified-and-safe',
    evidence: ['Reuses claim id: attestV2.demo-hub'],
    surface: 'ProofRow (index.astro)',
    caveat:
      'Byte-identical reuse of attestV2.demo-hub for the homepage Selected Proof row. Always display with the synthetic-data label (validation.synthetic-data / attestV2.maturity-synthetic-data).',
  },
  {
    id: 'proofV2.tas-status',
    wording: 'TAS is in pilot and demo evaluation, not a production SaaS.',
    category: 'safe-with-care',
    evidence: ['Reuses claim id: tas.status'],
    surface: 'ProofRow (index.astro)',
    caveat: 'Byte-identical reuse of tas.status (ratchet A4 applies) for the homepage Selected Proof row. No test counts on the homepage per register discipline A3.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Aggregate
// ─────────────────────────────────────────────────────────────────────────
export const publicClaims: PublicClaim[] = [
  ...positioning,
  ...product,
  ...security,
  ...evaluator,
  ...issuer,
  ...stakeholder,
  ...validation,
  ...fieldRecord,
  ...founder,
  ...boundaries,
  ...storyV7,
  ...companyV2,
  ...capabilityV2,
  ...sectorV2,
  ...portfolioV2,
  ...attestV2,
  ...evaluatorV2,
  ...trustV2,
  ...proofV2,
];

export const claimsByCategory = publicClaims.reduce<Record<ClaimCategory, PublicClaim[]>>(
  (acc, c) => {
    (acc[c.category] ||= []).push(c);
    return acc;
  },
  {
    'verified-and-safe': [],
    'safe-with-care': [],
    'needs-measurement': [],
    'do-not-publish': [],
  }
);

// Lightweight helpers used by audit tooling.
export function getClaim(id: string): PublicClaim | undefined {
  return publicClaims.find((c) => c.id === id);
}

export function approvedWordingForSurface(surface: string): PublicClaim[] {
  return publicClaims.filter((c) => c.surface.toLowerCase().includes(surface.toLowerCase()));
}
