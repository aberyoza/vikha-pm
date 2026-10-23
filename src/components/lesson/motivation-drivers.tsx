import { Figure } from "./figure";

const CENTER = { x: 180, y: 165, r: 52 };
const BOX = { w: 140, h: 58 };
const GAP = 4;

// Box centres sit at the same distance from the circle, so the arrows match.
const drivers = [
  { n: 1, name: "Автономія", hint: "що, коли, як і з ким", x: 80, y: 45 },
  { n: 2, name: "Майстерність", hint: "росте у своїй справі", x: 280, y: 45 },
  { n: 3, name: "Мета", hint: "знає, навіщо робота", x: 180, y: 310 },
].map((d) => {
  // Arrow on the line from the box centre to the circle centre: it starts
  // where that line leaves the box and stops at the circle.
  const dx = CENTER.x - d.x;
  const dy = CENTER.y - d.y;
  const len = Math.hypot(dx, dy);
  const [ux, uy] = [dx / len, dy / len];
  const exit = Math.min(ux ? BOX.w / 2 / Math.abs(ux) : Infinity, uy ? BOX.h / 2 / Math.abs(uy) : Infinity);
  const from = [d.x + ux * (exit + GAP), d.y + uy * (exit + GAP)];
  const to = [CENTER.x - ux * (CENTER.r + GAP), CENTER.y - uy * (CENTER.r + GAP)];
  return { ...d, path: `M${from[0].toFixed(1)} ${from[1].toFixed(1)} L${to[0].toFixed(1)} ${to[1].toFixed(1)}` };
});

// Three intrinsic drivers feed motivation; dots run from each driver to the centre.
export function MotivationDrivers() {
  return (
    <Figure
      title="Внутрішня мотивація"
      lead="Три речі, які змушують людину старатися без премій."
      caption="Мотиватори працюють, коли оплата справедлива і людина не думає про гроші."
    >
      <svg viewBox="0 0 360 350" className="mx-auto w-full max-w-md" role="img" aria-label="Автономія, майстерність і мета ведуть до мотивації">
        <defs>
          <marker id="motivation-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-accent" />
          </marker>
        </defs>

        {drivers.map((d, i) => (
          <g key={d.n}>
            <path
              d={d.path}
              strokeWidth={2}
              strokeDasharray="6 6"
              markerEnd="url(#motivation-arrow)"
              className="fill-none stroke-accent animate-dash"
            />
            <circle r={4} className="fill-accent motion-reduce:hidden" opacity={0}>
              <animateMotion path={d.path} dur="1.8s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="1.8s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        <circle cx={CENTER.x} cy={CENTER.y} r={CENTER.r} className="fill-accent-soft stroke-accent" strokeWidth={2} />
        <text x={CENTER.x} y={CENTER.y + 6} textAnchor="middle" className="fill-foreground font-display text-[17px] font-semibold">
          Мотивація
        </text>

        {drivers.map((d) => (
          <g key={d.n}>
            <rect x={d.x - BOX.w / 2} y={d.y - BOX.h / 2} width={BOX.w} height={BOX.h} rx={4} className="fill-surface-raised stroke-border" />
            <text x={d.x} y={d.y - 4} textAnchor="middle" className="fill-foreground text-[15px] font-medium">
              {d.n}. {d.name}
            </text>
            <text x={d.x} y={d.y + 15} textAnchor="middle" className="fill-muted text-[12px]">
              {d.hint}
            </text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}
