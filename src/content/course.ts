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
  description:
    "Чим проєкт відрізняється від рутини, звідки взялося управління проєктами, хто його учасники, як ставити цілі за SMART і чому проєкти провалюються.",
  published: true,
  lessons: [
    { slug: "evolution", title: "Еволюція управління проєктами" },
    { slug: "what-is-project", title: "Що таке проєкт" },
    { slug: "stakeholders-smart", title: "Учасники проєкту та цілі за SMART" },
    { slug: "risks", title: "Чому проєкти зазнають невдач" },
  ],
};

modules[1] = {
  ...modules[1],
  title: "Як влаштоване управління проєктами",
  description:
    "П'ять груп процесів, десять областей знань і три типи організаційних структур: функціональна, проєктна та матрична.",
  published: true,
  lessons: [
    { slug: "process-groups", title: "П'ять груп процесів" },
    { slug: "knowledge-areas", title: "Області знань" },
    { slug: "org-structures", title: "Організаційні структури" },
  ],
};

modules[2] = {
  ...modules[2],
  title: "Чи варто вкладатися: проєктний аналіз",
  description:
    "Як ще до старту зрозуміти, чи вийде проєкт, чи будуть ним користуватися і чи окупиться він — на прикладі мобільного застосунку.",
  published: true,
  lessons: [
    { slug: "project-analysis", title: "Навіщо рахувати проєкт" },
    { slug: "principles-aspects", title: "П'ять принципів і сім питань" },
    { slug: "horizon", title: "Зв'язки між проєктами і горизонт" },
    { slug: "time-value", title: "Гроші й час" },
  ],
};

modules[3] = {
  ...modules[3],
  title: "Чи окупиться проєкт",
  description:
    "Що рахувати у витратах і вигодах, чотири головні показники вигідності та як не «збанкрутувати» через касовий розрив — на прикладі студії мобільних ігор.",
  published: true,
  lessons: [
    { slug: "costs-benefits", title: "Витрати і вигоди" },
    { slug: "criteria", title: "Чотири показники вигідності" },
    { slug: "cash-gap", title: "Касовий розрив" },
  ],
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
