"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

/**
 * Privacy-friendly share row: plain link intents (no SDKs, no tracking
 * scripts) + a local copy-to-clipboard button.
 */
export default function ShareRow({
  url,
  title,
  dict,
}: {
  url: string;
  title: string;
  dict: Pick<Dictionary, "shareArticle" | "copyLink" | "linkCopied">;
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API unavailable (permissions/insecure context): fall back.
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label={dict.shareArticle}>
      <span className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
        {dict.shareArticle}
      </span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener nofollow"
          className="rounded border border-line bg-card px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className="rounded border border-line bg-card px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
      >
        {copied ? dict.linkCopied : dict.copyLink}
      </button>
    </div>
  );
}
