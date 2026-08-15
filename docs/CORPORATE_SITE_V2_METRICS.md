# CORPORATE SITE V2 METRICS

Status: skeleton, created at work order W11b (2026-08-15). Before column
is the pre-redesign baseline, captured 2026-08-13 against main @ deb3dff8:
docs/v2-handoffs/BASELINE_RUNTIME.md (untracked). After column is pending
Phase 5 (the architecture's own deterministic performance/budget check,
CORPORATE_SITE_V2_ARCHITECTURE.md §13, §17), which runs once Phase 4
(motion, W12) lands and the site reaches release-candidate state.

| Metric | Before (v1, main @ deb3dff8) | After (v2, site/v9-corporate) |
|---|---|---|
| Route count (dist/ HTML pages) | 9 | pending Phase 5 |
| Homepage HTML size | 155.2 KB | pending Phase 5 |
| Homepage JS transferred | 726.3 KB | pending Phase 5 |
| Homepage images transferred | 1,165.8 KB | pending Phase 5 |
| Homepage total transfer (initial load) | approx. 2,473.8 KB | pending Phase 5 |
| Full dist/ size | 8.2 MB | pending Phase 5 |
| External network origins | 0 | pending Phase 5 |
| Homepage source (index.astro) length | 2,455 lines | pending Phase 5 |

## Budgets to check against at Phase 5

Per architecture §13 (homepage, cold load): HTML <= 120 KB, CSS <= 80 KB,
JS total <= 180 KB (GSAP 71K + ScrollTrigger approx. 50K + Lenis approx.
40K + site code <= 20K), three.js 0 KB (retired, D-004), above-the-fold
images <= 200 KB, full page transfer <= 900 KB, external origins 0
(unchanged).

## Notes

- The "Before" column's route list was: /, /404, /contact, /evaluator,
  /founder, /security, /tas, /validation, /workflow. The v2 route list (13
  routes) is documented in architecture §4 and this repo's CHANGELOG.md.
- Homepage source length is not a direct like-for-like comparison after
  v2: architecture §9 decomposes index.astro into composition plus
  section components under src/components/home/, so the "after" figure
  should be measured as index.astro's own line count (target: <= 400
  lines per architecture §5) plus a separate total across the new home
  components, not a single combined number.
- Whoever runs Phase 5 should re-run the same measurement method
  documented in BASELINE_RUNTIME.md (Playwright network capture against a
  local `astro preview` server) so the two columns are comparable.
