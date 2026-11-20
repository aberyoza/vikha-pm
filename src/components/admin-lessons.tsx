"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { chip } from "@/components/assignment/game-kit";
import { modules, publishedModules } from "@/content/course";
import { formatDate } from "@/lib/feedback";
import {
  FEW_ANSWERS,
  formatShare,
  lessonClarityRows,
  lessonKey,
  type ClarityCount,
  type LessonClarityRow,
} from "@/lib/lesson-clarity-stats";
import { createClient } from "@/lib/supabase/client";

const field =
  "rounded-[4px] bg-foreground/[0.07] px-3 py-2 text-base outline-none focus-visible:outline-2 focus-visible:outline-accent";

const COLUMNS = ["Так", "Не зовсім", "Частка «Не зовсім»"] as const;

// The address of the list or of one lesson, keeping the module filter.
function href(moduleFilter: string | null, lesson?: string) {
  const q = new URLSearchParams();
  if (moduleFilter) q.set("module", moduleFilter);
  if (lesson) q.set("lesson", lesson);
  const s = q.toString();
  return s ? `/admin/lessons?${s}` : "/admin/lessons";
}

function ModuleFilter({ value }: { value: string | null }) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="mb-8">
      <label htmlFor={id} className="block font-medium">
        Модуль
      </label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => router.push(e.target.value ? `${pathname}?module=${e.target.value}` : pathname)}
        className={`${field} mt-2 block w-full max-w-md`}
      >
        <option value="">Усі модулі</option>
        {publishedModules.map((m) => (
          <option key={m.slug} value={m.slug}>
            {m.number}. {m.title}
          </option>
        ))}
      </select>
    </div>
  );
}

function List({ rows, moduleFilter }: { rows: LessonClarityRow[]; moduleFilter: string | null }) {
  const shown = moduleFilter ? rows.filter((r) => r.module.slug === moduleFilter) : rows;
  return (
    <>
      <ModuleFilter value={moduleFilter} />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Відповіді на запитання «Чи зрозумілий урок?»</caption>
          <thead>
            <tr className="border-b border-border text-sm text-muted">
              <th scope="col" className="hidden py-2 pr-4 font-medium sm:table-cell">
                Модуль
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Урок
              </th>
              {COLUMNS.map((c, i) => (
                <th key={c} scope="col" className={`py-2 pl-4 text-right font-medium ${i < 2 ? "hidden sm:table-cell" : ""}`}>
                  {i === 2 ? (
                    <>
                      Частка <span className="whitespace-nowrap">«Не зовсім»</span>
                    </>
                  ) : (
                    c
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={lessonKey(r.module.slug, r.lesson.slug)} className="border-b border-border align-baseline">
                <td className="hidden py-2.5 pr-4 tabular-nums sm:table-cell">{r.module.number}</td>
                <th scope="row" className="py-2.5 pr-4 font-normal">
                  <Link href={href(moduleFilter, lessonKey(r.module.slug, r.lesson.slug))} className="underline underline-offset-4">
                    {r.lesson.title}
                  </Link>
                  {/* On a phone the counts go under the title, so the share stays in view. */}
                  <span className="mt-0.5 block text-sm text-muted tabular-nums sm:hidden">
                    Модуль {r.module.number}. Так: {r.yes}, не зовсім: {r.unclear}
                  </span>
                  {r.few && <span className="mt-0.5 block text-sm text-muted">Мало відповідей</span>}
                </th>
                <td className="hidden py-2.5 pl-4 text-right tabular-nums sm:table-cell">{r.yes}</td>
                <td className="hidden py-2.5 pl-4 text-right tabular-nums sm:table-cell">{r.unclear}</td>
                <td className={`py-2.5 pl-4 text-right tabular-nums ${r.few ? "text-muted" : "font-semibold"}`}>
                  {formatShare(r.share)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 max-w-[64ch] space-y-2 text-sm text-muted">
        <p>
          Відповіді на запитання «Чи зрозумілий урок?» наприкінці уроку. Частка «Не зовсім» рахується від усіх відповідей
          на урок. Уроки, на які відповіли менше ніж {FEW_ANSWERS} разів, стоять у кінці списку.
        </p>
        <p>Відповіді анонімні: один браузер дає одну відповідь на урок і може її змінити.</p>
      </div>
    </>
  );
}

type Comment = { id: number; comment: string; hidden: boolean; updated_at: string };

function CommentItem({ c, onToggle }: { c: Comment; onToggle: (c: Comment) => Promise<boolean> }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const toggle = async () => {
    setBusy(true);
    setFailed(false);
    const ok = await onToggle(c);
    setBusy(false);
    setFailed(!ok);
  };
  return (
    <li className="rounded-[4px] bg-surface p-4">
      <p className="leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere]">{c.comment}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted tabular-nums">{formatDate(c.updated_at)}</span>
        <button type="button" disabled={busy} onClick={toggle} className={`${chip(false)} ml-auto py-1.5`}>
          {c.hidden ? "Повернути" : "Приховати"}
        </button>
      </div>
      {failed && (
        <p role="alert" className="mt-2 text-sm">
          {c.hidden ? "Не вдалося повернути. Спробуйте ще раз" : "Не вдалося приховати. Спробуйте ще раз"}
        </p>
      )}
    </li>
  );
}

function LessonComments({ row, moduleFilter }: { row: LessonClarityRow; moduleFilter: string | null }) {
  const [comments, setComments] = useState<Comment[] | null | "failed">(null);
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    createClient()
      .from("lesson_clarity")
      .select("id, comment, hidden, updated_at")
      .eq("module", row.module.slug)
      .eq("lesson", row.lesson.slug)
      .not("comment", "is", null)
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => setComments(error ? "failed" : ((data ?? []) as Comment[])));
  }, [row.module.slug, row.lesson.slug]);

  const toggle = async (c: Comment) => {
    const { error } = await createClient().rpc("admin_hide_lesson_comment", { comment_id: c.id, hide: !c.hidden });
    if (error) return false;
    setComments((list) => (Array.isArray(list) ? list.map((x) => (x.id === c.id ? { ...x, hidden: !c.hidden } : x)) : list));
    return true;
  };

  const shown = Array.isArray(comments) ? comments.filter((c) => !c.hidden) : [];
  const hidden = Array.isArray(comments) ? comments.filter((c) => c.hidden) : [];

  return (
    <div>
      <Link href={href(moduleFilter)} className="underline underline-offset-4">
        До всіх уроків
      </Link>
      <p className="mt-6 text-muted">
        Модуль {row.module.number}. {row.module.title}
      </p>
      <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight">{row.lesson.title}</h2>
      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
        <div>
          <dt className="text-[13px] text-muted">Так</dt>
          <dd className="font-display text-2xl font-semibold tabular-nums">{row.yes}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">Не зовсім</dt>
          <dd className="font-display text-2xl font-semibold tabular-nums">{row.unclear}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">Частка «Не зовсім»</dt>
          <dd className="font-display text-2xl font-semibold tabular-nums">{formatShare(row.share)}</dd>
        </div>
      </dl>
      {row.few && <p className="mt-2 text-sm text-muted">Мало відповідей</p>}
      <Link href={`/modules/${row.module.slug}/${row.lesson.slug}`} className="mt-4 inline-block underline underline-offset-4">
        Відкрити урок
      </Link>

      <h3 className="mt-10 font-display text-2xl font-semibold tracking-tight">Що було незрозуміло</h3>
      {comments === null ? (
        <p className="mt-3 text-muted">Завантажуємо…</p>
      ) : comments === "failed" ? (
        <p role="alert" className="mt-3">
          Не вдалося завантажити коментарі. Оновіть сторінку
        </p>
      ) : (
        <>
          {shown.length === 0 ? (
            <p className="mt-3 text-muted">Коментарів немає.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {shown.map((c) => (
                <CommentItem key={c.id} c={c} onToggle={toggle} />
              ))}
            </ul>
          )}
          <p role="status" className="mt-6 text-sm text-muted">
            {hidden.length > 0 && (
              <>
                Приховано коментарів: {hidden.length}.{" "}
                <button type="button" onClick={() => setShowHidden((v) => !v)} aria-expanded={showHidden} className="underline underline-offset-4 hover:text-foreground">
                  {showHidden ? "Сховати" : "Показати"}
                </button>
              </>
            )}
          </p>
          {showHidden && hidden.length > 0 && (
            <ul className="mt-3 space-y-2 opacity-80">
              {hidden.map((c) => (
                <CommentItem key={c.id} c={c} onToggle={toggle} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

function Lessons() {
  const params = useSearchParams();
  const [counts, setCounts] = useState<ClarityCount[] | null | "failed">(null);

  useEffect(() => {
    createClient()
      .rpc("admin_lesson_clarity")
      .then(({ data, error }) => setCounts(error ? "failed" : ((data ?? []) as ClarityCount[])));
  }, []);

  if (counts === null) return <p className="text-muted">Завантажуємо…</p>;
  if (counts === "failed") return <p role="alert">Не вдалося завантажити відповіді. Оновіть сторінку</p>;

  const rows = lessonClarityRows(counts, modules);
  const moduleParam = params.get("module");
  const moduleFilter = publishedModules.some((m) => m.slug === moduleParam) ? moduleParam : null;
  const lessonParam = params.get("lesson");
  if (lessonParam) {
    const row = rows.find((r) => lessonKey(r.module.slug, r.lesson.slug) === lessonParam);
    if (!row)
      return (
        <p>
          Урок не знайдено.{" "}
          <Link href={href(moduleFilter)} className="underline underline-offset-4">
            До всіх уроків
          </Link>
        </p>
      );
    return <LessonComments key={lessonParam} row={row} moduleFilter={moduleFilter} />;
  }
  return <List rows={rows} moduleFilter={moduleFilter} />;
}

export function AdminLessons() {
  return (
    <>
      <h1 className="mb-8 font-display text-4xl font-semibold tracking-tight">Уроки</h1>
      <Lessons />
    </>
  );
}
