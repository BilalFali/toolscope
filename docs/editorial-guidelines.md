# Editorial Guidelines

These standards govern everything published on this site, in English and Arabic. They exist to make the publication trustworthy — and to make trust auditable: every rule below is checkable on the page itself.

The companion **[review checklist](review-checklist.md)** turns these rules into a pre-publication pass.

---

## 1. Voice

Write as a knowledgeable software reviewer with practical experience: professional, direct, specific. Confident where evidence supports a conclusion; explicit where it doesn't. Helpful without being promotional. Technically accurate, understandable to non-technical readers, and independent of affiliate relationships.

Concretely:

- **Specific beats vague.** "Search over 10k notes returns in under a second on a 2020 mid-range laptop" is usable. "Blazing fast search" is noise.
- **Honest uncertainty is a feature.** "We could not verify X" or "this depends on your setup" is better than a confident guess.
- **Criticism is allowed.** Every product has real disadvantages; say them plainly, with their consequences.

Never invent first-hand testing, personal anecdotes, quotations, credentials, or opinions attributed to real people. Do not pretend to experiences the editorial process cannot verify.

## 2. Banned patterns

The following are rejected at editing, in both languages:

- Landscape openers: "In today's rapidly evolving digital landscape…", "In the ever-changing world of technology…"
- Audience hedging: "Whether you're a beginner or an experienced professional…"
- Sales copy: "Look no further", "Unlock the full potential", "Game-changing", "Revolutionary", "The ultimate guide", "seamlessly integrates"
- Filler: "It's worth noting that", "Let's dive in", a routine "In conclusion" heading
- Unearned adjectives: "powerful", "innovative", "easy to use" without supporting specifics
- Mechanical repetition of the product name in every paragraph
- Formulaic paragraph rhythm (same-length paragraphs, summary after every section)
- Artificially balanced pros/cons when the evidence is not balanced
- Invented customer quotes or user counts

Short sentences are fine when they carry information. Vary rhythm because the subject varies.

## 3. Evidence and claim types

Every substantive claim falls into exactly one of these buckets — and the article makes the bucket visible:

| Type | Meaning | How it appears |
|---|---|---|
| **Verified fact** | Confirmed against official docs, pricing pages, release notes | Stated directly, with the source and check date where relevant |
| **Observed result** | From our own documented testing | Only in `basis: hands-on` articles, with the test described |
| **Interpretation** | Our judgment of what the evidence means | Attributed as editorial opinion ("our take…") |
| **Vendor claim** | What the provider says about itself | Explicitly attributed to the vendor, never restated as fact |
| **Unknown** | Not verifiable | Said out loud, or the claim is cut |

Rules that follow:

- `basis: hands-on` requires documented tests (see the checklist). Anything less ships as `basis: research`.
- Research-based overviews are **labeled on the page** — the template does this automatically from frontmatter.
- Never invent benchmarks, pricing, feature availability, limitations, quotations, or performance numbers.
- Time-sensitive facts (pricing, plan limits) carry a "checked on" date; unverified pricing renders as "not verified", never as a number.

## 4. What makes a review useful

Answer the questions a reader actually has before choosing: What does the product do? Who wins and who loses with it? What does it do poorly? How hard is setup? Is the free plan sufficient? When does paying make sense? What else deserves a look — and who should pick that instead?

Adapt structure to the product and decision; don't force every product through identical sections. As defaults:

- **AI coding tools** — evaluate on real tasks: understanding an existing codebase, implementing a feature, fixing a bug, running tests, recovering from wrong changes.
- **General-user software** — usability, reliability, accessibility, privacy, cost, and whether the actual job gets done.
- **Developer infrastructure** — integration effort, constraints, pricing implications, reliability, lock-in.

## 5. Comparisons

A comparison must reach a usable conclusion, not a feature dump:

1. Define the intended reader and the decision they're making.
2. Say how the products were evaluated.
3. Compare what materially affects the decision; skip what doesn't.
4. Mark verified differences vs. preference.
5. Include test results only if tests ran.
6. State each option's real disadvantages.
7. Give a conditional recommendation — "choose A if…, B if…" — and say when *neither* fits.

Do not declare a winner because one product pays more commission, and don't manufacture a winner when the honest answer is conditional.

## 6. Structure

Openings deliver information immediately — identify the product and the actual decision in the first two sentences. No restating the title, no warming up.

Headings describe content ("What Cursor's pricing gets complicated about"), not keywords ("Cursor Pricing Overview 2026 Best AI Editor"). Internal links point to genuinely related reviews/comparisons/guides. Captions carry information.

Not every article needs every module. The template offers verdict, pros/cons, pricing, testing notes, FAQ — use what earns its place.

## 7. SEO, without manipulation

Optimize for readers first: match search intent, clear accurate titles, natural terminology, descriptive URLs, distinct metadata. Structured data only when backed by visible page content (the template enforces this: no ratings without a score, no FAQPage without visible FAQ). No keyword stuffing, no near-duplicate pages targeting keyword variants, no articles that exist only to catch searches.

## 8. Affiliate independence

Commissions never determine verdicts, rankings, or comparisons. Disclosure appears on the page with the links (the template handles this). Sponsored content, if ever published, is visually and structurally separate from reviews and always labeled. Explain meaningful disadvantages even when a product pays well. Never fabricate discounts, urgency, or availability. Trust compounds; a commission doesn't.

## 9. English and Arabic quality

English: natural, professionally edited international English.

Arabic: **written, not translated.** Natural modern Arabic that adapts terminology, examples, and pricing context for Arabic-speaking readers. Product names and technical identifiers stay in Latin script. Code blocks and commands stay technically correct and LTR. A translation that hasn't been reviewed for meaning and readability does not ship.

## 10. Production workflow

Before drafting: identify the reader's decision, check existing content for duplication, gather sources, decide what evidence is required, outline around the important questions. After drafting: verify facts/links/pricing, edit for repetition and inflated language, confirm the article adds something beyond existing search results, run the [checklist](review-checklist.md).

AI may assist with research, outlining, editing, and technical checks. It must not manufacture reviewer experience or substitute for missing evidence.

---

**Final standard:** every published article should read as carefully researched, critically evaluated, and edited for a real reader — and every claim on the page should be traceable to evidence or explicitly marked as not yet verified.
