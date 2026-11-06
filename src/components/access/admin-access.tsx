"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { ACCESS_BASES, ACCESS_BASIS_LABEL, type AccessBasis, type AccessStatus } from "@/lib/access";
import { formatDate } from "@/lib/feedback";
import { createClient } from "@/lib/supabase/client";

type Student = {
  user_id: string;
  name: string;
  email: string;
  registered_at: string;
  status: AccessStatus | null;
  basis: AccessBasis | null;
  payment_code: string | null;
  payment_claimed_at: string | null;
  requested_at: string | null;
  decided_at: string | null;
};

type Action = AccessBasis | "revoke";

const field =
  "w-full rounded-[4px] bg-foreground/[0.07] px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

function StudentRow({ s, onChanged }: { s: Student; onChanged: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [failed, setFailed] = useState(false);
  const approved = s.status === "approved";
  const live = approved || s.status === "pending";

  const act = async (action: Action) => {
    setBusy(true);
    setFailed(false);
    const response = await fetch("/api/access/decide", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: s.user_id, action }),
    }).catch(() => null);
    if (response?.ok) await onChanged();
    else setFailed(true);
    setBusy(false);
    setConfirming(false);
  };

  return (
    <li className="rounded-[4px] bg-surface p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p>
          <span className="font-medium">{s.name}</span> <span className="text-muted [overflow-wrap:anywhere]">{s.email}</span>
        </p>
        {s.payment_code && <p className="font-medium tabular-nums">{s.payment_code}</p>}
      </div>
      <p className="mt-1 text-sm text-muted">
        {approved && s.basis
          ? `Доступ відкрито: ${ACCESS_BASIS_LABEL[s.basis]}${s.decided_at ? `, ${formatDate(s.decided_at)}` : ""}`
          : s.status === "pending"
            ? s.payment_claimed_at
              ? `Повідомив про оплату ${formatDate(s.payment_claimed_at)}`
              : `Запит ${formatDate(s.requested_at!)}, оплати ще немає`
            : s.status === "revoked"
              ? `Доступ закрито${s.decided_at ? ` ${formatDate(s.decided_at)}` : ""}`
              : `Зареєструвався ${formatDate(s.registered_at)}`}
      </p>
      {confirming ? (
        <div role="alertdialog" aria-label="Підтвердження" className="mt-3">
          <p className="leading-relaxed">
            {approved ? "Закрити доступ до платних модулів?" : "Відхилити запит?"} Учень не отримає листа.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => act("revoke")} className="rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background press disabled:opacity-40">
              {approved ? "Закрити доступ" : "Відхилити"}
            </button>
            <button type="button" disabled={busy} onClick={() => setConfirming(false)} className={chip(false)}>
              Скасувати
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {ACCESS_BASES.filter((b) => !(approved && s.basis === b)).map((b) => (
            <button
              key={b}
              type="button"
              disabled={busy}
              onClick={() => act(b)}
              className={b === "paid" && s.status === "pending" ? `${primary} py-2 text-sm` : chip(false)}
            >
              {approved ? `Змінити на «${ACCESS_BASIS_LABEL[b]}»` : ACCESS_BASIS_LABEL[b]}
            </button>
          ))}
          {live && (
            <button type="button" disabled={busy} onClick={() => setConfirming(true)} className={chip(false)}>
              {approved ? "Закрити доступ" : "Відхилити"}
            </button>
          )}
        </div>
      )}
      {failed && (
        <p role="alert" className="mt-2 text-sm">
          Не вдалося зберегти. Спробуйте ще раз
        </p>
      )}
    </li>
  );
}

function Group({ title, empty, rows, onChanged }: { title: string; empty: string; rows: Student[]; onChanged: () => Promise<void> }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        {title}: {rows.length}
      </h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {rows.map((s) => (
            <StudentRow key={s.user_id} s={s} onChanged={onChanged} />
          ))}
        </ul>
      )}
    </section>
  );
}

function Lists() {
  const searchId = useId();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [students, setStudents] = useState<Student[] | null | "failed">(null);

  const fetchStudents = useCallback(async () => {
    const { data, error } = await createClient().rpc("admin_course_access_list");
    return error ? ("failed" as const) : ((data ?? []) as Student[]);
  }, []);
  const load = useCallback(async () => setStudents(await fetchStudents()), [fetchStudents]);

  useEffect(() => {
    fetchStudents().then(setStudents);
  }, [fetchStudents]);

  if (students === null) return <p className="text-muted">Завантажуємо…</p>;
  if (students === "failed") return <p role="alert">Не вдалося завантажити список. Оновіть сторінку</p>;

  const q = query.trim().toLowerCase();
  const shown = q
    ? students.filter((s) => [s.name, s.email, s.payment_code ?? ""].some((v) => v.toLowerCase().includes(q)))
    : students;
  const claimed = shown.filter((s) => s.status === "pending" && s.payment_claimed_at);
  const waiting = shown.filter((s) => s.status === "pending" && !s.payment_claimed_at);
  const open = shown.filter((s) => s.status === "approved");
  const rest = shown.filter((s) => s.status !== "pending" && s.status !== "approved");

  return (
    <>
      <label htmlFor={searchId} className="block font-medium">
        Пошук за іменем, email або кодом платежу
      </label>
      <input id={searchId} type="search" value={query} onChange={(e) => setQuery(e.target.value)} className={`${field} mt-2 mb-10`} />
      <Group title="Повідомили про оплату" empty="Нових повідомлень немає." rows={claimed} onChanged={load} />
      <Group title="Чекають оплати" empty="Запитів без оплати немає." rows={waiting} onChanged={load} />
      <Group title="Доступ відкрито" empty="Поки ні в кого." rows={open} onChanged={load} />
      <Group title="Інші учні" empty={q ? "Нікого не знайдено." : "Інших учнів немає."} rows={rest} onChanged={load} />
    </>
  );
}

// Only for the admin. The check here is about what to show; the database guards the data.
export function AdminAccess() {
  const [allowed, setAllowed] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return setAllowed(false);
      const { data } = await supabase.from("profiles").select("is_admin").eq("id", auth.user.id).maybeSingle();
      setAllowed(!!data?.is_admin);
    })();
  }, []);

  if (allowed === undefined) return <p className="text-muted">Завантажуємо…</p>;
  if (!allowed) {
    return (
      <div>
        <p className="text-muted">Помилка 404</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">Сторінку не знайдено</h1>
      </div>
    );
  }
  return (
    <>
      <h1 className="mb-8 font-display text-4xl font-semibold tracking-tight">Доступ до курсу</h1>
      <Lists />
    </>
  );
}
