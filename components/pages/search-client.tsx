"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import Breadcrumbs from "@/components/seo/breadcrumbs";
import { searchDocs, type SearchDoc } from "@/lib/search";
import type { Locale } from "@/config/site";

interface SearchDict {
  searchPageTitle: string;
  searchSubmit: string;
  searchPlaceholder: string;
  searchIndexNote: string;
  searchSuggested: string;
  searchResultsFor: string;
  searchNoResults: string;
  searchNoResultsHint: string;
  reviewsLabel: string;
  compareLabel: string;
  alternativesLabel: string;
  guidesLabel: string;
}

const typeKeyMap: Record<string, keyof SearchDict> = {
  reviews: "reviewsLabel",
  compare: "compareLabel",
  alternatives: "alternativesLabel",
  guides: "guidesLabel",
};

export default function SearchClient({
  docs,
  locale,
  dict,
}: {
  docs: SearchDoc[];
  locale: Locale;
  dict: SearchDict;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  // Keep URL shareable: /search?q=...
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      const qs = params.toString();
      router.replace(qs ? `/${locale}/search?${qs}` : `/${locale}/search`, { scroll: false });
    }, 250);
    return () => clearTimeout(t);
  }, [query, locale, router]);

  const results = useMemo(() => searchDocs(docs, query), [docs, query]);

  const suggestions = useMemo(() => {
    const tags = new Map<string, number>();
    for (const d of docs) for (const t of d.tags) tags.set(t, (tags.get(t) ?? 0) + 1);
    return [...tags.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t);
  }, [docs]);

  return (
    <Container className="py-8 sm:py-10">
      <Breadcrumbs locale={locale} items={[{ label: dict.searchPageTitle }]} />
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {dict.searchPageTitle}
      </h1>

      <form
        role="search"
        className="mt-6 flex max-w-xl"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="search-input" className="sr-only">
          {dict.searchSubmit}
        </label>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.searchPlaceholder}
          className="min-w-0 flex-1 rounded-s border border-line bg-card px-4 py-2.5 text-sm"
          autoFocus
        />
        <button
          type="submit"
          className="rounded-e border border-s-0 border-brand bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-deep"
        >
          {dict.searchSubmit}
        </button>
      </form>

      <p className="mt-2 text-xs text-ink-faint">{dict.searchIndexNote}</p>

      {query.trim() === "" ? (
        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
            {dict.searchSuggested}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-ink-soft hover:border-brand/40 hover:text-brand"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 max-w-3xl">
          <h2 className="text-sm text-ink-soft">
            {dict.searchResultsFor}{" "}
            <span className="font-serif text-lg font-semibold text-ink">“{query}”</span>{" "}
            <span className="tnum text-ink-faint">({results.length})</span>
          </h2>
          <div className="mt-4">
            {results.length === 0 ? (
              <div className="rounded-lg border border-dashed border-line-strong bg-canvas-dim p-6">
                <p className="text-sm font-medium text-ink">{dict.searchNoResults}</p>
                <p className="mt-1 text-sm text-ink-soft">{dict.searchNoResultsHint}</p>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {results.map((doc) => {
                  const key = `${doc.locale}-${doc.type}-${doc.slug}`;
                  const typeLabel = dict[typeKeyMap[doc.type] ?? "reviewsLabel"];
                  return (
                    <li key={key} className="py-4">
                      <article>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-faint">
                          <span className="rounded-full bg-chip px-2 py-0.5 font-semibold uppercase tracking-wider">
                            {typeLabel}
                          </span>
                          <span>{doc.locale === "ar" ? "العربية" : "English"}</span>
                        </div>
                        <h3 className="mt-1.5 font-serif text-lg font-semibold leading-snug">
                          <Link
                            href={doc.url}
                            hrefLang={doc.locale}
                            className="text-ink hover:text-brand-deep hover:underline"
                          >
                            {doc.title}
                          </Link>
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
                          {doc.description}
                        </p>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
