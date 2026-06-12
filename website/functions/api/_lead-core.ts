// _lead-core.ts - shared lead-capture handler.
// Consumed by BOTH deploy modes:
//   - Cloudflare Pages Functions: website/functions/api/lead.ts
//   - Cloudflare Workers Static Assets: worker/index.ts (wrangler.jsonc main)
// Validates a contact submission, drops honeypot hits silently, and forwards
// the note to the founder via the MailChannels transactional API.
//
// Sovereignty note: this is a server-side, documented egress (lead
// forwarding). The page itself makes zero third-party requests.
//
// Founder-gated setup (flagged in the PR):
//   - MailChannels requires an api key + Domain Lockdown TXT record on
//     kriseva.in. Set MAILCHANNELS_API_KEY in the Cloudflare dashboard.
//   - SPF for the sender domain.

export interface LeadEnv {
  MAILCHANNELS_API_KEY?: string;
}

const TO_EMAIL = 'ayush@kriseva.in';
const TO_NAME = 'Ayush Tiwary';
const FROM_EMAIL = 'leads@kriseva.in';
const FROM_NAME = 'Kriseva website';

const INTENTS = new Set(['bidder', 'evaluation', 'institutional', 'other']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface LeadFields {
  name: string;
  email: string;
  organisation: string;
  intent: string;
  message: string;
  website: string; // honeypot - humans never see it, bots fill it
}

function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

async function parseBody(request: Request): Promise<LeadFields | null> {
  const ct = request.headers.get('content-type') || '';
  try {
    let raw: Record<string, unknown>;
    if (ct.includes('application/json')) {
      raw = (await request.json()) as Record<string, unknown>;
    } else if (ct.includes('form')) {
      const fd = await request.formData();
      const collected: Record<string, unknown> = {};
      fd.forEach((value, key) => { collected[key] = value; });
      raw = collected;
    } else {
      return null;
    }
    return {
      name: clean(raw.name, 200),
      email: clean(raw.email, 320),
      organisation: clean(raw.organisation, 300),
      intent: clean(raw.intent, 40),
      message: clean(raw.message, 5000),
      website: clean(raw.website, 200),
    };
  } catch {
    return null;
  }
}

function reply(request: Request, ok: boolean, status: number, detail: string): Response {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  if (wantsJson) {
    return new Response(JSON.stringify({ ok, detail }), {
      status,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  // No-JS form fallback: a minimal, on-brand confirmation page.
  const body = ok
    ? '<p>On file. The founder reads each note directly; expect a reply from ayush@kriseva.in.</p><p><a href="/contact">Back</a></p>'
    : `<p>${detail} Write directly: <a href="mailto:${TO_EMAIL}">${TO_EMAIL}</a></p><p><a href="/contact">Back</a></p>`;
  return new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Kriseva · contact</title></head><body style="font-family:Georgia,serif;background:#DED6C9;color:#0F0E0B;padding:48px">${body}</body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8' } }
  );
}

export async function handleLead(request: Request, env: LeadEnv): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { allow: 'POST' } });
  }

  const fields = await parseBody(request);
  if (!fields) return reply(request, false, 400, 'The note could not be read.');

  // Honeypot: pretend success, forward nothing.
  if (fields.website) return reply(request, true, 200, 'On file.');

  if (!fields.name || fields.name.length < 2) return reply(request, false, 422, 'A name is required.');
  if (!EMAIL_RE.test(fields.email)) return reply(request, false, 422, 'A working email is required.');
  if (!fields.message || fields.message.length < 10) return reply(request, false, 422, 'The note is too short to act on.');
  const intent = INTENTS.has(fields.intent) ? fields.intent : 'other';

  const text = [
    'Website lead · kriseva.in/contact',
    '',
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Organisation: ${fields.organisation || '(not given)'}`,
    `Side: ${intent}`,
    '',
    'Note:',
    fields.message,
  ].join('\n');

  const payload = {
    personalizations: [{ to: [{ email: TO_EMAIL, name: TO_NAME }] }],
    from: { email: FROM_EMAIL, name: FROM_NAME },
    reply_to: { email: fields.email, name: fields.name },
    subject: `Website lead · ${intent} · ${fields.name}`,
    content: [{ type: 'text/plain', value: text }],
  };

  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (env.MAILCHANNELS_API_KEY) headers['x-api-key'] = env.MAILCHANNELS_API_KEY;

  let sent = false;
  try {
    const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    sent = res.status === 202 || res.ok;
  } catch {
    sent = false;
  }

  if (!sent) return reply(request, false, 502, 'The note did not send.');
  return reply(request, true, 200, 'On file.');
}
