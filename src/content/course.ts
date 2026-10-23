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

// The program follows the PMBOK Guide 7th and 8th editions: foundations,
// principles, development approaches, then one module per performance
// domain. One running example goes through the whole course: a small
// studio making a mobile game.

type ModuleDef = {
  title: string;
  description: string;
  lessons?: Lesson[];
};

const program: ModuleDef[] = [
  {
    title: "Проєкт і цінність",
    description:
      "Що таке проєкт і чим він відрізняється від операційної роботи, як проєкти створюють цінність, хто є хто в проєкті та як побудований стандарт PMBOK.",
    lessons: [
      { slug: "what-is-project", title: "Що таке проєкт" },
      { slug: "value", title: "Від проєкту до цінності" },
      { slug: "environment", title: "Середовище, ролі й структури" },
      { slug: "standards", title: "PMBOK і карта курсу" },
    ],
  },
  {
    title: "Принципи управління проєктами",
    description:
      "Шість принципів PMBOK 8 і як вони пов'язані з дванадцятьма принципами PMBOK 7: цілісний погляд, цінність, якість, лідерство, сталий розвиток і культура довіри.",
    lessons: [
      { slug: "overview", title: "Навіщо принципи" },
      { slug: "holistic-value", title: "Цілісний погляд і цінність" },
      { slug: "quality-sustainability", title: "Якість і сталий розвиток" },
      { slug: "leadership", title: "Лідерство і культура довіри" },
    ],
  },
  {
    title: "Підходи до розробки і життєвий цикл",
    description:
      "Предиктивний, адаптивний і гібридний підходи, фази й каденція постачання, п'ять фокусних областей і адаптація управління під конкретний проєкт.",
    lessons: [
      { slug: "approaches", title: "Підходи до розробки" },
      { slug: "life-cycle", title: "Життєвий цикл і каденція" },
      { slug: "focus-areas", title: "П'ять фокусних областей" },
      { slug: "tailoring", title: "Адаптація під проєкт" },
    ],
  },
  {
    title: "Чи вигідно: обґрунтування проєкту",
    description:
      "Бізнес-кейс, витрати і вигоди, гроші й час, чотири показники вигідності, касовий розрив і статут проєкту — на прикладі студії мобільних ігор.",
    lessons: [
      { slug: "business-case", title: "Бізнес-кейс" },
      { slug: "costs-benefits", title: "Витрати і вигоди" },
      { slug: "time-value", title: "Гроші й час" },
      { slug: "criteria", title: "Чотири показники вигідності" },
      { slug: "cash-gap", title: "Касовий розрив" },
      { slug: "charter", title: "Статут і цілі проєкту" },
    ],
  },
  {
    title: "Зацікавлені сторони і комунікації",
    description:
      "Як виявити, проаналізувати й залучити зацікавлені сторони та налагодити комунікації в проєкті — на прикладі студії мобільних ігор.",
    lessons: [
      { slug: "identify", title: "Хто зацікавлений у проєкті" },
      { slug: "analysis", title: "Аналіз і пріоритети" },
      { slug: "engagement", title: "Залучення" },
      { slug: "communications", title: "Комунікації" },
    ],
  },
  {
    title: "Врядування і управління змінами",
    description:
      "Хто і як ухвалює рішення в проєкті, план управління проєктом і базові плани, контроль змін і звітність — на прикладі студії мобільних ігор.",
    lessons: [
      { slug: "decisions", title: "Хто ухвалює рішення" },
      { slug: "baselines", title: "План управління проєктом і базові плани" },
      { slug: "changes", title: "Управління змінами" },
      { slug: "oversight", title: "Нагляд і звітність" },
    ],
  },
  {
    title: "Зміст",
    description:
      "Вимоги, межі проєкту, WBS і робочі пакети, підтвердження і контроль змісту — і як не дати проєкту розростатися.",
    lessons: [
      { slug: "requirements", title: "Вимоги" },
      { slug: "scope-statement", title: "Межі проєкту" },
      { slug: "wbs", title: "WBS і робочі пакети" },
      { slug: "scope-control", title: "Підтвердження і контроль змісту" },
    ],
  },
  {
    title: "Розклад",
    description:
      "Залежності й мережевий графік, критичний шлях, оцінка тривалості за PERT, стиснення графіка і розклад в адаптивних проєктах.",
    lessons: [
      { slug: "network", title: "Залежності й мережевий графік" },
      { slug: "critical-path", title: "Критичний шлях" },
      { slug: "estimating", title: "Оцінка тривалості" },
      { slug: "compression", title: "Як скоротити графік" },
      { slug: "adaptive", title: "Розклад в адаптивних проєктах" },
    ],
  },
  {
    title: "Фінанси і контроль виконання",
    description:
      "Оцінка вартості, бюджет і базовий план вартості, метод освоєного обсягу (EVM) і прогноз — на прикладі студії мобільних ігор.",
    lessons: [
      { slug: "costs", title: "Скільки коштує проєкт" },
      { slug: "budget", title: "Бюджет і базовий план вартості" },
      { slug: "earned-value", title: "Метод освоєного обсягу" },
      { slug: "forecast", title: "Прогноз і чому бюджети ростуть" },
    ],
  },
  {
    title: "Ресурси і команда",
    description:
      "Ресурси й навантаження, закупівлі й контракти, розподіл відповідальності, розвиток команди, мотивація і конфлікти — на прикладі студії мобільних ігор.",
    lessons: [
      { slug: "resources", title: "Ресурси проєкту" },
      { slug: "procurement", title: "Закупівлі й контракти" },
      { slug: "team", title: "Команда" },
      { slug: "motivation", title: "Мотивація і конфлікти" },
    ],
  },
  {
    title: "Ризики й невизначеність",
    description:
      "Невизначеність і ризики, загрози й нагоди, якісний і кількісний аналіз, реакції на ризики, резерви і реєстр ризиків.",
    lessons: [
      { slug: "uncertainty", title: "Невизначеність і ризик" },
      { slug: "identify-assess", title: "Виявлення і якісний аналіз" },
      { slug: "quantitative", title: "Кількісний аналіз" },
      { slug: "responses", title: "Реакції, резерви й реєстр" },
    ],
  },
  {
    title: "Якість",
    description:
      "Якість і сорт, вартість якості, планування, забезпечення й контроль якості, цикл PDCA та інструменти якості — на прикладі студії мобільних ігор.",
    lessons: [
      { slug: "what-is-quality", title: "Що таке якість" },
      { slug: "cost-of-quality", title: "Скільки коштує якість" },
      { slug: "management", title: "Планування, забезпечення і контроль" },
      { slug: "tools", title: "Інструменти якості" },
    ],
  },
  {
    title: "Agile на практиці",
    description: "Scrum і Kanban: ролі, події, артефакти й показники гнучкої команди.",
  },
  {
    title: "Вимірювання, закриття і тренди",
    description: "Показники проєкту, закриття і передача результату, реалізація вигод, сталий розвиток і штучний інтелект.",
  },
];

export const modules: CourseModule[] = program.map((m, i) => ({
  number: i + 1,
  slug: `module-${String(i + 1).padStart(2, "0")}`,
  title: m.title,
  description: m.description,
  published: Boolean(m.lessons?.length),
  lessons: m.lessons ?? [],
}));

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
