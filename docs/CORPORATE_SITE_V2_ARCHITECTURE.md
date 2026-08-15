# CORPORATE SITE V2 ARCHITECTURE

Status: LOCKED (Fable architecture phase, 2026-08-13)
Owner: Principal architect (control plane)
Contract: Downstream workers implement this document. No silent reinterpretation. Escalate ambiguity.

Baseline: main @ deb3dff (site/v8). Audit: docs/CORPORATE_SITE_V2_AUDIT.md.

---

## 1. Diagnosis

The v8 site is a strong product site wearing a company domain. Nine routes, seven of them product surfaces. The homepage is 2,455 lines of TAS narrative across 18 sections. Positioning is "Procurement intelligence for India's defense ecosystem", which makes KRISEVA coextensive with TAS and leaves ATTEST unrepresentable. The claim-governance system (51 registered claims, lint enforcement, human-approval ratchet) is the most institutionally credible asset the site has and must survive intact.

V2 inverts the hierarchy: the company is the subject, products are exhibits.

## 2. Audience hierarchy

1. Institutional evaluators: procurement officials, agency and PSU stakeholders, GIFT/IFSC ecosystem readers, program judges, future regulators. They ask: is this company serious, disciplined, safe to engage.
2. Prospective pilot users: defense MSME bid teams (TAS), evaluation committees (EVALUATOR), compliance officers (ATTEST, research horizon).
3. Talent, press, early capital. Served by the same evidence discipline, never by hype.

The homepage serves audience 1 first and routes audience 2 to product pages within one click.

## 3. Company positioning

Company sentence (the one a first-time visitor should be able to repeat):

> KRISEVA AI builds evidence-first AI systems for high-stakes institutional decisions.

Hero headline:

> The evidence layer for high-stakes institutional decisions.

Hero support line:

> KRISEVA builds systems that turn institutional document bundles into decisions a named human can defend. Sources sealed. Conflicts surfaced. Every decision recorded.

Hero meta chips: "Defense procurement · Regulated finance" and "Pilot and research stage · No endorsement claimed".

All wording above is DRAFT until Phase 2 registers it in docs/PUBLIC_CLAIMS_REGISTER.md and publicClaims.ts. Every element is supportable from existing evidence: source sealing (ATTEST), conflict surfacing (ATTEST three-path, EVALUATOR convergence), named human decisions (both), retained records (EVALUATOR audit chain, TAS field record claims). The support line makes capability claims only, no market or accuracy claims.

Spelling: the site standardizes on "defense" (US spelling), matching every registered claim.

## 4. Sitemap and route migration

### Target routes

| Route | Status | Purpose |
|---|---|---|
| `/` | Rebuilt | Company narrative (section spec in §5) |
| `/company` | New | The institution: thesis, operating principles, maturity discipline, claims governance made visible, legal identity |
| `/capabilities` | New | The shared technical thesis in depth: the Evidence Spine, six capability territories, how one architecture instantiates per product |
| `/defense` | New | Sector page: defense procurement problem, TAS and EVALUATOR as the two sides of it, maturity, links |
| `/finance` | New | Sector page: regulated finance, ATTEST as research experiment, maturity transparency, link to public hub |
| `/tas` | Simplified | Product depth, bidder-side. Absorbs /workflow content worth keeping |
| `/evaluator` | Simplified | Product depth, evaluation-side |
| `/attest` | New | Product/experiment page under strict maturity rules (§11) |
| `/security` | Expanded | Trust architecture: local-first, deployment boundary, audit, "what we refuse to claim" |
| `/evidence` | New | Proof and measurement discipline. Absorbs /validation content |
| `/founder` | Kept | Founder page, lightly refreshed to company-first framing |
| `/contact` | Kept | Intent routing gains an ATTEST/research intent option |
| `/404` | Kept | Unchanged |

### Navigation

Header (6 links + CTA button): Company · Capabilities · Defense · Finance · Evidence · Founder · [Contact]

Products are intentionally one click deep, reached from sector pages, homepage portfolio cards, and the footer. This is the structural statement that KRISEVA is larger than TAS.

Footer sitemap: all 12 routes grouped as Company (company, capabilities, evidence, founder, contact) / Sectors (defense, finance) / Systems (tas, evaluator, attest) / Trust (security).

### Redirects (301, implemented in worker/index.ts)

- `/workflow` → `/capabilities`
- `/validation` → `/evidence`
- `/issuer-roadmap` → `/evaluator`

No other URL changes. Canonical host stays `https://www.kriseva.in`.

## 5. Homepage narrative

Eight sections. Target: index.astro ≤ 400 lines of composition, sections as components (§9).

1. **Corporate Hero.** Typographic, paper-and-ink, no WebGL. Headline, support line, meta chips, two CTAs ("Explore the systems" → portfolio anchor, "Contact" → /contact). Strong Instrument Serif display composition with the archival plate language.
2. **Evidence Thesis.** Short manifesto: institutions decide on documents; confidence is not evidence; what KRISEVA holds constant. Introduces the six-station spine vocabulary in one line: SOURCE → EVIDENCE → CONFLICT → HUMAN REVIEW → DECISION → RETAINED RECORD.
3. **Evidence Spine (signature visual).** Full specification in §6. The one scroll-choreographed sequence on the page.
4. **Sectors.** Two panels, same visual grammar: Defense procurement (two systems, pilot and working-prototype maturity) and Regulated finance (one research experiment). Each panel closes with its boundary line (no endorsement claimed / not connected to any regulator).
5. **Portfolio.** Three uniform cards: TAS, EVALUATOR, ATTEST. Per card: one purpose sentence, primary user, three capabilities, maturity chip, link. Uniformity is the point: one family, one thesis.
6. **Trust Architecture.** Four tiles: local-first deployment, deterministic audit records, human-in-command decisions, public claims discipline. The fourth tile links /security and /evidence and states that every material claim on the site is registered and evidence-mapped. This is distinctive and true.
7. **Selected Proof.** Small receipts row using only homepage-approved claims: the registered-claims discipline itself, the published ATTEST demonstration hub (synthetic data, labeled), the TAS pilot status line. No test counts on the homepage (register A3 discipline). No agency names.
8. **Founder / Institutional CTA.** Founder strip (existing photo, one thesis quote from registered founder claims) plus contact panel.

### What leaves the homepage

| Current section | Disposition |
|---|---|
| WebGL hero exhibit (three.js) | Retired from homepage (D-004). Code archived, not deleted |
| Procurement clock | Moves to /defense (condensed) or retires if it fights the page. Sonnet proposes at W09 |
| Two Rooms (bidder vs issuer) | Concept absorbed by /defense sector page |
| Six-stage pipeline | Moves to /capabilities |
| TAS console video | Moves to /tas |
| Marquee bands | Retired site-wide. Decoration without meaning |
| Bundle trace | Moves to /tas |
| Bidability radar | Moves to /tas |
| Field evidence filmstrip | Moves to /tas (screenshots stay behind the sanitization rule) |
| Evidence matrix, audit chain | Concepts absorbed by Trust Architecture section and /security |
| Sovereignty, mission, figures, record | Absorbed by /company and Trust section |
| Tour chip | Retired on the new homepage. Revisit post-v2 if navigation data argues for it |

Nothing is deleted from git history; archived page files follow the existing `_archive` convention.

## 6. Signature visual: the Evidence Spine

Concept: **"The institutional evidence layer, alive."** One abstract field value (never real data) travels six stations:

1. SOURCE: a document plate arrives and is sealed (seal stamp, hash rule).
2. EVIDENCE: three thin independent traces extract the value (three-path language shared by ATTEST and EVALUATOR).
3. CONFLICT: the traces disagree; the chip flips to CONFLICTING; nothing is hidden or auto-resolved.
4. HUMAN REVIEW: a named-decision plate: reviewer line, stated reason, signature rule.
5. DECISION: the verdict chip resolves (the six-state vocabulary appears as small print).
6. RETAINED RECORD: a manifest card with a chain rule; the trail is permanent.

Below the spine, a sector instantiation strip: the same six stations labeled twice, "Tender bundle → bid decision" and "Source records → filed return". This is the argument that defense and finance are one company.

Rendering: inline SVG plus CSS, styled in the technical-cartography language (paper grain, ink lines, restrained brass for the seal and signature moments only). Desktop: one GSAP ScrollTrigger scrubbed timeline steps the stations. Mobile and reduced-motion: a static six-plate layout with numbered captions, designed first, not as a fallback afterthought. The static composition must be strong enough to ship alone; the scrub is an enhancement (Phase 4).

## 7. Design system evolution

Preserved: archival paper, warm ink, navy, restrained brass, Instrument Serif display, IBM Plex Sans/Mono, paper grain, plate and dossier components, controlled asymmetry, zero external origins, self-hosted fonts.

Evolved:
- A "company plate" register for corporate surfaces: more whitespace, larger serif display settings, fewer dossier stamps per viewport. Dossier density remains on product pages where it explains the product.
- Maturity chips become a first-class token: `pilot`, `working prototype`, `research prototype`, rendered identically everywhere (brass outline, mono label). One vocabulary, no synonyms.
- Navy sections are reserved for trust/audit content (current audit-chain treatment generalizes).
- No gradients-as-identity, no glassmorphism, no glowing cards, no stock imagery. Existing rule, restated as contract.

## 8. Motion philosophy

- Motion exists to explain state change. Nothing moves that does not carry meaning.
- Tier 1: the Evidence Spine scrub. The only scrubbed sequence on the homepage.
- Tier 2: section reveals, single fade/translate, 300-500ms, play once.
- Tier 3: hover/focus micro-states.
- Lenis stays for homepage scroll feel; disabled under prefers-reduced-motion together with all ScrollTrigger scrubs. Reduced motion is a first-class art direction (static plates), not a degraded mode.
- three.js ships on no v2 route (D-004). GSAP + ScrollTrigger + Lenis remain the entire motion stack.

## 9. Component boundaries and data architecture

New data module `src/data/company.ts`: `capabilities[]` (six spine-mapped territories), `sectors[]`, `portfolio[]` (id, name, purpose, primaryUser, capabilities[3], maturity enum, route), `spineStations[]`. All public strings referenced from publicClaims.ts ids after Phase 2; no free-typed claims in components.

New components under `src/components/home/`: `HeroCorporate.astro`, `EvidenceSpine.astro`, `SectorPanels.astro`, `PortfolioCards.astro`, `TrustStrip.astro`, `ProofRow.astro`. `CapabilityGrid.astro` lives beside them and is reused by /capabilities. Existing primitives (MotifFrame, DossierCard, SectionHead, buttons, RouteHero) are reused, not forked.

Motion: one `src/scripts/homeMotion.ts` controller owning GSAP/ScrollTrigger/Lenis init and the spine timeline; section components stay motion-free except data attributes. This resolves the audit's "scattered scroll handlers" risk.

index.astro becomes composition plus metadata only.

## 10. Product depth rules

Homepage: card only (§5.5). Sector pages: one paragraph plus card per product. Product pages keep depth but shed duplication:

- **/tas** (today 319 lines): keeps hero, capabilities, console video, bundle trace, radar, filmstrip, boundaries ("NOT" list), pilot status. Absorbs the workflow walkthrough as a condensed section.
- **/evaluator** (today 453 lines): keeps six-state model, convergence explanation, audit chain, committee-assist framing. Maturity line updated in Phase 2 within register discipline.
- **/attest**: new, ~200 lines, under §11 rules.

Reduce detail, not credibility: every removed block must either move to a route where it belongs or be listed in the W08/W09 handoff as consciously dropped.

## 11. ATTEST representation rules (binding)

May state: sealed sources; three independent extraction paths; supported / conflicting / unsupported evidence states; named-human resolution with stated reasons; retained evidence manifests; synthetic demonstration data; research-stage human-reviewed prototype; link to the public demonstration hub.

Must state (maturity transparency): research-stage prototype; synthetic data only; not connected to any regulator system; no customers, no pilots claimed.

Must never state or imply: commercial validation; deployment; regulator approval, endorsement, sandbox admission, or program acceptance; any DRR connection; autonomous filing; compliance determination; production readiness; accuracy on regulated records. The IFSCA enforcement-trend statistic stays OFF the site (unverified for publication). Regulator names appear only in neutral descriptive context if Phase 2 clears them; default is to avoid them entirely on v2 launch surfaces.

## 12. Trust architecture (/security expansion)

Four pillars: (1) local-first deployment and boundary zones (existing registered claims 15-17), (2) deterministic, append-only audit records, (3) human-in-command: recommendations, never autonomous authority, (4) public claims discipline: the register, the lint gate, and the "what we refuse to claim" list rendered as content. Existing SecurityBoundaryDiagram survives. The NOT-list pattern from tas.astro generalizes to a site-level boundary strip.

## 13. Performance budgets (homepage, cold load)

| Budget | Limit |
|---|---|
| HTML | ≤ 120 KB |
| CSS | ≤ 80 KB |
| JS total | ≤ 180 KB (GSAP 71K + ScrollTrigger ~50K + Lenis ~40K + site code ≤ 20K) |
| three.js | 0 (retired) |
| Above-the-fold images | ≤ 200 KB |
| Full page transfer | ≤ 900 KB |
| External origins | 0 (unchanged) |

Founder photo re-encoded to ≤ 150 KB at display size (mechanical job). Product screenshots stay on /tas with existing optimization pipeline. Budgets verified in Phase 5 with a deterministic check.

## 14. Accessibility constraints

- axe: zero violations on every route at 1440 and 390.
- Full keyboard operability for every interactive component; visible focus states in the brass/ink language.
- Contrast: ≥ 4.5:1 body text, ≥ 3:1 display text and UI chrome.
- Reduced motion: spine and all Tier 1/2 motion render as designed static compositions.
- Landmarks and heading order audited per route; single h1 per page.

## 15. Claims governance plan (Phase 2 scope)

1. Extend docs/PUBLIC_CLAIMS_REGISTER.md and publicClaims.ts with: company positioning set (§3), capability tiles (6), sector statements (2), portfolio card copy (3 products), full ATTEST set (from documented facts only), EVALUATOR maturity update, trust-pillar copy, proof-row copy.
2. Update claim `surface` fields for everything that moves routes.
3. Ambiguities pre-flagged for Fable adjudication: (a) EVALUATOR maturity wording (what "working prototype, demonstrated end-to-end" may say publicly without naming any agency or tender identifier), (b) whether any regulator name appears on /finance or /attest, (c) the exact maturity-chip vocabulary, (d) any new "first/only" adjacent phrasing (default: none).
4. Hard rules carried forward: no agency names beyond already-registered wording; no real tender identifiers anywhere; no stakeholder identities or roles beyond register-approved anonymized phrases; no percentages; the lint deny-list is untouched; the ratchet items A1-A6 remain locked.
5. The claims lint (`check-public-copy.mjs`) must pass on every work order. New pages are added to its scan surface automatically (it scans src/pages).

## 16. Work orders

Sequential unless marked parallel-safe. Every work order: implement, run `npm run check` + `npm run lint:copy` + build, visually inspect own work, write ≤700-word receipt to docs/v2-handoffs/ (untracked).

| WO | Scope | Worker |
|---|---|---|
| W01 | `company.ts`, navigation/routes v2, maturity-chip token, redirects in worker/index.ts | Sonnet |
| W02 | Header/Footer v2 (new nav, footer groups) | Sonnet |
| W03 | Homepage scaffold: decompose index.astro, HeroCorporate, Evidence Thesis section | Sonnet |
| W04 | EvidenceSpine static SVG composition (desktop + mobile + reduced-motion states) | Sonnet |
| W05 | SectorPanels + CapabilityGrid + /capabilities page | Sonnet |
| W06 | PortfolioCards + TrustStrip + ProofRow, homepage assembly complete | Sonnet |
| W07 | /company + /evidence pages (absorb validation), /security expansion | Sonnet |
| W08 | /tas simplification (absorb workflow), /evaluator simplification | Sonnet |
| W09 | /defense + /finance sector pages | Sonnet |
| W10 | /attest page under §11 rules | Sonnet |
| W11 | SEO: titles/descriptions/OG/JSON-LD for all routes, sitemap, founder-photo re-encode, asset sweep | Sonnet + Haiku mechanical |
| W12 | Phase 4: spine scroll choreography + Tier 2 reveals + Lenis integration + reduced-motion wiring | Sonnet (xhigh) |

Phase 2 (claims) runs before W03 so copy lands registered. W01/W02 may proceed in parallel with Phase 2.

## 17. Quality gates

Gate 1 after W11 (static site coherent). Gate 2 after W12 (motion). Phase 5 QA matrix (existing `qa:stage7` plus budget checks). Phase 6 independent clean-context review. Gate 3 final: release candidate only, no deploy.

## 18A. Motion architecture (Phase 4 specification, locked 2026-08-13)

Approved by the control plane under D-004 and D-008. W12 implements exactly this.

1. **WebGL: none.** No three.js on any route (D-004 stands after Gate 1: the static spine communicates the thesis; depth would decorate, not explain).
2. **Tier 1, the only scrubbed sequence.** Homepage EvidenceSpine, desktop ≥1024px, fine pointer, motion-allowed only. ScrollTrigger pins the section for roughly 1.5 viewport-heights and scrubs one GSAP timeline: stations activate in order (plate lifts 8px to rest, connector draws via stroke-dashoffset, the traveling field chip advances along the spine), the CONFLICT chip flips at station 3, the signature rule draws at station 4, the chain rule stamps at station 6. No other pins anywhere on the site.
3. **Tier 2 reveals.** Section headers and card grids: one-time 300-450ms fade/translate on first entry. Implementation rule (codified from the ledger): the from-state (opacity 0, translate) is applied by JavaScript immediately before animating, never in static CSS. With JS absent or reduced motion set, no from-state ever exists. The v8 `.reveal` static-CSS pattern is forbidden.
4. **Lenis.** Homepage only, desktop only, motion-allowed only. Duration ~1.1. Anchor navigation must not be hijacked.
5. **Gating and loading.** One controller, `src/scripts/homeMotion.ts`, loaded deferred on the homepage only after a `matchMedia` gate (prefers-reduced-motion: no-preference AND min-width 1024px) evaluated BEFORE injecting vendor scripts. Reduced-motion visitors download zero motion bytes. Motion JS budget ≤ 170 KB total (gsap + ScrollTrigger + lenis + controller). Other pages may share a tiny reveal util with the same gates; no vendor GSAP off-homepage unless already loaded.
6. **Mobile.** Below 1024px: no pin, no scrub, Tier 2 reveals only; the static vertical spine stands as designed.
7. **Failure behavior.** Any motion-script error leaves the page fully readable (guaranteed by static-first; motion only ever adds).
8. **QA hooks (W12 deliverables).** (a) Update tests/motion.spec.ts for the new timeline: final spine state reached after full scroll; (b) new deterministic static-visibility check: a JS-disabled Playwright pass asserting every section root computes opacity 1 on all 13 routes, wired as `npm run qa:static` and included in qa:stage7; (c) reduced-motion context asserts zero motion-script requests.

## 18B. Gate 1 outcome (2026-08-13)

Verdict: PASS with one bounded correction batch (1 BLOCKER, 5 MAJOR, 4 MINOR, 1 OPTIONAL), issued to a Sonnet worker. Homepage cold transfer measured 223.5 KB with zero external JS against the 900 KB budget. Quality-bar tests met: company clarity, hierarchy inversion (company > products), sector coherence, ATTEST maturity transparency, identity continuity.

## 18. Sensitive-material firewall (binding on all workers)

- docs/v2-handoffs/ is gitignored. Worker receipts, internal facts, and baseline screenshots live there and are never committed. The repository is public.
- No real tender identifiers, no stakeholder names or identifying roles, no internal infrastructure details, no unreleased program details in any tracked file or public surface.
- Product screenshots on public surfaces carry the existing "Repo-owned capture · seeded demo data" label and the A6 sanitization review stands before any deploy.

## 18C. Gate 3 outcome and release candidate (2026-08-16)

RELEASE CANDIDATE APPROVED at commit 312eb3e on site/v9-corporate. Independent review produced 1 BLOCKER (V6Layout nav fork, fixed at shared-component level) and 3 MAJOR findings (2 fixed, 1 rejected with rationale in D register). Final suite: check 0 errors, lint:css clean, qa clean, qa:static 13/13, qa:motion 17/17, qa:a11y 13/13, visual 15/15, responsive 130/130. Hidden-content defect class closed permanently by D-013 (transform-only reveals). Full-page desktop captures show a dark band at the spine pin-spacer position; this is a stitched-capture artifact of ScrollTrigger pinning, not user-facing (mobile capture continuous; scrub stills show the pinned spine in that segment). NOT DEPLOYED. Deploy is founder-only, after the A6 sensitive-screenshot review and one human live-scroll pass of the spine.
