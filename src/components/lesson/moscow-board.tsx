"use client";

import { useState } from "react";
import { Figure } from "./figure";

type Group = "M" | "S" | "C" | "W";

const GROUPS: { key: Group; name: string }[] = [
  { key: "M", name: "Must" },
  { key: "S", name: "Should" },
  { key: "C", name: "Could" },
  { key: "W", name: "Won't" },
];

const ITEMS: { name: string; points: number; group: Group }[] = [
  { name: "20 рівнів", points: 40, group: "M" },
  { name: "Збереження прогресу", points: 8, group: "M" },
  { name: "Навчання на першому рівні", points: 5, group: "M" },
  { name: "Покупки з підтвердженням дорослого", points: 8, group: "M" },
  { name: "Звук і музика", points: 8, group: "M" },
  { name: "Повтор рівня після програшу", points: 5, group: "S" },
  { name: "Таблиця рекордів", points: 13, group: "S" },
  { name: "Нові скіни персонажа", points: 8, group: "C" },
  { name: "Щоденні нагороди", points: 8, group: "C" },
  { name: "Онлайн-турніри", points: 40, group: "W" },
];

// Four sprints of about 25 points each are left before the release.
const CAPACITY = 100;

// MoSCoW prioritisation of the game's backlog against the team's capacity.
export function MoscowBoard() {
  const [groups, setGroups] = useState<Group[]>(ITEMS.map((x) => x.group));
  const sum = (g: Group) => ITEMS.reduce((s, x, i) => s + (groups[i] === g ? x.points : 0), 0);
  const must = sum("M");
  const should = sum("S");

  return (
    <Figure
      title="MoSCoW"
      lead="Що обов'язково увійде в реліз, а що почекає."
      caption={`До релізу лишилося чотири спринти по 25 поінтів, тобто ${CAPACITY}. Must має вміститися повністю, Should — якщо лишиться місце. Перекладайте елементи між групами.`}
    >
      <ul className="divide-y divide-border text-sm">
        {ITEMS.map((x, i) => (
          <li key={x.name} className="flex flex-wrap items-center justify-between gap-2 py-2">
            <span>
              {x.name} <span className="ml-1 text-muted tabular-nums">({x.points})</span>
            </span>
            <span className="flex gap-1" role="group" aria-label={`Група для «${x.name}»`}>
              {GROUPS.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  aria-pressed={groups[i] === g.key}
                  aria-label={g.name}
                  onClick={() => setGroups((prev) => prev.map((v, j) => (j === i ? g.key : v)))}
                  className={`w-8 rounded-md py-1 text-[13px] font-semibold press ${
                    groups[i] === g.key ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
                  }`}
                >
                  {g.key}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <strong>
          Must: {must} поінтів з {CAPACITY}.
        </strong>{" "}
        {must > CAPACITY
          ? "Обов'язкове вже не вміщується до релізу: щось із Must треба перенести або зменшити."
          : must + should > CAPACITY
            ? `Must вміщується. Лишається ${CAPACITY - must} поінтів, а Should потребує ${should}, тож частина бажаного не встигне.`
            : `Must вміщується, і Should (${should}) теж. Лишається ${CAPACITY - must - should} поінтів на Could.`}
      </p>
    </Figure>
  );
}
