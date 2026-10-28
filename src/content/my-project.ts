// «Мій проєкт»: the reader's own project that grows through the course. Module 1
// starts it with two drums (what and for whom); later modules each add one
// milestone. Ready ideas carry prepared hints, any other pair gets prompts.

export const WHAT = [
  "Telegram-бот",
  "Сайт",
  "Мобільний застосунок",
  "Дашборд",
  "Онбординг-курс",
  "Благодійний забіг",
  "Ремонт",
] as const;

// Written as they read after «для»: «Сайт для кав'ярні знайомих».
export const WHO = [
  "барбершопу біля дому",
  "кав'ярні знайомих",
  "ОСББ",
  "твоєї команди на роботі",
  "нових джунів у компанії",
  "місцевої громади",
  "твоєї родини",
] as const;

export type ValueStep = "result" | "outcome" | "benefit";

export const VALUE_STEPS: { key: ValueStep; name: string; ask: string; placeholder: string }[] = [
  {
    key: "result",
    name: "Результат",
    ask: "Що буде готово наприкінці?",
    placeholder: "Наприклад: бот, через який можна записатися на стрижку",
  },
  {
    key: "outcome",
    name: "Наслідок",
    ask: "Що зміниться, коли цим почнуть користуватися?",
    placeholder: "Наприклад: клієнти записуються самі, без дзвінків",
  },
  {
    key: "benefit",
    name: "Вигода",
    ask: "Яку користь дадуть ці зміни?",
    placeholder: "Наприклад: майстри стрижуть більше, бо менше порожніх віконець",
  },
];

export type Idea = {
  what: (typeof WHAT)[number];
  who: (typeof WHO)[number];
  name: string;
  hints: Record<ValueStep, string[]>;
  // Suggested answers to APPROACH_QUESTIONS (module 3), by option index.
  approach: number[];
};

export const IDEAS: Idea[] = [
  {
    what: "Telegram-бот",
    who: "барбершопу біля дому",
    name: "Бот запису в барбершоп",
    approach: [1, 0, 0, 1],
    hints: {
      result: ["Telegram-бот, через який можна записатися на стрижку", "Бот, що показує вільні віконця кожного майстра"],
      outcome: ["Клієнти записуються самі, без дзвінків", "Менше людей забувають про візит, бо бот нагадує за день"],
      benefit: ["Майстри стрижуть більше, бо менше порожніх віконець", "Адміністраторці не треба весь день відповідати на дзвінки"],
    },
  },
  {
    what: "Сайт",
    who: "кав'ярні знайомих",
    name: "Сайт кав'ярні з меню і бронюванням",
    approach: [1, 0, 1, 1],
    hints: {
      result: ["Сайт з меню, цінами і формою бронювання", "Сторінка кав'ярні, яку знаходить Google"],
      outcome: ["Люди бронюють столик заздалегідь", "Нові гості знаходять кав'ярню через пошук"],
      benefit: ["У вихідні зал заповнений, і виручка росте", "Сайт окупається за кілька місяців"],
    },
  },
  {
    what: "Telegram-бот",
    who: "ОСББ",
    name: "Бот ОСББ для показників і оголошень",
    approach: [1, 0, 1, 2],
    hints: {
      result: ["Бот, у який мешканці надсилають показники лічильників", "Бот, що розсилає оголошення про відключення"],
      outcome: ["Показники приходять вчасно, без папірців у поштових скриньках", "Мешканці дізнаються про відключення заздалегідь"],
      benefit: ["Голова ОСББ економить кілька вечорів на місяць", "Менше боргів і сварок через неправильні рахунки"],
    },
  },
  {
    what: "Дашборд",
    who: "твоєї команди на роботі",
    name: "Дашборд замість ручних звітів",
    approach: [1, 0, 0, 2],
    hints: {
      result: ["Дашборд, який сам збирає цифри з таблиць", "Щоденний звіт, що сам приходить на пошту"],
      outcome: ["Команда більше не збирає звіт руками щоп'ятниці", "Керівник бачить цифри щодня, а не раз на тиждень"],
      benefit: ["Звільняється кілька годин на тиждень на справжню роботу", "Проблеми помічають раніше, поки їх дешево виправити"],
    },
  },
  {
    what: "Онбординг-курс",
    who: "нових джунів у компанії",
    name: "Онбординг-курс для джунів",
    approach: [1, 0, 1, 1],
    hints: {
      result: ["Курс з короткими відео про те, як влаштовано проєкт", "Чек-лист першого тижня з посиланнями й доступами"],
      outcome: ["Новачки ставлять менше однакових питань", "Джун робить перший реліз за тиждень, а не за місяць"],
      benefit: ["Сеньйори менше відволікаються на пояснення", "Новачки швидше починають приносити користь"],
    },
  },
  {
    what: "Благодійний забіг",
    who: "місцевої громади",
    name: "Благодійний забіг",
    approach: [0, 1, 2, 0],
    hints: {
      result: ["Забіг на 5 км з реєстрацією і медалями", "Сторінка збору, куди можна задонатити"],
      outcome: ["Сотні людей приходять бігти й приводять друзів", "Люди донатять, бо бачать, на що підуть гроші"],
      benefit: ["Зібрано гроші на конкретну мету", "Громада стала ближчою, і наступну подію організувати легше"],
    },
  },
  {
    what: "Ремонт",
    who: "твоєї родини",
    name: "Ремонт кухні",
    approach: [0, 1, 1, 1],
    hints: {
      result: ["Нова кухня з технікою, що працює", "Кухня, де нарешті вистачає місця для всіх"],
      outcome: ["Родина знову вечеряє разом на кухні", "Готувати стало швидше і зручніше"],
      benefit: ["Менше сварок через тісноту", "Квартира дорожчає, якщо колись продаватимете"],
    },
  },
];

// Module 3: four questions about the project; each option leans to a more
// adaptive (higher) or a more predictive (lower) approach.
export const APPROACH_QUESTIONS: { ask: string; options: { text: string; adaptive: number }[] }[] = [
  {
    ask: "Чи знаєш точно, що треба зробити?",
    options: [
      { text: "Так, усе описано", adaptive: 0 },
      { text: "Приблизно", adaptive: 1 },
      { text: "Ні, будемо шукати", adaptive: 2 },
    ],
  },
  {
    ask: "Чи можна віддавати частинами?",
    options: [
      { text: "Так", adaptive: 2 },
      { text: "Ні, тільки цілим", adaptive: 0 },
    ],
  },
  {
    ask: "Як часто користувачі готові дивитися результат?",
    options: [
      { text: "Щотижня", adaptive: 2 },
      { text: "Раз на місяць", adaptive: 1 },
      { text: "Лише наприкінці", adaptive: 0 },
    ],
  },
  {
    ask: "Строк і бюджет зафіксовані жорстко?",
    options: [
      { text: "Так", adaptive: 0 },
      { text: "Частково", adaptive: 1 },
      { text: "Ні", adaptive: 2 },
    ],
  },
];

export const APPROACH_KINDS = [
  {
    name: "Предиктивний",
    why: "Що робити, зрозуміло, а переробляти на ходу дорого. Вигідно все спланувати наперед і йти етапами.",
  },
  {
    name: "Гібридний",
    why: "Частина відома, частина ні. Відоме плануй наперед, а решту роби короткими кроками й показуй.",
  },
  {
    name: "Адаптивний",
    why: "Наперед усього не знаєш, а люди готові часто дивитися результат. Рухайся короткими циклами й змінюй план за відгуками.",
  },
] as const;

export const CADENCES = {
  once: { name: "Одноразова", why: "Результат віддаси один раз, наприкінці." },
  multiple: { name: "Багаторазова", why: "Віддаватимеш результат кілька разів за проєкт." },
  periodic: { name: "Періодична", why: "Віддаватимеш результат регулярно, наприклад раз на тиждень-два." },
};

export function recommendApproach(answers: number[]) {
  const score = answers.reduce((s, a, q) => s + APPROACH_QUESTIONS[q].options[a].adaptive, 0);
  const kind = APPROACH_KINDS[score <= 2 ? 0 : score <= 5 ? 1 : 2];
  const cadence = answers[1] === 1 ? CADENCES.once : answers[2] === 0 ? CADENCES.periodic : CADENCES.multiple;
  return { kind, cadence };
}

export const findIdea = (what: string, who: string) => IDEAS.find((i) => i.what === what && i.who === who);

// One milestone per module, except module 2 (principles have no artifact).
export const MILESTONES: { module: number; name: string }[] = [
  { module: 1, name: "Що, для кого і навіщо" },
  { module: 3, name: "Підхід до розробки" },
  { module: 4, name: "Чи варто вкладатися" },
  { module: 5, name: "Люди навколо проєкту" },
  { module: 6, name: "Хто може сказати «стоп»" },
  { module: 7, name: "Блоки роботи і що не робимо" },
  { module: 8, name: "Віхи і дата завершення" },
  { module: 9, name: "Грубий бюджет" },
  { module: 10, name: "Хто потрібен у команді" },
  { module: 11, name: "Три головні ризики" },
  { module: 12, name: "Коли результат готовий" },
  { module: 13, name: "Перші задачі на дошці" },
  { module: 14, name: "Як зрозуміти, що вигода настала" },
];
