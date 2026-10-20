import { Figure } from "./figure";

const methods = [
  {
    name: "Диверсифікація і розподіл",
    idea: "не класти всі яйця в один кошик, ділити ризик з партнерами",
    game: "випустити гру одразу в App Store і Google Play; видавець бере частину витрат на рекламу",
    when: "до події",
  },
  {
    name: "Уникнення",
    idea: "відмовитися від ризикованої технології чи ринку",
    game: "не писати власний ігровий рушій, а взяти перевірений готовий",
    when: "до події",
  },
  {
    name: "Страхування",
    idea: "передати ризик професійному страховику",
    game: "застрахувати ноутбуки й техніку студії",
    when: "до події",
  },
  {
    name: "Резервування",
    idea: "відкласти власні гроші на несподіванки (самострахування)",
    game: "резерв 30 тис. грн на курс долара й податки",
    when: "до події",
  },
  {
    name: "Додаткові гроші",
    idea: "залучити кредит чи ресурси, коли подія вже сталася",
    game: "якщо програміст іде, взяти короткий кредит на найм нової людини",
    when: "після події",
  },
];

// Ways to manage risks, each with an example from the game.
export function RiskResponses() {
  return (
    <Figure
      title="Як захищатися від ризиків"
      lead="Захист не має коштувати дорожче, ніж можливий збиток."
      caption="Доподійні методи закладають у гроші проєкту заздалегідь. Післяподійні вмикаються, коли ризик уже стався."
    >
      <ul className="space-y-3">
        {methods.map((m) => (
          <li key={m.name} className="rounded-[4px] border border-border p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <p className="font-medium">{m.name}</p>
              <span
                className={`rounded-[3px] px-2 py-0.5 text-[12px] ${
                  m.when === "до події" ? "bg-accent-soft text-accent" : "bg-sage-soft text-sage"
                }`}
              >
                {m.when}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{m.idea}</p>
            <p className="mt-2 text-sm">
              <span className="font-medium">У грі: </span>
              {m.game}
            </p>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
