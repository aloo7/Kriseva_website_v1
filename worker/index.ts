// worker/index.ts - Workers Static Assets entry point.
// wrangler.jsonc declares this as `main`; static files come from the ASSETS
// binding (website/dist). The only dynamic route is the lead endpoint.

import { handleLead, type LeadEnv } from '../website/functions/api/_lead-core';

interface Env extends LeadEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/lead') {
      return handleLead(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
