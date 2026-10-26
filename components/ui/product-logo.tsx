"use client";

import { useState } from "react";
import { integrations } from "@/config/site";

/**
 * Real product logo via logo.dev (domain -> logo lookup), falling back to a
 * generated monogram when no token is set, the domain can't be parsed, or
 * the logo fails to load (not every product is in logo.dev's database).
 */

const monogramPalette = ["#2d46b9", "#0d7a53", "#b42318", "#7a4fb5", "#b5631f", "#1e7d8c"];

function monogramColor(name: string): string {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return monogramPalette[sum % monogramPalette.length];
}

function domainFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function ProductLogo({
  name,
  website,
  size = 36,
  className = "",
}: {
  name: string;
  website?: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const domain = domainFromUrl(website);
  const src =
    domain && integrations.logoDevToken
      ? `https://img.logo.dev/${domain}?token=${integrations.logoDevToken}&size=${size * 2}&format=png`
      : null;

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded font-serif font-semibold text-white ${className}`}
        style={{ width: size, height: size, backgroundColor: monogramColor(name), fontSize: size * 0.42 }}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external domain, not optimizable by next/image
    <img
      src={src}
      alt={`${name} logo`}
      width={size}
      height={size}
      className={`shrink-0 rounded border border-line bg-white object-contain ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
