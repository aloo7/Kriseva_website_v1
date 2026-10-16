// The finished illustration works without JS. Controls enhance it at the visitor's pace.
import { animate } from 'motion';
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, s: number, e: number) => clamp((p - s) / (e - s));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

type El = HTMLElement | SVGElement;

export function initBridge(root: HTMLElement): void {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = root.querySelector<SVGSVGElement>('[data-bridge-scene]');
  if (!scene) return;

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
      set(el, 'transform', `translateY(${((1 - t) * -26).toFixed(1)}px)`);
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
    root.toggleAttribute('data-built', p > 0.998);
  }


  const viewData: Record<string, { box: number[]; text: string }> = {
    overview: { box: [0, 60, 1600, 740], text: 'Two shores. Two products. One evidence trail between suppliers and procurement committees.' },
    suppliers: { box: [0, 120, 540, 560], text: 'The supplier shore: precision manufacturing, drones, satellites and ground systems. TAS helps suppliers find, read and answer relevant tenders.' },
    bridge: { box: [410, 60, 780, 740], text: 'The crossing: TAS on the supplier side, Evaluator on the buyer side. An answer travels with its evidence so a committee can review the finding.' },
    buyers: { box: [1160, 130, 440, 540], text: 'The buyer shore: a procurement institution and a space launch complex. Evaluator links findings to source pages. Officers make the decisions.' },
  };
  const stages = [...root.querySelectorAll<HTMLButtonElement>('[data-stage-button]')];
  const stories = [...root.querySelectorAll<HTMLElement>('[data-story]')];
  const views = [...root.querySelectorAll<HTMLButtonElement>('[data-view]')];
  const description = root.querySelector<HTMLElement>('[data-view-description]');
  const play = root.querySelector<HTMLButtonElement>('[data-play-story]');
  const playLabel = root.querySelector<HTMLElement>('[data-play-label]');
  const motion = root.querySelector<HTMLButtonElement>('[data-motion-toggle]');
  const motionLabel = root.querySelector<HTMLElement>('[data-motion-label]');
  const duration = 12000;
  let current = 1, target = 1, elapsed = duration, last = 0, raf = 0;
  let storyPaused = false;
  let playing = false, hasPlayed = false, paused = false, inView = true;
  let stage = 2;
  let box = [...viewData.bridge.box];
  let targetBox = [...box];
  let cameraAnimation: ReturnType<typeof animate> | undefined;

  function applyCamera(next: number[]) {
    box = next;
    scene!.setAttribute('viewBox', box.map((value) => Number(value.toFixed(3))).join(' '));
    const clip = root.querySelector<SVGRectElement>('[data-view-clip]');
    ['x', 'y', 'width', 'height'].forEach((key, i) => clip?.setAttribute(key, String(box[i])));
  }
  function moveCamera(id: string, describe = false, immediate = false) {
    const view = viewData[id];
    if (!view) return;
    cameraAnimation?.stop();
    targetBox = [...view.box];
    root.dataset.camera = id;
    views.forEach((el) => el.setAttribute('aria-pressed', String(el.dataset.view === id)));
    if (describe && description) { description.textContent = view.text; description.hidden = false; }
    if (immediate || paused || preference.matches || !inView) { applyCamera([...targetBox]); return; }
    const from = [...box], to = [...targetBox];
    cameraAnimation = animate(0, 1, {
      duration: .72, ease: [.22, 1, .36, 1],
      onUpdate: (t) => applyCamera(from.map((value, i) => lerp(value, to[i], t))),
      onComplete: () => applyCamera(to),
    });
  }


  function setStage(index: number) {
    stage = index;
    root.dataset.stage = String(index);
    stages.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    stories.forEach((story, i) => { story.hidden = i !== index; });
  }
  function syncControls() {
    const stopped = paused || preference.matches;
    root.toggleAttribute('data-paused', stopped);
    root.toggleAttribute('data-playing', playing && !stopped);
    motion?.setAttribute('aria-pressed', String(stopped));
    if (motion) motion.hidden = preference.matches;
    if (motionLabel) motionLabel.textContent = stopped ? 'Resume motion' : 'Pause motion';
    if (play) play.disabled = preference.matches;
    if (playLabel) playLabel.textContent = playing ? (paused ? 'Resume story' : 'Pause story') : hasPlayed ? (elapsed < duration ? 'Resume story' : 'Replay the story') : 'Play the story';
    if (stopped) cameraAnimation?.pause();
    else if (!storyPaused && cameraAnimation?.state === 'paused') cameraAnimation.play();
  }
  const canMove = () => inView && !document.hidden && !paused && !preference.matches;
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; }
  function kick() { if (!raf && canMove()) raf = requestAnimationFrame(tick); }
  function tick(now: number) {
    raf = 0;
    if (!canMove()) { last = 0; return; }
    const dt = last ? Math.min(now - last, 64) : 16;
    last = now;
    if (playing) {
      elapsed = Math.min(duration, elapsed + dt);
      current = target = elapsed / duration;
      const next = current < .27 ? 0 : current < .62 ? 1 : 2;
      if (stage !== next) { setStage(next); moveCamera(['suppliers', 'bridge', 'buyers'][next]); }
      if (elapsed === duration) { playing = false; syncControls(); }
    } else {
      current = lerp(current, target, 1 - Math.exp(-dt / 90));
      if (Math.abs(current - target) < .0001) current = target;
    }
    render(current);
    if (playing || current !== target) kick(); else last = 0;
  }
  stages.forEach((button, i) => button.addEventListener('click', () => {
    playing = false;
    target = preference.matches ? 1 : [0, .58, 1][i];
    setStage(i);
    if (!canMove()) { current = target; render(current); }
    syncControls(); kick();
  }));
  views.forEach((button) => button.addEventListener('click', () => {
    moveCamera(button.dataset.view || 'overview', true);
  }));
  play?.addEventListener('click', () => {
    if (preference.matches) return;
    if (paused && playing) { paused = false; storyPaused = false; }
    else if (playing) { playing = false; storyPaused = true; cameraAnimation?.pause(); }
    else {
      if (elapsed >= duration || !hasPlayed || Math.abs(elapsed / duration - current) > .01) {
        elapsed = current = target = 0; setStage(0); render(0);
        moveCamera('suppliers');
      }
      playing = hasPlayed = true; paused = false; storyPaused = false;
      root.querySelector<HTMLElement>('.crossing__frame')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    syncControls(); last = 0; kick();
  });
  motion?.addEventListener('click', () => {
    paused = !paused; syncControls();
    if (paused) stop(); else kick();
  });
  preference.addEventListener('change', () => {
    stop();
    if (preference.matches) {
      playing = false; current = target = 1; elapsed = duration; setStage(2);
      cameraAnimation?.stop(); applyCamera([...targetBox]); render(1);
    }
    syncControls(); kick();
  });
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    root.dataset.inView = String(inView && !document.hidden);
    if (inView) { kick(); if (cameraAnimation?.state === 'paused' && !storyPaused && !paused && !preference.matches) cameraAnimation.play(); }
    else { stop(); cameraAnimation?.pause(); }
  });
  observer.observe(scene);
  document.addEventListener('visibilitychange', () => {
    root.dataset.inView = String(inView && !document.hidden);
    if (document.hidden) { stop(); cameraAnimation?.pause(); }
    else { kick(); if (cameraAnimation?.state === 'paused' && !storyPaused && !paused && !preference.matches) cameraAnimation.play(); }
  });
  const initialView = matchMedia('(max-width: 700px)').matches || document.documentElement.hasAttribute('data-phone-layout') ? 'bridge' : 'overview';
  moveCamera(initialView, false, true);
  render(1); syncControls();
  root.setAttribute('data-ready', '');
  root.querySelectorAll<HTMLElement>('[data-bridge-controls]').forEach((el) => { el.hidden = false; });
  void import('./crossing-atmosphere').then(({ initCrossingAtmosphere }) => initCrossingAtmosphere(root)).catch(() => { root.dataset.atmosphere = 'fallback'; });
}
