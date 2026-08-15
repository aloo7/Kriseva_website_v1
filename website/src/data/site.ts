// Single source of truth for site identity, contact details, and SEO defaults.
// Every page/layout reads from here so kriseva.in identity stays consistent.

export const site = {
  name: 'KRISEVA AI',
  legalName: 'KRISEVA AI Private Limited',
  domain: 'www.kriseva.in',
  // TODO(founder): apex kriseva.in DNS is dead (2026-06-12 audit); flip when
  // fixed and a canonical host is chosen.
  url: 'https://www.kriseva.in',
  positioning: 'Procurement intelligence for India’s defense ecosystem.',
  // v2 (W11b): footer tagline updated to the registered companyV2.hero-headline
  // wording (docs/PUBLIC_CLAIMS_REGISTER.md V2-2) so the sitewide footer and
  // og:image:alt / twitter:image:alt text (BaseLayout.astro) match the v2
  // company-first positioning instead of the retired TAS-only v1 framing.
  shortPositioning: 'The evidence layer for high-stakes institutional decisions.',
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
    // v2 (W11b, 2026-08-15): brand-first "KRISEVA · <role>" title pattern,
    // wording from the registered companyV2.hero-headline /
    // companyV2.sentence claims (docs/PUBLIC_CLAIMS_REGISTER.md V2-2,
    // V2-1). Every route currently passes its own explicit title/description
    // to BaseLayout, so these are fallback values only, kept in the same
    // pattern for consistency and safety if a future page omits the props.
    title: 'KRISEVA · The evidence layer for high-stakes institutional decisions.',
    description: 'KRISEVA AI builds evidence-first AI systems for high-stakes institutional decisions.',
    ogImage: '/assets/brand/kriseva-og.png',
    favicon: '/assets/brand/kriseva-favicon.svg',
    locale: 'en_IN',
    themeColor: '#06101F',
  },
} as const;

export type Site = typeof site;
