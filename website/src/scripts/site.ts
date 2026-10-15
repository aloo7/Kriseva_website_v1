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
  const sheetBtn = hdr.querySelector<HTMLButtonElement>('[data-sheet-trigger]');
  const sheet = hdr.querySelector<HTMLElement>('[data-sheet]');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const pageRegions = Array.from(document.querySelectorAll<HTMLElement>('main, body > footer'));
  const priorInert = new Map<HTMLElement, boolean>();
  let priorOverflow = '';
  let closeTimer = 0;

  const sheetIsOpen = () => sheetBtn?.getAttribute('aria-expanded') === 'true';
  const compactHeader = () => !!sheetBtn && sheetBtn.getClientRects().length > 0 && getComputedStyle(sheetBtn).display !== 'none';
  const paintOpen = () => hdr.classList.toggle('is-open', sheetIsOpen() || triggers.some((t) => t.getAttribute('aria-expanded') === 'true'));
  const closeAll = (except?: HTMLButtonElement) => {
    window.clearTimeout(closeTimer);
    triggers.forEach((t) => {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      panels.get(t)!.hidden = true;
    });
    paintOpen();
  };
  const open = (t: HTMLButtonElement) => {
    window.clearTimeout(closeTimer);
    closeAll(t);
    t.setAttribute('aria-expanded', 'true');
    panels.get(t)!.hidden = false;
    hdr.classList.add('is-open');
  };

  triggers.forEach((t) => {
    t.addEventListener('click', () => (t.getAttribute('aria-expanded') === 'true' ? closeAll() : open(t)));
    t.addEventListener('mouseenter', () => { if (finePointer.matches && !compactHeader()) open(t); });
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown') return;
      e.preventDefault();
      open(t);
      panels.get(t)?.querySelector<HTMLAnchorElement>('a')?.focus();
    });
  });
  hdr.addEventListener('mouseleave', () => {
    if (!finePointer.matches || hdr.contains(document.activeElement)) return;
    closeTimer = window.setTimeout(() => closeAll(), 160);
  });
  hdr.addEventListener('mouseenter', () => window.clearTimeout(closeTimer));
  hdr.addEventListener('focusout', () => {
    queueMicrotask(() => { if (!sheetIsOpen() && !hdr.contains(document.activeElement)) closeAll(); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openTrigger = triggers.find((t) => t.getAttribute('aria-expanded') === 'true');
      if (!sheetIsOpen() && !openTrigger) return;
      e.preventDefault();
      if (sheetIsOpen()) closeSheet(true);
      else {
        closeAll();
        openTrigger?.focus();
      }
    }
    if (e.key !== 'Tab' || !sheetIsOpen()) return;
    const focusable = Array.from(hdr.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary, [tabindex="0"]'))
      .filter((el) => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && (document.activeElement === first || !hdr.contains(document.activeElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !hdr.contains(document.activeElement))) {
      e.preventDefault();
      first.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!hdr.contains(e.target as Node)) closeAll();
  });

  function closeSheet(restoreFocus = false) {
    if (!sheetBtn || !sheet || !sheetIsOpen()) return;
    sheetBtn.setAttribute('aria-expanded', 'false');
    sheet.hidden = true;
    document.documentElement.style.overflow = priorOverflow;
    pageRegions.forEach((el) => { el.inert = priorInert.get(el) ?? false; });
    priorInert.clear();
    hdr!.removeAttribute('role');
    hdr!.removeAttribute('aria-modal');
    hdr!.removeAttribute('aria-label');
    paintOpen();
    if (restoreFocus) {
      const target = compactHeader() ? sheetBtn : hdr!.querySelector<HTMLElement>('.hdr__brand');
      target?.focus({ preventScroll: true });
    }
  }
  sheetBtn?.addEventListener('click', () => {
    const isOpen = sheetBtn.getAttribute('aria-expanded') === 'true';
    if (isOpen) return closeSheet();
    closeAll();
    sheetBtn.setAttribute('aria-expanded', 'true');
    sheet!.hidden = false;
    priorOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    pageRegions.forEach((el) => {
      priorInert.set(el, el.inert);
      el.inert = true;
    });
    hdr.setAttribute('role', 'dialog');
    hdr.setAttribute('aria-modal', 'true');
    hdr.setAttribute('aria-label', 'Navigation menu');
    paintOpen();
    sheet!.querySelector<HTMLElement>('summary, a[href]')?.focus({ preventScroll: true });
  });
  sheet?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => closeSheet()));
  const onLayoutChange = () => {
    const focusWasInSheet = !!sheet?.contains(document.activeElement);
    if (!compactHeader()) closeSheet(focusWasInSheet || document.activeElement === sheetBtn);
    closeAll();
  };
  addEventListener('resize', onLayoutChange, { passive: true });
  if (sheetBtn && 'ResizeObserver' in window) new ResizeObserver(onLayoutChange).observe(sheetBtn);
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
        if (e.key === 'Home' || e.key === 'End') {
          e.preventDefault();
          select(tabs[e.key === 'Home' ? 0 : tabs.length - 1], true);
          return;
        }
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
