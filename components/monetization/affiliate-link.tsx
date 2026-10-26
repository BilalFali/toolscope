import type { ReactNode } from "react";
import { getAffiliate, hasAffiliate } from "@/config/affiliates";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * Affiliate-aware outbound link.
 * - If the product has an entry in config/affiliates.ts → tracking URL with
 *   rel="sponsored nofollow" + visible short disclosure.
 * - If not → plain official link, rel="nofollow", and NO commission claim.
 */
export default function AffiliateLink({
  product,
  productUrl,
  children,
  locale,
  variant = "inline",
}: {
  /** Stable product id in config/affiliates.ts. */
  product: string;
  /** Fallback official URL when no affiliate entry exists. */
  productUrl?: string;
  children: ReactNode;
  locale: Locale;
  variant?: "inline" | "button";
}) {
  const entry = getAffiliate(product);
  const href = entry?.affiliateUrl ?? productUrl;
  const dict = getDictionary(locale);

  if (!href) {
    return (
      <span className="text-sm text-ink-faint">
        <sup>†</sup> {dict.affiliateNoneConfigured}
      </span>
    );
  }

  const monetized = hasAffiliate(product);

  const rel = monetized ? "sponsored nofollow noopener" : "nofollow noopener";

  if (variant === "button") {
    return (
      <span className="inline-flex flex-col items-start gap-1">
        <a
          href={href}
          rel={rel}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep"
        >
          {children ?? dict.visitProvider}
          <ExternalIcon />
        </a>
        <span className="text-[0.6875rem] text-ink-faint">
          {monetized ? dict.affiliateDisclosureShort : dict.visitSite + " ↗"}
        </span>
      </span>
    );
  }

  return (
    <a href={href} rel={rel} target="_blank" className="items-baseline">
      {children}
      <sup aria-hidden="true" className="ms-0.5 text-[0.7em]">
        {monetized ? "※" : "↗"}
      </sup>
      <span className="sr-only">
        {monetized ? ` (${dict.affiliateDisclosureShort})` : ` (${dict.visitSite})`}
      </span>
    </a>
  );
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M5 1h6v6M11 1L4.5 7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 7v3.5H1.5V2H5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
