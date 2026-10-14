// Single source of truth for the routes QA exercises (v3 "The Bridge",
// 2026-10-14; see docs/V3_BRIDGE_PLAN.md section 3). qa-static.spec.ts
// imports this list too, so the two can no longer drift.
export const routes: { path: string; label: string }[] = [
  { path: '/',            label: 'home' },
  { path: '/tas',         label: 'tas' },
  { path: '/evaluator',   label: 'evaluator' },
  { path: '/solutions',   label: 'solutions' },
  { path: '/proof',       label: 'proof' },
  { path: '/security',    label: 'security' },
  { path: '/plans',       label: 'plans' },
  { path: '/company',     label: 'company' },
  { path: '/resources',   label: 'resources' },
  { path: '/contact',     label: 'contact' },
  { path: '/attest',      label: 'attest' },
  { path: '/404',         label: '404' },
];

export const intentDeepLinks: { path: string; label: string }[] = [
  { path: '/contact?intent=demo',  label: 'contact-demo' },
  { path: '/contact?intent=pilot', label: 'contact-pilot' },
  { path: '/contact?intent=quote', label: 'contact-quote' },
];

// Stage 7 elite QA — full 10-breakpoint matrix per brief.
export const responsiveViewports = [
  { width: 320,  height: 720, label: 'mobile-320' },   // narrow
  { width: 360,  height: 760, label: 'mobile-360' },
  { width: 390,  height: 844, label: 'mobile-390' },   // iPhone 14
  { width: 430,  height: 932, label: 'mobile-430' },   // iPhone 14 Pro Max
  { width: 768,  height: 1024, label: 'tablet-768' },  // iPad portrait
  { width: 1024, height: 768, label: 'tablet-1024' },  // iPad landscape
  { width: 1280, height: 800, label: 'laptop-1280' },
  { width: 1440, height: 900, label: 'desktop-1440' },
  { width: 1728, height: 1117, label: 'wide-1728' },   // 16" MBP
  { width: 1920, height: 1080, label: 'wide-1920' },
];
