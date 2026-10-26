"use client";

import { useState } from "react";
import { Figure } from "./figure";

type Source = "Scrum" | "Kanban" | "обидва";

const ROWS: { name: string; scrum: string; scrumban: string; kanban: string; from: Source; studio: string }[] = [
  {
    name: "Ритм",
    scrum: "спринти фіксованої довжини",
    scrumban: "огляд і ретроспектива раз на два тижні, робота йде потоком",
    kanban: "безперервний потік, зустрічі за потреби",
    from: "обидва",
    studio: "Засновники раз на два тижні бачать, що змінилося в грі, а баги закривають, щойно вони з'явилися.",
  },
  {
    name: "Ролі",
    scrum: "власник продукту, скрам-майстер, розробники",
    scrumban: "власник продукту впорядковує беклог, решта за потреби",
    kanban: "нових ролей не вимагає",
    from: "Scrum",
    studio: "Один із засновників лишається власником продукту: хтось має вирішувати, що робити першим.",
  },
  {
    name: "Планування",
    scrum: "на початку кожного спринту",
    scrumban: "коли в «Готово до роботи» лишається менше трьох карток",
    kanban: "коли звільнилося місце в роботі",
    from: "обидва",
    studio: "Коротке планування на 20 хвилин відбувається тоді, коли воно потрібне, а не за календарем.",
  },
  {
    name: "Дошка",
    scrum: "беклог спринту, очищається щоспринту",
    scrumban: "постійна дошка з обмеженнями і смугою для термінового",
    kanban: "постійна дошка з обмеженнями і класами обслуговування",
    from: "Kanban",
    studio: "Падіння гри йде окремою смугою, а в «В роботі» одночасно не більше трьох карток.",
  },
  {
    name: "Показники",
    scrum: "швидкість, діаграма згоряння",
    scrumban: "час циклу і пропускна здатність",
    kanban: "час циклу і пропускна здатність",
    from: "Kanban",
    studio: "Швидкість без спринтів втрачає сенс, тож студія обіцяє «85% багів за 4 дні».",
  },
  {
    name: "Зміни",
    scrum: "між спринтами",
    scrumban: "будь-коли, через беклог і власника продукту",
    kanban: "будь-коли, якщо є місце",
    from: "Kanban",
    studio: "Нова ідея засновників іде в беклог і може потрапити в роботу вже завтра, якщо власник продукту поставить її нагору.",
  },
];

const COLS = [
  { key: "scrum", name: "Scrum" },
  { key: "scrumban", name: "Scrumban" },
  { key: "kanban", name: "Kanban" },
] as const;

// What Scrumban takes from Scrum and from Kanban, one aspect at a time.
export function ScrumbanCompare() {
  const [i, setI] = useState(0);
  const r = ROWS[i];

  return (
    <Figure
      title="З чого складається Scrumban"
      lead="Що Scrumban бере зі Scrum, а що з Kanban."
      caption="Оберіть аспект роботи, щоб порівняти три підходи на прикладі студії після релізу."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Аспект">
        {ROWS.map((x, k) => (
          <button
            key={x.name}
            type="button"
            aria-pressed={k === i}
            onClick={() => setI(k)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium press ${
              k === i ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-2 @xl:grid-cols-3" aria-live="polite">
        {COLS.map((c) => (
          <div
            key={c.key}
            className={`rounded-[4px] p-3 text-sm ${c.key === "scrumban" ? "border border-accent bg-accent-soft" : "bg-foreground/[0.04]"}`}
          >
            <p className="font-medium">{c.name}</p>
            <p className="mt-1 leading-snug">{r[c.key]}</p>
            {c.key === "scrumban" && (
              <p className="mt-2 text-[13px] text-muted">
                {r.from === "обидва" ? "поєднання обох" : `бере з ${r.from}`}
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed">
        <strong>У студії:</strong> {r.studio}
      </p>
    </Figure>
  );
}
