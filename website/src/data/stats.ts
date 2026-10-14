// stats.ts
//
// Every number printed on the v3 site lives here with its source. Each one was
// opened at source on 2026-10-14 (primary document, not a news copy). If a
// figure changes, change it here; pages never inline a statistic.
// Dropped on 2026-10-14: "~20% of India's GDP is spent through public
// procurement (World Bank)". The World Bank blog says it of seven countries
// together, not of India; it does not reconcile with xKDR's 11 to 12 percent.

export interface Stat {
  id: string;
  /** The number as printed. */
  value: string;
  /** Numeric part for the count-up animation, if any. */
  count?: number;
  prefix?: string;
  suffix?: string;
  /** What the number measures, in plain words. */
  label: string;
  /** Short source line printed under the number (mono, uppercase). */
  source: string;
  url: string;
  /** Date of the source document. */
  asOf: string;
}

export type StatKey = 'defenceMsmes' | 'spaceStartups' | 'gemMses' | 'domesticCapital' | 'spaceBudget' | 'defenceContracts' | 'span';

export const stats: Record<StatKey, Stat> = {
  defenceMsmes: {
    id: 'defenceMsmes',
    value: '17,000',
    count: 17000,
    prefix: '~',
    label: 'MSMEs in India’s defence industrial base',
    source: 'PIB, 17 Jun 2026',
    url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/jun/doc2026617895601.pdf',
    asOf: '2026-06-17',
  },
  spaceStartups: {
    id: 'spaceStartups',
    value: '399',
    count: 399,
    label: 'space start-ups operating in India',
    source: 'PIB, 29 Jan 2026',
    url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2220433',
    asOf: '2026-01-29',
  },
  gemMses: {
    id: 'gemMses',
    value: '11 lakh+',
    count: 11,
    suffix: ' lakh+',
    label: 'micro and small enterprises registered on GeM',
    source: 'PIB, 6 Apr 2026',
    url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2249335',
    asOf: '2026-04-06',
  },
  domesticCapital: {
    id: 'domesticCapital',
    value: 'Rs 1.39 lakh cr',
    label: 'earmarked for procurement from domestic defence industries, FY 2026-27',
    source: 'PIB, Union Budget 2026-27',
    url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/feb/doc202623778301.pdf',
    asOf: '2026-02-01',
  },
  spaceBudget: {
    id: 'spaceBudget',
    value: 'Rs 13,706 cr',
    label: 'Department of Space, Budget Estimate 2026-27',
    source: 'Expenditure Budget 2026-27, Demand 95',
    url: 'https://www.indiabudget.gov.in/doc/eb/sbe95.pdf',
    asOf: '2026-02-01',
  },
  defenceContracts: {
    id: 'defenceContracts',
    value: 'Rs 2,09,050 cr',
    label: 'in 193 defence contracts signed in FY 2024-25',
    source: 'PIB, 17 Jun 2026',
    url: 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/jun/doc2026617895601.pdf',
    asOf: '2026-06-17',
  },
  span: {
    id: 'span',
    value: '1%',
    label: 'of GDP: the estimated gain if government buys just 10% better',
    source: 'Sharma and Thomas, xKDR Forum Working Paper 10, Nov 2021',
    url: 'https://www.xkdr.org/paper/the-footprint-of-union-government-procurement-in-india',
    asOf: '2021-11-01',
  },
};

/** Kriseva's own measured numbers. Evidence paths are in the founder's
 *  workspace (00_BRAIN/FACTS.md and the product STATUS files), not in this
 *  public repo. */
export const measured = {
  tasSources: {
    value: '27',
    label: 'public procurement sources read by TAS Tender Intelligence',
    asOf: '13 Oct 2026',
  },
  tasOpenTenders: {
    value: '84,141',
    label: 'distinct open tenders held across those sources',
    asOf: '13 Oct 2026',
  },
  tasTests: {
    value: '4,649',
    label: 'automated tests passing',
    asOf: '23 Sep 2026',
  },
} as const;
