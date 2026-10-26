import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, siteConfig, type Locale } from "@/config/site";
import {
  getCategoryArticles,
  getFeaturedReview,
  getReviews,
  getByType,
  type CompareArticle,
} from "@/lib/content";
import { buildMetadata, websiteJsonLd, organizationJsonLd } from "@/lib/seo";
import ArticleCard from "@/components/article/article-card";
import {
  CategoryBlock,
  ComparisonsSection,
  FeaturedReview,
  Hero,
  HowWeTestStrip,
  NewsletterSection,
} from "@/components/home/sections";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { getDictionary, localePath } from "@/lib/i18n";
import JsonLd from "@/components/seo/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  return buildMetadata({
    locale,
    path: "/",
    title: `${siteConfig.name} — ${siteConfig.tagline[locale]}`,
    description: siteConfig.description[locale],
    alternates: [
      { locale: "en", href: `${siteConfig.url}/en` },
      { locale: "ar", href: `${siteConfig.url}/ar` },
    ],
  });
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang;
  const dict = getDictionary(locale);

  const [featured, reviews, comparisons, alternatives, aiArticles, devArticles, swArticles] =
    await Promise.all([
      getFeaturedReview(locale),
      getReviews(locale),
      getByType(locale, "compare"),
      getByType(locale, "alternatives"),
      getCategoryArticles(locale, "ai-tools"),
      getCategoryArticles(locale, "developer-tools"),
      getCategoryArticles(locale, "software"),
    ]);

  const latestReviews = reviews.filter((r) => r.slug !== featured?.slug).slice(0, 6);
  const compareArticles = comparisons.filter((c): c is CompareArticle => c.type === "compare");
  const scoreBySlug = new Map(
    reviews.filter((r) => r.score !== undefined).map((r) => [r.slug, r.score as number]),
  );
  const topAlternatives = alternatives.slice(0, 2);

  return (
    <>
      <JsonLd data={[websiteJsonLd(locale), organizationJsonLd(locale)]} />
      <Hero locale={locale} />

      <div className="space-y-14 py-12">
        <FeaturedReview review={featured} locale={locale} />

        {latestReviews.length > 0 ? (
          <section aria-labelledby="latest-heading">
            <Container>
              <SectionHeading
                title={dict.latestReviews}
                href={localePath(locale, "/reviews")}
                hrefLabel={dict.viewAll}
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {latestReviews.map((r) => (
                  <ArticleCard key={r.slug} article={r} locale={locale} />
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        <ComparisonsSection comparisons={compareArticles} scoreBySlug={scoreBySlug} locale={locale} />

        {topAlternatives.length > 0 ? (
          <section aria-labelledby="alternatives-heading">
            <Container>
              <SectionHeading
                title={dict.alternativesLabel}
                href={localePath(locale, "/alternatives")}
                hrefLabel={dict.viewAll}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {topAlternatives.map((a) => (
                  <ArticleCard key={a.slug} article={a} locale={locale} />
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        <section aria-labelledby="categories-heading">
          <Container>
            <SectionHeading title={dict.categoriesTitle} subtitle={dict.categoriesSubtitle} />
          </Container>
          <div className="space-y-12">
            <CategoryBlock categoryKey="ai-tools" locale={locale} articles={aiArticles} />
            <CategoryBlock categoryKey="developer-tools" locale={locale} articles={devArticles} />
            <CategoryBlock categoryKey="software" locale={locale} articles={swArticles} />
          </div>
        </section>

        <HowWeTestStrip locale={locale} />
      </div>

      <NewsletterSection locale={locale} />
    </>
  );
}
