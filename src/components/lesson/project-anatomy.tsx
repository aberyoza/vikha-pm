import { Figure } from "./figure";

const levers = ["Команда", "Ресурси", "Методи", "Етапи робіт"];

// Connector with a dot that travels along it: horizontal when the figure
// is wide enough for one row, vertical when the boxes stack.
function Flow() {
  return (
    <div aria-hidden className="flex items-center justify-center">
      <div className="relative h-8 w-px bg-border @2xl:hidden">
        <span className="absolute left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent animate-flow-y motion-reduce:hidden" />
      </div>
      <div className="relative hidden h-px w-10 bg-border @2xl:block">
        <span className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent animate-flow-x motion-reduce:hidden" />
      </div>
    </div>
  );
}

export function ProjectAnatomy() {
  return (
    <Figure
      title="Анатомія проєкту"
      lead="Не «чорний ящик», а відкрита система: видно все, що перетворює проблему на результат."
      caption="Управління проєктами відкриває внутрішні важелі між входом і виходом — і саме ними менеджер керує в межах обмежень."
    >
      <div className="grid gap-3 @2xl:grid-cols-[1fr_auto_1.7fr_auto_1fr] @2xl:items-stretch">
        <div className="flex flex-col justify-center rounded-lg border border-border p-4">
          <p className="text-[13px] text-muted">Вхід</p>
          <p className="mt-1 font-medium">Потреба або проблема</p>
        </div>

        <Flow />

        <div className="rounded-lg border border-dashed border-accent p-4">
          <p className="text-[13px] text-muted">
            Проєкт — засоби реалізації
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {levers.map((lever) => (
              <li
                key={lever}
                className="rounded-full bg-accent-soft px-3 py-1 text-sm text-accent"
              >
                {lever}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-border pt-3 text-sm text-muted">
            <span className="font-medium text-foreground">Обмеження:</span>{" "}
            час · бюджет · ресурси
          </p>
        </div>

        <Flow />

        <div className="flex flex-col justify-center rounded-lg bg-accent p-4 text-accent-foreground">
          <p className="text-[13px] opacity-80">Вихід</p>
          <p className="mt-1 font-medium">Мета або результат</p>
        </div>
      </div>
    </Figure>
  );
}
