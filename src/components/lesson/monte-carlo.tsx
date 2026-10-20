"use client";

import { useState } from "react";
import { thousands } from "@/content/examples/game-studio";
import { BASE_NPV, MC, simulate } from "@/content/examples/game-risks";
import { Figure } from "./figure";

const RUNS = 1000;
const BIN = 25;
const MIN = -200;
const MAX = 225;
const BINS = Array.from({ length: (MAX - MIN) / BIN }, (_, i) => MIN + i * BIN);
const pct = (v: number) => `${Math.round(v * 100)}%`;
const signed = (v: number) => (v >= 0 ? `+${thousands(v)}` : `−${thousands(-v)}`);

function stats(sample: number[]) {
  const counts = BINS.map((b) => sample.filter((v) => v >= b && v < b + BIN).length);
  counts[0] += sample.filter((v) => v < MIN).length;
  counts[counts.length - 1] += sample.filter((v) => v >= MAX).length;
  return {
    counts,
    mean: sample.reduce((a, b) => a + b, 0) / sample.length,
    loss: sample.filter((v) => v < 0).length / sample.length,
  };
}

// Monte Carlo: a thousand random futures of the game, as a histogram of NPV.
export function MonteCarlo() {
  const [seed, setSeed] = useState(1);
  const { counts, mean, loss } = stats(simulate(RUNS, seed));
  const top = Math.max(...counts);

  return (
    <Figure
      title="Метод Монте-Карло для гри"
      lead="Тисяча випадкових варіантів майбутнього замість трьох сценаріїв."
      caption={`У кожному варіанті доходи — від ${pct(MC.revenue.min)} до ${pct(MC.revenue.max)} плану (найчастіше як у плані), а вартість розробки — від ${pct(MC.cost.min)} до ${pct(MC.cost.max)} плану. Стовпчик — скільки варіантів дали такий NPV (чисту приведену вартість).`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Варіантів: {RUNS}</p>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition-opacity duration-200 hover:opacity-90"
        >
          Згенерувати ще раз
        </button>
      </div>

      <div className="mt-5 flex h-40 items-end gap-0.5" role="img" aria-label={`Розподіл NPV: середнє ${signed(mean)}, збиткових варіантів ${pct(loss)}`}>
        {counts.map((c, i) => (
          <div
            key={BINS[i]}
            title={`${BINS[i]}…${BINS[i] + BIN} тис. грн: ${c} варіантів`}
            className={`flex-1 rounded-t-[3px] transition-[height] duration-200 ${BINS[i] < 0 ? "bg-foreground/45" : "bg-accent"}`}
            style={{ height: `${(c / top) * 100}%` }}
          />
        ))}
      </div>
      <div aria-hidden className="relative mt-1 h-4 text-[12px] text-muted">
        {[MIN, 0, MAX - BIN].map((v) => (
          <span key={v} className={`absolute tabular-nums ${v === MIN ? "" : "-translate-x-1/2"}`} style={{ left: `${((v - MIN) / (MAX - MIN)) * 100}%` }}>
            {v < 0 ? `−${-v}` : v}
          </span>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-muted">NPV, тис. грн. Сірі стовпчики — збиткові варіанти.</p>

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        Середній NPV ≈ <span className="font-display font-semibold text-accent">{signed(mean)}</span> (у плані{" "}
        {signed(BASE_NPV)}). Гра збиткова приблизно в{" "}
        <span className="font-display font-semibold">{pct(loss)}</span> варіантів.
      </p>
    </Figure>
  );
}
