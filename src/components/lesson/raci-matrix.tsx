import { TASKS } from "@/content/examples/game-plan";
import { Figure } from "./figure";

const ROLES = ["Керівник проєкту", "Програміст", "Дизайнер", "Тестувальник", "Маркетолог", "Засновники"];
const SHORT = ["PM", "Прог.", "Диз.", "Тест.", "Марк.", "Засн."];

type Code = "R" | "A" | "C" | "I" | "";

// One row per task (game-plan id), one letter per role in ROLES order.
const MATRIX: Record<number, Code[]> = {
  1: ["R", "C", "C", "I", "C", "A"],
  2: ["A", "C", "R", "", "C", "I"],
  3: ["A", "R", "C", "C", "", ""],
  4: ["A", "R", "", "I", "", ""],
  5: ["A", "C", "R", "C", "", ""],
  6: ["I", "", "C", "", "R", "A"],
  7: ["A", "C", "C", "R", "", ""],
  8: ["A", "R", "", "", "C", "I"],
};

const tone: Record<Code, string> = {
  A: "bg-accent text-accent-foreground",
  R: "bg-accent-soft text-foreground",
  C: "text-foreground",
  I: "text-muted",
  "": "",
};

// RACI matrix of the game: who does, who answers, who is consulted, informed.
export function RaciMatrix() {
  return (
    <Figure
      title="RACI-матриця гри"
      lead="Хто робить, хто відповідає, з ким радяться і кого інформують."
      caption="У кожному рядку рівно одна A. Ролі в стовпцях, а не імена: люди змінюються, ролі лишаються. PM — керівник проєкту."
    >
      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full min-w-[420px] table-fixed text-center text-sm">
          <thead className="text-[12px] text-muted">
            <tr className="border-b border-border">
              <th scope="col" className="w-[30%] py-2 text-left font-normal">Робота</th>
              {SHORT.map((s, i) => (
                <th key={s} scope="col" className="py-2 font-normal" title={ROLES[i]}>
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TASKS.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <th scope="row" className="py-1.5 text-left font-medium">{t.name}</th>
                {MATRIX[t.id].map((c, i) => (
                  <td key={i} className="py-1.5">
                    {c && <span className={`inline-block w-6 rounded-[3px] font-display text-[13px] font-semibold ${tone[c]}`}>{c}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[12px] text-muted">
        Ролі: {ROLES.map((r, i) => `${SHORT[i]} — ${r.toLowerCase()}`).join("; ")}.
      </p>
    </Figure>
  );
}
