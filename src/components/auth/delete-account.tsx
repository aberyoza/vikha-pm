"use client";

import { useState } from "react";
import { chip } from "@/components/assignment/game-kit";
import { createClient } from "@/lib/supabase/client";

// Deleting is final, so it takes a second, explicit step.
export function DeleteAccount() {
  const [asking, setAsking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [failed, setFailed] = useState(false);

  const remove = async () => {
    setDeleting(true);
    setFailed(false);
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_own_account");
    if (error) {
      setDeleting(false);
      setFailed(true);
      return;
    }
    await supabase.auth.signOut({ scope: "local" });
    // A full reload on purpose: it drops the routes Next keeps in memory, with the deleted profile in them.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/?deleted=1");
  };

  return (
    <section className="mt-12 border-t border-border pt-6">
      {!asking ? (
        <button type="button" onClick={() => setAsking(true)} className={chip(false)}>
          Видалити акаунт
        </button>
      ) : (
        <div role="alertdialog" aria-label="Підтвердження видалення акаунта">
          <p className="leading-relaxed">Акаунт і всі ваші дані на сервері буде видалено без можливості відновлення.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={remove} disabled={deleting} className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background press disabled:opacity-60">
              Видалити назавжди
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={() => {
                setAsking(false);
                setFailed(false);
              }}
              className={chip(false)}
            >
              Скасувати
            </button>
          </div>
          {failed && (
            <p role="alert" className="mt-3 text-sm">
              Не вдалося видалити акаунт. Спробуйте ще раз
            </p>
          )}
        </div>
      )}
    </section>
  );
}
