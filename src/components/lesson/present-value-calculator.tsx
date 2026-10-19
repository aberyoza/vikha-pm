"use client";

import { useId, useState } from "react";
import { Figure } from "./figure";

const money = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });

function yearsLabel(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} рік`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} роки`;
  return `${n} років`;
}

function Slider({
  label,
  value,
  min,
  max,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  display: string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={id}>{label}</label>
        <span className="font-display font-semibold tabular-nums">{display}</span>
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

// One question only: what is money received in the future worth today?
export function PresentValueCalculator() {
  const amountId = useId();
  const [amountText, setAmountText] = useState("10000");
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(10);

  const amount = Number(amountText);
  const valid = amountText.trim() !== "" && Number.isFinite(amount) && amount > 0;
  const today = amount / (1 + rate / 100) ** years;

  return (
    <Figure title="Спробуйте самі" lead="Скільки сьогодні варті гроші, які ви отримаєте колись?">
      <div className="space-y-4">
        <div>
          <label htmlFor={amountId} className="text-sm">
            Отримаю в майбутньому, грн
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
          {!valid && <p className="mt-1 text-sm text-accent">Введіть суму, більшу за нуль</p>}
        </div>
        <Slider
          label="Через скільки"
          value={years}
          min={1}
          max={10}
          display={yearsLabel(years)}
          onChange={setYears}
        />
        <Slider
          label="Під скільки можна вкласти гроші"
          value={rate}
          min={1}
          max={25}
          display={`${rate}% на рік`}
          onChange={setRate}
        />
      </div>

      {valid && (
        <p className="mt-6 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
          {money.format(amount)} грн, які ви отримаєте через {yearsLabel(years)}, сьогодні
          варті{" "}
          <span className="font-display text-xl font-semibold whitespace-nowrap text-accent">
            {money.format(today)} грн
          </span>
          .
        </p>
      )}
    </Figure>
  );
}
