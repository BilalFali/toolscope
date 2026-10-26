import { contentTypes, type ContentType, type Locale } from "@/config/site";

/**
 * Kept out of lib/content.ts (which has "use cache" loaders) so client
 * components can import it without pulling server-only content loading
 * into the client bundle.
 */
export function articleHref(article: { locale: Locale; type: ContentType; slug: string }): string {
  return `/${article.locale}/${contentTypes[article.type].segment}/${article.slug}`;
}
