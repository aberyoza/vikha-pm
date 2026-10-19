// Public site address. Set NEXT_PUBLIC_SITE_URL once a custom domain exists.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vikha-pm.vercel.app"
).replace(/\/$/, "");
