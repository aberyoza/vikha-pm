"use client";

import { useState } from "react";
import { PLAN, weeks } from "@/content/examples/game-plan";
import { Figure } from "./figure";
import { EDGES, NetworkDiagram, NodeKey, edgeKey } from "./network-diagram";

const t = (id: number) => PLAN.tasks.find((task) => task.id === id)!;
const critical = PLAN.tasks.filter((task) => task.critical);
const criticalIds = new Set(critical.map((task) => task.id));
const criticalEdges = new Set(
  EDGES.filter(([a, b]) => criticalIds.has(a) && criticalIds.has(b) && t(b).es === t(a).ef).map(
    ([a, b]) => edgeKey(a, b),
  ),
);
const withSlack = PLAN.tasks.filter((task) => !task.critical);

const steps = [
  {
    label: "Тривалості",
    early: false,
    late: false,
    text: (
      <>
        Почнімо з того, що знаємо: скільки тижнів займе кожна робота (t). Тепер порахуємо, коли
        кожну з них можна почати й закінчити.
      </>
    ),
  },
  {
    label: "Прямий аналіз",
    early: true,
    late: false,
    text: (
      <>
        Ідемо зліва направо. Концепція стартує з нуля і закінчується на {t(1).ef}-му тижні. Рівні
        чекають і на дизайн (до {t(2).ef}-го тижня), і на механіку (до {t(3).ef}-го), тож
        стартують за <strong>пізнішою</strong> з них — на {t(5).es}-му. Реліз закінчиться на{" "}
        <strong>{PLAN.total}-му тижні</strong>: це найкоротший строк усього проєкту.
      </>
    ),
  },
  {
    label: "Зворотний аналіз",
    early: true,
    late: true,
    text: (
      <>
        Тепер ідемо справа наліво від {PLAN.total}-го тижня й рахуємо, коли роботу можна почати{" "}
        <strong>найпізніше</strong>, щоб не зсунути реліз. Дизайн можна почати на {t(2).ls}-му
        тижні замість {t(2).es}-го: у нього резерв {weeks(t(2).slack)}. У сервера —{" "}
        {weeks(t(4).slack)}.
      </>
    ),
  },
  {
    label: "Критичний шлях",
    early: true,
    late: true,
    text: (
      <>
        Роботи з нульовим резервом утворюють критичний шлях:{" "}
        <strong>{critical.map((task) => task.name.toLowerCase()).join(" → ")}</strong>. Разом{" "}
        {weeks(PLAN.total)}. Затримка будь-якої з них зсуне реліз. Решта робіт (
        {withSlack.map((task) => task.name.toLowerCase()).join(", ")}) мають запас.
      </>
    ),
  },
];

// Step-by-step critical path calculation on the game plan.
export function CpmExplorer() {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const last = step === steps.length - 1;

  return (
    <Figure
      title="Рахуємо критичний шлях гри"
      lead="Чотири кроки: від тривалостей до робіт, які не можна затримувати."
      caption="Числа — номери тижнів від старту проєкту. На вузькому екрані схему можна гортати вбік."
    >
      <ol className="mb-5 flex flex-wrap gap-2" aria-label="Кроки розрахунку">
        {steps.map((s, i) => {
          const on = i === step;
          return (
            <li key={s.label}>
              <button
                type="button"
                aria-current={on ? "step" : undefined}
                onClick={() => setStep(i)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium press ${
                  on
                    ? "bg-accent text-accent-foreground"
                    : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
                }`}
              >
                {i + 1}. {s.label}
              </button>
            </li>
          );
        })}
      </ol>

      <NetworkDiagram
        mode="cpm"
        plan={PLAN.tasks}
        showEarly={current.early}
        showLate={current.late}
        highlightNodes={last ? criticalIds : undefined}
        highlightEdges={last ? criticalEdges : undefined}
        dim={last}
        label={`Мережевий графік гри з розрахунком термінів. Критичний шлях: ${critical
          .map((task) => task.name)
          .join(", ")}; тривалість проєкту ${weeks(PLAN.total)}`}
      />

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {current.text}
      </p>

      <div className="mt-5">
        <NodeKey />
      </div>
    </Figure>
  );
}
