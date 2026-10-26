import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { CategoryKey, ContentType, Locale } from "@/config/site";
import { contentTypes } from "@/config/site";

/**
 * Content pipeline.
 *
 * Articles are MDX files at: content/<locale>/<type>/<slug>.mdx
 * Static pages are MDX files at: content/<locale>/pages/<slug>.mdx
 *
 * Loaders are async + "use cache": content is read once at build time and
 * cached (content only changes on deploy), keeping every page statically
 * prerendered under Next.js Cache Components.
 *
 * Editorial integrity rules enforced by the templates (not just convention):
 * - `demo: true`  → visible "Demonstration content" banner, noindex, no Article schema.
 * - `draft: true` → excluded from listings/sitemap/search, noindex, draft banner.
 * - `score` is only rendered as a real rating when the article is NOT a demo.
 */

/* ------------------------------------------------------------------ */
/* Frontmatter schemas                                                 */
/* ------------------------------------------------------------------ */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use ISO date: YYYY-MM-DD");

const baseFields = {
  /** Stable id shared between translations of the same article (enables hreflang). */
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(10).max(300),
  author: z.string().min(1),
  publishedAt: isoDate,
  updatedAt: isoDate.optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  /** Marks demonstration content — shown with a banner, kept out of structured data. */
  demo: z.boolean().default(false),
  /** Drafts are excluded from listings, search, and the sitemap. */
  draft: z.boolean().default(false),
  /** Extra guard: exclude a published article from indexing without hiding it. */
  noindex: z.boolean().default(false),
};

const reviewSchema = z.object({
  ...baseFields,
  product: z.object({
    name: z.string().min(1),
    website: z.string().url(),
    developer: z.string().optional(),
  }),
  category: z.enum(["ai-tools", "developer-tools", "software"]),
  /** Editorial score 0–10. Omit entirely when testing is not complete. */
  score: z.number().min(0).max(10).optional(),
  /** One-line editorial verdict shown in the verdict card. */
  verdict: z.string().optional(),
  bestFor: z.array(z.string()).default([]),
  notFor: z.array(z.string()).default([]),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  pricing: z
    .array(
      z.object({
        plan: z.string(),
        price: z.string(),
        notes: z.string().optional(),
      }),
    )
    .default([]),
  /** ISO date when pricing was last verified against the provider's site. */
  pricingCheckedAt: isoDate.optional(),
  /** Product slugs/ids to surface in the alternatives rail. */
  alternatives: z.array(z.string()).default([]),
  /** Short hands-on testing summary rendered in the testing-notes module. */
  testingNotes: z.string().optional(),
});

const comparisonItemSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
  /** Link to our own review of the item, if one exists. */
  reviewSlug: z.string().optional(),
  tagline: z.string().optional(),
  bestFor: z.array(z.string()).default([]),
  pricing: z.string().optional(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
});

const compareSchema = z.object({
  ...baseFields,
  category: z.enum(["ai-tools", "developer-tools", "software"]).optional(),
  items: z.array(comparisonItemSchema).min(2),
  /** Name of the editorial pick, if the comparison reached a conclusion. */
  winner: z.string().optional(),
  winnerNote: z.string().optional(),
});

const alternativesSchema = z.object({
  ...baseFields,
  /** Name of the product being replaced, e.g. "Adobe Acrobat". */
  replaces: z.string().min(1),
  category: z.enum(["ai-tools", "developer-tools", "software"]).optional(),
  picks: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url().optional(),
        tagline: z.string().optional(),
        bestFor: z.string().optional(),
      }),
    )
    .default([]),
});

const guideSchema = z.object({
  ...baseFields,
  category: z.enum(["ai-tools", "developer-tools", "software"]).optional(),
  /** Practical guides can be linked from category pages by topic. */
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

const staticPageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  updatedAt: isoDate.optional(),
  noindex: z.boolean().default(false),
});

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface ArticleBase {
  id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  featured: boolean;
  demo: boolean;
  draft: boolean;
  noindex: boolean;
  locale: Locale;
  type: ContentType;
  slug: string;
  body: string;
  readingMinutes: number;
}

export interface ReviewArticle extends ArticleBase {
  type: "reviews";
  product: { name: string; website: string; developer?: string };
  category: CategoryKey;
  score?: number;
  verdict?: string;
  bestFor: string[];
  notFor: string[];
  pros: string[];
  cons: string[];
  pricing: { plan: string; price: string; notes?: string }[];
  pricingCheckedAt?: string;
  alternatives: string[];
  testingNotes?: string;
}

export interface CompareArticle extends ArticleBase {
  type: "compare";
  category?: CategoryKey;
  items: z.infer<typeof comparisonItemSchema>[];
  winner?: string;
  winnerNote?: string;
}

export interface AlternativesArticle extends ArticleBase {
  type: "alternatives";
  category?: CategoryKey;
  replaces: string;
  picks: { name: string; url?: string; tagline?: string; bestFor?: string }[];
}

export interface GuideArticle extends ArticleBase {
  type: "guides";
  category?: CategoryKey;
  level?: "beginner" | "intermediate" | "advanced";
}

export type Article = ReviewArticle | CompareArticle | AlternativesArticle | GuideArticle;

export interface StaticPage {
  title: string;
  description: string;
  updatedAt?: string;
  noindex: boolean;
  locale: Locale;
  slug: string;
  body: string;
}

const typeSchemas = {
  reviews: reviewSchema,
  compare: compareSchema,
  alternatives: alternativesSchema,
  guides: guideSchema,
} as const;

const contentDir = path.join(process.cwd(), "content");

function readingMinutes(body: string): number {
  const words = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 190));
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, "");
}

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .sort();
}

function parseArticle(locale: Locale, type: ContentType, file: string): Article {
  const full = path.join(contentDir, locale, type, file);
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  const parsed = typeSchemas[type].safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid frontmatter in content/${locale}/${type}/${file} → ${issues}`);
  }
  return {
    ...(parsed.data as Record<string, unknown>),
    locale,
    type,
    slug: slugFromFilename(file),
    body: content.trim(),
    readingMinutes: readingMinutes(content),
  } as unknown as Article;
}

/* ------------------------------------------------------------------ */
/* Cached loaders (build-time)                                         */
/* ------------------------------------------------------------------ */

/** All articles of one locale, newest first. */
export async function getArticles(locale: Locale): Promise<Article[]> {
  "use cache";
  const all: Article[] = [];
  for (const type of Object.keys(contentTypes) as ContentType[]) {
    const dir = path.join(contentDir, locale, type);
    for (const file of listMdxFiles(dir)) {
      all.push(parseArticle(locale, type, file));
    }
  }
  return all.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

/** Articles safe to list publicly (drafts excluded). */
export async function getListedArticles(locale: Locale): Promise<Article[]> {
  const all = await getArticles(locale);
  return all.filter((a) => !a.draft);
}

export async function getReviews(locale: Locale): Promise<ReviewArticle[]> {
  const listed = await getListedArticles(locale);
  return listed.filter((a): a is ReviewArticle => a.type === "reviews");
}

export async function getByType(locale: Locale, type: ContentType): Promise<Article[]> {
  const listed = await getListedArticles(locale);
  return listed.filter((a) => a.type === type);
}

export async function getCategoryArticles(
  locale: Locale,
  category: CategoryKey,
): Promise<Article[]> {
  const listed = await getListedArticles(locale);
  return listed.filter((a) => "category" in a && a.category === category);
}

export async function getCategoryReviews(
  locale: Locale,
  category: CategoryKey,
): Promise<ReviewArticle[]> {
  const reviews = await getReviews(locale);
  return reviews.filter((a) => a.category === category);
}

export async function getArticle(
  locale: Locale,
  type: ContentType,
  slug: string,
): Promise<Article | undefined> {
  "use cache";
  const file = path.join(contentDir, locale, type, `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  return parseArticle(locale, type, path.basename(file));
}

export async function getStaticPage(locale: Locale, slug: string): Promise<StaticPage | undefined> {
  "use cache";
  const file = path.join(contentDir, locale, "pages", `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const parsed = staticPageSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Invalid frontmatter in content/${locale}/pages/${slug}.mdx → ${issues}`);
  }
  return { ...parsed.data, locale, slug, body: content.trim() };
}

export async function getStaticPages(locale: Locale): Promise<StaticPage[]> {
  const dir = path.join(contentDir, locale, "pages");
  const pages: StaticPage[] = [];
  for (const file of listMdxFiles(dir)) {
    const page = await getStaticPage(locale, slugFromFilename(file));
    if (page) pages.push(page);
  }
  return pages;
}

/** Featured review: explicit flag first, else the newest review. */
export async function getFeaturedReview(locale: Locale): Promise<ReviewArticle | undefined> {
  const reviews = await getReviews(locale);
  return reviews.find((r) => r.featured) ?? reviews[0];
}

/** Cross-language counterpart lookup by shared id (drives hreflang + language switch). */
export async function findTranslation(
  type: ContentType,
  id: string,
  locale: Locale,
): Promise<Article | undefined> {
  const listed = await getListedArticles(locale);
  return listed.find((a) => a.type === type && a.id === id);
}

/** Related articles: same category/type overlap on tags, else same type, else recent. */
export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const pool = (await getListedArticles(article.locale)).filter((a) => a.slug !== article.slug);
  const scored = pool.map((a) => {
    let score = 0;
    if (a.type === article.type) score += 2;
    if ("category" in a && "category" in article && a.category === article.category) score += 3;
    score += a.tags.filter((t) => article.tags.includes(t)).length * 2;
    return { a, score };
  });
  return scored
    .sort((x, y) => y.score - x.score || (x.a.publishedAt < y.a.publishedAt ? 1 : -1))
    .slice(0, limit)
    .map((s) => s.a);
}

export { articleHref } from "@/lib/article-href";
