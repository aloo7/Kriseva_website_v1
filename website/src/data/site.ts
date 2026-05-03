// Single source of truth for site identity, contact details, and SEO defaults.
// Every page/layout reads from here so kriseva.in identity stays consistent.

export const site = {
  name: 'KRISEVA AI',
  legalName: 'KRISEVA AI Private Limited',
  domain: 'kriseva.in',
  url: 'https://kriseva.in',
  positioning: 'Procurement intelligence for India’s defense ecosystem.',
  shortPositioning: 'Tender intelligence for defense procurement.',
  email: 'ayush@kriseva.in',
  contactSubjectDefault: 'KRISEVA Inquiry',
  twitter: '',
  founder: {
    firstName: 'Ayush',
    role: 'Founder · KRISEVA AI',
    email: 'ayush@kriseva.in',
    education: 'IIT Gandhinagar · AI/ML & agentic AI context',
    priorWork: 'Defense marketing & operations exposure (electronic warfare / anti-drone domain)',
    photo: '/assets/photos/founder-ayush.png',
  },
  product: {
    name: 'KRISEVA TAS',
    fullName: 'KRISEVA Tender Automation System',
    oneLiner: 'KRISEVA TAS helps bid teams discover, parse, score, and review tender opportunities.',
    longLine: 'KRISEVA TAS is the bidder-side tender automation and procurement intelligence product for defense MSMEs and defense-tech companies. It helps bid teams discover or ingest tender bundles, parse documents, extract structured requirements, score relevance against company capability context, organize compliance evidence, and generate BID / REVIEW / SKIP review language.',
  },
  thesis: 'A tender is not a PDF. It is a decision system hidden inside a document bundle.',
  defaults: {
    title: 'KRISEVA AI — Procurement Intelligence for India’s Defense Ecosystem',
    description:
      'KRISEVA AI builds procurement intelligence systems for India’s defense ecosystem. KRISEVA TAS helps defense MSMEs discover, parse, score, and review tender opportunities.',
    ogImage: '/assets/brand/kriseva-og.png',
    favicon: '/assets/brand/kriseva-favicon.svg',
    locale: 'en_IN',
    themeColor: '#06101F',
  },
} as const;

export type Site = typeof site;
