import { Figure } from "./figure";

const steps = [
  { name: "Виконані роботи", note: "команда закінчила частину гри" },
  { name: "Контроль якості", note: "команда сама перевіряє: тести, стандарти" },
  { name: "Інспекція із замовником", note: "демо, перевірка за критеріями приймання" },
];

// Validate scope: from completed work through inspection to acceptance
// or a change request.
export function ValidateFlow() {
  return (
    <Figure
      title="Підтвердження змісту"
      lead="Спершу команда перевіряє якість сама, потім замовник приймає результат."
    >
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={s.name}>
            <div className="rounded-[4px] border border-border p-3">
              <p className="font-medium">
                <span className="font-display text-accent">{i + 1}.</span> {s.name}
              </p>
              <p className="text-[13px] text-muted">{s.note}</p>
            </div>
            <span aria-hidden className="mx-auto block h-3 w-0.5 bg-border" />
          </li>
        ))}
      </ol>
      <div className="grid gap-3 @md:grid-cols-2">
        <div className="rounded-[4px] bg-accent-soft p-3">
          <p className="font-medium">Так: прийняті результати</p>
          <p className="text-[13px] text-muted">замовник офіційно підтверджує, що частину зроблено</p>
        </div>
        <div className="rounded-[4px] border border-dashed border-foreground/40 p-3">
          <p className="font-medium">Ні: запит на зміни</p>
          <p className="text-[13px] text-muted">що виправити чи доробити — і знову на інспекцію</p>
        </div>
      </div>
    </Figure>
  );
}
