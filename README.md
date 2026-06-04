# Sprint Labs

AI-native product studio based in London. Built with TanStack Start (SSR), Vite, Tailwind CSS and React 19.

**Live site:** sprintlabs.uk  
**Contact:** luke@sprintlabs.uk

---

## Local development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000`.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start (SSR) |
| Build tool | Vite + Nitro |
| Styling | Tailwind CSS v4 + inline CSS variables |
| Language | TypeScript |
| Package manager | npm / bun |
| Hosting | Vercel |
| Domain & DNS | Cloudflare |
| Email | Google Workspace |

---

## Deployment

### Infrastructure overview

```
sprintlabs.uk
    └── Cloudflare DNS
            └── Vercel (hosting + SSL)
                    └── Sprint Labs website
```

- **Vercel** — builds and serves the website. Handles SSL automatically.
- **Cloudflare** — manages the domain and DNS records. Acts as a pass-through (DNS only, not proxied) so Vercel controls SSL.
- **Google Workspace** — handles all email for `@sprintlabs.uk`. DNS records for email (MX, SPF, DKIM, DMARC) must not be changed when updating website DNS.

---

### Step 1 — Vercel setup

#### Connect the repository

1. Log in to [vercel.com](https://vercel.com)
2. Click **Add New → Project**
3. Import the `lukeylumwork-dot/sprint-labs-v1` GitHub repository
4. Set the framework preset to **Other**

#### Build configuration

| Setting | Value |
|---|---|
| Framework preset | Other |
| Build command | `npm run build` |
| Output directory | `.vercel/output` |
| Install command | `npm install` |
| Node.js version | 20.x (or latest LTS) |

#### Environment variables

No environment variables are required. The Nitro preset (`vercel`) is set directly in `vite.config.ts`.

> **If you previously added `NITRO_PRESET` as a Vercel environment variable, delete it.** An env var overrides the config file and `vercel_edge` (the old Nitro v2 name) will cause a build error in Nitro 3.x.

Do not add API keys, secrets or tokens.

#### Add domains

In Vercel project settings under **Domains**, add both:

- `sprintlabs.uk`
- `www.sprintlabs.uk`

Set `sprintlabs.uk` as the primary domain. Configure `www.sprintlabs.uk` to redirect to `sprintlabs.uk` (Vercel handles this automatically when both are added).

After adding the domains, Vercel will display the DNS records you need to enter in Cloudflare. **Use those exact values** — do not use the example values in this document.

---

### Step 2 — Cloudflare DNS setup

#### Website records (add these from Vercel)

Vercel will provide the exact record values when you add your domain. The typical pattern is:

| Type | Name | Value | Proxy |
|---|---|---|---|
| `A` | `@` (apex) | Vercel IP (shown in Vercel dashboard) | **DNS only** ☁️ |
| `CNAME` | `www` | `cname.vercel-dns.com` | **DNS only** ☁️ |

> **Important — proxy mode:** Set both records to **DNS only** (grey cloud) initially, not proxied (orange cloud). Vercel handles SSL directly. If Cloudflare proxying is enabled, it can interfere with Vercel's SSL certificate provisioning. Once the site is live and the SSL certificate is confirmed active, you can test proxied mode if needed.

#### Email records (do not touch)

Google Workspace uses DNS records for email delivery. **Do not delete, modify or replace any of the following record types** when updating DNS for the website:

- `MX` records (mail routing)
- `TXT` records starting with `v=spf1` (SPF)
- `TXT` records starting with `v=DKIM1` (DKIM)
- `TXT` records containing `v=DMARC1` (DMARC)

Website A and CNAME records are completely separate from email records. Adding or updating website records will not affect email delivery, as long as the email records are left in place.

---

### Step 3 — Verify

After DNS propagates (usually within 15 minutes on Cloudflare, up to 24 hours in edge cases):

1. Visit `https://sprintlabs.uk` — confirm the site loads over HTTPS
2. Visit `https://www.sprintlabs.uk` — confirm it redirects to the apex domain
3. Check the SSL certificate in the browser — should show issued by Vercel/Let's Encrypt
4. In Vercel dashboard, confirm both domains show a green checkmark

---

## Deployment checklist

Use this before and after each deployment.

**Initial setup (one-time)**

- [ ] Connect GitHub repo to Vercel
- [ ] Set framework preset to **Other** in Vercel
- [ ] Set `NITRO_PRESET=vercel_edge` environment variable in Vercel
- [ ] Add `sprintlabs.uk` and `www.sprintlabs.uk` in Vercel domains
- [ ] Copy Vercel-provided DNS records into Cloudflare
- [ ] Set Cloudflare records to **DNS only** (not proxied)
- [ ] Wait for DNS propagation
- [ ] Confirm SSL certificate is active in Vercel dashboard

**Post-deployment verification (every deploy)**

- [ ] Homepage loads at `https://sprintlabs.uk`
- [ ] Page renders correctly on mobile
- [ ] **Book free discovery call** (Calendly) button opens `calendly.com/luke-sprintlabs/30min` in a new tab
- [ ] **Talk through an idea** (mailto) opens email client with `luke@sprintlabs.uk` and subject pre-filled
- [ ] Send a test email to `luke@sprintlabs.uk` to confirm Google Workspace email still works
- [ ] No console errors in browser devtools

---

## Project structure

```
src/
├── routes/
│   ├── __root.tsx          Root layout and error pages
│   └── index.tsx           Landing page (all content, styles and logic)
├── components/ui/          shadcn/ui component library (available, not used on landing page)
├── lib/                    Utilities and server error handling
├── server.ts               Nitro server entry (SSR error wrapper)
├── start.ts                TanStack Start instance
├── router.tsx              Router configuration
└── styles.css              Global Tailwind base styles
```

All landing page content, CSS and interactive logic lives in `src/routes/index.tsx`. Constants for CTAs, copy arrays and contact details are defined at the top of that file.

---

## Content constants (index.tsx)

| Constant | Purpose |
|---|---|
| `CALENDLY_URL` | Primary CTA destination — Calendly booking link |
| `CTA_EMAIL` | Secondary CTA — mailto with subject line pre-filled |
| `TICKER_ITEMS` | Scrolling ticker content |
| `SECTORS` | Sector list in the proof bar |
| `OUTCOMES` | Services / entry points cards |
| `PROCESS_STEPS` | Brief. Build. Ship. steps |
| `CAPABILITIES` | What we can build cards |
