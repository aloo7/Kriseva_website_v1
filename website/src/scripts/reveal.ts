// reveal.ts
//
// Shared Tier 2 reveal util (CORPORATE_SITE_V2_ARCHITECTURE.md §18A item 3).
// A one-time, transform-only settle for section headers and card grids, on
// first scroll entry. No GSAP dependency: plain IntersectionObserver plus
// inline styles, so it can run on any viewport width (mobile included, per
// §18A item 6) without paying for the desktop-only vendor bundle.
//
// D-013 (control-plane decision, docs/CORPORATE_SITE_V2_DECISIONS.md,
// 2026-08-16): Tier 2 reveals are TRANSFORM-ONLY. No opacity from-state on
// any code path, ever. Two prior attempts — a plain opacity fade, then that
// same fade backed by three fail-open backstops (viewport-bounds check,
// "reached bottom" rule, hard timeout) — both still produced a JS-on capture
// with sections rendered as blank bands, because the assertions and the
// screenshot were running down different code paths and opacity was, in
// both versions, a state this file could put an element into. The backstops
// are deleted along with the opacity write they existed to recover from: a
// state that cannot exist needs no recovery path.
//
// The only effect left is a 12px translateY settle. The from-state (the
// displaced position) is still written by JavaScript immediately before
// observing, never in static CSS — same hard rule as before, just narrower
// now that opacity isn't part of it. With JS absent, under
// prefers-reduced-motion, or if IntersectionObserver simply never fires for
// a given element, the worst case is a permanent 12px vertical offset:
// content sits slightly off its final resting position, fully opaque and
// fully readable. That is cosmetic, not a defect, and needs no backstop.
//
// Wired on the homepage only for now (index.astro); the export surface here
// is generic so a later page can call initReveal() with its own selectors
// without touching this file.

export interface RevealOptions {
  /** CSS selectors (evaluated against `root`) for elements to settle. */
  selectors: string[];
  /** Settle duration in ms. Architecture range: 300-450ms. */
  duration?: number;
  /** Starting translateY offset in px (D-013: 12px), animates to 0. */
  distance?: number;
  /** IntersectionObserver threshold. */
  threshold?: number;
  /** Root to query selectors against. Defaults to document. */
  root?: ParentNode;
}

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
// Marker attribute for QA (tests/motion.spec.ts): every element this module
// touches carries data-reveal, "pending" until settled, "shown" after. Purely
// a state-tracking hook — it carries no visibility meaning, since opacity is
// never written here on any path.
const MARK_ATTR = 'data-reveal';

function clearInlineMotionStyles(el: HTMLElement): void {
  el.style.removeProperty('transform');
  el.style.removeProperty('transition');
  el.style.removeProperty('will-change');
  el.removeAttribute(MARK_ATTR);
}

/**
 * Settle a set of elements once, on first scroll entry. Transform-only: this
 * function never writes `opacity`, on any path, so every targeted element is
 * fully visible and readable from first paint regardless of whether
 * IntersectionObserver ever fires for it. Safe to call multiple times with
 * different selector sets (e.g. once per page).
 */
export function initReveal(options: RevealOptions): void {
  const root = options.root ?? document;
  let touched: HTMLElement[] = [];

  try {
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

    const seen = new Set<HTMLElement>();
    for (const selector of options.selectors) {
      root.querySelectorAll<HTMLElement>(selector).forEach((el) => seen.add(el));
    }
    const els = Array.from(seen);
    if (els.length === 0) return;

    // No IntersectionObserver: skip the settle entirely rather than leave a
    // permanent, unanimated offset with no way to clear it. This is a
    // tidiness choice, not a visibility guard — either way every element
    // stays at opacity 1.
    if (!('IntersectionObserver' in window)) return;

    const duration = options.duration ?? 380;
    const distance = options.distance ?? 12;
    const threshold = options.threshold ?? 0.12;

    els.forEach((el) => {
      el.style.transform = `translateY(${distance}px)`;
      el.style.transition = `transform ${duration}ms ${EASE}`;
      el.style.willChange = 'transform';
      el.setAttribute(MARK_ATTR, 'pending');
    });
    touched = els;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          requestAnimationFrame(() => {
            el.style.transform = 'none';
            el.setAttribute(MARK_ATTR, 'shown');
          });
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((el) => io.observe(el));
  } catch {
    // Fail open: clear any in-flight transform/transition so nothing is left
    // mid-tween. Note this is tidiness, not a visibility guard — every
    // element touched above was, and remains, at opacity 1 throughout.
    touched.forEach(clearInlineMotionStyles);
  }
}

// Homepage Tier 2 targets (architecture §18A item 3: "section headers and
// card grids"). Selectors reference existing, stable classes already shipped
// by W03/W05/W06 (HeroCorporate, EvidenceThesis, SectorPanels,
// PortfolioCards, TrustStrip, ProofRow) — no edits to those component files
// were needed or made. HeroCorporate is deliberately excluded (it is the LCP
// element and is already visible at first paint; settling it costs LCP for
// no benefit). EvidenceSpine is deliberately excluded (D-008 / §18A item 6:
// the spine is either the Tier 1 scrub, on qualifying desktop, or "the
// static vertical spine stands as designed" everywhere else — it never gets
// a Tier 2 treatment).
export const HOMEPAGE_REVEAL_SELECTORS: string[] = [
  '.evidence-thesis__lede',
  '.evidence-thesis__vocab',
  '.sector-panels__head',
  '.sector-panels__grid > .sector-panel',
  '.portfolio-cards__head',
  '.portfolio-cards__grid > .portfolio-card',
  '.trust-strip__head',
  '.trust-strip__grid > .trust-tile',
  '.proof-row__eyebrow',
  '.proof-row__grid > .proof-item',
];

export function initHomepageReveal(): void {
  initReveal({ selectors: HOMEPAGE_REVEAL_SELECTORS });
}
