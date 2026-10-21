import { Figure } from "./figure";

const editions = [
  { year: 1987, name: "Перший звід знань", note: "PMI збирає знання галузі в один документ" },
  { year: 1996, name: "Перша «Настанова PMBOK»", note: "5 груп процесів і 9 областей знань" },
  { year: 2013, name: "5-те видання", note: "з'являється 10-та область — зацікавлені сторони; 47 процесів" },
  { year: 2017, name: "6-те видання", note: "49 процесів і окремий розділ про гнучкі (agile) підходи" },
  { year: 2021, name: "7-ме видання", note: "12 принципів і 8 сфер виконання замість обов'язкових процесів", current: true },
  { year: 2025, name: "8-ме видання", note: "6 принципів, 7 доменів і близько 40 процесів, які знову повернулися", current: true },
];

// Milestones of the PMBOK Guide; the two current editions are highlighted.
export function PmbokEditions() {
  return (
    <Figure
      title="Як змінювався PMBOK"
      lead="Від переліку процесів — до принципів і знову до балансу між ними."
      caption="Курс спирається на 7-ме і 8-ме видання. Класичні інструменти з попередніх видань (критичний шлях, WBS, PERT) ми показуємо там, де вони досі працюють."
    >
      <ol className="relative space-y-4 border-l-2 border-border pl-5">
        {editions.map((e) => (
          <li key={e.year} className="relative">
            <span
              aria-hidden
              className={`absolute top-1.5 -left-[26px] size-2.5 rotate-45 rounded-[1px] ${
                e.current ? "bg-accent" : "border-2 border-accent bg-surface"
              }`}
            />
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-display font-semibold text-accent tabular-nums">{e.year}</span>
              <span className="font-medium">{e.name}</span>
              {e.current && (
                <span className="rounded-[3px] bg-accent-soft px-1.5 py-0.5 text-[12px] text-accent">актуальне</span>
              )}
            </p>
            <p className="text-sm text-muted">{e.note}</p>
          </li>
        ))}
      </ol>
    </Figure>
  );
}
