"use client";

import { useState } from "react";
import { Figure } from "./figure";

const PEOPLE = ["Програміст", "Дизайнер", "Маркетолог"];
const SCALE = 4;

// Output of the team together, in the same arbitrary units as one person.
const modes = {
  positive: {
    label: "Позитивна",
    together: 3.7,
    why: [
      "дизайнер підказує програмісту, як гравець бачить механіку;",
      "маркетолог приносить у роботу відгуки гравців;",
      "кожен знає свою роль і не дублює інших.",
    ],
  },
  negative: {
    label: "Негативна",
    together: 2.2,
    why: [
      "двоє роблять те саме, бо ролі не розписані;",
      "люди чекають одне одного й рішень керівника;",
      "суперечки забирають час, який мав піти на гру.",
    ],
  },
};
type Mode = keyof typeof modes;

const pct = (v: number) => `${(v / SCALE) * 100}%`;

// Sum of individual contributions against what the team does together.
export function SynergyBars() {
  const [mode, setMode] = useState<Mode>("positive");
  const m = modes[mode];
  const sum = PEOPLE.length;

  return (
    <Figure
      title="Синергія"
      lead="Команда разом робить більше або менше, ніж троє людей окремо."
      caption="Довжина смужок умовна. Синергію не міряють лінійкою, але її видно за тим, скільки команда встигає."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Вид синергії">
        {(Object.keys(modes) as Mode[]).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={mode === k}
            onClick={() => setMode(k)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
              mode === k ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent hover:text-accent"
            }`}
          >
            {modes[k].label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2 text-[13px]" aria-hidden>
        {PEOPLE.map((p, i) => (
          <div key={p} className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-3">
            <span className="truncate text-muted">{p}</span>
            <div className="relative h-5">
              <span
                className="absolute inset-y-0 rounded-[2px] bg-foreground/45"
                style={{ left: pct(i), width: `calc(${pct(1)} - 2px)` }}
              />
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-3 border-t border-border pt-3">
          <span className="truncate">Сума окремо</span>
          <div className="relative h-6">
            <span className="absolute inset-y-0 left-0 rounded-[2px] border-2 border-dashed border-foreground/60" style={{ width: pct(sum) }} />
          </div>
        </div>
        <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-3">
          <span className="truncate font-semibold">Разом</span>
          <div className="relative h-6">
            <span
              className={`absolute inset-y-0 left-0 rounded-[2px] transition-[width,background-color] duration-300 ${
                mode === "positive" ? "bg-accent" : "bg-risk-3"
              }`}
              style={{ width: pct(m.together) }}
            />
            <span className="absolute inset-y-[-4px] border-l-2 border-dashed border-foreground/60" style={{ left: pct(sum) }} />
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[4px] bg-accent-soft p-4 text-sm leading-relaxed" aria-live="polite">
        <p className="font-medium">
          {mode === "positive" ? "Разом виходить більше, бо:" : "Разом виходить менше, бо:"}
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {m.why.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </div>
    </Figure>
  );
}
