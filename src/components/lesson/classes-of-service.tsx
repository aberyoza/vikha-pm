"use client";

import { useState } from "react";
import { Figure } from "./figure";

const COLUMNS = ["Черга", "В роботі", "Готово"] as const;
const LIMIT = 3;

type Lane = { name: string; en: string; rule: string; cards: [string[], string[], string[]] };

const LANES: Lane[] = [
  {
    name: "Термінове",
    en: "expedite",
    rule: "Береться одразу, навіть понад ліміт. Така картка на дошці лише одна, інакше «термінове» стає звичайним.",
    cards: [[], [], []],
  },
  {
    name: "До дати",
    en: "fixed date",
    rule: "Має вийти до певної дати, тому береться заздалегідь, з запасом на тестування.",
    cards: [[], ["Новорічне оновлення"], []],
  },
  {
    name: "Звичайне",
    en: "standard",
    rule: "Більшість багів і покращень. Беруться за порядком, коли в «В роботі» звільняється місце.",
    cards: [["Текст не влазить у кнопку", "Звук обривається"], ["Рекорди не зберігаються"], ["Повільний 3-й рівень"]],
  },
  {
    name: "Без строку",
    en: "intangible",
    rule: "Сьогодні нічого не горить, але без цієї роботи борг накопичується. Беруться регулярно, наприклад одна картка на тиждень.",
    cards: [["Оновити бібліотеки"], ["Прибрати старий код"], []],
  },
];

const CRASH = "Гра падає на старті";

// A Kanban board with four classes of service; an expedite card can break the limit.
export function ClassesOfService() {
  // 0: no incident, 1: crash in progress, 2: crash fixed.
  const [crash, setCrash] = useState(0);
  const [lane, setLane] = useState(0);
  const cardsOf = (l: number, c: number) =>
    l === 0 ? (crash === c ? [CRASH] : []) : LANES[l].cards[c];
  const inProgress = LANES.reduce((n, _, l) => n + cardsOf(l, 1).length, 0);

  return (
    <Figure
      title="Класи обслуговування"
      lead="Кожен клас задач має своє правило, коли його брати."
      caption={`Ліміт колонки «В роботі» — ${LIMIT} картки. Натисніть на назву смуги, щоб побачити її правило.`}
    >
      <div className="overflow-x-auto">
        <div className="grid min-w-[480px] grid-cols-[7.5rem_repeat(3,minmax(0,1fr))] gap-1.5 text-[13px]">
          <span />
          {COLUMNS.map((c, k) => (
            <span key={c} className="px-1 text-muted">
              {c}
              {k === 1 && (
                <span className={`ml-1 tabular-nums ${inProgress > LIMIT ? "font-semibold text-accent" : ""}`}>
                  {inProgress}/{LIMIT}
                </span>
              )}
            </span>
          ))}
          {LANES.map((l, i) => (
            <div key={l.name} className="contents">
              <button
                type="button"
                aria-pressed={lane === i}
                onClick={() => setLane(i)}
                className={`rounded-[2px] px-2 py-1.5 text-left font-medium press ${
                  lane === i ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
                }`}
              >
                {l.name}
              </button>
              {COLUMNS.map((_, c) => (
                <div key={c} className="min-h-10 space-y-1 rounded-[2px] bg-background p-1">
                  {cardsOf(i, c).map((t) => (
                    <div
                      key={t}
                      className={`rounded-[2px] px-1.5 py-1 leading-snug ${t === CRASH ? "bg-accent text-accent-foreground" : "bg-surface-raised"}`}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setCrash((crash + 1) % 3)}
          className="rounded-md bg-foreground/[0.07] px-3 py-1.5 text-sm font-medium press hover:bg-foreground/[0.12]"
        >
          {crash === 0 ? "Гра впала у всіх гравців" : crash === 1 ? "Виправили" : "Почати спочатку"}
        </button>
      </div>

      <div className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <p>
          <strong>
            {LANES[lane].name} ({LANES[lane].en}):
          </strong>{" "}
          {LANES[lane].rule}
        </p>
        {crash === 1 && (
          <p className="mt-2 text-sm">
            У роботі {inProgress} картки при ліміті {LIMIT}: термінова пішла повз ліміт, і команда кидає інше, щоб її закрити.
          </p>
        )}
      </div>
    </Figure>
  );
}
