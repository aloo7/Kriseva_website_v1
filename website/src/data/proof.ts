// proof.ts
//
// Exhibit A: every claim exactly as it stands. Wording follows the founder's
// claims register (00_BRAIN/FACTS.md, 2026-10-06 doctrine: ambition in
// targets, paper exactly as on disk).
//
// Public-naming rule (v3, 2026-10-14): no government body, unit, prospect or
// customer is named on this public site, or in this public repository, until
// the founder clears it. The cleared wording for each item is kept in the
// founder's private claims register, not here.

export type Stamp = 'Registered' | 'Selected' | 'Passed' | 'Signed' | 'Demonstrated' | 'Target';

export interface ProofItem {
  id: string;
  date: string;
  /** Short kicker above the title (mono). */
  kicker: string;
  title: string;
  body: string;
  stamp: Stamp;
  /** Where the item sits on the May to Oct 2026 rail, 0 to 1. */
  at: number;
}

export const proof: ProofItem[] = [
  {
    id: 'incorporated',
    date: '7 May 2026',
    kicker: 'Hyderabad',
    title: 'Incorporated',
    body: 'Kriseva AI Private Limited, registered as an MSME (Udyam).',
    stamp: 'Registered',
    at: 0.02,
  },
  {
    id: 'gift-ifih',
    date: 'Aug 2026',
    kicker: 'GIFT IFIH 2026',
    title: 'Top 15, Young Builders’ Program Hackathon',
    body: 'Selected for the eight-week residency at GIFT City, September to October 2026.',
    stamp: 'Selected',
    at: 0.62,
  },
  {
    id: 'lois',
    date: '22 Sep 2026',
    kicker: 'Defence MSMEs',
    title: 'Two letters of intent',
    body: 'Signed, non-binding letters of intent from two defence MSMEs to evaluate TAS in a pilot.',
    stamp: 'Signed',
    at: 0.74,
  },
  {
    id: 'tests',
    date: '23 Sep 2026',
    kicker: 'TAS engineering',
    title: '4,649 automated tests passing',
    body: 'The TAS test suite, run in full on the build of that date.',
    stamp: 'Passed',
    at: 0.76,
  },
  {
    id: 'wifi-off',
    date: '6 Oct 2026',
    kicker: 'Evaluator engineering',
    title: 'Cold start with the Wi-Fi off',
    body: 'Zero application requests left the machine during the test.',
    stamp: 'Passed',
    at: 0.86,
  },
  {
    id: 'space-buyer',
    date: 'Sep and Oct 2026',
    kicker: 'Government space sector',
    title: 'Evaluator shown to procurement stakeholders',
    body: 'Demonstrated to a government space-sector procurement team, with a follow-up session on 9 October 2026.',
    stamp: 'Demonstrated',
    at: 0.88,
  },
  {
    id: 'space-maker',
    date: '12 Oct 2026',
    kicker: 'Private space sector',
    title: 'TAS shown to a space-systems maker',
    body: 'India’s space suppliers are our market too.',
    stamp: 'Demonstrated',
    at: 0.96,
  },
];

export const target = {
  date: 'By 31 Dec 2026',
  title: 'Three pilots running',
  body: 'Our target, stated as a target. This card turns solid when the paper exists.',
  stamp: 'Target' as Stamp,
};

export const boundary =
  'Pre-revenue and bootstrapped. No government body or customer is named on this site, and none endorses Kriseva.';
