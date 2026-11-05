"use client";

import { useEffect } from "react";
import { primary } from "@/components/assignment/game-kit";
import { MILESTONES } from "@/content/my-project";
import { resolveConflict, startCloudSync, useSyncState } from "@/lib/cloud-sync";
import { doneMilestones, type MyProject } from "@/lib/my-project";
import { useSession } from "@/lib/use-session";

const when = (iso: string) => new Intl.DateTimeFormat("uk-UA", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));

function Version({ title, project, onKeep }: { title: string; project: MyProject; onKeep: () => void }) {
  return (
    <div className="rounded-[4px] bg-background p-4">
      <p className="text-[13px] text-muted">{title}</p>
      <p className="mt-1 font-medium leading-snug">{project.name}</p>
      <p className="mt-1 text-sm text-muted tabular-nums">
        Віх: {doneMilestones(project)} з {MILESTONES.length}. Зміни від {when(project.updatedAt)}
      </p>
      <button type="button" onClick={onKeep} className={`${primary} mt-3`}>
        Лишити цей
      </button>
    </div>
  );
}

// Runs the sync for a signed-in student and asks when two passports disagree.
export function CloudSync() {
  const user = useSession();
  const sync = useSyncState();
  const userId = user?.id;

  useEffect(() => {
    if (userId) return startCloudSync(userId);
  }, [userId]);

  if (sync.status !== "conflict" || !sync.conflict) return null;
  return (
    <section role="alertdialog" aria-label="Вибір версії паспорта" className="border-b border-border bg-surface px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-[880px]">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Є дві різні версії паспорта проєкту</h2>
        <p className="mt-1 leading-relaxed text-muted">Виберіть версію, яку лишити. Інша зникне з акаунта й цього браузера.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Version title="У цьому браузері" project={sync.conflict.local} onKeep={() => resolveConflict("local")} />
          <Version title="В акаунті" project={sync.conflict.cloud} onKeep={() => resolveConflict("cloud")} />
        </div>
      </div>
    </section>
  );
}
