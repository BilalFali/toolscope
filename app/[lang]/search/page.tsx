import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/config/site";
import { getListedArticles, articleHref } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import type { SearchDoc } from "@/lib/search";
import SearchClient from "@/components/pages/search-client";
import { Container } from "@/components/ui/primitives";

/** The full bilingual index is small (KBs) and passed to the client component. */
export default async function SearchPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang;
  const dict = getDictionary(locale);

  const docs: SearchDoc[] = [];
  for (const l of locales) {
    const articles = await getListedArticles(l);
    for (const a of articles) {
      if (a.draft) continue;
      docs.push({
        locale: l,
        type: a.type,
        slug: a.slug,
        url: articleHref(a),
        title: a.title,
        description: a.description,
        category: "category" in a ? a.category : undefined,
        tags: a.tags,
        publishedAt: a.publishedAt,
      });
    }
  }

  return (
    <Suspense fallback={<Container className="py-8 sm:py-10">{null}</Container>}>
      <SearchClient
        docs={docs}
        locale={locale}
        dict={{
          searchPageTitle: dict.searchPageTitle,
          searchSubmit: dict.searchSubmit,
          searchPlaceholder: dict.searchPlaceholder,
          searchIndexNote: dict.searchIndexNote,
          searchSuggested: dict.searchSuggested,
          searchResultsFor: dict.searchResultsFor,
          searchNoResults: dict.searchNoResults,
          searchNoResultsHint: dict.searchNoResultsHint,
          reviewsLabel: dict.reviewsLabel,
          compareLabel: dict.compareLabel,
          alternativesLabel: dict.alternativesLabel,
          guidesLabel: dict.guidesLabel,
        }}
      />
    </Suspense>
  );
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
