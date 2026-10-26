import { notFound } from "next/navigation";
import { locales, type ContentType, type Locale } from "@/config/site";
import {
  articleHref,
  findTranslation,
  getArticle,
  getListedArticles,
  type Article,
} from "@/lib/content";
import { buildArticleMetadata } from "@/lib/seo";
import ArticleView from "@/components/article/article-view";
import { absoluteUrl } from "@/lib/seo";

/**
 * Shared logic for the four article routes (reviews/compare/alternatives/guides).
 * Each route file stays tiny; hreflang only points at translations that exist.
 */

export async function articleStaticParams(type: ContentType) {
  const params: { lang: Locale; slug: string }[] = [];
  for (const locale of locales) {
    const articles = await getListedArticles(locale);
    for (const a of articles) {
      if (a.type === type) params.push({ lang: locale, slug: a.slug });
    }
  }
  return params;
}

async function loadArticle(
  type: ContentType,
  lang: string,
  slug: string,
): Promise<{ article: Article; translations: { locale: Locale; href: string; title: string }[] } | null> {
  let article: Article | undefined;
  for (const locale of locales) {
    if (locale === lang) {
      article = await getArticle(locale, type, slug);
      if (article) break;
    }
  }
  if (!article || article.locale !== lang) return null;

  const translations: { locale: Locale; href: string; title: string }[] = [];
  for (const locale of locales) {
    if (locale === article.locale) continue;
    const counterpart = await findTranslation(type, article.id, locale);
    if (counterpart) {
      translations.push({
        locale,
        href: articleHref(counterpart),
        title: counterpart.title,
      });
    }
  }
  return { article, translations };
}

export async function articleMetadataFor(type: ContentType, lang: string, slug: string) {
  const loaded = await loadArticle(type, lang, slug);
  if (!loaded) return {};
  return buildArticleMetadata(
    loaded.article,
    loaded.translations.map((t) => ({ locale: t.locale, href: absoluteUrl(t.href) })),
  );
}

export async function renderArticle(type: ContentType, lang: string, slug: string) {
  const loaded = await loadArticle(type, lang, slug);
  if (!loaded) notFound();
  return (
    <ArticleView
      article={loaded.article}
      locale={loaded.article.locale}
      translations={loaded.translations}
    />
  );
}
