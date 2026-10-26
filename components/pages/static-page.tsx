import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import MdxContent from "@/components/article/mdx-content";
import { isLocale, type Locale } from "@/config/site";
import { getDictionary, formatDate } from "@/lib/i18n";
import { getStaticPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

/** Shared template for editorial/legal pages (about, policies, contact…). */
export default async function StaticPageView({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const page = await getStaticPage(locale, slug);
  if (!page) notFound();

  return (
    <Container className="py-8 sm:py-10">
      <Breadcrumbs locale={locale} items={[{ label: page.title }]} />
      <article className="mx-auto max-w-3xl">
        <header>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {page.title}
          </h1>
          {page.updatedAt ? (
            <p className="mt-2 text-sm text-ink-faint">
              {dict.lastUpdated}: {formatDate(page.updatedAt, locale)}
            </p>
          ) : null}
        </header>
        <div className="mdx-body mt-8">
          <MdxContent source={page.body} locale={locale} />
        </div>
      </article>
    </Container>
  );
}

export async function staticPageMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const page = await getStaticPage(locale, slug);
  if (!page) return {};
  return buildMetadata({
    locale,
    path: `/${slug}`,
    title: page.title,
    description: page.description,
    noindex: page.noindex,
  });
}
