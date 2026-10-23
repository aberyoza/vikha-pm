"use client";

import { useState, type MouseEvent } from "react";
import { Figure } from "./figure";

// New requests per working day over four weeks (30 in total); the team
// finishes one task a day.
const ARRIVALS = [3, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1];
const LIMIT = 2;

type Day = { queue: number; doing: number; done: number };

function flow(limit: number | null): Day[] {
  let arrived = 0;
  let done = 0;
  return ARRIVALS.map((a) => {
    arrived += a;
    const open = arrived - done;
    const doing = limit === null ? open : Math.min(limit, open);
    // Finished at the end of the day, if anything was in progress.
    const day = { queue: open - doing, doing, done };
    if (doing > 0) done += 1;
    return day;
  });
}

const SCENARIOS = { free: flow(null), limited: flow(LIMIT) };
type Scenario = keyof typeof SCENARIOS;

const W = 360;
const H = 200;
const PAD = { left: 28, right: 8, top: 10, bottom: 24 };
const MAX_Y = ARRIVALS.reduce((a, b) => a + b, 0);
const x = (d: number) => PAD.left + (d / (ARRIVALS.length - 1)) * (W - PAD.left - PAD.right);
const y = (v: number) => PAD.top + (1 - v / MAX_Y) * (H - PAD.top - PAD.bottom);

// Area between two stacked series.
const band = (lo: number[], hi: number[]) =>
  `M${hi.map((v, d) => `${x(d)},${y(v)}`).join(" L")} L${lo.map((v, d) => `${x(d)},${y(v)}`).reverse().join(" L")} Z`;

const BANDS = [
  { key: "queue", name: "Черга", className: "fill-foreground/20" },
  { key: "doing", name: "В роботі", className: "fill-accent" },
  { key: "done", name: "Готово", className: "fill-foreground/55" },
] as const;

// Cumulative flow diagram of the support team, with and without a WIP limit.
export function CumulativeFlow() {
  const [scenario, setScenario] = useState<Scenario>("free");
  const [day, setDay] = useState(ARRIVALS.length - 1);
  const data = SCENARIOS[scenario];
  const done = data.map((d) => d.done);
  const doing = data.map((d) => d.done + d.doing);
  const all = data.map((d) => d.done + d.doing + d.queue);
  const sel = data[day];

  const pick = (e: MouseEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    const d = Math.round(((px - PAD.left) / (W - PAD.left - PAD.right)) * (ARRIVALS.length - 1));
    setDay(Math.max(0, Math.min(ARRIVALS.length - 1, d)));
  };

  return (
    <Figure
      title="Накопичувальна діаграма потоку"
      lead="Скільки задач у кожній колонці дошки, день за днем."
      caption="Чотири тижні роботи команди підтримки після релізу: 30 заявок, одна закрита задача на день. Наведіть на діаграму, щоб побачити день."
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Правило дошки">
        {(
          [
            ["free", "Без обмеження"],
            ["limited", `Не більше ${LIMIT} в роботі`],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            aria-pressed={scenario === k}
            onClick={() => setScenario(k)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
              scenario === k ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent hover:text-accent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full cursor-crosshair" onMouseMove={pick} onClick={pick} role="img" aria-label="Накопичувальна діаграма потоку">
        {[0, 10, 20, 30].map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="stroke-grid" />
            <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" className="fill-muted text-[10px] tabular-nums">
              {t}
            </text>
          </g>
        ))}
        <path d={band(doing, all)} className={BANDS[0].className} />
        <path d={band(done, doing)} className={`${BANDS[1].className} transition-all duration-300`} />
        <path d={band(done.map(() => 0), done)} className={BANDS[2].className} />
        <line x1={x(day)} x2={x(day)} y1={PAD.top} y2={H - PAD.bottom} className="stroke-foreground" strokeWidth={1.5} />
        {[1, 6, 11, 16].map((d, k) => (
          <text key={d} x={x(d - 1)} y={H - 8} className="fill-muted text-[10px]">
            тиждень {k + 1}
          </text>
        ))}
      </svg>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
        {BANDS.map((b) => (
          <span key={b.key} className="flex items-center gap-2">
            <svg aria-hidden viewBox="0 0 12 12" className="size-3">
              <rect width={12} height={12} rx={2} className={b.className} />
            </svg>
            {b.name}: <span className="font-semibold tabular-nums text-foreground">{sel[b.key]}</span>
          </span>
        ))}
        <span>день {day + 1}</span>
      </div>

      <p className="mt-4 rounded-[4px] bg-accent-soft p-4 leading-relaxed" aria-live="polite">
        {scenario === "free"
          ? `Без обмеження на 20-й день у роботі вже ${data.at(-1)!.doing} задач: смуга «В роботі» розширюється, бо роботу починають швидше, ніж закінчують. Кожна задача йде все довше.`
          : `З обмеженням у роботі завжди не більше ${LIMIT} задач, і кожна закінчується за кілька днів. Надлишок видно в черзі, де власник продукту може змінити порядок або від чогось відмовитися.`}
      </p>
    </Figure>
  );
}
