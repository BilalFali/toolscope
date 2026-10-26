import Link from "next/link";
import { Container, Badge } from "@/components/ui/primitives";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import TableOfContents from "@/components/article/toc";
import MdxContent from "@/components/article/mdx-content";
import ArticleCard from "@/components/article/article-card";
import {
  DemoBanner,
  DraftBanner,
  DisclosureNotice,
  PricingTable,
  ProsCons,
  TestingNotes,
  VerdictCard,
} from "@/components/article/review-modules";
import { extractToc } from "@/lib/toc";
import {
  getRelatedArticles,
  type Article,
  type CompareArticle,
  type ReviewArticle,
} from "@/lib/content";
import { formatDate, getDictionary, localePath, type Locale } from "@/lib/i18n";
import { articleJsonLd } from "@/lib/seo";
import { categories } from "@/config/site";

const typeLabels: Record<Article["type"], { en: string; ar: string }> = {
  reviews: { en: "Review", ar: "مراجعة" },
  compare: { en: "Comparison", ar: "مقارنة" },
  alternatives: { en: "Alternatives", ar: "بدائل" },
  guides: { en: "Guide", ar: "دليل" },
};

/**
 * Unified article template: renders any content type with its specific
 * modules. Layout = breadcrumbs → header → rail (TOC/verdict) + body →
 * type modules → related → disclosure.
 */
export default async function ArticleView({
  article,
  locale,
  translations,
}: {
  article: Article;
  locale: Locale;
  /** Existing counterparts in the other language, by locale key. */
  translations: { locale: Locale; href: string; title: string }[];
}) {
  const dict = getDictionary(locale);
  const toc = extractToc(article.body);
  const related = await getRelatedArticles(article);
  const typeLabel = typeLabels[article.type][locale === "ar" ? "ar" : "en"];
  const isReview = article.type === "reviews";
  const review = isReview ? (article as ReviewArticle) : undefined;
  const compare = article.type === "compare" ? (article as CompareArticle) : undefined;

  const articleCategory =
    article.category && article.category in categories ? article.category : undefined;

  const crumbs = [
    ...(articleCategory
      ? [
          {
            label: categories[articleCategory][locale].title,
            href: localePath(locale, `/${articleCategory}`),
          },
        ]
      : []),
    { label: article.title },
  ];

  const jsonLd = articleJsonLd(article);

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <Container className="py-8 sm:py-10">
        <Breadcrumbs locale={locale} items={crumbs} />

        {/* Header */}
        <header className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{typeLabel}</Badge>
            {article.demo ? <Badge tone="outline" className="border-dashed">{dict.demoBannerTitle}</Badge> : null}
            {article.updatedAt ? (
              <span className="text-xs text-ink-faint">
                {dict.lastUpdated}: {formatDate(article.updatedAt, locale)}
              </span>
            ) : null}
          </div>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink-soft sm:text-lg">
            {article.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-faint">
            <span>
              {dict.writtenBy} <span className="font-medium text-ink-soft">{article.author}</span>
            </span>
            <span className="tnum">
              {dict.published} {formatDate(article.publishedAt, locale)}
            </span>
            <span>{dict.readingTime(article.readingMinutes)}</span>
          </div>

          {translations.length > 0 ? (
            <p className="mt-4 text-sm text-ink-soft">
              {dict.translationAvailable}:{" "}
              {translations.map((t, i) => (
                <span key={t.locale}>
                  {i > 0 ? ", " : ""}
                  <Link
                    href={t.href}
                    hrefLang={t.locale}
                    className="font-medium text-brand underline underline-offset-4"
                  >
                    {t.locale === "ar" ? "العربية" : "English"} — {t.title}
                  </Link>
                </span>
              ))}
            </p>
          ) : null}
        </header>

        {article.draft ? <div className="mx-auto mt-6 max-w-3xl"><DraftBanner locale={locale} /></div> : null}
        {article.demo ? <div className="mx-auto mt-6 max-w-3xl"><DemoBanner locale={locale} /></div> : null}

        {/* Body + rail */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="mx-auto w-full max-w-3xl lg:mx-0">
            {review ? (
              <div className="mb-10">
                <VerdictCard review={review} locale={locale} />
              </div>
            ) : null}

            {compare ? <ComparisonSummary compare={compare} locale={locale} /> : null}

            <div className="mdx-body">
              <MdxContent source={article.body} locale={locale} />
            </div>

            {review ? (
              <div className="mt-12 space-y-10">
                <section aria-labelledby="proscons-heading">
                  <h2 id="proscons-heading" className="mb-4 font-serif text-2xl font-semibold tracking-tight">
                    {dict.pros} / {dict.cons}
                  </h2>
                  <ProsCons review={review} locale={locale} />
                </section>
                <PricingTable review={review} locale={locale} />
                <TestingNotes notes={review.testingNotes} locale={locale} />
              </div>
            ) : null}

            {related.length > 0 ? (
              <section aria-labelledby="related-heading" className="mt-12">
                <h2 id="related-heading" className="mb-4 font-serif text-2xl font-semibold tracking-tight">
                  {dict.relatedArticles}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {related.map((a) => (
                    <ArticleCard key={`${a.type}-${a.slug}`} article={a} locale={locale} variant="compact" />
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-10">
              <DisclosureNotice locale={locale} />
            </div>
          </div>

          {/* Rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <TableOfContents items={toc} locale={locale} />
              {review ? (
                <div className="rounded-lg border border-line bg-canvas-dim p-4 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
                    {dict.category}
                  </p>
                  <Link
                    href={localePath(locale, `/${review.category}`)}
                    className="mt-1 block font-medium text-brand hover:underline"
                  >
                    {categories[review.category][locale].title} →
                  </Link>
                  {review.product.website ? (
                    <>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-ink-faint">
                        {review.product.name}
                      </p>
                      <a
                        href={review.product.website}
                        rel="nofollow noopener"
                        target="_blank"
                        className="mt-1 block break-all text-ink-soft hover:text-brand"
                      >
                        {dict.visitSite} ↗
                      </a>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Comparison summary table                                             */
/* ------------------------------------------------------------------ */

function ComparisonSummary({
  compare,
  locale,
}: {
  compare: CompareArticle;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  return (
    <section
      aria-label={dict.compareLabel}
      className="mb-10 rounded-lg border border-line bg-card"
    >
      <div className="border-b-2 border-ink px-5 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
          {compare.items.map((i) => i.name).join(locale === "ar" ? " مقابل " : " vs ")}
        </h2>
      </div>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="comparison table">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{locale === "ar" ? "المنتج" : "Product"}</th>
              <th scope="col">{dict.bestFor}</th>
              <th scope="col">{dict.pricingTitle}</th>
            </tr>
          </thead>
          <tbody>
            {compare.items.map((item) => (
              <tr key={item.name} className={compare.winner === item.name ? "bg-brand-soft/50" : undefined}>
                <td>
                  <span className="font-medium text-ink">{item.name}</span>
                  {compare.winner === item.name ? (
                    <span className="ms-2 rounded-full bg-brand px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-white">
                      {locale === "ar" ? "اختيار المحرر" : "Editor's pick"}
                    </span>
                  ) : null}
                  {item.tagline ? <p className="mt-0.5 text-xs text-ink-soft">{item.tagline}</p> : null}
                </td>
                <td className="text-ink-soft">{item.bestFor.join("، ") || "—"}</td>
                <td className="tnum text-ink-soft">{item.pricing ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {compare.winner && compare.winnerNote ? (
        <p className="border-t border-line px-5 py-3 text-sm text-ink-soft">
          <strong className="font-semibold text-ink">{compare.winner}</strong> — {compare.winnerNote}
        </p>
      ) : null}
    </section>
  );
}
