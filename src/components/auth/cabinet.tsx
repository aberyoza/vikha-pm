"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { primary } from "@/components/assignment/game-kit";
import { isValidName, type Experience } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/use-session";
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

// Static shell: who is here is decided in the browser, and row-level security guards the data.
export function Cabinet() {
  const router = useRouter();
  const session = useSession();
  const [loaded, setLoaded] = useState<{ user: User; profile: ProfileDraft } | null>(null);

  useEffect(() => {
    if (session === undefined) return;
    if (session === null) return router.replace("/login?next=/cabinet");
    const supabase = createClient();
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.replace("/login?next=/cabinet");
      const { data: p } = await supabase.from("profiles").select("name, experience, goal").eq("id", data.user.id).maybeSingle();
      if (!p) return router.replace("/welcome?next=/cabinet");
      setLoaded({ user: data.user, profile: { name: p.name, experience: p.experience as Experience | null, goal: p.goal ?? "" } });
    })();
  }, [session, router]);

  if (!session || !loaded) return <p className="text-muted">Завантажуємо…</p>;
  return <ProfileForm user={loaded.user} initial={loaded.profile} />;
}
