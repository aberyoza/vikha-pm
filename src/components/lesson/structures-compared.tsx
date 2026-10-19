import { Figure } from "./figure";

type Level = 1 | 2 | 3;
const levelName: Record<Level, string> = { 1: "низька", 2: "середня", 3: "висока" };

const columns = ["Функціональна", "Матрична", "Проєктна"];

// Ratings follow the lesson text: cheapest vs. most expensive, slow vs. fast
// decisions, flexible vs. duplicated resources.
const criteria: { name: string; values: [Level, Level, Level] }[] = [
  { name: "Вартість", values: [1, 2, 3] },
  { name: "Швидкість рішень", values: [1, 2, 3] },
  { name: "Влада керівника проєкту", values: [1, 2, 3] },
  { name: "Гнучкість у використанні людей", values: [3, 3, 1] },
];

function Rating({ level }: { level: Level }) {
  return (
    <span className="flex justify-center gap-1" title={levelName[level]}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          aria-hidden
          className={`size-2.5 rotate-45 rounded-[1px] ${n <= level ? "bg-accent" : "border border-border"}`}
        />
      ))}
      <span className="sr-only">{levelName[level]}</span>
    </span>
  );
}

export function StructuresCompared() {
  return (
    <Figure
      title="Порівняння структур"
      lead="Немає найкращої структури — є компроміс між вартістю, швидкістю й гнучкістю."
    >
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-[13px] text-muted">
            <th className="w-[38%] pb-2 text-left font-normal" />
            {columns.map((c) => (
              <th key={c} className="pb-2 text-center font-normal hyphens-auto">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((c) => (
            <tr key={c.name} className="border-b border-grid last:border-b-0">
              <th scope="row" className="py-3 pr-2 text-left font-medium">
                {c.name}
              </th>
              {c.values.map((v, i) => (
                <td key={columns[i]} className="py-3">
                  <Rating level={v} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 flex items-center gap-2 text-[13px] text-muted">
        <Rating level={1} /> низька
        <span className="ml-3" />
        <Rating level={3} /> висока
      </p>
    </Figure>
  );
}
