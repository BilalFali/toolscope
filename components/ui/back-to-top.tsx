"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

/** Floating back-to-top button, appears after scrolling past the first screen. */
export default function BackToTop({ dict }: { dict: Pick<Dictionary, "backToTop"> }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > 700);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={dict.backToTop}
      title={dict.backToTop}
      className="fixed bottom-5 end-5 z-40 flex size-10 items-center justify-center rounded-full border border-line bg-card text-ink-soft shadow-[0_4px_20px_-2px_rgba(26,26,30,0.12)] transition-colors hover:bg-brand hover:text-white"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
