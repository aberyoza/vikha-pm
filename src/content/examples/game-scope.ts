// Running example for module 7: scope of the mobile game from modules 4–6.
// Tasks and durations come from game-plan.ts (module 5), so the WBS,
// PERT estimates and network diagrams agree with what readers saw there.

import { TASKS, schedule } from "./game-plan";

// ------------------------------------------------------------ scope

export const IN_SCOPE = [
  "гра для iOS і Android",
  "20 рівнів і три персонажі",
  "акаунти гравців і таблиця рекордів",
  "покупки в грі",
  "сторінки гри в обох магазинах застосунків",
];

export const OUT_OF_SCOPE = [
  "гра вдвох через інтернет",
  "версія для ПК і консолей",
  "переклад іншими мовами, крім української та англійської",
  "власний ігровий рушій",
];

export const ACCEPTANCE = [
  "гра запускається на телефонах, випущених за останні 5 років",
  "усі 20 рівнів можна пройти від початку до кінця",
  "покупка проходить менше ніж за 10 секунд",
];

// ------------------------------------------------------------ WBS

export type WbsItem = {
  code: string;
  name: string;
  // Work packages carry the estimate and the owner; summary items don't.
  owner?: string;
  weeks?: number;
};

const weeksOf = (id: number) => TASKS.find((t) => t.id === id)!.weeks;

export const WBS: WbsItem[] = [
  { code: "1", name: "Мобільна гра" },
  { code: "1.1", name: "Управління проєктом" },
  { code: "1.1.1", name: "Концепція і план", owner: "проєктний менеджер", weeks: weeksOf(1) },
  { code: "1.2", name: "Застосунок гри" },
  { code: "1.2.1", name: "Дизайн персонажів і світу", owner: "дизайнер", weeks: weeksOf(2) },
  { code: "1.2.2", name: "Ігрова механіка", owner: "програміст", weeks: weeksOf(3) },
  { code: "1.2.3", name: "20 рівнів", owner: "дизайнер", weeks: weeksOf(5) },
  { code: "1.3", name: "Сервер" },
  { code: "1.3.1", name: "Акаунти й таблиця рекордів", owner: "програміст", weeks: weeksOf(4) },
  { code: "1.4", name: "Запуск" },
  { code: "1.4.1", name: "Тестування на телефонах", owner: "тестувальник", weeks: weeksOf(7) },
  { code: "1.4.2", name: "Сторінка в магазинах", owner: "маркетолог", weeks: weeksOf(6) },
  { code: "1.4.3", name: "Реліз", owner: "програміст", weeks: weeksOf(8) },
];

// ------------------------------------------------------------ requirements

export const TRACE = [
  {
    id: "В-1",
    need: "заробляти на грі",
    requirement: "гравець може купити нового персонажа",
    wbs: "1.2.2, 1.3.1",
    check: "покупка проходить менше ніж за 10 секунд",
  },
  {
    id: "В-2",
    need: "гравці повертаються в гру",
    requirement: "таблиця рекордів серед друзів",
    wbs: "1.3.1",
    check: "рекорд друга видно через хвилину після гри",
  },
  {
    id: "В-3",
    need: "гра проходить модерацію магазинів",
    requirement: "відповідність правилам App Store і Google Play",
    wbs: "1.4.2, 1.4.3",
    check: "гру прийнято в обох магазинах",
  },
  {
    id: "В-4",
    need: "гра працює в більшості гравців",
    requirement: "підтримка телефонів за останні 5 років",
    wbs: "1.4.1",
    check: "тест на 10 найпопулярніших моделях",
  },
];

// Group decision: seven people choose how the game earns money.
export const VOTE_OPTIONS = [
  { key: "iap", label: "Покупки в грі", votes: 3 },
  { key: "ads", label: "Безкоштовна з рекламою", votes: 2 },
  { key: "paid", label: "Платна гра", votes: 2 },
] as const;
export const VOTERS = VOTE_OPTIONS.reduce((s, o) => s + o.votes, 0);
export const OWNER_CHOICE = "ads";

// ------------------------------------------------------------ scope creep

export const BASE_WEEKS = schedule().total;
export const BASE_BUDGET = 300;

export const REQUESTS = [
  { key: "levels", label: "Ще 5 рівнів", weeks: 1, cost: 12 },
  { key: "daily", label: "Щоденні нагороди", weeks: 1, cost: 8 },
  { key: "tablet", label: "Окремий вигляд для планшетів", weeks: 2, cost: 18 },
  { key: "skins", label: "Сезонні костюми персонажів", weeks: 1, cost: 10 },
  { key: "duo", label: "Гра вдвох через інтернет", weeks: 4, cost: 45 },
];

// ------------------------------------------------------------ PERT

// Optimistic (a), most likely (m) and pessimistic (b) weeks per task.
// The most likely value is the module 5 estimate.
export const PERT: Record<number, { a: number; b: number }> = {
  1: { a: 1, b: 4 },
  2: { a: 3, b: 8 },
  3: { a: 3, b: 10 },
  4: { a: 2, b: 5 },
  5: { a: 2, b: 6 },
  6: { a: 1, b: 3 },
  7: { a: 1, b: 5 },
  8: { a: 1, b: 3 },
};

export type Estimate = { a: number; m: number; b: number };

export const expected = ({ a, m, b }: Estimate) => (a + 4 * m + b) / 6;
export const variance = ({ a, b }: Estimate) => ((b - a) / 6) ** 2;

export const DEFAULT_ESTIMATES: Record<number, Estimate> = Object.fromEntries(
  TASKS.map((t) => [t.id, { a: PERT[t.id].a, m: t.weeks, b: PERT[t.id].b }]),
);

// Expected project duration on the critical path and its spread.
export function pertProject(estimates: Record<number, Estimate>) {
  const plan = schedule(TASKS.map((t) => ({ ...t, weeks: expected(estimates[t.id]) })));
  const critical = plan.tasks.filter((t) => Math.abs(t.slack) < 1e-9);
  const sigma = Math.sqrt(critical.reduce((s, t) => s + variance(estimates[t.id]), 0));
  return { total: plan.total, sigma, critical };
}

// Standard normal cumulative distribution (Abramowitz–Stegun 7.1.26).
export function normalCdf(z: number) {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-(z * z) / 2);
  return z >= 0 ? (1 + erf) / 2 : (1 - erf) / 2;
}
