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
    surface: 'index.astro, tas.astro, workflow.astro',
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
    surface: 'tas.astro, workflow.astro, claims.compliance',
    caveat: 'Avoid absolute-compliance framing.',
  },
  {
    id: 'tas.recommendation',
    wording: 'Generates operator review briefs with BID, REVIEW, or SKIP recommendations.',
    category: 'safe-with-care',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 10)'],
    surface: 'index.astro, tas.astro, workflow.astro, claims.recommendation',
    caveat: 'Recommendation only; no autonomous authority.',
  },
  {
    id: 'tas.ocr',
    wording:
      'Includes local OCR support for scanned or low-text PDFs, with OCR quality under active evaluation.',
    category: 'safe-with-care',
    evidence: ['project/uploads/CLAIM_REGISTER.md (row 11)'],
    surface: 'tas.astro, workflow.astro, claims.ocr',
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
    surface: 'tas.astro, workflow.astro, claims.defproc',
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
      'Kriseva Evaluator is an issuer-side, committee-assist bid evaluation system for government and defence procurement organisations.',
    category: 'safe-with-care',
    evidence: ['Founder ruling 2026-06-09 (two co-equal products)', 'KRISEVA_EVALUATOR repo'],
    surface: 'evaluator.astro, index.astro (vol II)',
    caveat:
      'Committee-assist framing only; never name the evaluating agency; no order, contract, or deployment-win claims.',
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
    surface: 'evaluator.astro, index.astro (vol II caps)',
    caveat: 'Describe as system architecture; no accuracy percentage without measurement evidence.',
  },
  {
    id: 'evaluator.six-state',
    wording:
      'A six-state verdict model. The two uncertain states auto-route to a human; nothing is disqualified silently.',
    category: 'safe-with-care',
    evidence: ['Founder ruling 2026-06-09 (two co-equal products)', 'KRISEVA_EVALUATOR repo'],
    surface: 'evaluator.astro, index.astro (vol II caps, matrix)',
    caveat: 'States: Verified · Qualified · Insufficient · Missing · Requires demonstration · Failed.',
  },
  {
    id: 'evaluator.audit-chain',
    wording:
      'A hash-chained, append-only audit log. A single edited verdict breaks the chain; tamper is visible.',
    category: 'safe-with-care',
    evidence: ['Founder ruling 2026-06-09 (two co-equal products)', 'KRISEVA_EVALUATOR repo'],
    surface: 'evaluator.astro, index.astro (audit section)',
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
    surface: 'validation.astro, tas.astro screenshot disclosures',
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
    surface: 'index.astro (cred band, field record), validation.astro',
  },
  {
    id: 'record.udyam',
    wording: 'Udyam-registered MSME, on government record.',
    category: 'verified-and-safe',
    evidence: ['Founder-signed v6 homepage (df836d4)', 'Udyam registration record'],
    surface: 'index.astro (field record), validation.astro',
  },
  {
    id: 'record.dpiit',
    wording: 'DPIIT Startup-India recognition, in process.',
    category: 'safe-with-care',
    evidence: ['Founder-signed v6 homepage (df836d4)'],
    surface: 'index.astro (field record), validation.astro',
    caveat: 'Always labelled "in process" until the certificate is on record.',
  },
  {
    id: 'record.iiec',
    wording: 'Incubated at IIT Gandhinagar · IIEC.',
    category: 'verified-and-safe',
    evidence: ['Founder-signed v6 homepage (df836d4)', 'IIEC incubation record'],
    surface: 'index.astro (cred band, field record), validation.astro, founder.astro',
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
    surface: 'founder.astro, site.ts',
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
    surface: 'index.astro (Act 2 merge line)',
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
    surface: 'index.astro (Act 7 mission rows)',
    caveat:
      'Commitment framing only ("we build so that..."). Never restate as an achieved outcome, a national-impact statistic, or a government endorsement.',
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
