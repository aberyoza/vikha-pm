import type { MetadataRoute } from "next";
import { publishedModules } from "@/content/course";
import { ASSIGNMENTS, assignmentHref } from "@/content/assignments";
import { SITE_URL } from "@/content/site";
import { isLockedModule, paywallEnabled } from "@/lib/paywall";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    ...(paywallEnabled ? [{ url: `${SITE_URL}/offer`, changeFrequency: "yearly" as const, priority: 0.2 }] : []),
    ...publishedModules.filter((m) => !isLockedModule(m.number)).flatMap((m) =>
      m.lessons.map((l) => ({
        url: `${SITE_URL}/modules/${m.slug}/${l.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ),
    ...publishedModules
      .filter((m) => ASSIGNMENTS[m.slug] && !isLockedModule(m.number))
      .map((m) => ({
        url: `${SITE_URL}${assignmentHref(m.slug)}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
