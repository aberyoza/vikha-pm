// Module 8 game «Коли вийде гра?»: the lesson's game plan from the first arrows
// to the sprints. Build the network, predict delays, choose a date to promise,
// buy weeks and read the sprint charts. Numbers come from the lesson's plan.
import { PLAN, schedule, TASKS } from "@/content/examples/game-plan";
import { DEFAULT_ESTIMATES, normalCdf, pertProject } from "@/content/examples/game-scope";

export const TITLE = "Коли вийде гра?";

export const INTRO =
  "Засновники питають одне: коли реліз? Складіть графік, знайдіть, що справді визначає дату, назвіть дату, за яку не соромно, а потім спробуйте її наблизити. П'ять рівнів, близько 12 хвилин.";

export const taskName = (id: number) => TASKS.find((t) => t.id === id)!.name;

// Level 1: the arrows of the network and the longest path.
export const LINKS: { id: number; clue: string; options: number[]; why: string }[] = [
  {
    id: 5,
    clue: "Рівень не зібрати без персонажів і робочої механіки.",
    options: [2, 3, 4],
    why: "Рівні чекають і на дизайн, і на механіку. Це злиття: робота починається, коли завершено всі попередні.",
  },
  {
    id: 6,
    clue: "Для сторінки в магазині потрібні готові персонажі.",
    options: [2, 3, 4],
    why: "Маркетингу потрібен лише дизайн. Дизайн — це розбивка: після нього стартують одразу дві роботи.",
  },
  {
    id: 7,
    clue: "Перевіряємо зібрані рівні разом із сервером рекордів.",
    options: [4, 5, 6],
    why: "Тестування чекає на сервер і рівні. Сторінка в магазині для перевірки гри не потрібна.",
  },
  {
    id: 8,
    clue: "Виходимо, коли гру перевірено і сторінка в магазині готова.",
    options: [4, 5, 6, 7],
    why: "Реліз чекає на маркетинг і тестування. Сервер і рівні вже враховані: без них тестування не завершиться.",
  },
];

export const GIVEN_EDGES = TASKS.filter((t) => t.after.join() === "1").map((t) => [1, t.id] as const);

export const after = (id: number) => TASKS.find((t) => t.id === id)!.after;

const weeksOf = (ids: number[]) => ids.reduce((sum, id) => sum + TASKS.find((t) => t.id === id)!.weeks, 0);

export const PATHS = [
  [1, 3, 5, 7, 8],
  [1, 2, 5, 7, 8],
  [1, 2, 6, 8],
  [1, 4, 7, 8],
].map((ids) => ({ ids, weeks: weeksOf(ids) }));

export const LONGEST = Math.max(...PATHS.map((p) => p.weeks));

// Level 2: predict how far the release moves. Each event starts from the plan.
export const delayed = (task: number, plus: number) =>
  schedule(TASKS.map((t) => (t.id === task ? { ...t, weeks: t.weeks + plus } : t)));

export const SHIFTS = [0, 1, 2, 3];

export const EVENTS: { task: number; plus: number; story: string; why: string }[] = [
  {
    task: 3,
    plus: 1,
    story: "У механіці знайшли помилку у фізиці стрибка: ще 1 тиждень.",
    why: "Механіка на критичному шляху, резерву в неї немає. Кожен її тиждень — тиждень релізу.",
  },
  {
    task: 2,
    plus: 1,
    story: "Дизайнерка захворіла: дизайн займе на 1 тиждень більше.",
    why: "У дизайну резерв 1 тиждень, тож реліз на місці. Але запас вичерпано: тепер дизайн теж критичний.",
  },
  {
    task: 4,
    plus: 4,
    story: "Підрядник із сервером затягує: ще 4 тижні.",
    why: "Звучить страшно, але в сервера резерв 5 тижнів, тож реліз не зсунеться.",
  },
  {
    task: 2,
    plus: 3,
    story: "Засновники переглянули стиль персонажів: дизайн затягнеться на 3 тижні.",
    why: "Перший тиждень покрив резерв, а решта два пішли на реліз. Дизайн став критичним.",
  },
  {
    task: 6,
    plus: 5,
    story: "Магазин двічі відхилив опис: маркетинг затягнеться на 5 тижнів.",
    why: "У маркетингу резерв 4 тижні, тож понад нього лишається 1 тиждень зсуву.",
  },
];

export const DONORS: { task: number; right?: boolean; why: string }[] = [
  { task: 4, right: true, why: "У сервера найбільший резерв, 5 тижнів. Звідти можна забрати людину, і реліз не постраждає." },
  { task: 2, why: "У дизайну резерв лише 1 тиждень. Заберемо людину, і він сам стане критичним." },
  { task: 7, why: "Тестування на критичному шляху, резерву немає. Допомога механіці обернеться затримкою тут." },
];

// Level 3: name the way of estimating, then choose a date to promise.
export const METHODS = [
  { name: "За аналогами", note: "Беремо схожу роботу з минулого." },
  { name: "Параметрична", note: "Рахуємо за обсягом: одиниця × кількість." },
  { name: "Знизу вгору", note: "Оцінюємо дрібні задачі і складаємо." },
  { name: "За трьома точками", note: "Оптимістична, найімовірніша і песимістична." },
];

export const NOTES: { text: string; method: string; why: string }[] = [
  {
    text: "Минулу механіку робили 6 тижнів, ця простіша, закладемо 5.",
    method: "За аналогами",
    why: "Спирається на схожу роботу з минулого проєкту.",
  },
  {
    text: "Рівень збираємо за 0,75 дня, рівнів 20, отже 3 тижні.",
    method: "Параметрична",
    why: "Є залежність від обсягу: час на один рівень × кількість рівнів.",
  },
  {
    text: "Розписали 14 задач, оцінили кожну, склали: 4 тижні.",
    method: "Знизу вгору",
    why: "Найточніше, але й найдовше: треба розписати всю роботу.",
  },
  {
    text: "Якщо все ідеально — 3 тижні, зазвичай — 5, якщо спрацюють ризики — 10.",
    method: "За трьома точками",
    why: "Замість однієї цифри діапазон із трьох оцінок.",
  },
];

const project = pertProject(DEFAULT_ESTIMATES);

// Out of 100 possible releases, how many are ready by this week.
export const onTime = (week: number) => Math.round(normalCdf((week - project.total) / project.sigma) * 100);

export const PROMISE = { min: PLAN.total, max: 18, right: 16, need: 80 };

// Level 4: buy weeks. One purchase per work, each takes one week off.
export const TARGET = PLAN.total - 2;
export const BUDGET = 30;
export const RISK_LIMIT = 1;
export const INDIRECT = 10;
export const BEST_PRICE = 15;

export type Buy = { key: string; task: number; how: string; note: string; price: number; risky?: boolean };

export const BUYS: Buy[] = [
  { key: "server", task: 4, how: "Додати людину", note: "Ще один бекенд-розробник", price: 3 },
  { key: "marketing", task: 6, how: "Додати людину", note: "Ще один копірайтер", price: 5 },
  { key: "design", task: 2, how: "Додати людину", note: "Ще одна дизайнерка", price: 8 },
  { key: "mechanics", task: 3, how: "Додати людину", note: "Другий програміст", price: 15 },
  { key: "levels-crash", task: 5, how: "Додати людину", note: "Ще один збирач рівнів", price: 20 },
  { key: "levels-fast", task: 5, how: "Виконувати паралельно", note: "Почати рівні, не чекаючи кінця механіки. Можливі переробки.", price: 0, risky: true },
  { key: "testing-fast", task: 7, how: "Виконувати паралельно", note: "Перевіряти рівні партіями, поки їх збирають. Можливі переробки.", price: 0, risky: true },
  { key: "concept", task: 1, how: "Додати людину", note: "Запросити зовнішнього геймдизайнера", price: 30 },
];

export const compressed = (keys: string[]) =>
  schedule(TASKS.map((t) => (BUYS.some((b) => keys.includes(b.key) && b.task === t.id) ? { ...t, weeks: t.weeks - 1 } : t)));

const bought = (keys: string[]) => BUYS.filter((b) => keys.includes(b.key));
export const spent = (keys: string[]) => bought(keys).reduce((sum, b) => sum + b.price, 0);
export const risks = (keys: string[]) => bought(keys).filter((b) => b.risky).length;

// Purchases that can be dropped with the release date staying where it is.
export const wasted = (keys: string[]) =>
  bought(keys).filter((b) => compressed(keys.filter((k) => k !== b.key)).total === compressed(keys).total);

export const COMPRESS_MAX = 4;

export function compressScore(keys: string[]) {
  const saved = PLAN.total - compressed(keys).total;
  const clean = keys.length > 0 && wasted(keys).length === 0;
  const best = saved === 2 && spent(keys) === BEST_PRICE;
  return Math.min(saved, 2) + (clean ? 1 : 0) + (best ? 1 : 0);
}

// Level 5: the sprints.
export const SPRINT_QUESTIONS: { ask: string; options: { text: string; right?: boolean; why: string }[] }[] = [
  {
    ask: "За чотири спринти команда закрила 22, 26, 25 і 27 поінтів. Скільки планувати на наступний?",
    options: [
      { text: "25 поінтів", right: true, why: "Це середня швидкість. Швидкість не задають, а вимірюють." },
      { text: "27 поінтів", why: "Це рекорд, а не норма. Плануйте за середньою швидкістю, близько 25." },
      { text: "40 поінтів, як просить маркетолог", why: "Швидкість не задають наказом. Команда закриває близько 25, і решта просто не влізе." },
    ],
  },
  {
    ask: "У беклозі 150 поінтів, швидкість 25, спринт триває 2 тижні. Коли реліз?",
    options: [
      { text: "6 спринтів, тобто 12 тижнів", right: true, why: "150 / 25 = 6 спринтів, по 2 тижні кожен." },
      { text: "3 спринти, тобто 6 тижнів", why: "150 / 25 = 6 спринтів, а не 3. Тож це 12 тижнів." },
      { text: "150 поінтів — це 150 днів", why: "Поінти показують відносний обсяг, а не дні. Час рахують через швидкість: 6 спринтів, 12 тижнів." },
    ],
  },
  {
    ask: "Власник продукту додає в беклог ще 50 поінтів. Що робити?",
    options: [
      { text: "Чесно зсунути реліз на 2 спринти", right: true, why: "50 / 25 = 2 спринти. Новий обсяг чесно відсуває дату." },
      { text: "Прибрати з беклогу щось на 50 поінтів", right: true, why: "Дата лишається, бо менш важливе виходить із беклогу. Це теж чесно." },
      { text: "Подовжити спринти до трьох тижнів", why: "Довжину спринту не змінюють: саме вона робить розклад передбачуваним." },
      { text: "Сказати команді працювати швидше", why: "Швидкість вимірюють, а не наказують. Від такого наказу страждає якість, а не дата." },
    ],
  },
];

export type Reading = "behind" | "onTrack" | "grew";

export const READINGS: { key: Reading; name: string }[] = [
  { key: "behind", name: "Команда відстає" },
  { key: "onTrack", name: "Команда встигає" },
  { key: "grew", name: "Обсяг роботи виріс" },
];

export const CHARTS: { key: Reading; remaining: number[]; why: string }[] = [
  {
    key: "behind",
    remaining: [30, 29, 28, 27, 26, 24, 23, 21, 19, 16, 13],
    why: "Лінія факту весь час вище ідеальної і поступово віддаляється від неї. Це видно вже в середині спринту.",
  },
  {
    key: "onTrack",
    remaining: [30, 27, 25, 21, 18, 15, 12, 9, 6, 3, 0],
    why: "Лінія факту йде поруч з ідеальною і приходить до нуля в останній день.",
  },
  {
    key: "grew",
    remaining: [30, 27, 24, 21, 18, 28, 25, 22, 19, 16, 13],
    why: "Темп був ідеальний, але на п'ятий день лінія стрибнула вгору: у спринт додали роботу.",
  },
];

export const MAX_DIAMONDS =
  LINKS.length + 1 + EVENTS.length + 1 + NOTES.length + 1 + COMPRESS_MAX + SPRINT_QUESTIONS.length + CHARTS.length;
