import { Figure } from "./figure";

const steps = [
  { name: "Планування управління змістом", out: "план управління змістом і план управління вимогами" },
  { name: "Збір вимог", out: "документація з вимог, матриця відстеження вимог" },
  { name: "Визначення змісту", out: "опис змісту: що входить і що ні" },
  { name: "Створення WBS", out: "WBS і базовий план змісту" },
  { name: "Підтвердження змісту", out: "прийняті результати або запити на зміни" },
  { name: "Контроль змісту", out: "аналіз відхилень, запити на зміни" },
];

// Six scope management processes with what each produces.
export function ScopeProcesses() {
  return (
    <Figure
      title="Шість процесів управління змістом"
      lead="Перші чотири — про планування, останні два — про контроль під час роботи."
    >
      <ol className="relative space-y-3 border-l-2 border-border pl-5">
        {steps.map((s, i) => (
          <li key={s.name} className="relative">
            <span
              aria-hidden
              className={`absolute top-1.5 -left-[26px] size-2.5 rotate-45 rounded-[1px] ${
                i < 4 ? "border-2 border-accent bg-surface" : "bg-accent"
              }`}
            />
            {i === 4 && <p className="mb-2 -ml-5 border-t border-dashed border-border pt-3 text-[13px] text-muted">Під час і після виконання робіт</p>}
            <p className="font-medium">
              <span className="font-display text-accent">{i + 1}.</span> {s.name}
            </p>
            <p className="text-sm text-muted">Результат: {s.out}</p>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
