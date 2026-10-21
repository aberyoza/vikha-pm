import { RISKS, priority, score } from "@/content/examples/game-risks";
import { Figure } from "./figure";

const LEVELS = [1, 2, 3, 4, 5];

const zone = (p: number, i: number) => {
  const v = p * i;
  return v >= 12 ? "bg-risk-3" : v >= 6 ? "bg-risk-2" : "bg-risk-1";
};

// Probability × impact grid with the game's risks placed in their cells.
export function RiskHeatmap() {
  return (
    <Figure
      title="Ймовірність × вплив"
      lead="Кожен ризик гри — у своїй клітинці. Що вище й правіше, то вищий пріоритет."
      caption="Пріоритет — добуток оцінок від 1 до 5. Від 12 — високий: для таких ризиків реакцію планують заздалегідь. Від 6 — середній: стежать регулярно. Нижче — приймають і переглядають час від часу."
    >
      <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2">
        <span className="self-center text-[12px] text-muted [writing-mode:vertical-rl] rotate-180">ймовірність</span>
        <div>
          <div className="grid grid-cols-5 gap-1">
            {[...LEVELS].reverse().map((p) =>
              LEVELS.map((i) => {
                const here = RISKS.filter((r) => r.probability === p && r.impact === i);
                return (
                  <div
                    key={`${p}-${i}`}
                    className={`flex min-h-14 flex-col items-start justify-start gap-1 rounded-[3px] p-1.5 ${zone(p, i)}`}
                  >
                    {here.map((r) => (
                      <span
                        key={r.key}
                        title={`${r.name}: ${score(r)} — ${priority(r)}`}
                        className="rounded-[2px] bg-surface/90 px-1 py-0.5 font-display text-[11px] leading-tight font-semibold text-foreground"
                      >
                        R-{RISKS.indexOf(r) + 1}
                      </span>
                    ))}
                  </div>
                );
              }),
            )}
          </div>
          <div className="mt-1 grid grid-cols-5 gap-1 text-center text-[12px] text-muted tabular-nums">
            {LEVELS.map((i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
          <p className="mt-0.5 text-center text-[12px] text-muted">вплив</p>
        </div>
      </div>
      <ol className="mt-4 space-y-1 text-[13px]">
        {RISKS.map((r, i) => (
          <li key={r.key} className="flex gap-2">
            <span className="w-8 shrink-0 font-display font-semibold">R-{i + 1}</span>
            <span>
              {r.name} <span className="text-muted">— {r.probability} × {r.impact} = {score(r)}</span>
            </span>
          </li>
        ))}
      </ol>
      <ul className="mt-4 grid gap-1 text-[13px] @md:grid-cols-3">
        {[
          { c: "bg-risk-3", t: "високий пріоритет" },
          { c: "bg-risk-2", t: "середній" },
          { c: "bg-risk-1", t: "низький" },
        ].map((l) => (
          <li key={l.t} className="flex items-center gap-2">
            <span aria-hidden className={`size-3 rounded-[2px] border border-border ${l.c}`} />
            {l.t}
          </li>
        ))}
      </ul>
    </Figure>
  );
}
