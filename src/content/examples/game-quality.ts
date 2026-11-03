// Running example for module 12: quality of the studio's game. Figures and
// lesson text read these numbers, so they always agree.

export type Verdict = "pass" | "fail";

// Quality metrics agreed at the start and what the beta test showed.
export const METRICS: { name: string; target: string; beta: string; verdict: Verdict }[] = [
  { name: "Стабільність", target: "≥ 99,5% сесій без вильотів", beta: "97%", verdict: "fail" },
  { name: "Швидкість", target: "рівень за ≤ 3 с на телефоні 2021 року", beta: "2,6 с", verdict: "pass" },
  { name: "Плавність", target: "60 кадрів за секунду, допуск до 55", beta: "57 кадрів", verdict: "pass" },
  { name: "Зручність", target: "8 з 10 новачків проходять 1-й рівень без підказки", beta: "9 з 10", verdict: "pass" },
  { name: "Безпека", target: "жодної покупки без підтвердження дорослого", beta: "0 випадків", verdict: "pass" },
];

// Cost of quality in two scenarios, thousands of hryvnias (illustrative).
export const COQ_PARTS = [
  { key: "prevention", name: "Запобігання", group: "conformance", what: "навчання, перегляд коду, автоматичні тести, чек-листи" },
  { key: "appraisal", name: "Оцінювання", group: "conformance", what: "тестування, бета-тест, перевірка на різних телефонах" },
  { key: "internal", name: "Внутрішні втрати", group: "failure", what: "дефект знайшли до релізу: переробка, повторне тестування, зсув строків" },
  { key: "external", name: "Зовнішні втрати", group: "failure", what: "дефект знайшли гравці: термінові оновлення, повернення грошей, відгуки, втрачені гравці" },
] as const;

export type CoqKey = (typeof COQ_PARTS)[number]["key"];

export const COQ_SCENARIOS: { name: string; values: Record<CoqKey, number> }[] = [
  { name: "Економимо на якості", values: { prevention: 2, appraisal: 8, internal: 25, external: 40 } },
  { name: "Вкладаємо в запобігання", values: { prevention: 10, appraisal: 15, internal: 10, external: 8 } },
];

// Share of sessions without crashes, per release build. Build 9 brought a
// new ad library that crashes on old Android phones.
export const BUILDS = [99.6, 99.7, 99.4, 99.6, 99.8, 99.6, 99.5, 99.7, 98.7, 99.6, 99.7, 99.6];
export const BASELINE = BUILDS.slice(0, 8);
export const TOLERANCE = 99.5;
export const OUTLIER_NOTE = "У збірці оновили рекламну бібліотеку, а нова версія падає на старих Android.";

// Centre line and control limits from the stable builds, three standard
// deviations either side.
export const BUILD_MEAN = BASELINE.reduce((a, b) => a + b, 0) / BASELINE.length;
const buildSd = Math.sqrt(BASELINE.reduce((a, b) => a + (b - BUILD_MEAN) ** 2, 0) / (BASELINE.length - 1));
export const UCL = Math.min(100, BUILD_MEAN + 3 * buildSd);
export const LCL = BUILD_MEAN - 3 * buildSd;
export const outOfControl = (v: number) => v < LCL || v > UCL;

// Beta-test complaints sorted into a check sheet; 100 in total.
export const COMPLAINTS = [
  { name: "Вилітає на старих Android", count: 46 },
  { name: "Довге завантаження рівня", count: 22 },
  { name: "Текст не влазить у кнопки", count: 11 },
  { name: "Звук обривається", count: 8 },
  { name: "Рекорди не зберігаються", count: 7 },
  { name: "Інше", count: 6 },
];

// Why 40% of players quit at level 3: the bones of the Ishikawa diagram.
export const BONES: { name: string; cause: string; check: string; whys?: [string, string][] }[] = [
  { name: "Вимоги", cause: "Між 2-м і 3-м рівнем різко зростає складність.", check: "Порівняти кількість спроб на рівнях 2 і 3." },
  {
    name: "Процес",
    cause: "Рівень не тестували на новачках.",
    check: "Докопатися до кореня через «5 чому».",
    whys: [
      ["Чому гравці кидають 3-й рівень?", "Не можуть пройти перешкоду, де потрібен подвійний стрибок."],
      ["Чому не можуть?", "Не знають, що подвійний стрибок існує."],
      ["Чому не знають?", "На рівнях 1–2 його ніде не показано."],
      ["Чому не показано?", "Подвійний стрибок додали пізно, коли навчальні рівні вже були готові."],
      ["Чому навчальні рівні не оновили?", "У чек-листі змін механіки немає пункту «перевірити навчання»."],
    ],
  },
  { name: "Команда", cause: "Дизайнер рівнів добре знає гру і не бачить, де новачку складно.", check: "Дати пройти рівень п'ятьом людям, які гри не бачили." },
  { name: "Інструменти", cause: "Аналітика не рахує кількість спроб на рівні.", check: "Додати подію «спроба рівня» і подивитися дані за тиждень." },
  { name: "Дані", cause: "Немає записів гри новачків.", check: "Записати екран десяти гравців з бета-тесту." },
  { name: "Середовище", cause: "На старих телефонах 3-й рівень довго завантажується.", check: "Порівняти, де кидають гру частіше: на старих чи на нових телефонах." },
];
