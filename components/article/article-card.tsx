import Link from "next/link";
import { Badge } from "@/components/ui/primitives";
import { ProductLogo } from "@/components/ui/product-logo";
import { formatDate, getDictionary, type Locale } from "@/lib/i18n";
import type { Article, ReviewArticle } from "@/lib/content";
import { articleHref } from "@/lib/article-href";
import { ScoreBadge } from "@/components/article/review-modules";

const typeLabels = {
  reviews: "reviewsLabel",
  compare: "compareLabel",
  alternatives: "alternativesLabel",
  guides: "guidesLabel",
} as const satisfies Record<Article["type"], keyof ReturnType<typeof getDictionary>>;

/** Card used across homepage, category pages, and archives. */
export default function ArticleCard({
  article,
  locale,
  variant = "default",
}: {
  article: Article;
  locale: Locale;
  variant?: "default" | "compact";
}) {
  const dict = getDictionary(locale);
  const href = articleHref(article);
  const typeLabel = dict[typeLabels[article.type]];

  return (
    <article
      className={`group relative flex flex-col rounded-lg border border-line bg-card transition-shadow hover:shadow-[0_4px_20px_-2px_rgba(26,26,30,0.08)] ${
        variant === "compact" ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="outline">{typeLabel}</Badge>
          {article.demo ? (
            <Badge tone="brand" className="border border-dashed border-brand/40 bg-brand-soft">
              {dict.demoBannerTitle}
            </Badge>
          ) : null}
        </div>
        {article.type === "reviews" ? (
          <ProductLogo name={article.product.name} website={article.product.website} size={28} />
        ) : null}
      </div>

      <h3
        className={`mt-3 font-serif font-semibold leading-snug tracking-tight text-ink group-hover:text-brand-deep ${
          variant === "compact" ? "text-base" : "text-lg"
        }`}
      >
        <Link href={href} className="after:absolute after:inset-0 after:content-['']">
          {article.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
        {article.description}
      </p>

      {article.type === "reviews" && article.score !== undefined ? (
        <div className="mt-4">
          <ScoreBadge review={article} locale={locale} size="sm" />
        </div>
      ) : null}

      <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-ink-faint">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
        <span aria-hidden="true">·</span>
        <span>{dict.readingTime(article.readingMinutes)}</span>
        {article.tags.length > 0 ? (
          <>
            <span aria-hidden="true">·</span>
            <span className="truncate">{article.tags.slice(0, 2).join(", ")}</span>
          </>
        ) : null}
      </div>
    </article>
  );
}

/** Horizontal row card for search results / latest rails. */
export function ArticleRow({ article, locale }: { article: Article; locale: Locale }) {
  const dict = getDictionary(locale);
  const href = articleHref(article);
  return (
    <article className="group relative flex gap-4 border-b border-line py-4 last:border-0">
      {article.type === "reviews" ? (
        <div className="hidden shrink-0 flex-col items-center gap-2 self-start sm:flex">
          <ProductLogo name={article.product.name} website={article.product.website} size={28} />
          <ScoreBadge review={article as ReviewArticle} locale={locale} size="sm" />
        </div>
      ) : null}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
          <Badge tone="outline">{dict[typeLabels[article.type]]}</Badge>
          {article.demo ? <Badge tone="brand">{dict.scoreSample}</Badge> : null}
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
        </div>
        <h3 className="mt-1.5 font-serif text-lg font-semibold leading-snug text-ink group-hover:text-brand-deep">
          <Link href={href}>{article.title}</Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{article.description}</p>
      </div>
    </article>
  );
}
