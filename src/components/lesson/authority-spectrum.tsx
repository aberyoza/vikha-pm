import { Figure } from "./figure";

// Schematic share of authority held by the project manager.
const structures = [
  { name: "Функціональна", pm: 10 },
  { name: "Слабка матриця", pm: 30 },
  { name: "Збалансована матриця", pm: 50 },
  { name: "Сильна матриця", pm: 72 },
  { name: "Проєктна", pm: 95 },
];

export function AuthoritySpectrum() {
  return (
    <Figure
      title="Хто керує"
      lead="Структури відрізняються тим, у чиїх руках влада: у функціонального керівника чи в керівника проєкту."
      caption="Схематично. Що правіше на шкалі, то більше повноважень і бюджету в керівника проєкту."
    >
      <div className="space-y-3">
        {structures.map((s) => (
          <div key={s.name} className="grid gap-1.5 @md:grid-cols-[11rem_minmax(0,1fr)] @md:items-center">
            <p className="text-sm font-medium">{s.name}</p>
            <div className="flex h-5 overflow-hidden rounded-[3px]">
              <span className="bg-accent" style={{ width: `${s.pm}%` }} />
              <span className="flex-1 border border-l-0 border-border bg-background" />
            </div>
          </div>
        ))}
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-5 rounded-[2px] bg-accent" />
          Керівник проєкту (PM)
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-5 rounded-[2px] border border-border bg-background" />
          Функціональний керівник (FM)
        </li>
      </ul>
    </Figure>
  );
}
