import { Figure } from "./figure";

type Level = 1 | 2 | 3;

const scale = ["Низька", "Середня", "Висока"];
const impactScale = ["Низький", "Середній", "Високий"];
const levelName: Record<Level, string> = {
  1: "Низький ризик",
  2: "Середній ризик",
  3: "Високий ризик",
};
const levelBg: Record<Level, string> = {
  1: "bg-risk-1",
  2: "bg-risk-2",
  3: "bg-risk-3",
};

// Example risks: probability and impact on a 1–3 scale.
const risks = [
  { name: "Немає запасної білизни для готелю", p: 3, i: 2 },
  { name: "Затримка постачальника", p: 2, i: 3 },
  { name: "Низька мотивація команди", p: 2, i: 2 },
  { name: "Зміни в законодавстві", p: 1, i: 3 },
  { name: "Відпустка одного з виконавців", p: 2, i: 1 },
];

function level(p: number, i: number): Level {
  const score = p + i;
  if (score >= 5) return 3;
  if (score === 4) return 2;
  return 1;
}

export function RiskMatrix() {
  // Rows go from high probability (top) to low (bottom).
  const rows = [3, 2, 1];
  const cols = [1, 2, 3];

  return (
    <Figure
      title="Матриця ризиків"
      lead="Кожен ризик оцінюють за двома осями: наскільки він імовірний і наскільки сильно вдарить по проєкту."
      caption="Для ризиків високого рівня заздалегідь готують сценарій дій, середні — регулярно відстежують, низькі — приймають."
    >
      <div className="grid grid-cols-[auto_1fr] gap-x-3">
        <p className="row-span-2 hidden self-center text-xs uppercase tracking-wide text-muted [writing-mode:vertical-rl] rotate-180 sm:block">
          Ймовірність →
        </p>

        <div className="col-start-2 grid grid-cols-[3.5rem_repeat(3,1fr)] gap-1 sm:col-start-auto">
          {rows.map((p) => (
            <div key={p} className="contents">
              <p className="self-center pr-1 text-right text-xs text-muted">
                {scale[p - 1]}
              </p>
              {cols.map((i) => {
                const lvl = level(p, i);
                const here = risks.filter((r) => r.p === p && r.i === i);
                return (
                  <div
                    key={i}
                    className={`min-h-24 rounded-md p-2 ${levelBg[lvl]}`}
                    title={levelName[lvl]}
                  >
                    <ul className="space-y-1">
                      {here.map((r) => (
                        <li
                          key={r.name}
                          className="rounded bg-surface px-2 py-1 text-xs leading-snug shadow-sm"
                        >
                          {r.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ))}

          <span />
          {impactScale.map((label) => (
            <p key={label} className="pt-1 text-center text-xs text-muted">
              {label}
            </p>
          ))}
          <span />
          <p className="col-span-3 pt-1 text-center text-xs uppercase tracking-wide text-muted">
            Вплив →
          </p>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {([1, 2, 3] as Level[]).map((lvl) => (
          <li key={lvl} className="flex items-center gap-2">
            <span className={`size-3 rounded-sm ${levelBg[lvl]}`} />
            {levelName[lvl]}
          </li>
        ))}
      </ul>
    </Figure>
  );
}
