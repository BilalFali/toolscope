/**
 * Table of contents: extract h2/h3 headings from MDX body text.
 * Heading ids are added at render time by rehype-slug (GitHub-style slugs),
 * so the same slugification is used here.
 */

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/** github-slugger compatible slug (lowercase, spaces→dashes, strip punctuation). */
export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u2000-\u206F\u2E00-\u2E7F'!"#$%&()*+,\-./:;<=>?@[\]^`{|}~]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractToc(body: string): TocItem[] {
  const items: TocItem[] = [];
  let insideCodeBlock = false;
  for (const line of body.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }
    if (insideCodeBlock) continue;
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (match) {
      const text = match[2]
        // strip inline markdown (links, bold, code)
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[*_`]/g, "")
        .trim();
      items.push({
        id: slugifyHeading(text),
        text,
        level: match[1].length === 2 ? 2 : 3,
      });
    }
  }
  return items;
}
