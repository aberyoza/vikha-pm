import { Figure } from "./figure";

const rows = [
  { what: "Підхід до розробки", choice: "гібридний: сервер і реліз — за планом, рівні — спринтами" },
  { what: "Процеси", choice: "без окремого плану закупівель: купують лише ліцензії й сервери" },
  { what: "Документи", choice: "статут на одну сторінку, реєстр ризиків у Google Таблиці" },
  { what: "Зустрічі", choice: "15 хвилин щодня і демо раз на два тижні замість щотижневих звітів" },
  { what: "Інструменти", choice: "дошка задач у Jira, без окремої програми для планування" },
];

// What the game studio tailors and how.
export function TailoringChoices() {
  return (
    <Figure
      title="Як студія адаптувала управління"
      lead="Беремо те, що потрібно, і в тому обсязі, якого вистачає."
      caption="Для будівництва лікарні кожен рядок виглядав би інакше: більше документів, формальніші процеси, жорсткіший контроль."
    >
      <table className="w-full text-left text-sm">
        <thead className="text-[13px] text-muted">
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-3 font-normal">Що адаптують</th>
            <th scope="col" className="py-2 font-normal">Рішення студії</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.what} className="border-b border-border align-top last:border-0">
              <td className="py-2 pr-3 font-medium">{r.what}</td>
              <td className="py-2">{r.choice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Figure>
  );
}
