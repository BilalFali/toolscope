import type { ReactElement } from "react";
import Link from "next/link";
import {
  Container,
  Badge,
  ArrowRightIcon,
  ShieldIcon,
  ChipIcon,
  TerminalIcon,
  GridIcon,
  CrossIcon,
} from "@/components/ui/primitives";
import { categories, siteConfig, type CategoryKey, type Locale } from "@/config/site";
import { getDictionary, localePath, formatDate } from "@/lib/i18n";
import { getReviews, articleHref, type ReviewArticle, type CompareArticle } from "@/lib/content";
import ArticleCard from "@/components/article/article-card";
import NewsletterForm from "@/components/home/newsletter-form";
import { CheckIcon } from "@/components/article/review-modules";
import { ProductLogo } from "@/components/ui/product-logo";

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */

export async function Hero({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const reviews = await getReviews(locale);
  const count = reviews.length;

  const tagCounts = new Map<string, number>();
  for (const r of reviews) for (const t of r.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
  const trending = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([t]) => t);

  return (
    <section className="border-b border-line bg-card">
      <Container className="py-12 sm:py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded border border-line bg-canvas-dim px-2.5 py-1 text-xs font-semibold text-ink-soft">
            <ShieldIcon className="text-brand" />
            {dict.siteTagline}
          </div>
          <h1 className="mt-4 font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
            {locale === "ar" ? (
              <>
                نختبر البرمجيات <em className="text-brand">بعناية</em>، ونشرح اختيارنا بوضوح.
              </>
            ) : (
              <>
                Software reviewed with <em className="text-brand">care</em>, explained with clarity.
              </>
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {siteConfig.description[locale]}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={localePath(locale, "/reviews")}
              className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep"
            >
              {dict.latestReviews}
              <ArrowRightIcon />
            </Link>
            <Link
              href={localePath(locale, "/compare")}
              className="rounded border border-line bg-card px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-canvas-dim"
            >
              {dict.comparisonsTitle}
            </Link>
          </div>
          {trending.length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-ink-faint">
              <span className="font-medium text-ink-soft">{dict.searchSuggested}:</span>
              {trending.map((tag) => (
                <Link
                  key={tag}
                  href={`${localePath(locale, "/search")}?q=${encodeURIComponent(tag)}`}
                  className="rounded bg-chip px-2.5 py-1 font-medium text-ink-soft transition-colors hover:bg-brand-soft hover:text-brand-deep"
                >
                  {tag}
                </Link>
              ))}
            </div>
          ) : null}
          {count > 0 ? (
            <p className="mt-4 text-xs text-ink-faint">
              {dict.articlesCount(count)} · {dict.howWeTestBody}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Featured review                                                      */
/* ------------------------------------------------------------------ */

export function FeaturedReview({
  review,
  locale,
}: {
  review: ReviewArticle | undefined;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  if (!review) return null;

  const cat = categories[review.category][locale];

  return (
    <section aria-labelledby="featured-heading">
      <Container>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
          <span className="text-brand">{dict.featuredReview}</span>
          <Link
            href={localePath(locale, "/reviews")}
            className="inline-flex items-center gap-1 font-semibold normal-case text-brand hover:underline"
          >
            {dict.viewAll} <ArrowRightIcon />
          </Link>
        </div>
        <article className="grid gap-6 rounded-lg border border-line bg-card p-5 sm:p-7 lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-5 lg:col-span-7">
            <div>
              <div className="flex items-center gap-3">
                <ProductLogo name={review.product.name} website={review.product.website} size={40} />
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-pos">
                  <span className="rounded bg-pos-soft px-2 py-0.5">{dict.verdictTitle}</span>
                  <span className="text-ink-faint">·</span>
                  <span className="text-ink-soft">{cat.title}</span>
                </div>
              </div>
              <h3
                id="featured-heading"
                className="mt-3 font-serif text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl"
              >
                <Link href={articleHref(review)} className="hover:text-brand-deep">
                  {review.title}
                </Link>
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">{review.description}</p>
            </div>

            {review.bestFor.length > 0 || review.notFor.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {review.bestFor.length > 0 ? (
                  <div className="rounded border border-pos/20 bg-pos-soft p-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-pos">
                      <CheckIcon /> {dict.bestFor}
                    </p>
                    <p className="mt-1 text-sm text-ink">{review.bestFor[0]}</p>
                  </div>
                ) : null}
                {review.notFor.length > 0 ? (
                  <div className="rounded border border-line bg-chip p-3.5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                      <CrossIcon className="text-ink-faint" /> {dict.notIdealFor}
                    </p>
                    <p className="mt-1 text-sm text-ink">{review.notFor[0]}</p>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <div className="flex items-center gap-3">
                <span className="tnum font-serif text-2xl font-semibold text-ink">
                  {review.score !== undefined ? review.score.toFixed(1) : "—"}
                </span>
                <span className="text-xs text-ink-faint">/ 10</span>
                <span className="text-ink-faint">|</span>
                <span className="tnum text-xs text-ink-soft">{review.readingMinutes} {dict.minutes}</span>
              </div>
              <Link
                href={articleHref(review)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                {dict.readFullReview} <ArrowRightIcon />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded border border-line bg-canvas-dim p-4 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-line pb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
              <span>{dict.pricingTitle}</span>
              <span>{review.product.name}</span>
            </div>
            {review.pricing.length > 0 ? (
              <ul className="space-y-2">
                {review.pricing.slice(0, 3).map((row) => (
                  <li key={row.plan} className="flex items-center justify-between text-sm">
                    <span className="text-ink-soft">{row.plan}</span>
                    <span className="tnum font-semibold text-ink">{row.price}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-soft">{dict.pricingPlaceholder}</p>
            )}
            {review.verdict ? (
              <p className="border-s-2 border-brand ps-3 font-serif text-sm italic leading-snug text-ink-soft">
                “{review.verdict}”
              </p>
            ) : null}
            <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-xs text-ink-faint">
              <span>{dict.writtenBy} {review.author}</span>
              <span className="tnum">{formatDate(review.publishedAt, locale)}</span>
            </div>
          </div>
        </article>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Comparisons (mini spec cards, inspired by Capterra's compare grid —  */
/* bars only render where we have a real published review score;       */
/* otherwise we fall back to the item's listed price, never a guess.)  */
/* ------------------------------------------------------------------ */

export function ComparisonsSection({
  comparisons,
  scoreBySlug,
  locale,
}: {
  comparisons: CompareArticle[];
  scoreBySlug: Map<string, number>;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  if (comparisons.length === 0) return null;
  const shown = comparisons.slice(0, 2);

  return (
    <section aria-labelledby="comparisons-heading">
      <Container>
        <div className="rounded-lg border border-line bg-canvas-dim p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                {dict.comparisonsTitle}
              </span>
              <p className="mt-1 text-sm text-ink-soft">{dict.comparisonsSubtitle}</p>
            </div>
            <Link
              href={localePath(locale, "/compare")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              {dict.viewAll} ({comparisons.length}) <ArrowRightIcon />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {shown.map((compare) => (
              <div key={compare.slug} className="rounded border border-line bg-card p-5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
                    <span className="font-semibold uppercase tracking-wider">
                      {compare.items.map((i) => i.name).join(locale === "ar" ? " ضد " : " vs ")}
                    </span>
                    {compare.winner ? (
                      <>
                        <span>·</span>
                        <span className="font-medium text-pos">
                          {locale === "ar" ? `الفائز: ${compare.winner}` : `Verdict: ${compare.winner}`}
                        </span>
                      </>
                    ) : null}
                  </div>
                  <h3 className="font-serif text-lg font-semibold leading-snug text-ink">
                    <Link href={articleHref(compare)} className="hover:text-brand-deep">
                      {compare.title}
                    </Link>
                  </h3>
                </div>

                <ul className="mt-4 space-y-3">
                  {compare.items.slice(0, 4).map((item) => {
                    const score = item.reviewSlug ? scoreBySlug.get(item.reviewSlug) : undefined;
                    const isWinner = compare.winner === item.name;
                    return (
                      <li key={item.name}>
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className={`flex items-center gap-2 font-medium ${isWinner ? "text-ink" : "text-ink-soft"}`}>
                            <ProductLogo name={item.name} website={item.url} size={20} />
                            {item.name}
                            {isWinner ? (
                              <span className="ms-1.5 rounded-full bg-brand-soft px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-brand-deep">
                                {locale === "ar" ? "اختيار المحرر" : "Editor's pick"}
                              </span>
                            ) : null}
                          </span>
                          <span className="tnum shrink-0 text-xs text-ink-faint">
                            {score !== undefined ? dict.scoreOutOf(score) : item.pricing ?? "—"}
                          </span>
                        </div>
                        {score !== undefined ? (
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-chip">
                            <div
                              className={`h-full rounded-full ${isWinner ? "bg-brand" : "bg-line-strong"}`}
                              style={{ width: `${score * 10}%` }}
                            />
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>

                <Link
                  href={articleHref(compare)}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
                >
                  {dict.readArticle} <ArrowRightIcon />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Category blocks                                                      */
/* ------------------------------------------------------------------ */

const categoryIcons: Record<CategoryKey, (props: { className?: string }) => ReactElement> = {
  "ai-tools": ChipIcon,
  "developer-tools": TerminalIcon,
  software: GridIcon,
};

export function CategoryBlock({
  categoryKey,
  locale,
  articles,
}: {
  categoryKey: CategoryKey;
  locale: Locale;
  articles: import("@/lib/content").Article[];
}) {
  const dict = getDictionary(locale);
  const cat = categories[categoryKey][locale];
  if (articles.length === 0) return null;
  const Icon = categoryIcons[categoryKey];

  return (
    <section aria-labelledby={`cat-${categoryKey}`}>
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded border border-line bg-card text-brand">
              <Icon />
            </span>
            <div>
              <h2
                id={`cat-${categoryKey}`}
                className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]"
              >
                {cat.title}
              </h2>
              <p className="mt-1 text-sm text-ink-soft">{cat.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="neutral" className="tnum">
              {dict.articlesCount(articles.length)}
            </Badge>
            <Link
              href={localePath(locale, `/${categoryKey}`)}
              className="rounded border border-line bg-card px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-canvas-dim"
            >
              {dict.viewAll}
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How we test strip                                                    */
/* ------------------------------------------------------------------ */

const testingPillars = {
  en: [
    {
      tag: "01 / WORKLOADS",
      title: "Practical hands-on tests",
      body: "Zero reliance on vendor marketing decks. We run real projects, test edge cases, and log failures over multiple hours of direct use.",
    },
    {
      tag: "02 / BILLING",
      title: "Pricing verification",
      body: "We record the date pricing was checked against the provider's own site, so plans and costs are never taken on faith.",
    },
    {
      tag: "03 / PRIVACY",
      title: "Terms & data handling",
      body: "We review what a tool does with your data, what it's trained on, and what guarantees — if any — a vendor actually makes.",
    },
    {
      tag: "04 / BOUNDARIES",
      title: "Real limitations",
      body: "Every review states what a tool is not good at. Knowing when not to use something is as important as knowing when to.",
    },
  ],
  ar: [
    {
      tag: "٠١ / سير العمل",
      title: "اختبارات عملية مباشرة",
      body: "لا اعتماد على عروض المزوّدين التسويقية. نجرّب مشاريع حقيقية، ونختبر الحالات الحدّية، ونوثّق الأعطال عبر ساعات استخدام فعلي.",
    },
    {
      tag: "٠٢ / الفوترة",
      title: "التحقق من الأسعار",
      body: "نسجّل تاريخ التحقق من الأسعار مقابل موقع المزوّد نفسه، فلا تُؤخذ الخطط والتكاليف على الثقة.",
    },
    {
      tag: "٠٣ / الخصوصية",
      title: "الشروط ومعالجة البيانات",
      body: "نراجع ما يفعله المنتج ببياناتك، وما يُدرَّب عليه، وما هي الضمانات الفعلية — إن وُجدت — التي يقدّمها المزوّد.",
    },
    {
      tag: "٠٤ / الحدود",
      title: "القيود الحقيقية",
      body: "تذكر كل مراجعة ما لا يُحسن المنتج فعله. معرفة متى لا تستخدم أداة لا تقل أهمية عن معرفة متى تستخدمها.",
    },
  ],
} as const;

export function HowWeTestStrip({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pillars = testingPillars[locale];
  return (
    <section aria-labelledby="hwt-heading">
      <Container>
        <div className="rounded-lg border border-line-strong bg-card p-6 sm:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand">
              <ShieldIcon />
              {dict.editingNote}
            </div>
            <h2 id="hwt-heading" className="mt-2 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
              {dict.howWeTestTitle}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-ink-soft">{dict.howWeTestBody}</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <div key={pillar.tag} className="space-y-2 rounded border border-line bg-canvas-dim p-4">
                <span className="tnum text-xs font-semibold text-brand">{pillar.tag}</span>
                <h3 className="font-serif text-base font-semibold text-ink">{pillar.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{pillar.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end border-t border-line pt-4">
            <Link
              href={localePath(locale, "/testing-methodology")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              {dict.howWeTestCta} <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter section                                                   */
/* ------------------------------------------------------------------ */

export function NewsletterSection({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <section aria-labelledby="newsletter-heading" className="border-t border-line bg-card">
      <Container className="py-12">
        <div className="max-w-xl">
          <h2 id="newsletter-heading" className="font-serif text-2xl font-semibold tracking-tight text-ink">
            {dict.newsletterTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{dict.newsletterBody}</p>
          <div className="mt-5">
            <NewsletterForm
              dict={{
                newsletterUnavailable: dict.newsletterUnavailable,
                newsletterSubscribed: dict.newsletterSubscribed,
                newsletterEmailLabel: dict.newsletterEmailLabel,
                newsletterEmailPlaceholder: dict.newsletterEmailPlaceholder,
                newsletterSubscribe: dict.newsletterSubscribe,
                newsletterConsent: dict.newsletterConsent,
                newsletterError: dict.newsletterError,
              }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
