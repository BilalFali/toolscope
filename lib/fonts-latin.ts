import { Inter, Newsreader } from "next/font/google";

/**
 * Latin font bundle (English pages).
 * Instantiated in its own module so next/font preloads it ONLY on pages that
 * render it — Arabic pages must not preload Latin editorial fonts.
 */

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: false,
  display: "swap",
});

export const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  preload: false,
  display: "swap",
  // No italic files: the single italic quote synthesizes an oblique instead,
  // saving the entire italic variable file set from the critical path.
});

export const fontVariables = [inter.variable, newsreader.variable].join(" ");
