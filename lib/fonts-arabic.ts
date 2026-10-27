import { Amiri, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";

/**
 * Arabic font bundle (Arabic pages) + Inter for numerals/code/tnum.
 * Instantiated in its own module so next/font preloads it ONLY on pages that
 * render it — English pages must not preload the two large Arabic families.
 *
 * IBM Plex Sans Arabic ships 400/700 only (static family, largest payload);
 * intermediate weights resolve to the nearest real weight.
 */

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: false,
  display: "swap",
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-plex-arabic",
  preload: false,
  display: "swap",
  weight: ["400", "700"],
});

export const amiri = Amiri({
  // Arabic subset only: Latin words inside Arabic headings fall back to
  // IBM Plex Sans Arabic / Inter, so Amiri's latin files are never needed.
  subsets: ["arabic"],
  variable: "--font-amiri",
  preload: false,
  display: "swap",
  weight: ["400", "700"],
});

export const fontVariables = [
  inter.variable,
  plexArabic.variable,
  amiri.variable,
].join(" ");
