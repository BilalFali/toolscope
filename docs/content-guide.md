# Content Guide

Everything on ToolScope is a Markdown/MDX file in `content/`. No database, no CMS, no admin panel. Publishing = adding a file and deploying.

```
content/
  en/
    reviews/<slug>.mdx        → /en/reviews/<slug>
    compare/<slug>.mdx        → /en/compare/<slug>
    alternatives/<slug>.mdx   → /en/alternatives/<slug>
    guides/<slug>.mdx         → /en/guides/<slug>
    pages/<slug>.mdx          → /en/<slug>   (about, policies, contact…)
  ar/                         → identical structure, /ar/… URLs
```

## Frontmatter reference

Every article requires (zod-validated — a typo fails the build with the file named):

```yaml
---
id: cursor-review          # stable key shared by translations of the same article
title: "Cursor Review: …"  # also used for <title> and OG image
description: "…"           # 10–300 chars; meta description + card text
author: "The Editor"
publishedAt: "2026-10-18"  # ISO date YYYY-MM-DD
tags: ["code editors", "AI coding"]
demo: true                 # DEMONSTRATION content — see rules below
---
```

Optional, all types: `updatedAt`, `featured: true` (homepage flagship), `noindex: true`, `draft: true` (excluded from listings/search/sitemap; page still renders with a draft banner for previewing).

**Review-only** (`content/*/reviews/`):

```yaml
category: ai-tools            # ai-tools | developer-tools | software
product:
  name: "Cursor"
  website: "https://cursor.com"
  developer: "Anysphere"      # optional
score: 8.9                    # ONLY when testing is complete. Omit → "Rating pending"
verdict: "One-sentence editorial verdict."
bestFor: ["…"]                # green panel in the verdict card
notFor: ["…"]                 # grey panel in the verdict card
pros: ["…"]                   # rendered by the pros/cons component
cons: ["…"]
pricing:                      # rendered as the pricing table
  - plan: "Pro"
    price: "$20/mo"
    notes: "Full features"    # optional
pricingCheckedAt: "2026-10-20" # shown in the table header; omit → "not verified" badge
testingNotes: "Short hands-on summary rendered in the testing-notes module."
alternatives: ["windsurf-review"]  # product/article ids for the alternatives rail
```

**Comparison-only** (`compare/`): `items` (min 2) each with `name`, `url`, optional `reviewSlug`, `tagline`, `bestFor`, `pricing`, `pros`, `cons`; plus optional `winner` (name) and `winnerNote`.

**Alternatives-only** (`alternatives/`): `replaces: "Cursor"` + `picks[]` with `name`, `url`, `tagline`, `bestFor`.

**Guide-only** (`guides/`): optional `level: beginner | intermediate | advanced`.

**Static pages** (`pages/`): only `title`, `description`, optional `updatedAt`, `noindex`.

## Writing the body

MDX with GFM tables. Custom components available inside any article:

```mdx
<Callout title="Optional title" tone="pos">   {/* tones: brand | pos | neg | neutral */}
Important aside — renders as a bordered callout.
</Callout>

<AffiliateLink product="cursor" url="https://cursor.com">
  Visit Cursor
</AffiliateLink>
```

`AffiliateLink` resolves `product` against `config/affiliates.ts`:
- entry exists → tracked URL, `rel="sponsored nofollow"`, ※ marker, commission disclosure
- no entry → plain link to `url`, `rel="nofollow"`, ↗ marker, **no commission claim**
- neither → honest "no affiliate program configured" placeholder

External links in prose are automatically `nofollow noopener`.

## Integrity rules (enforced, not aspirational)

- `demo: true` → visible **Demonstration content** banner, `noindex, nofollow`, excluded from the sitemap, no `Article` structured data, score labeled **Sample**. Use for every article until its testing is genuinely complete — then flip to `demo: false` and re-verify every claim.
- **Never set a `score` you didn't earn.** The schema accepts it; the publication's credibility doesn't.
- `pricingCheckedAt` older than ~60 days at review → re-verify before updating.
- `draft: true` → draft banner + noindex; excluded from listings, search index, sitemap.

## How to: common tasks

**Create a new review** — copy `content/en/reviews/obsidian-notes.mdx`, rename the file (the filename becomes the slug), rewrite frontmatter + body, keep `demo: true` until testing completes. The page, card, TOC, breadcrumbs, metadata, and OG image all generate automatically.

**Create a comparison** — copy `content/en/compare/cursor-vs-windsurf.mdx`, fill `items` with both products, structure the body as framework → side-by-side table → recommendation.

**Add the Arabic version of an article** — create `content/ar/<type>/<slug>.mdx` with the **same `id`** as the English article (slug may differ). The language switcher, hreflang pair, and "also available in" line activate automatically — but only when both versions exist. Arabic bodies are independent editorial work, not machine translations.

**Add an affiliate link** — join the program, add one entry to `config/affiliates.ts` (`productId → affiliateUrl, provider, since`), use `<AffiliateLink product="productId">` in articles. The disclosure page (`content/*/pages/affiliate-disclosure.mdx`) must be updated in the same change.

**Update pricing** — edit the review's `pricing` rows, bump `pricingCheckedAt` to today. The table header shows the check date.

**Publish/deploy** — commit and push to the connected Git repository; Vercel builds on push. Checklist before flipping an article from `demo: false` to real:
1. Every factual claim traced to testing you actually did
2. `pricingCheckedAt` current
3. `score` set only if the methodology page's criteria were met
4. Remove any leftover "placeholder" notes in the body

## Language behavior

- English is default: the proxy redirects `/`, `/about`, … → `/en/…` (308).
- Content slugs are independent per language — an Arabic review does not need to exist for the English one to publish.
- The search index spans both languages and normalizes Arabic (diacritics, alef/ya/ta-marbuta variants).
