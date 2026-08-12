// Header + footer navigation. Header includes the primary "Contact Founder"
// CTA which is rendered as a button by Header.astro.
//
// v2 sitemap (CORPORATE_SITE_V2_ARCHITECTURE.md §4): the header carries six
// company-first links plus the Contact CTA; products (TAS, Evaluator,
// Attest) are one click deep, reached from the footer, sector pages, and
// the homepage portfolio cards rather than the header.

import { routes } from './routes';

export type NavItem = {
  href: string;
  label: string;
};

export type NavGroup = {
  heading: string;
  items: NavItem[];
};

export const headerLinks: NavItem[] = [
  { href: routes.company, label: 'Company' },
  { href: routes.capabilities, label: 'Capabilities' },
  { href: routes.defense, label: 'Defense' },
  { href: routes.finance, label: 'Finance' },
  { href: routes.evidence, label: 'Evidence' },
  { href: routes.founder, label: 'Founder' },
];

// Grouped footer sitemap per architecture §4: Company / Sectors / Systems /
// Trust. Products live under Systems, one click deep from the footer.
export const footerGroups: NavGroup[] = [
  {
    heading: 'Company',
    items: [
      { href: routes.company, label: 'Company' },
      { href: routes.capabilities, label: 'Capabilities' },
      { href: routes.evidence, label: 'Evidence' },
      { href: routes.founder, label: 'Founder' },
      { href: routes.contact, label: 'Contact' },
    ],
  },
  {
    heading: 'Sectors',
    items: [
      { href: routes.defense, label: 'Defense' },
      { href: routes.finance, label: 'Finance' },
    ],
  },
  {
    heading: 'Systems',
    items: [
      { href: routes.tas, label: 'TAS' },
      { href: routes.evaluator, label: 'Evaluator' },
      { href: routes.attest, label: 'Attest' },
    ],
  },
  {
    heading: 'Trust',
    items: [
      { href: routes.security, label: 'Security' },
    ],
  },
];
