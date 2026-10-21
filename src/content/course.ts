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
    { slug: "mind-map", title: "Карта модуля" },
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
    { slug: "mind-map", title: "Карта модуля" },
  ],
};

modules[4] = {
  ...modules[4],
  title: "Планування: від ідеї до розкладу",
  description:
    "Як розбити проєкт на роботи (WBS), розставити їх у правильному порядку на мережевому графіку і знайти критичний шлях — на прикладі студії, що планує випуск мобільної гри.",
  published: true,
  lessons: [
    { slug: "wbs", title: "Планування і структура робіт" },
    { slug: "network", title: "Мережевий графік" },
    { slug: "critical-path", title: "Критичний шлях" },
  ],
};

modules[5] = {
  ...modules[5],
  title: "Ризики проєкту",
  description:
    "Чим ризик відрізняється від невизначеності, як знайти й оцінити ризики якісно й кількісно (чутливість, сценарії, Монте-Карло) як від них захиститися і вести реєстр ризиків — на прикладі тієї самої мобільної гри.",
  published: true,
  lessons: [
    { slug: "uncertainty", title: "Невизначеність і ризик" },
    { slug: "qualitative", title: "Якісний аналіз ризиків" },
    { slug: "quantitative", title: "Кількісний аналіз ризиків" },
    { slug: "management", title: "Управління ризиками і реєстр ризиків" },
  ],
};

modules[6] = {
  ...modules[6],
  title: "Управління змістом проєкту",
  description:
    "Як зібрати вимоги, окреслити межі проєкту, розбити його на робочі пакети й не дати змісту розростатися, а також лаги, ступінчастий метод і оцінка строків за PERT — на прикладі тієї самої мобільної гри.",
  published: true,
  lessons: [
    { slug: "lags", title: "Лаги, ступені й AOA" },
    { slug: "requirements", title: "Зміст проєкту і збір вимог" },
    { slug: "scope-wbs", title: "Опис змісту і WBS" },
    { slug: "scope-control", title: "Підтвердження і контроль змісту" },
    { slug: "pert", title: "Оцінка тривалості: PERT" },
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
