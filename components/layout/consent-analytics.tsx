"use client";

import { useCallback, useSyncExternalStore } from "react";
import Script from "next/script";
import { integrations, type Locale } from "@/config/site";
import { localePath } from "@/lib/i18n";

const STORAGE_KEY = "ts-consent";
const CONSENT_EVENT = "ts-consent-change";

interface ConsentDict {
  analyticsConsentTitle: string;
  analyticsConsentBody: string;
  consentAccept: string;
  consentDecline: string;
  consentPolicyLink: string;
}

export type ConsentValue = "granted" | "denied";
type ConsentState = ConsentValue | "none";

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): ConsentState {
  try {
    return (localStorage.getItem(STORAGE_KEY) as ConsentValue | null) ?? "none";
  } catch {
    return "none";
  }
}

function getServerSnapshot(): ConsentState {
  return "none";
}

/**
 * Consent-first analytics: GA4 scripts load ONLY after the visitor accepts,
 * and only when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured. No ID → no
 * banner, no scripts, zero third-party requests.
 *
 * Consent lives in localStorage and is read through useSyncExternalStore:
 * hydration uses the server snapshot, then the real value re-renders — no
 * setState-in-effect cascade, and other tabs stay in sync via the storage event.
 */
export default function ConsentAndAnalytics({ dict, locale }: { dict: ConsentDict; locale: Locale }) {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const decide = useCallback((value: ConsentValue) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage unavailable — session-only */
    }
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  }, []);

  const gaReady = Boolean(integrations.gaMeasurementId) && consent === "granted";
  // Only ask when there is actually something to consent to.
  const showBanner =
    consent === "none" && (Boolean(integrations.gaMeasurementId) || integrations.adsEnabled);

  return (
    <>
      {gaReady ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${integrations.gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('consent', 'default', { ad_storage: '${integrations.adsEnabled ? "granted" : "denied"}', analytics_storage: 'granted' });
gtag('config', '${integrations.gaMeasurementId}', { anonymize_ip: true });`}
          </Script>
        </>
      ) : null}

      {showBanner ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={dict.analyticsConsentTitle}
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-lg border border-line bg-card p-4 shadow-lg sm:inset-x-6"
        >
          <h2 className="text-sm font-semibold text-ink">{dict.analyticsConsentTitle}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{dict.analyticsConsentBody}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => decide("granted")}
              className="rounded bg-brand px-3.5 py-1.5 text-sm font-medium text-white hover:bg-brand-deep"
            >
              {dict.consentAccept}
            </button>
            <button
              type="button"
              onClick={() => decide("denied")}
              className="rounded border border-line px-3.5 py-1.5 text-sm font-medium text-ink hover:bg-canvas-dim"
            >
              {dict.consentDecline}
            </button>
            <a href={localePath(locale, "/privacy-policy")} className="text-xs text-ink-faint underline">
              {dict.consentPolicyLink}
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
