// lead.ts - Cloudflare Pages Functions entry point for POST /api/lead.
// Active only if the project deploys as classic Cloudflare Pages with this
// directory as the functions root. The Workers Static Assets deploy mode
// (wrangler.jsonc) routes through worker/index.ts instead; both delegate to
// the same _lead-core handler.

import { handleLead, type LeadEnv } from './_lead-core';

interface PagesContext {
  request: Request;
  env: LeadEnv;
}

export const onRequestPost = (ctx: PagesContext) => handleLead(ctx.request, ctx.env);
export const onRequest = (ctx: PagesContext) => handleLead(ctx.request, ctx.env);
