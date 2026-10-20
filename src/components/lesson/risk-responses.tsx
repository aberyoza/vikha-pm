import { Figure } from "./figure";

const strategies = [
  {
    name: "Уникнути",
    idea: "змінити план так, щоб ризик зник: відмовитися від ризикованої технології чи ринку",
    game: "не писати власний ігровий рушій, а взяти перевірений готовий",
  },
  {
    name: "Зменшити",
    idea: "знизити ймовірність чи збиток; сюди ж — диверсифікація і розподіл ризику між учасниками",
    game: "тест навантаження сервера, документація коду, вихід одразу в App Store і Google Play",
  },
  {
    name: "Передати",
    idea: "перекласти наслідки на того, хто впорається краще: страховика, підрядника, партнера",
    game: "застрахувати техніку студії; видавець бере на себе витрати на рекламу",
  },
  {
    name: "Прийняти",
    idea: "свідомо нічого не робити заздалегідь, але тримати резерв (самострахування) і план на випадок події",
    game: "резерв 30 тис. грн на курс долара й податки",
  },
];

// Four standard responses to a risk, each with an example from the game.
export function RiskResponses() {
  return (
    <Figure
      title="Чотири реакції на ризик"
      lead="Для кожного ризику з реєстру команда обирає одну з чотирьох реакцій."
      caption="Головне правило: захист не має коштувати дорожче, ніж можливий збиток."
    >
      <ul className="grid gap-3 @xl:grid-cols-2">
        {strategies.map((s) => (
          <li key={s.name} className="rounded-[4px] border border-border p-4">
            <p className="font-display text-lg font-semibold">{s.name}</p>
            <p className="mt-1 text-sm text-muted">{s.idea}</p>
            <p className="mt-2 text-sm">
              <span className="font-medium">У грі: </span>
              {s.game}
            </p>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
