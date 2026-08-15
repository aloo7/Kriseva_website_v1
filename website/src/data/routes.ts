// Canonical route table. Components/pages should import from here instead of
// hardcoding string paths so route changes happen in one place.
//
// v2 sitemap (CORPORATE_SITE_V2_ARCHITECTURE.md §4). Company, Capabilities,
// Defense, Finance, Evidence, and Attest are new destinations; TAS and
// Evaluator carry over simplified; Security expands in place.

export const routes = {
  home: '/',
  company: '/company',
  capabilities: '/capabilities',
  defense: '/defense',
  finance: '/finance',
  tas: '/tas',
  evaluator: '/evaluator',
  attest: '/attest',
  security: '/security',
  evidence: '/evidence',
  founder: '/founder',
  contact: '/contact',
  // Deprecated alias: workflow content is absorbed into /capabilities
  // (architecture §4/§10). Kept so archived pages still compile;
  // worker/index.ts 301s the old URL.
  workflow: '/capabilities',
  // Deprecated alias: validation content is absorbed into /evidence
  // (architecture §4). Kept so archived pages still compile; worker/index.ts
  // 301s the old URL.
  validation: '/evidence',
  // Deprecated alias: issuer-roadmap was superseded by the Evaluator product
  // page (founder ruling 2026-06-09). Kept so archived pages still compile;
  // worker/index.ts 301s the old URL.
  issuerRoadmap: '/evaluator',
  // 'attest' added at W11b: contact.astro's intent select (src/pages/contact.astro)
  // gained a "Research collaboration (ATTEST)" option with the matching value.
  contactWithIntent: (intent: 'demo' | 'pilot' | 'partnership' | 'issuer' | 'attest') =>
    `/contact?intent=${intent}` as const,
} as const;

export type Routes = typeof routes;
