# Pre-Publication Review Checklist

Run this pass on every article before flipping it to publishable (`demo: false`). If any item fails, fix it or label it honestly — don't ship around it.

## A. Evidence basis

- [ ] **`basis` field is truthful.** `hands-on` only if we performed and documented the tests ourselves this cycle. Everything else is `research`.
- [ ] Every factual claim is classified: verified fact / observed result / interpretation / vendor claim / unknown.
- [ ] Vendor claims are attributed to the vendor, never restated as fact.
- [ ] Unknowns are stated or the claim was cut. No invented benchmarks, features, limits, quotes, or user counts.
- [ ] The article does not use first-person testing language ("we tested", "in our trials") unless `basis: hands-on`.

## B. Usefulness

- [ ] The reader's actual decision is identified in the first two sentences.
- [ ] The article answers: who is this for, who should avoid it, what it does poorly, what setup costs, when paying is worth it.
- [ ] Structure fits the product and decision — not a forced identical template.
- [ ] The conclusion is not repeated three times (intro/body/end).
- [ ] The article adds something beyond the provider's own docs and marketing pages.

## C. Honesty of comparisons (if applicable)

- [ ] Evaluation method is stated.
- [ ] Both options' real disadvantages are named.
- [ ] The recommendation is conditional, or the winner is justified by evidence — never by commission.
- [ ] "Neither option" cases are addressed.

## D. Facts and freshness

- [ ] Pricing re-verified on the provider's official page today; `pricingCheckedAt` updated (or pricing left unverified-marked).
- [ ] Version numbers, plan names, and feature lists checked against official docs/release notes.
- [ ] All internal links resolve; all external links point where they claim.
- [ ] Claims likely to age carry their check date.

## E. Language and style

- [ ] No banned patterns (see editorial guidelines §2): landscape openers, "seamlessly", "game-changing", "look no further", filler transitions, routine "In conclusion".
- [ ] No unearned adjectives; every "fast/powerful/easy" is backed by a specific.
- [ ] Product name not repeated mechanically; sentence rhythm varies naturally.
- [ ] No spelling/grammar errors — and no *deliberately added* ones.
- [ ] Arabic articles read as native editorial Arabic (not sentence-by-sentence translation); code blocks remain correct and LTR; product names stay in Latin script.

## F. Page hygiene (template-enforced, verify anyway)

- [ ] `title` and `description` are accurate and distinct from other pages; description 10–300 chars.
- [ ] Tags match the article's real topics.
- [ ] FAQ (if present) answers real reader questions and matches visible content — FAQPage schema is auto-generated from it.
- [ ] If a score exists: `basis: hands-on` is true and the methodology page's criteria were met. Otherwise the score field is **absent** (renders as "Rating pending").
- [ ] `demo: true` still set for any article whose testing is not complete (banner + noindex + "Sample" score label are automatic).

## G. Before deploy

- [ ] `npm run lint` and `npm run typecheck` pass.
- [ ] Page checked in browser at mobile (375px) and desktop (1280px) widths, EN and AR.
- [ ] RTL layout correct on Arabic pages (tables, code blocks, pricing).
- [ ] Affiliate links (if any) resolve against `config/affiliates.ts` and the disclosure is present on the page.
