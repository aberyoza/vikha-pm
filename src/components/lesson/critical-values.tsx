import { RATE } from "@/content/examples/game-studio";
import { CRITICAL } from "@/content/examples/game-risks";
import { Figure } from "./figure";

const pct = (v: number) => `${Math.round(v * 100)}%`;

const rows = [
  {
    label: "Доходи гри",
    text: `можуть упасти на ${pct(CRITICAL.revenueDrop)}`,
    share: CRITICAL.revenueDrop,
  },
  {
    label: "Вартість розробки",
    text: `може зрости на ${pct(CRITICAL.costRise)}`,
    share: CRITICAL.costRise,
  },
  {
    label: "Ставка",
    text: `може зрости з ${pct(RATE)} до ${pct(CRITICAL.rate)}, тобто на ${pct((CRITICAL.rate - RATE) / RATE)}`,
    share: (CRITICAL.rate - RATE) / RATE,
  },
];

// Margin of safety: how far each factor can move before NPV hits zero.
export function CriticalValues() {
  return (
    <Figure
      title="Критичні значення гри"
      lead="Наскільки може погіршитися кожен фактор, перш ніж гра стане збитковою."
      caption="Довжина смужки — на скільки відсотків може змінитися фактор (вся ширина — 100%). За цією межею NPV (чиста приведена вартість) гри стає від'ємним. Що коротша смужка, то менший запас міцності."
    >
      <ul className="space-y-4">
        {rows.map((r) => (
          <li key={r.label}>
            <p className="flex flex-wrap justify-between gap-x-3 text-sm">
              <span className="font-medium">{r.label}</span>
              <span className="text-muted">{r.text}</span>
            </p>
            <div aria-hidden className="mt-1.5 h-3 rounded-[2px] bg-background">
              <div className="h-full rounded-[2px] bg-accent" style={{ width: `${Math.min(100, r.share * 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
