import type { ReactNode } from "react";
import { Figure } from "./figure";

const CycleIcon = (
  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 12a8 8 0 0 1-14.2 5" />
    <path d="M4 12a8 8 0 0 1 14.2-5" />
    <path d="M18.5 3v4h-4M5.5 21v-4h4" />
  </svg>
);

const FlagIcon = (
  <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 21V4" />
    <path d="M5 4h12l-2.5 4L17 12H5" />
  </svg>
);

type Column = {
  name: string;
  icon: ReactNode;
  accent: boolean;
  rows: { label: string; value: string }[];
  examples: string[];
};

const columns: Column[] = [
  {
    name: "Операційна діяльність",
    icon: CycleIcon,
    accent: false,
    rows: [
      { label: "Тривалість", value: "Постійна, повторюється циклами" },
      { label: "Результат", value: "Однаковий щоразу" },
      { label: "Мета", value: "Підтримувати роботу як є" },
    ],
    examples: ["Конспекти лекцій щотижня", "Етикетки на товар у магазині"],
  },
  {
    name: "Проєкт",
    icon: FlagIcon,
    accent: true,
    rows: [
      { label: "Тривалість", value: "Має початок і кінець" },
      { label: "Результат", value: "Унікальний" },
      { label: "Мета", value: "Створити зміни" },
    ],
    examples: ["Курсова робота", "Новий логотип бренду", "Електронний цінник"],
  },
];

export function ProjectVsOperations() {
  return (
    <Figure title="Порівняння" lead="Проєкт чи рутина?">
      <div className="grid gap-4 sm:grid-cols-2">
        {columns.map((c) => (
          <div
            key={c.name}
            className={`rounded-lg border p-5 ${c.accent ? "border-accent" : "border-border"}`}
          >
            <div className={`flex items-center gap-3 ${c.accent ? "text-accent" : "text-muted"}`}>
              {c.icon}
              <p className="text-lg font-semibold text-foreground">{c.name}</p>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              {c.rows.map((r) => (
                <div key={r.label}>
                  <dt className="text-xs uppercase tracking-wide text-muted">{r.label}</dt>
                  <dd className="mt-0.5">{r.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs uppercase tracking-wide text-muted">Приклади</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {c.examples.map((e) => (
                <li
                  key={e}
                  className={`rounded-full px-3 py-1 text-sm ${c.accent ? "bg-accent-soft text-accent" : "bg-background text-muted"}`}
                >
                  {e}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Figure>
  );
}
