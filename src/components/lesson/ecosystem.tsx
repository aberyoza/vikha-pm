import { Figure } from "./figure";

const C = 200;

// Bottom half of a circle, drawn left to right so text along it stays upright.
const bottomArc = (r: number) =>
  `M ${C - r} ${C} A ${r} ${r} 0 0 0 ${C + r} ${C}`;

const outerRings = [
  { r: 190, label: "Фінансова екосистема" },
  { r: 158, label: "Екологія" },
  { r: 126, label: "Соціальний вплив" },
];

const notes = [
  "Проєкти перестають бути ізольованими операціями — тепер це інтегровані компоненти суспільства.",
  "Менеджери змушені враховувати соціальні, екологічні та зовнішні фінансові наслідки.",
  "Математика реалізації ускладнюється в геометричній прогресії.",
];

export function Ecosystem() {
  return (
    <Figure
      title="Третій вимір складності: екосистемний підхід"
      lead="У 1970-х роках Світовий банк починає активно застосовувати управління проєктами, назавжди змінюючи масштаб дисципліни."
    >
      <div className="grid items-center gap-8 @2xl:grid-cols-[1fr_220px]">
        <svg
          viewBox="0 0 400 400"
          className="mx-auto h-auto w-full max-w-sm"
          role="img"
          aria-label="Концентричні кола: у центрі проєкт, навколо команда та вартість, далі соціальний вплив, екологія і фінансова екосистема"
        >
          <defs>
            {outerRings.map(({ r }) => (
              <path key={r} id={`eco-arc-${r}`} d={bottomArc(r - 7)} />
            ))}
            <path id="eco-arc-core" d={bottomArc(87)} />
          </defs>

          {outerRings.map(({ r, label }) => (
            <g key={r}>
              <circle
                cx={C}
                cy={C}
                r={r}
                fill="none"
                strokeWidth={1.25}
                strokeDasharray="4 5"
                style={{ stroke: "var(--muted)" }}
              />
              <text fontSize={15} style={{ fill: "var(--muted)" }}>
                <textPath
                  href={`#eco-arc-${r}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {label}
                </textPath>
              </text>
            </g>
          ))}

          <circle
            cx={C}
            cy={C}
            r={82}
            fill="none"
            strokeWidth={34}
            style={{ stroke: "var(--muted)" }}
          />
          <text fontSize={13} fontWeight={500} style={{ fill: "var(--surface)" }}>
            <textPath href="#eco-arc-core" startOffset="50%" textAnchor="middle">
              Команда та вартість
            </textPath>
          </text>

          <circle cx={C} cy={C - 8} r={24} style={{ fill: "var(--accent)" }} />
          <text
            x={C}
            y={C + 36}
            textAnchor="middle"
            fontSize={15}
            fontWeight={600}
            style={{ fill: "var(--accent)" }}
          >
            Проєкт
          </text>
        </svg>

        <ul className="space-y-4 text-sm leading-relaxed">
          {notes.map((note) => (
            <li key={note} className="border-l-2 border-accent pl-4">
              {note}
            </li>
          ))}
        </ul>
      </div>
    </Figure>
  );
}
