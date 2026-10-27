import type { MetadataRoute } from "next";
import { publishedModules } from "@/content/course";
import { ASSIGNMENTS, assignmentHref } from "@/content/assignments";
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
    ...Object.keys(ASSIGNMENTS).map((slug) => ({
      url: `${SITE_URL}${assignmentHref(slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
