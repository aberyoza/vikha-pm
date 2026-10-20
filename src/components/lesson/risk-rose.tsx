import { RISKS } from "@/content/examples/game-risks";
import { Figure } from "./figure";

const WIDTH = 460;
const HEIGHT = 320;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const R = 105;
const LEVELS = 5;

const point = (i: number, value: number) => {
  const angle = -Math.PI / 2 + (i / RISKS.length) * Math.PI * 2;
  const r = (value / LEVELS) * R;
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)] as const;
};

// "Risk rose": each ray is a risk, the further out, the more dangerous.
export function RiskRose() {
  const shape = RISKS.map((r, i) => point(i, r.danger).join(",")).join(" ");

  return (
    <Figure
      title="«Роза» ризиків гри"
      lead="На кожному промені — оцінка небезпеки ризику від 1 до 5."
      caption="Що далі від центру точка, то небезпечніший ризик. Оцінки поставили експерти — у нашому прикладі сама команда студії."
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mx-auto h-auto w-full max-w-[480px]"
        role="img"
        aria-label={`Роза ризиків: ${RISKS.map((r) => `${r.short} — ${r.danger} з 5`).join(", ")}`}
      >
        {Array.from({ length: LEVELS }, (_, l) => (
          <polygon
            key={l}
            points={RISKS.map((_, i) => point(i, l + 1).join(",")).join(" ")}
            fill="none"
            strokeWidth={1}
            style={{ stroke: "var(--border)" }}
          />
        ))}
        {RISKS.map((r, i) => {
          const [x, y] = point(i, LEVELS);
          return <line key={r.key} x1={CX} y1={CY} x2={x} y2={y} strokeWidth={1} style={{ stroke: "var(--border)" }} />;
        })}
        <polygon
          points={shape}
          strokeWidth={2}
          strokeLinejoin="round"
          style={{ fill: "var(--accent)", fillOpacity: 0.25, stroke: "var(--accent)" }}
        />
        {RISKS.map((r, i) => {
          const [x, y] = point(i, r.danger);
          const [lx, ly] = point(i, LEVELS + 0.95);
          return (
            <g key={r.key}>
              <circle cx={x} cy={y} r={4.5} strokeWidth={2} style={{ fill: "var(--accent)", stroke: "var(--surface)" }} />
              <text
                x={lx}
                y={ly}
                textAnchor={Math.abs(lx - CX) < 8 ? "middle" : lx > CX ? "start" : "end"}
                dominantBaseline="central"
                fontSize={16}
                style={{ fill: "var(--foreground)" }}
              >
                {r.short}{" "}
                <tspan fontWeight={600} style={{ fill: "var(--accent)" }}>
                  {r.danger}
                </tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}
