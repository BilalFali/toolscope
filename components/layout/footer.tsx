import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { siteConfig, type Locale } from "@/config/site";
import { getDictionary, localePath } from "@/lib/i18n";

/** Prerendered and cached at build time; the year only needs to change on redeploy. */
async function currentYear(): Promise<number> {
  "use cache";
  return new Date().getFullYear();
}

export default async function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const year = await currentYear();

  const categoryLinks = siteConfig.categoryKeys.map((key) => ({
    href: localePath(locale, `/${key}`),
    label:
      locale === "ar"
        ? { "ai-tools": "أدوات الذكاء الاصطناعي", "developer-tools": "برمجيات المطورين", software: "البرمجيات العامة" }[key]
        : { "ai-tools": "AI Tools", "developer-tools": "Developer Software", software: "General Software" }[key],
  }));

  const archiveLinks = [
    { href: localePath(locale, "/reviews"), label: dict.reviewsLabel },
    { href: localePath(locale, "/compare"), label: dict.compareLabel },
    { href: localePath(locale, "/alternatives"), label: dict.alternativesLabel },
    { href: localePath(locale, "/guides"), label: dict.guidesLabel },
  ];

  const aboutLinks = [
    { href: localePath(locale, "/about"), label: locale === "ar" ? "عن المنشور" : "About" },
    { href: localePath(locale, "/testing-methodology"), label: locale === "ar" ? "منهجية الاختبار" : "Testing Methodology" },
    { href: localePath(locale, "/editorial-policy"), label: locale === "ar" ? "السياسة التحريرية" : "Editorial Policy" },
    { href: localePath(locale, "/contact"), label: locale === "ar" ? "اتصل بنا" : "Contact" },
  ];

  const legalLinks = [
    { href: localePath(locale, "/privacy-policy"), label: locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy" },
    { href: localePath(locale, "/terms"), label: locale === "ar" ? "شروط الاستخدام" : "Terms of Use" },
    { href: localePath(locale, "/affiliate-disclosure"), label: locale === "ar" ? "إفصاح العمولة" : "Affiliate Disclosure" },
  ];

  return (
    <footer className="mt-20 border-t border-line bg-canvas-dim">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href={localePath(locale, "/")} className="flex items-baseline gap-1.5">
              <span aria-hidden="true" className="inline-block size-2.5 rounded-full bg-brand" />
              <span className="font-serif text-lg font-semibold text-ink">{siteConfig.name}</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
              {dict.footerDisclosure}
            </p>
            <div className="mt-4 max-w-sm rounded border border-line bg-canvas p-3 text-xs leading-relaxed text-ink-faint">
              <p className="font-semibold text-ink-soft">{dict.affiliateDisclosureShort}</p>
              <p className="mt-1">{dict.affiliateDisclosureLong}</p>
            </div>
          </div>

          <nav aria-label={dict.footerSectionsTitle}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              {dict.footerSectionsTitle}
            </h2>
            <ul className="mt-3 space-y-2">
              {[...categoryLinks, ...archiveLinks].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-soft hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={dict.footerAboutTitle}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              {dict.footerAboutTitle}
            </h2>
            <ul className="mt-3 space-y-2">
              {aboutLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-soft hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={dict.footerLegalTitle}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              {dict.footerLegalTitle}
            </h2>
            <ul className="mt-3 space-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-soft hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="text-xs text-ink-faint">
            {dict.footerRights(year, siteConfig.name)}
          </p>
        </div>
      </Container>
    </footer>
  );
}
