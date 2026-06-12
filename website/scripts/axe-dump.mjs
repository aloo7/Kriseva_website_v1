import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const routes = ['/', '/tas', '/evaluator', '/workflow', '/security', '/validation', '/founder', '/contact', '/404'];
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
for (const r of routes) {
  await page.goto('http://localhost:4321' + r, { waitUntil: 'networkidle' });
  const res = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']).analyze();
  const blocking = res.violations.filter(v => ['serious','critical'].includes(v.impact));
  for (const v of blocking) {
    console.log(`\n=== ${r} · ${v.id} (${v.impact}) ===`);
    for (const n of v.nodes.slice(0, 8)) {
      console.log('  sel:', n.target.join(' '));
      const d = (n.any[0] && n.any[0].data) || {};
      if (d.fgColor) console.log(`    fg ${d.fgColor} bg ${d.bgColor} ratio ${d.contrastRatio} need ${d.expectedContrastRatio}`);
    }
  }
}
await browser.close();
