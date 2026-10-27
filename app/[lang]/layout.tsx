import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { integrations, isLocale, locales, siteConfig, type Locale } from "@/config/site";
import { getDictionary, dir } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";
import HeaderClient, { type NavItem } from "@/components/layout/header-client";
import Footer from "@/components/layout/footer";
import ConsentAndAnalytics from "@/components/layout/consent-analytics";
import BackToTop from "@/components/ui/back-to-top";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${siteConfig.tagline[locale]}`,
      template: `%s — ${siteConfig.name}`,
    },
    description: siteConfig.description[locale],
    verification: integrations.gscVerification
      ? { google: integrations.gscVerification }
      : undefined,
    alternates: {
      canonical: absoluteUrl(`/${locale}`),
      types: {
        "application/rss+xml": absoluteUrl(`/${locale}/feed.xml`),
      },
      languages: { en: absoluteUrl("/en"), ar: absoluteUrl("/ar"), "x-default": absoluteUrl("/en") },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang;
  const dict = getDictionary(locale);

  // Per-locale font bundle: dynamic imports with literal specifiers keep
  // next/font preloads scoped to the fonts each locale actually renders
  // (EN never downloads Arabic families and vice versa).
  const fonts = await (
    locale === "ar"
      ? import("@/lib/fonts-arabic")
      : import("@/lib/fonts-latin")
  );

  const navItems: NavItem[] = [
    {
      label: locale === "ar" ? "أدوات الذكاء الاصطناعي" : "AI Tools",
      href: `/${locale}/ai-tools`,
    },
    {
      label: locale === "ar" ? "برمجيات المطورين" : "Developer",
      href: `/${locale}/developer-tools`,
    },
    {
      label: locale === "ar" ? "البرمجيات العامة" : "Software",
      href: `/${locale}/software`,
    },
    {
      label: locale === "ar" ? "المقارنات" : "Comparisons",
      href: `/${locale}/compare`,
    },
    {
      label: locale === "ar" ? "الأدلة" : "Guides",
      href: `/${locale}/guides`,
    },
  ];

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={fonts.fontVariables}
    >
      <body className="flex min-h-screen flex-col">
        {integrations.logoDevToken ? (
          <link rel="preconnect" href="https://img.logo.dev" crossOrigin="anonymous" />
        ) : null}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded focus:bg-brand focus:px-3 focus:py-2 focus:text-sm focus:text-white"
        >
          {dict.skipToContent}
        </a>
        <HeaderClient
          locale={locale}
          navItems={navItems}
          dict={{
            menu: dict.menu,
            close: dict.close,
            searchPlaceholder: dict.searchPlaceholder,
            searchSubmit: dict.searchSubmit,
            language: dict.language,
            utilityDisclosure: dict.utilityDisclosure,
          }}
          searchAction={`/${locale}/search`}
          languageSwitchHref={locale === "en" ? "/ar" : "/en"}
          languageSwitchLabel={locale === "en" ? dict.switchTo : dict.switchToEn}
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} />
        <BackToTop dict={{ backToTop: dict.backToTop }} />
        <ConsentAndAnalytics
          locale={locale}
          dict={{
            analyticsConsentTitle: dict.analyticsConsentTitle,
            analyticsConsentBody: dict.analyticsConsentBody,
            consentAccept: dict.consentAccept,
            consentDecline: dict.consentDecline,
            consentPolicyLink: dict.consentPolicyLink,
          }}
        />
      </body>
    </html>
  );
}
