# CORPORATE SITE V2 DECISION REGISTER

Consequential decisions only. Format per control-plane protocol.

---

D-001
Question: What is KRISEVA's company-level positioning on the public site?
Decision: "KRISEVA AI builds evidence-first AI systems for high-stakes institutional decisions", with hero headline "The evidence layer for high-stakes institutional decisions."
Reason: Capability-true across all three systems, sector-agnostic, institutional in tone, and makes TAS/EVALUATOR/ATTEST applications of one thesis rather than three businesses. Makes only capability claims, so it survives claim governance.
Evidence: docs/CORPORATE_SITE_V2_AUDIT.md; docs/v2-handoffs/ATTEST_EVALUATOR_FACTS.md (untracked); existing register claims 1-2.
Alternatives rejected: Keeping defense-only positioning (blocks ATTEST, keeps company = TAS); "deterministic, auditable procurement AI" as headline (excludes finance); slogan-first options ("AI that shows its work": generic).
Reversal condition: Founder rejects wording at Gate 1, or Phase 2 audit finds an unsupportable element.

D-002
Question: What is the v2 sitemap and what happens to existing routes?
Decision: 12 routes. New: /company, /capabilities, /defense, /finance, /attest, /evidence. Kept: /, /tas, /evaluator, /security, /founder, /contact. Retired with 301s in worker/index.ts: /workflow → /capabilities, /validation → /evidence, /issuer-roadmap → /evaluator. Header nav: Company · Capabilities · Defense · Finance · Evidence · Founder · [Contact].
Reason: Sector pages are the institutional entry points; products move one click deep, which is the structural statement that the company is larger than TAS. Redirects preserve external link equity.
Evidence: Route map in audit §4; nav in src/data/navigation.ts.
Alternatives rejected: Single /sectors page (blurs two very different maturity stories); products in header nav (recreates product-first hierarchy); renaming /security to /trust (loses URL equity and institutional vocabulary).
Reversal condition: Gate 1 shows nav overload or sector pages too thin to stand alone.

D-003
Question: What is the signature visual?
Decision: The Evidence Spine: one abstract field value traveling SOURCE → EVIDENCE → CONFLICT → HUMAN REVIEW → DECISION → RETAINED RECORD, rendered as inline SVG in the technical-cartography language, with a sector instantiation strip showing the same spine labeled for tenders and for regulated filings.
Reason: It is the company thesis drawn once: explains all three products, justifies the two-sector portfolio, works static-first, and extends the existing dossier DNA ("the institutional evidence layer, alive").
Evidence: Shared evidence-state vocabulary documented for ATTEST and EVALUATOR in the facts registry; six-state model; three-path convergence.
Alternatives rejected: Lineage graph/topology (reads as generic data-viz); document-to-decision 3D transformation (3D adds no explanation; cost and mobile risk).
Reversal condition: Gate 1/2 finds the static or scrubbed composition fails to communicate within one viewport-height of attention.

D-004
Question: Does three.js/WebGL survive on v2?
Decision: Retired from all v2 routes. Motion stack is GSAP + ScrollTrigger + Lenis only. HeroExhibit code archived, not deleted.
Reason: The v2 signature visual is 2D lineage; 3D would decorate, not explain. Removes 589 KB conditional JS, simplifies mobile and reduced-motion, and cuts the largest maintenance risk in the motion stack.
Evidence: Audit §8-9; design rule "no 3D without explanatory purpose".
Alternatives rejected: Upgrading three.js r128 (no blocked requirement exists); keeping the exhibit on /tas (product pages carry screenshots and video, which explain more per KB).
Reversal condition: Gate 2 judges the hero or spine flat AND a specific 3D treatment is articulated that explains something 2D cannot.

D-005
Question: How is ATTEST represented publicly?
Decision: Full page at /attest plus finance sector framing, under binding rules (architecture §11): research-stage human-reviewed prototype, synthetic data, not connected to any regulator, no customers or pilots claimed. IFSCA enforcement statistic excluded from the site. Regulator names avoided on launch surfaces by default.
Reason: Maturity transparency is the brand. The published demonstration hub and evidence-state workflow are genuinely strong without a single overclaim.
Evidence: ATTEST facts registry (untracked); attest_boundary in program brief; register ratchet discipline.
Alternatives rejected: ATTEST as a one-line lab note (undersells a real, published artifact); regulator-forward framing (unverifiable and ratchet-hostile).
Reversal condition: Founder provides written evidence that changes maturity state (e.g. sandbox admission on record).

D-006
Question: How much product detail appears on the homepage?
Decision: Card only per product: one purpose sentence, primary user, three capabilities, maturity chip, link. All demos, videos, radars, filmstrips, and walkthroughs move to product routes. Homepage shrinks from 18 sections to 8.
Reason: The homepage's job is company comprehension in one pass, not product documentation. Product depth remains one click away.
Evidence: Audit §14 (2,455-line homepage, 18 sections).
Alternatives rejected: Progressive-disclosure accordions on the homepage (hidden content is unread content and inflates the file again).
Reversal condition: Gate 1 finds the homepage too thin to establish credibility.

D-007
Question: Where do worker receipts and sensitive internal facts live?
Decision: docs/v2-handoffs/ is gitignored and never committed. The repository is public. No real tender identifiers, stakeholder identities/roles, or internal infrastructure details in any tracked file.
Reason: The facts registry necessarily references internal validation material that must not be published, and the repo is public.
Evidence: `gh repo view` visibility PUBLIC; .gitignore line 36.
Alternatives rejected: Committing sanitized receipts (residual risk, no benefit); a private mirror repo (process overhead).
Reversal condition: Repo goes private AND founder asks for tracked receipts.

D-008
Question: What is the motion philosophy?
Decision: Motion explains state change only. One scrubbed sequence per page maximum (homepage: the spine). Tier 2 single-play reveals, Tier 3 micro-states. Marquees retired site-wide. Reduced motion is a designed static art direction, implemented first.
Reason: Institutional credibility reads through restraint; scrubbed choreography is reserved for the one visual that carries the thesis.
Evidence: Audit §8 motion-orchestration risk; design DNA brief.
Alternatives rejected: Preserving all v8 choreography (product-site pacing on a corporate page); zero motion (loses the "dossier, alive" identity).
Reversal condition: Gate 2.

D-009
Question: Performance and accessibility budgets?
Decision: Homepage cold load: HTML ≤ 120 KB, CSS ≤ 80 KB, JS ≤ 180 KB, above-fold images ≤ 200 KB, total ≤ 900 KB, zero external origins. axe-clean on every route at 1440 and 390. Founder photo re-encoded ≤ 150 KB.
Reason: Budgets make "performance does not materially regress" testable in Phase 5 instead of aspirational.
Evidence: Audit §9 (6.7 MB public dir, 1.6 MB founder photo, 589 KB three.js).
Alternatives rejected: No numeric budgets (unenforceable).
Reversal condition: A Gate finding that a budget blocks a justified design element; adjust by decision, not silently.

D-010
Question: Does claim governance extend or get rebuilt?
Decision: Extend. publicClaims.ts and the register gain company/sector/ATTEST/EVALUATOR-maturity claim groups before homepage copy is implemented (Phase 2 precedes W03). Lint deny-list untouched. Ratchet items A1-A6 remain locked. New public strings in components must reference claim ids.
Reason: The governance system is the site's most credible institutional asset and v2's trust story cites it as content.
Evidence: Register; publicClaims.ts structure (audit §7).
Alternatives rejected: Parallel v2 claims file (two sources of truth); loosening the deny-list for marketing reach (violates public-trust priority).
Reversal condition: None foreseen.
