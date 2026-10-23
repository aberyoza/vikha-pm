// Running example for module 9: the game's costs over the module 5 plan.
// Amounts in thousands of hryvnias. The time-phased budget (S-curve) is
// derived from the schedule in game-plan.ts, so the two always agree.

import { PLAN } from "./game-plan";

// Cost estimate per task id.
export const COSTS: Record<number, number> = {
  1: 20, // concept
  2: 50, // design
  3: 60, // mechanics
  4: 35, // server
  5: 45, // levels
  6: 20, // marketing
  7: 25, // testing
  8: 15, // release
};

export const BAC = Object.values(COSTS).reduce((a, b) => a + b, 0); // 270
export const CONTINGENCY = 30;
export const BUDGET = BAC + CONTINGENCY; // 300
export const WEEKS = PLAN.total; // 13

// Planned value at the end of week w: each task spends evenly over its
// planned duration.
export function plannedValue(w: number) {
  return PLAN.tasks.reduce((sum, t) => {
    const done = Math.min(Math.max(w - t.es, 0), t.weeks) / t.weeks;
    return sum + COSTS[t.id] * done;
  }, 0);
}

export const PV_CURVE = Array.from({ length: WEEKS + 1 }, (_, w) => plannedValue(w));

// Status at week 8: mechanics is late and the programmer worked overtime.
export const STATUS_WEEK = 8;
export const STATUS = { pv: plannedValue(STATUS_WEEK), ev: 185, ac: 205 };

// Earned value and actual cost up to the status week, for the charts.
export const EV_CURVE = PV_CURVE.slice(0, STATUS_WEEK + 1).map((pv) => (pv * STATUS.ev) / STATUS.pv);
export const AC_CURVE = PV_CURVE.slice(0, STATUS_WEEK + 1).map((pv) => (pv * STATUS.ac) / STATUS.pv);

export const evm = (pv: number, ev: number, ac: number) => {
  const cpi = ev / ac;
  const spi = ev / pv;
  const eac = BAC / cpi;
  return {
    sv: ev - pv,
    cv: ev - ac,
    spi,
    cpi,
    eac,
    etc: eac - ac,
    vac: BAC - eac,
    weeks: WEEKS / spi,
  };
};

export const fmt = (v: number, digits = 0) =>
  new Intl.NumberFormat("uk-UA", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(v);
