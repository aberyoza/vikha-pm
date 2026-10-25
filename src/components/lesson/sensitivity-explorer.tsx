"use client";

import { useId, useState } from "react";
import { thousands } from "@/content/examples/game-studio";
import { BASE_NPV, FACTORS, type Factor, elasticity, npvWith } from "@/content/examples/game-risks";
import { Figure } from "./figure";

const ranked = FACTORS.map((f) => ({ ...f, e: elasticity(f.key) })).sort((a, b) => b.e - a.e);
const MAX_E = ranked[0].e;
const fmtE = (v: number) => new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1 }).format(v);
const signed = (v: number) => (v >= 0 ? `+${thousands(v)}` : `−${thousands(-v)}`);

// "What if": change one factor, keep the rest, see NPV and elasticity.
export function SensitivityExplorer() {
  const id = useId();
  const [factor, setFactor] = useState<Factor>("revenue");
  const [change, setChange] = useState(-10);
  const value = npvWith(factor, change / 100);
  const label = FACTORS.find((f) => f.key === factor)!.label;
  const e = change === 0 ? elasticity(factor) : Math.abs((value - BASE_NPV) / BASE_NPV / (change / 100));

  return (
    <Figure
      title="Аналіз чутливості гри"
      lead="Змінюємо один фактор, решта лишається як у плані."
      caption="Еластичність — у скільки разів сильніше за фактор змінюється NPV (чиста приведена вартість). Що вона більша, то небезпечніший фактор."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Фактор ризику">
        {FACTORS.map((f) => {
          const on = f.key === factor;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={on}
              onClick={() => setFactor(f.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium press ${
                on ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-baseline justify-between text-sm">
        <label htmlFor={id}>Зміна фактора</label>
        <span className="font-display font-semibold tabular-nums">
          {change > 0 ? "+" : change < 0 ? "−" : ""}
          {Math.abs(change)}%
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={-30}
        max={30}
        step={1}
        value={change}
        onChange={(ev) => setChange(Number(ev.target.value))}
        className="mt-2 w-full accent-[var(--accent)]"
      />

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {change === 0 ? (
          <>
            У плані NPV гри — <span className="font-display font-semibold text-accent">{signed(BASE_NPV)}</span>.
            Зсуньте повзунок.
          </>
        ) : (
          <>
            {label}: {change > 0 ? "+" : "−"}
            {Math.abs(change)}%. NPV ={" "}
            <span className={`font-display font-semibold ${value >= 0 ? "text-accent" : ""}`}>{signed(value)}</span>{" "}
            замість {signed(BASE_NPV)}
            {value < 0 && <> — гра стає збитковою</>}. Еластичність ≈ {fmtE(e)}.
          </>
        )}
      </p>

      <p className="mt-6 text-sm font-medium">Рейтинг небезпеки (зміна на 10%)</p>
      <ul className="mt-2 space-y-2">
        {ranked.map((f) => (
          <li key={f.key} className="grid grid-cols-[8.5rem_minmax(0,1fr)_2.5rem] items-center gap-3 text-[13px]">
            <span className={f.key === factor ? "font-semibold" : ""}>{f.label}</span>
            <span aria-hidden className="h-3 rounded-[2px] bg-background">
              <span
                className={`block h-full rounded-[2px] ${f.key === factor ? "bg-accent" : "bg-muted/60"}`}
                style={{ width: `${(f.e / MAX_E) * 100}%` }}
              />
            </span>
            <span className="text-right font-display font-semibold tabular-nums">{fmtE(f.e)}</span>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
