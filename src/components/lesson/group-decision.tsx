"use client";

import { useState } from "react";
import { OWNER_CHOICE, VOTERS, VOTE_OPTIONS } from "@/content/examples/game-scope";
import { Figure } from "./figure";

const top = [...VOTE_OPTIONS].sort((a, b) => b.votes - a.votes)[0];
const label = (key: string) => VOTE_OPTIONS.find((o) => o.key === key)!.label;

const rules = [
  {
    key: "unanimity",
    name: "Одностайність",
    need: "за — 100%",
    result: () =>
      VOTE_OPTIONS.some((o) => o.votes === VOTERS) ? null : "Рішення немає: думки розділилися, треба обговорювати далі.",
  },
  {
    key: "majority",
    name: "Більшість",
    need: "за — понад 50%",
    result: () =>
      top.votes > VOTERS / 2
        ? `Обрано «${top.label}».`
        : `Рішення немає: «${top.label}» має лише ${top.votes} голоси з ${VOTERS}, це менше половини.`,
  },
  {
    key: "plurality",
    name: "Відносна більшість",
    need: "найбільше голосів",
    result: () => `Обрано «${top.label}»: ${top.votes} голоси — більше, ніж за будь-який інший варіант.`,
  },
  {
    key: "dictatorship",
    name: "Одноосібно",
    need: "вирішує одна людина",
    result: () =>
      `Product Owner вислухав усіх і обрав «${label(OWNER_CHOICE)}». Швидко, але решта може бути не згодна.`,
  },
] as const;

// Same votes, four decision rules, different outcomes.
export function GroupDecision() {
  const [key, setKey] = useState<(typeof rules)[number]["key"]>("majority");
  const rule = rules.find((r) => r.key === key)!;

  return (
    <Figure
      title="Як група ухвалює рішення"
      lead={`${VOTERS} людей обирають, як гра заробляватиме гроші. Голоси ті самі — результат залежить від правила.`}
    >
      <ul className="space-y-2">
        {VOTE_OPTIONS.map((o) => (
          <li key={o.key} className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] items-center gap-3 text-sm">
            <span>{o.label}</span>
            <span className="flex gap-1" aria-label={`${o.votes} голоси`}>
              {Array.from({ length: o.votes }, (_, i) => (
                <span key={i} aria-hidden className="size-4 rounded-full bg-accent" />
              ))}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Правило ухвалення рішення">
        {rules.map((r) => (
          <button
            key={r.key}
            type="button"
            aria-pressed={r.key === key}
            onClick={() => setKey(r.key)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
              r.key === key ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent hover:text-accent"
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      <p className="mt-5 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <span className="font-medium">{rule.name}</span> <span className="text-muted">({rule.need})</span>.{" "}
        {rule.result()}
      </p>
    </Figure>
  );
}
