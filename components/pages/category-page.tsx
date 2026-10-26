import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import JsonLd from "@/components/seo/json-ld";
import TagFilterGrid from "@/components/pages/tag-filter-grid";
import { categories, isLocale, type CategoryKey, type Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import { getCategoryArticles } from "@/lib/content";
import { buildMetadata, websiteJsonLd } from "@/lib/seo";

/** Shared template for the three category pages (AI / developer / general). */
export default async function CategoryPage({
  categoryKey,
  locale,
}: {
  categoryKey: CategoryKey;
  locale: Locale;
}) {
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const cat = categories[categoryKey][locale];
  const articles = await getCategoryArticles(locale, categoryKey);

  return (
    <>
      <JsonLd data={[websiteJsonLd(locale)]} />
      <Container className="py-8 sm:py-10">
        <Breadcrumbs locale={locale} items={[{ label: cat.title }]} />
        <header className="max-w-2xl">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {cat.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">{cat.description}</p>
          <p className="mt-2 text-sm text-ink-faint">{dict.articlesCount(articles.length)}</p>
        </header>

        <div className="mt-10">
          {articles.length > 0 ? (
            <TagFilterGrid
              articles={articles}
              locale={locale}
              allLabel={dict.allTopics}
              filterLabel={dict.filterByTag}
            />
          ) : (
            <p className="rounded-lg border border-dashed border-line-strong bg-canvas-dim p-6 text-sm text-ink-soft">
              {locale === "ar"
                ? "لا توجد مقالات في هذا القسم بعد — القادم قريباً."
                : "No articles in this section yet — coming soon."}
            </p>
          )}
        </div>
      </Container>
    </>
  );
}

export async function categoryMetadata(
  categoryKey: CategoryKey,
  locale: Locale,
): Promise<Metadata> {
  const cat = categories[categoryKey][locale];
  return buildMetadata({
    locale,
    path: `/${categoryKey}`,
    title: cat.title,
    description: cat.description,
    noindex: (await getCategoryArticles(locale, categoryKey)).length === 0,
  });
}
