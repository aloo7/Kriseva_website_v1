// homeMotion.ts
//
// Tier 1 motion controller (CORPORATE_SITE_V2_ARCHITECTURE.md §18A, locked).
// Owns GSAP/ScrollTrigger/Lenis init and the Evidence Spine scrub timeline —
// the only pin on the site (§18A item 2). Tier 2 reveals live separately in
// reveal.ts and do not depend on this file or on GSAP.
//
// Loaded ONLY when the caller (index.astro) has already confirmed the full
// desktop-motion gate (prefers-reduced-motion: no-preference AND
// min-width: 1024px AND pointer: fine); this module does not re-check that
// gate. It is responsible for its own second gate: vendor scripts
// (gsap / ScrollTrigger / lenis, ~130KB combined) are injected as plain
// classic <script> tags ONLY from inside initHomeMotion(), so nothing here
// downloads unless the caller's dynamic import() actually resolves this
// module — reduced-motion and sub-1024px visitors never fetch this file or
// the vendor bundle (verified in tests/motion.spec.ts).
//
// Failure behavior (§18A item 7): every station, connector and traveler
// element this file touches starts from the SAME visual state the static
// build ships (EvidenceSpine.astro is unedited). If vendor scripts fail to
// load, or anything below throws, initHomeMotion() returns before any
// from-state is ever written, so the page stays exactly as static-first
// design intends: fully readable, motion only ever adds.

interface GsapVars {
  [key: string]: unknown;
}

interface GsapTimeline {
  to(targets: unknown, vars: GsapVars, position?: string | number): GsapTimeline;
  fromTo(targets: unknown, fromVars: GsapVars, toVars: GsapVars, position?: string | number): GsapTimeline;
}

interface ScrollTriggerSelf {
  progress: number;
}

interface ScrollTriggerInstance {
  kill(revert?: boolean): void;
}

interface ScrollTriggerStatic {
  create(vars: GsapVars): ScrollTriggerInstance;
  refresh(): void;
  config(vars: GsapVars): void;
  addEventListener(event: string, cb: () => void): void;
}

interface GsapStatic {
  registerPlugin(...plugins: unknown[]): void;
  set(targets: unknown, vars: GsapVars): void;
  timeline(vars?: GsapVars): GsapTimeline;
  ticker: { add(fn: (time: number) => void): void; lagSmoothing(value: number): void };
}

interface LenisInstance {
  on(event: string, cb: (...args: unknown[]) => void): void;
  raf(time: number): void;
}

interface LenisConstructor {
  new (options: GsapVars): LenisInstance;
}

declare global {
  interface Window {
    gsap?: GsapStatic;
    ScrollTrigger?: ScrollTriggerStatic;
    Lenis?: LenisConstructor;
  }
}

const VENDOR = {
  gsap: '/vendor/gsap-3.12.5.min.js',
  scrollTrigger: '/vendor/ScrollTrigger-3.12.5.min.js',
  lenis: '/vendor/lenis-1.3.23.min.js',
} as const;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const el = document.createElement('script');
    el.src = src;
    // async=false preserves document-order execution across the three
    // dynamically-created tags below while still letting them download in
    // parallel (standard "ordered async" technique) — gsap must run before
    // ScrollTrigger registers, and both before lenis is constructed.
    el.async = false;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`homeMotion: failed to load ${src}`));
    document.head.appendChild(el);
  });
}

async function loadVendor(): Promise<{ gsap: GsapStatic; ScrollTrigger: ScrollTriggerStatic; Lenis: LenisConstructor }> {
  await Promise.all([loadScript(VENDOR.gsap), loadScript(VENDOR.scrollTrigger), loadScript(VENDOR.lenis)]);
  const { gsap, ScrollTrigger, Lenis } = window;
  if (!gsap || !ScrollTrigger || !Lenis) {
    throw new Error('homeMotion: vendor globals missing after script load');
  }
  return { gsap, ScrollTrigger, Lenis };
}

// ---------- Lenis (architecture §18A item 4) ----------
// Homepage only, desktop only, motion-allowed only (all already guaranteed
// by the caller's gate). Duration ~1.1. Anchor navigation is deliberately
// NOT intercepted here — no click handler on a[href^="#"] — so in-page links
// keep native browser behavior; Lenis only smooths wheel/touch scrolling.
function initLenis(gsap: GsapStatic, ScrollTrigger: ScrollTriggerStatic, Lenis: LenisConstructor): void {
  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    autoRaf: false,
  });
  // ScrollTrigger.update is not in the narrow ScrollTriggerStatic type above
  // (only the subset this file calls directly is declared); read it off the
  // live global so a missing method fails silently rather than throwing.
  const st = ScrollTrigger as unknown as { update?: () => void };
  if (typeof st.update === 'function') {
    lenis.on('scroll', () => st.update?.());
  }
  gsap.ticker.add((time: number) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ---------- Evidence Spine scrub (architecture §18A item 2) ----------
function clearSpineInlineStyles(spineSection: HTMLElement): void {
  const plates = spineSection.querySelectorAll<HTMLElement>('.spine__plate');
  plates.forEach((p) => {
    p.style.removeProperty('opacity');
    p.style.removeProperty('transform');
  });
  spineSection.querySelectorAll<HTMLElement>('.spine__connector-arrow').forEach((c) => {
    c.style.removeProperty('opacity');
    c.style.removeProperty('transform');
  });
  spineSection.querySelector<SVGPathElement>('[data-station="human-review"] .spine__icon svg path')?.style.removeProperty('stroke-dashoffset');
  spineSection.querySelectorAll<SVGLineElement>('[data-station="retained-record"] .spine__icon svg line').forEach((l) => {
    l.style.removeProperty('transform');
  });
  spineSection.querySelector<HTMLElement>('.spine-traveler')?.remove();
}

// ScrollTrigger itself is not referenced directly here: gsap.timeline()'s
// `scrollTrigger` config option below works once the plugin is registered
// globally (done once in initHomeMotion), so this function only needs gsap.
function initSpineScrub(gsap: GsapStatic): void {
  const spineSection = document.querySelector<HTMLElement>('.evidence-spine');
  const spineEl = spineSection?.querySelector<HTMLElement>('.spine');
  if (!spineSection || !spineEl) return;

  const stationEls = Array.from(spineSection.querySelectorAll<HTMLElement>('[data-station]'));
  const plates = stationEls
    .map((s) => s.querySelector<HTMLElement>('.spine__plate'))
    .filter((p): p is HTMLElement => p !== null);
  const connectorArrows = Array.from(spineSection.querySelectorAll<HTMLElement>('.spine__connector-arrow'));
  const n = stationEls.length;
  if (n < 2 || plates.length !== n) return;

  const conflictStation = spineSection.querySelector<HTMLElement>('[data-station="conflict"]');
  const conflictChip = conflictStation?.querySelector<HTMLElement>('.spine__chip');
  const signaturePath = spineSection.querySelector<SVGPathElement>(
    '[data-station="human-review"] .spine__icon svg path'
  );
  const chainLines = Array.from(
    spineSection.querySelectorAll<SVGLineElement>('[data-station="retained-record"] .spine__icon svg line')
  );

  try {
    // From-states, applied by JS only (never static CSS) immediately before
    // the scrub is wired — architecture §18A item 3's rule, extended here to
    // the Tier 1 spine as well as Tier 2, so a JS-disabled or reduced-motion
    // render is pixel-identical to the shipped static build.
    plates.forEach((plate) => gsap.set(plate, { y: 8, opacity: 0.55 }));
    connectorArrows.forEach((arrow) =>
      gsap.set(arrow, { opacity: 0.3, scaleX: 0, transformOrigin: 'left center' })
    );
    if (conflictChip) gsap.set(conflictChip, { rotateX: -85, opacity: 0.35, transformPerspective: 400 });
    let sigLength = 0;
    if (signaturePath) {
      sigLength = signaturePath.getTotalLength();
      gsap.set(signaturePath, { strokeDasharray: sigLength, strokeDashoffset: sigLength });
    }
    if (chainLines.length) gsap.set(chainLines, { scaleY: 0, transformOrigin: '50% 50%' });

    // Traveling field chip — created only here, in the gated JS-only path,
    // so with JS absent or motion disallowed the element never exists and
    // the static composition is unchanged.
    spineEl.style.position = 'relative';
    const traveler = document.createElement('div');
    traveler.className = 'spine-traveler';
    traveler.setAttribute('aria-hidden', 'true');
    traveler.textContent = 'FIELD 12';
    traveler.style.cssText = [
      'position:absolute',
      'left:0',
      'top:0',
      'transform:translate(-50%, -140%)',
      'font-family:var(--font-mono, monospace)',
      'font-size:0.66rem',
      'letter-spacing:0.08em',
      'text-transform:uppercase',
      'color:var(--surface-paper, #F3EDE0)',
      'background:var(--accent-primary, #A87229)',
      'border-radius:var(--radius-badge, 999px)',
      'padding:3px 9px',
      'white-space:nowrap',
      'pointer-events:none',
      'z-index:3',
      'opacity:0',
    ].join(';');
    spineEl.appendChild(traveler);

    let stationCenters = plates.map(() => ({ x: 0, y: 0 }));
    const recomputeCenters = () => {
      const base = spineEl.getBoundingClientRect();
      stationCenters = plates.map((p) => {
        const r = p.getBoundingClientRect();
        return { x: r.left - base.left + r.width / 2, y: r.top - base.top };
      });
    };
    recomputeCenters();

    function updateTraveler(progress: number): void {
      const span = n - 1;
      const idx = Math.min(span - 0.0001, Math.max(0, progress * span));
      const i0 = Math.floor(idx);
      const i1 = Math.min(span, i0 + 1);
      const localT = idx - i0;
      const p0 = stationCenters[i0];
      const p1 = stationCenters[i1];
      if (!p0 || !p1) return;
      const x = p0.x + (p1.x - p0.x) * localT;
      const y = p0.y + (p1.y - p0.y) * localT;
      traveler.style.left = `${x}px`;
      traveler.style.top = `${y}px`;
      traveler.style.opacity = progress > 0.01 && progress < 0.999 ? '1' : '0';
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: spineSection,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: true,
        onUpdate: (self: ScrollTriggerSelf) => {
          updateTraveler(self.progress);
          spineSection.dataset.spineProgress = self.progress.toFixed(3);
        },
        onRefresh: recomputeCenters,
      },
    });

    // Station plates settle (lift 8px to rest) in order as the scrub
    // reaches each one; connectors draw across the gap between them. The
    // timeline's own scale is 0..1 (matching scroll progress), so every
    // tween below sets an explicit `duration` in that same scale rather than
    // relying on GSAP's default (0.5 "time units", which would not line up).
    const step = 1 / (n - 1);
    stationEls.forEach((_, i) => {
      const center = i * step;
      const winStart = Math.max(0, center - 0.15);
      tl.to(plates[i], { y: 0, opacity: 1, ease: 'none', duration: Math.max(0.001, center - winStart) }, winStart);
    });

    connectorArrows.forEach((arrow, i) => {
      const start = i * step;
      const end = (i + 1) * step;
      tl.to(arrow, { scaleX: 1, opacity: 1, ease: 'none', duration: Math.max(0.001, end - start) }, start);
    });

    // CONFLICT flip at station 3 (index 2).
    if (conflictChip && n > 2) {
      const at = Math.max(0, 2 * step - 0.05);
      tl.to(conflictChip, { rotateX: 0, opacity: 1, duration: 0.1, ease: 'power2.out' }, at);
    }

    // Signature rule draws at station 4 (index 3).
    if (signaturePath && n > 3) {
      const center = 3 * step;
      const winStart = Math.max(0, center - 0.15);
      tl.to(signaturePath, { strokeDashoffset: 0, ease: 'none', duration: Math.max(0.001, center - winStart) }, winStart);
    }

    // Chain rule stamps at station 6 (index 5, the final station).
    if (chainLines.length && n > 5) {
      const at = Math.max(0, (n - 1) * step - 0.06);
      tl.to(chainLines, { scaleY: 1, duration: 0.09, ease: 'back.out(2.2)' }, at);
    }
  } catch {
    // Fail open (§18A item 7): never leave a partially-hidden spine.
    clearSpineInlineStyles(spineSection);
  }
}

export async function initHomeMotion(): Promise<void> {
  let gsap: GsapStatic;
  let ScrollTrigger: ScrollTriggerStatic;
  let Lenis: LenisConstructor;
  try {
    ({ gsap, ScrollTrigger, Lenis } = await loadVendor());
  } catch {
    // Vendor failed to load: static build already stands as-is, nothing to
    // undo.
    return;
  }

  try {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    initLenis(gsap, ScrollTrigger, Lenis);
    initSpineScrub(gsap);
    window.addEventListener('load', () => ScrollTrigger.refresh());
    document.fonts?.ready?.then(() => ScrollTrigger.refresh()).catch(() => {});
  } catch {
    // Fail open: leave whatever partial state exists readable. The
    // per-feature try/catch blocks above already guard the spine; a top
    // level error here (e.g. Lenis construction) does not touch layout.
  }
}
