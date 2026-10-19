import { Figure } from "./figure";

const C = 160;
const R = 108;
const labels = ["Зміст", "Якість", "Розклад", "Бюджет", "Ресурси", "Ризики"];

// Hexagon vertex i, starting at the top and going clockwise.
const vertex = (i: number, r = R) => {
  const a = (Math.PI / 3) * i - Math.PI / 2;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
};

export function ConstraintsBalance() {
  const points = labels.map((_, i) => vertex(i));
  const outline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <Figure
      title="Шість обмежень"
      lead="Керівник проєкту тримає баланс між усіма параметрами одночасно."
      caption="Зміна одного параметра тягне за собою інші: розширили зміст — зростають бюджет, строки й ризики."
    >
      <svg
        viewBox="0 0 320 320"
        className="mx-auto h-auto w-full max-w-sm"
        role="img"
        aria-label="Шестикутник: у центрі проєкт, на вершинах зміст, якість, розклад, бюджет, ресурси та ризики"
      >
        <polygon
          points={outline}
          fill="none"
          strokeWidth={1.5}
          style={{ stroke: "var(--border)" }}
        />
        {points.map((p, i) => (
          <line
            key={i}
            x1={C}
            y1={C}
            x2={p.x}
            y2={p.y}
            strokeWidth={1.5}
            strokeDasharray="3 4"
            style={{ stroke: "var(--accent)" }}
          />
        ))}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={6}
            strokeWidth={2}
            style={{ fill: "var(--surface)", stroke: "var(--accent)" }}
          />
        ))}
        {labels.map((label, i) => {
          const t = vertex(i, R + 26);
          return (
            <text
              key={label}
              x={t.x}
              y={t.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={15}
              fontWeight={500}
              style={{ fill: "var(--foreground)" }}
            >
              {label}
            </text>
          );
        })}
        <rect
          x={C - 14}
          y={C - 14}
          width={28}
          height={28}
          rx={3}
          transform={`rotate(45 ${C} ${C})`}
          style={{ fill: "var(--accent)" }}
        />
        <text
          x={C}
          y={C + 36}
          textAnchor="middle"
          fontSize={15}
          fontWeight={600}
          strokeWidth={6}
          strokeLinejoin="round"
          paintOrder="stroke"
          style={{ fill: "var(--accent)", stroke: "var(--surface)" }}
        >
          Проєкт
        </text>
      </svg>
    </Figure>
  );
}
