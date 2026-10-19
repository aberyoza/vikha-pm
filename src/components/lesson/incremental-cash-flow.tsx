import { Figure } from "./figure";

function Term({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      className={`rounded-[4px] p-3 text-center ${strong ? "bg-accent text-accent-foreground" : "border border-border"}`}
    >
      <p className="font-display text-lg font-semibold whitespace-nowrap">{value}</p>
      <p className={`text-[13px] ${strong ? "" : "text-muted"}`}>{label}</p>
    </div>
  );
}

// Principle 2 on the app example: the project's benefit is the difference
// it makes, not the store's total sales.
export function IncrementalCashFlow() {
  return (
    <Figure
      title="Принцип 2"
      lead="Вигода проєкту — лише різниця, яку він дає."
      caption="Продажі на рік, приклад. Для стартапу «з нуля» стану «без проєкту» немає: усі його доходи й витрати — це і є проєкт."
    >
      <div className="grid items-center gap-2 @md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
        <Term value={"5,3 млн грн"} label="із застосунком" />
        <span className="text-center font-display text-2xl text-muted">−</span>
        <Term value={"5 млн грн"} label="без застосунку" />
        <span className="text-center font-display text-2xl text-muted">=</span>
        <Term value={"300 тис. грн"} label="вигода проєкту" strong />
      </div>
    </Figure>
  );
}
