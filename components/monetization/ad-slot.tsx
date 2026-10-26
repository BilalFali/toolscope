import { integrations, siteConfig, type Locale } from "@/config/site";
import { getDictionary } from "@/lib/i18n";

/**
 * Clearly-labeled advertising placeholder.
 * - Renders nothing at all unless NEXT_PUBLIC_ADS_ENABLED=true.
 * - Always visually distinct from editorial content: bordered box, "Advertisement"
 *   label, neutral styling — never styled like a button or navigation link.
 * - Placeholder content makes clear no real ad is served yet.
 */
export default function AdSlot({
  locale,
  format = "leaderboard",
  className = "",
}: {
  locale: Locale;
  format?: "leaderboard" | "rectangle";
  className?: string;
}) {
  const dict = getDictionary(locale);
  if (!integrations.adsEnabled) return null;

  return (
    <aside
      aria-label={dict.adLabel}
      className={`my-8 rounded-lg border border-dashed border-line-strong bg-canvas-dim p-4 text-center ${className}`}
    >
      <p className="text-[0.625rem] font-semibold uppercase tracking-widest text-ink-faint">
        {dict.adLabel}
      </p>
      <div
        className={`mt-2 flex items-center justify-center rounded border border-line bg-card text-xs text-ink-faint ${
          format === "leaderboard" ? "h-20" : "h-64"
        }`}
      >
        {dict.adPlaceholderNote}
      </div>
      {/* Ad network script tag mounts here when a partner is configured. */}
      <meta data-ad-slot={format} data-site={siteConfig.name} />
    </aside>
  );
}
