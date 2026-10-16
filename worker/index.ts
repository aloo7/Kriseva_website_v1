// worker/index.ts - Workers Static Assets entry point.
// wrangler.jsonc declares this as `main`; static files come from the ASSETS
// binding (website/dist). The dynamic routes are the lead endpoint and the
// v3 route redirects below.

import { handleLead, type LeadEnv } from '../website/functions/api/_lead-core';
import { FILM_PATHS, serveFilm } from './film-media.mjs';

interface Env extends LeadEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

// v3 route retirements (V3_BRIDGE_PLAN.md section 3). Old paths 301 to their
// replacements; trailing-slash variants match the same entry because the
// pathname is normalized before lookup below. Mirrors public/_redirects.
const REDIRECTS: Record<string, string> = {
  '/issuer-roadmap': '/evaluator',
  '/workflow': '/',
  '/validation': '/proof',
  '/evidence': '/proof',
  '/capabilities': '/',
  '/defense': '/solutions',
  '/defence': '/solutions',
  '/finance': '/attest',
  '/founder': '/company',
  '/pricing': '/plans',
  '/dossier.pdf': '/proof',
};
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (FILM_PATHS.has(url.pathname)) return serveFilm(request, env.ASSETS);
    if (url.pathname === '/api/lead') {
      return handleLead(request, env);
    }

    const normalizedPath = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname;
    const redirectTo = REDIRECTS[normalizedPath];
    if (redirectTo) {
      const destination = new URL(redirectTo, url.origin);
      destination.search = url.search;
      return Response.redirect(destination.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
