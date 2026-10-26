"use client";

import { useMemo, useState } from "react";
import ArticleCard from "@/components/article/article-card";
import type { Article } from "@/lib/content";
import type { Locale } from "@/config/site";

/**
 * Client-side topic filter over an article grid. Articles are plain
 * serializable objects, so the grid stays fully static until interaction.
 */
export default function TagFilterGrid({
  articles,
  locale,
  allLabel,
  filterLabel,
}: {
  articles: Article[];
  locale: Locale;
  allLabel: string;
  filterLabel: string;
}) {
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of articles) {
      for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [articles]);

  const [active, setActive] = useState<string | null>(null);
  const visible = active ? articles.filter((a) => a.tags.includes(active)) : articles;

  if (tags.length === 0) {
    return <ArticleGrid articles={articles} locale={locale} />;
  }

  return (
    <div>
      <div className="mb-5">
        <p className="sr-only">{filterLabel}</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip label={allLabel} active={active === null} onClick={() => setActive(null)} />
          {tags.map(([tag]) => (
            <FilterChip
              key={tag}
              label={tag}
              active={active === tag}
              onClick={() => setActive(active === tag ? null : tag)}
            />
          ))}
        </div>
      </div>
      <ArticleGrid articles={visible} locale={locale} />
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-brand bg-brand text-white"
          : "border-line bg-card text-ink-soft hover:border-brand/40 hover:text-brand"
      }`}
    >
      {label}
    </button>
  );
}

function ArticleGrid({ articles, locale }: { articles: Article[]; locale: Locale }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((a) => (
        <ArticleCard key={`${a.type}-${a.slug}`} article={a} locale={locale} />
      ))}
    </div>
  );
}
