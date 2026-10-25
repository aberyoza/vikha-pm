"use client";

import { useState } from "react";
import { Figure } from "./figure";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Пн", "Вт", "Ср", "Чт", "Пт"];

const events = [
  {
    name: "Планування спринту",
    days: [0],
    who: "уся скрам-команда",
    time: "до 4 годин",
    output: "ціль спринту і беклог спринту",
    example: "Ціль: рівні 6–8 можна пройти на всіх тестових телефонах. Команда бере 24 поінти, приблизно стільки, скільки закриває за спринт.",
  },
  {
    name: "Щоденний скрам",
    days: DAYS.map((_, d) => d),
    who: "розробники",
    time: "15 хвилин щодня",
    output: "план на день",
    example: "Тестувальник каже, що рівень 7 падає на старому телефоні. Програміст бере це першим: без виправлення ціль спринту не досягти.",
  },
  {
    name: "Огляд спринту",
    days: [9],
    who: "скрам-команда і зацікавлені сторони: засновники, кілька гравців з бета-тесту",
    time: "до 2 годин",
    output: "оновлений беклог продукту",
    example: "Гравці кажуть, що рівень 8 закороткий. Власник продукту додає в беклог задачу подовжити його.",
  },
  {
    name: "Ретроспектива",
    days: [9],
    who: "уся скрам-команда",
    time: "до 1,5 години",
    output: "одне-два покращення на наступний спринт",
    example: "Тестування починали лише в останній день. Домовились тестувати кожен рівень одразу після збирання.",
  },
  {
    name: "Уточнення беклогу",
    days: [3, 7],
    who: "розробники і власник продукту",
    time: "за потреби, окремою подією не вважається",
    output: "дрібніші, оцінені задачі на наступні спринти",
    example: "Онлайн-турніри розбили на п'ять менших задач і оцінили кожну.",
  },
];

// A two-week sprint with its events laid out by day.
export function ScrumSprint() {
  const [i, setI] = useState(0);
  const e = events[i];

  return (
    <Figure
      title="Двотижневий спринт"
      lead="Коли відбувається кожна подія Scrum і що вона дає."
      caption="Тривалість подій указана для двотижневого спринту, для місячного вона вдвічі більша. Уточнення беклогу йде весь час, але подією Scrum не вважається."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Подія спринту">
        {events.map((x, k) => (
          <button
            key={x.name}
            type="button"
            aria-pressed={k === i}
            onClick={() => setI(k)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium press ${
              k === i ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
            } ${k === events.length - 1 && k !== i ? "border-dashed" : ""}`}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-10 gap-1" aria-hidden>
        {DAYS.map((d, k) => {
          const on = e.days.includes(k);
          return (
            <div key={k} className="text-center">
              <div
                className={`flex h-12 items-end justify-center rounded-[2px] pb-1 transition-colors duration-200 ${
                  on ? "bg-accent" : "bg-background"
                }`}
              >
                <span className={`size-1.5 rounded-full ${on ? "bg-accent-foreground" : "bg-foreground/25"}`} />
              </div>
              <span className={`mt-1 block text-[11px] ${on ? "font-semibold text-foreground" : "text-muted"}`}>{d}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[12px] text-muted" aria-hidden>
        <span>тиждень 1</span>
        <span>тиждень 2</span>
      </div>

      <div aria-live="polite">
        <dl className="mt-4 grid gap-x-4 gap-y-1.5 text-sm @md:grid-cols-[7rem_minmax(0,1fr)]">
          <dt className="text-muted">Хто</dt>
          <dd>{e.who}</dd>
          <dt className="text-muted">Скільки</dt>
          <dd>{e.time}</dd>
          <dt className="text-muted">Що виходить</dt>
          <dd>{e.output}</dd>
        </dl>
        <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed">
          <strong>У студії:</strong> {e.example}
        </p>
      </div>
    </Figure>
  );
}
