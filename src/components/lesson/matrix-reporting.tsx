import { Figure } from "./figure";

const departments = ["Маркетинг", "Закупівлі", "Виробництво"];
const projects = ["Проєкт А", "Проєкт Б"];

// The highlighted employee sits in project A and the purchasing department.
const HIGHLIGHT = { row: 0, col: 1 };

export function MatrixReporting() {
  return (
    <Figure
      title="Подвійне підпорядкування"
      lead="У матриці в працівника два керівники."
      caption="По вертикалі — функціональний керівник відділу, по горизонталі — керівник проєкту. Звідси конфлікти інтересів між PM і FM."
    >
      <div
        className="grid gap-1.5 text-sm"
        style={{ gridTemplateColumns: `5.5rem repeat(${departments.length}, minmax(0, 1fr))` }}
      >
        <span />
        {departments.map((d, c) => (
          <div
            key={d}
            className={`rounded-[3px] px-2 py-2 text-center ${c === HIGHLIGHT.col ? "border border-foreground/60" : "border border-border"}`}
          >
            <span className="block text-[13px] text-muted">FM</span>
            <span className="text-[13px] hyphens-auto">{d}</span>
          </div>
        ))}

        {projects.map((p, r) => (
          <div key={p} className="contents">
            <div
              className={`flex flex-col justify-center rounded-[3px] px-2 py-3 ${r === HIGHLIGHT.row ? "bg-accent text-accent-foreground" : "border border-border"}`}
            >
              <span className={`text-[13px] ${r === HIGHLIGHT.row ? "" : "text-muted"}`}>PM</span>
              <span className="font-medium">{p}</span>
            </div>
            {departments.map((d, c) => {
              const here = r === HIGHLIGHT.row && c === HIGHLIGHT.col;
              const inRow = r === HIGHLIGHT.row;
              const inCol = c === HIGHLIGHT.col;
              return (
                <div
                  key={d}
                  className={`relative grid min-h-16 place-items-center rounded-[3px] ${
                    here ? "bg-accent-soft ring-2 ring-accent" : "bg-background"
                  }`}
                >
                  {inRow && !here && (
                    <span aria-hidden className="absolute inset-x-0 top-1/2 h-0.5 bg-accent/60" />
                  )}
                  {inCol && !here && (
                    <span aria-hidden className="absolute inset-y-0 left-1/2 w-0.5 bg-foreground/40" />
                  )}
                  <span
                    className={`relative size-3 rounded-full ${here ? "bg-accent" : "bg-muted/50"}`}
                    title={here ? "Працівник з двома керівниками" : undefined}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Figure>
  );
}
