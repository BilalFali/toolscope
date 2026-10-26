"use client";

import { useState } from "react";
import { integrations } from "@/config/site";

interface NewsletterDict {
  newsletterUnavailable: string;
  newsletterSubscribed: string;
  newsletterEmailLabel: string;
  newsletterEmailPlaceholder: string;
  newsletterSubscribe: string;
  newsletterConsent: string;
  newsletterError: string;
}

/**
 * Consent-first newsletter form.
 * - No endpoint configured → renders an honest notice, collects nothing.
 * - Endpoint configured → explicit consent checkbox required before submit.
 */
export default function NewsletterForm({ dict }: { dict: NewsletterDict }) {
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");
  const [consent, setConsent] = useState(false);
  const endpoint = integrations.newsletterEndpoint;

  if (!endpoint) {
    return (
      <p className="rounded-lg border border-dashed border-line-strong bg-canvas-dim p-4 text-sm leading-relaxed text-ink-soft">
        {dict.newsletterUnavailable}
      </p>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!consent) return;
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true, ts: new Date().toISOString() }),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p className="rounded-lg border border-pos/40 bg-pos-soft p-4 text-sm font-medium text-pos">
        {dict.newsletterSubscribed}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md">
      <div className="flex">
        <label htmlFor="newsletter-email" className="sr-only">
          {dict.newsletterEmailLabel}
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder={dict.newsletterEmailPlaceholder}
          className="min-w-0 flex-1 rounded-s border border-line bg-card px-3.5 py-2.5 text-sm"
        />
        <button
          type="submit"
          disabled={!consent}
          className="rounded-e border border-s-0 border-brand bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          {dict.newsletterSubscribe}
        </button>
      </div>
      <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-ink-soft">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-3.5 accent-[#2d46b9]"
        />
        {dict.newsletterConsent}
      </label>
      {status === "error" ? (
        <p className="mt-2 text-xs text-neg">{dict.newsletterError}</p>
      ) : null}
    </form>
  );
}
