// egress-audit.mjs - loads every route and records ALL network requests.
// Any request to a non-localhost host is a sovereignty violation.
import { chromium } from 'playwright';
const routes = ['/', '/tas/', '/evaluator/', '/workflow/', '/security/', '/validation/', '/founder/', '/contact/', '/definitely-not-a-page'];
const browser = await chromium.launch();
const page = await browser.newPage();
const offenders = new Map();
page.on('request', (req) => {
  const u = new URL(req.url());
  if (u.hostname !== 'localhost' && u.hostname !== '127.0.0.1') {
    offenders.set(req.url(), (offenders.get(req.url()) || 0) + 1);
  }
});
let total = 0;
for (const r of routes) {
  await page.goto('http://localhost:4321' + r, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  total++;
}
await browser.close();
console.log(`routes visited: ${total}`);
if (offenders.size) {
  console.log('THIRD-PARTY REQUESTS FOUND:');
  for (const [u, n] of offenders) console.log(`  ${n}x ${u}`);
  process.exit(1);
}
console.log('ZERO third-party requests across all routes.');
