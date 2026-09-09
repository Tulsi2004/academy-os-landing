# Admin panel

A password-protected analytics + leads dashboard at `/admin` for this landing site.

**This site is `academy`.** Both landing sites (`academy-os-landing`, `tulsi-landing`)
share one Postgres database; every row carries a `site` column, and each panel only
ever reads its own. The constant lives in [`lib/site.ts`](lib/site.ts) — it is a
build-time constant, not an env var, so the two deployments cannot be misconfigured
into reading each other's traffic.

> **This repo owns the migrations.** `prisma/migrations` is the single source of
> truth for the shared schema. `tulsi-landing` keeps a copy of `schema.prisma`
> with identical models but only runs `prisma generate`. When you change the schema,
> migrate here and copy the schema file across.

---

## 1. Setup

### Environment

Add to `.env.local` (see `.env.example`):

```bash
DATABASE_URL="postgresql://..."      # shared with tulsi-landing — same value
SESSION_SECRET="..."                 # different per site, so cookies aren't portable
ADMIN_PASSWORD="..."                 # your login password
```

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Any Postgres works — Neon, Supabase, Railway, or local Docker.

### Database

```bash
npm run db:deploy     # apply migrations (also runs automatically on `npm run build`)
npm run db:studio     # browse the data
```

If `prisma migrate dev` hangs against a pooled connection string (common on Neon),
use the direct/unpooled URL for migrations.

### Run it

```bash
npm run dev
```

Then open `/admin`, and log in with `ADMIN_PASSWORD`.

---

## 2. What's in it

| Page | What it shows |
|---|---|
| `/admin` | 7 KPI tiles, 30-day chart, conversion funnel, traffic sources, recent leads |
| `/admin/leads` | All leads, status filters, inline status editing, CSV export |
| `/admin/sessions` | Last 100 sessions: device, location, IP, attribution, bounce, replay link |
| `/admin/sessions/:id/replay` | rrweb session playback |
| `/admin/heatmap` | Click/hover heatmap over a live iframe of the real page |
| `/admin/funnels` | Page view → scroll → CTA → form start → lead, with drop-off |
| `/admin/ctas` | Per-CTA viewed / hovered / clicked / CTR |
| `/admin/forms` | Per-form viewed / started / submitted / abandoned / errors |
| `/admin/performance` | Core Web Vitals (LCP, INP, CLS, FCP, TTFB) from real visitors |
| `/admin/errors` | Last 100 client-side JS errors |
| `/admin/reports` | Date-range picker, stat tiles, CSV/XLSX/PDF exports |

### API routes

| Route | Auth | Purpose |
|---|---|---|
| `POST /api/track` | public | Batched analytics beacon |
| `POST /api/leads` | public | Create a lead |
| `POST /api/replay` | public | Store a gzip'd rrweb chunk |
| `GET /api/reports/overview` | admin | `?format=csv\|xlsx\|pdf` |
| `GET /api/reports/leads` | admin | `?format=csv\|xlsx` |

---

## 3. Instrumenting the public page

Tracking is automatic for page views, scroll depth, Web Vitals, JS errors, rage
and dead clicks, and heatmap coordinates. Two things opt in by attribute:

**CTAs** — add `data-cta` to any button or link:

```tsx
<a href="/signup" data-cta="hero-start">Start now</a>
```

That element is then counted on `/admin/ctas` for views (scrolled at least
halfway into view), hovers, and clicks.

**Forms** — add `data-form` to the form or its wrapper:

```tsx
<form data-form="contact"> ... </form>
```

The full funnel (viewed → started → field focus/complete → validation errors →
submitted, or abandoned) then appears on `/admin/forms`.

### Leads

**There is no public lead form yet** — this site currently contacts via `mailto:`
and WhatsApp. The `Lead` table, `/api/leads`, and `/admin/leads` are built and
working, so the Leads page stays empty until a form posts to it:

```ts
await fetch("/api/leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name, email, phone, company, message,
    formId: "contact",
    company_website: "",   // honeypot — must stay empty
  }),
});
```

Either an email or a phone number is required. A filled `company_website` is
treated as a bot and silently discarded.

---

## 4. Notes and limitations

- **Password auth is deliberately simple.** One shared password, compared in
  constant time, no hashing, no rate limiting, no lockout. Fine for a single
  operator behind HTTPS; harden it if more people need access or if it must
  resist brute force.
- **Geo/IP** come from Vercel's edge headers and are `null` in local dev and on
  non-Vercel hosts.
- **Session replay** masks all form inputs at capture time; the values are never
  sent or stored. It respects `navigator.doNotTrack` and a
  `tulsi_va_replay_optout` localStorage flag. Add a consent gate before relying
  on it in production under GDPR.
- **Day bucketing is UTC**, not local time.
- **`pdfkit` must stay in `serverExternalPackages`** in `next.config.ts` — it
  reads font metrics from disk and PDF export breaks at runtime if bundled.
- Both `/admin` and `/api` are disallowed in `robots.txt` and the panel sets
  `noindex`.
