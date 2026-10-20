import { RESPONSE_LABEL, RISKS, STATUS_LABEL, priority, score } from "@/content/examples/game-risks";
import { Figure } from "./figure";

const rows = [...RISKS].sort((a, b) => score(b) - score(a));

const level = (r: (typeof RISKS)[number]) => {
  const p = priority(r);
  return p === "високий" ? "border-accent bg-accent text-accent-foreground" : p === "середній" ? "border-accent text-accent" : "border-border text-muted";
};

// The game's risk register as an IT team keeps it: one row per risk,
// sorted by priority, with an owner, a trigger and a status.
export function RiskLog() {
  return (
    <Figure
      title="Реєстр ризиків гри"
      lead="Одна таблиця, яку команда переглядає щотижня."
      caption="Пріоритет = імовірність × вплив, обидва за шкалою від 1 до 5. Від 12 — високий, від 6 — середній. Тригер — ознака, що ризик ось-ось станеться."
    >
      {/* Wide: a table */}
      <div className="hidden @4xl:block">
        <table className="w-full text-left text-sm">
          <thead className="text-[13px] text-muted">
            <tr className="border-b border-border">
              {["ID", "Ризик і тригер", "Імовірність", "Вплив", "Пріоритет", "Власник", "Реакція", "Статус"].map((h) => (
                <th key={h} scope="col" className="py-2 pr-3 align-bottom font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-b border-border align-top last:border-0">
                <td className="py-3 pr-3 font-display font-semibold whitespace-nowrap text-accent">R-{RISKS.indexOf(r) + 1}</td>
                <td className="py-3 pr-3">
                  <span className="font-medium">{r.name}</span>
                  <span className="mt-0.5 block text-[13px] text-muted">Тригер: {r.trigger}</span>
                </td>
                <td className="py-3 pr-3 tabular-nums">{r.probability}</td>
                <td className="py-3 pr-3 tabular-nums">{r.impact}</td>
                <td className="py-3 pr-3">
                  <span className={`inline-block rounded-[3px] border px-1.5 py-0.5 text-[12px] whitespace-nowrap tabular-nums ${level(r)}`}>
                    {score(r)} — {priority(r)}
                  </span>
                </td>
                <td className="py-3 pr-3">{r.owner}</td>
                <td className="py-3 pr-3">{RESPONSE_LABEL[r.response]}</td>
                <td className="py-3">{STATUS_LABEL[r.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Narrow: a card per risk */}
      <ul className="space-y-3 @4xl:hidden">
        {rows.map((r) => (
          <li key={r.key} className="rounded-[4px] border border-border p-4 text-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium">
                <span className="font-display text-accent">R-{RISKS.indexOf(r) + 1}</span> {r.name}
              </p>
              <span className={`shrink-0 rounded-[3px] border px-1.5 py-0.5 text-[12px] tabular-nums ${level(r)}`}>
                {score(r)} — {priority(r)}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-muted">Тригер: {r.trigger}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[13px]">
              <dt className="text-muted">Імовірність × вплив</dt>
              <dd className="tabular-nums">
                {r.probability} × {r.impact}
              </dd>
              <dt className="text-muted">Власник</dt>
              <dd>{r.owner}</dd>
              <dt className="text-muted">Реакція</dt>
              <dd>{RESPONSE_LABEL[r.response]}</dd>
              <dt className="text-muted">Статус</dt>
              <dd>{STATUS_LABEL[r.status]}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
