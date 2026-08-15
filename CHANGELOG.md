# Changelog

## v2 corporate site (site/v9-corporate), 2026-08-13 to 2026-08-15

Full rebuild of the public website from a TAS-product-first site to a
company-first corporate site. Full architecture: docs/CORPORATE_SITE_V2_ARCHITECTURE.md.
Decision record: docs/CORPORATE_SITE_V2_DECISIONS.md. Claims register:
docs/PUBLIC_CLAIMS_REGISTER.md.

- Route count grew from 9 to 13. Added: /company, /capabilities, /defense,
  /finance, /attest, /evidence. Retired as standalone pages, replaced with
  301 redirects in worker/index.ts: /workflow to /capabilities, /validation
  to /evidence, /issuer-roadmap to /evaluator. Kept: /, /tas, /evaluator,
  /security, /founder, /contact, /404.
- Homepage rebuilt from a single 2,455-line, 18-section TAS narrative page
  into an 8-section company narrative composed from section components
  under src/components/home/.
- New signature visual, the Evidence Spine: six stations (SOURCE, EVIDENCE,
  CONFLICT, HUMAN REVIEW, DECISION, RETAINED RECORD) rendered as inline SVG,
  shared across the homepage, /capabilities, /defense, and /finance.
- three.js WebGL hero exhibit retired from every v2 route (589 KB of
  conditional JS). Code archived under _index_v8_archive.astro, not
  deleted. Motion stack is GSAP, ScrollTrigger, and Lenis only.
- ATTEST promoted from an unlisted internal prototype to a full product
  page (/attest) and a regulated-finance sector page (/finance), under
  binding maturity-transparency rules: research-stage prototype, synthetic
  demonstration data only, not connected to any regulator system, no
  customers and no pilots claimed.
- Maturity-chip vocabulary (pilot, working prototype, research prototype)
  introduced as a first-class token, rendered identically everywhere.
- Public claims register extended from 51 to 107 registered claims: 54
  added in the Phase 2 v2 extension (company positioning, six capability
  tiles, two sector statements, three portfolio cards, the full ATTEST
  set, an EVALUATOR maturity update, four trust-pillar claims, three proof-
  row claims), 2 more added at work order W11b (attestV2.evidence-states,
  attestV2.not-claimed).
- A real buyer-field value ("Indian Army") inside a product screenshot
  (console_score_drawer.jpg) was found and quarantined out of public/ at
  work order W11b; its filmstrip reference on /tas was removed.
- SEO pass at W11b: consistent "KRISEVA · page role" title pattern across
  all 13 routes, Organization JSON-LD extended to the five routes that
  previously shipped no structured data at all, and corrected sitewide
  (US spelling, three products named instead of two, current company
  wording). Sitemap regenerated to the 12 indexable v2 routes.
- Contact page gained a "Research collaboration (ATTEST)" intent option.

No routes were deployed as part of this program; every change above ships
to the site/v9-corporate branch only, per the repo's no-deploy rule.
