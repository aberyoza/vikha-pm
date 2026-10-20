"use client";

import { useId, useState } from "react";
import { thousands } from "@/content/examples/game-studio";
import { SCENARIOS, npvScenario } from "@/content/examples/game-risks";
import { Figure } from "./figure";

const signed = (v: number) => (v >= 0 ? `+${thousands(v)}` : `−${thousands(-v)}`);
const change = (k: number) => (k === 1 ? "як у плані" : `${k > 1 ? "+" : "−"}${Math.round(Math.abs(k - 1) * 100)}%`);
const values = SCENARIOS.map((s) => npvScenario(s.revenue, s.cost));
const MAX = Math.max(...values.map(Math.abs));

// Three scenarios with expert probabilities and the expected NPV.
export function ScenarioCalculator() {
  const id = useId();
  const [probs, setProbs] = useState<number[]>(SCENARIOS.map((s) => Math.round(s.p * 100)));
  const sum = probs.reduce((a, b) => a + b, 0);
  const valid = sum === 100;
  const expected = values.reduce((acc, v, i) => acc + (v * probs[i]) / 100, 0);
  const lossChance = values.reduce((acc, v, i) => acc + (v < 0 ? probs[i] : 0), 0);

  return (
    <Figure
      title="Сценарії для гри"
      lead="Три варіанти майбутнього, кожен зі своєю ймовірністю."
      caption="Імовірності оцінюють експерти, у сумі вони дають 100%. Змініть їх і подивіться, як зміниться очікуваний NPV (чиста приведена вартість)."
    >
      <ul className="space-y-3">
        {SCENARIOS.map((s, i) => (
          <li key={s.key} className="grid gap-3 rounded-[4px] border border-border p-4 @xl:grid-cols-[minmax(0,1fr)_7rem] @xl:items-center">
            <div>
              <p className="font-medium">{s.label}</p>
              <p className="mt-0.5 text-[13px] text-muted">
                доходи {change(s.revenue)}, витрати {change(s.cost)}
              </p>
              <div aria-hidden className="mt-2 grid h-3 grid-cols-2">
                <span className="flex justify-end border-r border-border">
                  {values[i] < 0 && (
                    <span className="h-full rounded-l-[2px] bg-foreground/45" style={{ width: `${(-values[i] / MAX) * 100}%` }} />
                  )}
                </span>
                <span>
                  {values[i] >= 0 && (
                    <span className="block h-full rounded-r-[2px] bg-accent" style={{ width: `${(values[i] / MAX) * 100}%` }} />
                  )}
                </span>
              </div>
              <p className="mt-1 font-display text-sm font-semibold tabular-nums">NPV {signed(values[i])}</p>
            </div>
            <label className="flex items-center gap-2 text-sm @xl:justify-end">
              <span className="sr-only">Імовірність сценарію «{s.label}»</span>
              <input
                id={`${id}-${s.key}`}
                type="number"
                min={0}
                max={100}
                step={5}
                value={probs[i]}
                onChange={(e) => {
                  const next = [...probs];
                  next[i] = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                  setProbs(next);
                }}
                className="w-16 rounded-md border border-border bg-background px-2 py-1.5 text-right tabular-nums"
              />
              %
            </label>
          </li>
        ))}
      </ul>

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {valid ? (
          <>
            Очікуваний NPV ={" "}
            <span className={`font-display font-semibold ${expected >= 0 ? "text-accent" : ""}`}>{signed(expected)}</span>.
            Імовірність, що гра виявиться збитковою, — {lossChance}%.
          </>
        ) : (
          <>Сума ймовірностей — {sum}%. Має бути рівно 100%.</>
        )}
      </p>
    </Figure>
  );
}
