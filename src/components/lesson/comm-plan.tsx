import { Figure } from "./figure";

const rows = [
  { who: "Засновники", what: "прогрес, гроші, ризики", how: "коротка зустріч", when: "щотижня", owner: "керівник проєкту" },
  { who: "Команда", what: "задачі й перешкоди", how: "15 хвилин + дошка задач", when: "щодня", owner: "усі" },
  { who: "Гравці з бета-тесту", what: "нова версія і що змінилося", how: "розсилка", when: "раз на два тижні", owner: "маркетолог" },
  { who: "Банк", what: "виконання умов кредиту", how: "лист", when: "раз на квартал", owner: "засновник" },
  { who: "Спільнота", what: "новини гри", how: "пост у Discord", when: "щотижня", owner: "маркетолог" },
];

// The game's communication plan: what, how, how often and who is responsible.
export function CommPlan() {
  return (
    <Figure
      title="План комунікацій гри"
      lead="Що, кому, як, як часто і хто відповідає."
      caption="План — не бюрократія: він гарантує, що ніхто не дізнається про перенесення релізу з соцмереж."
    >
      <div className="hidden @3xl:block">
        <table className="w-full text-left text-sm">
          <thead className="text-[13px] text-muted">
            <tr className="border-b border-border">
              {["Кому", "Що", "Як", "Як часто", "Хто відповідає"].map((h) => (
                <th key={h} scope="col" className="py-2 pr-3 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.who} className="border-b border-border align-top last:border-0">
                <td className="py-2 pr-3 font-medium">{r.who}</td>
                <td className="py-2 pr-3">{r.what}</td>
                <td className="py-2 pr-3">{r.how}</td>
                <td className="py-2 pr-3">{r.when}</td>
                <td className="py-2 text-muted">{r.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-2 @3xl:hidden">
        {rows.map((r) => (
          <li key={r.who} className="rounded-[4px] border border-border p-3 text-sm">
            <p className="font-medium">{r.who}</p>
            <p className="mt-0.5">{r.what}</p>
            <p className="mt-1 text-[13px] text-muted">
              {r.how}, {r.when}; відповідає {r.owner}
            </p>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
