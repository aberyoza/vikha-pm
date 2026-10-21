"use client";

import { useId, useState } from "react";
import { PLAN, TASKS } from "@/content/examples/game-plan";
import { DEFAULT_ESTIMATES, type Estimate, expected, normalCdf, pertProject } from "@/content/examples/game-scope";
import { Figure } from "./figure";

const fmt = (v: number) => new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1 }).format(v);
const FIELDS = [
  { key: "a", label: "оптимістична" },
  { key: "m", label: "найімовірніша" },
  { key: "b", label: "песимістична" },
] as const;

// PERT on the game plan: three estimates per task give the expected
// duration and the chance to finish by a chosen week.
export function PertCalculator() {
  const id = useId();
  const [est, setEst] = useState<Record<number, Estimate>>(DEFAULT_ESTIMATES);
  const [deadline, setDeadline] = useState(PLAN.total);

  const invalid = TASKS.filter((t) => {
    const e = est[t.id];
    return !(e.a > 0 && e.a <= e.m && e.m <= e.b);
  });
  const valid = invalid.length === 0;
  const project = valid ? pertProject(est) : null;
  const chance = project ? normalCdf((deadline - project.total) / project.sigma) : 0;
  const pct = Math.round(chance * 100);

  const set = (taskId: number, key: keyof Estimate, value: number) =>
    setEst((prev) => ({ ...prev, [taskId]: { ...prev[taskId], [key]: value } }));

  return (
    <Figure
      title="PERT для гри"
      lead="Три оцінки для кожної роботи — і реалістичний строк усього проєкту."
      caption="Оцінки в тижнях. Найімовірніші — ті самі, що в модулі 5. Імовірність рахуємо для критичного шляху, вважаючи, що роботи на ньому не залежать одна від одної."
    >
      <div className="grid grid-cols-[minmax(0,1fr)_repeat(3,2.5rem)_2.25rem] items-end gap-x-1.5 gap-y-1.5 text-[13px] @md:grid-cols-[minmax(0,1fr)_repeat(3,3.25rem)_3rem] @md:gap-x-2 @md:text-sm">
        <span className="text-[12px] text-muted">Робота</span>
        {FIELDS.map((f) => (
          <span key={f.key} className="text-center text-[12px] leading-tight text-muted">
            {f.key}
            <span className="sr-only"> — {f.label}</span>
          </span>
        ))}
        <span className="text-right text-[12px] text-muted">E(t)</span>

        {TASKS.map((t) => {
          const e = est[t.id];
          const bad = invalid.includes(t);
          const critical = project?.critical.some((c) => c.id === t.id);
          return (
            <div key={t.id} className="contents">
              <span className={`flex min-w-0 items-center gap-1.5 self-center [overflow-wrap:anywhere] ${critical ? "font-medium" : ""}`}>
                {critical && <span aria-hidden className="size-2 shrink-0 rotate-45 rounded-[1px] bg-accent" />}
                {t.name}
              </span>
              {FIELDS.map((f) => (
                <input
                  key={f.key}
                  type="number"
                  min={1}
                  max={30}
                  step={1}
                  value={e[f.key]}
                  aria-label={`${t.name}: ${f.label} оцінка, тижнів`}
                  aria-invalid={bad}
                  onChange={(ev) => set(t.id, f.key, Math.max(0, Number(ev.target.value) || 0))}
                  className={`w-full rounded-md border bg-background px-1 py-1 text-center tabular-nums ${
                    bad ? "border-accent" : "border-border"
                  }`}
                />
              ))}
              <span className="text-right font-display font-semibold tabular-nums">{fmt(expected(e))}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[12px] text-muted">
        a — оптимістична, m — найімовірніша, b — песимістична оцінка. Ромб — робота на критичному шляху.
      </p>

      {valid && project ? (
        <>
          <div className="mt-5 flex items-baseline justify-between text-sm">
            <label htmlFor={id}>Дедлайн</label>
            <span className="font-display font-semibold tabular-nums">{deadline} тиж.</span>
          </div>
          <input
            id={id}
            type="range"
            min={10}
            max={22}
            step={1}
            value={deadline}
            onChange={(ev) => setDeadline(Number(ev.target.value))}
            className="mt-2 w-full accent-[var(--accent)]"
          />
          <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
            Очікуваний строк гри —{" "}
            <span className="font-display font-semibold text-accent">{fmt(project.total)} тиж.</span> (план без PERT —{" "}
            {PLAN.total}). Імовірність встигнути за {deadline} тиж. —{" "}
            <span className="font-display font-semibold text-accent">{pct < 1 ? "менше 1" : pct > 99 ? "понад 99" : pct}%</span>.
          </p>
        </>
      ) : (
        <p className="mt-5 rounded-[4px] border border-accent p-4 text-sm" role="alert">
          Перевірте «{invalid[0]?.name}»: оцінки мають бути більші за нуль, і a ≤ m ≤ b.
        </p>
      )}
    </Figure>
  );
}
