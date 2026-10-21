"use client";

import { useState } from "react";
import { BASE_BUDGET, BASE_WEEKS, REQUESTS } from "@/content/examples/game-scope";
import { weeks } from "@/content/examples/game-plan";
import { Figure } from "./figure";

const MAX_WEEKS = BASE_WEEKS + REQUESTS.reduce((s, r) => s + r.weeks, 0);
const MAX_BUDGET = BASE_BUDGET + REQUESTS.reduce((s, r) => s + r.cost, 0);

function Meter({ label, base, value, max, unit }: { label: string; base: number; value: number; max: number; unit: string }) {
  return (
    <div>
      <p className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-display font-semibold tabular-nums">
          {value} {unit}
          {value > base && <span className="text-accent"> (+{value - base})</span>}
        </span>
      </p>
      <div aria-hidden className="mt-1.5 flex h-4 gap-0.5 rounded-[2px] bg-background">
        <span className="h-full rounded-l-[2px] bg-foreground/55" style={{ width: `${(base / max) * 100}%` }} />
        {value > base && (
          <span className="h-full rounded-r-[2px] bg-accent transition-[width] duration-200" style={{ width: `${((value - base) / max) * 100}%` }} />
        )}
      </div>
    </div>
  );
}

// Scope creep: small "free" additions quietly stretch time and budget.
export function ScopeCreep() {
  const [picked, setPicked] = useState<string[]>([]);
  const chosen = REQUESTS.filter((r) => picked.includes(r.key));
  const addWeeks = chosen.reduce((s, r) => s + r.weeks, 0);
  const addCost = chosen.reduce((s, r) => s + r.cost, 0);

  return (
    <Figure
      title="Розростання змісту"
      lead="«Це ж дрібниця, додайте, будь ласка». Погодьтеся на кілька таких прохань."
      caption="Сіре — базовий план, медове — те, що додали зверху. Через контроль змін кожне прохання отримує оцінку і рішення: так (з новим строком і бюджетом), ні або «у наступній версії»."
    >
      <fieldset>
        <legend className="text-sm text-muted">Прохання від замовника й команди</legend>
        <ul className="mt-2 space-y-1.5">
          {REQUESTS.map((r) => (
            <li key={r.key}>
              <label className="flex cursor-pointer items-center gap-3 rounded-[4px] border border-border px-3 py-2 text-sm transition-colors duration-200 hover:border-accent">
                <input
                  type="checkbox"
                  checked={picked.includes(r.key)}
                  onChange={(e) =>
                    setPicked((p) => (e.target.checked ? [...p, r.key] : p.filter((k) => k !== r.key)))
                  }
                  className="size-4 accent-[var(--accent)]"
                />
                <span className="flex-1">{r.label}</span>
                <span className="text-[12px] whitespace-nowrap text-muted tabular-nums">
                  +{weeks(r.weeks)}, +{r.cost} тис.
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="mt-5 space-y-3">
        <Meter label="Строк" base={BASE_WEEKS} value={BASE_WEEKS + addWeeks} max={MAX_WEEKS} unit="тиж." />
        <Meter label="Бюджет" base={BASE_BUDGET} value={BASE_BUDGET + addCost} max={MAX_BUDGET} unit="тис. грн" />
      </div>

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {chosen.length === 0 ? (
          <>За базовим планом гра виходить через {weeks(BASE_WEEKS)} і коштує {BASE_BUDGET} тис. грн.</>
        ) : (
          <>
            {chosen.length === 1 ? "Одна «дрібниця»" : `${chosen.length} ${chosen.length < 5 ? "«дрібниці»" : "«дрібниць»"}`} — і реліз на{" "}
            <span className="font-display font-semibold text-accent">{weeks(addWeeks)}</span> пізніше, а бюджет більший на{" "}
            <span className="font-display font-semibold text-accent">{addCost} тис. грн</span> (
            {Math.round((addCost / BASE_BUDGET) * 100)}%). Якщо строки й гроші при цьому не переглянули, це і є розростання змісту.
          </>
        )}
      </p>
    </Figure>
  );
}
