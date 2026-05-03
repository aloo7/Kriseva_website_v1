// Pre-approved public claim copy. Every string here must trace to a row marked
// "Verified and safe to publish" or "Safe with careful wording" in
// project/uploads/CLAIM_REGISTER.md. Pages should compose copy from this file
// rather than inventing new wording.

export const claims = {
  thesis: 'A tender is not a PDF. It is a decision system hidden inside a document bundle.',
  productOneLiner: 'KRISEVA TAS helps bid teams discover, parse, score, and review tender opportunities.',
  productLongLine:
    'KRISEVA TAS is the bidder-side tender automation and procurement intelligence product for defense MSMEs and defense-tech companies. It helps bid teams discover or ingest tender bundles, parse documents, extract structured requirements, score relevance against company capability context, organize compliance evidence, and generate BID / REVIEW / SKIP review language.',

  bundleThesis:
    'Treats tenders as bundles of bid documents, specifications, BOQs, ATCs, corrigenda, annexures, and supporting files.',

  parsing:
    'Parses PDF, DOCX, XLSX, TXT, and CSV tender files locally.',

  metadata:
    'Extracts key tender metadata such as buyer fields, dates, values, EMD/ePBG, eligibility signals, and document requirements.',

  compliance:
    'Extracts and structures compliance requirements for human review.',

  recommendation:
    'Generates operator review briefs with BID, REVIEW, or SKIP recommendations.',

  ocr:
    'Includes local OCR support for scanned or low-text PDFs, with OCR quality under active evaluation.',

  defproc:
    'Includes DefProc public discovery and operator-assisted flows for protected documents.',

  gem:
    'Includes live GeM discovery and acquisition support.',

  localFirst:
    'Designed for local-first tender processing, with local database, local file storage, and local model routes where configured.',

  localFirstBoundary:
    'External portal access, model integrations, calendar/email integrations, or deployment-specific connectors should be reviewed per deployment boundary.',

  localModelRoutes:
    'Local model routes are available where configured for active pilot workflows.',

  issuerRoadmap:
    'Issuer-side procurement intelligence is under validation and pilot exploration.',

  issuerNotProduct:
    'Issuer-side procurement intelligence is a roadmap direction, not a launched product.',

  productStatus:
    'TAS is in pilot and demo evaluation, not a production SaaS.',

  recentTestNote:
    'A recent internal repo inspection reported 4,072 pytest-collected tests and a passing fast test run. Full verification status should be reviewed before using this as a headline production-readiness claim.',

  notClaimed: [
    'Autonomous bid submission',
    'Win-rate improvement promises',
    'Replacing bid teams',
    'Working on every portal automatically',
    'CPPP support',
    'Production SaaS readiness',
    'Agency endorsement',
    'Validation by any defense agency',
  ],

  noEndorsement:
    'No military or government endorsement claimed or implied.',
} as const;

export type Claims = typeof claims;
