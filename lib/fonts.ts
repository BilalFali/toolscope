import { Amiri, IBM_Plex_Sans_Arabic, Inter, Newsreader } from "next/font/google";

/**
 * Editorial pairing per DESIGN.md:
 * - Newsreader for headings, Inter for UI/body (English)
 * - Amiri for headings, IBM Plex Sans Arabic for body (Arabic, swapped in CSS)
 * All fonts self-hosted by next/font at build time — no runtime Google requests.
 */

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-plex-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const amiri = Amiri({
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  display: "swap",
  weight: ["400", "700"],
});

export const fontVariables = [
  inter.variable,
  newsreader.variable,
  plexArabic.variable,
  amiri.variable,
].join(" ");
