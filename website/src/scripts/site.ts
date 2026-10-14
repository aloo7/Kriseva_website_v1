// site.ts: shared behaviour for every v3 page. Each module wakes only when its
// data hook is present, so pages pay for what they use.
import { initBridge } from './bridge';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Header: solid on scroll, mega menus, mobile sheet ---------- */
function initHeader() {
  const hdr = document.querySelector<HTMLElement>('[data-hdr]');
  if (!hdr) return;

  const onScroll = () => hdr.classList.toggle('is-solid', scrollY > 8);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const triggers = Array.from(hdr.querySelectorAll<HTMLButtonElement>('[data-mega-trigger]'));
  const panels = new Map(triggers.map((t) => [t, document.getElementById(t.dataset.megaTrigger!)!]));
  let closeTimer = 0;

  const closeAll = (except?: HTMLButtonElement) => {
    triggers.forEach((t) => {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      panels.get(t)!.hidden = true;
    });
    if (!except) hdr.classList.remove('is-open');
  };
  const open = (t: HTMLButtonElement) => {
    window.clearTimeout(closeTimer);
    closeAll(t);
    t.setAttribute('aria-expanded', 'true');
    panels.get(t)!.hidden = false;
    hdr.classList.add('is-open');
  };

  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  triggers.forEach((t) => {
    t.addEventListener('click', () => (t.getAttribute('aria-expanded') === 'true' ? closeAll() : open(t)));
    if (finePointer) {
      t.addEventListener('mouseenter', () => open(t));
    }
  });
  if (finePointer) {
    hdr.addEventListener('mouseleave', () => {
      closeTimer = window.setTimeout(() => closeAll(), 160);
    });
    hdr.addEventListener('mouseenter', () => window.clearTimeout(closeTimer));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const openTrigger = triggers.find((t) => t.getAttribute('aria-expanded') === 'true');
    closeAll();
    openTrigger?.focus();
    closeSheet();
  });
  document.addEventListener('click', (e) => {
    if (!hdr.contains(e.target as Node)) closeAll();
  });

  const sheetBtn = hdr.querySelector<HTMLButtonElement>('[data-sheet-trigger]');
  const sheet = hdr.querySelector<HTMLElement>('[data-sheet]');
  function closeSheet() {
    if (!sheetBtn || !sheet) return;
    sheetBtn.setAttribute('aria-expanded', 'false');
    sheet.hidden = true;
    document.documentElement.style.overflow = '';
    hdr!.classList.remove('is-open');
  }
  sheetBtn?.addEventListener('click', () => {
    const isOpen = sheetBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) return closeSheet();
    sheetBtn.setAttribute('aria-expanded', 'true');
    sheet!.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    hdr.classList.add('is-open');
  });
  sheet?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeSheet));
}

/* ---------- Reveals and in-view hooks (transform only) ---------- */
function initInView() {
  const els = document.querySelectorAll<HTMLElement>('.rv, .rv-stagger, .draw-rule, [data-inview]');
  if (!('IntersectionObserver' in window) || reduce) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Count-up numbers ---------- */
function initCounters() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!els.length || reduce) return;
  const fmt = new Intl.NumberFormat('en-IN');
  const run = (el: HTMLElement) => {
    const end = Number(el.dataset.count);
    const prefix = el.dataset.prefix ?? '';
    const suffix = el.dataset.suffix ?? '';
    const final = el.textContent ?? '';
    const t0 = performance.now();
    const dur = 1400;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur);
      const v = Math.round(end * (1 - (1 - t) ** 4));
      el.textContent = t < 1 ? `${prefix}${fmt.format(v)}${suffix}` : final;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      run(en.target as HTMLElement);
      io.unobserve(en.target);
    });
  });
  els.forEach((el) => io.observe(el));
}

/* ---------- Tabs (supplier side / buyer side, product modules) ---------- */
function initTabs() {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const select = (tab: HTMLButtonElement, focus = false) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls')!);
        if (panel) panel.hidden = !on;
      });
      root.style.setProperty('--tab-i', String(tabs.indexOf(tab)));
      if (focus) tab.focus();
    };
    select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0]);
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        select(tabs[(i + dir + tabs.length) % tabs.length], true);
      });
    });
  });
}

/* ---------- One finding, one click (interactive specimen) ---------- */
function initZoom() {
  document.querySelectorAll<HTMLElement>('[data-zoom]').forEach((root) => {
    const steps = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-zoom-go]'));
    const decisions = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-decide]'));
    const live = root.querySelector<HTMLElement>('[data-zoom-live]');
    const go = (stage: string) => {
      root.dataset.stage = stage;
      steps
        .filter((b) => b.hasAttribute('aria-pressed'))
        .forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.zoomGo === stage || (stage === 'record' && b.dataset.zoomGo === 'decide'))));
    };
    steps.forEach((b) => b.addEventListener('click', () => go(b.dataset.zoomGo!)));
    decisions.forEach((b) =>
      b.addEventListener('click', () => {
        root.dataset.decision = b.dataset.decide!;
        go('record');
        if (live) live.textContent = b.dataset.announce ?? '';
      }),
    );
    root.querySelector('[data-zoom-reset]')?.addEventListener('click', () => {
      delete root.dataset.decision;
      go('clause');
      if (live) live.textContent = 'Specimen reset.';
    });
  });
}

/* ---------- Plans: module picker that writes the quote request ---------- */
function initQuote() {
  document.querySelectorAll<HTMLFormElement>('[data-quote]').forEach((form) => {
    const out = form.querySelector<HTMLElement>('[data-quote-summary]');
    const count = form.querySelector<HTMLElement>('[data-quote-count]');
    const mail = form.querySelector<HTMLAnchorElement>('[data-quote-mail]');
    const contact = form.querySelector<HTMLAnchorElement>('[data-quote-contact]');
    const update = () => {
      const data = new FormData(form);
      const side = String(data.get('side') ?? '');
      const modules = data.getAll('module').map(String);
      const deploy = String(data.get('deploy') ?? '');
      const team = String(data.get('team') ?? '');
      form.dataset.side = side;
      const lines = [
        side && `Side: ${side}`,
        modules.length ? `Modules: ${modules.join('; ')}` : '',
        deploy && `Deployment: ${deploy}`,
        team && `Team size: ${team}`,
      ].filter(Boolean) as string[];
      if (count) count.textContent = String(modules.length);
      if (out) out.textContent = lines.length ? lines.join('\n') : 'Pick a side and a few modules.';
      const body = `Hello Ayush,\n\nWe would like a custom quote for Kriseva.\n\n${lines.join('\n')}\n\nOrganisation:\nRole:\nTimeline:\n`;
      if (mail) mail.href = `mailto:ayush@kriseva.in?subject=${encodeURIComponent('Kriseva custom quote')}&body=${encodeURIComponent(body)}`;
      if (contact) {
        try {
          sessionStorage.setItem('kriseva-quote', lines.join('\n'));
        } catch {
          /* storage may be blocked; the mail link still carries the request */
        }
      }
    };
    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => e.preventDefault());
    update();
  });
}

initHeader();
initInView();
initCounters();
initTabs();
initZoom();
initQuote();
const bridge = document.querySelector<HTMLElement>('[data-bridge]');
if (bridge) initBridge(bridge);
