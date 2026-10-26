import { Badge } from "@/components/ui/primitives";
import { formatDate, getDictionary, type Locale } from "@/lib/i18n";
import type { ReviewArticle } from "@/lib/content";

/* ------------------------------------------------------------------ */
/* Integrity banners                                                    */
/* ------------------------------------------------------------------ */

export function DemoBanner({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div
      role="note"
      className="mb-8 rounded-lg border border-dashed border-brand/50 bg-brand-soft/50 p-4"
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-brand-deep">
        <DemoMarkIcon />
        {dict.demoBannerTitle}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{dict.demoBannerBody}</p>
    </div>
  );
}

export function DraftBanner({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <div role="note" className="mb-8 rounded-lg border border-neg/40 bg-neg-soft p-4">
      <p className="text-sm font-semibold text-neg">{dict.draftBannerTitle}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{dict.draftBannerBody}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Score                                                                */
/* ------------------------------------------------------------------ */

export function ScoreBadge({
  review,
  locale,
  size = "lg",
}: {
  review: Pick<ReviewArticle, "score" | "demo">;
  locale: Locale;
  size?: "lg" | "sm";
}) {
  const dict = getDictionary(locale);
  if (review.score === undefined) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-line-strong text-center ${
          size === "lg" ? "min-w-28 p-4" : "min-w-20 p-2.5"
        }`}
      >
        <span className={`tnum font-serif font-semibold text-ink-faint ${size === "lg" ? "text-3xl" : "text-xl"}`}>
          —
        </span>
        <span className="mt-1 text-[0.625rem] font-semibold uppercase tracking-wider text-ink-faint">
          {dict.noScoreYet}
        </span>
      </div>
    );
  }
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg bg-ink text-white ${
        size === "lg" ? "min-w-28 p-4" : "min-w-20 p-2.5"
      }`}
    >
      <span
        dir="ltr"
        className={`tnum font-serif font-semibold ${size === "lg" ? "text-4xl" : "text-2xl"}`}
        aria-label={dict.scoreOutOf(review.score)}
      >
        {review.score.toFixed(1)}
      </span>
      <span dir="ltr" className="tnum text-[0.625rem] uppercase tracking-wider text-white/60">
        / 10
      </span>
      {review.demo ? (
        <span className="mt-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-widest">
          {dict.scoreSample}
        </span>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Verdict card                                                         */
/* ------------------------------------------------------------------ */

export function VerdictCard({ review, locale }: { review: ReviewArticle; locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <section
      aria-labelledby="verdict-heading"
      className="rounded-lg border border-line bg-card p-5 sm:p-6"
    >
      <h2
        id="verdict-heading"
        className="flex items-center justify-between gap-3 border-b-2 border-ink pb-3 text-xs font-semibold uppercase tracking-widest text-ink-soft"
      >
        {dict.verdictTitle}
      </h2>
      <div className="mt-4 flex items-start gap-5">
        <ScoreBadge review={review} locale={locale} />
        <div className="min-w-0">
          {review.verdict ? (
            <p className="font-serif text-lg leading-snug text-ink">{review.verdict}</p>
          ) : (
            <div>
              <p className="font-serif text-lg text-ink">{dict.verdictPending}</p>
              <p className="mt-1 text-sm text-ink-soft">{dict.verdictPendingNote}</p>
            </div>
          )}
          {review.demo && review.score !== undefined ? (
            <p className="mt-2 text-xs text-ink-faint">{dict.sampleScoreNote}</p>
          ) : null}
        </div>
      </div>

      {(review.bestFor.length > 0 || review.notFor.length > 0) && (
        <div className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
          {review.bestFor.length > 0 ? (
            <div className="rounded-md bg-pos-soft p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-pos">
                {dict.bestFor}
              </p>
              <ul className="mt-2 space-y-1.5">
                {review.bestFor.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink">
                    <CheckIcon className="mt-0.5 shrink-0 text-pos" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {review.notFor.length > 0 ? (
            <div className="rounded-md bg-chip p-3.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                {dict.notIdealFor}
              </p>
              <ul className="mt-2 space-y-1.5">
                {review.notFor.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink">
                    <MinusIcon className="mt-0.5 shrink-0 text-ink-faint" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pros & cons                                                          */
/* ------------------------------------------------------------------ */

export function ProsCons({ review, locale }: { review: ReviewArticle; locale: Locale }) {
  const dict = getDictionary(locale);
  if (review.pros.length === 0 && review.cons.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-line-strong bg-canvas-dim p-4 text-sm text-ink-soft">
        {dict.prosPending}
      </p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-line bg-card p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-pos">
          <CheckIcon /> {dict.pros}
        </p>
        <ul className="mt-3 space-y-2">
          {review.pros.map((pro) => (
            <li key={pro} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
              <CheckIcon className="mt-1 shrink-0 text-pos" />
              {pro}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-line bg-card p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neg">
          <CrossIcon /> {dict.cons}
        </p>
        <ul className="mt-3 space-y-2">
          {review.cons.map((con) => (
            <li key={con} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
              <CrossIcon className="mt-1 shrink-0 text-neg" />
              {con}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing                                                              */
/* ------------------------------------------------------------------ */

export function PricingTable({
  review,
  locale,
}: {
  review: Pick<ReviewArticle, "pricing" | "pricingCheckedAt" | "product" | "demo">;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  return (
    <section aria-labelledby="pricing-heading" className="rounded-lg border border-line bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink px-5 py-3">
        <h2
          id="pricing-heading"
          className="text-xs font-semibold uppercase tracking-widest text-ink-soft"
        >
          {dict.pricingTitle} — {review.product.name}
        </h2>
        {review.pricingCheckedAt ? (
          <span className="text-xs text-ink-faint">
            {dict.pricingChecked}: {formatDate(review.pricingCheckedAt, locale)}
          </span>
        ) : (
          <Badge tone="outline" className="border-dashed">
            {dict.pricingNotVerified}
          </Badge>
        )}
      </div>
      {review.pricing.length > 0 ? (
        <div className="table-scroll" tabIndex={0} role="region" aria-label="pricing table">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">{dict.plan}</th>
                <th scope="col">{dict.price}</th>
                <th scope="col">{dict.notes}</th>
              </tr>
            </thead>
            <tbody>
              {review.pricing.map((row) => (
                <tr key={row.plan}>
                  <td className="font-medium text-ink">{row.plan}</td>
                  <td className="tnum font-medium text-ink">{row.price}</td>
                  <td className="text-ink-soft">{row.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-5 py-4 text-sm text-ink-soft">{dict.pricingPlaceholder}</p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testing notes                                                        */
/* ------------------------------------------------------------------ */

export function TestingNotes({
  notes,
  locale,
}: {
  notes: string | undefined;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  return (
    <section
      aria-labelledby="testing-heading"
      className="rounded-lg border border-line bg-canvas-dim p-5"
    >
      <h2
        id="testing-heading"
        className="text-xs font-semibold uppercase tracking-widest text-ink-soft"
      >
        {dict.testingNotesTitle}
      </h2>
      {notes ? (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{notes}</p>
      ) : (
        <p className="mt-2 text-sm text-ink-faint">{dict.testingNotesPending}</p>
      )}
      <a
        href={`/${locale}/testing-methodology`}
        className="mt-3 inline-block text-sm font-medium text-brand underline underline-offset-4"
      >
        {dict.methodologyReadMore} →
      </a>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Disclosure notice                                                    */
/* ------------------------------------------------------------------ */

export function DisclosureNotice({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <aside className="rounded-lg border border-line bg-canvas-dim p-4 text-sm leading-relaxed text-ink-soft">
      <p>{dict.affiliateDisclosureLong}</p>
      <a href={`/${locale}/affiliate-disclosure`} className="mt-1 inline-block text-brand underline underline-offset-4">
        {dict.affiliateDisclosureShort}
      </a>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                                */
/* ------------------------------------------------------------------ */

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M2 7.5L5.5 11L12 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M3 7h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DemoMarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2.5 2.5" />
    </svg>
  );
}

export function MetaSeparator() {
  return <span aria-hidden="true" className="mx-1.5 text-line-strong">·</span>;
}
