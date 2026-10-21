import { WBS } from "@/content/examples/game-scope";
import { weeks } from "@/content/examples/game-plan";
import { Figure } from "./figure";

const depth = (code: string) => code.split(".").length - 1;

// The game's WBS with codes; work packages carry an owner and an estimate.
export function WbsCodes() {
  return (
    <Figure
      title="WBS гри з кодами"
      lead="Кожен елемент має свій код, а робочі пакети — відповідального й оцінку."
      caption="Робочі пакети — найнижчий рівень WBS (виділені ромбом). Саме їх оцінюють, доручають і контролюють. Оцінки — ті самі, що в модулі 5."
    >
      <table className="w-full text-left text-sm">
        <thead className="text-[13px] text-muted">
          <tr className="border-b border-border">
            <th scope="col" className="py-2 pr-3 font-normal">Код</th>
            <th scope="col" className="py-2 pr-3 font-normal">Елемент</th>
            <th scope="col" className="hidden py-2 pr-3 font-normal @xl:table-cell">Відповідальний</th>
            <th scope="col" className="py-2 text-right font-normal">Оцінка</th>
          </tr>
        </thead>
        <tbody>
          {WBS.map((item) => {
            const pkg = item.weeks !== undefined;
            return (
              <tr key={item.code} className="border-b border-border last:border-0">
                <td className={`py-2 pr-3 font-display tabular-nums ${pkg ? "text-muted" : "font-semibold text-accent"}`}>{item.code}</td>
                <td className="py-2 pr-3">
                  <div style={{ paddingLeft: `${depth(item.code) * 0.75}rem` }}>
                    <span className="flex items-center gap-2">
                      {pkg && <span aria-hidden className="size-1.5 shrink-0 rotate-45 rounded-[1px] bg-accent" />}
                      <span className={pkg ? "" : "font-medium"}>{item.name}</span>
                    </span>
                    {item.owner && <span className="block pl-3.5 text-[12px] text-muted @xl:hidden">{item.owner}</span>}
                  </div>
                </td>
                <td className="hidden py-2 pr-3 text-muted @xl:table-cell">{item.owner ?? ""}</td>
                <td className="py-2 text-right whitespace-nowrap tabular-nums">{pkg ? weeks(item.weeks!) : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Figure>
  );
}
