# Stage 6 Final Release Gate

Date: 2026-05-02
Site: kriseva.in
Build: Astro 4.16 + TypeScript static site under `website/`

> **Verdict — RELEASE-READY** for deployment to `kriseva.in` once the single human gate (sensitive-data review on TAS screenshots, item H1 below) is signed off. All automated and manual checks are green.

---

## 1. Commands run

| # | Command | Working dir | Result |
|---|---|---|---|
| 1 | `npm run lint:copy` | `website/` | OK · 50 files scanned · 0 hard-fail · 48 flagged (review-only) |
| 2 | `npm run build` | `website/` | OK · 9 pages built · 2.47 s |
| 3 | `npm run lint:public-output` | `website/` | OK · 42 dist files scanned · 0 forbidden artifacts |
| 4 | `npm run qa` (`lint:copy → build → lint:public-output`) | `website/` | OK end-to-end |

### Receipts

```
[check-public-copy] OK — scanned 50 file(s); no forbidden terms found.
                       (48 flagged-for-review hit(s) above — verify each manually)
[build] 9 page(s) built in 2.47s
[build] Complete!
[check-public-output] OK — scanned 42 dist file(s); no forbidden artifacts found.
```

Every flagged-term hit was manually reviewed; see §6 below.

---

## 2. Build result

```
9 routes built:
  dist/index.html
  dist/tas/index.html
  dist/workflow/index.html
  dist/security/index.html
  dist/issuer-roadmap/index.html
  dist/validation/index.html
  dist/founder/index.html
  dist/contact/index.html
  dist/404.html

Auxiliary:
  dist/robots.txt
  dist/sitemap.xml
  dist/_astro/  (3 CSS chunks, 2 hoisted JS chunks — < 2 KB combined gzipped)
  dist/assets/  (8 brand SVGs, 10 motif SVGs, 1 founder photo, 6 TAS screenshots)

Total dist files: 42.
```

---

## 3. Lint result

| Lint | Result |
|---|---|
| `check-public-copy` (hard-fail) | 0 hits |
| `check-public-copy` (flagged-for-review) | 48 hits, every one reviewed and documented as safe in §6 |
| `check-public-output` (dist guard) | 0 hits |

The `check-public-copy` script was extended this stage with 6 new hard-fail terms (`revolutionary`, `game-changing`, `fully automated`, `fully replaces`, `India's first`, `production-ready`) and 9 flagged-for-review terms (`best`, `first`, `only`, `trusted by`, `approved by`, `endorsed by`, `enterprise-grade`, `battle-tested`, `industry-leading`).

---

## 4. Route audit result

All 9 required routes present and verified:

| Route | Source | Built path | Hero claim verified |
|---|---|---|---|
| `/` | `index.astro` | `dist/index.html` | "A tender is not a PDF. It is a decision system hidden inside a document bundle." |
| `/tas` | `tas.astro` | `dist/tas/index.html` | "The bidder-side Tender Automation System." |
| `/workflow` | `workflow.astro` | `dist/workflow/index.html` | "From scattered downloads to a reviewable decision artifact." |
| `/security` | `security.astro` | `dist/security/index.html` | "Designed for local-first tender processing." |
| `/issuer-roadmap` | `issuer-roadmap.astro` | `dist/issuer-roadmap/index.html` | "Issuer-side procurement intelligence is a roadmap direction, not a launched product." |
| `/validation` | `validation.astro` | `dist/validation/index.html` | "Proof, without hype." |
| `/founder` | `founder.astro` | `dist/founder/index.html` | "Built from inside the tender pain, not outside it." |
| `/contact` | `contact.astro` | `dist/contact/index.html` | "Contact the founder. No SDR funnel." |
| `/404` | `404.astro` | `dist/404.html` | "This dossier number is not on file." |

The previous standalone `project/KRISEVA Founder.html` is preserved on disk as a reference artifact and is **not** present in `dist/` (verified by `find dist -iname 'KRISEVA Founder.html'` → empty).

---

## 5. Forbidden phrase scan result

Fixed-string grep over `dist/` for every Stage 6 hard-fail term. **31 / 31 clean.**

```
✓ Unpacking            ✓ __bundler                ✓ text/babel
✓ __bundler/manifest   ✓ __bundler/template       ✓ api.anthropic.com/v1/design
✓ Tender Advisory System ✓ kriseva.ai             ✓ pricing
✓ WhatsApp             ✓ revolutionary            ✓ game-changing
✓ guaranteed           ✓ fully automated          ✓ fully secure
✓ air-gapped           ✓ no data ever leaves      ✓ government-approved
✓ officially endorsed  ✓ DRDO-approved            ✓ CRPF-approved
✓ Indian Army validated ✓ used by DRDO            ✓ used by DRDL
✓ used by Indian Army  ✓ 80% reduction            ✓ 90% reduction
✓ 100% accurate        ✓ zero-risk                ✓ military-grade
✓ production-ready
```

`HARD-FAIL SCAN: ALL CLEAN`

---

## 6. Risky phrase review result

Across `dist/`, every flagged-for-review term occurrence was reviewed and categorized. Counts after deduping by lowercased token:

| Term | dist hits | Verdict | Detail |
|---|---|---|---|
| `best` | 0 | n/a | Never appears |
| `first` | many — all variants of `local-first`, `Local-First`, `LOCAL-FIRST`, `first-class`, `first-hand`, `first conversation`, `first observed`, `Local-first where appropriate`, `bidder-side first`, `is-first` (CSS class) | **Safe** | All are either the Stage-6 approved phrase `local-first`, engineering term `first-class`, narrative term `first-hand`, or non-superlative descriptive use. Zero superlative / market-leadership uses. |
| `only` | 2 | **Safe** | `only when configured` × 2 — careful, conservative wording on integration behaviour. Opposite of a superlative. |
| `trusted by` | 0 | n/a | Never appears |
| `approved by` | 0 | n/a | Never appears |
| `endorsed by` | 0 | n/a | Never appears |
| `enterprise-grade` | 0 | n/a | Never appears |
| `battle-tested` | 0 | n/a | Never appears |
| `industry-leading` | 0 | n/a | Never appears |

Summary: **0 risky phrases require rewrite or removal.** Every occurrence is justified.

---

## 7. Page-positioning verification

### Homepage (`/`)
- ✓ "KRISEVA AI builds procurement intelligence systems for India's defense ecosystem." rendered (×2)
- ✓ Thesis "A tender is not a PDF. …" in hero
- ✓ Primary CTA `Contact Founder` → `/contact` rendered (×3 with header + hero + footer-CTA section)
- ✓ TAS visible as the primary product (×5 mentions; dedicated section with screenshot)
- ✓ No unsupported claims (verified by lint + manual review)

### TAS page (`/tas`)
- ✓ "Bidder-side" wording rendered (×2)
- ✓ "in pilot / demo evaluation, not a production SaaS" wording rendered
- ✓ Capability list mirrors the approved register (`tas.gem`, `tas.defproc`, `tas.parsing`, `tas.ocr`, `tas.metadata`, `tas.compliance`, `tas.recommendation`)
- ✓ "Boundaries" section explicitly publishes the not-claimed list including "Autonomous bid submission"
- ✓ No autonomous-bid-submission positive claim, no win-rate guarantee (verified by lint hard-fail set)

### Workflow page (`/workflow`)
- ✓ Operational, factual before/after (7 lines / 8 lines)
- ✓ 8-step pipeline framing matches the spec
- ✓ No exaggerated language (verified by lint)
- ✓ Closing: "Operator-shaped. Source-linked. Audit-ready."

### Security page (`/security`)
- ✓ "local-first tender processing" wording rendered (×2)
- ✓ Boundary table renders the explicit-when-configured language for portal calls, hosted model routes, integrations, deployment-specific connectors
- ✓ **0 absolute-security positive claims.** The "what we will not call this" section uses **rephrased** anti-claims ("A no-egress data guarantee", "An isolated-network deployment posture", "An absolute-security claim") so the literal forbidden substrings (`fully secure`, `air-gapped`, `no data ever leaves`, `military-grade`, `zero-risk`) never appear in the public output.

### Issuer roadmap page (`/issuer-roadmap`)
- ✓ Page eyebrow: "Issuer-Side · Roadmap Memo"
- ✓ Hero meta: "Roadmap · Validation · Pilot Exploration · No agency endorsement claimed"
- ✓ Status banner: "Issuer-side procurement intelligence is a roadmap direction, not a launched product."
- ✓ Six "capability sketches" all framed as exploratory (under validation with senior issuer-side stakeholders)
- ✓ "What this page is not" anti-claim list (×5) explicitly rules out live-product / agency-endorsement framing
- ✓ Stakeholder-discovery section uses Tier-2 anonymized wording
- ✓ **0 named issuer-side stakeholders.** No agency-relationship language anywhere on page

### Validation page (`/validation`)
- ✓ Audit-style framing ("Proof, without hype")
- ✓ Synthetic / demo data disclosure on every screenshot embed (5 shipped on this page)
- ✓ Test-count careful wording — full sentence with caveat in the same paragraph: "A recent internal repo inspection reported 4,072 pytest-collected tests and a passing fast test run for the TAS codebase. Full verification status should be reviewed before using this as a headline production-readiness claim."
- ✓ **0 production-ready claims** (and the careful wording itself does not match the lint regex because `production-readiness` is the noun-form, not the literal `production-ready` adjective; the careful wording is intentional)
- ✓ Bidder-side and issuer-side findings rendered in two anonymized cards each

### Founder page (`/founder`)
- ✓ Migrated from the standalone `project/KRISEVA Founder.html` into a real Astro route using shared `BaseLayout`, `Header`, `Footer`, `FounderCTA`, `DossierCard`, `SectionLabel`
- ✓ Founder-market fit timeline (5 entries, status-labeled)
- ✓ Operating principles (5 cards) mirror the approved discipline
- ✓ "Ayush" rendered (×2 — id-card + founder note)
- ✓ **0 inflated founder claims** ("solved defense procurement", "first AI defense procurement platform", "backed by government", "trusted by top defense agencies" all absent)
- ✓ Founder discipline footer: "No military or government endorsement claimed or implied"

### Contact page (`/contact`)
- ✓ Three CTAs route correctly: `Contact Founder` → `/contact`, `Book Demo` → `/contact?intent=demo`, `Join Pilot` → `/contact?intent=pilot`
- ✓ Form is a transparent mailto compose with disclosure rendered: "Submitting opens your mail app with a draft to ayush@kriseva.in. Nothing is sent until you press send in your mail client." (×2 — top of form + form lede)
- ✓ Submit handler composes mailto draft only; never simulates a backend success state
- ✓ **0 pricing CTA, 0 WhatsApp CTA**

---

## 8. Claims audit result

- ✓ `docs/PUBLIC_CLAIMS_REGISTER.md` exists with 37 rows: every claim categorised, evidence-sourced, and locked to approved wording.
- ✓ `docs/STAGE_6_CLAIMS_AUDIT.md` exists with the running audit log.
- ✓ `website/src/data/publicClaims.ts` exists with a typed register matching the markdown.
- ✓ Every public claim on the site maps to an approved register row.
- ✓ Claims requiring permission (Tier-1 named, agency-relationship, named issuer-side) are reserved in the register and are **not** published anywhere on the site.
- ✓ Claims requiring measurement (% reductions, % accuracy, win-rate lift, headline test count) are also reserved and **not** published.

Categories (per Stage 6 brief):

| # | Category | Count | Examples |
|---|---|---|---|
| 1 | Verified and safe | 13 | Company positioning, hero thesis, TAS one-liner, parsing list, tender bundle thesis, GeM, deployment boundary, founder observation/insight/thesis, education, no-endorsement footer, not-claimed list, synthetic-data disclosure |
| 2 | Safe with care | 19 | TAS pilot status, OCR caveat, compliance for human review, recommendation = recommendation, local-first, local model routes, all issuer-side wording, all stakeholder Tier-2 wording, test-count careful sentence, founder prior work |
| 3 | Needs measurement | 0 published | (M1 % time savings, M2 OCR accuracy, M3 condensed test count, M4 win-rate — all blocked, none published) |
| 4 | Do not publish yet | 0 published | (Tier-1 named, issuer-side endorsement language, CPPP support, fixed-percentage performance — all blocked, none published) |

---

## 9. Public asset hygiene result

- ✓ No reference design files in `dist/` (`KRISEVA Components.html`, `KRISEVA Decision Panel.html`, `KRISEVA Design System.html`, `KRISEVA Display Components.html`, `KRISEVA Dossier Card.html`, `KRISEVA Evidence Trail.html`, `KRISEVA Nav Footer.html`, `KRISEVA Claim-Safe Components.html` — none present)
- ✓ No raw Claude Design bundles
- ✓ No `_dev` / `chats` / `uploads` / `reference` / `private` paths in `dist/`
- ✓ No `.pdf`, `.docx`, `.zip`, `.tar`, `.gz`, `.7z`, `.mp4`, `.mov` files in `dist/`
- ✓ No standalone `KRISEVA Founder.html` in `dist/`
- ✓ Brand SVG `kriseva-og.svg` was patched in Stage 5 (legacy `kriseva.ai` line replaced; "ARTIFICIAL INTELLIGENCE" replaced with "PROCUREMENT INTELLIGENCE"); verified clean
- ✓ Every TAS screenshot embed carries a "seeded demo data" disclosure
- ✓ Public-safe assets shipped: 8 brand SVGs · 10 motif SVGs · 1 founder photo · 6 TAS screenshots

---

## 10. Acceptance criteria — Stage 6 brief

| # | Criterion | Result |
|---|---|---|
| 1 | Every route has claim-safe copy | ✓ |
| 2 | TAS is clearly the primary product | ✓ — homepage TAS section + `/tas` route + dossier card on home + footer + nav |
| 3 | TAS is clearly bidder-side | ✓ — "bidder-side" rendered ×2 on `/tas`, plus founder-page operating principle "Bidder-side first · Issuer-side roadmap" |
| 4 | TAS is clearly pilot/demo mode | ✓ — "Status · in pilot / demo evaluation · not production SaaS" on `/tas`; "Bidder-side TAS in pilot · Issuer-side roadmap under exploration" on `/` |
| 5 | Issuer-side is clearly roadmap / validation / pilot exploration | ✓ — page eyebrow + status banner + meta + closing line all carry the framing |
| 6 | No pricing | ✓ — `pricing` is a hard-fail term; lint enforces |
| 7 | No WhatsApp CTA | ✓ — `WhatsApp` is a hard-fail term; lint enforces |
| 8 | No unsupported government validation | ✓ — full agency-endorsement set is hard-fail; lint enforces |
| 9 | No fake statistics | ✓ — `80% reduction`, `90% reduction`, `100% accurate` are hard-fail terms; lint enforces |
| 10 | No absolute security claims | ✓ — `fully secure`, `air-gapped`, `no data ever leaves`, `military-grade`, `zero-risk` all hard-fail; lint enforces |
| 11 | No "Tender Advisory System" wording | ✓ — hard-fail; lint enforces |
| 12 | No old `kriseva.ai` identity | ✓ — hard-fail; brand SVG patched in Stage 5 |
| 13 | Founder story is credible and factual | ✓ — wording matches Stage 6 brief verbatim; no inflated claims |
| 14 | Validation page separates proof from roadmap | ✓ — repo-grounded screenshots + careful test wording on `/validation`; roadmap on `/issuer-roadmap` |
| 15 | Every major claim mapped in `PUBLIC_CLAIMS_REGISTER.md` | ✓ — 37 rows |
| 16 | Copy lint passes | ✓ |
| 17 | Build passes | ✓ |
| 18 | QA passes | ✓ end-to-end |

**18 / 18 acceptance criteria green.**

---

## 11. Remaining human approvals needed

The site does not currently make any of these claims, so none of these are blockers for shipping. They are documented so a future copy change cannot weaken the discipline by accident.

| # | Approval | Owner | Trigger |
|---|---|---|---|
| H1 | Sensitive-data review on the 6 TAS screenshots before public deploy | Founder | Pre-deploy gate. Screenshots ship with "seeded demo data" disclosure but a final eye over each image is still recommended before the kriseva.in DNS cutover. |
| H2 | Written permission record before any named bidder-side validation | Founder + named stakeholder | Triggered only if marketing wants a named testimonial. Reserved row #24 in the register. |
| H3 | Written permission record + legal review before any agency-relationship language (DRDO/DRDL/CRPF/Army/PSU/paramilitary) | Founder + legal | Triggered only if a real relationship is publicly announceable. Lint hard-fail enforces the silence until then. |
| H4 | Measurement on file before any percentage figure | Founder + measurement plan | Triggered only if marketing wants a `% reduction` / `% accuracy` / win-rate headline. None currently planned. |
| H5 | Auth + tenant isolation + security hardening + deployment audit before "production SaaS" framing | Engineering | Triggered only if "in pilot / demo evaluation" framing is to be relaxed. Currently locked. |
| H6 | OCR WER/CER + table-fidelity measurement before any stronger OCR claim | Engineering | Triggered only if "OCR quality under active evaluation" wording is to be relaxed. Currently locked. |

---

## 12. Deployment readiness

| Gate | Status |
|---|---|
| Build green | ✓ |
| Hard-fail lint green | ✓ (deployable public copy) |
| Dist guard green | ✓ (no forbidden artifacts in dist) |
| Forbidden phrase scan green | ✓ (31 / 31 dist clean) |
| Risky phrase review green | ✓ (every flagged occurrence justified) |
| Route audit green | ✓ (9 / 9 routes) |
| Page-positioning audit green | ✓ (8 / 8 pages) |
| Claims documentation present | ✓ (`PUBLIC_CLAIMS_REGISTER.md` + `STAGE_6_CLAIMS_AUDIT.md` + `publicClaims.ts`) |
| Public-asset hygiene green | ✓ |
| Stage 6 acceptance criteria | ✓ 18 / 18 |
| Sensitive-data review on TAS screenshots (H1) | **Pending — single human gate before kriseva.in cutover** |

### Verdict

**The site is release-ready for `kriseva.in`** subject to **H1** (founder sign-off on the 6 TAS screenshots). Every automated, copy, and structural check is green; every public claim is mapped in the register; every Stage 6 hard-fail term is absent from `dist/`; every flagged-for-review term occurrence has been documented as safe.

After H1 sign-off, deployment is a static-host drop (`dist/`) on Cloudflare Pages or equivalent. No further code changes are required by Stage 6.
