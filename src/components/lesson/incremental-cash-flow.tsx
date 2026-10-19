import { Figure } from "./figure";

function Term({ label, note, strong }: { label: string; note: string; strong?: boolean }) {
  return (
    <div
      className={`rounded-[4px] p-3 text-center ${strong ? "bg-accent text-accent-foreground" : "border border-border"}`}
    >
      <p className="font-display font-semibold">{label}</p>
      <p className={`text-[13px] ${strong ? "" : "text-muted"}`}>{note}</p>
    </div>
  );
}

// Principle 2: the project is valued by the change it brings, not by totals.
export function IncrementalCashFlow() {
  return (
    <Figure
      title="Принцип 2"
      lead="Рахуємо не всі гроші підприємства, а лише те, що змінює проєкт."
      caption="Для проєкту «в чистому полі» стану «без проєкту» немає: його потоки — це потоки нової юридичної особи."
    >
      <div className="grid items-center gap-2 @md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
        <Term label="З проєктом" note="доходи і витрати" />
        <span className="text-center font-display text-2xl text-muted">−</span>
        <Term label="Без проєкту" note="доходи і витрати" />
        <span className="text-center font-display text-2xl text-muted">=</span>
        <Term label="Приріст" note="потік проєкту" strong />
      </div>
    </Figure>
  );
}
