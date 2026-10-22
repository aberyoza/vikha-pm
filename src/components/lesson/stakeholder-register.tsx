import { STAKEHOLDERS } from "@/content/examples/game-stakeholders";
import { Figure } from "./figure";

const level = { high: "висока", low: "низька" } as const;
const interest = { high: "високий", low: "низький" } as const;

// The game's stakeholder register: who, what they expect, power and interest.
export function StakeholderRegister() {
  return (
    <Figure
      title="Реєстр зацікавлених сторін гри"
      lead="Усі, хто впливає на гру або на кого вона впливає, — в одній таблиці."
      caption="Реєстр живий: нові сторони з'являються (стример-партнер прийшов лише за місяць до релізу), старі зникають. Його переглядають разом із реєстром ризиків."
    >
      <div className="hidden @3xl:block">
        <table className="w-full text-left text-sm">
          <thead className="text-[13px] text-muted">
            <tr className="border-b border-border">
              {["Хто", "Де", "Чого очікує", "Влада", "Інтерес"].map((h) => (
                <th key={h} scope="col" className="py-2 pr-3 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STAKEHOLDERS.map((s) => (
              <tr key={s.key} className="border-b border-border align-top last:border-0">
                <td className="py-2 pr-3 font-medium">{s.name}</td>
                <td className="py-2 pr-3 text-muted">{s.side === "internal" ? "внутрішня" : "зовнішня"}</td>
                <td className="py-2 pr-3">{s.expects}</td>
                <td className="py-2 pr-3">{level[s.power]}</td>
                <td className="py-2">{interest[s.interest]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-2 @3xl:hidden">
        {STAKEHOLDERS.map((s) => (
          <li key={s.key} className="rounded-[4px] border border-border p-3 text-sm">
            <p className="flex flex-wrap items-baseline justify-between gap-x-2">
              <span className="font-medium">{s.name}</span>
              <span className="text-[12px] text-muted">{s.side === "internal" ? "внутрішня" : "зовнішня"}</span>
            </p>
            <p className="mt-0.5">{s.expects}</p>
            <p className="mt-1 text-[13px] text-muted">
              влада — {level[s.power]}, інтерес — {interest[s.interest]}
            </p>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
