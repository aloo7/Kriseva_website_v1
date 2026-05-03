// Header + footer navigation. Header includes the primary "Contact Founder"
// CTA which is rendered as a button by Header.astro.

export type NavItem = {
  href: string;
  label: string;
};

export const headerLinks: NavItem[] = [
  { href: '/tas', label: 'TAS' },
  { href: '/workflow', label: 'Workflow' },
  { href: '/security', label: 'Security' },
  { href: '/issuer-roadmap', label: 'Issuer Roadmap' },
  { href: '/validation', label: 'Validation' },
  { href: '/founder', label: 'Founder' },
];

export const footerSitemap: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/tas', label: 'TAS' },
  { href: '/workflow', label: 'Workflow' },
  { href: '/security', label: 'Security' },
  { href: '/issuer-roadmap', label: 'Issuer Roadmap' },
  { href: '/validation', label: 'Validation' },
  { href: '/founder', label: 'Founder' },
  { href: '/contact', label: 'Contact' },
];
