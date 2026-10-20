// Running example for module 4: a three-person studio builds a mobile game.
// Amounts are in thousands of hryvnias. All module 4 figures derive their
// numbers from here, so text and charts always agree.

export const RATE = 0.1; // the rate investors could get elsewhere (10%)

// Year 0: development; years 1–4: net income from the game.
export const FLOWS = [-300, 120, 130, 115, 80];

export const OWN_MONEY = 120; // what the founders can put in themselves
export const LOAN = 200; // bank loan taken in year 0
export const LOAN_RATE = 0.1;
export const LOAN_YEARS = 3;

export const thousands = (v: number) =>
  `${new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(Math.round(v))} тис. грн`;

export function npv(rate: number, flows = FLOWS) {
  return flows.reduce((sum, cf, t) => sum + cf / (1 + rate) ** t, 0);
}

// Rate at which NPV is zero, found by bisection (flows change sign once).
export function irr(flows = FLOWS) {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (npv(mid, flows) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Profitability index: discounted benefits divided by discounted investment.
export function pi(rate = RATE, flows = FLOWS) {
  const benefits = flows.slice(1).reduce((s, cf, i) => s + cf / (1 + rate) ** (i + 1), 0);
  return benefits / -flows[0];
}

// Discounted payback period in years, interpolated within the payback year.
export function dpp(rate = RATE, flows = FLOWS) {
  let cumulative = flows[0];
  for (let t = 1; t < flows.length; t++) {
    const discounted = flows[t] / (1 + rate) ** t;
    if (cumulative + discounted >= 0) return t - 1 + -cumulative / discounted;
    cumulative += discounted;
  }
  return Infinity;
}

export const annuityPayment = (principal = LOAN, rate = LOAN_RATE, years = LOAN_YEARS) =>
  (principal * rate) / (1 - (1 + rate) ** -years);

// Cumulative cash in the studio's account at the end of each year.
export function cumulativeBalance(withLoan: boolean) {
  const payment = annuityPayment();
  let balance = 0;
  return FLOWS.map((cf, t) => {
    let cash = cf;
    if (t === 0) cash += OWN_MONEY + (withLoan ? LOAN : 0);
    if (withLoan && t >= 1 && t <= LOAN_YEARS) cash -= payment;
    balance += cash;
    return balance;
  });
}
