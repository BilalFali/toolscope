import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import { ArticleRow } from "@/components/article/article-card";
import { contentTypes, isLocale, type ContentType, type Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import { getByType } from "@/lib/content";
import { buildMetadata, websiteJsonLd } from "@/lib/seo";

const archiveTitles: Record<ContentType, Record<Locale, { title: string; description: string }>> = {
  reviews: {
    en: { title: "Software Reviews", description: "Every hands-on review, newest first." },
    ar: { title: "مراجعات البرمجيات", description: "كل المراجعات العملية، الأحدث أولاً." },
  },
  compare: {
    en: { title: "Comparisons", description: "Head-to-head breakdowns between popular tools." },
    ar: { title: "المقارنات", description: "تحليلات مباشرة بين الأدوات الشائعة." },
  },
  alternatives: {
    en: { title: "Alternatives", description: "Practical alternatives to software you may be replacing." },
    ar: { title: "البدائل", description: "بدائل عملية للبرمجيات التي تستبدلها." },
  },
  guides: {
    en: { title: "Guides", description: "Practical tutorials for choosing and using software." },
    ar: { title: "الأدلة", description: "أدلة عملية لاختيار البرمجيات واستخدامها." },
  },
};

/** Shared archive template: /reviews, /compare, /alternatives, /guides. */
export default async function ArchivePage({
  type,
  locale,
}: {
  type: ContentType;
  locale: Locale;
}) {
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const meta = archiveTitles[type][locale];
  const articles = await getByType(locale, type);

  return (
    <>
      <JsonLd data={[websiteJsonLd(locale)]} />
      <Container className="py-8 sm:py-10">
        <Breadcrumbs locale={locale} items={[{ label: meta.title }]} />
        <header className="max-w-2xl">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {meta.title}
          </h1>
          <p className="mt-3 text-base text-ink-soft">{meta.description}</p>
          <p className="mt-2 text-sm text-ink-faint">{dict.articlesCount(articles.length)}</p>
        </header>
        <div className="mt-8 max-w-3xl">
          {articles.length > 0 ? (
            articles.map((a) => <ArticleRow key={`${a.type}-${a.slug}`} article={a} locale={locale} />)
          ) : (
            <p className="rounded-lg border border-dashed border-line-strong bg-canvas-dim p-6 text-sm text-ink-soft">
              {locale === "ar" ? "لا مقالات بعد." : "No articles yet."}
            </p>
          )}
        </div>
      </Container>
    </>
  );
}

export async function archiveMetadata(type: ContentType, locale: Locale): Promise<Metadata> {
  const meta = archiveTitles[type][locale];
  const articles = await getByType(locale, type);
  return buildMetadata({
    locale,
    path: `/${contentTypes[type].segment}`,
    title: meta.title,
    description: meta.description,
    noindex: articles.length === 0,
  });
}
