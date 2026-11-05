"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { primary } from "@/components/assignment/game-kit";
import { EXPERIENCE } from "@/lib/auth";
import { FEEDBACK_REPLY_MAX, formatDate } from "@/lib/feedback";
import type { MyProject } from "@/lib/my-project";
import { createClient } from "@/lib/supabase/client";
import { ProjectView } from "@/components/my-project/project-view";

const field =
  "w-full rounded-[4px] bg-foreground/[0.07] px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

type Row = {
  id: string;
  snapshot: MyProject;
  milestones: number;
  note: string | null;
  status: "pending" | "answered";
  created_at: string;
  answered_at: string | null;
  profiles: { name: string; experience: string | null; goal: string | null };
  feedback_replies: { body: string } | null;
};

const selectRow = "id, snapshot, milestones, note, status, created_at, answered_at, profiles(name, experience, goal), feedback_replies(body)";

function RowLink({ row, when }: { row: Row; when: string }) {
  return (
    <li>
      <Link href={`/admin/feedback?id=${row.id}`} className="grid gap-0.5 rounded-[4px] bg-surface p-3 transition-colors duration-200 hover:bg-surface-raised sm:grid-cols-[1fr_auto] sm:gap-4">
        <span>
          <span className="font-medium">{row.profiles.name}</span>
          <span className="text-muted">, {row.snapshot.name}</span>
        </span>
        <span className="text-sm text-muted tabular-nums">
          Віх: {row.milestones}. {formatDate(when)}
        </span>
      </Link>
    </li>
  );
}

function Queue() {
  const [rows, setRows] = useState<Row[] | null>(null);
  useEffect(() => {
    createClient()
      .from("feedback_requests")
      .select(selectRow)
      .order("created_at", { ascending: true })
      .then(({ data }) => setRows((data ?? []) as unknown as Row[]));
  }, []);
  if (!rows) return <p className="text-muted">Завантажуємо…</p>;
  const pending = rows.filter((r) => r.status === "pending");
  const answered = rows.filter((r) => r.status === "answered").reverse();
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold tracking-tight">Очікують на відповідь: {pending.length}</h2>
      {pending.length === 0 ? (
        <p className="mt-2 text-muted">Нових запитів немає.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {pending.map((r) => (
            <RowLink key={r.id} row={r} when={r.created_at} />
          ))}
        </ul>
      )}
      <h2 className="mt-10 font-display text-2xl font-semibold tracking-tight">Відповіді</h2>
      {answered.length === 0 ? (
        <p className="mt-2 text-muted">Відповідей ще немає.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {answered.map((r) => (
            <RowLink key={r.id} row={r} when={r.answered_at ?? r.created_at} />
          ))}
        </ul>
      )}
    </div>
  );
}

function Request({ id }: { id: string }) {
  const fieldId = useId();
  const [row, setRow] = useState<Row | null | undefined>(undefined);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await createClient().from("feedback_requests").select(selectRow).eq("id", id).maybeSingle();
    return data as unknown as Row | null;
  }, [id]);

  useEffect(() => {
    load().then(setRow);
  }, [load]);

  const send = async () => {
    if (!body.trim()) return setProblem("Напишіть відповідь");
    setBusy(true);
    setProblem(null);
    const response = await fetch("/api/feedback/reply", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ requestId: id, body }) }).catch(() => null);
    setBusy(false);
    if (!response?.ok) return setProblem("Не вдалося надіслати. Спробуйте ще раз");
    setRow(await load());
  };

  if (row === undefined) return <p className="text-muted">Завантажуємо…</p>;
  if (row === null) return <p>Запит не знайдено. Можливо, учень його скасував.</p>;
  const experience = EXPERIENCE.find((x) => x.key === row.profiles.experience)?.name;
  return (
    <div>
      <Link href="/admin/feedback" className="underline underline-offset-4">
        До всіх запитів
      </Link>
      <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight">{row.profiles.name}</h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-[13px] text-muted">Надіслано</dt>
          <dd className="tabular-nums">{formatDate(row.created_at)}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">Досвід</dt>
          <dd>{experience ?? "Не вказано"}</dd>
        </div>
        <div>
          <dt className="text-[13px] text-muted">Мета</dt>
          <dd className="leading-snug">{row.profiles.goal ?? "Не вказано"}</dd>
        </div>
      </dl>
      {row.note && (
        <div className="mt-4 rounded-[4px] bg-accent-soft p-4">
          <p className="text-[13px] text-muted">На що звернути увагу</p>
          <p className="mt-1 leading-relaxed whitespace-pre-wrap">{row.note}</p>
        </div>
      )}
      <div className="mt-6">
        <ProjectView project={row.snapshot} />
      </div>
      <div className="mt-8 border-t border-border pt-6">
        {row.status === "answered" ? (
          <>
            <p role="status" className="font-medium">
              Відповідь надіслано
            </p>
            <p className="mt-2 leading-relaxed whitespace-pre-wrap">{row.feedback_replies?.body}</p>
          </>
        ) : (
          <>
            <label htmlFor={fieldId} className="block font-medium">
              Ваша відповідь
            </label>
            <textarea id={fieldId} value={body} maxLength={FEEDBACK_REPLY_MAX} rows={10} onChange={(e) => setBody(e.target.value)} aria-invalid={!!problem} className={`${field} mt-2`} />
            <p className="mt-1 text-[13px] text-muted tabular-nums">
              {body.length} з {FEEDBACK_REPLY_MAX}
            </p>
            {problem && (
              <p role="alert" className="mt-2 text-sm">
                {problem}
              </p>
            )}
            <button type="button" onClick={send} disabled={busy} className={`${primary} mt-3`}>
              Надіслати відповідь
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Only for the admin. The check here is about what to show; row-level security guards the data.
export function AdminFeedback() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const [allowed, setAllowed] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return setAllowed(false);
      const { data } = await supabase.from("profiles").select("is_admin").eq("id", auth.user.id).maybeSingle();
      setAllowed(!!data?.is_admin);
    })();
  }, [router]);

  if (allowed === undefined) return <p className="text-muted">Завантажуємо…</p>;
  if (!allowed) {
    return (
      <div>
        <p className="text-muted">Помилка 404</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">Сторінку не знайдено</h1>
      </div>
    );
  }
  return id ? <Request key={id} id={id} /> : <Queue />;
}
