import { Figure } from "./figure";

type Bar = { label: string; start: number; end: number };

const SCALE = 10;
const pct = (v: number) => `${(v / SCALE) * 100}%`;

const lags: {
  code: string;
  name: string;
  rule: string;
  a: Bar;
  b: Bar;
  // Lag bracket on the timeline, in days, and which row it sits between.
  from: number;
  to: number;
}[] = [
  {
    code: "FS",
    name: "Кінець — початок",
    rule: "Б починається через 2 дні після кінця А",
    a: { label: "Підготувати й подати гру", start: 0, end: 3 },
    b: { label: "Реліз", start: 5, end: 7 },
    from: 3,
    to: 5,
  },
  {
    code: "SF",
    name: "Початок — кінець",
    rule: "Б не закінчується раніше ніж через 1 день після початку А",
    a: { label: "Новий сервер працює", start: 5, end: 10 },
    b: { label: "Старий сервер працює", start: 0, end: 6 },
    from: 5,
    to: 6,
  },
  {
    code: "SS",
    name: "Початок — початок",
    rule: "Б починається не раніше ніж через 2 дні після початку А",
    a: { label: "Ігрова механіка", start: 0, end: 7 },
    b: { label: "Дизайн рівнів", start: 2, end: 8 },
    from: 0,
    to: 2,
  },
  {
    code: "FF",
    name: "Кінець — кінець",
    rule: "Б закінчується не раніше ніж через 2 дні після кінця А",
    a: { label: "Збирання рівнів", start: 0, end: 6 },
    b: { label: "Тестування", start: 2, end: 8 },
    from: 6,
    to: 8,
  },
];

function Row({ bar, tone, tag }: { bar: Bar; tone: string; tag: string }) {
  return (
    <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-end gap-2">
      <span className="font-display text-[13px] font-semibold text-muted">{tag}</span>
      <div>
        <p className="text-[12px] leading-tight">{bar.label}</p>
        <div className="relative mt-1 h-4 rounded-[2px] bg-background">
          <span
            className={`absolute inset-y-0 rounded-[2px] ${tone}`}
            style={{ left: pct(bar.start), width: pct(bar.end - bar.start) }}
          />
        </div>
      </div>
    </div>
  );
}

// The four dependency types with a lag, each drawn as a tiny Gantt chart.
export function LagTypes() {
  return (
    <Figure
      title="Чотири види затримок (лагів)"
      lead="Затримка прив'язує початок чи кінець однієї роботи до початку чи кінця іншої."
      caption="Пунктирна дужка — сама затримка. Найчастіше трапляється «кінець — початок», найрідше — «початок — кінець»."
    >
      <ul className="grid gap-4 @2xl:grid-cols-2">
        {lags.map((l) => (
          <li key={l.code} className="rounded-[4px] border border-border p-4">
            <p className="font-medium">
              <span className="font-display text-accent">{l.code}</span> — {l.name}
            </p>
            <p className="mt-1 text-[13px] text-muted">{l.rule}</p>
            <div className="mt-3 space-y-1.5" aria-hidden>
              <Row bar={l.a} tag="А" tone="bg-foreground/55" />
              <div className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2">
                <span />
                <div className="relative h-3">
                  <span
                    className="absolute top-1/2 h-0 border-t-2 border-dashed border-accent"
                    style={{ left: pct(l.from), width: pct(l.to - l.from) }}
                  />
                  <span
                    className="absolute -top-0.5 font-display text-[11px] font-semibold text-accent"
                    style={{ left: `calc(${pct(l.to)} + 4px)` }}
                  >
                    {l.to - l.from === 1 ? "1 день" : `${l.to - l.from} дні`}
                  </span>
                </div>
              </div>
              <Row bar={l.b} tag="Б" tone="bg-accent" />
            </div>
            <p className="sr-only">
              А: {l.a.label}, дні {l.a.start}–{l.a.end}. Б: {l.b.label}, дні {l.b.start}–{l.b.end}.
            </p>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
