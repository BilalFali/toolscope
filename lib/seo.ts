import type { Metadata } from "next";
import { siteConfig, type Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";
import type { Article } from "@/lib/content";
import { articleHref } from "@/lib/article-href";

/**
 * Central metadata builder: title, description, canonical, Open Graph,
 * Twitter card, hreflang alternates. robots rules honor demo/draft/noindex.
 */

export function absoluteUrl(pathname: string): string {
  return `${siteConfig.url}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

interface PageMetaInput {
  locale: Locale;
  /** Pathname without locale prefix, e.g. "/reviews/cursor". */
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
  /** hreflang counterparts: [{ locale, href }] — only when pages genuinely exist. */
  alternates?: { locale: string; href: string }[];
}

export function buildMetadata(input: PageMetaInput): Metadata {
  const { locale, path, title, description } = input;
  const canonical = absoluteUrl(`/${locale}${path === "/" ? "" : path}`);
  const ogImage = `${siteConfig.url}/og?title=${encodeURIComponent(title)}&locale=${locale}`;

  const alternatesLanguages: Record<string, string> = {};
  for (const alt of input.alternates ?? []) {
    // Tolerate hrefs that are already absolute (callers mix both forms).
    alternatesLanguages[alt.locale] = alt.href.startsWith("http")
      ? alt.href
      : absoluteUrl(alt.href);
  }
  alternatesLanguages["x-default"] =
    alternatesLanguages["en"] ?? canonical;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: alternatesLanguages,
    },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      type: input.type ?? "website",
      ...(input.type === "article"
        ? {
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime ?? input.publishedTime,
            tags: input.tags,
          }
        : {}),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Metadata for an article, including hreflang when translations exist. */
export function buildArticleMetadata(
  article: Article,
  translations: { locale: Locale; href: string }[],
): Metadata {
  // hreflang sets should include the page's own language as well as counterparts.
  const alternates = [
    { locale: article.locale, href: articleHref(article) },
    ...translations.map((t) => ({ locale: t.locale, href: t.href })),
  ];
  return buildMetadata({
    locale: article.locale,
    path: articleHref(article).replace(`/${article.locale}`, ""),
    title: article.title,
    description: article.description,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt ?? article.publishedAt,
    tags: article.tags,
    // Demo and draft content never enters search indexes.
    noindex: article.demo || article.draft || article.noindex,
    alternates,
  });
}

/* ------------------------------------------------------------------ */
/* JSON-LD builders — only schema types backed by real visible content  */
/* ------------------------------------------------------------------ */

export function websiteJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: locale === "ar" ? `${siteConfig.name} — ${dict.siteTagline}` : undefined,
    url: absoluteUrl(`/${locale}`),
    description: siteConfig.description[locale],
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl(`/${locale}/search`)}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl(`/${locale}`),
    description: siteConfig.description[locale],
    founder: { "@type": "Person", name: siteConfig.founder.name },
    ...(siteConfig.contactEmail
      ? { email: `mailto:${siteConfig.contactEmail}` }
      : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

/**
 * Article schema — ONLY for non-demo published articles with real editorial
 * content. Demo articles get no Article schema (and never Review/aggregateRating,
 * which would require genuinely tested ratings).
 */
export function articleJsonLd(article: Article) {
  if (article.demo || article.draft) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article" as const,
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    inLanguage: article.locale,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: absoluteUrl(articleHref(article)),
  };
}
