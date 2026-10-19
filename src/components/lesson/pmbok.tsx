import type { ReactNode } from "react";
import { Figure } from "./figure";

const ICON_Y = 46;
const BOOK = { x: 255, y: 236, w: 130, h: 54 };

// Simple line icons centred on (x, ICON_Y).
const icons: { label: string; draw: (x: number) => ReactNode }[] = [
  {
    label: "Час",
    draw: (x) => (
      <>
        <circle cx={x} cy={ICON_Y} r={16} />
        <path d={`M${x} ${ICON_Y - 9} V${ICON_Y} L${x + 7} ${ICON_Y + 5}`} />
      </>
    ),
  },
  {
    label: "Вартість",
    draw: (x) => (
      <>
        <circle cx={x} cy={ICON_Y} r={16} />
        <text
          x={x}
          y={ICON_Y + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={18}
          fontWeight={600}
          stroke="none"
          style={{ fill: "var(--foreground)" }}
        >
          $
        </text>
      </>
    ),
  },
  {
    label: "Показники",
    draw: (x) => (
      <path
        d={`M${x - 16} ${ICON_Y + 16} H${x + 16} M${x - 10} ${ICON_Y + 16} V${ICON_Y + 4} M${x} ${ICON_Y + 16} V${ICON_Y - 4} M${x + 10} ${ICON_Y + 16} V${ICON_Y - 12}`}
      />
    ),
  },
  {
    label: "Люди",
    draw: (x) => (
      <>
        <circle cx={x} cy={ICON_Y - 7} r={7} />
        <path d={`M${x - 14} ${ICON_Y + 16} a14 12 0 0 1 28 0`} />
      </>
    ),
  },
  {
    label: "Довкілля",
    draw: (x) => (
      <path
        d={`M${x - 14} ${ICON_Y + 14} C${x - 14} ${ICON_Y - 8} ${x} ${ICON_Y - 16} ${x + 15} ${ICON_Y - 14} C${x + 16} ${ICON_Y + 6} ${x + 2} ${ICON_Y + 16} ${x - 14} ${ICON_Y + 14} Z M${x - 14} ${ICON_Y + 14} L${x + 6} ${ICON_Y - 4}`}
      />
    ),
  },
  {
    label: "Процеси",
    draw: (x) => (
      <>
        <circle cx={x} cy={ICON_Y} r={7} />
        <circle cx={x} cy={ICON_Y} r={14} strokeWidth={6} strokeDasharray="4.4 4.4" />
      </>
    ),
  },
];

const iconX = (i: number) => 70 + i * 100;

export function PmbokOrigin() {
  return (
    <Figure
      title="Уніфікація хаосу: створення PMBOK (1987)"
      lead="Інститут управління проєктами (PMI) синтезує десятиліття розрізнених методів у єдиний фундамент."
      caption="Відтепер дисципліна отримує єдину мову, методологію та теоретичний каркас для управління будь-яким проєктом."
    >
      <svg
        viewBox="0 0 640 310"
        className="h-auto w-full"
        role="img"
        aria-label="Час, вартість, показники, люди, довкілля і процеси сходяться в одну книгу PMBOK"
      >
        <defs>
          <marker
            id="pmbok-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" style={{ fill: "var(--accent)" }} />
          </marker>
        </defs>

        <g fill="none" strokeWidth={1.5} strokeDasharray="3 5" opacity={0.7} style={{ stroke: "var(--accent)" }}>
          {icons.map((_, i) => {
            const x = iconX(i);
            const endX = BOOK.x + 25 + i * 16;
            return (
              <path
                key={i}
                d={`M${x} ${ICON_Y + 44} Q${x} ${BOOK.y - 50} ${endX} ${BOOK.y - 6}`}
                markerEnd="url(#pmbok-arrow)"
              />
            );
          })}
        </g>

        <g fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--foreground)" }}>
          {icons.map((icon, i) => (
            <g key={icon.label}>{icon.draw(iconX(i))}</g>
          ))}
        </g>
        {icons.map((icon, i) => (
          <text
            key={icon.label}
            x={iconX(i)}
            y={ICON_Y + 36}
            textAnchor="middle"
            fontSize={15}
            style={{ fill: "var(--muted)" }}
          >
            {icon.label}
          </text>
        ))}

        <rect
          x={BOOK.x + 6}
          y={BOOK.y + 6}
          width={BOOK.w}
          height={BOOK.h}
          rx={4}
          style={{ fill: "var(--border)" }}
        />
        <rect
          x={BOOK.x}
          y={BOOK.y}
          width={BOOK.w}
          height={BOOK.h}
          rx={4}
          style={{ fill: "var(--foreground)" }}
        />
        <rect
          x={BOOK.x}
          y={BOOK.y}
          width={16}
          height={BOOK.h}
          rx={4}
          style={{ fill: "var(--accent)" }}
        />
        <text
          x={BOOK.x + BOOK.w / 2 + 8}
          y={BOOK.y + BOOK.h / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={18}
          fontWeight={700}
          letterSpacing={2}
          style={{ fill: "var(--background)" }}
        >
          PMBOK
        </text>
      </svg>

      <p className="mx-auto mt-4 max-w-md text-center text-sm text-muted">
        <span className="font-medium text-foreground">
          Project Management Body of Knowledge
        </span>{" "}
        — звід знань з управління проєктами.
      </p>
    </Figure>
  );
}
