import type { ComponentProps, ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { Locale } from "@/config/site";
import AffiliateLink from "@/components/monetization/affiliate-link";

/**
 * Renders MDX article bodies with the editorial component set:
 * - GFM tables wrapped in a horizontally-scrollable shell (RTL-safe).
 * - <AffiliateLink product="…" url="…"> available to authors.
 * - <Callout> for testing notes / methodology asides.
 */

function Callout({
  title,
  tone = "brand",
  children,
}: {
  title?: string;
  tone?: "brand" | "pos" | "neg" | "neutral";
  children: ReactNode;
}) {
  const tones = {
    brand: "border-brand bg-brand-soft/60",
    pos: "border-pos bg-pos-soft",
    neg: "border-neg bg-neg-soft",
    neutral: "border-line-strong bg-canvas-dim",
  } as const;
  return (
    <aside className={`my-6 rounded-lg border-s-4 border border-s-4 ${tones[tone]} p-4`}>
      {title ? (
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
          {title}
        </p>
      ) : null}
      <div className="text-[0.9375rem] leading-relaxed text-ink">{children}</div>
    </aside>
  );
}

export default function MdxContent({
  source,
  locale,
}: {
  source: string;
  locale: Locale;
}) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      }}
      components={{
        table: (props: ComponentProps<"table">) => (
          <div className="table-scroll" role="region" aria-label="table" tabIndex={0}>
            <table {...props} />
          </div>
        ),
        AffiliateLink: ({
          product,
          url,
          children,
        }: {
          product: string;
          url?: string;
          children?: ReactNode;
        }) => (
          <AffiliateLink product={product} productUrl={url} locale={locale}>
            {children}
          </AffiliateLink>
        ),
        Callout,
        a: (props: ComponentProps<"a">) => {
          const external = typeof props.href === "string" && props.href.startsWith("http");
          if (external) {
            return <a {...props} rel={`${props.rel ?? ""} nofollow noopener`.trim()} target="_blank" />;
          }
          return <a {...props} />;
        },
      }}
    />
  );
}
