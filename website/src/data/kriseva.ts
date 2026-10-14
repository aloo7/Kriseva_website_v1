// kriseva.ts
//
// v3 identity, navigation and structured data. One source for the header,
// footer, head tags and JSON-LD.

export const SITE = 'https://www.kriseva.in';

export const company = {
  name: 'Kriseva',
  legalName: 'Kriseva AI Private Limited',
  email: 'ayush@kriseva.in',
  incorporated: '7 May 2026',
  city: 'Hyderabad',
  oneLine: 'AI for defence and space procurement in India.',
  promise: 'Kriseva builds the bridge between India’s defence and space suppliers and the government buyers who evaluate them.',
  status: 'Pre-revenue and bootstrapped; raising pre-seed and non-dilutive capital.',
};

export interface NavLink {
  href: string;
  label: string;
  note?: string;
  tag?: string;
}

export interface NavGroup {
  label: string;
  href?: string;
  items?: NavLink[];
  feature?: { title: string; body: string; href: string; cta: string };
}

export const nav: NavGroup[] = [
  {
    label: 'Products',
    items: [
      { href: '/tas', label: 'TAS', tag: 'For suppliers', note: 'Find, read and answer the tenders you can win.' },
      { href: '/evaluator', label: 'Evaluator', tag: 'For buyers', note: 'Check every bid, with a page behind every finding.' },
    ],
    feature: {
      title: 'One evidence discipline underneath',
      body: 'On your premises, every finding linked to its page, every record tamper-evident. Officers decide.',
      href: '/security',
      cta: 'How it stays sovereign',
    },
  },
  {
    label: 'Solutions',
    items: [
      { href: '/solutions#defence-suppliers', label: 'Defence suppliers', note: 'MSMEs and OEMs bidding on GeM and defence portals.' },
      { href: '/solutions#space-suppliers', label: 'Space suppliers', note: 'Space-systems makers and start-ups.' },
      { href: '/solutions#evaluation-committees', label: 'Evaluation committees', note: 'Technical bid evaluation and comparative statements.' },
      { href: '/solutions#labs-and-psus', label: 'Labs and PSUs', note: 'Procurement cells buying at volume.' },
    ],
  },
  { label: 'Proof', href: '/proof' },
  {
    label: 'Resources',
    items: [
      { href: '/security', label: 'Sovereign by design', note: 'What runs where, and how to test it.' },
      { href: '/resources', label: 'FAQ and glossary', note: 'GeM, CPPP, L1, QCBS, EMD and more.' },
      { href: '/company', label: 'Company', note: 'Who we are and why defence and space.' },
      { href: '/attest', label: 'Kriseva Labs: ATTEST', note: 'Our research prototype for regulated finance.' },
    ],
  },
  { label: 'Plans', href: '/plans' },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Products',
    links: [
      { href: '/tas', label: 'TAS for suppliers' },
      { href: '/evaluator', label: 'Evaluator for buyers' },
      { href: '/plans', label: 'Plans and pilots' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { href: '/solutions#defence-suppliers', label: 'Defence suppliers' },
      { href: '/solutions#space-suppliers', label: 'Space suppliers' },
      { href: '/solutions#evaluation-committees', label: 'Evaluation committees' },
      { href: '/solutions#labs-and-psus', label: 'Labs and PSUs' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { href: '/proof', label: 'Proof' },
      { href: '/security', label: 'Sovereign by design' },
      { href: '/resources', label: 'FAQ and glossary' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/company', label: 'About Kriseva' },
      { href: '/contact', label: 'Contact' },
      { href: '/attest', label: 'Kriseva Labs' },
    ],
  },
];

export function organizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': SITE + '/#organization',
    name: company.legalName,
    alternateName: ['Kriseva', 'KRISEVA AI'],
    url: SITE + '/',
    logo: SITE + '/assets/brand/kriseva-mark.svg',
    email: company.email,
    foundingDate: '2026-05-07',
    foundingLocation: { '@type': 'Place', name: 'Hyderabad, Telangana, India' },
    description: company.promise,
    slogan: 'The bridge for defence and space procurement.',
    founder: { '@type': 'Person', name: 'Ayush Tiwary', jobTitle: 'Founder and CEO' },
    areaServed: { '@type': 'Country', name: 'India' },
    knowsAbout: [
      'defence procurement',
      'space procurement',
      'government tenders',
      'GeM bidding',
      'tender intelligence',
      'bid evaluation',
      'technical bid evaluation',
      'on-premise AI',
      'tamper-evident audit trails',
    ],
  };
}

export function softwareSchema(opts: { name: string; path: string; description: string; audience: string }): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: opts.name,
    url: SITE + opts.path,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'On-premise (Linux, macOS)',
    description: opts.description,
    audience: { '@type': 'Audience', audienceType: opts.audience },
    publisher: { '@id': SITE + '/#organization' },
  };
}

export function faqSchema(items: { q: string; a: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: SITE + t.path,
    })),
  };
}
