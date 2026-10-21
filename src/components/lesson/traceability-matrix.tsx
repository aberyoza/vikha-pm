import { TRACE } from "@/content/examples/game-scope";
import { Figure } from "./figure";

const cols = [
  { key: "need", name: "Бізнес-потреба" },
  { key: "requirement", name: "Вимога" },
  { key: "wbs", name: "Елемент WBS" },
  { key: "check", name: "Як перевіримо" },
] as const;

// Requirements traceability matrix: each requirement linked from the
// business need to the WBS element and the acceptance check.
export function TraceabilityMatrix() {
  return (
    <Figure
      title="Матриця відстеження вимог"
      lead="Кожна вимога пов'язана з потребою, з якої виросла, і з роботою, яка її виконає."
      caption="Якщо вимога не прив'язана до жодної роботи у WBS, її забудуть. Якщо робота не прив'язана до жодної вимоги, можливо, вона зайва."
    >
      <div className="hidden @3xl:block">
        <table className="w-full text-left text-sm">
          <thead className="text-[13px] text-muted">
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-3 font-normal">ID</th>
              {cols.map((c) => (
                <th key={c.key} scope="col" className="py-2 pr-3 font-normal">
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRACE.map((r) => (
              <tr key={r.id} className="border-b border-border align-top last:border-0">
                <td className="py-2.5 pr-3 font-display font-semibold whitespace-nowrap text-accent">{r.id}</td>
                {cols.map((c) => (
                  <td key={c.key} className={`py-2.5 pr-3 ${c.key === "wbs" ? "whitespace-nowrap tabular-nums" : ""}`}>
                    {r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-3 @3xl:hidden">
        {TRACE.map((r) => (
          <li key={r.id} className="rounded-[4px] border border-border p-4 text-sm">
            <p className="font-medium">
              <span className="font-display text-accent">{r.id}</span> {r.requirement}
            </p>
            <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-[13px]">
              {cols
                .filter((c) => c.key !== "requirement")
                .map((c) => (
                  <div key={c.key} className="contents">
                    <dt className="text-muted">{c.name}</dt>
                    <dd>{r[c.key]}</dd>
                  </div>
                ))}
            </dl>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
