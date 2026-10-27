import { getListedArticles, articleHref } from "@/lib/content";
import { getStaticPages } from "@/lib/content";
import { siteConfig, isLocale, locales } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Per-locale RSS 2.0 feed of listed (non-draft) articles, generated at build.
 * Demo articles are excluded — they are not real editorial content yet.
 */

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string }> },
) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return new Response("Not found", { status: 404 });
  }
  const locale = lang;
  const [articles, pages] = await Promise.all([
    getListedArticles(locale),
    getStaticPages(locale),
  ]);

  const about = pages.find((p) => p.slug === "about");
  const items = articles
    .filter((a) => !a.demo)
    .map((a) => {
      const url = absoluteUrl(articleHref(a));
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(a.type)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — ${escapeXml(siteConfig.tagline[locale])}</title>
    <link>${absoluteUrl(`/${locale}`)}</link>
    <description>${escapeXml(about?.description ?? siteConfig.description[locale])}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl(`/${locale}/feed.xml`)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
