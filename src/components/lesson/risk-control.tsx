import { RISKS, type Control } from "@/content/examples/game-risks";
import { Figure } from "./figure";

const groups: { key: Control; name: string; text: string }[] = [
  { key: "full", name: "Контрольовані", text: "студія сама може їм запобігти" },
  { key: "partial", name: "Частково контрольовані", text: "можна зменшити, але не прибрати" },
  { key: "none", name: "Неконтрольовані", text: "єдиний захист — резерв грошей" },
];

// Risks of the game grouped by how much the studio controls them.
export function RiskControl() {
  return (
    <Figure title="Ризики за ступенем контролю" lead="Від того, наскільки ризик під нашим контролем, залежить захист.">
      <div className="grid gap-3 @xl:grid-cols-3">
        {groups.map((g, i) => (
          <div key={g.key} className="rounded-[4px] border border-border p-4">
            <div aria-hidden className="mb-3 flex gap-1">
              {[0, 1, 2].map((d) => (
                <span key={d} className={`h-1.5 flex-1 rounded-full ${d < 3 - i ? "bg-accent" : "bg-border"}`} />
              ))}
            </div>
            <p className="font-medium">{g.name}</p>
            <p className="mt-1 text-sm text-muted">{g.text}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {RISKS.filter((r) => r.control === g.key).map((r) => (
                <li key={r.key} className="flex gap-2">
                  <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rotate-45 rounded-[1px] bg-accent" />
                  {r.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Figure>
  );
}
