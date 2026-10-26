import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Search results are thin utility pages — keep them out of indexes.
        disallow: ["/*/search", "/search", "/og"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
