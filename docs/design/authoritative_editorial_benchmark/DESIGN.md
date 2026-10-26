---
name: Authoritative Editorial & Benchmark
colors:
  surface: '#fbf8fe'
  surface-dim: '#dcd9de'
  surface-bright: '#fbf8fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f8'
  surface-container: '#f0edf2'
  surface-container-high: '#eae7ed'
  surface-container-highest: '#e4e1e7'
  on-surface: '#1b1b1f'
  on-surface-variant: '#444653'
  inverse-surface: '#303034'
  inverse-on-surface: '#f3f0f5'
  outline: '#757685'
  outline-variant: '#c5c5d6'
  surface-tint: '#3b53c6'
  primary: '#092ba2'
  on-primary: '#ffffff'
  primary-container: '#2d46b9'
  on-primary-container: '#b9c2ff'
  inverse-primary: '#bac3ff'
  secondary: '#006c48'
  on-secondary: '#ffffff'
  secondary-container: '#98f6c5'
  on-secondary-container: '#00734d'
  tertiary: '#7d0001'
  on-tertiary: '#ffffff'
  tertiary-container: '#a4160e'
  on-tertiary-container: '#ffb3a7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee1ff'
  primary-fixed-dim: '#bac3ff'
  on-primary-fixed: '#001159'
  on-primary-fixed-variant: '#1e39ad'
  secondary-fixed: '#98f6c5'
  secondary-fixed-dim: '#7cd9aa'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4a8'
  on-tertiary-fixed: '#410000'
  on-tertiary-fixed-variant: '#930303'
  background: '#fbf8fe'
  on-background: '#1b1b1f'
  surface-variant: '#e4e1e7'
typography:
  display-hero:
    fontFamily: Newsreader
    fontSize: 3.5rem
    fontWeight: '500'
    lineHeight: 4rem
    letterSpacing: -0.025em
  display-hero-mobile:
    fontFamily: Newsreader
    fontSize: 2.25rem
    fontWeight: '500'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Newsreader
    fontSize: 1.25rem
    fontWeight: '400'
    lineHeight: 2rem
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
  data-tabular:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies independent, rigorously researched technology journalism. Inspired by the clarity of Wirecutter, the visual depth of The Verge, and the intellectual restraint of Stripe Press, it marries analytical precision with editorial authority.

The UI avoids flashy consumer-tech tropes in favor of an academic yet modern aesthetic: structured typographic hierarchies, disciplined margins, and utilitarian data layouts. Readers should feel immediate trust, clarity, and intellectual calm. The visual design establishes that every score, benchmark, and recommendation is backed by empirical testing and uncompromised independence.

## Colors

The palette balances warm paper-like surfaces with high-contrast text and deliberate functional accents.

- **Canvas & Backgrounds:** The base canvas uses a warm parchment tint (`#FAF9F6`), transitioning to `#F5F4F0` for structural backdrops, section breaks, and metadata panels. Interactive cards and benchmark modules sit on pure white (`#FFFFFF`) to pop with clean definition.
- **Typography:** Primary text is an ink-dense charcoal (`#1A1A1E`), avoiding pure black to reduce eye fatigue during long-form reading. Secondary copy uses slate charcoal (`#5A5A62`), while meta details, timestamps, and captions rely on neutral grey (`#7A7A85`).
- **Brand Primary:** A deep, authoritative cobalt indigo (`#2D46B9`, hovering at `#1E339A`) provides decisive focus for active navigation states, primary calls-to-action, and key analytical callouts. Soft indigo (`#EEF2FF`) provides subtle containment for highlights and active tab pills.
- **Evaluative Accents:** Verdicts require clear, unambiguous semantic coding:
  - Pros & Positive verdicts: Deep forest emerald (`#0D7A53`) with subtle mint wash backgrounds (`#EBF7F2`).
  - Cons & Warnings: Crisp crimson (`#B42318`) paired with light coral wash backgrounds (`#FEF3F2`).
  - Neutral badges and category tags: Warm stone tint (`#F0EFEB`) with balanced slate borders (`#E5E5E0`).

## Typography

The typographical pairing creates a deliberate dialogue between literary depth and empirical analysis:

- **Editorial Headings (`Newsreader`):** Used across major review titles, article leads, pull quotes, and score declarations. Conveys the gravitas of investigative journalism. It features optical sizing adjustments for high readability on retina displays.
- **Analytical Body & UI (`Inter`):** Delivers neutral, crystal-clear readability for technical evaluations, navigation, benchmark matrices, and UI controls. Tabular numerals (`font-feature-settings: "tnum"`) are enforced across pricing, scoring badges, benchmarks, and comparison matrices to ensure vertical digit alignment.
- **RTL & Arabic Localization:** The system seamlessly pairs with `IBM Plex Sans Arabic` for system body copy and `Amiri` for editorial titles, matching both baseline weights and optical metrics without layout shifts.

## Layout & Spacing

The layout is built on a 12-column responsive grid anchored by reading optimization:

- **Max Content Constrain:** Editorial review body text is constrained to an optimal reading measure of 680px to 740px (spanned over 7 or 8 central columns), preventing line-length fatigue.
- **Sidebar & Spec Rails:** Companion rails for sticky verdict cards, tables of contents, and quick-spec sidebars occupy the remaining 4 columns (approx. 320px–360px).
- **Breakpoints:**
  - **Desktop (1200px+):** 12 columns, 24px (`1.5rem`) gutters, dynamic auto-margins with a max page boundary of 1320px.
  - **Tablet (768px – 1199px):** 8 columns, 20px gutters, 24px margins. Spec rails collapse into contextual flyouts or accordion modules below the main verdict.
  - **Mobile (below 768px):** 4 columns, 16px (`1rem`) gutters, 16px (`1rem`) outer margins. Tables convert to horizontally swipeable cards or compact stacked spec sheets.

## Elevation & Depth

This design system avoids heavy drop shadows and artificial skeuomorphic layering. Instead, depth and visual organization rely on **tonal contrast and delicate linear borders**:

- **Borders & Rules:** Elements are separated by a 1px structural border (`#E5E5E0`). Thick structural dividers (2px to 3px) are used selectively to cap tables and separate summary scores.
- **Surface Layering:** 
  - Level 0 (Base canvas): `#FAF9F6`.
  - Level 1 (Cards, sheets, and benchmark blocks): Pure `#FFFFFF` bordered by `#E5E5E0`.
  - Level 2 (Hover states & Popovers): Retain `#FFFFFF` surface with an ultra-diffused ambient lift: `0 4px 20px -2px rgba(26, 26, 30, 0.06), 0 1px 3px rgba(26, 26, 30, 0.04)`.
- **Transparency & Blurs:** Navigation headers employ a subtle sticky parchment blur (`rgba(250, 249, 246, 0.88)` with `backdrop-filter: blur(12px)`) to keep readers anchored without obscuring document progress.

## Shapes

The design system embraces a **Soft / Architectural (`1`)** shape language, communicating seriousness, utility, and print heritage:

- Base interactive items, inputs, cards, and verdict containers use `0.25rem` (4px) corner radii.
- Larger structural cards and modal sheets scale to `rounded-lg` (`0.5rem` / 8px).
- Pill shapes are reserved exclusively for status indicators, testing tags, and categorical taxonomy chips, where pill geometry aids instant visual filtering.

## Components

### Header & Navigation
- **Top Utility Rail:** Features a disclosure statement ("Independent, reader-supported. We may earn an affiliate commission."), language switcher, and global quick search.
- **Primary Header:** Minimalist layout with category tags (e.g., Developer Tools, LLM Frameworks, Cloud Infrastructure). Border-bottom: 1px solid `#E5E5E0`. Sticky positioning with warm backdrop blur.

### Verdict Cards & Score Modules
- **Hero Verdict Card:** White card with `#E5E5E0` 1px border. Features a high-contrast numeric score block (e.g., "9.2 / 10") in tabular numerals, an editorial one-line summary, an award tag ("Editor's Choice"), and two explicit recommendation zones:
  - *"Best for"*: Backed by light emerald tint (`#EBF7F2`) with green icon bullets.
  - *"Not ideal for"*: Backed by warm sand tint (`#F0EFEB`) with muted slate icons.
- **Pros & Cons Matrix:** Two-column grid on desktop, single-column on mobile. Pros marked with `#0D7A53` checkmarks; Cons marked with `#B42318` cross markers.

### Comparison & Data Tables
- **Spec Grid:** Strict horizontal borders, sticky table headers with uppercase labels (`label-sm`).
- **Zebra Pattern:** Alternating rows using `#FAF9F6` and `#FFFFFF`.
- **Values:** Numbers formatted with `font-feature-settings: "tnum"`. Feature availability indicated by solid icons rather than text.

### Buttons & Controls
- **Primary Button:** `#2D46B9` background, white text, 4px border radius. Hover: `#1E339A`. Active: inset micro-compression.
- **Secondary / Outline Button:** `#FFFFFF` background, `#1A1A1E` text, 1px border `#E5E5E0`. Hover: `#F5F4F0`.
- **Affiliate & Outbound Links:** Include external link icons and clear "Visit Provider" tracking disclosures.

### Badges & Metas
- **Testing Badges:** Monospaced/condensed uppercase metadata tags indicating test durations (e.g., "40+ HOURS LAB TESTED", "VERIFIED API BENCHMARK") in stone sand pill styling.
- **Reading Time & Timestamp:** Secondary grey text with an inline calendar/clock indicator, highlighting "Last Updated" dates for algorithmic transparency.