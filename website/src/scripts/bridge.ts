// bridge.ts: the scroll-built bridge on the home hero.
//
// Zero dependencies. The hero section becomes tall (data-live), its stage is
// pinned with position: sticky, and scroll progress p in [0, 1] drives every
// part of the drawing through small tracks. Progress is smoothed with a lerp so
// wheel steps feel continuous. Without JS, or with reduced motion, nothing here
// runs and the finished bridge (as drawn in the markup) is what renders.

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, s: number, e: number) => clamp((p - s) / (e - s));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

type El = HTMLElement | SVGElement;

export function initBridge(root: HTMLElement): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const q = <T extends El = El>(k: string) => Array.from(root.querySelectorAll<T>(`[data-k="${k}"]`));
  const towers = q<SVGGElement>('tower');
  const cables = q<SVGPathElement>('cable');
  const hangers = q<SVGPathElement>('hanger');
  const decks = q<SVGGElement>('deck');
  const plates = q<HTMLElement>('plate');
  const engines = [...q('engine'), ...q('engine-label')];
  const gates = q<SVGGElement>('gate');
  const gateBits = [...q('gateline'), ...q('gate-label'), ...gates];
  const papers = q<SVGGElement>('paper');
  const underline = q<HTMLElement>('underline')[0];
  const cue = q<HTMLElement>('cue')[0];
  const progress = q<HTMLElement>('progress')[0];
  const beats = Array.from(root.querySelectorAll<HTMLElement>('[data-beat]'));

  const cache = new WeakMap<El, string>();
  const set = (el: El | undefined, prop: 'transform' | 'opacity' | 'strokeDashoffset', value: string) => {
    if (!el) return;
    const key = prop + value;
    if (cache.get(el) === key && prop === 'transform') return;
    (el.style as CSSStyleDeclaration)[prop] = value;
    if (prop === 'transform') cache.set(el, key);
  };

  cables.forEach((c) => (c.style.strokeDasharray = '1'));
  const towerT = towers.map((t) => [Number(t.dataset.s), Number(t.dataset.e)] as const);
  const cableT = cables.map((c) => [Number(c.dataset.s), Number(c.dataset.e)] as const);
  const hangerO = hangers.map((h) => Number(h.dataset.o));
  const paperStart = papers.map((p) => ({ x: Number(p.dataset.x), y: Number(p.dataset.y), r: Number(p.dataset.r) }));
  const gateX = gates.map((g) => Number(g.dataset.gx));

  const LIFT = { x: 446, y: 436 };
  const SCALE = 0.17;

  function render(p: number) {
    towers.forEach((el, i) => {
      const t = easeOut(seg(p, towerT[i][0], towerT[i][1]));
      set(el, 'transform', `translateY(${((1 - t) * 360).toFixed(1)}px)`);
    });

    plates.forEach((el, i) => {
      const t = easeOut(seg(p, 0.16 + i * 0.04, 0.3 + i * 0.04));
      set(el, 'transform', `translate(-50%, calc(-100% - ${((1 - t) * 26).toFixed(1)}px))`);
      set(el, 'opacity', t.toFixed(3));
    });

    cables.forEach((el, i) => {
      const t = easeIO(seg(p, cableT[i][0], cableT[i][1]));
      set(el, 'strokeDashoffset', (1 - t).toFixed(4));
    });

    hangers.forEach((el, i) => {
      const s = 0.3 + hangerO[i] * 0.17;
      const t = easeOut(seg(p, s, s + 0.06));
      set(el, 'transform', `scaleY(${t.toFixed(3)})`);
    });

    const d = easeIO(seg(p, 0.44, 0.62));
    decks.forEach((el) => set(el, 'transform', `scaleX(${d.toFixed(4)})`));

    const e = easeOut(seg(p, 0.6, 0.67));
    engines.forEach((el) => {
      set(el, 'opacity', e.toFixed(3));
    });

    const g = seg(p, 0.61, 0.66);
    gateBits.forEach((el) => set(el, 'opacity', g.toFixed(3)));

    // Bids lift out of the river and cross the deck to the buyer's shore.
    const onDeckX: number[] = [];
    papers.forEach((el, k) => {
      const s = 0.635 + k * 0.075;
      const u = seg(p, s, Math.min(0.985, s + 0.22));
      const st = paperStart[k];
      const endX = 1150 - k * 26;
      let x: number, y: number, r: number, sc: number;
      if (u <= 0.32) {
        const a = easeOut(u / 0.32);
        x = lerp(st.x, LIFT.x, a);
        y = lerp(st.y, LIFT.y, a) - Math.sin(a * Math.PI) * 70;
        r = lerp(st.r, 0, a);
        sc = lerp(1, SCALE, a);
      } else {
        const b = easeIO((u - 0.32) / 0.68);
        x = lerp(LIFT.x, endX, b);
        y = LIFT.y;
        r = 0;
        sc = SCALE;
        onDeckX.push(x);
      }
      set(el, 'transform', `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${sc.toFixed(3)})`);
    });

    gates.forEach((el, i) => {
      el.classList.toggle('is-on', onDeckX.some((x) => x >= gateX[i] - 2));
    });

    if (underline) set(underline, 'transform', `scaleX(${easeIO(seg(p, 0.62, 0.92)).toFixed(3)})`);
    if (cue) set(cue, 'opacity', (1 - seg(p, 0, 0.04)).toFixed(3));
    if (progress) set(progress, 'transform', `scaleX(${p.toFixed(4)})`);

    const beat = p < 0.26 ? 0 : p < 0.6 ? 1 : 2;
    beats.forEach((b, i) => {
      if (i === beat) b.setAttribute('data-active', '');
      else b.removeAttribute('data-active');
    });
    root.toggleAttribute('data-built', p > 0.985);
  }

  root.setAttribute('data-live', '');

  let target = 0;
  let current = 0;
  let raf = 0;

  const measure = () => {
    const rect = root.getBoundingClientRect();
    const total = root.offsetHeight - window.innerHeight;
    target = total > 0 ? clamp(-rect.top / total) : 1;
  };

  const tick = () => {
    raf = 0;
    current += (target - current) * 0.15;
    if (Math.abs(target - current) < 0.0006) current = target;
    render(current);
    if (current !== target) raf = requestAnimationFrame(tick);
  };

  const kick = () => {
    measure();
    if (!raf) raf = requestAnimationFrame(tick);
  };

  measure();
  current = target;
  render(current);
  root.setAttribute('data-ready', '');
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', kick);

  // Jump links inside the hero ("See the two products") skip the build.
  root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => {
      target = 1;
      current = 1;
      render(1);
    });
  });
}
