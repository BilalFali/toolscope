import Link from "next/link";
import { getDictionary, localePath, type Locale } from "@/lib/i18n";
import { breadcrumbJsonLd } from "@/lib/seo";

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumb trail + matching BreadcrumbList structured data. */
export default function Breadcrumbs({ locale, items }: { locale: Locale; items: Crumb[] }) {
  const dict = getDictionary(locale);
  const trail: Crumb[] = [{ label: dict.breadcrumbHome, href: localePath(locale, "/") }, ...items];

  const jsonLdItems = trail
    .filter((c) => c.href)
    .map((c) => ({ name: c.label, href: c.href as string }));

  return (
    <>
      <nav aria-label={dict.breadcrumbHome} className="mb-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-faint">
          {trail.map((crumb, i) => (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 ? (
                <span aria-hidden="true" className="text-line-strong">
                  {locale === "ar" ? "‹" : "›"}
                </span>
              ) : null}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-brand hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-ink-soft">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(jsonLdItems)) }}
      />
    </>
  );
}
