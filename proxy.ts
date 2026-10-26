import { NextResponse, type NextRequest } from "next/server";

/**
 * Locale routing: English is the default publication language and lives at
 * /en/…, Arabic at /ar/…. Any unprefixed path (/, /about, /reviews/x…) is
 * redirected to the visitor's best locale (Accept-Language, ar* → ar, else en).
 */

const LOCALES = ["en", "ar"] as const;
const DEFAULT_LOCALE = "en";

function negotiateLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    if (!tag) continue;
    const base = tag.split("-")[0];
    if (base === "ar") return "ar";
    if (base === "en") return "en";
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  // Skip Next internals, static assets, metadata files, and the OG image endpoint.
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/og" ||
    pathname.startsWith("/og/") ||
    /\.(svg|png|jpg|jpeg|webp|ico|txt|xml|webmanifest)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const locale = negotiateLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: "/((?!_next/static|_next/image).*)",
};
