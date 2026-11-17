"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAdminCounts } from "@/components/admin-shell";
import { modules } from "@/content/course";
import { COMPLETION_TARGET, courseFunnel, percentOf, type StudentStats } from "@/lib/course-stats";
import { createClient } from "@/lib/supabase/client";

const WEEK = 7 * 24 * 60 * 60 * 1000;

const row =
  "grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 rounded-[4px] bg-surface p-4 transition-colors duration-200 hover:bg-surface-raised";

function Todo({ href, label, n }: { href: string; label: string; n: number | null }) {
  return (
    <li>
      <Link href={href} className={row}>
        <span>{label}</span>
        <span className={`font-display text-2xl font-semibold tabular-nums ${n ? "text-accent" : "text-muted"}`}>
          {n ?? "—"}
        </span>
      </Link>
    </li>
  );
}

function Students() {
  const [loaded, setLoaded] = useState<{ students: StudentStats[]; now: number } | null | "failed">(null);

  useEffect(() => {
    createClient()
      .rpc("admin_course_stats")
      .then(({ data, error }) => setLoaded(error ? "failed" : { students: (data ?? []) as StudentStats[], now: Date.now() }));
  }, []);

  if (loaded === null) return <p className="mt-3 text-muted">Завантажуємо…</p>;
  if (loaded === "failed") return <p role="alert" className="mt-3">Не вдалося завантажити статистику. Оновіть сторінку</p>;

  const f = courseFunnel(loaded.students, modules, loaded.now);
  const lastWeek = loaded.students.filter((s) => loaded.now - Date.parse(s.registered_at) <= WEEK).length;
  const facts = [
    { label: "Зареєструвались", value: `${f.registered}` },
    { label: "Нових за 7 днів", value: `${lastWeek}` },
    { label: "Завершили курс", value: `${percentOf(f.completed, f.registered)}`, note: `ціль ${COMPLETION_TARGET}%` },
  ];

  return (
    <>
      <dl className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-3">
        {facts.map((x) => (
          <div key={x.label} className="contents">
            <dt className="text-lg">{x.label}</dt>
            <dd className="text-right font-display text-2xl font-semibold tabular-nums">
              {x.value}
              {x.note && <span className="ml-2 font-sans text-base font-normal text-muted">{x.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
      <Link href="/admin/stats" className="mt-5 inline-block underline underline-offset-4">
        Уся статистика
      </Link>
    </>
  );
}

export function AdminOverview() {
  const counts = useAdminCounts();
  return (
    <>
      <h1 className="mb-8 font-display text-4xl font-semibold tracking-tight">Огляд</h1>
      <section>
        <h2 className="font-display text-2xl font-semibold tracking-tight">Чекає на вас</h2>
        <ul className="mt-3 space-y-2">
          <Todo href="/admin/feedback" label="Запити на фідбек без відповіді" n={counts.feedback} />
          <Todo href="/admin/access" label="Повідомили про оплату" n={counts.payments} />
        </ul>
      </section>
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Учні</h2>
        <Students />
      </section>
    </>
  );
}
