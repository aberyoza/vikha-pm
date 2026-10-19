import localFont from "next/font/local";

// Fixel by MacPaw — a Ukrainian typeface, SIL OFL 1.1 (see ./fixel/OFL.txt).
// Text cut for body and UI, Display cut for headings.

export const fixelText = localFont({
  src: [
    { path: "./fixel/FixelText-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fixel/FixelText-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fixel/FixelText-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-fixel-text",
  display: "swap",
});

export const fixelDisplay = localFont({
  src: [
    { path: "./fixel/FixelDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fixel/FixelDisplay-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-fixel-display",
  display: "swap",
});
