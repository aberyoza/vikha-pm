import type { ReactNode } from "react";
import { Figure } from "./figure";

const line = { stroke: "var(--muted)" };
const text = { fill: "var(--foreground)" };

function Box({ x, y, w = 40, label, dashed = false }: { x: number; y: number; w?: number; label: string; dashed?: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={24}
        rx={3}
        strokeWidth={1.5}
        strokeDasharray={dashed ? "4 3" : undefined}
        style={{ fill: "var(--surface)", stroke: "var(--border)" }}
      />
      <text x={x + w / 2} y={y + 12.5} textAnchor="middle" dominantBaseline="central" fontSize={12} style={text}>
        {label}
      </text>
    </g>
  );
}

const Arrow = ({ d, dashed = false }: { d: string; dashed?: boolean }) => (
  <path
    d={d}
    fill="none"
    strokeWidth={1.5}
    strokeDasharray={dashed ? "4 3" : undefined}
    markerEnd="url(#nr-arrow)"
    style={line}
  />
);

const Cross = ({ x, y }: { x: number; y: number }) => (
  <g strokeWidth={2.5} strokeLinecap="round" style={{ stroke: "var(--accent)" }}>
    <line x1={x - 6} y1={y - 6} x2={x + 6} y2={y + 6} />
    <line x1={x + 6} y1={y - 6} x2={x - 6} y2={y + 6} />
  </g>
);

const rules: { title: string; text: string; ok: boolean; svg: ReactNode }[] = [
  {
    title: "Зліва направо",
    text: "Стрілки йдуть лише в один бік — від початку проєкту до кінця.",
    ok: true,
    svg: (
      <>
        <Box x={8} y={20} label="А" />
        <Box x={80} y={20} label="Б" />
        <Box x={152} y={20} label="В" />
        <Arrow d="M48,32 L78,32" />
        <Arrow d="M120,32 L150,32" />
      </>
    ),
  },
  {
    title: "Унікальні номери",
    text: "У кожної роботи свій номер, і в наступних він більший, ніж у попередніх.",
    ok: true,
    svg: (
      <>
        <Box x={8} y={20} label="1" />
        <Box x={80} y={20} label="2" />
        <Box x={152} y={20} label="5" />
        <Arrow d="M48,32 L78,32" />
        <Arrow d="M120,32 L150,32" />
      </>
    ),
  },
  {
    title: "Без циклів",
    text: "Не можна повернутися від наступної роботи до попередньої.",
    ok: false,
    svg: (
      <>
        <Box x={30} y={30} label="А" />
        <Box x={130} y={30} label="Б" />
        <Arrow d="M70,42 L128,42" />
        <Arrow d="M150,28 C150,6 50,6 50,26" dashed />
        <Cross x={100} y={12} />
      </>
    ),
  },
  {
    title: "Без умовних переходів",
    text: "«Якщо… то…» на графіку немає: лише роботи, які точно буде виконано.",
    ok: false,
    svg: (
      <>
        <Box x={8} y={20} label="А" />
        <path d="M84,32 L100,18 L116,32 L100,46 z" strokeWidth={1.5} style={{ fill: "var(--surface)", stroke: "var(--border)" }} />
        <text x={100} y={32.5} textAnchor="middle" dominantBaseline="central" fontSize={12} style={text}>
          ?
        </text>
        <Box x={152} y={2} label="Б" dashed />
        <Box x={152} y={38} label="В" dashed />
        <Arrow d="M48,32 L82,32" />
        <Arrow d="M116,32 L150,14" dashed />
        <Arrow d="M116,32 L150,50" dashed />
        <Cross x={134} y={32} />
      </>
    ),
  },
  {
    title: "Один старт і один фініш",
    text: "Якщо проєкт починається кількома роботами, додаємо фіктивну роботу «Старт» тривалістю 0. Так само з фінішем.",
    ok: true,
    svg: (
      <>
        <Box x={2} y={20} w={46} label="Старт" />
        <Box x={78} y={2} label="А" />
        <Box x={78} y={38} label="Б" />
        <Box x={148} y={20} w={46} label="Фініш" />
        <Arrow d="M48,32 L76,14" />
        <Arrow d="M48,32 L76,50" />
        <Arrow d="M118,14 L146,30" />
        <Arrow d="M118,50 L146,34" />
      </>
    ),
  },
];

// The five rules for drawing a network diagram, each with a tiny example.
export function NetworkRules() {
  return (
    <Figure title="П'ять правил мережевого графіка" lead="Що можна і чого не можна на схемі.">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <marker
            id="nr-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" style={{ fill: "var(--muted)" }} />
          </marker>
        </defs>
      </svg>
      <ol className="grid gap-3 @xl:grid-cols-2 @4xl:grid-cols-3">
        {rules.map((r, i) => (
          <li key={r.title} className="rounded-[4px] border border-border p-4">
            <p className="font-medium">
              <span className="font-display text-accent">{i + 1}.</span> {r.title}
            </p>
            <svg viewBox="0 0 200 64" className="mt-3 h-auto w-full max-w-[260px]" aria-hidden>
              {r.svg}
            </svg>
            <p className="mt-2 text-[13px] font-medium">
              {r.ok ? "Так правильно" : "Так не можна"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{r.text}</p>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
