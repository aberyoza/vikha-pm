import { Figure } from "./figure";

// One two-week sprint of the game team: 30 story points planned.
const PLANNED = 30;
const REMAINING = [30, 29, 26, 24, 23, 19, 17, 12, 9, 5, 2];
const DAYS = REMAINING.length - 1;

const W = 420;
const H = 270;
const L = 36;
const R = 16;
const T = 16;
const B = 46;
const x = (d: number) => L + (d / DAYS) * (W - L - R);
const y = (v: number) => T + (1 - v / PLANNED) * (H - T - B);

const actual = REMAINING.map((v, d) => `${x(d)},${y(v)}`).join(" ");

// Sprint burndown: remaining work per day against the ideal line.
export function BurndownChart() {
  const last = REMAINING[DAYS];
  return (
    <Figure
      title="Діаграма згоряння спринту"
      lead="Скільки роботи лишилося на кожен день спринту."
      caption={`Пунктир — ідеальний темп, суцільна лінія — факт. Лінія вище пунктиру означає відставання. Наприкінці спринту лишилося ${last} поінти: їх переносять у наступний спринт, а на ретроспективі розбираються, чому так вийшло.`}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Діаграма згоряння: заплановано ${PLANNED} поінтів на ${DAYS} робочих днів; наприкінці лишилося ${last}`}
      >
        {[0, 10, 20, 30].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} strokeWidth={1} style={{ stroke: "var(--grid)" }} />
            <text x={L - 8} y={y(v)} textAnchor="end" dominantBaseline="central" fontSize={14} style={{ fill: "var(--muted)" }}>
              {v}
            </text>
          </g>
        ))}
        {REMAINING.map((_, d) => (
          <text key={d} x={x(d)} y={H - B + 18} textAnchor="middle" fontSize={14} style={{ fill: "var(--muted)" }}>
            {d}
          </text>
        ))}
        <text x={W - R} y={H - 4} textAnchor="end" fontSize={14} style={{ fill: "var(--muted)" }}>
          день спринту
        </text>
        <line x1={x(0)} y1={y(PLANNED)} x2={x(DAYS)} y2={y(0)} strokeWidth={2} strokeDasharray="6 5" style={{ stroke: "var(--muted)" }} />
        <polyline points={actual} fill="none" strokeWidth={2.5} strokeLinejoin="round" style={{ stroke: "var(--accent)" }} />
        {REMAINING.map((v, d) => (
          <circle key={d} cx={x(d)} cy={y(v)} r={4} strokeWidth={2} style={{ fill: "var(--accent)", stroke: "var(--surface)" }}>
            <title>{`День ${d}: лишилося ${v} поінтів`}</title>
          </circle>
        ))}
      </svg>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-5 bg-accent" /> факт
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="w-5 border-t-2 border-dashed border-muted" /> ідеальний темп
        </span>
      </div>
    </Figure>
  );
}
