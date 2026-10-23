// Public site address. NEXT_PUBLIC_SITE_URL overrides it, e.g. for a
// staging domain.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vikha-pm.com"
).replace(/\/$/, "");

export const SITE_NAME = "Віха";

// Only the production deployment may be indexed; previews live on
// *.vercel.app and would duplicate the site in search results.
export const INDEXABLE = (process.env.VERCEL_ENV ?? "production") === "production";

// Next.js replaces nested metadata objects instead of merging them, so
// every page spreads this into its own openGraph.
export const OPEN_GRAPH = { locale: "uk_UA", siteName: SITE_NAME } as const;
