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
// Gate 3 fix (2026-08-15): IntersectionObserver only fires when an element's
// intersection ratio CROSSES the configured threshold at an observed frame.
// A programmatic instant scroll (scrollTo(bottom) then scrollTo(0), or any
// jump that skips the element's position entirely) never produces such a
// crossing for mid-page elements, so they were left stuck in their from-state
// forever — a JS-on page that renders content invisible, in direct violation
// of §18A item 7 ("any failure leaves the page readable"). IO remains the
// primary, correct mechanism for real/smoothed scrolling; three fail-open
// layers now backstop it for every other case: (1) a viewport-bounds check
// on every scroll/scrollend, so landing directly on a hidden element reveals
// it immediately; (2) once the page has been scrolled to its true bottom
// once, every still-hidden tracked element reveals unconditionally (a full
// traversal, whether by a real user or a script, means every section has
// been "passed"); (3) a 2000ms hard timeout per element as an absolute
// backstop. All four paths (IO, bounds check, bottom-reached, timeout)
// converge on one idempotent revealNow() so nothing double-fires.
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
// Marker attribute for QA (tests/motion.spec.ts): every element this module
// ever touches carries data-reveal, "pending" until shown, "shown" after —
// a stable, JS-behavior-agnostic hook to assert against, independent of
// which of the four reveal paths actually fired.
const MARK_ATTR = 'data-reveal';
const HARD_TIMEOUT_MS = 2000;
const SETTLE_DEBOUNCE_MS = 150;
const BOTTOM_EPSILON_PX = 2;

function clearInlineMotionStyles(el: HTMLElement): void {
  el.style.removeProperty('opacity');
  el.style.removeProperty('transform');
  el.style.removeProperty('transition');
  el.style.removeProperty('will-change');
  el.removeAttribute(MARK_ATTR);
}

// ---------------------------------------------------------------------
// Module-scoped fail-open registry. One shared registry (not one per
// initReveal() call) so a single scroll-safety net services every reveal
// group registered on the page.
// ---------------------------------------------------------------------
const pending = new Map<HTMLElement, () => void>();
let scrollSafetyInstalled = false;
let maxScrollSeen = 0;
let bottomReachedOnce = false;

function revealNow(el: HTMLElement): void {
  const showFn = pending.get(el);
  if (!showFn) return;
  pending.delete(el);
  showFn();
}

function revealAllPending(): void {
  // Snapshot first: showFn() mutates `pending` via revealNow().
  Array.from(pending.keys()).forEach(revealNow);
}

function isNearViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  // Generous margin: catches "landed directly on it" (hash jump, instant
  // scrollTo to a mid-page Y) even if it's not yet past the tighter
  // IO threshold used for the natural-scroll reveal.
  const margin = vh * 0.2;
  return rect.bottom >= -margin && rect.top <= vh + margin;
}

function checkBoundsForPending(): void {
  if (pending.size === 0) return;
  for (const el of Array.from(pending.keys())) {
    if (isNearViewport(el)) revealNow(el);
  }
}

function checkBottomReached(): void {
  if (bottomReachedOnce || pending.size === 0) return;
  const doc = document.documentElement;
  const scrollY = window.scrollY || doc.scrollTop || 0;
  const viewport = window.innerHeight || doc.clientHeight || 0;
  const full = Math.max(doc.scrollHeight, document.body ? document.body.scrollHeight : 0);
  maxScrollSeen = Math.max(maxScrollSeen, scrollY);
  if (maxScrollSeen + viewport >= full - BOTTOM_EPSILON_PX) {
    bottomReachedOnce = true;
    // A full traversal to the bottom (real user or script) means every
    // section has been passed at least once — anything still hidden was
    // skipped by an instant jump, not "not yet reached". Reveal it all.
    revealAllPending();
  }
}

function installScrollSafetyNet(): void {
  if (scrollSafetyInstalled) return;
  scrollSafetyInstalled = true;

  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  const runChecks = () => {
    try {
      checkBottomReached();
      checkBoundsForPending();
    } catch {
      // Fail open: if the safety net itself throws, don't leave anything
      // stuck — reveal everything still pending.
      revealAllPending();
    }
  };
  const onScroll = () => {
    runChecks();
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = setTimeout(runChecks, SETTLE_DEBOUNCE_MS);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  // 'scrollend' is not universally supported; the debounced 'scroll'
  // handler above is the real backstop, this is a same-tick refinement
  // where available.
  window.addEventListener('scrollend', runChecks);
  window.addEventListener('resize', () => checkBoundsForPending(), { passive: true });
}

/**
 * Reveal a set of elements once, on first scroll entry. Safe to call
 * multiple times with different selector sets (e.g. once per page).
 * No-ops entirely under prefers-reduced-motion, and fails open (restores
 * full visibility) if anything throws partway through, if scroll skips
 * past an element without ever crossing the IO threshold, or if 2000ms
 * elapses without a natural reveal.
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
      el.setAttribute(MARK_ATTR, 'pending');
    });
    touched = els;

    const show = (el: HTMLElement) => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.setAttribute(MARK_ATTR, 'shown');
      });
    };

    let io: IntersectionObserver | null = null;
    try {
      io = new IntersectionObserver(
        (entries) => {
          try {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              io?.unobserve(entry.target);
              revealNow(entry.target as HTMLElement);
            }
          } catch {
            revealAllPending();
          }
        },
        { threshold, rootMargin: '0px 0px -60px 0px' }
      );
    } catch {
      // Observer construction failed: fail open below, nothing left hidden.
      io = null;
    }

    els.forEach((el) => {
      const timer = setTimeout(() => revealNow(el), HARD_TIMEOUT_MS);
      pending.set(el, () => {
        clearTimeout(timer);
        io?.unobserve(el);
        show(el);
      });
      if (io) io.observe(el);
      else revealNow(el); // no observer at all: reveal immediately, fail open
    });

    installScrollSafetyNet();
    // Catch instant/programmatic scrolls that already happened before this
    // group registered (e.g. a hash-navigated load, or a second initReveal()
    // call mid-session), and the ordinary case of loading already scrolled.
    checkBoundsForPending();
    checkBottomReached();
  } catch {
    // Fail open (architecture §18A item 7): a motion-script error must never
    // leave content hidden.
    touched.forEach((el) => {
      pending.delete(el);
      clearInlineMotionStyles(el);
    });
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
