# KRISEVA site v3: "The Bridge" (plan and execution contract)

Opened 2026-10-14 on branch `site/v10-bridge`. Supersedes the v2 positioning for the public site. v2 docs stay as history.

## 1. The job in one line
A visitor who knows nothing about Kriseva understands, inside five to ten seconds of scrolling, that India's defence and space suppliers and the government buyers who evaluate them are separated by a gap made of paper, and that Kriseva builds the bridge: TAS on the supplier side, Evaluator on the buyer side, one evidence engine underneath.

## 2. Positioning
- Category: AI for defence and space procurement in India (Procol does procurement AI for enterprises; nobody owns defence and space).
- Signature visual: the bridge from the Together 7.0 brief, rebuilt as a scroll-built inline SVG. Shores = suppliers (left) and government buyers (right). Pillars = TAS and Evaluator. Deck = Kriseva Evidence Engine. Cargo = bids that lift out of the paper river and cross with evidence attached.
- Voice: short, concrete, verifiable. Ambition in vision and targets; paper exactly as on disk (00_BRAIN/FACTS.md).

## 3. Information architecture (Procol-grade, honest)
| Procol | Kriseva v3 | Route |
|---|---|---|
| Products | Products: TAS, Evaluator | /tas, /evaluator |
| Solutions | Solutions: defence suppliers, space suppliers, evaluation committees, labs and PSUs | /solutions |
| Customers, testimonials, logos | Proof: Exhibit A, every claim exactly as it stands | /proof |
| ISO, SOC 2, GDPR badges | Sovereign by design: properties testable in the buyer's room, no certification claimed | /security |
| Pricing, custom quote | Plans: pilot-first, module picker, custom quote by email (the lint bans the word "pricing") | /plans |
| Resources, FAQ | Resources: FAQ and a defence procurement glossary (SEO) | /resources |
| About | Company: story, team, vision | /company |
| Book a demo / free trial | Book a demo, request a pilot | /contact |
| (none) | Kriseva Labs: ATTEST research prototype, out of the main nav | /attest |

Redirects (301): /defense to /solutions, /finance to /attest, /capabilities to /, /evidence to /proof, /founder to /company, /pricing to /plans, /validation to /proof, /workflow to /, /issuer-roadmap to /evaluator.

## 4. Home, section by section
1. Hero, pinned, scroll-built bridge (one scrubbed sequence, about 1.7 screens): gap, pillars rise, cables and deck, bids cross and are stamped. Shore statistics with sources on the navy ground.
2. The span: 1% of GDP is the estimated gain if government buys 10% better (xKDR WP 10). A dimension line draws across the page.
3. Two pillars, one engine: TAS (radar of 27 public portals to one shortlist) and Evaluator (criteria by bidder matrix, every cell opens its page).
4. Zoom into the bridge: one finding, one click. Interactive specimen: clause, finding, page, officer decides, record sealed.
5. Tender to award: tabs for supplier side and buyer side, five moves each.
6. Sovereign by design: four rotating seals (offline, Wi-Fi off cold start, tamper-evident chain, officers decide).
7. Exhibit A: proof timeline with stamps, plus one dashed target card.
8. Plans teaser, FAQ, final call to action.

## 5. Design system
- Palette from the brief and the logo: paper #F5F0E6, navy #0A1F44, brass #B07F35 / #D2A660 on navy, stamp red #A8322A, water #E2E8EF.
- Type: IBM Plex Serif (light display, italic accent), IBM Plex Sans (body), IBM Plex Mono (labels, drafting marks), IBM Plex Sans Devanagari for bilingual micro-labels (as on real Indian bid documents). All self-hosted, OFL.
- Language: engineering drawing meets government dossier. Dimension lines, registration marks, stamps, hatching on navy ground. No stock imagery, no gradients-for-their-own-sake, no glassmorphism.

## 6. Motion system
- Zero-dependency engine (src/scripts/bridge.ts): sticky stage, scroll progress with lerp smoothing, tracks per element. GSAP is no longer loaded.
- Fail-open: without JS or with reduced motion the completed bridge renders (the brief's composition). Text is never hidden (D-013 kept): reveals are transform-only.
- Ambient life (drone, satellite, radar sweep, flag, water) is CSS-only and stops under reduced motion.

## 7. Truth and safety rules for every page
- Statistics live in src/data/stats.ts with source, URL and date; each was opened at source on 2026-10-14.
- No government body, unit or customer is named on the public site, or in this public repository, until the founder clears it (founder decision pending, 2026-10-14).
- No real tender identifiers: the bid cards are SPECIMEN cards; the sovereignty scan stays green.
- Banned words (FACTS.md plus the copy lint) and no em or en dashes anywhere.

## 8. SEO
- Title and description per route with "defence procurement", "space procurement", "tender", "bid evaluation", "GeM".
- JSON-LD: Organization (sitewide), SoftwareApplication (TAS, Evaluator), FAQPage (home, resources), BreadcrumbList (inner pages).
- Sitemap regenerated for the v3 routes; canonical host unchanged (www).
- Glossary page targets long-tail queries (GeM, CPPP, L1, QCBS, EMD, technical bid evaluation, comparative statement).

## 9. Gates before push
1. npm run build, lint:copy, lint:public-output.
2. bash scripts/sovereignty-scan.sh --all.
3. Playwright: qa-static (JS off), a11y (axe AA), motion (reduced motion and full), responsive (no horizontal scroll at 10 widths); visual baselines regenerated.
4. Browser walk at 1440 and 390 in the built-in browser; screenshots.
5. Adversarial review of copy against FACTS.md and of the diff.

## 10. Deploy
Merge to main and push: Cloudflare Pages builds main automatically (founder instruction 2026-10-14: "it should directly reflect upon my website").
