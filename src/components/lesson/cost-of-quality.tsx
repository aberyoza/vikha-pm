"use client";

import { useState } from "react";
import { COQ_PARTS, COQ_SCENARIOS, type CoqKey } from "@/content/examples/game-quality";
import { fmt } from "@/content/examples/game-finance";
import { Figure } from "./figure";

const COLOR: Record<CoqKey, string> = {
  prevention: "bg-foreground/60",
  appraisal: "bg-foreground/30",
  internal: "bg-accent/55",
  external: "bg-accent",
};

const total = (v: Record<CoqKey, number>) => Object.values(v).reduce((a, b) => a + b, 0);
const MAX = Math.max(...COQ_SCENARIOS.map((s) => total(s.values)));

// Where the money for quality goes in two ways of running the project.
export function CostOfQuality() {
  const [part, setPart] = useState<CoqKey>("external");
  const p = COQ_PARTS.find((x) => x.key === part)!;
  const [cheap, careful] = COQ_SCENARIOS;

  return (
    <Figure
      title="Вартість якості"
      lead="Що дешевше: запобігти дефектам чи потім їх виправляти."
      caption="Суми умовні, у тисячах гривень. Сірим — витрати на відповідність, медовим — витрати на невідповідність. Натисніть на частину, щоб побачити, що в неї входить."
    >
      <div className="space-y-4">
        {COQ_SCENARIOS.map((s) => (
          <div key={s.name}>
            <div className="mb-1.5 flex items-baseline justify-between text-sm">
              <span>{s.name}</span>
              <span className="font-display font-semibold tabular-nums">{fmt(total(s.values))} тис.</span>
            </div>
            <div className="flex h-8 gap-0.5" style={{ width: `${(total(s.values) / MAX) * 100}%` }}>
              {COQ_PARTS.map((x) => (
                <button
                  key={x.key}
                  type="button"
                  onClick={() => setPart(x.key)}
                  aria-label={`${x.name}: ${s.values[x.key]} тис. грн`}
                  className={`h-full rounded-[2px] transition-opacity duration-200 ${COLOR[x.key]} ${
                    part === x.key ? "outline-2 outline-offset-1 outline-foreground" : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ flex: s.values[x.key] }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px]" role="group" aria-label="Частина вартості якості">
        {COQ_PARTS.map((x) => (
          <button
            key={x.key}
            type="button"
            aria-pressed={part === x.key}
            onClick={() => setPart(x.key)}
            className={`flex items-center gap-2 rounded-md px-1 transition-colors duration-200 ${part === x.key ? "font-semibold text-foreground" : "text-muted hover:text-foreground"}`}
          >
            <span aria-hidden className={`size-3 rounded-[2px] ${COLOR[x.key]}`} />
            {x.name}
          </button>
        ))}
      </div>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        <strong>{p.name}</strong> ({p.what}): {fmt(cheap.values[part])} тис. грн, якщо економити на якості, і{" "}
        {fmt(careful.values[part])} тис. грн, якщо вкладатися в запобігання. Разом другий варіант дешевший на{" "}
        {fmt(total(cheap.values) - total(careful.values))} тис. грн.
      </p>
    </Figure>
  );
}
