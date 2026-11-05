"use client";

import { useEffect, useId, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { MILESTONES } from "@/content/my-project";
import { flushCloudSync } from "@/lib/cloud-sync";
import { FEEDBACK_DAYS, FEEDBACK_NOTE_MAX, formatDate } from "@/lib/feedback";
import { doneMilestones } from "@/lib/milestones";
import type { MyProject } from "@/lib/my-project";
import { createClient } from "@/lib/supabase/client";

const field =
  "w-full rounded-[4px] bg-foreground/[0.07] px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

type Pending = { id: string; created_at: string };

// Sending the passport to the author: the form, then the waiting state.
export function FeedbackPanel({ project, userId }: { project: MyProject; userId: string }) {
  const id = useId();
  const [pending, setPending] = useState<Pending | null | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [justSent, setJustSent] = useState(false);
  const milestones = doneMilestones(project);

  useEffect(() => {
    createClient()
      .from("feedback_requests")
      .select("id, created_at")
      .eq("user_id", userId)
      .eq("status", "pending")
      .maybeSingle()
      .then(({ data }) => setPending(data));
  }, [userId]);

  const send = async () => {
    setBusy(true);
    setFailed(null);
    const synced = await flushCloudSync();
    const response = synced ? await fetch("/api/feedback/request", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ note }) }).catch(() => null) : null;
    const created = response?.ok ? ((await response.json()) as { id: string }) : null;
    setBusy(false);
    if (!created) return setFailed(response?.status === 429 ? "Забагато запитів за добу. Спробуйте завтра" : "Не вдалося надіслати. Спробуйте ще раз");
    setPending({ id: created.id, created_at: new Date().toISOString() });
    setJustSent(true);
    setOpen(false);
    setNote("");
  };

  const cancel = async () => {
    if (!pending) return;
    setBusy(true);
    setFailed(null);
    const { error } = await createClient().rpc("cancel_feedback_request", { request_id: pending.id });
    setBusy(false);
    if (error) return setFailed("Не вдалося скасувати. Спробуйте ще раз");
    setPending(null);
    setJustSent(false);
  };

  if (pending === undefined) return null;

  return (
    <section className="mt-8 rounded-[4px] bg-surface p-4 sm:p-5 print:hidden">
      <h3 className="font-display text-xl font-semibold">Фідбек автора</h3>
      {pending ? (
        <div className="mt-2">
          <p role="status" className="leading-relaxed">
            {justSent ? `Паспорт надіслано. Автор відповість протягом ${FEEDBACK_DAYS} днів` : `Очікує на фідбек. Надіслано ${formatDate(pending.created_at)}`}
          </p>
          <button type="button" onClick={cancel} disabled={busy} className={`${chip(false)} mt-3`}>
            Скасувати запит
          </button>
        </div>
      ) : !open ? (
        <div className="mt-2">
          <p className="max-w-[60ch] leading-relaxed text-muted">Автор прочитає копію паспорта й напише, що вийшло, а що варто посилити.</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setOpen(true)} disabled={milestones === 0} className={primary}>
              Надіслати на фідбек
            </button>
            {milestones === 0 && <span className="text-sm text-muted">Спершу заповніть хоча б одну віху</span>}
          </div>
        </div>
      ) : (
        <div className="mt-2 space-y-3">
          <p className="tabular-nums">
            Заповнено віх: {milestones} з {MILESTONES.length}
          </p>
          <p className="max-w-[60ch] leading-relaxed text-muted">
            Автор читатиме все, що є в паспорті. Не вказуйте в ньому конфіденційну інформацію роботодавця чи клієнта.
          </p>
          <div>
            <label htmlFor={id} className="block text-sm font-medium">
              На що звернути увагу (необов&apos;язково)
            </label>
            <textarea id={id} value={note} maxLength={FEEDBACK_NOTE_MAX} rows={3} onChange={(e) => setNote(e.target.value)} className={`${field} mt-1`} />
            <p className="mt-1 text-[13px] text-muted tabular-nums">
              {note.length} з {FEEDBACK_NOTE_MAX}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={send} disabled={busy} className={primary}>
              Надіслати на фідбек
            </button>
            <button type="button" onClick={() => setOpen(false)} disabled={busy} className={chip(false)}>
              Скасувати
            </button>
          </div>
        </div>
      )}
      {failed && (
        <p role="alert" className="mt-3 text-sm">
          {failed}
        </p>
      )}
    </section>
  );
}
