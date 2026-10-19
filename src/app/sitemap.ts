import type { MetadataRoute } from "next";
import { publishedModules } from "@/content/course";
import { SITE_URL } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...publishedModules.flatMap((m) =>
      m.lessons.map((l) => ({
        url: `${SITE_URL}/modules/${m.slug}/${l.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ),
  ];
}
