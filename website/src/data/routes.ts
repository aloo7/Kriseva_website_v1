// Canonical route table. Components/pages should import from here instead of
// hardcoding string paths so route changes happen in one place.

export const routes = {
  home: '/',
  tas: '/tas',
  workflow: '/workflow',
  security: '/security',
  issuerRoadmap: '/issuer-roadmap',
  validation: '/validation',
  founder: '/founder',
  contact: '/contact',
  contactWithIntent: (intent: 'demo' | 'pilot' | 'partnership' | 'issuer') =>
    `/contact?intent=${intent}` as const,
} as const;

export type Routes = typeof routes;
