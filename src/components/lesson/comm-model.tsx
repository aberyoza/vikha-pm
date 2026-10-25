import { Figure } from "./figure";

const steps = [
  { name: "Відправник кодує", text: "Менеджер пише: «Реліз переносимо на тиждень»." },
  { name: "Канал", text: "Повідомлення в загальному чаті о 23:00." },
  { name: "Шум", text: "150 непрочитаних, причину не пояснено, дизайнер читає з телефона в метро." },
  { name: "Отримувач декодує", text: "Дизайнер розуміє: «Можна не поспішати з рівнями»." },
];

// The communication model on a real misunderstanding, with and without feedback.
export function CommModel() {
  return (
    <Figure
      title="Модель комунікації"
      lead="Що відправили і що зрозуміли — не одне й те саме."
    >
      <ol className="space-y-1.5">
        {steps.map((s, i) => (
          <li key={s.name}>
            <div className={`rounded-[4px] border p-3 ${i === 2 ? "border-dashed border-foreground/40" : "border-border"}`}>
              <p className="text-[13px] font-medium text-muted">
                <span className="font-display text-accent">{i + 1}.</span> {s.name}
              </p>
              <p className="mt-0.5 text-sm">{s.text}</p>
            </div>
            <span aria-hidden className="mx-auto block h-1.5 w-0.5 bg-border" />
          </li>
        ))}
      </ol>
      <div className="grid gap-2 @xl:grid-cols-2">
        <div className="rounded-[4px] border border-border bg-background/50 p-3 text-sm">
          <p className="text-[13px] font-medium text-muted">{"Без зворотного зв'язку"}</p>
          <p className="mt-0.5">Рівні здають на тиждень пізніше, і реліз зсувається ще раз.</p>
        </div>
        <div className="rounded-[4px] bg-accent-soft p-3 text-sm">
          <p className="text-[13px] font-medium text-muted">{"5. Зі зворотним зв'язком"}</p>
          <p className="mt-0.5">
            «Тобто рівні здаю як раніше, а реліз пізніше?» — «Так, тиждень потрібен на тести». Непорозуміння
            знято за хвилину.
          </p>
        </div>
      </div>
    </Figure>
  );
}
