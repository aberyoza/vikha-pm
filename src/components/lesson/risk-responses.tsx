import { Figure } from "./figure";

type Strategy = { name: string; idea: string; game: string };

const threats: Strategy[] = [
  {
    name: "Уникнути (уникнення)",
    idea: "змінити план так, щоб загроза зникла",
    game: "не писати власний ігровий рушій, а взяти перевірений готовий",
  },
  {
    name: "Зменшити (пом'якшення)",
    idea: "знизити ймовірність чи збиток; сюди ж — диверсифікація",
    game: "тест навантаження сервера, документація коду",
  },
  {
    name: "Передати (передача)",
    idea: "наслідки бере на себе третя сторона",
    game: "застрахувати техніку студії",
  },
  {
    name: "Прийняти (прийняття)",
    idea: "нічого не робити заздалегідь, але тримати резерв і план дій",
    game: "резерв 30 тис. грн на курс долара й податки",
  },
  {
    name: "Ескалювати (ескалація)",
    idea: "загроза виходить за межі проєкту — рішення ухвалює вище керівництво",
    game: "магазин змінює правила оплати для всіх ігор — вирішують засновники студії",
  },
];

const opportunities: Strategy[] = [
  {
    name: "Використати (використання)",
    idea: "зробити все, щоб нагода точно настала",
    game: "магазин бере в добірку «Нове» ігри, що вийшли до 1 грудня, — фіксуємо реліз до цієї дати",
  },
  {
    name: "Посилити (посилення)",
    idea: "збільшити ймовірність чи вигоду",
    game: "зробити якісний трейлер, щоб підвищити шанс потрапити в добірку",
  },
  {
    name: "Розділити (розподіл)",
    idea: "залучити того, хто скористається нагодою краще",
    game: "відомий стример отримує частку доходу з покупок за його промокодом",
  },
  {
    name: "Прийняти (прийняття)",
    idea: "нічого не робити заздалегідь, але скористатися, якщо настане",
    game: "гра раптом стала популярною в соцмережах — швидко підтримати хвилю",
  },
  {
    name: "Ескалювати (ескалація)",
    idea: "нагода більша за проєкт — рішення ухвалює вище керівництво",
    game: "інша студія хоче купити ігровий рушій — вирішують засновники",
  },
];

function Column({ title, items, tone }: { title: string; items: Strategy[]; tone: string }) {
  return (
    <div>
      <p className="font-display text-lg font-semibold">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((s) => (
          <li key={s.name} className={`rounded-[4px] border p-3 ${tone}`}>
            <p className="font-medium">{s.name}</p>
            <p className="text-[13px] text-muted">{s.idea}</p>
            <p className="mt-1 text-sm">
              <span className="font-medium">У грі: </span>
              {s.game}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Five responses to threats and five to opportunities, with game examples.
export function RiskResponses() {
  return (
    <Figure
      title="Реакції на ризики"
      lead="П'ять реакцій на загрози і п'ять — на нагоди."
      caption="Головне правило: захист не має коштувати дорожче, ніж можливий збиток. Після вибору реакції перевіряють, чи не створює вона нових (вторинних) ризиків і який ризик лишається (залишковий)."
    >
      <div className="grid gap-5 @2xl:grid-cols-2">
        <Column title="Загрози" items={threats} tone="border-border" />
        <Column title="Нагоди" items={opportunities} tone="border-accent/60 bg-accent-soft/40" />
      </div>
    </Figure>
  );
}
