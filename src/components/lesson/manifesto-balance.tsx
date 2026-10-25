"use client";

import { useState } from "react";
import { Figure } from "./figure";

const pairs = [
  {
    left: "Люди і взаємодія",
    right: "процеси та інструменти",
    example: "Програміст і дизайнер за п'ять хвилин домовляються про стрибок персонажа замість тижня коментарів у трекері.",
    misread: "Без процесів і інструментів кожен працює як знає, і задачі губляться між людьми.",
  },
  {
    left: "Робочий продукт",
    right: "вичерпна документація",
    example: "Після спринту є рівень, у який можна зіграти, а опис рівня вміщується на одну сторінку.",
    misread: "Без документації новий розробник місяць розбирається, як влаштована гра.",
  },
  {
    left: "Співпраця із замовником",
    right: "переговори про контракт",
    example: "Засновники дивляться результат кожного спринту і разом із командою вирішують, що робити далі.",
    misread: "Без домовленостей незрозуміло, за що платять і коли робота закінчена.",
  },
  {
    left: "Реагування на зміни",
    right: "дотримання плану",
    example: "Бета-тест показав, що на 5-му рівні нудно, і команда переробляє його в наступному спринті.",
    misread: "Без плану команда хапається за кожну ідею, і реліз відкладається знову і знову.",
  },
];

type Mode = "intended" | "misread";

// The four Agile values: the left item matters more, the right one still matters.
export function ManifestoBalance() {
  const [mode, setMode] = useState<Mode>("intended");
  const [i, setI] = useState(0);
  const p = pairs[i];
  const misread = mode === "misread";

  return (
    <Figure
      title="Чотири цінності Agile"
      lead="Ліве важливіше за праве, але праве не дорівнює нулю."
      caption="Натисніть на пару, щоб побачити приклад зі студії. Перемикач показує, що буває, коли праву частину просто викидають."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Як читати маніфест">
        {(
          [
            ["intended", "Як задумано"],
            ["misread", "Як часто читають"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium press ${
              mode === m ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ol className="mt-5 space-y-2">
        {pairs.map((x, k) => (
          <li key={x.left}>
            <button
              type="button"
              aria-pressed={k === i}
              onClick={() => setI(k)}
              className={`grid w-full grid-cols-[minmax(0,1.6fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-[4px] border p-2 text-left text-sm transition-colors duration-200 ${
                k === i ? "border-accent" : "border-transparent bg-foreground/[0.04] hover:bg-foreground/[0.08]"
              }`}
            >
              <span className="rounded-[2px] bg-accent px-2.5 py-2 font-medium text-accent-foreground">{x.left}</span>
              <span aria-hidden className="text-muted">
                &gt;
              </span>
              <span
                className={`rounded-[2px] px-2.5 py-1.5 text-[13px] transition-colors duration-200 ${
                  misread ? "border border-dashed border-border text-muted line-through" : "bg-foreground/15"
                }`}
              >
                {x.right}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {misread ? (
          <>
            <strong>Якщо викинути «{p.right}»:</strong> {p.misread}
          </>
        ) : (
          <>
            <strong>У студії:</strong> {p.example}
          </>
        )}
      </p>
    </Figure>
  );
}
