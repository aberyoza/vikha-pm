"use client";

import { useId, useState } from "react";
import { Figure } from "./figure";

const money = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });
const coef = new Intl.NumberFormat("uk-UA", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

function Slider({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={id}>{label}</label>
        <span className="font-display font-semibold tabular-nums">
          {value} {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--accent)]"
      />
    </div>
  );
}

export function TimeValueCalculator() {
  const amountId = useId();
  const [amountText, setAmountText] = useState("10000");
  const [rate, setRate] = useState(10);
  const [years, setYears] = useState(5);

  const amount = Number(amountText);
  const valid = amountText.trim() !== "" && Number.isFinite(amount) && amount > 0;
  const r = rate / 100;
  const growth = (1 + r) ** years;
  const fv = amount * growth;
  const alpha = 1 / growth;
  const pv = amount * alpha;

  // Value of today's amount at the end of each year, for the bars.
  const path = Array.from({ length: years + 1 }, (_, t) => amount * (1 + r) ** t);
  const max = path[path.length - 1] || 1;

  return (
    <Figure
      title="Спробуйте самі"
      lead="Та сама сума в різні моменти часу коштує по-різному."
      caption="Компаундування переносить гроші вперед у часі, дисконтування — назад, до сьогодні."
    >
      <div className="space-y-4">
        <div>
          <label htmlFor={amountId} className="text-sm">
            Сума, грн
          </label>
          <input
            id={amountId}
            type="number"
            inputMode="numeric"
            min={1}
            value={amountText}
            onChange={(e) => setAmountText(e.target.value)}
            aria-invalid={!valid}
            className="mt-1.5 h-11 w-full rounded-md border border-border bg-background px-3 font-display text-lg font-semibold tabular-nums focus-visible:border-accent"
          />
          {!valid && (
            <p className="mt-1 text-sm text-accent">Введіть суму, більшу за нуль</p>
          )}
        </div>
        <Slider label="Ставка, r" value={rate} min={1} max={30} suffix="%" onChange={setRate} />
        <Slider label="Період, t" value={years} min={1} max={20} suffix="р." onChange={setYears} />
      </div>

      {valid && (
        <>
          <div aria-hidden className="mt-6 flex h-28 items-end gap-1 border-b border-border">
            {path.map((v, t) => (
              <span
                key={t}
                className={`flex-1 rounded-t-[2px] ${t === years ? "bg-accent" : "bg-accent/35"}`}
                style={{ height: `${Math.max(4, (v / max) * 100)}%` }}
                title={`Рік ${t}: ${money.format(v)} грн`}
              />
            ))}
          </div>
          <div aria-hidden className="mt-1 flex justify-between text-[13px] text-muted">
            <span>Сьогодні</span>
            <span>Рік {years}</span>
          </div>

          <dl className="mt-5 space-y-3 text-sm" aria-live="polite">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted">
                {money.format(amount)} грн сьогодні через {years} р. (FV)
              </dt>
              <dd className="font-display text-lg font-semibold whitespace-nowrap text-accent tabular-nums">
                {money.format(fv)} грн
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted">
                {money.format(amount)} грн через {years} р. сьогодні (PV)
              </dt>
              <dd className="font-display text-lg font-semibold whitespace-nowrap tabular-nums">
                {money.format(pv)} грн
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted">Коефіцієнт дисконтування, α</dt>
              <dd className="font-display text-lg font-semibold tabular-nums">
                {coef.format(alpha)}
              </dd>
            </div>
          </dl>
        </>
      )}
    </Figure>
  );
}
