# Implementation Plan — Independent Software Review Publication

> Status: **COMPLETE** (all 5 phases implemented, QA'd, and verified 2026-10-26).
> Brand placeholder: **ToolScope** (fully configurable in `config/site.ts` — change one file to rebrand).
> Authoring workflow documentation: `docs/content-guide.md`.

---

## 1. Repository audit (findings before any change)

| Aspect | Finding |
|---|---|
| Existing code | **None.** The workspace was empty — no framework, dependencies, routes, or styling system existed. |
| Provided assets | A zip (`stitch_toolscope_editorial_review_platform.zip`) containing **Stitch design exports**: 7 full-page HTML mockups + screenshots + a design-system spec (`authoritative_editorial_benchmark/DESIGN.md`). These are **design references, not a working project**. Assets preserved at `docs/design/`. |
| Design system | "Authoritative Editorial & Benchmark": warm parchment canvas `#FAF9F6`, white cards with `#E5E5E0` hairline borders, ink text `#1A1A1E`, cobalt indigo accent `#2D46B9`, emerald `#0D7A53` (pros), crimson `#B42318` (cons). Typography: **Newsreader** (editorial headings) + **Inter** (UI/body, tabular numerals); Arabic pairs **IBM Plex Sans Arabic** (body) + **Amiri** (headings). Small radii (4–8px), pills only for tags/badges, 1px borders instead of shadows, sticky blurred header, 680–740px reading measure. |
| Designed screens | EN homepage, AI-tools category, in-depth review, head-to-head comparison, search results, AR homepage, AR article review. |
| Package managers available | Node **v24.15.0**, npm **11.12.1**, git 2.54.0 (Windows). No pnpm/yarn → **npm** is the package manager. |
| Next.js / React versions installed | **None installed** (empty repo). Decision: scaffold the latest Next.js (App Router) + React it provides via `create-next-app`, then verify exact versions in `package.json` before choosing dependencies. |

### What is reusable from the provided assets
- The **visual language** (palette, type scale, spacing, component anatomy) → translated into Tailwind theme tokens.
- The **page blueprints** → component structure for homepage, category, review, comparison, search.
- The **HTML exports** → cross-checked for interaction details (sticky TOC, utility disclosure rail, leaderboard tables).

### What is deliberately NOT copied from the designs
The mockups contain **fabricated editorial claims** ("940 lab hours logged", "40+ hours lab tested", "Editor's Choice", specific benchmark percentages). These are treated as layout placeholders only. The implementation replaces them with:
- an explicit **demonstration-content banner** on every sample article,
- score displays labeled **"Sample"** until a real score exists in frontmatter,
- category stats computed from **real content counts**, not invented hours,
- no `Review`/`aggregateRating` structured data until genuinely supported by visible content.

---

## 2. Stack decisions

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript strict | Required; Vercel-compatible, SSG-first. |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) | Default with current scaffold; tokens map 1:1 to the design spec. Logical utilities (`ms/me/ps/pe/start/end`) make RTL nearly free. |
| Content | MDX files in `content/<lang>/<type>/<slug>.mdx`, parsed with `gray-matter`, rendered with `next-mdx-remote/rsc`, validated with **zod** frontmatter schemas | Content stays separate from presentation; publishing = adding a file to git. No DB, no auth, no paid CMS. |
| MDX plugins | `remark-gfm` (tables), `rehype-slug` (heading anchors for TOC) | Comparison/pricing tables are core content. |
| i18n | Hand-rolled `[lang]` segment (`en`, `ar`) + locale-prefixing middleware; no i18n framework | ~50 lines of middleware covers the requirements without a dependency. English default at `/en/…`; `/`, `/about`, `/search`, … 308-redirect to `/en/…`. |
| RTL | `dir="rtl"` set on `<html>` in `[lang]/layout.tsx` + logical CSS utilities + Arabic font swap | Verifiable at mobile/desktop sizes. |
| Search | Client-side filter over a build-time index (frontmatter + headings) passed from server component to client component; Arabic normalization (strip diacritics, unify alef/ya/ta-marbuta) | Zero infra, works statically on Vercel, honest for a small corpus. |
| Analytics | GA4 via `next/script`, gated behind a consent banner, `NEXT_PUBLIC_GA_MEASUREMENT_ID` env; GSC verification via `NEXT_PUBLIC_GSC_VERIFICATION` env | Configurable, no hardcoded secrets, consent respected. |
| Affiliate | Central registry `config/affiliates.ts` + `<AffiliateLink productId>` component (`rel="sponsored nofollow"`, external icon, disclosure) | Solo-publisher friendly: one file to manage all links. |
| Ads | `<AdSlot>` component, disabled by default (`NEXT_PUBLIC_ADS_ENABLED`), always labeled, never styled like navigation | Monetization-ready without depending on it. |
| Newsletter | Consent-first form; disabled with an honest notice until `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` is set | No fake success states. |
| OG images | `next/og` (`ImageResponse`) with committed OFL WOFF fonts (Inter + IBM Plex Sans Arabic) | Branded social cards with no binary design tooling. |

**Explicitly excluded:** Supabase/database, authentication, paid CMS, custom admin panel, heavy UI kits, dark mode (designs are light-only), comment systems.

---

## 3. Architecture

```
app/
  layout.tsx                  → minimal pass-through (html lives in [lang])
  globals.css                 → Tailwind v4 tokens from DESIGN.md
  [lang]/                     → en | ar (generateStaticParams + validate)
    layout.tsx                → <html lang dir>, fonts, Header, Footer, ConsentBanner
    page.tsx                  → homepage
    page/[slug]/page.tsx      → not used; static pages get explicit routes below
    about | editorial-policy | testing-methodology | affiliate-disclosure |
    contact | privacy-policy | terms        → all render content/<lang>/pages/<slug>.mdx
    search/page.tsx           → client search over build-time index
    reviews/ | compare/ | alternatives/ | guides/
        page.tsx              → archive index
        [slug]/page.tsx       → article template (type-aware components)
    ai-tools/ | developer-tools/ | software/
        page.tsx              → category template (flagship + grid + tag filters)
    not-found.tsx             → localized 404
  sitemap.ts, robots.ts       → generated from content collections
middleware.ts                → locale prefix redirect (/, /about → /en/…)
config/
  site.ts                     → brand, domain, nav, locale config (single source of truth)
  affiliates.ts               → product → affiliate URL registry
  navigation.ts               → trending chips, footer links
content/
  en/{reviews,compare,alternatives,guides,pages}/*.mdx
  ar/{reviews,compare,alternatives,guides,pages}/*.mdx
components/ (layout/, article/, home/, seo/, monetization/, ui/)
lib/ (content.ts, i18n.ts, search.ts, toc.ts, seo.ts, reading-time.ts, arabic.ts)
```

### Content model (frontmatter, zod-validated)
Shared: `id` (stable translation key), `title`, `description`, `type`, `category?`, `tags[]`, `author`, `publishedAt`, `updatedAt?`, `featured?`, `demo`, `draft?`, `noindex?`.
Review extras: `product{name,website}`, `score?` (0–10, real data only), `verdict?`, `bestFor[]`, `notFor[]`, `pros[]`, `cons[]`, `pricing[]` + `pricingCheckedAt?`, `alternatives?[]`.
Compare extras: `items[{name,url,slug?,score?,tagline,bestFor[],pricing[]}]`, `winner?`.

**Demo flag rules:** `demo: true` → visible "Demonstration content" banner, `noindex`, no `Review` schema, score badge labeled "Sample". Drafts → excluded from listings/search/sitemap, `noindex`, "Draft" banner.

---

## 4. Phases

### Phase 1 — Foundation
Scaffold (create-next-app, npm, TS strict, Tailwind, ESLint) → design tokens in `globals.css` → `config/site.ts` → fonts via `next/font` (Newsreader, Inter, IBM Plex Sans Arabic, Amiri) → root `[lang]` layout + middleware → Header (utility disclosure rail, wordmark, nav, search box, EN|AR switch) + Footer + UI primitives (Container, Badge, Card, buttons, SectionHeading).

### Phase 2 — Core experience
Content pipeline (`lib/content.ts`: read, validate, sort, filter, counts) → homepage (hero, featured review, latest reviews, 3 category blocks, comparisons, How We Test, newsletter) → category template → review / compare / alternatives / guides templates + archive indexes → search page.

### Phase 3 — Publishing & languages
Sample content: 1 flagship review (Cursor) + 2 further reviews, 1 comparison (Cursor vs Windsurf), 1 alternatives article, 1 guide — all `demo: true` → Arabic homepage categories + 3 Arabic articles (incl. 1 review demonstrating RTL) → Arabic static pages → language switcher with translation-aware fallback → hreflang/canonical only when counterparts exist → RTL QA.

### Phase 4 — SEO & monetization
Per-page `generateMetadata` (title/description/canonical/OG/Twitter) → `sitemap.ts` + `robots.ts` (demo/draft/search excluded) → JSON-LD (WebSite+SearchAction, Organization, BreadcrumbList, Article only for non-demo) → dynamic OG images → affiliate registry + disclosure components → AdSlot → GA4 + consent banner + GSC verification point.

### Phase 5 — QA
`npm run lint`, `tsc --noEmit`, `next build` → run prod server and verify every route (200 + key content) → link check → RTL + responsive screenshots (browser tooling) → a11y pass (landmarks, keyboard, contrast) → finalize `README.md` + `docs/content-guide.md`.

---

## 5. Assumptions (non-blocking questions → default answers)

| Question | Assumption |
|---|---|
| Brand name / domain? | **ToolScope** placeholder; `NEXT_PUBLIC_SITE_URL` defaults to `https://toolscope.example` until real domain exists. |
| Affiliate programs? | None joined yet → registry ships empty; components render honest placeholders, never imply relationships. |
| Analytics IDs? | None yet → GA/consent banner inactive until `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. |
| Newsletter backend? | None → form renders disabled with notice until endpoint configured. |
| Locale routing for required unprefixed URLs (`/search`, `/about`, …)? | 308-redirect to `/en/…` via middleware; canonical URLs always locale-prefixed. |
| Arabic page coverage? | Full parity (all static pages + categories translated), since nav links must never 404. |
| Package manager? | npm (only one available). |

**No implementation blockers identified.**

## 6. Risks & mitigations

| Risk | Mitigation |
|---|---|
| `next-mdx-remote/rsc` compat with scaffolded Next major | Verify at first build; fallback is direct `@mdx-js/mdx` compile (SSG-only). |
| Arabic typography rendering (RTL tables, code blocks) | Logical utilities + explicit `[dir=rtl]` table/code overrides; QA at 375px & 1280px. |
| OG image fonts for Arabic | Committed WOFF fonts; if download unavailable, degrade to default fonts (Latin-only OG acceptable initially). |
| Build-time font download (next/font) needs network | Vercel and local npm both have network; documented. |
| Fabricated-claims leakage from designs | Demo flag enforced in templates; QA checklist item: no unmarked scores/metrics anywhere. |
