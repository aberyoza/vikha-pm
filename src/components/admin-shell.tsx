"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

// What waits for the author: requests without a reply and payments to check.
export type AdminCounts = { feedback: number | null; payments: number | null };

const CountsContext = createContext<AdminCounts>({ feedback: null, payments: null });
export const useAdminCounts = () => useContext(CountsContext);

const SECTIONS: { href: string; label: string; count?: keyof AdminCounts; countLabel?: string }[] = [
  { href: "/admin", label: "Огляд" },
  { href: "/admin/feedback", label: "Запити на фідбек", count: "feedback", countLabel: "без відповіді" },
  { href: "/admin/access", label: "Доступ до курсу", count: "payments", countLabel: "повідомили про оплату" },
  { href: "/admin/stats", label: "Статистика" },
  { href: "/admin/lessons", label: "Уроки" },
];

async function loadCounts(): Promise<AdminCounts> {
  const supabase = createClient();
  const [feedback, access] = await Promise.all([
    supabase.from("feedback_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.rpc("admin_course_access_list"),
  ]);
  const students = (access.data ?? []) as { status: string | null; payment_claimed_at: string | null }[];
  return {
    feedback: feedback.error ? null : (feedback.count ?? 0),
    payments: access.error ? null : students.filter((s) => s.status === "pending" && s.payment_claimed_at).length,
  };
}

function useIsAdmin() {
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
  return allowed;
}

function Badge({ n, label }: { n: number | null | undefined; label?: string }) {
  if (!n) return null;
  return (
    <span className="ml-auto rounded-[3px] bg-accent px-1.5 text-sm leading-6 font-semibold text-accent-foreground tabular-nums">
      {n}
      <span className="sr-only"> {label}</span>
    </span>
  );
}

const isCurrent = (href: string, pathname: string) =>
  href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

// The frame of the admin area, like the module frame of lessons: from 1024px a
// sticky side panel with the sections, below that a row of chips above the content.
// The check here is about what to show; the proxy and the database guard the data.
export function AdminShell({ children }: { children: ReactNode }) {
  const allowed = useIsAdmin();
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const [counts, setCounts] = useState<AdminCounts>({ feedback: null, payments: null });

  // A reply or an approval usually ends with a move to another address, so the
  // counts are fresh again after every navigation inside the admin area.
  useEffect(() => {
    if (allowed) loadCounts().then(setCounts);
  }, [allowed, pathname, query]);

  // On a phone the row of sections scrolls sideways: keep the current one in view,
  // also after the counts arrive and widen the chips, without moving the page.
  const row = useRef<HTMLElement>(null);
  useEffect(() => {
    const box = row.current;
    const chip = box?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!box || !chip) return;
    const left = chip.getBoundingClientRect().left - box.getBoundingClientRect().left;
    if (left < 0 || left + chip.offsetWidth > box.clientWidth) box.scrollLeft += left - 16;
  }, [allowed, pathname, counts]);

  if (allowed !== true) {
    return (
      <main className="mx-auto max-w-[880px] px-4 py-10 sm:px-8 md:py-14">
        {allowed === undefined ? (
          <p className="text-muted">Завантажуємо…</p>
        ) : (
          <>
            <p className="text-muted">Помилка 404</p>
            <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight">Сторінку не знайдено</h1>
          </>
        )}
      </main>
    );
  }

  return (
    <CountsContext.Provider value={counts}>
      <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <nav ref={row} aria-label="Розділи адмінки" className="overflow-x-auto bg-surface px-4 py-3 [scrollbar-width:none] sm:px-8 lg:hidden">
          <ul className="flex w-max gap-2">
            {SECTIONS.map((s) => {
              const now = isCurrent(s.href, pathname);
              return (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    aria-current={now ? "page" : undefined}
                    className={`press flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
                      now ? "bg-accent text-accent-foreground" : "bg-foreground/[0.07] hover:bg-foreground/[0.12]"
                    }`}
                  >
                    {s.label}
                    {s.count && !!counts[s.count] && (
                      <span className={`tabular-nums ${now ? "" : "text-accent"}`}>
                        {counts[s.count]}
                        <span className="sr-only"> {s.countLabel}</span>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <aside className="hidden bg-surface px-7 py-9 lg:sticky lg:top-0 lg:block lg:h-dvh lg:overflow-y-auto">
          <Link href="/" className="text-[15px] text-muted transition-colors duration-200 hover:text-foreground">
            На сайт
          </Link>
          <p className="mt-7 font-display text-[22px] leading-tight font-semibold tracking-tight">Адмінка</p>
          <nav aria-label="Розділи адмінки" className="mt-6">
            <ul className="space-y-1">
              {SECTIONS.map((s) => {
                const now = isCurrent(s.href, pathname);
                return (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      aria-current={now ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-[15px] transition-colors duration-200 ${
                        now
                          ? "bg-foreground/[0.07] font-semibold text-foreground"
                          : "text-muted hover:bg-foreground/[0.05] hover:text-foreground"
                      }`}
                    >
                      {s.label}
                      {s.count && <Badge n={counts[s.count]} label={s.countLabel} />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="min-w-0 px-4 pt-10 pb-24 sm:px-12 sm:pt-12">
          <div className="mx-auto max-w-[880px]">{children}</div>
        </main>
      </div>
    </CountsContext.Provider>
  );
}
