import { Figure } from "./figure";

// One guiding question per aspect, so the list reads as a checklist.
const aspects = [
  { name: "Технічний", question: "Чи зможемо зробити й підтримувати?" },
  { name: "Комерційний", question: "Чи будуть користуватися й платити?" },
  { name: "Інституційний", question: "Хто робить і за якими правилами?" },
  { name: "Соціальний", question: "Як зміниться робота людей і життя користувачів?" },
  { name: "Екологічний", question: "Скільки енергії й ресурсів споживе?" },
  { name: "Фінансовий", question: "Чи окупиться для компанії?" },
  { name: "Економічний", question: "Що отримають країна й суспільство?" },
];

export function SevenAspects() {
  return (
    <Figure
      title="Сім аспектів"
      lead="Кожен аспект — окреме питання до проєкту."
      caption="Фінансове питання — про вигоду для компанії, економічне — про вигоду для суспільства."
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
