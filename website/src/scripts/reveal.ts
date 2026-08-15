// reveal.ts
//
// Shared Tier 2 reveal util (CORPORATE_SITE_V2_ARCHITECTURE.md §18A item 3).
// One-time 300-450ms fade/translate for section headers and card grids, on
// first scroll entry. No GSAP dependency: plain IntersectionObserver plus
// inline styles, so it can run on any viewport width (mobile included, per
// §18A item 6) without paying for the desktop-only vendor bundle.
//
// HARD RULE (codified from the ledger, architecture §18A item 3): the
// from-state (opacity 0, translateY) is applied by JavaScript immediately
// before animating, never in static CSS. With JS absent, or under
// prefers-reduced-motion, no from-state is ever written, so the page is
// pixel-identical to the fully static build. This file must never be paired
// with a stylesheet rule that hides its target elements by default (that is
// the v8 `.reveal` pattern this replaces, and it is forbidden).
//
// Wired on the homepage only for now (index.astro); the export surface here
// is generic so a later page can call initReveal() with its own selectors
// without touching this file.

export interface RevealOptions {
  /** CSS selectors (evaluated against `root`) for elements to reveal. */
  selectors: string[];
  /** Reveal duration in ms. Architecture range: 300-450ms. */
  duration?: number;
  /** Starting translateY offset in px, animates to 0. */
  distance?: number;
  /** IntersectionObserver threshold. */
  threshold?: number;
  /** Root to query selectors against. Defaults to document. */
  root?: ParentNode;
}

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function clearInlineMotionStyles(el: HTMLElement): void {
  el.style.removeProperty('opacity');
  el.style.removeProperty('transform');
  el.style.removeProperty('transition');
  el.style.removeProperty('will-change');
}

/**
 * Reveal a set of elements once, on first scroll entry. Safe to call
 * multiple times with different selector sets (e.g. once per page).
 * No-ops entirely under prefers-reduced-motion, and fails open (restores
 * full visibility) if anything throws partway through.
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

    // Static-first: without IntersectionObserver, never write a from-state.
    if (!('IntersectionObserver' in window)) return;

    const duration = options.duration ?? 380;
    const distance = options.distance ?? 16;
    const threshold = options.threshold ?? 0.12;

    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = `translateY(${distance}px)`;
      el.style.transition = `opacity ${duration}ms ${EASE}, transform ${duration}ms ${EASE}`;
      el.style.willChange = 'opacity, transform';
    });
    touched = els;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'none';
          });
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((el) => io.observe(el));
  } catch {
    // Fail open (architecture §18A item 7): a motion-script error must never
    // leave content hidden.
    touched.forEach(clearInlineMotionStyles);
  }
}

// Homepage Tier 2 targets (architecture §18A item 3: "section headers and
// card grids"). Selectors reference existing, stable classes already shipped
// by W03/W05/W06 (HeroCorporate, EvidenceThesis, SectorPanels,
// PortfolioCards, TrustStrip, ProofRow) — no edits to those component files
// were needed or made. HeroCorporate is deliberately excluded (it is the LCP
// element and is already visible at first paint; fading it costs LCP for no
// benefit). EvidenceSpine is deliberately excluded (D-008 / §18A item 6: the
// spine is either the Tier 1 scrub, on qualifying desktop, or "the static
// vertical spine stands as designed" everywhere else — it never gets a Tier
// 2 treatment).
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
