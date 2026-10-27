import Link from "next/link";
import { siteConfig, type Locale } from "@/config/site";
import { getDictionary, localePath } from "@/lib/i18n";

/** Author byline card shown at the end of every article. */
export default function AuthorCard({
  author,
  locale,
}: {
  author: string;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const initial = author.trim().charAt(0).toUpperCase();

  return (
    <aside className="flex items-start gap-4 rounded-lg border border-line bg-card p-5">
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand font-serif text-lg font-semibold text-white"
      >
        {initial}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
          {dict.authorRole}
        </p>
        <p className="mt-0.5 font-serif text-lg font-semibold text-ink">{author}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{dict.authorBio}</p>
        <Link
          href={localePath(locale, "/testing-methodology")}
          className="mt-2 inline-block text-sm font-medium text-brand underline underline-offset-4"
        >
          {dict.methodologyReadMore} →
        </Link>
        <span className="sr-only">{siteConfig.name}</span>
      </div>
    </aside>
  );
}
