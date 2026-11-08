"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clearCourseData, flushCloudSync } from "@/lib/cloud-sync";
import { FEEDBACK_EVENT } from "@/lib/feedback";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/use-session";

const trigger = "rounded-md px-1.5 py-2 text-sm font-medium transition-colors duration-200 hover:bg-foreground/[0.07] sm:px-3 sm:text-[15px]";
const item = "block w-full rounded-[4px] px-3 py-2 text-left text-[15px] transition-colors duration-200 hover:bg-foreground/[0.07]";

// The sign-in button for a guest, the account menu for a student.
export function AccountMenu() {
  const user = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [unread, setUnread] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    const count = () =>
      createClient()
        .from("feedback_replies")
        .select("id, feedback_requests!inner(user_id)", { count: "exact", head: true })
        .is("read_at", null)
        .eq("feedback_requests.user_id", userId)
        .then(({ count: n }) => setUnread(n ?? 0));
    count();
    // Only decides whether to show the link: the server checks again on /admin.
    createClient()
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data?.is_admin));
    window.addEventListener(FEEDBACK_EVENT, count);
    return () => window.removeEventListener(FEEDBACK_EVENT, count);
  }, [userId]);

  // Holds the place until the session is known, so the header doesn't jump.
  if (user === undefined) return <span aria-hidden className={`${trigger} invisible`}>Увійти</span>;

  if (!user) {
    return (
      <Link href={`/login?next=${encodeURIComponent(pathname)}`} className={trigger}>
        Увійти
      </Link>
    );
  }

  const leave = async () => {
    setOpen(false);
    setUnsaved(false);
    await createClient().auth.signOut();
    clearCourseData();
    router.refresh();
  };
  const signOut = async () => {
    if (await flushCloudSync()) await leave();
    else setUnsaved(true);
  };

  return (
    <div ref={box} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={trigger}>
        Акаунт
        {unread > 0 && (
          <span className="ml-1.5 inline-block size-2 rounded-full bg-accent align-middle" role="img" aria-label="Є нова відповідь автора" />
        )}
      </button>
      {open && (
        <div role="menu" className="absolute top-full right-0 z-20 mt-1 w-64 rounded-[6px] bg-surface-raised p-1 shadow-lg">
          <Link role="menuitem" href="/cabinet" onClick={() => setOpen(false)} className={item}>
            Мій кабінет
          </Link>
          {isAdmin && (
            <Link role="menuitem" href="/admin/feedback" onClick={() => setOpen(false)} className={item}>
              Адмінка: запити на фідбек
            </Link>
          )}
          {isAdmin && (
            <Link role="menuitem" href="/admin/access" onClick={() => setOpen(false)} className={item}>
              Адмінка: доступ до курсу
            </Link>
          )}
          {unsaved ? (
            <div role="alert" className="px-3 py-2 text-[15px]">
              <p>Є незбережені зміни. Вийти й втратити їх?</p>
              <div className="mt-2 flex gap-1">
                <button type="button" onClick={leave} className={item}>
                  Вийти
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUnsaved(false);
                    setOpen(false);
                  }}
                  className={item}
                >
                  Лишитися
                </button>
              </div>
            </div>
          ) : (
            <button type="button" role="menuitem" onClick={signOut} className={item}>
              Вийти
            </button>
          )}
        </div>
      )}
    </div>
  );
}
