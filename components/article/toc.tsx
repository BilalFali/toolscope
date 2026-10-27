"use client";

import { useEffect, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { TocItem } from "@/lib/toc";

/**
 * Table of contents with scroll-spy: highlights the section currently in
 * view. Lightweight rAF scroll math — no IntersectionObserver re-wiring
 * needed for statically known heading ids.
 */
export default function TableOfContents({
  items,
  locale,
}: {
  items: TocItem[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length < 2) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = 130; // sticky header + breathing room
      let current: string | null = null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= offset) current = item.id;
      }
      // At the very bottom, force the last section active.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActiveId(atBottom ? items[items.length - 1]?.id ?? null : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav
      aria-labelledby="toc-heading"
      className="rounded-lg border border-line bg-card p-4"
    >
      <h2
        id="toc-heading"
        className="text-xs font-semibold uppercase tracking-widest text-ink-soft"
      >
        {dict.tableOfContents}
      </h2>
      <ol className="mt-3 space-y-1 border-s border-line">
        {items.map((item, i) => {
          const active = item.id === activeId;
          return (
            <li key={`${item.id}-${i}`} className={item.level === 3 ? "ps-5" : "ps-3"}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "true" : undefined}
                className={`-ms-px block border-s-2 py-0.5 text-sm leading-snug transition-colors ${
                  active
                    ? "border-brand font-medium text-brand-deep"
                    : item.level === 2
                      ? "border-transparent font-medium text-ink hover:border-line-strong hover:text-brand"
                      : "border-transparent text-ink-soft hover:border-line-strong hover:text-brand"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
