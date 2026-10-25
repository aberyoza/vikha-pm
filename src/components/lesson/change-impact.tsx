"use client";

import { useState } from "react";
import { Figure } from "./figure";

// The studio's escalation thresholds: what the project manager approves alone.
const MAX_DAYS = 5;
const MAX_COST = 10;

type Request = {
  key: string;
  label: string;
  scope: string;
  days: number;
  cost: number;
  risk: string;
  advice: string;
};

const requests: Request[] = [
  {
    key: "test",
    label: "Перенести реліз на 3 дні, щоб тестувальники закінчили",
    scope: "без змін",
    days: 3,
    cost: 3,
    risk: "менше помилок у релізі",
    advice: "Погодити: зміна в межах порогів, а якість зростає.",
  },
  {
    key: "levels",
    label: "Додати ще 5 рівнів",
    scope: "+5 рівнів",
    days: 5,
    cost: 12,
    risk: "менше часу на тестування",
    advice: "Витрати перевищують поріг. Засновники можуть погодити або перенести рівні в перше оновлення після релізу.",
  },
  {
    key: "newyear",
    label: "Встигнути до Нового року, на тиждень раніше",
    scope: "без змін",
    days: -5,
    cost: 15,
    risk: "вищий ризик переробок через паралельну роботу",
    advice: "Потрібні додаткові гроші на другого програміста, тож рішення за засновниками. Вони порівнюють святкові продажі з витратами й ризиком.",
  },
  {
    key: "bug",
    label: "Виправити помилку з покупками",
    scope: "без змін",
    days: 2,
    cost: 2,
    risk: "менше скарг і повернень грошей",
    advice: "Погодити: це виправлення дефекту, і воно в межах порогів.",
  },
  {
    key: "pc",
    label: "Випустити гру ще й для ПК",
    scope: "нова платформа",
    days: 30,
    cost: 60,
    risk: "нові технічні ризики, зсув релізу на півтора місяця",
    advice: "Велика зміна змісту. Засновники зазвичай відкладають таке до наступної версії гри.",
  },
];

const days = (d: number) => (d === 0 ? "без змін" : `${d > 0 ? "+" : "−"}${Math.abs(d)} роб. дн.`);

// Pick a change request: see its impact and who approves it.
export function ChangeImpact() {
  const [key, setKey] = useState("test");
  const r = requests.find((x) => x.key === key)!;
  const pmCan = Math.abs(r.days) <= MAX_DAYS && r.cost <= MAX_COST && r.scope === "без змін";
  const approver = pmCan ? "керівник проєкту" : "засновники";

  return (
    <Figure
      title="Запит на зміну"
      lead="Оберіть запит і подивіться, на що він вплине і хто його погоджує."
      caption="Пороги студії: керівник проєкту сам погоджує зсув до тижня (5 робочих днів) і витрати до 10 тис. грн із резерву без зміни змісту. Решту вирішують засновники."
    >
      <ul className="space-y-1.5" role="group" aria-label="Запити на зміну">
        {requests.map((x) => (
          <li key={x.key}>
            <button
              type="button"
              aria-pressed={x.key === key}
              onClick={() => setKey(x.key)}
              className={`w-full rounded-[4px] border px-3 py-2 text-left text-sm transition-colors duration-200 ${
                x.key === key ? "border-accent bg-accent-soft" : "border-transparent bg-foreground/[0.04] hover:bg-foreground/[0.08]"
              }`}
            >
              {x.label}
            </button>
          </li>
        ))}
      </ul>

      <dl className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-sm" aria-live="polite">
        <dt className="text-muted">Зміст</dt>
        <dd>{r.scope}</dd>
        <dt className="text-muted">Строки</dt>
        <dd className="tabular-nums">{days(r.days)}</dd>
        <dt className="text-muted">Гроші</dt>
        <dd className="tabular-nums">+{r.cost} тис. грн</dd>
        <dt className="text-muted">Ризики й якість</dt>
        <dd>{r.risk}</dd>
        <dt className="text-muted">Погоджує</dt>
        <dd className="font-medium text-accent">{approver}</dd>
      </dl>
      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed">{r.advice}</p>
    </Figure>
  );
}
