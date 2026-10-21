import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const isDev = process.env.NODE_ENV === "development";

// Pages are statically prerendered, so a nonce-based CSP isn't possible;
// inline scripts stay allowed, everything else is locked to our origin
// (plus Supabase for auth and data). Vercel Web Analytics is served from
// our own origin (/_vercel/insights); only its dev debug script is external.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()",
  },
];

// Lessons moved when the course was rebuilt around PMBOK 7 and 8
// (October 2026). Temporary redirects keep old links working.
const movedLessons: [string, string][] = [
  ["module-01/evolution", "module-01/standards"],
  ["module-01/stakeholders-smart", "module-01/environment"],
  ["module-01/risks", "module-11/uncertainty"],
  ["module-02/process-groups", "module-03/focus-areas"],
  ["module-02/knowledge-areas", "module-01/standards"],
  ["module-02/principles", "module-02/overview"],
  ["module-02/org-structures", "module-01/environment"],
  ["module-03/project-analysis", "module-04/business-case"],
  ["module-03/principles-aspects", "module-04/business-case"],
  ["module-03/horizon", "module-04/time-value"],
  ["module-03/time-value", "module-04/time-value"],
  ["module-03/mind-map", "module-04/business-case"],
  ["module-04/mind-map", "module-04/business-case"],
  ["module-05/wbs", "module-07/wbs"],
  ["module-05/network", "module-08/network"],
  ["module-05/critical-path", "module-08/critical-path"],
  ["module-06/uncertainty", "module-11/uncertainty"],
  ["module-06/qualitative", "module-11/identify-assess"],
  ["module-06/quantitative", "module-11/quantitative"],
  ["module-06/management", "module-11/responses"],
  ["module-07/lags", "module-08/network"],
  ["module-07/scope-wbs", "module-07/scope-statement"],
  ["module-07/pert", "module-08/estimating"],
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async redirects() {
    return movedLessons.map(([from, to]) => ({
      source: `/modules/${from}`,
      destination: `/modules/${to}`,
      permanent: false,
    }));
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Plugins are passed by name: Turbopack can't receive JS functions.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm", "remark-math"],
    rehypePlugins: ["rehype-katex"],
  },
});

export default withMDX(nextConfig);
