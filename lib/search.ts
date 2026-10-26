/**
 * Search: build-time index over listed (non-draft) articles in BOTH locales,
 * searched client-side. Handles Arabic normalization so users can type with
 * or without diacritics and unified letter forms.
 */

export interface SearchDoc {
  locale: string;
  type: string;
  slug: string;
  url: string;
  title: string;
  description: string;
  category?: string;
  tags: string[];
  publishedAt: string;
}

/** Normalize text for matching: lowercase, Arabic diacritics + letter unification. */
export function normalizeForSearch(input: string): string {
  return input
    .toLowerCase()
    // Arabic diacritics (tashkeel) and tatweel
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    // Unify alef variants → ا
    .replace(/[أإآٱ]/g, "ا")
    // ya with dots → ي, alef maqsura → ي
    .replace(/[يى]/g, "ي")
    // ta marbuta → ه (common loose-match convention)
    .replace(/ة/g, "ه")
    // Normalize punctuation to spaces
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function docText(doc: SearchDoc): string {
  return normalizeForSearch(
    [doc.title, doc.description, doc.category ?? "", doc.tags.join(" "), doc.type].join(" "),
  );
}

/** Simple token-subset matching with a title boost — adequate for a small corpus. */
export function searchDocs(docs: SearchDoc[], rawQuery: string): SearchDoc[] {
  const query = normalizeForSearch(rawQuery);
  if (!query) return [];
  const terms = query.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const results = docs.map((doc) => {
    const haystack = docText(doc);
    const titleText = normalizeForSearch(doc.title);
    let score = 0;
    let matchedAll = true;
    for (const term of terms) {
      if (haystack.includes(term)) score += 1;
      else matchedAll = false;
      if (titleText.includes(term)) score += 3;
      if (doc.tags.some((t) => normalizeForSearch(t) === term)) score += 2;
    }
    return { doc, score: matchedAll ? score : 0 };
  });

  return results
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.doc);
}
