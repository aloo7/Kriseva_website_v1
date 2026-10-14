// meta.ts: small shared bits for the /proof components.

/** The date the record on /proof was last checked against the paper. Update it
 *  whenever an entry in src/data/proof.ts or src/data/stats.ts changes. */
export const RECORD_DATE = '14 Oct 2026';

/** Stamp colour per stamp word, matching the home Exhibit A. */
export const stampClass: Record<string, string> = {
  Registered: 'stamp--navy',
  Selected: '',
  Passed: 'stamp--navy',
  Signed: '',
  Demonstrated: 'stamp--brass',
  Target: 'stamp--navy',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-06-17' becomes '17 Jun 2026'. With monthOnly, '2021-11-01' becomes 'Nov 2021'. */
export function fmtDate(iso: string, monthOnly = false): string {
  const [y, m, d] = iso.split('-').map(Number);
  const month = MONTHS[m - 1];
  return monthOnly ? `${month} ${y}` : `${d} ${month} ${y}`;
}
