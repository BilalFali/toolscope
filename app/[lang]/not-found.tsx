import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { getDictionary } from "@/lib/i18n";

/** Localized 404 — rendered inside [lang] so dir/lang/fonts are correct. */
export default function NotFound() {
  // notFound() inside [lang] always has a locale context; default to English
  // for any stray case. The locale-aware 404 lives at [lang]/not-found.
  const dict = getDictionary("en");
  return (
    <Container className="py-24 text-center">
      <p className="tnum font-serif text-6xl font-semibold text-brand">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">
        {dict.pageNotFoundTitle}
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">{dict.pageNotFoundBody}</p>
      <Link
        href="/en"
        className="mt-6 inline-block rounded bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-deep"
      >
        {dict.pageNotFoundCta}
      </Link>
    </Container>
  );
}
