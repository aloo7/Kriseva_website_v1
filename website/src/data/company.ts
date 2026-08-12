// company.ts
//
// v2 company data layer (CORPORATE_SITE_V2_ARCHITECTURE.md §9). Company,
// Capabilities, sector, and portfolio surfaces read from here instead of
// inlining copy, mirroring how routes.ts and site.ts centralize their own
// domains.
//
// Claim discipline: every public-facing string below imports its exact
// wording from a registered publicClaims.ts id (via claimWording). Do not
// paraphrase a registered claim and do not invent new claim wording here;
// a separate claims worker owns publicClaims.ts. Any field still pending
// registration is marked with a CLAIM-PENDING comment and a neutral
// placeholder string instead of invented copy.

import { getClaim } from './publicClaims';
import { routes } from './routes';

// Maturity vocabulary is a first-class token (architecture §7): one
// vocabulary, no synonyms, rendered identically everywhere by MaturityChip.
export type Maturity = 'pilot' | 'working-prototype' | 'research-prototype';

export type SpineStationId =
  | 'source'
  | 'evidence'
  | 'conflict'
  | 'human-review'
  | 'decision'
  | 'retained-record';

export interface SpineStation {
  id: SpineStationId;
  /** Station label from the six-station spine vocabulary (architecture §6). */
  label: string;
  description: string;
}

export interface Capability {
  id: string;
  /** The spine station this capability territory instantiates (architecture §9). */
  station: SpineStationId;
  title: string;
  description: string;
}

export interface Sector {
  id: 'defense' | 'finance';
  name: string;
  summary: string;
  /** Closing boundary line per architecture §5 (homepage Sectors section). */
  boundaryLine: string;
  /** Portfolio products this sector routes to (architecture §4/§9). */
  systems: PortfolioProduct['id'][];
  route: string;
}

export interface PortfolioProduct {
  id: 'tas' | 'evaluator' | 'attest';
  name: string;
  purpose: string;
  primaryUser: string;
  capabilities: [string, string, string];
  maturity: Maturity;
  route: string;
}

function claimWording(id: string): string {
  const claim = getClaim(id);
  if (!claim) {
    throw new Error(`company.ts: expected registered claim "${id}" in publicClaims.ts`);
  }
  return claim.wording;
}

// ─────────────────────────────────────────────────────────────────────────
// Evidence Spine — the six stations every product instantiates (§6). Each
// station reuses its matching capabilityV2 claim: same underlying fact,
// rendered in the spine visual instead of the /capabilities grid.
// ─────────────────────────────────────────────────────────────────────────
export const spineStations: SpineStation[] = [
  {
    id: 'source',
    label: 'SOURCE',
    description: claimWording('capabilityV2.source'),
  },
  {
    id: 'evidence',
    label: 'EVIDENCE',
    description: claimWording('capabilityV2.evidence'),
  },
  {
    id: 'conflict',
    label: 'CONFLICT',
    description: claimWording('capabilityV2.conflict'),
  },
  {
    id: 'human-review',
    label: 'HUMAN REVIEW',
    description: claimWording('capabilityV2.human-review'),
  },
  {
    id: 'decision',
    label: 'DECISION',
    description: claimWording('capabilityV2.decision'),
  },
  {
    id: 'retained-record',
    label: 'RETAINED RECORD',
    description: claimWording('capabilityV2.retained-record'),
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Capabilities — six territories, one per spine station (§4 /capabilities, §9)
// ─────────────────────────────────────────────────────────────────────────
export const capabilities: Capability[] = [
  {
    id: 'source-integrity',
    station: 'source',
    title: 'Source integrity',
    description: claimWording('capabilityV2.source'),
  },
  {
    id: 'evidence-extraction',
    station: 'evidence',
    title: 'Evidence extraction',
    description: claimWording('capabilityV2.evidence'),
  },
  {
    id: 'conflict-detection',
    station: 'conflict',
    title: 'Conflict detection',
    description: claimWording('capabilityV2.conflict'),
  },
  {
    id: 'human-review-routing',
    station: 'human-review',
    title: 'Human review routing',
    description: claimWording('capabilityV2.human-review'),
  },
  {
    id: 'decision-recording',
    station: 'decision',
    title: 'Decision recording',
    description: claimWording('capabilityV2.decision'),
  },
  {
    id: 'retained-record-keeping',
    station: 'retained-record',
    title: 'Retained record keeping',
    description: claimWording('capabilityV2.retained-record'),
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Sectors — defense and finance (§4/§5 Sectors section)
// ─────────────────────────────────────────────────────────────────────────
export const sectors: Sector[] = [
  {
    id: 'defense',
    name: 'Defense',
    summary: claimWording('sectorV2.defense'),
    boundaryLine: claimWording('boundary.notClaimed'),
    systems: ['tas', 'evaluator'],
    route: routes.defense,
  },
  {
    id: 'finance',
    name: 'Finance',
    summary: claimWording('sectorV2.finance'),
    boundaryLine: claimWording('attestV2.maturity-no-regulator-connection'),
    systems: ['attest'],
    route: routes.finance,
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Portfolio — TAS, Evaluator, Attest (§5.5 homepage Portfolio section)
// ─────────────────────────────────────────────────────────────────────────
export const portfolio: PortfolioProduct[] = [
  {
    id: 'tas',
    name: 'KRISEVA TAS',
    purpose: claimWording('portfolioV2.tas-purpose'),
    primaryUser: claimWording('portfolioV2.tas-primary-user'),
    capabilities: [
      claimWording('portfolioV2.tas-cap-1'),
      claimWording('portfolioV2.tas-cap-2'),
      claimWording('portfolioV2.tas-cap-3'),
    ],
    maturity: 'pilot',
    route: routes.tas,
  },
  {
    id: 'evaluator',
    name: 'KRISEVA Evaluator',
    purpose: claimWording('portfolioV2.evaluator-purpose'),
    primaryUser: claimWording('portfolioV2.evaluator-primary-user'),
    capabilities: [
      claimWording('portfolioV2.evaluator-cap-1'),
      claimWording('portfolioV2.evaluator-cap-2'),
      claimWording('portfolioV2.evaluator-cap-3'),
    ],
    maturity: 'working-prototype',
    route: routes.evaluator,
  },
  {
    id: 'attest',
    name: 'KRISEVA Attest',
    purpose: claimWording('portfolioV2.attest-purpose'),
    primaryUser: claimWording('portfolioV2.attest-primary-user'),
    capabilities: [
      claimWording('portfolioV2.attest-cap-1'),
      claimWording('portfolioV2.attest-cap-2'),
      claimWording('portfolioV2.attest-cap-3'),
    ],
    maturity: 'research-prototype',
    route: routes.attest,
  },
];
