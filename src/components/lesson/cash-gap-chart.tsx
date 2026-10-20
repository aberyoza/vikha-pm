"use client";

import { useState } from "react";
import { LOAN, cumulativeBalance, thousands } from "@/content/examples/game-studio";
import { Figure } from "./figure";

const without = cumulativeBalance(false);
const withLoan = cumulativeBalance(true);
const MAX = Math.max(...without, ...withLoan);
const MIN = Math.min(...without, ...withLoan);
const UP = 110;
const DOWN = Math.round((UP * Math.abs(MIN)) / MAX);

// Toggle between "no loan" and "with loan" to see the cash gap disappear.
export function CashGapChart() {
  const [loan, setLoan] = useState(false);
  const values = loan ? withLoan : without;
  const gapYears = values.filter((v) => v < 0).length;

  return (
    <Figure title="Залишок на рахунку студії" lead="Без кредиту гроші закінчуються ще до релізу.">
      <div className="inline-flex rounded-md border border-border p-1 text-sm" role="group" aria-label="Варіант фінансування">
        {[
          { on: false, label: "Без кредиту" },
          { on: true, label: `З кредитом ${LOAN} тис.` },
        ].map((o) => (
          <button
            key={o.label}
            type="button"
            aria-pressed={loan === o.on}
            onClick={() => setLoan(o.on)}
            className={`rounded-[4px] px-3 py-1.5 transition-colors duration-200 ${
              loan === o.on ? "bg-accent font-medium text-accent-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-5 gap-2" aria-hidden>
        {values.map((v, t) => {
          const h = (Math.abs(v) / MAX) * UP;
          return (
            <div key={t} className="flex flex-col items-center">
              <div className="flex w-full flex-col justify-end" style={{ height: UP + 22 }}>
                {v >= 0 && (
                  <>
                    <span className="mb-1 text-center font-display text-sm font-semibold tabular-nums">
                      {Math.round(v)}
                    </span>
                    <span
                      className="mx-auto w-3/4 rounded-t-[2px] bg-sage transition-[height] duration-300"
                      style={{ height: h }}
                    />
                  </>
                )}
              </div>
              <div className="h-0.5 w-full bg-border" />
              <div className="flex w-full flex-col" style={{ height: DOWN + 22 }}>
                {v < 0 && (
                  <>
                    <span
                      className="mx-auto w-3/4 rounded-b-[2px] bg-risk-3 transition-[height] duration-300"
                      style={{ height: h }}
                    />
                    <span className="mt-1 text-center font-display text-sm font-semibold tabular-nums">
                      {Math.round(v)}
                    </span>
                  </>
                )}
              </div>
              <span className="text-[13px] text-muted">{t === 0 ? "Старт" : `Рік ${t}`}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {gapYears > 0 ? (
          <>
            <span className="font-semibold">Касовий розрив.</span> Залишок у мінусі на старті і в перший рік (до{" "}
            {thousands(-Math.min(...values))}): студії нічим платити зарплати.
          </>
        ) : (
          <>
            <span className="font-semibold">Проєкт фінансово реалізований.</span> З кредитом залишок жодного
            року не опускається нижче нуля.
          </>
        )}
      </p>
      <p className="sr-only">
        Залишок по роках: {values.map((v) => thousands(v)).join(", ")}.
      </p>
    </Figure>
  );
}
