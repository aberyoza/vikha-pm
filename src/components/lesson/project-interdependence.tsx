import { Figure } from "./figure";

type Kind = {
  name: string;
  effect: string;
  example: string;
  // How taking project A changes the profitability of project B.
  arrow: "zero" | "needs" | "none" | "up" | "down";
};

const kinds: Kind[] = [
  {
    name: "Взаємовиключні",
    effect: "Б стає непотрібним",
    example: "гра на власному рушії або на готовому",
    arrow: "zero",
  },
  { name: "Умовні", effect: "Б не працює без А", example: "гра без сервера рекордів", arrow: "needs" },
  { name: "Незалежні", effect: "Б не змінюється", example: "гра і ремонт в офісі студії", arrow: "none" },
  {
    name: "Синергетичні",
    effect: "Б стає вигіднішим",
    example: "гра і YouTube-канал студії",
    arrow: "up",
  },
  {
    name: "Заміщуючі",
    effect: "Б стає менш вигідним",
    example: "дві схожі гри одного жанру",
    arrow: "down",
  },
];

const marks: Record<Kind["arrow"], string> = {
  zero: "0",
  needs: "←",
  none: "=",
  up: "↑",
  down: "↓",
};

function Diamond({ label, filled }: { label: string; filled?: boolean }) {
  return (
    <span className="relative grid size-8 place-items-center">
      <span
        aria-hidden
        className={`absolute inset-1 rotate-45 rounded-[3px] ${filled ? "bg-accent" : "border-2 border-accent"}`}
      />
      <span className={`relative text-xs font-semibold ${filled ? "text-accent-foreground" : "text-accent"}`}>
        {label}
      </span>
    </span>
  );
}

export function ProjectInterdependence() {
  return (
    <Figure
      title="Взаємозалежність"
      lead="Що станеться з вигодою від проєкту Б, якщо прийняти проєкт А?"
    >
      <ul className="divide-y divide-grid">
        {kinds.map((k) => (
          <li key={k.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="flex shrink-0 items-center gap-1.5" aria-hidden>
              <Diamond label="А" filled />
              <span className="w-5 text-center font-display text-lg text-accent">
                {marks[k.arrow]}
              </span>
              <Diamond label="Б" />
            </span>
            <span className="min-w-0">
              <span className="block font-medium">{k.name}</span>
              <span className="block text-sm text-muted">{k.effect}</span>
              <span className="block text-[13px] text-muted/80 italic">{k.example}</span>
            </span>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
