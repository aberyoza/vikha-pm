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
  // Module 4: suggested answers to INVEST_QUESTIONS and hints for the free text.
  invest: { answers: number[]; alternative: string[]; goal: string[] };
  // Module 5: people around the project with suggested analysis.
  people: Person[];
};

// Module 5: one row of the stakeholder register. Levels index ENGAGEMENT.
export type Person = { name: string; power: boolean; interest: boolean; now: number; want: number };

const person = (name: string, power: 0 | 1, interest: 0 | 1, now: number, want: number): Person => ({
  name,
  power: !!power,
  interest: !!interest,
  now,
  want,
});

export const IDEAS: Idea[] = [
  {
    what: "Telegram-бот",
    who: "барбершопу біля дому",
    name: "Бот запису в барбершоп",
    approach: [1, 0, 0, 1],
    invest: {
      answers: [1, 0, 0],
      alternative: ["Адміністраторка й далі весь день відповідає на дзвінки", "Клієнти, які не додзвонилися, йдуть в інший барбершоп"],
      goal: ["До 1 березня запустити бот запису так, щоб 30% клієнтів записувалися через нього"],
    },
    people: [
      person("Власник барбершопу", 1, 1, 3, 4),
      person("Адміністраторка", 0, 1, 1, 3),
      person("Майстри", 0, 1, 2, 3),
      person("Постійні клієнти", 0, 1, 0, 3),
      person("Telegram", 1, 0, 0, 2),
    ],
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
    invest: {
      answers: [1, 1, 0],
      alternative: ["Гості й далі не знаходять кав'ярню в Google", "Столики бронюють лише телефоном, і частину дзвінків пропускають"],
      goal: ["До 1 квітня запустити сайт так, щоб щотижня через нього бронювали 20 столиків"],
    },
    people: [
      person("Власниця кав'ярні", 1, 1, 3, 4),
      person("Бариста", 0, 1, 2, 3),
      person("Постійні гості", 0, 1, 0, 3),
      person("Google", 1, 0, 0, 2),
      person("Сусідня кав'ярня", 0, 0, 0, 0),
    ],
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
    invest: {
      answers: [0, 1, 0],
      alternative: ["Голова ОСББ і далі збирає показники з папірців", "Мешканці дізнаються про відключення, коли вже немає води"],
      goal: ["До 1 травня запустити бот так, щоб 70% квартир подавали показники через нього"],
    },
    people: [
      person("Голова ОСББ", 1, 1, 3, 4),
      person("Старші мешканці", 0, 1, 1, 2),
      person("Бухгалтерка ОСББ", 0, 1, 2, 3),
      person("Водоканал і обленерго", 1, 0, 0, 2),
      person("Telegram", 1, 0, 0, 2),
    ],
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
    invest: {
      answers: [0, 0, 0],
      alternative: ["Команда й далі витрачає п'ятницю на ручний звіт", "Керівник бачить цифри раз на тиждень і реагує запізно"],
      goal: ["До кінця кварталу запустити дашборд так, щоб звіт займав 0 годин замість 4 на тиждень"],
    },
    people: [
      person("Керівник", 1, 1, 3, 4),
      person("Колега, що збирає звіт руками", 0, 1, 1, 3),
      person("Команда", 0, 1, 2, 3),
      person("Служба безпеки", 1, 0, 0, 2),
      person("Сусідні команди", 0, 0, 0, 2),
    ],
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
    invest: {
      answers: [0, 1, 0],
      alternative: ["Сеньйори й далі пояснюють те саме кожному новачку", "Джуни місяць розбираються, як влаштовано проєкт"],
      goal: ["До 1 червня запустити курс так, щоб новачок робив перший реліз за 2 тижні"],
    },
    people: [
      person("HR", 1, 1, 3, 4),
      person("Сеньйори", 0, 1, 1, 3),
      person("Тімлід", 1, 1, 2, 3),
      person("Нові джуни", 0, 1, 0, 3),
      person("Юристи", 1, 0, 0, 2),
    ],
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
    invest: {
      answers: [2, 0, 1],
      alternative: ["Гроші на мету збирають повільно, постами в соцмережах", "Громада не має приводу зібратися разом"],
      goal: ["До 1 вересня провести забіг так, щоб зібрати 200 тис. грн на мету"],
    },
    people: [
      person("Організатори", 1, 1, 3, 4),
      person("Міська рада", 1, 0, 0, 2),
      person("Спонсори", 1, 0, 2, 3),
      person("Бігуни", 0, 1, 0, 3),
      person("Мешканці вулиць на маршруті", 0, 1, 1, 2),
    ],
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
    invest: {
      answers: [3, 0, 2],
      alternative: ["Готувати далі в тісноті й сваритися", "Вечеряти по черзі, бо всі не вміщаються"],
      goal: ["До 1 жовтня закінчити ремонт так, щоб за столом уміщалася вся родина з 4 людей"],
    },
    people: [
      person("Партнер чи партнерка", 1, 1, 3, 4),
      person("Діти", 0, 1, 2, 3),
      person("Бригада ремонтників", 1, 0, 2, 3),
      person("Сусіди за стіною", 0, 1, 1, 2),
      person("Управляюча компанія", 1, 0, 0, 2),
    ],
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

// Module 4: a tiny business case. Three questions with options; the
// alternative and the goal are free text.
export const INVEST_QUESTIONS: { ask: string; options: string[] }[] = [
  { ask: "Що вкладаєш?", options: ["Лише свій час", "До 10 тис. грн", "10–100 тис. грн", "Більше 100 тис. грн"] },
  { ask: "Коли з'явиться перша вигода?", options: ["Одразу після запуску", "За кілька місяців", "За рік і більше"] },
  { ask: "Чи вистачить грошей і часу, щоб дожити до першої вигоди?", options: ["Так", "Ні, треба шукати", "Не знаю"] },
];

export const VERDICTS = {
  go: { name: "Варто", why: "Вигода близько, і ресурсів до неї вистачає. Можна починати." },
  care: {
    name: "Варто, але подбай про гроші до першої вигоди",
    why: "Проєкт має сенс, але до першої вигоди треба дожити. Заздалегідь знайди гроші чи час на цей період, інакше станеться касовий розрив.",
  },
  recheck: {
    name: "Перевір ще раз",
    why: "Вигода далеко, а грошей може не вистачити. Подумай, як отримати першу користь раніше, наприклад запустити меншу версію.",
  },
};

export function investVerdict(answers: number[]) {
  if (answers[2] === 0) return VERDICTS.go;
  return answers[1] === 2 ? VERDICTS.recheck : VERDICTS.care;
}

// Module 5: the five levels of engagement and the move that lifts each one.
export const ENGAGEMENT = ["Не обізнаний", "Чинить опір", "Нейтральний", "Підтримує", "Веде"] as const;

export const ENGAGE_ACTIONS = [
  { name: "Розповісти", from: 0, to: 2, note: "Для тих, хто не знає про проєкт. Піднімає до «нейтральний»." },
  { name: "Зняти причину", from: 1, to: 2, note: "Для тих, хто проти. Зрозумій, чого бояться, і прибери це." },
  { name: "Показати вигоду", from: 2, to: 3, note: "Для нейтральних. Покажи, що вони отримають." },
  { name: "Дати роль", from: 3, to: 4, note: "Для тих, хто підтримує. Дай справу, і вони поведуть." },
];

export const GROUPS = {
  manage: { name: "Активно керувати", note: "Тісна співпраця і участь у рішеннях." },
  satisfy: { name: "Тримати задоволеними", note: "Коротко й вчасно інформувати, не перевантажувати." },
  inform: { name: "Інформувати", note: "Регулярно ділитися новинами і слухати відгуки." },
  monitor: { name: "Стежити", note: "Мінімум зусиль, перевіряти час від часу." },
};

export const stakeholderGroup = (power: boolean, interest: boolean) =>
  power ? (interest ? GROUPS.manage : GROUPS.satisfy) : interest ? GROUPS.inform : GROUPS.monitor;

// The next move for one person, or null when they are where we need them.
export const nextAction = (now: number, want: number) =>
  want > now ? ENGAGE_ACTIONS.find((a) => a.from === now)! : null;

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
