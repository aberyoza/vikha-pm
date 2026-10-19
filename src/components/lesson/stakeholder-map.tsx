import { Figure } from "./figure";

function Chips({ items, tone }: { items: string[]; tone: "muted" | "accent" }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className={`rounded-full px-3 py-1 text-sm ${
            tone === "accent"
              ? "bg-accent-soft text-accent"
              : "border border-border bg-surface"
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Label({ children }: { children: string }) {
  return (
    <p className="text-xs uppercase tracking-wide text-muted">{children}</p>
  );
}

export function StakeholderMap() {
  return (
    <Figure
      title="Карта стейкхолдерів"
      lead="Навколо кожного проєкту — кілька кіл учасників."
      caption="Ближче до центру — ті, хто безпосередньо створює та фінансує проєкт. Зовнішнє коло не керує проєктом, але може як сприяти йому, так і створювати бар'єри."
    >
      <div className="rounded-2xl border border-dashed border-border p-3 @md:p-5">
        <Label>Зовнішнє середовище</Label>
        <Chips
          tone="muted"
          items={["Конкуренти", "Органи влади", "Ліцензіари", "Громадські групи"]}
        />

        <div className="mt-4 rounded-xl border border-border bg-background p-3 @md:p-5">
          <Label>Ключові учасники</Label>
          <Chips
            tone="muted"
            items={["Ініціатор", "Замовник", "Інвестор", "Постачальники та підрядники"]}
          />

          <div className="mt-4 rounded-lg bg-accent-soft p-3 @md:p-5">
            <Label>Ядро</Label>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
                Проєкт
              </span>
              <span className="text-sm text-accent">Команда та виконавці</span>
            </div>
          </div>
        </div>
      </div>
    </Figure>
  );
}
