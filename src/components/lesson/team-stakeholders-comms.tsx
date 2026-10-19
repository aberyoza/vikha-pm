import { Figure } from "./figure";

function Block({
  name,
  note,
  items,
  highlight,
}: {
  name: string;
  note: string;
  items: string[];
  highlight?: string;
}) {
  return (
    <div className="rounded-[4px] border border-border p-4">
      <p className="font-display text-lg font-semibold">{name}</p>
      <p className="text-sm text-muted">{note}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className={`rounded-[3px] px-2.5 py-1 text-sm ${
              item === highlight
                ? "bg-accent font-medium text-accent-foreground"
                : "bg-background"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TeamStakeholdersComms() {
  return (
    <Figure
      title="Три різні поняття"
      lead="Команда, зацікавлені сторони й комунікації — не одне й те саме."
      caption="Операційні працівники — серед зацікавлених сторін: саме їм працювати з результатом проєкту."
    >
      <div className="grid gap-3 @2xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] @2xl:items-center">
        <Block
          name="Команда проєкту"
          note="внутрішні людські ресурси"
          items={["Керівник проєкту", "Виконавці"]}
        />

        <div className="flex items-center gap-3 px-1 @2xl:flex-col @2xl:px-0">
          <span aria-hidden className="h-8 w-0.5 bg-sage @2xl:h-0.5 @2xl:w-10" />
          <span className="text-sm text-sage">{"Комунікації — канали зв'язку"}</span>
          <span aria-hidden className="hidden h-0.5 w-10 bg-sage @2xl:block" />
        </div>

        <Block
          name="Зацікавлені сторони"
          note="внутрішні та зовнішні"
          items={["Замовник", "Інвестор", "Операційні працівники", "Органи влади"]}
          highlight="Операційні працівники"
        />
      </div>
    </Figure>
  );
}
