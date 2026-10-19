import { Figure } from "./figure";

type Point = { x: number; y: number; r: number };

const node = (x: number, y: number, r = 13): Point => ({ x, y, r });

const start = node(50, 150, 32);
const finish = node(590, 150, 32);

const critical = [
  start,
  node(140, 150),
  node(225, 150),
  node(310, 150),
  node(395, 150),
  node(480, 150),
  finish,
];

// Two parallel branches (top and bottom) that have slack.
function branch(y: number, spread: number) {
  const n = [
    node(140, y),
    node(230, y),
    node(320, y - spread),
    node(320, y + spread),
    node(410, y),
    node(500, y),
  ];
  const edges: [Point, Point][] = [
    [start, n[0]],
    [n[0], n[1]],
    [n[1], n[2]],
    [n[1], n[3]],
    [n[2], n[4]],
    [n[3], n[4]],
    [n[4], n[5]],
    [n[5], finish],
  ];
  return { nodes: n, edges };
}

const top = branch(60, 25);
const bottom = branch(240, 25);

// Line between two circles, trimmed so the arrow tip touches the target.
function edge(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: a.x + ux * a.r,
    y1: a.y + uy * a.r,
    x2: b.x - ux * (b.r + 2),
    y2: b.y - uy * (b.r + 2),
  };
}

const muted = { stroke: "var(--muted)" };
const accent = { stroke: "var(--accent)" };

export function CriticalPath() {
  const parallelEdges = [...top.edges, ...bottom.edges];
  const criticalEdges = critical.slice(1).map((b, i) => [critical[i], b]);

  return (
    <Figure
      title="Перший вимір складності: підкорення часу"
      lead="До 1960-х років головним обмеженням вважався час. Мета — знайти найкоротший шлях до виконання всіх необхідних робіт."
      caption="Впровадження методів мережевого планування дозволило скоротити терміни реалізації багаторічних проєктів на роки."
    >
      <svg
        viewBox="0 0 640 300"
        className="h-auto w-full"
        role="img"
        aria-label="Мережевий графік: від старту до фінішу ведуть кілька паралельних гілок робіт, одна з них виділена як критичний шлях"
      >
        <defs>
          <marker
            id="cp-arrow-muted"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" style={{ fill: "var(--muted)" }} />
          </marker>
          <marker
            id="cp-arrow-accent"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="12"
            markerHeight="12"
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" style={{ fill: "var(--accent)" }} />
          </marker>
        </defs>

        <g style={muted} strokeWidth={1.5} opacity={0.6}>
          {parallelEdges.map(([a, b], i) => (
            <line key={i} {...edge(a, b)} markerEnd="url(#cp-arrow-muted)" />
          ))}
        </g>
        <g style={muted} strokeWidth={1.5}>
          {[...top.nodes, ...bottom.nodes].map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} style={{ fill: "var(--surface)" }} />
          ))}
        </g>

        <g style={accent} strokeWidth={4} strokeLinecap="round">
          {criticalEdges.map(([a, b], i) => (
            <line key={i} {...edge(a, b)} markerEnd="url(#cp-arrow-accent)" />
          ))}
        </g>
        <g style={accent} strokeWidth={3}>
          {critical.slice(1, -1).map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} style={{ fill: "var(--surface)" }} />
          ))}
        </g>

        {[
          { p: start, label: "Старт" },
          { p: finish, label: "Фініш" },
        ].map(({ p, label }) => (
          <g key={label}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.r}
              strokeWidth={2}
              style={{ stroke: "var(--foreground)", fill: "var(--surface)" }}
            />
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={16}
              fontWeight={600}
              style={{ fill: "var(--foreground)" }}
            >
              {label}
            </text>
          </g>
        ))}
      </svg>

      <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <li className="flex items-start gap-3">
          <span className="mt-2 h-1 w-6 shrink-0 rounded-full bg-accent" />
          <span>
            <strong className="font-medium">Критичний шлях</strong> —
            послідовність робіт без права на затримку.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="mt-2 h-0.5 w-6 shrink-0 rounded-full bg-muted opacity-60" />
          <span>
            <strong className="font-medium">Паралельні роботи</strong> мають
            резерв часу.
          </span>
        </li>
      </ul>
    </Figure>
  );
}
