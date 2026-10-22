import { ENGAGEMENT, STAKEHOLDERS } from "@/content/examples/game-stakeholders";
import { Figure } from "./figure";

const rows = STAKEHOLDERS.filter((s) => s.current !== undefined && s.desired !== undefined);

// Stakeholder engagement assessment matrix: current (П) vs desired (Б).
export function EngagementMatrix() {
  return (
    <Figure
      title="Матриця залучення"
      lead="Де зацікавлені сторони зараз (П) і де мають бути (Б)."
      caption="Різниця між П і Б — план роботи з людьми. Якщо вони збігаються, підтримуйте те, що є."
    >
      <div className="hidden @2xl:block">
        <table className="w-full table-fixed text-center text-sm">
          <thead className="text-[12px] text-muted">
            <tr className="border-b border-border">
              <th scope="col" className="w-[28%] py-2 pr-2 text-left font-normal">
                Сторона
              </th>
              {ENGAGEMENT.map((e) => (
                <th key={e} scope="col" className="py-2 font-normal">
                  {e}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.key} className="border-b border-border last:border-0">
                <th scope="row" className="py-2.5 pr-2 text-left font-medium">
                  {s.name}
                </th>
                {ENGAGEMENT.map((_, i) => {
                  const c = s.current === i;
                  const d = s.desired === i;
                  return (
                    <td key={i} className="py-2.5">
                      <span className="inline-flex gap-1">
                        {c && <span className="rounded-[3px] border border-border bg-background px-1.5 text-[12px] font-semibold">П</span>}
                        {d && <span className="rounded-[3px] bg-accent px-1.5 text-[12px] font-semibold text-accent-foreground">Б</span>}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-2 @2xl:hidden">
        {rows.map((s) => (
          <li key={s.key} className="rounded-[4px] border border-border p-3 text-sm">
            <p className="font-medium">{s.name}</p>
            <p className="mt-1 text-[13px]">
              <span className="text-muted">Зараз:</span> {ENGAGEMENT[s.current!]}
              <span className="mx-1.5 text-muted">→</span>
              <span className="text-muted">Треба:</span> <span className="font-medium text-accent">{ENGAGEMENT[s.desired!]}</span>
            </p>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
