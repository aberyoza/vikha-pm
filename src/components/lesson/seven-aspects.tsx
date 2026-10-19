import { Figure } from "./figure";

// One guiding question per aspect, so the list reads as a checklist.
const aspects = [
  { name: "Технічний", question: "Чи можна це зробити технологічно?" },
  { name: "Комерційний", question: "Чи купуватимуть і як доставимо?" },
  { name: "Інституційний", question: "Хто і за якими правилами реалізує?" },
  { name: "Соціальний", question: "Як це вплине на людей і громаду?" },
  { name: "Екологічний", question: "Як це вплине на довкілля?" },
  { name: "Фінансовий", question: "Чи окупиться для підприємства?" },
  { name: "Економічний", question: "Що отримає економіка країни?" },
];

export function SevenAspects() {
  return (
    <Figure
      title="Сім аспектів"
      lead="Кожен аспект — окреме питання до проєкту."
      caption="Від мікрорівня підприємства до макрорівня країни: фінансовий аспект рахує вигоду для компанії, економічний — для суспільства."
    >
      <ol className="divide-y divide-grid">
        {aspects.map((a, i) => (
          <li key={a.name} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 py-2.5 first:pt-0 last:pb-0 @md:grid-cols-[1.75rem_9rem_minmax(0,1fr)]">
            <span className="font-display font-semibold text-accent tabular-nums">{i + 1}</span>
            <span className="font-medium">{a.name}</span>
            <span className="col-start-2 text-sm text-muted @md:col-start-3">{a.question}</span>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
