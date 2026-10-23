import { TASKS } from "@/content/examples/game-plan";
import { BAC, BUDGET, CONTINGENCY, COSTS } from "@/content/examples/game-finance";
import { Figure } from "./figure";

// The game's budget: cost estimates per task plus the contingency reserve.
export function BudgetTable() {
  return (
    <Figure
      title="Бюджет гри"
      lead="Кошториси робіт і резерв складаються в бюджет проєкту."
      caption="Управлінський резерв засновників сюди не входить: керівник проєкту не може витратити його сам."
    >
      <table className="w-full text-left text-sm">
        <thead className="text-[13px] text-muted">
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-3 font-normal">Робота</th>
            <th scope="col" className="py-2 text-right font-normal">Кошторис, тис. грн</th>
          </tr>
        </thead>
        <tbody>
          {TASKS.map((t) => (
            <tr key={t.id} className="border-b border-border">
              <td className="py-1.5 pr-3">{t.name}</td>
              <td className="py-1.5 text-right tabular-nums">{COSTS[t.id]}</td>
            </tr>
          ))}
          <tr className="border-b border-border font-medium">
            <td className="py-1.5 pr-3">Роботи разом</td>
            <td className="py-1.5 text-right tabular-nums">{BAC}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-1.5 pr-3">Резерв на відомі ризики</td>
            <td className="py-1.5 text-right tabular-nums">{CONTINGENCY}</td>
          </tr>
          <tr className="font-display font-semibold text-accent">
            <td className="py-2 pr-3">Бюджет проєкту</td>
            <td className="py-2 text-right tabular-nums">{BUDGET}</td>
          </tr>
        </tbody>
      </table>
    </Figure>
  );
}
