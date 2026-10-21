import { Figure } from "./figure";

const steps = [
  { name: "Портфель", note: "усі ініціативи студії, між якими ділять гроші й людей", game: "гра, оновлення старої гри, сайт студії" },
  { name: "Програма", note: "кілька пов'язаних проєктів, якими керують разом", game: "гра + YouTube-канал + спільнота гравців" },
  { name: "Проєкт", note: "тимчасова робота заради унікального результату", game: "створити й випустити гру" },
  { name: "Результати (доробки)", note: "те, що проєкт створює", game: "гра в магазинах застосунків" },
  { name: "Наслідки", note: "що змінюється, коли результатом користуються", game: "люди грають і купують персонажів" },
  { name: "Вигоди і цінність", note: "користь для організації й людей", game: "студія заробляє, гравці отримують задоволення" },
];

// Value delivery: from the portfolio down to the project and on to value.
export function ValueChain() {
  return (
    <Figure
      title="Як проєкт створює цінність"
      lead="Проєкт — лише ланка в ланцюжку від стратегії до користі."
      caption="Гру можна випустити вчасно і в бюджет, але якщо в неї ніхто не грає, цінності немає. Тому успіх проєкту вимірюють не лише результатом, а й вигодами."
    >
      <ol className="space-y-1.5">
        {steps.map((s, i) => (
          <li key={s.name}>
            <div
              className={`grid gap-1 rounded-[4px] border p-3 @xl:grid-cols-[11rem_minmax(0,1fr)] @xl:gap-4 ${
                i === 2 ? "border-accent bg-accent-soft/60" : "border-border"
              }`}
            >
              <p className="font-medium">{s.name}</p>
              <div>
                <p className="text-[13px] text-muted">{s.note}</p>
                <p className="text-sm">
                  <span className="font-medium">У студії: </span>
                  {s.game}
                </p>
              </div>
            </div>
            {i < steps.length - 1 && <span aria-hidden className="mx-auto block h-1.5 w-0.5 bg-border" />}
          </li>
        ))}
      </ol>
    </Figure>
  );
}
