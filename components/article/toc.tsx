import { getDictionary, type Locale } from "@/lib/i18n";
import type { TocItem } from "@/lib/toc";

/** Static table of contents rendered in the article rail. */
export default function TableOfContents({
  items,
  locale,
}: {
  items: TocItem[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  if (items.length < 2) return null;

  return (
    <nav aria-labelledby="toc-heading" className="rounded-lg border border-line bg-card p-4">
      <h2
        id="toc-heading"
        className="text-xs font-semibold uppercase tracking-widest text-ink-soft"
      >
        {dict.tableOfContents}
      </h2>
      <ol className="mt-3 space-y-1.5">
        {items.map((item, i) => (
          <li
            key={`${item.id}-${i}`}
            className={item.level === 3 ? "ps-4" : ""}
          >
            <a
              href={`#${item.id}`}
              className={`block text-sm leading-snug hover:text-brand hover:underline ${
                item.level === 2 ? "font-medium text-ink" : "text-ink-soft"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
