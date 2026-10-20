// Running example for module 6: risks of the module 4 mobile game.
// Amounts are in thousands of hryvnias. Cash flows and NPV come from
// game-studio.ts, so the risk figures agree with module 4.

import { FLOWS, RATE, irr, npv } from "./game-studio";

export const BUDGET = -FLOWS[0];
export const RESERVE_SHARE = 0.1;
export const RESERVE = BUDGET * RESERVE_SHARE; // 30 of the 300 are kept for surprises

export type Control = "full" | "partial" | "none";

export type Risk = {
  key: string;
  // Short label for charts.
  short: string;
  name: string;
  cause: string;
  effect: string;
  loss: number;
  // Response and its cost; uncontrolled risks are covered by the reserve.
  measure: string;
  measureCost: number;
  control: Control;
  // Expert danger rating for the risk rose, 1–5.
  danger: number;
};

export const RISKS: Risk[] = [
  {
    key: "price",
    short: "Ціна",
    name: "Помилка у встановленні ціни",
    cause: "не перевірили, скільки гравці готові платити за покупки в грі",
    effect: "доходи першого року на 20% нижчі",
    loss: 24,
    measure: "перевірити дві ціни на частині гравців (A/B-тест)",
    measureCost: 5,
    control: "full",
    danger: 4,
  },
  {
    key: "review",
    short: "Модерація",
    name: "Магазин застосунків відхиляє реліз",
    cause: "гра порушує правила магазину",
    effect: "реліз на місяць пізніше, а зарплати платимо",
    loss: 15,
    measure: "перевірити гру за правилами магазину до подання",
    measureCost: 2,
    control: "partial",
    danger: 2,
  },
  {
    key: "developer",
    short: "Програміст",
    name: "Іде ключовий програміст",
    cause: "лише одна людина знає код ігрової механіки",
    effect: "два місяці на пошук і навчання нової людини",
    loss: 40,
    measure: "документувати код, другий розробник переглядає зміни",
    measureCost: 8,
    control: "partial",
    danger: 4,
  },
  {
    key: "server",
    short: "Сервер",
    name: "Сервер падає в день релізу",
    cause: "не перевірили, чи витримає він наплив гравців",
    effect: "гравці не можуть увійти й видаляють гру",
    loss: 18,
    measure: "тест навантаження і автоматичне масштабування в хмарі",
    measureCost: 6,
    control: "full",
    danger: 3,
  },
  {
    key: "usd",
    short: "Курс",
    name: "Зростає курс долара",
    cause: "сервери й ліцензії оплачуємо в доларах",
    effect: "витрати на сервери зростають",
    loss: 12,
    measure: "запобігти неможливо — лише резерв",
    measureCost: 12,
    control: "none",
    danger: 2,
  },
  {
    key: "tax",
    short: "Податки",
    name: "Змінюються податки на цифрові послуги",
    cause: "рішення держави, на яке студія не впливає",
    effect: "з кожного продажу лишається менше",
    loss: 20,
    measure: "запобігти неможливо — лише резерв",
    measureCost: 20,
    control: "none",
    danger: 3,
  },
];

export const COVERAGE_NEEDED = RISKS.reduce((s, r) => s + r.measureCost, 0);

// ------------------------------------------------------------ quantitative

export const BASE_NPV = npv(RATE, FLOWS);

export type Factor = "revenue" | "cost" | "rate";

export const FACTORS: { key: Factor; label: string; hint: string }[] = [
  { key: "revenue", label: "Доходи гри", hint: "усі надходження після релізу" },
  { key: "cost", label: "Вартість розробки", hint: "300 тис. грн на старті" },
  { key: "rate", label: "Ставка", hint: "10% на рік" },
];

// NPV when one factor changes by `change` (0.1 = +10%), others stay put.
export function npvWith(factor: Factor, change: number) {
  const k = 1 + change;
  if (factor === "rate") return npv(RATE * k, FLOWS);
  const flows = FLOWS.map((cf, t) => {
    if (factor === "revenue" && t > 0) return cf * k;
    if (factor === "cost" && t === 0) return cf * k;
    return cf;
  });
  return npv(RATE, flows);
}

// |% change of NPV / % change of the factor|
export const elasticity = (factor: Factor, change = 0.1) =>
  Math.abs((npvWith(factor, change) - BASE_NPV) / BASE_NPV / change);

// Critical values: how far each factor can move before NPV hits zero.
const PV_BENEFITS = BASE_NPV + BUDGET;
export const CRITICAL = {
  revenueDrop: 1 - BUDGET / PV_BENEFITS,
  costRise: BASE_NPV / BUDGET,
  rate: irr(),
};

// Scenarios: revenue and cost multipliers.
export const SCENARIOS = [
  { key: "pessimistic", label: "Песимістичний", revenue: 0.7, cost: 1.15, p: 0.25 },
  { key: "base", label: "Найімовірніший", revenue: 1, cost: 1, p: 0.5 },
  { key: "optimistic", label: "Оптимістичний", revenue: 1.2, cost: 0.95, p: 0.25 },
] as const;

export function npvScenario(revenue: number, cost: number) {
  return npv(
    RATE,
    FLOWS.map((cf, t) => (t === 0 ? cf * cost : cf * revenue)),
  );
}

// Monte Carlo: triangular distributions for both multipliers.
export const MC = {
  revenue: { min: 0.6, mode: 1, max: 1.3 },
  cost: { min: 0.9, mode: 1, max: 1.4 },
};

export function triangular(u: number, { min, mode, max }: { min: number; mode: number; max: number }) {
  const c = (mode - min) / (max - min);
  return u < c
    ? min + Math.sqrt(u * (max - min) * (mode - min))
    : max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

// Small seeded generator so the server and the browser draw the same sample.
export function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function simulate(runs: number, seed: number) {
  const rnd = random(seed);
  return Array.from({ length: runs }, () =>
    npvScenario(triangular(rnd(), MC.revenue), triangular(rnd(), MC.cost)),
  );
}
