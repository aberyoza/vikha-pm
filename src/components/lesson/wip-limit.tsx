"use client";

import { useId, useState } from "react";
import { Figure } from "./figure";

const PEOPLE = 3;
const MAX = 8;
const TASKS = ["Вильоти на Android 9", "Звук у меню", "Текст кнопки «Грати»", "Рекорди в турнірі", "Повільний 3-й рівень", "Новий скін", "Переклад англійською", "Пуш-сповіщення"];

const days = (n: number) => (n === 1 ? "день" : n < 5 ? "дні" : "днів");
const tasks = (n: number) => (n === 1 ? "задача" : n < 5 ? "задачі" : "задач");

// Work in progress against how long each task takes, at one task finished a day.
export function WipLimit() {
  const id = useId();
  const [wip, setWip] = useState(6);
  const perPerson = wip / PEOPLE;

  return (
    <Figure
      title="Обмеження незавершеної роботи"
      lead="Що більше задач одночасно в роботі, то довше йде кожна."
      caption={`Команда підтримки — ${PEOPLE} людини, і вона закриває одну задачу на день. Тоді середній час задачі в роботі дорівнює кількості задач у роботі.`}
    >
      <div className="flex items-baseline justify-between text-sm">
        <label htmlFor={`${id}-wip`}>Задач одночасно в роботі</label>
        <span className="font-display font-semibold tabular-nums">{wip}</span>
      </div>
      <input
        id={`${id}-wip`}
        type="range"
        min={1}
        max={MAX}
        step={1}
        value={wip}
        onChange={(e) => setWip(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--accent)]"
      />

      <div className="mt-5 grid grid-cols-2 gap-3 text-[13px]" aria-hidden>
        {[
          ["Черга", TASKS.slice(wip)],
          ["В роботі", TASKS.slice(0, wip)],
        ].map(([name, list]) => (
          <div key={name as string} className="rounded-[4px] bg-background p-2">
            <p className="mb-2 flex justify-between text-muted">
              <span>{name}</span>
              <span className="tabular-nums">{(list as string[]).length}</span>
            </p>
            <ul className="space-y-1">
              {(list as string[]).map((t) => (
                <li
                  key={t}
                  className={`truncate rounded-[2px] px-2 py-1 ${name === "В роботі" ? "bg-accent text-accent-foreground" : "bg-foreground/10"}`}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {wip} {tasks(wip)} в роботі: кожна йде в середньому{" "}
        <strong>
          {wip} {days(wip)}
        </strong>
        .{" "}
        {perPerson > 1
          ? `На людину припадає більше однієї задачі, тож люди перемикаються між ними, і на практиці виходить ще довше.`
          : `Кожен веде не більше однієї задачі й доводить її до кінця.`}
      </p>
    </Figure>
  );
}
