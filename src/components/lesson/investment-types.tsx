import { Figure } from "./figure";

const types = [
  {
    name: "Фінансові",
    where: "Цінні папери, фінансові активи",
    field: "Фінансовий менеджмент",
    focus: false,
  },
  {
    name: "Реальні",
    where: "Виробництво, будівництво, реконструкція, обладнання, інновації",
    field: "Інвестиційний менеджмент і проєктний аналіз",
    focus: true,
  },
];

export function InvestmentTypes() {
  return (
    <Figure
      title="Інвестиції"
      lead="Витрати сьогодні заради вигод у майбутньому."
      caption="Проєктний аналіз працює з реальними інвестиціями."
    >
      <div className="flex items-center gap-3 text-sm">
        <span className="rounded-[3px] border border-border px-2.5 py-1">Витрати сьогодні</span>
        <span aria-hidden className="h-0.5 flex-1 bg-accent/50" />
        <span className="rounded-[3px] bg-accent px-2.5 py-1 font-medium text-accent-foreground">
          Вигоди в майбутньому
        </span>
      </div>

      <div className="mt-6 grid gap-3 @xl:grid-cols-2">
        {types.map((t) => (
          <div
            key={t.name}
            className={`rounded-[4px] border p-4 ${t.focus ? "border-accent" : "border-border"}`}
          >
            <p className={`font-display text-xl font-semibold ${t.focus ? "text-accent" : ""}`}>
              {t.name}
            </p>
            <p className="mt-2 text-sm">{t.where}</p>
            <p className="mt-3 text-[13px] text-muted">Вивчає: {t.field}</p>
          </div>
        ))}
      </div>
    </Figure>
  );
}
