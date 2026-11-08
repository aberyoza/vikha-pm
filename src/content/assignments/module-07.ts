// Module 7 game «Усе не влізе»: the scope of the cat game from the first list
// of ideas to the demo. Pack the requirements, cut the WBS, spot what drifted
// from the baseline and accept the results.

export const TITLE = "Усе не влізе";

export const INTRO =
  "Після мозкового штурму в команди гри про котів 10 ідей, а часу лише на 15 тижнів. Вирішіть, що робимо, розбийте це на керовані частини і втримайте межі до самого демо. Чотири рівні, близько 10 хвилин.";

// Level 1: the suitcase. The need of a card opens once it is packed.
export const CAPACITY = 15;
export const NEEDS = ["Гра цікава", "Гра заробляє", "Гравці повертаються"];
export const CONDITION = "Вийти в магазини до свят";

export const IDEAS: { name: string; from: string; weeks: number; need: string | null; must?: boolean; why: string }[] = [
  { name: "20 рівнів", from: "Гравці", weeks: 6, need: "Гра цікава", must: true, why: "Без рівнів грати просто нема у що." },
  { name: "Покупки в грі", from: "Засновники", weeks: 3, need: "Гра заробляє", must: true, why: "Це головне джерело грошей гри." },
  {
    name: "Публікація за правилами магазинів",
    from: "Магазин",
    weeks: 2,
    need: "Вийти в магазини до свят",
    must: true,
    why: "Без неї немає релізу.",
  },
  { name: "Таблиця рекордів", from: "Гравці", weeks: 2, need: "Гравці повертаються", why: "Корисно, але не влізло. Кандидат на перше оновлення." },
  { name: "Щоденні нагороди", from: "Аналітик", weeks: 2, need: "Гравці повертаються", why: "Корисно, але не влізло. Кандидат на перше оновлення." },
  { name: "Реклама між рівнями", from: "Маркетолог", weeks: 2, need: "Гра заробляє", why: "Корисно, але не влізло. Кандидат на перше оновлення." },
  { name: "Анімація меню", from: "Дизайнерка", weeks: 2, need: null, why: "Красиво, але жодна потреба за цим не стоїть." },
  { name: "Чат між гравцями", from: "Розробник", weeks: 4, need: null, why: "Жодна потреба за цим не стоїть, зате чат треба модерувати." },
  { name: "Версія для годинника", from: "Засновник", weeks: 5, need: null, why: "Є в конкурентів, але нашим гравцям не потрібна." },
  { name: "Гра вдвох через інтернет", from: "Дизайнер", weeks: 8, need: null, why: "Вісім тижнів, і жодна потреба за цим не стоїть." },
];

export const SUITCASE_MAX = 5;

// Three must-haves and two useful ideas fit exactly. A useless idea takes the
// place of a useful one, so the two losses count once.
export function suitcaseScore(packed: number[]) {
  const items = packed.map((k) => IDEAS[k]);
  const missing = IDEAS.filter((d) => d.must).length - items.filter((d) => d.must).length;
  const useless = items.filter((d) => !d.need).length;
  const short = 2 - items.filter((d) => d.need && !d.must).length;
  return Math.max(0, SUITCASE_MAX - missing - Math.max(useless, short));
}

// Level 2: the scissors. Each leaf of the WBS gets one cut.
export type Cut = "split" | "merge" | "keep";

export const CUTS: { key: Cut; name: string; note: string }[] = [
  { key: "split", name: "Розбити", note: "понад 80 год" },
  { key: "merge", name: "Об'єднати", note: "менше 8 год" },
  { key: "keep", name: "Залишити", note: "від 8 до 80 год" },
];

export type Leaf = {
  code: string;
  name: string;
  hours: number;
  // No cut: an example of a work package that is already fine.
  cut?: Cut;
  why?: string;
  parts?: { name: string; hours: number }[];
};

export const TREE: { code: string; name: string; leaves: Leaf[] }[] = [
  {
    code: "1",
    name: "Застосунок гри",
    leaves: [
      {
        code: "1.1",
        name: "Ігрова механіка",
        hours: 240,
        cut: "split",
        why: "240 год — це шість тижнів, до кінця яких не видно, чи все йде за планом. Розбиваємо на пакети до 80 год.",
        parts: [
          { name: "Керування котом", hours: 80 },
          { name: "Перешкоди", hours: 80 },
          { name: "Система очок", hours: 80 },
        ],
      },
      {
        code: "1.2",
        name: "Рівні",
        hours: 320,
        cut: "split",
        why: "320 год завеликі для одного пакета. По п'ять рівнів за раз уже можна оцінити і доручити.",
        parts: [
          { name: "Рівні 1–5", hours: 80 },
          { name: "Рівні 6–10", hours: 80 },
          { name: "Рівні 11–15", hours: 80 },
          { name: "Рівні 16–20", hours: 80 },
        ],
      },
      { code: "1.3", name: "Магазин покупок", hours: 40, cut: "keep", why: "40 год — у межах правила. Це готовий робочий пакет." },
      {
        code: "1.4",
        name: "Перейменувати пункт меню",
        hours: 3,
        cut: "merge",
        why: "3 год окремо контролювати дорожче, ніж зробити. Об'єднуємо з іншою дрібною правкою.",
      },
      {
        code: "1.5",
        name: "Змінити колір кнопки",
        hours: 5,
        cut: "merge",
        why: "5 год замало для пакета. Разом із перейменуванням виходить якраз 8 год.",
      },
    ],
  },
  {
    code: "2",
    name: "Сервер",
    leaves: [{ code: "2.1", name: "Збереження прогресу", hours: 60, cut: "keep", why: "60 год — у межах правила. Це готовий робочий пакет." }],
  },
  {
    code: "3",
    name: "Тестування",
    leaves: [{ code: "3.1", name: "Перевірка на трьох телефонах", hours: 16 }],
  },
];

export const LEAVES = TREE.flatMap((b) => b.leaves).filter((l) => l.cut);

export const MERGED = { code: "1.4", name: "Дрібні правки меню", hours: 8, of: ["1.4", "1.5"] };

export const SCOPE_STATEMENT = "20 рівнів, магазин покупок, збереження прогресу, перевірка на телефонах, публікація в магазинах.";

export const MISSING: { text: string; right?: boolean; why: string }[] = [
  {
    text: "Публікація в магазинах",
    right: true,
    why: "В описі змісту вона є, а в дереві немає. Що не потрапило у WBS, те команда не робитиме, і про публікацію згадали б перед самим релізом.",
  },
  { text: "Гра вдвох", why: "Її виключили ще на першому рівні, тож у дереві їй не місце." },
  { text: "Ігрова механіка", why: "Вона вже є в дереві, під кодом 1.1." },
  { text: "Чат між гравцями", why: "В описі змісту його немає, тож у дереві йому не місце." },
];

export const NEW_BRANCH = { code: "4", name: "Публікація в магазинах" };

// Level 3: spot the difference between the baseline and the build.
export const PLAN: { text: string; skipped?: boolean }[] = [
  { text: "20 рівнів" },
  { text: "Магазин покупок" },
  { text: "Збереження прогресу" },
  { text: "Публікація в магазинах" },
  { text: "Перевірка на трьох телефонах", skipped: true },
];

export const BUILD: { text: string; extra?: boolean }[] = [
  { text: "20 рівнів" },
  { text: "Магазин покупок" },
  { text: "Збереження прогресу" },
  { text: "Публікація в магазинах" },
  { text: "Чат підтримки", extra: true },
  { text: "Скін кота для партнера", extra: true },
  { text: "Анімація меню", extra: true },
];

export const SKIPPED_WHY = "«Перевірка на трьох телефонах» є в плані, але в збірці її немає. Пропущена робота — теж відхилення.";

export type Drift = "creep" | "gold";

export const DRIFTS: { key: Drift; name: string; note: string }[] = [
  { key: "creep", name: "Розростання змісту", note: "Хтось просить «ще трішки», і зміна обходить запит." },
  { key: "gold", name: "Позолота", note: "Виконавці самі додають те, чого ніхто не просив." },
];

export const EXTRAS: { text: string; story: string; kind: Drift; why: string }[] = [
  {
    text: "Чат підтримки",
    story: "Маркетолог попросив у коридорі, і розробник зробив за два дні.",
    kind: "creep",
    why: "Прохання прийшло від іншої людини і обійшло запит на зміни. Це розростання змісту.",
  },
  {
    text: "Скін кота для партнера",
    story: "Засновник пообіцяв партнерові, і скін додали до збірки.",
    kind: "creep",
    why: "Навіть засновники змінюють зміст через запит. Інакше проєкт роздувається без додаткових строків і бюджету.",
  },
  {
    text: "Анімація меню",
    story: "Розробник зробив сам: «Буде ж красивіше». Ніхто не просив.",
    kind: "gold",
    why: "Виконавець сам додав зайве. Навіть корисна позолота з'їдає час і гроші без погодження.",
  },
];

export const ACTIONS: { text: string; right?: boolean; why: string }[] = [
  {
    text: "Оформити запит на зміни для кожної розбіжності",
    right: true,
    why: "Запит покаже вплив на строки й гроші, а той, хто має повноваження, вирішить: лишити, прибрати чи надолужити.",
  },
  { text: "Залишити як є: уже ж зроблено", why: "Час і гроші вже витрачено без погодження, а план більше не збігається з фактом." },
  { text: "Тихо вирізати зайве і домалювати план", why: "Базовий план не змінюють тихо: зникає історія, і стає незрозуміло, з чим порівнювати." },
];

// Level 4: the demo.
export type Verdict = "accept" | "change" | "return";

export const VERDICTS: { key: Verdict; name: string; note: string }[] = [
  { key: "accept", name: "Прийняти", note: "Критерій виконано, результат офіційно приймають." },
  { key: "change", name: "Запит на зміни", note: "Критерій не виконано, знайдене треба виправити." },
  { key: "return", name: "Повернути команді", note: "Не пройдено визначення «готово», показувати зарано." },
];

const CHECKS = ["Код переглянув другий розробник", "Тести пройдено", "Перевірено на телефонах"];
const allDone = CHECKS.map((text) => ({ text, ok: true }));

export const RESULTS: {
  name: string;
  criterion: string;
  fact: string;
  remark?: string;
  done: { text: string; ok: boolean }[];
  right: Verdict;
  why: string;
}[] = [
  {
    name: "20 рівнів",
    criterion: "Усі 20 рівнів можна пройти.",
    fact: "Тестувальниця пройшла всі 20.",
    done: allDone,
    right: "accept",
    why: "Критерій виконано, усі перевірки пройдено. Засновники приймають результат.",
  },
  {
    name: "Покупка в грі",
    criterion: "Покупка проходить менше ніж за 10 секунд.",
    fact: "Заміряли: 14 секунд.",
    done: allDone,
    right: "change",
    why: "Технічно все чисто, але критерій приймання не виконано. Формуємо запит на зміни, щоб це виправити.",
  },
  {
    name: "Збереження прогресу",
    criterion: "Прогрес не губиться після перезапуску гри.",
    fact: "На демо-телефоні все зберіглося.",
    done: [
      { text: CHECKS[0], ok: false },
      { text: CHECKS[1], ok: false },
      { text: CHECKS[2], ok: true },
    ],
    right: "return",
    why: "Працює, але код ніхто не переглянув, і тести не запускали. Контроль якості йде перед підтвердженням змісту, тож спершу визначення «готово».",
  },
  {
    name: "Сторінка в магазині",
    criterion: "Є опис гри і 5 скриншотів.",
    fact: "Опис є, скриншотів 5.",
    remark: "Засновник: «А додаймо ще відео!»",
    done: allDone,
    right: "accept",
    why: "Критерій виконано, тож результат приймаємо. Відео — нове побажання, і для нього буде окремий запит на зміни.",
  },
];

export const MAX_DIAMONDS = SUITCASE_MAX + LEAVES.length + 1 + PLAN.filter((p) => p.skipped).length + EXTRAS.length * 2 + 1 + RESULTS.length;
