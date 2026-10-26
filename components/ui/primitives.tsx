import type { ReactNode } from "react";
import Link from "next/link";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  href,
  hrefLabel,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
          {title}
        </h2>
        {subtitle ? <p className="mt-1 text-sm text-ink-soft">{subtitle}</p> : null}
      </div>
      {href && hrefLabel ? (
        <Link
          href={href}
          className="rounded border border-line bg-card px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-canvas-dim"
        >
          {hrefLabel}
        </Link>
      ) : null}
    </div>
  );
}

const badgeTones = {
  neutral: "bg-chip text-ink-soft",
  brand: "bg-brand-soft text-brand-deep",
  pos: "bg-pos-soft text-pos",
  neg: "bg-neg-soft text-neg",
  outline: "border border-line bg-card text-ink-soft",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTones;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeTones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function DemoBadge({ label }: { label: string }) {
  return (
    <Badge tone="outline" className="border-dashed">
      {label}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* Shared inline icons                                                  */
/* ------------------------------------------------------------------ */

export function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M8 1.5l5.5 2v4c0 4-2.3 6.3-5.5 7-3.2-.7-5.5-3-5.5-7v-4l5.5-2z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChipIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <rect x="5.5" y="5.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 5.5V3M12 5.5V3M8 17v-2.5M12 17v-2.5M14.5 8H17M14.5 12H17M3 8h2.5M3 12h2.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TerminalIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <rect x="2.5" y="4" width="15" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 8l2.5 2.5-2.5 2.5M10.5 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GridIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function CrossIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
