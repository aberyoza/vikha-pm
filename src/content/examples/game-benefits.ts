// Running example for module 14: the game after release. Downloads are in
// thousands, money in thousands of hryvnias. The charter (module 4) set the
// targets: 50 000 downloads in three months, rating 4.3 or higher, NPV > 0.

import { FLOWS, npv } from "./game-studio";

// Cumulative downloads at the end of each month, months 0–12.
export const DOWNLOADS_PLAN = [0, 20, 36, 50, 58, 70, 80, 88, 96, 104, 110, 116, 120];
export const DOWNLOADS_ACTUAL = [0, 14, 27, 38, 47, 62, 72, 80, 89, 98, 106, 112, 118];

export const RATING_TARGET = 4.3;

// First-year income came in at 112 instead of 120; later years as planned.
export const FIRST_YEAR_INCOME = 112;
export const NPV_AFTER_YEAR = npv(0.1, [FLOWS[0], FIRST_YEAR_INCOME, ...FLOWS.slice(2)]);

export type Status = "ok" | "miss" | "early";

export const CHECKPOINTS: {
  month: number;
  rating: number;
  income: { actual: number; plan: number };
  npv: Status;
  decision: string;
}[] = [
  {
    month: 3,
    rating: 4.4,
    income: { actual: 26, plan: 30 },
    npv: "early",
    decision: "Гра подобається тим, хто її знайшов, але знаходять її мало. Засновники запускають ефір зі стримером-партнером і оновлення з п'ятьма новими рівнями.",
  },
  {
    month: 6,
    rating: 4.5,
    income: { actual: 55, plan: 60 },
    npv: "early",
    decision: "Після ефіру й оновлення відставання скоротилося. Засновники лишають план без змін і стежать далі.",
  },
  {
    month: 12,
    rating: 4.5,
    income: { actual: FIRST_YEAR_INCOME, plan: FLOWS[1] },
    npv: "ok",
    decision: "Вигоди досягнуто: NPV лишається додатним, якщо наступні роки підуть за планом. Далі вигоди перевіряють раз на рік разом із бюджетом студії.",
  },
];
