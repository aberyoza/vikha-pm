import { Figure } from "./figure";

const years = ["Рік 1", "Рік 2", "Рік 3"];

function Row({
  label,
  note,
  values,
  tone,
}: {
  label: string;
  note: string;
  values: string[];
  tone: "real" | "paper";
}) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-[13px] text-muted">{note}</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {values.map((v, i) => (
          <div
            key={i}
            className={`rounded-[3px] px-2 py-2 text-center ${
              v === "0"
                ? "border border-border text-muted"
                : tone === "real"
                  ? "bg-accent text-accent-foreground"
                  : "border-[1.5px] border-dashed border-accent text-accent"
            }`}
          >
            <span className="block font-display text-sm font-semibold tabular-nums">
              {v === "0" ? "0" : `−${v}`}
            </span>
            <span className="text-[12px] opacity-80">{years[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RealVsPaperMoney() {
  return (
    <Figure
      title="Реальні і «паперові» гроші"
      lead="Ноутбук за 60 тис. грн: як його бачить бухгалтерія і як — проєктний аналіз."
      caption="Тис. грн. Проєктний аналіз рахує реальний рух грошей: 60 тис. грн пішли в перший рік, а не по 20 тис. щороку."
    >
      <div className="space-y-5">
        <Row
          label="Реальні гроші"
          note="коли гроші справді пішли з рахунку"
          values={["60", "0", "0"]}
          tone="real"
        />
        <Row
          label="Амортизація"
          note="як вартість «розтягує» бухгалтерія"
          values={["20", "20", "20"]}
          tone="paper"
        />
      </div>
    </Figure>
  );
}
