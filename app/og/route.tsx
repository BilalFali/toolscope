import { ImageResponse } from "next/og";
import { siteConfig, isLocale, type Locale } from "@/config/site";

/**
 * Dynamic OG image, shared by every locale/page via lib/seo.ts: /og?title=...&locale=...
 * Fonts are fetched from Google Fonts at request time (no bundled font files) —
 * satori only accepts ttf/otf/woff, which Google serves when the request has no
 * browser-identifying headers, so a plain fetch (no custom User-Agent) is enough.
 */

async function loadGoogleFont(family: string, text: string): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@600&text=${encodeURIComponent(text)}`,
  ).then((res) => res.text());
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`Could not resolve font data for ${family}`);
  const res = await fetch(match[1]);
  return res.arrayBuffer();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? siteConfig.name).slice(0, 140);
  const localeParam = searchParams.get("locale") ?? "en";
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";
  const isRtl = locale === "ar";

  const fontFamily = isRtl ? "IBM Plex Sans Arabic" : "Inter";
  const fontData = await loadGoogleFont(fontFamily, `${title}${siteConfig.name}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#0f172a",
          color: "#f8fafc",
          fontFamily,
        }}
      >
        <div
          style={{
            fontSize: 30,
            opacity: 0.7,
            letterSpacing: 2,
            textTransform: "uppercase",
            alignSelf: isRtl ? "flex-end" : "flex-start",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1.25,
            textAlign: isRtl ? "right" : "left",
            alignSelf: isRtl ? "flex-end" : "flex-start",
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: fontFamily, data: fontData, weight: 600, style: "normal" }],
    },
  );
}
