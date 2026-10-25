import { findLesson, publishedModules } from "@/content/course";
import { OG_SIZE, ogCard } from "../../../og-card";

export const alt = "Урок курсу «Віха»";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return publishedModules.flatMap((m) => m.lessons.map((l) => ({ module: m.slug, lesson: l.slug })));
}

export default async function Image({ params }: { params: Promise<{ module: string; lesson: string }> }) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;
  const found = findLesson(moduleSlug, lessonSlug);
  if (!found) return ogCard({ kicker: "Віха", title: "Курс з управління проєктами" });
  return ogCard({
    kicker: `Модуль ${found.module.number}. ${found.module.title}`,
    title: found.lesson.title,
    current: found.module.number,
  });
}
