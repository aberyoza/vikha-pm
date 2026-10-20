import { TASKS, weeks } from "@/content/examples/game-plan";
import { Figure } from "./figure";

// The game's work list: what the network diagram is built from.
export function GamePlanTable() {
  return (
    <Figure title="Роботи гри" lead="Що робити, скільки це триває і після чого можна починати.">
      <table className="w-full text-left text-sm">
        <thead className="text-[13px] text-muted">
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-3 font-normal">
              №
            </th>
            <th scope="col" className="py-2 pr-3 font-normal">
              Робота
            </th>
            <th scope="col" className="py-2 pr-3 font-normal whitespace-nowrap">
              Тривалість
            </th>
            <th scope="col" className="py-2 font-normal whitespace-nowrap">
              Після робіт
            </th>
          </tr>
        </thead>
        <tbody>
          {TASKS.map((t) => (
            <tr key={t.id} className="border-b border-border last:border-0">
              <td className="py-2 pr-3 font-display font-semibold text-accent tabular-nums">{t.id}</td>
              <td className="py-2 pr-3">{t.title}</td>
              <td className="py-2 pr-3 whitespace-nowrap tabular-nums">{weeks(t.weeks)}</td>
              <td className="py-2 tabular-nums">{t.after.length ? t.after.join(", ") : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Figure>
  );
}
