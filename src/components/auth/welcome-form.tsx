"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { primary } from "@/components/assignment/game-kit";
import { isValidName, safeNext } from "@/lib/auth";
import { requestSync } from "@/lib/cloud-sync";
import { createClient } from "@/lib/supabase/client";
import { ProfileFields, type ProfileDraft } from "./profile-fields";

// The form after the first login. A saved profile also records the consent.
function Form({ user, next }: { user: User; next: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<ProfileDraft>({ name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? "", experience: null, goal: "" });
  const [agreed, setAgreed] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = draft.name.trim();
    setNameError(!isValidName(name));
    if (!isValidName(name) || !agreed) return;
    setSaving(true);
    setFailed(false);
    const { error } = await createClient().from("profiles").insert({ id: user.id, name, experience: draft.experience, goal: draft.goal.trim() || null });
    setSaving(false);
    if (error) return setFailed(true);
    requestSync();
    router.replace(next);
  };

  return (
    <form onSubmit={save} noValidate className="space-y-5">
      <ProfileFields value={draft} nameError={nameError} onChange={setDraft} />
      <label className="flex items-start gap-3 leading-relaxed">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1.5 size-4 accent-[var(--accent)]" />
        <span>
          Я погоджуюся з{" "}
          <a href="/privacy" target="_blank" rel="noopener" className="underline underline-offset-4">
            Політикою конфіденційності
          </a>
        </span>
      </label>
      {failed && (
        <p role="alert" className="text-sm">
          Не вдалося зберегти профіль. Спробуйте ще раз
        </p>
      )}
      <button type="submit" disabled={!agreed || saving} className={primary}>
        Зберегти
      </button>
    </form>
  );
}

export function WelcomeForm() {
  const params = useSearchParams();
  const router = useRouter();
  const next = safeNext(params.get("next"));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.replace(`/login?next=${encodeURIComponent(next)}`);
      const { data: profile } = await supabase.from("profiles").select("id").eq("id", data.user.id).maybeSingle();
      if (profile) return router.replace(next);
      setUser(data.user);
    })();
  }, [next, router]);

  if (!user) return <p className="text-muted">Завантажуємо…</p>;
  return <Form user={user} next={next} />;
}
