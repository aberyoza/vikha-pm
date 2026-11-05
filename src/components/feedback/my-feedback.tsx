"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FEEDBACK_EVENT, formatDate } from "@/lib/feedback";
import type { MyProject } from "@/lib/my-project";
import { createClient } from "@/lib/supabase/client";
import { ProjectView } from "@/components/my-project/project-view";

type Reply = { id: string; request_id: string; body: string; read_at: string | null; created_at: string; feedback_requests: { snapshot: MyProject } };

const selectReply = "id, request_id, body, read_at, created_at, feedback_requests!inner(snapshot, user_id)";

// The list of replies in the cabinet.
export function FeedbackList({ userId }: { userId: string }) {
  const [replies, setReplies] = useState<Reply[] | null>(null);

  useEffect(() => {
    createClient()
      .from("feedback_replies")
      .select(selectReply)
      .eq("feedback_requests.user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReplies((data ?? []) as unknown as Reply[]));
  }, [userId]);

  if (!replies) return null;
  return (
    <section className="mt-12 border-t border-border pt-6">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Фідбек автора</h2>
      {replies.length === 0 ? (
        <p className="mt-2 leading-relaxed text-muted">
          Відповідей поки немає. Паспорт можна надіслати на сторінці{" "}
          <Link href="/my-project" className="underline underline-offset-4">
            «Мій проєкт»
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {replies.map((r) => (
            <li key={r.id}>
              <Link href={`/cabinet/feedback?id=${r.request_id}`} className="flex flex-wrap items-center justify-between gap-2 rounded-[4px] bg-surface p-3 transition-colors duration-200 hover:bg-surface-raised">
                <span className="font-medium">{r.feedback_requests.snapshot.name}</span>
                <span className="text-sm text-muted tabular-nums">
                  {!r.read_at && <strong className="mr-2 font-semibold text-accent">Нова відповідь</strong>}
                  {formatDate(r.created_at)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// One reply with the passport the author read.
export function FeedbackReply() {
  const params = useSearchParams();
  const router = useRouter();
  const requestId = params.get("id");
  const [reply, setReply] = useState<Reply | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return router.replace(`/login?next=${encodeURIComponent(`/cabinet/feedback?id=${requestId ?? ""}`)}`);
      const { data } = await supabase.from("feedback_replies").select(selectReply).eq("request_id", requestId ?? "").eq("feedback_requests.user_id", auth.user.id).maybeSingle();
      const found = data as unknown as Reply | null;
      setReply(found);
      if (found && !found.read_at) {
        await supabase.from("feedback_replies").update({ read_at: new Date().toISOString() }).eq("id", found.id);
        window.dispatchEvent(new Event(FEEDBACK_EVENT));
      }
    })();
  }, [requestId, router]);

  if (reply === undefined) return <p className="text-muted">Завантажуємо…</p>;
  if (reply === null) return <p className="leading-relaxed">Відповідь не знайдено.</p>;
  return (
    <div>
      <p className="text-sm text-muted tabular-nums">{formatDate(reply.created_at)}</p>
      <p className="mt-2 rounded-[4px] bg-accent-soft p-4 leading-relaxed whitespace-pre-wrap">{reply.body}</p>
      <h2 className="mt-8 mb-3 text-sm font-medium text-muted">Паспорт, який читав автор</h2>
      <ProjectView project={reply.feedback_requests.snapshot} />
      <Link href="/cabinet" className="mt-6 inline-block underline underline-offset-4">
        До кабінету
      </Link>
    </div>
  );
}
