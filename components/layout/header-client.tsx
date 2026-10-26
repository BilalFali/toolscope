"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n";
import { siteConfig } from "@/config/site";

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Interactive part of the header: mobile menu drawer + search box.
 * Receives plain serializable props from the server header.
 */
export default function HeaderClient({
  locale,
  navItems,
  dict,
  searchAction,
  languageSwitchHref,
  languageSwitchLabel,
}: {
  locale: string;
  navItems: NavItem[];
  dict: Pick<
    Dictionary,
    "menu" | "close" | "searchPlaceholder" | "searchSubmit" | "language" | "utilityDisclosure"
  >;
  searchAction: string;
  languageSwitchHref: string;
  languageSwitchLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Utility rail */}
      <div className="hidden border-b border-line bg-canvas-dim md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-1.5">
          <p className="text-xs text-ink-faint">{dict.utilityDisclosure}</p>
          <Link
            href={languageSwitchHref}
            hrefLang={locale === "en" ? "ar" : "en"}
            aria-label={`${dict.language}: ${languageSwitchLabel}`}
            className="rounded border border-line bg-card px-2.5 py-1 text-xs font-semibold text-ink transition-colors hover:bg-brand-soft hover:text-brand-deep"
          >
            {locale === "en" ? "العربية" : "English"}
          </Link>
        </div>
      </div>

      {/* Main bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="rounded border border-line bg-card p-2 text-ink md:hidden"
          >
            <span className="sr-only">{open ? dict.close : dict.menu}</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              {open ? (
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" />
              ) : (
                <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.6" />
              )}
            </svg>
          </button>

          <Link href={`/${locale}`} className="flex items-baseline gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block size-2.5 rounded-full bg-brand align-baseline"
            />
            <span className="font-serif text-xl font-semibold tracking-tight text-ink">
              {siteConfig.name}
            </span>
          </Link>

          <nav aria-label={dict.menu} className="hidden flex-1 md:block">
            <ul className="flex items-center justify-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:bg-brand-soft hover:text-brand-deep"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <form
            action={searchAction}
            method="get"
            role="search"
            className="ms-auto hidden items-center md:flex"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get("q");
              router.push(`${searchAction}?q=${encodeURIComponent(String(q ?? ""))}`);
            }}
          >
            <label htmlFor="header-search" className="sr-only">
              {dict.searchSubmit}
            </label>
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder={dict.searchPlaceholder}
              className="w-48 rounded-s border border-line bg-card px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:w-60 focus:outline-none focus-visible:outline-2 lg:w-56"
            />
            <button
              type="submit"
              aria-label={dict.searchSubmit}
              className="rounded-e border border-s-0 border-brand bg-brand px-2.5 py-1.5 text-white transition-colors hover:bg-brand-deep"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </form>

          {/* Mobile language switch */}
          <Link
            href={languageSwitchHref}
            hrefLang={locale === "en" ? "ar" : "en"}
            className="rounded border border-line bg-card px-2 py-1.5 text-xs font-semibold text-ink md:hidden"
          >
            {locale === "en" ? "ع" : "EN"}
          </Link>
        </div>

        {/* Mobile drawer */}
        {open ? (
          <div id="mobile-nav" className="border-t border-line bg-card md:hidden">
            <nav aria-label={dict.menu} className="px-4 py-3">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded px-3 py-2 text-sm font-medium text-ink hover:bg-brand-soft hover:text-brand-deep"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <form action={searchAction} method="get" role="search" className="mt-3 flex">
                <label htmlFor="mobile-search" className="sr-only">
                  {dict.searchSubmit}
                </label>
                <input
                  id="mobile-search"
                  name="q"
                  type="search"
                  placeholder={dict.searchPlaceholder}
                  className="min-w-0 flex-1 rounded-s border border-line bg-canvas px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-e border border-s-0 border-brand bg-brand px-3 py-2 text-sm font-medium text-white"
                >
                  {dict.searchSubmit}
                </button>
              </form>
            </nav>
          </div>
        ) : null}
      </header>
    </>
  );
}
