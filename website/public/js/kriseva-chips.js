/* kriseva-chips.js - the shared chip system (v7).
 *
 * One component, two faces:
 *   data-gloss="<term>"  jargon decoder chip. Dotted underline on the term;
 *                        hover / focus / tap shows a one-line plain-language
 *                        explanation a 17-year-old can follow.
 *   data-claim="<id>"    provenance footnote chip (X1). A tiny mono marker
 *                        beside a claim-bearing sentence; opens the claim's
 *                        register id, category and evidence pointer from the
 *                        baked registry (publicClaims.ts at build time).
 *
 * The registry is read from <script type="application/json" id="claimRegistry">
 * rendered by the page at build. No network, no third parties, no state kept
 * anywhere but the DOM. Keyboard: chips are buttons; Escape closes; the
 * popover is aria-live and referenced via aria-describedby while open.
 */
(function () {
  'use strict';

  var GLOSS = {
    gem:        { t: 'GeM',        d: 'Government e-Marketplace: the central government’s online buying portal.' },
    defproc:    { t: 'DefProc',    d: 'The Ministry of Defence’s portal where defence tenders are published.' },
    msme:       { t: 'MSME',       d: 'A micro, small or medium-sized business, registered as one with the government.' },
    rfp:        { t: 'RFP',        d: 'Request for Proposal: the document that asks companies to bid.' },
    boq:        { t: 'BOQ',        d: 'Bill of Quantities: the list of items and amounts the buyer wants.' },
    atc:        { t: 'ATC',        d: 'Additional Terms and Conditions: extra rules attached to a tender.' },
    corrigenda: { t: 'Corrigenda', d: 'Official corrections issued after a tender goes out. They change the rules mid-game.' },
    emd:        { t: 'EMD',        d: 'Earnest Money Deposit: refundable money a bidder locks in to show it is serious.' },
    epbg:       { t: 'ePBG',       d: 'Electronic Performance Bank Guarantee: money a winner pledges to guarantee delivery.' },
    aon:        { t: 'AoN',        d: 'Acceptance of Necessity: the formal approval that a need is real and will be funded.' },
    dap:        { t: 'DAP 2020',   d: 'Defence Acquisition Procedure 2020: the public rulebook for how India buys defence equipment.' }
  };

  var css =
    '.kchip-gloss{display:inline;font:inherit;color:inherit;background:none;border:none;padding:0;cursor:help;' +
    'border-bottom:1px dotted var(--brass-text,#91601C);text-decoration:none}' +
    '.sec-navy .kchip-gloss,.contact .kchip-gloss{border-bottom-color:var(--brass-lt,#C89A4C)}' +
    '.kchip-claim{display:inline-block;vertical-align:super;font-family:var(--mono,monospace);font-size:var(--fs-chip,14px);' +
    'letter-spacing:.08em;line-height:1;color:var(--brass-text,#91601C);background:none;border:1px solid currentColor;' +
    'border-radius:2px;padding:2px 4px;margin-left:5px;cursor:pointer;opacity:.85}' +
    '.kchip-claim:hover{opacity:1}' +
    '.sec-navy .kchip-claim,.contact .kchip-claim{color:var(--brass-lt,#C89A4C)}' +
    '#kpop{position:absolute;z-index:10002;max-width:300px;background:var(--ink-deep,#17130D);color:#EFE9DA;' +
    'border:1px solid rgba(200,154,76,.5);border-radius:2px;padding:11px 13px;font-family:var(--sans,sans-serif);' +
    'font-size:var(--fs-caption,15px);line-height:1.55;box-shadow:0 14px 34px -16px rgba(15,14,11,.65);display:none}' +
    '#kpop.on{display:block}' +
    '#kpop .kp-k{display:block;font-family:var(--mono,monospace);font-size:var(--fs-eyebrow,13px);letter-spacing:.18em;' +
    'text-transform:uppercase;color:var(--brass-lt,#C89A4C);margin-bottom:5px}' +
    '#kpop .kp-m{display:block;font-family:var(--mono,monospace);font-size:var(--fs-meta,14px);letter-spacing:.06em;' +
    'color:rgba(239,233,218,.65);margin-top:7px;overflow-wrap:anywhere}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var pop = document.createElement('div');
  pop.id = 'kpop';
  pop.setAttribute('role', 'note');
  document.body.appendChild(pop);

  var registry = {};
  var regEl = document.getElementById('claimRegistry');
  if (regEl) { try { registry = JSON.parse(regEl.textContent); } catch (e) {} }

  var current = null, hideTimer = null;

  function line(cls, text) {
    var s = document.createElement('span');
    s.className = cls; s.textContent = text;
    return s;
  }

  function show(chip) {
    clearTimeout(hideTimer);
    pop.textContent = '';
    if (chip.dataset.gloss) {
      var g = GLOSS[chip.dataset.gloss.toLowerCase()];
      if (!g) return;
      pop.appendChild(line('kp-k', g.t + ' · plain language'));
      pop.appendChild(document.createTextNode(g.d));
    } else if (chip.dataset.claim) {
      var c = registry[chip.dataset.claim];
      if (!c) return;
      pop.appendChild(line('kp-k', 'claims register · ' + chip.dataset.claim));
      pop.appendChild(document.createTextNode(c.w));
      pop.appendChild(line('kp-m', c.cat + ' · evidence: ' + c.ev));
    } else { return; }
    pop.classList.add('on');
    chip.setAttribute('aria-describedby', 'kpop');
    current = chip;
    var r = chip.getBoundingClientRect();
    var top = r.bottom + window.scrollY + 8;
    var left = Math.max(10, Math.min(r.left + window.scrollX - 10, window.scrollX + document.documentElement.clientWidth - pop.offsetWidth - 10));
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
  }

  function hide() {
    pop.classList.remove('on');
    if (current) { current.removeAttribute('aria-describedby'); current = null; }
  }
  function delayedHide() { hideTimer = setTimeout(hide, 160); }

  document.addEventListener('mouseover', function (e) {
    var chip = e.target.closest('[data-gloss],[data-claim]');
    if (chip) show(chip); else if (!e.target.closest('#kpop')) delayedHide();
  });
  document.addEventListener('focusin', function (e) {
    var chip = e.target.closest('[data-gloss],[data-claim]');
    if (chip) show(chip); else delayedHide();
  });
  document.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-gloss],[data-claim]');
    if (chip) { e.preventDefault(); current === chip && pop.classList.contains('on') ? hide() : show(chip); }
    else if (!e.target.closest('#kpop')) hide();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  pop.addEventListener('mouseover', function () { clearTimeout(hideTimer); });
  pop.addEventListener('mouseleave', delayedHide);
  /* hide on real scrolling only; smooth-scroll libraries emit settling
     events for many frames after the wheel stops */
  var shownY = 0;
  var _show = show;
  show = function (chip) { _show(chip); shownY = window.scrollY; };
  window.addEventListener('scroll', function () {
    if (pop.classList.contains('on') && Math.abs(window.scrollY - shownY) > 32) hide();
  }, { passive: true });
})();
