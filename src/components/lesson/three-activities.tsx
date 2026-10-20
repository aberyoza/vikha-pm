import { Figure } from "./figure";

const baskets = [
  {
    name: "Інвестиційний",
    question: "На що створюємо проєкт?",
    items: ["Розробка гри", "Ноутбуки", "Ліцензії"],
  },
  {
    name: "Операційний",
    question: "Як живе проєкт щодня?",
    items: ["Продажі в грі", "Сервери", "Реклама", "Підтримка гравців"],
  },
  {
    name: "Фінансовий",
    question: "Звідки гроші на старт?",
    items: ["Власні гроші", "Кредит", "Інвестор", "Повернення боргу"],
  },
];

export function ThreeActivities() {
  return (
    <Figure title="Три кошики" lead="Усі гроші проєкту ділять на три кошики.">
      <div className="grid gap-3 @xl:grid-cols-3">
        {baskets.map((b) => (
          <div key={b.name} className="rounded-[4px] border border-border p-4">
            <p className="font-display text-lg font-semibold">{b.name}</p>
            <p className="text-sm text-muted">{b.question}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {b.items.map((item) => (
                <li key={item} className="rounded-[3px] bg-background px-2 py-1 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Figure>
  );
}
