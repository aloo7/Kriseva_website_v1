// worker/index.ts - Workers Static Assets entry point.
// wrangler.jsonc declares this as `main`; static files come from the ASSETS
// binding (website/dist). The dynamic routes are the lead endpoint and the
// v2 sitemap redirects below.

import { handleLead, type LeadEnv } from '../website/functions/api/_lead-core';

interface Env extends LeadEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

// v2 sitemap migration (CORPORATE_SITE_V2_ARCHITECTURE.md §4). Old paths
// 301 to their replacements; trailing-slash variants match the same entry
// because the pathname is normalized before lookup below.
const REDIRECTS: Record<string, string> = {
  '/workflow': '/capabilities',
  '/validation': '/evidence',
  '/issuer-roadmap': '/evaluator',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
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
