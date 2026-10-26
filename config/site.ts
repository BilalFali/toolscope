/**
 * Site-wide configuration — the single place to rebrand the publication.
 * Change `name`, `shortName` and `url` here once the real brand/domain is chosen.
 */

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Production URL, no trailing slash. Override with NEXT_PUBLIC_SITE_URL. */
export const siteConfig = {
  name: "ToolScope",
  shortName: "ToolScope",
  tagline: {
    en: "Independent software reviews, tested and explained",
    ar: "مراجعات مستقلة للبرمجيات، مُختبَرة ومُفسَّرة",
  },
  description: {
    en: "Independent reviews of AI tools, developer software, and everyday applications — with clear methodology, honest comparisons, and practical recommendations.",
    ar: "مراجعات مستقلة لأدوات الذكاء الاصطناعي وبرمجيات المطورين والتطبيقات اليومية — بمنهجية واضحة ومقارنات صادقة وتوصيات عملية.",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://toolscope.example",
  founder: {
    name: "The Editor", // Placeholder — replace with your real byline
    location: "Algeria",
  },
  contactEmail: "editor@example.com", // Placeholder
  /** Built from content collections at build time; do not edit. */
  categoryKeys: ["ai-tools", "developer-tools", "software"] as const,
} as const;

export type CategoryKey = (typeof siteConfig.categoryKeys)[number];

export const categories: Record<CategoryKey, Record<Locale, { title: string; description: string }>> = {
  "ai-tools": {
    en: {
      title: "AI Tools",
      description:
        "AI assistants, coding agents, writing tools, and image generators — reviewed with a clear, repeatable methodology.",
    },
    ar: {
      title: "أدوات الذكاء الاصطناعي",
      description: "المساعدات الذكية ووكلاء البرمجة وأدوات الكتابة ومولّدات الصور — نراجعها بمنهجية واضحة وقابلة للتكرار.",
    },
  },
  "developer-tools": {
    en: {
      title: "Developer Software",
      description:
        "IDEs, databases, hosting platforms, APIs, and the infrastructure software that development teams rely on.",
    },
    ar: {
      title: "برمجيات المطورين",
      description: "بيئات التطوير وقواعد البيانات ومنصات الاستضافة وواجهات البرمجة والبنية التحتية التي يعتمد عليها المطورون.",
    },
  },
  software: {
    en: {
      title: "General Software",
      description:
        "PDF editors, note-taking apps, screen recorders, and practical alternatives to everyday software.",
    },
    ar: {
      title: "البرمجيات العامة",
      description: "محررات PDF وتطبيقات الملاحظات وبرامج تسجيل الشاشة وبدائل عملية للبرمجيات اليومية.",
    },
  },
};

/** Content types → URL segments. */
export const contentTypes = {
  reviews: { segment: "reviews" },
  compare: { segment: "compare" },
  alternatives: { segment: "alternatives" },
  guides: { segment: "guides" },
} as const;

export type ContentType = keyof typeof contentTypes;

/** External integration flags — everything degrades gracefully when unset. */
export const integrations = {
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "",
  newsletterEndpoint: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT ?? "",
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  /** logo.dev publishable token — serves real product logos by domain. Falls back to a monogram when unset. */
  logoDevToken: process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN ?? "",
};
