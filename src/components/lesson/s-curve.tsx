import { BUDGET, PV_CURVE, WEEKS } from "@/content/examples/game-finance";

// Shared S-curve chart for module 9: planned spending by week, optional
// earned value, actual cost and a forecast line. No hooks, so it can sit
// in server or client figures.

const W = 460;
const H = 260;
const L = 44;
const R = 14;
const T = 14;
const B = 40;
const MAX = 320;

export const x = (w: number, weeks = 15) => L + (w / weeks) * (W - L - R);
export const y = (v: number) => T + (1 - v / MAX) * (H - T - B);

type Series = { values: number[]; tone: "plan" | "ev" | "ac" };

const tones = {
  plan: { stroke: "var(--muted)", dash: undefined, width: 2 },
  ev: { stroke: "var(--sage)", dash: undefined, width: 2.5 },
  ac: { stroke: "var(--accent)", dash: undefined, width: 2.5 },
} as const;

export function SCurve({
  label,
  series = [],
  forecast,
  marker,
  points = [],
}: {
  label: string;
  series?: Series[];
  forecast?: { from: [number, number]; to: [number, number] };
  marker?: number;
  points?: { w: number; v: number; tone: "plan" | "ev" | "ac" }[];
}) {
  const weeks = 15;
  const line = (vals: number[]) => vals.map((v, w) => `${x(w, weeks)},${y(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={label}>
      {[0, 100, 200, 300].map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} strokeWidth={1} style={{ stroke: "var(--grid)" }} />
          <text x={L - 8} y={y(v)} textAnchor="end" dominantBaseline="central" fontSize={13} style={{ fill: "var(--muted)" }}>
            {v}
          </text>
        </g>
      ))}
      <line x1={L} x2={W - R} y1={y(BUDGET)} y2={y(BUDGET)} strokeWidth={1.5} strokeDasharray="2 4" style={{ stroke: "var(--foreground)" }} />
      <text x={W - R} y={y(BUDGET) - 6} textAnchor="end" fontSize={12} style={{ fill: "var(--muted)" }}>
        бюджет з резервом
      </text>
      {[0, 4, 8, 12].map((w) => (
        <text key={w} x={x(w, weeks)} y={H - B + 18} textAnchor="middle" fontSize={13} style={{ fill: "var(--muted)" }}>
          {w}
        </text>
      ))}
      <text x={W - R} y={H - 4} textAnchor="end" fontSize={12} style={{ fill: "var(--muted)" }}>
        тижні
      </text>
      {marker !== undefined && (
        <line x1={x(marker, weeks)} x2={x(marker, weeks)} y1={T} y2={H - B} strokeWidth={1} style={{ stroke: "var(--border)" }} />
      )}
      <polyline points={line(PV_CURVE)} fill="none" strokeWidth={2} strokeDasharray="6 4" style={{ stroke: "var(--muted)" }} />
      {series.map((s) => (
        <polyline
          key={s.tone}
          points={line(s.values)}
          fill="none"
          strokeWidth={tones[s.tone].width}
          strokeLinejoin="round"
          style={{ stroke: tones[s.tone].stroke }}
        />
      ))}
      {forecast && (
        <line
          x1={x(forecast.from[0], weeks)}
          y1={y(forecast.from[1])}
          x2={x(forecast.to[0], weeks)}
          y2={y(forecast.to[1])}
          strokeWidth={2.5}
          strokeDasharray="4 4"
          style={{ stroke: "var(--accent)" }}
        />
      )}
      {points.map((p) => (
        <circle
          key={p.tone}
          cx={x(p.w, weeks)}
          cy={y(p.v)}
          r={5}
          strokeWidth={2}
          style={{ fill: tones[p.tone].stroke, stroke: "var(--surface)" }}
        />
      ))}
      <text x={x(WEEKS, weeks) + 4} y={y(PV_CURVE[WEEKS]) + 14} fontSize={12} style={{ fill: "var(--muted)" }}>
        план
      </text>
    </svg>
  );
}

export function Legend({ items }: { items: { tone: "plan" | "ev" | "ac" | "forecast"; label: string }[] }) {
  const swatch = {
    plan: "w-5 border-t-2 border-dashed border-muted",
    ev: "h-0.5 w-5 bg-sage",
    ac: "h-0.5 w-5 bg-accent",
    forecast: "w-5 border-t-2 border-dashed border-accent",
  } as const;
  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-2">
          <span aria-hidden className={swatch[i.tone]} /> {i.label}
        </span>
      ))}
    </div>
  );
}
