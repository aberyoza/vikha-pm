import { Figure } from "./figure";

// PMBOK 6 knowledge areas and the PMBOK 8 domain where each now lives.
const rows = [
  { area: "Інтеграція", domain: "Врядування" },
  { area: "Зміст", domain: "Зміст" },
  { area: "Строки", domain: "Розклад" },
  { area: "Вартість", domain: "Фінанси" },
  { area: "Якість", domain: "Зміст і принцип «вбудована якість»" },
  { area: "Ресурси", domain: "Ресурси" },
  { area: "Комунікації", domain: "Зацікавлені сторони" },
  { area: "Ризики", domain: "Ризики" },
  { area: "Закупівлі", domain: "Ресурси" },
  { area: "Зацікавлені сторони", domain: "Зацікавлені сторони" },
];

const pmbok7 = [
  "Стейкхолдери",
  "Команда",
  "Підхід до розробки та життєвий цикл",
  "Планування",
  "Проєктна робота",
  "Постачання",
  "Вимірювання",
  "Невизначеність",
];

// How the ten knowledge areas map to today's domains.
export function KnowledgeToDomains() {
  return (
    <Figure
      title="Від областей знань до доменів"
      lead="Десять областей знань PMBOK 6 у PMBOK 8 зібрані в сім доменів."
      caption="Відповідність приблизна: домени ширші за області знань. Сфери виконання PMBOK 7 побудовані інакше — навколо результатів, тому прямо їх не зіставити."
    >
      <table className="w-full text-left text-sm">
        <thead className="text-[13px] text-muted">
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-3 font-normal">Область знань (PMBOK 6)</th>
            <th scope="col" className="py-2 font-normal">Домен (PMBOK 8)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.area} className="border-b border-border last:border-0">
              <td className="py-2 pr-3">{r.area}</td>
              <td className="py-2 font-medium">{r.domain}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-5 rounded-[4px] border border-border p-4">
        <p className="font-medium">8 сфер виконання PMBOK 7</p>
        <ul className="mt-2 flex flex-wrap gap-2 text-[13px]">
          {pmbok7.map((d) => (
            <li key={d} className="rounded-[3px] bg-accent-soft px-2 py-1">
              {d}
            </li>
          ))}
        </ul>
      </div>
    </Figure>
  );
}
