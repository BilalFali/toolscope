# ToolScope — Independent Software Review Publication

A bilingual (English/Arabic) software review website built with Next.js 16, TypeScript, Tailwind CSS v4, and file-based MDX content. Zero databases, zero paid services — deployable free on Vercel.

> **ToolScope is a placeholder brand.** Rebrand by editing `config/site.ts` (`name`, `url`, tagline) — one file.

## Quick start

```bash
npm install
npm run dev        # development at http://localhost:3000 (redirects to /en)
npm run build      # production build (also runs TypeScript checks)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

All site content lives in `content/` — see **[docs/content-guide.md](docs/content-guide.md)** for the authoring workflow (creating reviews, comparisons, Arabic translations, affiliate links, pricing updates).

## What's inside

- **Homepage, categories, archives** — `/en|ar` + `/en/ai-tools`, `/en/developer-tools`, `/en/software`, and `/reviews`, `/compare`, `/alternatives`, `/guides` indexes
- **Article templates** — one template renders all four content types with verdict card, pros/cons, pricing table, testing notes, TOC sidebar, related articles
- **Search** — client-side over a build-time bilingual index with Arabic normalization (`/en/search?q=…`)
- **i18n** — `/en` and `/ar` with true RTL, separate Arabic typography (Amiri + IBM Plex Sans Arabic), language switcher, hreflang only where translations exist; unprefixed URLs 308-redirect to `/en`
- **SEO** — per-page metadata, canonical URLs, `sitemap.xml`, `robots.txt`, dynamic OG images (`/og?title=…&locale=ar` renders Arabic correctly), BreadcrumbList/WebSite/Organization JSON-LD (Article schema only for non-demo content — never fake review ratings)
- **Monetization-ready** — centralized affiliate registry (`config/affiliates.ts`) with `rel="sponsored nofollow"`, labeled ad placeholders (off by default), consent-gated GA4
- **Editorial integrity** — every sample article is flagged `demo: true`: visible demonstration banner, noindex, no structured data, scores labeled "Sample"

## Environment variables

Copy `.env.example` → `.env.local`. **Everything is optional** — the site builds and runs with placeholders when unset.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical/sitemap/hreflang base URL |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 ID; unset = no analytics, no consent banner, no cookies |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Search Console HTML-tag verification |
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | POST endpoint for the consent-gated signup form |
| `NEXT_PUBLIC_ADS_ENABLED` | `true` renders labeled ad placeholders |
| `NEXT_PUBLIC_LOGO_DEV_TOKEN` | logo.dev publishable token for product logos (monogram fallback) |

No secrets belong in this repo: everything is `NEXT_PUBLIC_*` by design.

## Deployment (Vercel, free tier)

1. Push this repository to GitHub.
2. In Vercel: **Add New Project → Import** the repo. Framework preset auto-detects Next.js.
3. Set environment variables from the table above (at minimum `NEXT_PUBLIC_SITE_URL` with your real domain).
4. Deploy. Static pages are prerendered at build; content changes ship by git push.
5. Add your domain in Vercel → Settings → Domains, then verify in Google Search Console (set `NEXT_PUBLIC_GSC_VERIFICATION` or upload the HTML file) and submit `https://your-domain/sitemap.xml`.

Local production check before pushing:

```bash
npm run build && npm run start   # http://localhost:3000
```

## Project structure

```
app/[lang]/…          routes (en|ar): home, categories, archives, [slug] articles,
                      search, static pages, localized 404
app/og/route.tsx      dynamic OG images (Inter / IBM Plex Sans Arabic)
app/sitemap.ts        sitemap from content collections (demo/draft excluded)
app/robots.ts         robots rules
proxy.ts              locale redirect: / → /en (or /ar by Accept-Language)
components/           layout, article, home, pages, monetization, seo, ui
config/site.ts        brand, categories, locales, integrations (single source of truth)
config/affiliates.ts  affiliate registry — the only place monetized URLs live
content/en|ar/        MDX articles and static pages per language
lib/                  content pipeline (zod-validated), i18n, seo, search, toc
docs/                 implementation plan, content guide, design reference (docs/design)
```

## Quality checks performed

- `npm run lint` and `npm run typecheck` clean; production build succeeds (77 static pages)
- All routes return 200 in both languages; 49 unique internal links verified
- Redirects (308), 404 handling, hreflang/canonical, `noindex` on demo content verified
- RTL verified by screenshot at desktop (1280px) and mobile (375px) widths
