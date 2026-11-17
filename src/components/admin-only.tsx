"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

// Shows the admin pages only to the admin, and a 404 to everyone else. The check
// here is about what to show; the database guards the data.
export function AdminOnly({ children }: { children: ReactNode }) {
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
  return children;
}
