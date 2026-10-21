import { ACCEPTANCE, IN_SCOPE, OUT_OF_SCOPE } from "@/content/examples/game-scope";
import { Figure } from "./figure";

function List({ items, mark }: { items: string[]; mark: "in" | "out" }) {
  return (
    <ul className="mt-2 space-y-1.5 text-sm">
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <span aria-hidden className={`font-display font-semibold ${mark === "in" ? "text-accent" : "text-muted"}`}>
            {mark === "in" ? "+" : "−"}
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

// Project scope statement of the game: in, out and acceptance criteria.
export function ScopeStatement() {
  return (
    <Figure
      title="Опис змісту гри"
      lead="Межа проєкту: що робимо, чого точно не робимо і як зрозуміємо, що готово."
      caption="Список «не входить» так само важливий, як «входить»: саме він зупиняє суперечки «а ми думали, що це теж буде»."
    >
      <div className="grid gap-4 @xl:grid-cols-2">
        <div className="rounded-[4px] border border-accent bg-accent-soft/60 p-4">
          <p className="font-medium">Входить</p>
          <List items={IN_SCOPE} mark="in" />
        </div>
        <div className="rounded-[4px] border border-border p-4">
          <p className="font-medium">Не входить</p>
          <List items={OUT_OF_SCOPE} mark="out" />
        </div>
      </div>
      <div className="mt-4 rounded-[4px] border border-border p-4">
        <p className="font-medium">Критерії приймання</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {ACCEPTANCE.map((t) => (
            <li key={t} className="flex gap-2">
              <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rotate-45 rounded-[1px] bg-accent" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </Figure>
  );
}
