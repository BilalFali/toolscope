# Writing Style

This is a description of the voice already present in this publication's articles — extracted from the actual text, not an aspirational style guide. It covers *texture* (how sentences actually read). For the hard rules (banned phrases, evidence typing, comparison structure), see [`docs/editorial-guidelines.md`](docs/editorial-guidelines.md); for the pre-publish pass, see [`docs/review-checklist.md`](docs/review-checklist.md).

## Spelling

International/British spelling throughout: *prioritise*, *customise*, *organisation*. Apply this consistently in new English copy — don't mix in American `-ize` forms mid-article.

## Opening move

Articles open by stating what the thing *is* and what decision the reader is actually facing — no throat-clearing, no restating the title as a sentence.

> "Cursor is an AI-first code editor from Anysphere, built as a fork of VS Code. Its central bet: the editor should assume an AI collaborator by default..."

When an article isn't hands-on tested, that's disclosed in the second or third sentence, not buried in frontmatter only:

> "This is a research-based overview, not a hands-on review. Everything below comes from official documentation and public sources, attributed as we go."

## Hedging is precise, not vague

Uncertainty is stated as a specific open question, not a vague qualifier:

- Weak: *"results may vary"*
- Actual house style: *"how far the free tier stretches in practice"* / *"context quality on your codebase is unproven until tested"*

The pattern: name the specific unknown, then say what would resolve it ("that is exactly what our test cycle will measure").

## A dry, skeptical aside is allowed — once per article, not per paragraph

> "Vendor demos are built to flatter; treat them accordingly."
> "...or whether it is just a polite way of saying 'less capable.'"

This reads as editorial judgment, not snark. One such line lands; three in one article reads performative — ration it.

## Closing move: forward-looking, not summarizing

Articles don't end by restating the verdict. They end with **"What would change our verdict"** — the specific tests or product changes that would move the needle. This is a structural device, not just a sentence: treat it as its own closing section when the article has an unfinished evidence basis.

## Comparisons: named philosophies, not feature tables dressed as prose

Comparisons frame the decision as two (or more) design philosophies in tension, then say who fits which:

> "AI code editors are splitting into two design philosophies: editors that do as much as possible (Cursor) and editors that do as little as necessary (Windsurf). Choosing between them is not about which is objectively better — it is about which philosophy matches how you actually work."

The "who wins" section is always conditional ("if your work involves X... if you write mostly in Y...") — never a flat winner statement, even when a `winner` field is set. The winner field gets a one-line caveat about the margin.

## Rhythm

Paragraphs are short (2–4 sentences) and vary in length deliberately — a one-line paragraph for emphasis after a longer explanatory one is common. Numbered/bulleted lists are used for genuinely enumerable things (test criteria, decision questions, pricing rows) — not as a default structure for every section. Most sections are prose with an occasional list, not the reverse.

## Headings name the finding, not the topic

- Not this: "Cursor Pricing Overview"
- This: "Where the friction is" / "What would change our verdict" / "The market has changed"

A heading should tell you something before you read the section, the way a newspaper subhead does.

## Callouts carry structural information, not decoration

`<Callout>` blocks are used for exactly two jobs: (1) stating the demo/research-basis disclosure up front, (2) marking "what a real test would verify" mid-article. They are not used for emphasis or random tips — if a callout doesn't fit one of those two jobs, it's prose instead.
