import { Figure } from "./figure";

// Three intrinsic drivers feed motivation; the arrows run toward the centre.
const drivers = [
  { n: 1, name: "Автономія", hint: "що, коли, як і з ким", x: 10, y: 10, from: [95, 70], to: [142, 114] },
  { n: 2, name: "Майстерність", hint: "росте у своїй справі", x: 210, y: 10, from: [265, 70], to: [218, 114] },
  { n: 3, name: "Мета", hint: "знає, навіщо робота", x: 110, y: 252, from: [180, 250], to: [180, 220] },
];

export function MotivationDrivers() {
  return (
    <Figure
      title="Внутрішня мотивація"
      lead="Три речі, які змушують людину старатися без премій."
      caption="Мотиватори працюють, коли оплата справедлива і людина не думає про гроші."
    >
      <svg viewBox="0 0 360 320" className="mx-auto w-full max-w-md" role="img" aria-label="Автономія, майстерність і мета ведуть до мотивації">
        <defs>
          <marker id="motivation-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-accent" />
          </marker>
        </defs>

        {drivers.map((d) => (
          <line
            key={d.n}
            x1={d.from[0]}
            y1={d.from[1]}
            x2={d.to[0]}
            y2={d.to[1]}
            strokeWidth={2}
            strokeDasharray="6 6"
            markerEnd="url(#motivation-arrow)"
            className="stroke-accent animate-dash"
          />
        ))}

        <circle cx={180} cy={160} r={52} className="fill-accent-soft stroke-accent" strokeWidth={2} />
        <text x={180} y={166} textAnchor="middle" className="fill-foreground font-display text-[17px] font-semibold">
          Мотивація
        </text>

        {drivers.map((d) => (
          <g key={d.n}>
            <rect x={d.x} y={d.y} width={140} height={58} rx={4} className="fill-surface-raised stroke-border" />
            <text x={d.x + 70} y={d.y + 25} textAnchor="middle" className="fill-foreground text-[15px] font-medium">
              {d.n}. {d.name}
            </text>
            <text x={d.x + 70} y={d.y + 44} textAnchor="middle" className="fill-muted text-[12px]">
              {d.hint}
            </text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}
