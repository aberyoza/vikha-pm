import { BAC, STATUS as WEEK8, evm, fmt } from "@/content/examples/game-finance";
import { Figure } from "./figure";

const m = evm(WEEK8.pv, WEEK8.ev, WEEK8.ac);

type Status = "green" | "amber" | "red";

const STATUS: Record<Status, { label: string; dot: string; text: string }> = {
  green: { label: "у межах плану", dot: "bg-sage", text: "text-sage" },
  amber: { label: "увага", dot: "bg-accent", text: "text-accent" },
  red: { label: "потрібне рішення", dot: "bg-risk-3", text: "text-foreground" },
};

const rows: { area: string; status: Status; note: string }[] = [
  { area: "Зміст", status: "green", note: "дизайн і сервер готові, рівні збирають" },
  { area: "Розклад", status: "amber", note: "механіка відстає на 3 дні, є резерв" },
  { area: "Бюджет", status: "amber", note: `освоєно ${fmt(WEEK8.ev)} тис. при витратах ${fmt(WEEK8.ac)}; прогноз ${fmt(m.eac)} тис. замість ${BAC}, резерв піде повністю` },
  { area: "Ризики", status: "red", note: "програміст повідомив про звільнення" },
  { area: "Якість", status: "green", note: "критичних помилок немає" },
];

// One-page status report of the game at week 8.
export function StatusReport() {
  return (
    <Figure
      title="Звіт про стан гри, 8-й тиждень"
      lead="Одна сторінка, з якої спонсор за хвилину бачить, де потрібне його рішення."
    >
      <ul className="divide-y divide-grid rounded-[4px] border border-border">
        {rows.map((r) => {
          const s = STATUS[r.status];
          return (
            <li key={r.area} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 p-3 text-sm">
              <span className="font-medium">{r.area}</span>
              <span>
                <span className={`flex items-center gap-2 text-[13px] font-medium ${s.text}`}>
                  <span aria-hidden className={`size-2.5 shrink-0 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
                <span className="mt-0.5 block text-muted">{r.note}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 grid gap-3 text-sm @xl:grid-cols-2">
        <div className="rounded-[4px] border border-border p-3">
          <p className="text-[13px] text-muted">Зроблено і далі</p>
          <p className="mt-1">Сервер і дизайн готові, збираємо рівні. Після тестування — бета для 50 гравців.</p>
        </div>
        <div className="rounded-[4px] border border-accent bg-accent-soft/60 p-3">
          <p className="text-[13px] text-muted">Потрібне рішення спонсора</p>
          <p className="mt-1">Найняти другого програміста на два місяці за 40 тис. грн або перенести реліз на місяць.</p>
        </div>
      </div>
    </Figure>
  );
}
