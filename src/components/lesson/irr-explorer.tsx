"use client";

import { useId, useState } from "react";
import { FLOWS, irr, npv, thousands } from "@/content/examples/game-studio";
import { Figure } from "./figure";

const IRR = irr();
const MAX_ABS = Math.max(npv(0, FLOWS), Math.abs(npv(0.3, FLOWS)));
const irrPct = Math.round(IRR * 100);

// Move the rate and watch NPV shrink; where it hits zero is the IRR.
export function IrrExplorer() {
  const id = useId();
  const [rate, setRate] = useState(10);
  const value = npv(rate / 100);
  const positive = value >= 0.5;
  const zero = Math.abs(value) < 0.5 || rate === irrPct;
  const width = Math.min(50, (Math.abs(value) / MAX_ABS) * 50);

  return (
    <Figure title="Знайдіть IRR самі" lead="Рухайте ставку, поки NPV не стане нулем.">
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={id}>Ставка</label>
        <span className="font-display font-semibold tabular-nums">{rate}% на рік</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={30}
        step={1}
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--accent)]"
      />

      <div aria-hidden className="relative mt-6 h-6 rounded-[3px] bg-background">
        <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-border" />
        <span
          className={`absolute inset-y-0 rounded-[3px] ${positive ? "left-1/2 bg-accent" : "right-1/2 bg-foreground/50"}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <div aria-hidden className="mt-1 flex justify-between text-[13px] text-muted">
        <span>збиток</span>
        <span>0</span>
        <span>вигода</span>
      </div>

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {zero ? (
          <>
            NPV ≈ 0 при ставці близько{" "}
            <span className="font-display font-semibold text-accent">{irrPct}%</span>. Це і є IRR
            нашої гри.
          </>
        ) : positive ? (
          <>
            При {rate}% NPV ={" "}
            <span className="font-display font-semibold text-accent">+{thousands(value)}</span>:
            проєкт вигідніший за вкладення під {rate}%.
          </>
        ) : (
          <>
            При {rate}% NPV ={" "}
            <span className="font-display font-semibold">−{thousands(-value)}</span>: вигідніше
            вкласти гроші під {rate}%, ніж робити гру.
          </>
        )}
      </p>
    </Figure>
  );
}
