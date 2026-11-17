"use client";

import { useEffect, useState } from "react";
import { modules } from "@/content/course";
import { COMPLETION_TARGET, courseFunnel, percentOf, STOPPED_AFTER_DAYS, type StudentStats } from "@/lib/course-stats";
import { createClient } from "@/lib/supabase/client";

const COLUMNS = ["Почали", "Дочитали", "Пройшли гру", "Зупинились тут"] as const;

// The count, then its share in a quieter, fixed-width slot so the two never read as one number.
function Count({ n, of }: { n: number; of: number }) {
  return (
    <>
      {n}
      <span className="ml-2 inline-block min-w-[4ch] text-right font-sans text-[0.8em] font-normal text-muted">
        {percentOf(n, of)}
      </span>
    </>
  );
}

function Funnel({ students, now }: { students: StudentStats[]; now: number }) {
  const f = courseFunnel(students, modules, now);
  const summary = [
    { label: "Зареєструвались", value: <>{f.registered}</> },
    { label: "Надіслали паспорт на фідбек", value: <Count n={f.feedbackSent} of={f.registered} /> },
    {
      label: "Завершили курс",
      value: (
        <>
          <Count n={f.completed} of={f.registered} />
          <span className="mt-1 block font-sans text-base font-normal text-muted">ціль {COMPLETION_TARGET}%</span>
        </>
      ),
    },
  ];

  return (
    <>
      <dl className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-4">
        {summary.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-lg">{row.label}</dt>
            <dd className="text-right font-display text-3xl font-semibold tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="sr-only">Учні за модулями</caption>
          <thead>
            <tr className="border-b border-border text-sm text-muted">
              <th scope="col" className="py-2 pr-4 font-medium">
                Модуль
              </th>
              {COLUMNS.map((c) => (
                <th key={c} scope="col" className="py-2 pl-4 text-right font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {f.modules.map((row) => (
              <tr key={row.module.slug} className="border-b border-border">
                <th scope="row" className="py-2.5 pr-4 font-normal">
                  {row.module.number}. {row.module.title}
                </th>
                {[row.started, row.readAll, row.game, row.stopped].map((n, i) => (
                  <td key={COLUMNS[i]} className="py-2.5 pl-4 text-right whitespace-nowrap tabular-nums">
                    <Count n={n} of={f.registered} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 max-w-[64ch] space-y-2 text-sm text-muted">
        <p>
          Почали: прочитано хоча б один урок модуля. Дочитали: прочитано всі уроки модуля. Зупинились тут: це
          найдальший модуль учня, і понад {STOPPED_AFTER_DAYS} днів він не читав уроків, не проходив ігор і не
          змінював паспорт. Завершили курс: пройдено ігри всіх модулів.
        </p>
        <p>Відсотки рахуються від тих, хто зареєструвався.</p>
        <p>Враховано лише учнів, які увійшли. Гостей сайт не рахує.</p>
        <p>Читання уроків рахується з 8 листопада 2026 року.</p>
      </div>
    </>
  );
}

function Stats() {
  const [loaded, setLoaded] = useState<{ students: StudentStats[]; now: number } | null | "failed">(null);

  useEffect(() => {
    createClient()
      .rpc("admin_course_stats")
      .then(({ data, error }) => setLoaded(error ? "failed" : { students: (data ?? []) as StudentStats[], now: Date.now() }));
  }, []);

  if (loaded === null) return <p className="text-muted">Завантажуємо…</p>;
  if (loaded === "failed") return <p role="alert">Не вдалося завантажити статистику. Оновіть сторінку</p>;
  return <Funnel students={loaded.students} now={loaded.now} />;
}

export function AdminStats() {
  return (
    <>
      <h1 className="mb-8 font-display text-4xl font-semibold tracking-tight">Статистика</h1>
      <Stats />
    </>
  );
}
