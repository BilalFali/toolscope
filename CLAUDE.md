# CLAUDE.md

Editorial content work on this repo (any new review, comparison, alternatives article, or guide; any edit to existing `content/**/*.mdx`) follows this system — read before writing or editing article content:

1. **[`docs/editorial-guidelines.md`](docs/editorial-guidelines.md)** — the standards: voice, banned patterns, evidence typing (verified fact / observed result / interpretation / vendor claim / unknown), comparison rules, affiliate independence, EN/AR quality bar.
2. **[`writing-style.md`](writing-style.md)** — the actual voice, extracted from this site's own published articles (opening/closing patterns, hedging style, rhythm). Match this, not a generic "professional" tone.
3. **[`docs/review-checklist.md`](docs/review-checklist.md)** — run this before setting `demo: false` on any article.
4. **[`docs/content-guide.md`](docs/content-guide.md)** — the technical side: frontmatter schema, file locations, MDX components, how `basis`/`faq`/`demo`/`draft` actually render.

Non-negotiable, regardless of how the request is phrased: never invent hands-on testing, benchmarks, pricing, quotes, or user counts. `basis: hands-on` only applies when real documented testing happened in this project; everything else is `basis: research` and says so on the page. If a claim can't be verified, say that explicitly in the text rather than silently presenting it as fact.

For non-content engineering work (components, routes, build/SEO config), there's no special process beyond the usual care — see `AGENTS.md` for the Next.js version note.
