"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { LessonPager, type PagerTarget } from "@/components/lesson-pager";
import { assignmentHref } from "@/content/assignments";
import { MILESTONES } from "@/content/my-project";
import { authEnabled } from "@/lib/auth";
import { formatDay, PROGRAM_TARGET, SUMMARY_ID } from "@/lib/course-finish";
import { formatDate } from "@/lib/feedback";
import { useCourseCompletedAt, useCourseProgress } from "@/lib/lesson-progress";
import { isMilestoneDone } from "@/lib/milestones";
import { useMyProject } from "@/lib/my-project";
import { useScrollToHash } from "@/lib/scroll-to-hash";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/use-session";

const ALL_MODULES = Array.from({ length: 14 }, (_, k) => `module-${String(k + 1).padStart(2, "0")}`);

function Diamonds({ done }: { done: Set<string> }) {
  return (
    <ol className="mt-3 flex flex-wrap gap-2" aria-label="Завдання модулів">
      {ALL_MODULES.map((slug, k) => {
        const on = done.has(slug);
        return (
          <li key={slug}>
            <a href={assignmentHref(slug)} title={`Завдання модуля ${k + 1}`} aria-label={`Завдання модуля ${k + 1}${on ? ", пройдено" : ""}`} className="grid size-6 place-items-center">
              <span aria-hidden className={`block size-3.5 rotate-45 rounded-[2px] ${on ? "bg-accent" : "bg-foreground/15"}`} />
            </a>
          </li>
        );
      })}
    </ol>
  );
}

const practice = (
  <p className="mt-4 max-w-[60ch] leading-relaxed">
    Навичка з&apos;являється в практиці. Візьміть невеликий проєкт, свій, робочий чи волонтерський, і пройдіть його за курсом: статут, зацікавлені сторони, зміст, розклад, бюджет, ризики, якість, закриття.
  </p>
);

type Request = { id: string; status: "pending" | "answered"; created_at: string };

// The latest passport sent to the author; a cancelled one counts as not sent.
function useLastRequest(userId: string | undefined) {
  const [request, setRequest] = useState<Request | null | undefined>(undefined);
  useEffect(() => {
    if (!userId) return;
    createClient()
      .from("feedback_requests")
      .select("id, status, created_at")
      .eq("user_id", userId)
      .in("status", ["pending", "answered"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => setRequest(error ? null : (data as Request | null)));
  }, [userId]);
  return userId ? request : undefined;
}

// What to do with the passport: send it, see where it is, or sign in first.
function FeedbackStep({ canSend }: { canSend: boolean }) {
  const user = useSession();
  const pathname = usePathname();
  const request = useLastRequest(user?.id);

  if (!authEnabled || user === undefined) return null;
  if (user === null)
    return (
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 basis-56 leading-relaxed">Увійдіть, щоб зберегти паспорт в акаунті й надіслати його на фідбек</p>
        <Link href={`/login?next=${encodeURIComponent(`${pathname}#${SUMMARY_ID}`)}`} className={chip(false)}>
          Увійти
        </Link>
      </div>
    );
  if (request === undefined) return null;
  if (request?.status === "pending")
    return (
      <p role="status" className="mt-5 leading-relaxed">
        Очікує на фідбек. Надіслано {formatDate(request.created_at)}
      </p>
    );
  if (request?.status === "answered")
    return (
      <p className="mt-5 leading-relaxed">
        Автор відповів на паспорт, надісланий {formatDate(request.created_at)}.{" "}
        <Link href={`/cabinet/feedback?id=${request.id}`} className="underline underline-offset-4">
          Прочитати відповідь
        </Link>
      </p>
    );
  if (!canSend) return null;
  return (
    <div className="mt-5">
      <Link href="/my-project#feedback" className={primary}>
        Надіслати на фідбек
      </Link>
    </div>
  );
}

// Under the game of module 14, once it has been finished: the end of the course
// when all 14 games are done, otherwise the games that are still left.
export function CourseSummary() {
  const { games } = useCourseProgress();
  const completedAt = useCourseCompletedAt();
  const project = useMyProject();
  const shown = games.has("module-14");

  // A link with #course-summary: the cabinet, the return from sign-in.
  useScrollToHash(shown);

  if (!shown) return null;

  if (!completedAt)
    return (
      <section className="mt-8 rounded-[4px] bg-accent-soft p-4 sm:p-5">
        <h2 className="font-display text-xl font-semibold">Це останнє завдання курсу</h2>
        <Diamonds done={games} />
        <p className="mt-3 text-sm text-muted tabular-nums">
          Завдань пройдено: {games.size} з {ALL_MODULES.length}. Сірі ромби ведуть до завдань, які ще можна пройти.
        </p>
        {practice}
      </section>
    );

  const empty = project ? MILESTONES.filter((m) => !isMilestoneDone(project, m.module)) : [];
  const filled = MILESTONES.length - (project ? empty.length : MILESTONES.length);

  return (
    <section className="mt-8 rounded-[4px] bg-accent-soft p-4 sm:p-5">
      <h2 className="font-display text-2xl font-semibold tracking-tight">Курс пройдено</h2>
      <p className="mt-1 text-muted">Ігри всіх 14 модулів пройдено {formatDay(completedAt)}</p>
      <Diamonds done={games} />

      <p className="mt-5 font-medium tabular-nums">
        Віх у паспорті: {filled} з {MILESTONES.length}
      </p>
      {empty.length > 0 && (
        <ul className="mt-2 space-y-1">
          {empty.map((m) => (
            <li key={m.module}>
              <Link href={`/my-project#milestone-${m.module}`} className="underline underline-offset-4">
                Модуль {m.module}. {m.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5">
        <Link href="/my-project" className={chip(false)}>
          Відкрити паспорт
        </Link>
      </div>
      <FeedbackStep canSend={filled > 0} />
      {practice}
    </section>
  );
}

// The pager under the game of module 14. «Підсумок курсу» leads to the summary
// only once the game is finished: before that the summary isn't on the page, and
// a link to it would do nothing.
export function CourseSummaryPager({ prev }: { prev: PagerTarget }) {
  const { games } = useCourseProgress();
  return (
    <LessonPager
      quiet
      prev={prev}
      next={games.has("module-14") ? { href: `#${SUMMARY_ID}`, label: "Далі", title: "Підсумок курсу" } : PROGRAM_TARGET}
    />
  );
}
