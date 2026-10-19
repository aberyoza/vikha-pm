// Course structure. Lesson bodies live in
// src/content/modules/<module slug>/<lesson slug>.mdx

export type Lesson = {
  slug: string;
  title: string;
};

export type CourseModule = {
  number: number;
  slug: string;
  title: string;
  description: string;
  published: boolean;
  lessons: Lesson[];
};

export const TOTAL_MODULES = 14;

// TODO: replace placeholder titles with the real course program.
export const modules: CourseModule[] = Array.from(
  { length: TOTAL_MODULES },
  (_, i) => {
    const number = i + 1;
    return {
      number,
      slug: `module-${String(number).padStart(2, "0")}`,
      title: `Модуль ${number}`,
      description: "Опис модуля з'явиться згодом.",
      published: false,
      lessons: [],
    };
  },
);

modules[0] = {
  ...modules[0],
  title: "Вступ до управління проєктами",
  description: "Демо-модуль для перевірки сайту. Буде замінений реальним текстом.",
  published: true,
  lessons: [{ slug: "demo", title: "Приклад уроку" }],
};

export const publishedModules = modules.filter(
  (m) => m.published && m.lessons.length > 0,
);

export function findLesson(moduleSlug: string, lessonSlug: string) {
  const courseModule = publishedModules.find((m) => m.slug === moduleSlug);
  if (!courseModule) return null;
  const index = courseModule.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return null;
  return {
    module: courseModule,
    lesson: courseModule.lessons[index],
    prev: courseModule.lessons[index - 1] ?? null,
    next: courseModule.lessons[index + 1] ?? null,
  };
}
