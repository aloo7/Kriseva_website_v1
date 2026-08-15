// organizationSchema.ts
//
// Shared Organization JSON-LD, used by both layouts (V6Head.astro for the
// eight v6/V6Layout pages, BaseLayout.astro for the five v2/BaseLayout
// pages) so the two layouts stop carrying two independently-hand-written
// copies that can drift apart.
//
// Fixed at W11b (2026-08-15): the previous hardcoded copy (V6Head.astro
// only; BaseLayout.astro had no JSON-LD of any kind) predated the v2
// pivot. It used British "defence" spelling (D-012 standardizes on US
// spelling sitewide) and described KRISEVA as "two products on one
// evidence engine", omitting ATTEST entirely. `description` below is the
// registered companyV2.sentence claim, exact wording, no paraphrase.

import { getClaim } from './publicClaims';
import { site } from './site';

export function getOrganizationSchema(): Record<string, unknown> {
  const description = getClaim('companyV2.sentence')!.wording;
  const slogan = getClaim('positioning.thesis')!.wording;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    alternateName: site.name,
    url: site.url + '/',
    email: site.email,
    description,
    founder: {
      '@type': 'Person',
      name: 'Ayush Tiwary',
      jobTitle: 'Founder',
      alumniOf: 'IIT Gandhinagar',
      email: site.email,
    },
    knowsAbout: [
      'defense procurement',
      'regulated finance',
      'evidence-first AI',
      'tender automation',
      'bid evaluation',
      'regulatory filing review',
      'GeM',
      'DefProc',
      'audit logging',
    ],
    slogan,
  };
}
