/**
 * Central affiliate registry — the ONLY place outbound monetized URLs live.
 *
 * How to add a link:
 *   1. Join the provider's program and get your tracking URL.
 *   2. Add an entry here keyed by a stable productId.
 *   3. Reference it in MDX: <AffiliateLink product="cursor">Visit Cursor</AffiliateLink>
 *
 * Until an entry exists, <AffiliateLink> renders a plain link to the product's
 * official website with NO affiliate parameters and NO commission claim.
 */

export interface AffiliateEntry {
  /** Tracking URL including your affiliate parameters. */
  affiliateUrl: string;
  /** Human-readable provider name, shown in the disclosure. */
  provider: string;
  /** When the relationship started (ISO date) — used in disclosures. */
  since?: string;
}

export const affiliateRegistry: Record<string, AffiliateEntry> = {
  // Example (disabled until a real program is joined):
  // cursor: {
  //   affiliateUrl: "https://cursor.com/?ref=YOUR_ID",
  //   provider: "Cursor (Anysphere)",
  //   since: "2026-01-01",
  // },
};

export function getAffiliate(productId: string): AffiliateEntry | undefined {
  return affiliateRegistry[productId];
}

export function hasAffiliate(productId: string): boolean {
  return productId in affiliateRegistry;
}
