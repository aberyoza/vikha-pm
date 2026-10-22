import { Figure } from "./figure";

const rows = [
  { decision: "Перенести дату релізу", who: "Засновники" },
  { decision: "Збільшити бюджет", who: "Засновники" },
  { decision: "Витратити до 10 тис. грн із резерву", who: "Керівник проєкту" },
  { decision: "Зсунути роботу в межах тижня", who: "Керівник проєкту" },
  { decision: "Що робити в наступному спринті", who: "Власник продукту" },
  { decision: "Яку бібліотеку взяти для анімацій", who: "Команда" },
];

// Who decides what in the game studio.
export function DecisionRights() {
  return (
    <Figure
      title="Хто що вирішує в студії"
      lead="Межі рішень, записані до того, як виникла суперечка."
      caption="Керівник проєкту отримав свої повноваження в статуті (модуль 4). Усе, що їх перевищує, він передає засновникам."
    >
      <table className="w-full text-left text-sm">
        <thead className="text-[13px] text-muted">
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-3 font-normal">Рішення</th>
            <th scope="col" className="py-2 font-normal">Хто вирішує</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.decision} className="border-b border-border align-top last:border-0">
              <td className="py-2 pr-3">{r.decision}</td>
              <td className="py-2 font-medium">{r.who}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Figure>
  );
}
