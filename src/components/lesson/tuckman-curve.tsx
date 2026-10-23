import { Figure } from "./figure";

const stages = [
  { name: "Формування", x: 60, y: 120, lead: "пояснити мету, ролі й правила" },
  { name: "Шторм", x: 170, y: 175, lead: "переводити суперечки в рішення" },
  { name: "Нормалізація", x: 280, y: 110, lead: "закріпити домовленості" },
  { name: "Продуктивна робота", x: 390, y: 45, lead: "прибирати перешкоди" },
  { name: "Розформування", x: 495, y: 75, lead: "підбити підсумки" },
];

// Team effectiveness over time through Tuckman's stages.
export function TuckmanCurve() {
  const path = `M20,110 C60,105 120,120 170,175 S240,140 280,110 S350,45 390,45 S470,50 520,85`;
  return (
    <Figure
      title="Етапи розвитку команди"
      lead="Ефективність команди падає на шторм і росте, коли з'являються правила."
      caption="Під кожним етапом — що робить керівник. Нова людина в команді частково повертає її до шторму."
    >
      <svg viewBox="0 0 540 220" className="h-auto w-full" role="img" aria-label="Крива ефективності команди: формування, провал на шторм, зростання на нормалізації, вершина на продуктивній роботі, спад на розформуванні">
        <line x1={20} x2={530} y1={200} y2={200} strokeWidth={1} style={{ stroke: "var(--border)" }} />
        <path d={path} fill="none" strokeWidth={3} strokeLinecap="round" style={{ stroke: "var(--accent)" }} />
        {stages.map((s) => (
          <g key={s.name}>
            <circle cx={s.x} cy={s.y} r={6} strokeWidth={2} style={{ fill: "var(--accent)", stroke: "var(--surface)" }} />
            <text x={s.x} y={s.name === "Шторм" ? s.y + 22 : s.y - 14} textAnchor="middle" fontSize={14} fontWeight={600} style={{ fill: "var(--foreground)" }}>
              {s.name}
            </text>
          </g>
        ))}
        <text x={525} y={215} textAnchor="end" fontSize={12} style={{ fill: "var(--muted)" }}>час</text>
      </svg>
      <ol className="mt-3 grid gap-1.5 text-[13px] @xl:grid-cols-5">
        {stages.map((s, i) => (
          <li key={s.name} className="rounded-[3px] border border-border p-2">
            <span className="font-display font-semibold text-accent">{i + 1}.</span> {s.lead}
          </li>
        ))}
      </ol>
    </Figure>
  );
}
