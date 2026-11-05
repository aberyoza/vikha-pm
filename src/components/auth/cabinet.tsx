"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { primary } from "@/components/assignment/game-kit";
import { isValidName, type Experience } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/use-session";
import { FeedbackList } from "@/components/feedback/my-feedback";
import { DeleteAccount } from "./delete-account";
import { ProfileFields, type ProfileDraft } from "./profile-fields";

function ProfileForm({ user, initial }: { user: User; initial: ProfileDraft }) {
  const [draft, setDraft] = useState(initial);
  const [nameError, setNameError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"saved" | "failed" | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = draft.name.trim();
    setNameError(!isValidName(name));
    setStatus(null);
    if (!isValidName(name)) return;
    setSaving(true);
    const { error } = await createClient().from("profiles").update({ name, experience: draft.experience, goal: draft.goal.trim() || null }).eq("id", user.id);
    setSaving(false);
    setStatus(error ? "failed" : "saved");
  };

  return (
    <form onSubmit={save} noValidate className="space-y-5">
      <div>
        <p className="text-sm font-medium">Email</p>
        <p className="mt-1 leading-relaxed text-muted">{user.email}</p>
      </div>
      <ProfileFields
        value={draft}
        nameError={nameError}
        onChange={(v) => {
          setDraft(v);
          setStatus(null);
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={saving} className={primary}>
          Зберегти
        </button>
        {status === "saved" && <span role="status">Зміни збережено</span>}
        {status === "failed" && <span role="alert">Не вдалося зберегти зміни. Спробуйте ще раз</span>}
      </div>
    </form>
  );
}

function EmailToggle({ userId, initial }: { userId: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  const [failed, setFailed] = useState(false);
  const change = async (next: boolean) => {
    setOn(next);
    setFailed(false);
    const { error } = await createClient().from("profiles").update({ emails_enabled: next }).eq("id", userId);
    if (error) {
      setOn(!next);
      setFailed(true);
    }
  };
  return (
    <div className="mt-6">
      <label className="flex items-start gap-3 leading-relaxed">
        <input type="checkbox" checked={on} onChange={(e) => change(e.target.checked)} className="mt-1.5 size-4 accent-[var(--accent)]" />
        <span>Листи про фідбек</span>
      </label>
      {failed && (
        <p role="alert" className="mt-1 text-sm">
          Не вдалося зберегти зміну. Спробуйте ще раз
        </p>
      )}
    </div>
  );
}

// Static shell: who is here is decided in the browser, and row-level security guards the data.
export function Cabinet() {
  const router = useRouter();
  const session = useSession();
  const [loaded, setLoaded] = useState<{ user: User; profile: ProfileDraft; emailsEnabled: boolean } | null>(null);

  useEffect(() => {
    if (session === undefined) return;
    if (session === null) return router.replace("/login?next=/cabinet");
    const supabase = createClient();
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.replace("/login?next=/cabinet");
      const { data: p } = await supabase.from("profiles").select("name, experience, goal, emails_enabled").eq("id", data.user.id).maybeSingle();
      if (!p) return router.replace("/welcome?next=/cabinet");
      setLoaded({ user: data.user, profile: { name: p.name, experience: p.experience as Experience | null, goal: p.goal ?? "" }, emailsEnabled: p.emails_enabled });
    })();
  }, [session, router]);

  if (!session || !loaded) return <p className="text-muted">Завантажуємо…</p>;
  return (
    <>
      <ProfileForm user={loaded.user} initial={loaded.profile} />
      <FeedbackList userId={loaded.user.id} />
      <EmailToggle userId={loaded.user.id} initial={loaded.emailsEnabled} />
      <DeleteAccount />
    </>
  );
}
