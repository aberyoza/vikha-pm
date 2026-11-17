"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import { primary } from "@/components/assignment/game-kit";
import { createClient } from "@/lib/supabase/client";
import { PasswordForm } from "./password-form";

// The page the reset letter leads to: by now the link has signed the person in.
export function NewPasswordForm() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) await supabase.auth.signOut({ scope: "local" });
      setUser(data.user ?? null);
    })();
  }, []);

  if (user === undefined) return <p className="text-muted">Завантажуємо…</p>;

  if (user === null) {
    return (
      <div role="alert" className="rounded-[4px] bg-accent-soft p-3 leading-relaxed">
        <p>Посилання недійсне або застаріло. Запросіть нове</p>
        <Link href="/forgot-password" className="mt-2 inline-block font-medium underline underline-offset-4">
          Надіслати нове посилання
        </Link>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="space-y-4">
        <p role="status" className="rounded-[4px] bg-accent-soft p-3 leading-relaxed">
          Новий пароль збережено
        </p>
        <Link href="/cabinet" className={`${primary} inline-block`}>
          Перейти в кабінет
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="leading-relaxed">
        Задайте новий пароль для {user.email}. Після цього входьте з ним за email і паролем.
      </p>
      <PasswordForm email={user.email ?? ""} onSaved={() => setSaved(true)} />
    </div>
  );
}
