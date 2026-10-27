"use client";

import { useRef, useState, type ComponentProps } from "react";
import type { Dictionary } from "@/lib/i18n";

/**
 * Code block with a copy button. Wraps the original <pre> untouched
 * (styling comes from .mdx-body pre) and adds a small corner action.
 */
export default function CodeBlock({
  dict,
  children,
  ...rest
}: { dict: Pick<Dictionary, "copyCode" | "codeCopied"> } & ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group/code relative">
      <pre ref={ref} {...rest}>
        {children}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-live="polite"
        className="absolute end-2 top-2 rounded border border-white/15 bg-white/10 px-2 py-1 text-[0.6875rem] font-medium text-white/80 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/code:opacity-100"
      >
        {copied ? dict.codeCopied : dict.copyCode}
      </button>
    </div>
  );
}
