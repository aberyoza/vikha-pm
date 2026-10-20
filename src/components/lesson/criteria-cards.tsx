import { RATE, dpp, irr, npv, pi, thousands } from "@/content/examples/game-studio";
import { Figure } from "./figure";

const pct = (v: number) =>
  `${new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(v * 100)}%`;
const dec = (v: number) =>
  new Intl.NumberFormat("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

const cards = [
  {
    title: "Чиста приведена вартість",
    abbr: "NPV",
    full: "Net Present Value",
    value: `+${thousands(npv(RATE))}`,
    meaning: "на стільки стали багатшими",
    rule: "більше 0",
  },
  {
    title: "Внутрішня норма доходності",
    abbr: "IRR",
    full: "Internal Rate of Return",
    value: `≈\u00a0${pct(irr())}`,
    meaning: "«ставка», яку дає проєкт",
    rule: `більша за ${pct(RATE)}`,
  },
  {
    title: "Індекс прибутковості",
    abbr: "PI",
    full: "Profitability Index",
    value: `${dec(pi())}\u00a0грн`,
    meaning: "повертається на кожну вкладену гривню",
    rule: "більше 1",
  },
  {
    title: "Строк окупності",
    abbr: "DPP",
    full: "Discounted Payback Period",
    value: `≈\u00a0${Math.round(dpp())}\u00a0роки`,
    meaning: "коли повернемо вкладене",
    rule: "менше 4 років",
  },
];

export function CriteriaCards() {
  return (
    <Figure
      title="Показники нашої гри"
      lead="Усі чотири кажуть: проєкт вигідний."
      caption={`Розраховано зі ставкою ${pct(RATE)} на рік — стільки гроші могли б заробити в іншому місці.`}
    >
      <div className="grid gap-3 @md:grid-cols-2">
        {cards.map((c) => (
          <div key={c.abbr} className="rounded-[4px] border border-border p-4">
            <p className="font-medium leading-snug">{c.title}</p>
            <p className="mt-1 text-[13px] text-muted">
              <abbr title={c.full} className="font-semibold tracking-wide no-underline">
                {c.abbr}
              </abbr>{" "}
              <span lang="en">({c.full})</span>
            </p>
            <p className="mt-3 font-display text-2xl font-semibold whitespace-nowrap text-accent">
              {c.value}
            </p>
            <p className="mt-1 text-sm">{c.meaning}</p>
            <p className="mt-2 flex items-center gap-2 text-[13px] text-sage">
              <span aria-hidden className="size-2 rotate-45 rounded-[1px] bg-sage" />
              Вигідно, якщо {c.rule}
            </p>
          </div>
        ))}
      </div>
    </Figure>
  );
}
