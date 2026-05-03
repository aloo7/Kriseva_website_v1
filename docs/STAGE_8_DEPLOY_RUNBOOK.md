# Stage 8 Deploy Runbook — Cloudflare Pages + kriseva.in

Date: 2026-05-03
Goal: Deploy the KRISEVA website to **Cloudflare Pages** at the **kriseva.in** apex domain (with www.kriseva.in as a secondary). Auto-deploy on every push to `aloo7/Kriseva_website_v1` `main`.

---

## Why Cloudflare Pages

| Criterion | Cloudflare Pages | Vercel | Netlify | GitHub Pages |
|---|---|---|---|---|
| India POPs (Mumbai, Delhi, Bangalore, Chennai) | **★★★★★** native | ★★★ via partners | ★★★ via partners | ★★ |
| Free unlimited bandwidth | ✓ | ✗ (100 GB/mo) | ✗ (100 GB/mo) | ✓ |
| Free unlimited custom domains | ✓ | limited | limited | 1 only |
| Free DDoS protection at edge | ✓ | partial | partial | ✗ |
| Auto-deploy from GitHub | ✓ | ✓ | ✓ | ✓ |
| Build minutes / month (free tier) | 500 builds | 100 hrs | 300 min | unlimited but slower |
| Commercial use on free tier | OK | restricted | OK | OK |
| HTTP/3 + modern TLS | ✓ | ✓ | ✓ | depends |

**Verdict: Cloudflare Pages.** Best India performance, no bandwidth cap, no commercial-use restriction, free DDoS at edge.

---

## Prerequisites (already done)

- [x] Code pushed to `https://github.com/aloo7/Kriseva_website_v1`
- [x] `website/public/_headers` — security + cache rules
- [x] `website/public/_redirects` — placeholder for future redirects
- [x] `website/dist` builds locally (verified: `npm run qa`)
- [x] You own `kriseva.in` (registered at GoDaddy)
- [x] You have an Anthropic / personal email for Cloudflare signup

---

## Phase A — Connect Cloudflare Pages to GitHub (~5 min)

### A1. Sign up / sign in at Cloudflare

1. Open https://dash.cloudflare.com/sign-up
2. Use your usual email. Free tier — no credit card required.
3. Verify the email if prompted.

### A2. Create a Pages project

1. In the dashboard left sidebar: **Workers & Pages** → click.
2. Click **Create application** → **Pages** tab → **Connect to Git**.
3. Click **Connect GitHub** → authorise Cloudflare to read your repos.
   - In the GitHub permission screen, you can grant access to **just** `aloo7/Kriseva_website_v1` (recommended) or all repos.
4. Back in Cloudflare: select repo **`aloo7/Kriseva_website_v1`** → **Begin setup**.

### A3. Build configuration

Use these exact values:

| Field | Value |
|---|---|
| **Project name** | `kriseva-website` (becomes `kriseva-website.pages.dev`) |
| **Production branch** | `main` |
| **Framework preset** | **Astro** |
| **Build command** | `npm install && npm run build` |
| **Build output directory** | `dist` |
| **Root directory (advanced)** | `website` |
| **Environment variables** | (none required for now) |

**Why "Root directory = `website`":** Our repo has a top-level structure where the Astro app lives in `website/`. Telling Cloudflare to build inside `website/` makes `npm install` and `npm run build` resolve correctly, and `dist` is interpreted relative to that subdir.

4. Click **Save and Deploy**.
5. First build runs (~1–2 min). Watch the log; expect:
   ```
   Detected the following tools from environment: npm@..., nodejs@22 or 20
   ...
   added 401 packages in 22s
   ✓ Completed in 1.2s
   [build] 9 page(s) built in 1.0s
   ```
6. When the deploy goes green, click the **Visit site** button. The URL is `https://kriseva-website.pages.dev` (or similar with a project-specific subdomain).
7. **Test all 9 routes:**
   - https://kriseva-website.pages.dev/
   - https://kriseva-website.pages.dev/tas
   - https://kriseva-website.pages.dev/workflow
   - https://kriseva-website.pages.dev/security
   - https://kriseva-website.pages.dev/issuer-roadmap
   - https://kriseva-website.pages.dev/validation
   - https://kriseva-website.pages.dev/founder
   - https://kriseva-website.pages.dev/contact
   - https://kriseva-website.pages.dev/notarealpath ← should show the 404 dossier

If anything 404s or breaks, fix and push to `main` — every push triggers a fresh deploy automatically.

---

## Phase B — Wire `kriseva.in` custom domain

You have two paths. **Option B is recommended** for speed, DDoS, and operational simplicity.

### Option A — keep DNS at GoDaddy (simpler, slightly less powerful)

#### B1A. In Cloudflare Pages

1. Project → **Custom domains** → **Set up a custom domain**.
2. Enter `kriseva.in` → Continue.
3. Cloudflare gives you instructions; choose **"DNS not on Cloudflare"**.
4. It shows specific records to set at GoDaddy:
   - For apex (`kriseva.in`): **A** records pointing to Cloudflare Pages anycast IPs (it will list 4 IPs)
   - Or a `CNAME` to `kriseva-website.pages.dev` if you use a CNAME-flattening DNS provider (GoDaddy doesn't support CNAME at apex by default)
5. Repeat for `www.kriseva.in` — it's a simple `CNAME` → `kriseva-website.pages.dev`.

#### B2A. In GoDaddy

1. Sign in at https://godaddy.com → My Products → DNS.
2. For `kriseva.in`: click **DNS Management**.
3. **Replace existing A records** (delete any default GoDaddy parking IPs first):
   - Type: `A`, Name: `@`, Value: `<each Cloudflare IP from step B1A>`, TTL: `1 hour`
   - Repeat for each of the 4 Cloudflare IPs
4. Add CNAME for www:
   - Type: `CNAME`, Name: `www`, Value: `kriseva-website.pages.dev`, TTL: `1 hour`
5. **Delete any other default records** that conflict (parked-page A/AAAA, GoDaddy forwarding rules).
6. Save.
7. Go back to Cloudflare → wait for verification (5–30 min, sometimes longer for DNS propagation).
8. Cloudflare auto-provisions the SSL certificate once the records resolve.

#### B3A. Verify

```sh
dig +short kriseva.in
dig +short www.kriseva.in
# Both should return Cloudflare IPs (or the CNAME chain ending at Cloudflare).

curl -I https://kriseva.in/
# Should respond 200 OK with `server: cloudflare` and your security headers.
```

### Option B — migrate DNS to Cloudflare (recommended)

Faster, free DDoS at DNS level, easier ongoing management, plus auto-provisions the apex without IP-juggling.

#### B1B. Add the domain to Cloudflare

1. Cloudflare dashboard → **Websites** (top-left) → **+ Add a site**.
2. Enter `kriseva.in` → **Continue**.
3. Pick **Free** plan → Continue.
4. Cloudflare scans your existing GoDaddy DNS records; review the imported list. (Likely just GoDaddy parking + nameserver records.)
5. Cloudflare gives you **2 nameservers**, like:
   ```
   adam.ns.cloudflare.com
   bea.ns.cloudflare.com
   ```
   Copy them.

#### B2B. Change nameservers at GoDaddy

1. GoDaddy → My Products → `kriseva.in` → **Manage DNS** → scroll to **Nameservers** → **Change**.
2. Pick **"I'll use my own nameservers"**.
3. Replace the existing nameservers (`ns01.domaincontrol.com` etc.) with the two Cloudflare ones.
4. Save. Confirm by email if GoDaddy prompts.
5. Propagation takes 5 min – 24 h (usually under 1 h).

#### B3B. Add the custom domain in Pages

1. Cloudflare dashboard → **Workers & Pages** → your `kriseva-website` project → **Custom domains**.
2. **Set up a custom domain** → `kriseva.in` → Continue. Cloudflare auto-creates an apex `CNAME` (using their flattening tech) and provisions SSL. **Done in ~2 minutes.**
3. Repeat for `www.kriseva.in`.

#### B4B. Verify

```sh
dig +short NS kriseva.in
# Should show the two Cloudflare nameservers.

curl -I https://kriseva.in/
# 200 OK · server: cloudflare · valid SSL · security headers from _headers file.
```

---

## Phase C — Post-deploy hygiene

### Force HTTPS

In Cloudflare dashboard → SSL/TLS:

- **SSL/TLS → Overview** → set encryption mode to **"Full (strict)"**. (Pages always serves HTTPS at the origin, so this is safe.)
- **SSL/TLS → Edge Certificates** → toggle **"Always Use HTTPS"** ON.
- **SSL/TLS → Edge Certificates** → toggle **"Automatic HTTPS Rewrites"** ON.

### Optional polish

- **Speed → Optimization** → enable **"Brotli"** compression (usually auto).
- **Caching → Configuration** → set **Browser Cache TTL** to "Respect Existing Headers" (so our `_headers` file controls it).
- **Network** → enable **HTTP/3 (with QUIC)** if not already on.
- **Analytics & Logs → Web Analytics** → enable for the site (privacy-friendly, cookie-less).

### Confirm canonical domain choice

Decide one:
- **Apex (kriseva.in) is canonical** (recommended for cleanliness): in `website/public/_redirects`, uncomment the `www → apex` rule, push, redeploy.
- **www.kriseva.in is canonical**: uncomment the `apex → www` rule instead.

Either works; pick one and stay consistent across SEO + sharing.

---

## Phase D — Verify the live site

```sh
# Routes
for path in / /tas /workflow /security /issuer-roadmap /validation /founder /contact /notarealroute; do
  printf "%-20s %s\n" "$path" "$(curl -s -o /dev/null -w "%{http_code}" "https://kriseva.in$path")"
done

# Headers (look for security + cache control)
curl -sI https://kriseva.in/ | head -20

# OG card preview
curl -sI https://kriseva.in/assets/brand/kriseva-og.png
```

Expected:
- `/` → `200`
- All 8 valid routes → `200`
- `/notarealroute` → `404` (and renders the 404 dossier page; Cloudflare Pages serves /404.html on miss)
- Headers include `cf-ray`, `server: cloudflare`, `strict-transport-security`, `content-security-policy`, `x-frame-options: DENY`.

---

## Auto-deploy on every push

Now that Pages is connected:

```sh
# Make any change locally:
cd /Users/aloo/Downloads/kriseva-website-v1/website
# ... edit src/...

# Push:
cd ..
git add <files>
git commit -m "your message"
git push

# ~30 seconds later, Cloudflare builds. ~1 minute later, kriseva.in is updated.
```

Watch deploys live: Cloudflare dashboard → Pages project → **Deployments** tab.

Preview deploys for branches: every non-main branch gets a unique preview URL (`<branch>.kriseva-website.pages.dev`). Useful for review before merging.

---

## Rollback if a deploy breaks production

Cloudflare keeps the last 100 deploys. To roll back:

1. Pages project → **Deployments** tab.
2. Find the last known-good deploy → click the `…` → **Rollback**.

Or push a `git revert <bad-commit-sha>` and let it auto-redeploy.

---

## Costs and limits (free tier)

| Limit | Free tier | Likely usage |
|---|---|---|
| Builds per month | 500 | < 50 unless you push 15× per day |
| Bandwidth | unlimited | n/a |
| Requests | unlimited | n/a |
| Custom domains | unlimited | 2 (apex + www) |
| Concurrent builds | 1 | n/a |
| Build time per build | 20 min | ours runs in 1 min |
| Files per deploy | 20,000 | we have ~50 |
| File size | 25 MB per file | largest is 832 KB screenshot |

Comfortable headroom on every dimension.

---

## Stage 6 / 7 release-gate carry-over

The Stage 7 final release gate noted **one human approval** required before public deploy:

> **H1 — Founder review of seeded-demo data on the 6 TAS screenshots before kriseva.in DNS cutover.**

If you have not yet reviewed the 6 PNG screenshots in `website/public/assets/screenshots/` for any sensitive content, do that **before completing Phase B** (the DNS cutover that puts the site at `kriseva.in`). The screenshots already carry "SEEDED DEMO" disclosures in the UI, but a human eyeball before going live is the policy.

Phase A (deploy to `kriseva-website.pages.dev`) does not trigger H1 — that subdomain is internal and doesn't carry the kriseva.in identity. You can safely run Phase A any time.

---

## What's NOT in this runbook (deferred)

- **Form backend.** The contact form is a transparent `mailto:` compose. To add a server-side endpoint, you'd add a Cloudflare Worker or a third-party service (Formspree, etc.) — and update the privacy disclosure first.
- **Analytics.** Cloudflare Web Analytics is privacy-friendly + cookie-less and one-toggle to enable. No GA4. No marketing pixels.
- **Multi-region / edge logic.** Pages already serves from edge by default. No additional config needed for a static site.
- **Automated visual regression in CI.** The Playwright snapshot suite exists locally; wiring it into Cloudflare Pages Preview deploys is a future task.
