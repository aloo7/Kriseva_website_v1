// Canonical route table. Components/pages should import from here instead of
// hardcoding string paths so route changes happen in one place.

export const routes = {
  home: '/',
  tas: '/tas',
  workflow: '/workflow',
  security: '/security',
  evaluator: '/evaluator',
  // Deprecated alias: issuer-roadmap was superseded by the Evaluator product
  // page (founder ruling 2026-06-09). Kept so archived pages still compile;
  // public/_redirects 301s the old URL.
  issuerRoadmap: '/evaluator',
  validation: '/validation',
  founder: '/founder',
  contact: '/contact',
  contactWithIntent: (intent: 'demo' | 'pilot' | 'partnership' | 'issuer') =>
    `/contact?intent=${intent}` as const,
} as const;

export type Routes = typeof routes;
