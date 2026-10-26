import type { MetadataRoute } from "next";
import { locales } from "@/config/site";
import { getListedArticles, getStaticPages, articleHref } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

/**
 * Listing routes (per locale) that aren't driven by content files directly.
 */
const sectionSegments = ["reviews", "compare", "alternatives", "guides"] as const;
const categorySegments = ["ai-tools", "developer-tools", "software"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({ url: absoluteUrl(`/${locale}`), changeFrequency: "daily", priority: 1 });

    for (const segment of sectionSegments) {
      entries.push({ url: absoluteUrl(`/${locale}/${segment}`), changeFrequency: "daily", priority: 0.7 });
    }
    for (const category of categorySegments) {
      entries.push({ url: absoluteUrl(`/${locale}/${category}`), changeFrequency: "weekly", priority: 0.6 });
    }

    const pages = await getStaticPages(locale);
    for (const page of pages) {
      if (page.noindex) continue;
      entries.push({
        url: absoluteUrl(`/${locale}/${page.slug}`),
        lastModified: page.updatedAt,
        changeFrequency: "monthly",
        priority: 0.3,
      });
    }

    const articles = await getListedArticles(locale);
    for (const article of articles) {
      if (article.demo || article.noindex) continue;

      const languages: Record<string, string> = {};
      for (const other of locales) {
        if (other === locale) continue;
        const counterpart = (await getListedArticles(other)).find(
          (a) => a.type === article.type && a.id === article.id,
        );
        if (counterpart) languages[other] = absoluteUrl(articleHref(counterpart));
      }

      entries.push({
        url: absoluteUrl(articleHref(article)),
        lastModified: article.updatedAt ?? article.publishedAt,
        changeFrequency: "monthly",
        priority: 0.5,
        ...(Object.keys(languages).length ? { alternates: { languages } } : {}),
      });
    }
  }

  return entries;
}
