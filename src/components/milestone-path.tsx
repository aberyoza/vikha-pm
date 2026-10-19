import Link from "next/link";
import { modules, publishedModules } from "@/content/course";
import { lessonsLabel } from "./ui";

const PER_ROW = 7;

// The whole course as a row of milestones (diamonds): published modules in
// the accent colour, the starting point highlighted, the rest outlined.
export function MilestonePath() {
  const first = publishedModules[0];
  const rows = [modules.slice(0, PER_ROW), modules.slice(PER_ROW)];

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        Ваш шлях
      </p>
      <p className="mt-1 font-serif text-2xl font-semibold">
        {modules.length} віх до результату
      </p>

      <div className="mt-8 space-y-8" aria-hidden>
        {rows.map((row, r) => (
          <div key={r} className="relative">
            <div className="absolute inset-x-3 top-1/2 h-px bg-border" />
            <ol className="relative flex justify-between">
              {row.map((m) => {
                const open = m.published && m.lessons.length > 0;
                const current = m.slug === first?.slug;
                return (
                  <li key={m.slug} className="flex flex-col items-center">
                    <span
                      className={`block size-5 rotate-45 rounded-[3px] border-2 ${
                        current
                          ? "border-warm bg-warm"
                          : open
                            ? "border-accent bg-accent"
                            : "border-border bg-surface"
                      }`}
                    />
                  </li>
                );
              })}
            </ol>
            <ol className="mt-3 flex justify-between text-xs tabular-nums text-muted">
              {row.map((m) => (
                <li key={m.slug} className="w-5 text-center">
                  {m.number}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {first && (
        <Link
          href={`/modules/${first.slug}/${first.lessons[0].slug}`}
          className="group mt-8 flex items-center justify-between gap-4 rounded-xl bg-warm-soft p-4 transition-colors duration-200"
        >
          <span>
            <span className="text-xs font-medium uppercase tracking-wider text-warm">
              Ви тут · Модуль {first.number}
            </span>
            <span className="mt-1 block font-medium">{first.title}</span>
            <span className="text-sm text-muted">
              {lessonsLabel(first.lessons.length)}
            </span>
          </span>
          <span className="text-warm transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
