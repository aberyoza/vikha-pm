"use client";

import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { MilestoneMark } from "@/components/logo";
import { MILESTONES, VALUE_STEPS } from "@/content/my-project";
import { authEnabled } from "@/lib/auth";
import { isMilestoneDone } from "@/lib/milestones";
import { parseProject, saveProject, useMyProject, type MyProject } from "@/lib/my-project";
import { useSyncState } from "@/lib/cloud-sync";
import { useSession } from "@/lib/use-session";
import { LoginPrompt } from "@/components/auth/login-prompt";
import { FeedbackPanel } from "@/components/feedback/feedback-panel";
import { ApproachEditor } from "./project-approach";
import { BenefitEditor, BenefitList } from "./project-benefit";
import { BoardEditor, BoardList } from "./project-board";
import { BudgetEditor, BudgetList } from "./project-budget";
import { InvestEditor } from "./project-invest";
import { PeopleEditor, PeopleList } from "./project-people";
import { QualityEditor, QualityList } from "./project-quality";
import { RisksEditor, RisksList } from "./project-risks";
import { RulesEditor, RulesList } from "./project-rules";
import { ScheduleEditor, ScheduleList } from "./project-schedule";
import { ScopeEditor, ScopeList } from "./project-scope";
import { TeamEditor, TeamList } from "./project-team";
import { ProjectBuilder } from "./project-builder";

const chip = "rounded-md bg-foreground/[0.07] px-3 py-2 text-sm font-medium press hover:bg-foreground/[0.12]";
const primary = "rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground press hover:brightness-110";

function download(p: MyProject) {
  const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "vikha-my-project.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function SaveStatus() {
  const user = useSession();
  const sync = useSyncState();
  if (authEnabled && user) {
    return (
      <p className="max-w-[60ch] text-sm leading-relaxed text-muted" role="status">
        {sync.status === "failed"
          ? "Не вдалося зберегти в акаунті. Зміни лишилися в цьому браузері"
          : sync.status === "saving"
            ? "Зберігаємо в акаунті…"
            : sync.status === "conflict"
              ? "Є дві версії паспорта. Виберіть потрібну вгорі сторінки"
              : sync.savedAt
                ? `Збережено в акаунті, ${new Intl.DateTimeFormat("uk-UA", { dateStyle: "short", timeStyle: "short" }).format(new Date(sync.savedAt))}`
                : "Збережено в акаунті"}
      </p>
    );
  }
  return (
    <>
      <p className="max-w-[60ch] text-sm leading-relaxed text-muted">
        Проєкт зберігається лише в цьому браузері. Збережіть його файлом, щоб не загубити або перенести на інший пристрій.
      </p>
      <LoginPrompt text="Увійдіть, щоб зберегти паспорт в акаунті й надіслати його на фідбек" />
    </>
  );
}

// The reader's project as one page: a milestone per module, filled as they go.
export function ProjectPassport({ titles, startHref }: { titles: Record<number, string>; startHref: string }) {
  const project = useMyProject();
  const user = useSession();
  // Module whose milestone is being edited.
  const [editing, setEditing] = useState<number | null>(null);
  const [importError, setImportError] = useState(false);

  const load = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const p = parseProject(await file.text());
    setImportError(!p);
    if (p) saveProject(p);
  };

  const importButton = (
    <label className={`${chip} cursor-pointer`}>
      Відкрити збережений файл
      <input type="file" accept="application/json,.json" onChange={load} className="sr-only" />
    </label>
  );
  const importNote = importError && (
    <p className="mt-3 text-sm" role="alert">
      У файлі немає проєкту з цього курсу. Потрібен файл, збережений кнопкою «Зберегти файлом».
    </p>
  );

  if (!project)
    return (
      <div className="rounded-[6px] bg-surface p-5 sm:p-8">
        <p className="max-w-[60ch] text-lg leading-relaxed">
          Проєкт ще не почато. Його збирають наприкінці гри модуля 1: два барабани, «що» і «для кого», і хвилина з
          підказками. Далі кожен модуль додає до проєкту одну віху.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={startHref} className={primary}>
            До гри модуля 1
          </Link>
          {importButton}
        </div>
        {importNote}
      </div>
    );

  const done = MILESTONES.filter((m) => isMilestoneDone(project, m.module)).length;

  return (
    <div>
      <div className="rounded-[6px] bg-surface p-5 sm:p-8">
        {/* Only when the name says something else, or the line repeats the title. */}
        {project.name !== `${project.what} для ${project.who}` && (
          <p className="text-muted">
            {project.what} для {project.who}
          </p>
        )}
        <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h2>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <ol className="flex flex-wrap gap-1.5" aria-label="Віхи проєкту">
            {MILESTONES.map((m) => (
              <li key={m.module} title={`Модуль ${m.module}: ${m.name}`}>
                <span
                  className={`block size-3 rotate-45 rounded-[2px] ${isMilestoneDone(project, m.module) ? "bg-accent" : "bg-foreground/15"}`}
                />
              </li>
            ))}
          </ol>
          <span className="text-sm text-muted tabular-nums">
            {done} з {MILESTONES.length} віх
          </span>
        </div>
      </div>

      <ol className="mt-8 space-y-3">
        {MILESTONES.map((m) => {
          const ok = isMilestoneDone(project, m.module);
          return (
            <li key={m.module} className={`rounded-[4px] p-4 sm:p-5 ${ok ? "bg-surface" : "bg-foreground/[0.03]"}`}>
              <div className="flex items-start gap-3">
                <MilestoneMark className={`mt-2 size-2.5 ${ok ? "" : "opacity-25"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-muted">
                    Модуль {m.module}. {titles[m.module]}
                  </p>
                  <h3 className={`font-display text-xl font-semibold ${ok ? "" : "text-muted"}`}>{m.name}</h3>

                  {m.module === 1 && ok && editing !== 1 && (
                    <>
                      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                        {VALUE_STEPS.map((s) => (
                          <div key={s.key}>
                            <dt className="text-[13px] text-muted">{s.name}</dt>
                            <dd className="mt-0.5 leading-snug">{project.value[s.key]}</dd>
                          </div>
                        ))}
                      </dl>
                      <button type="button" onClick={() => setEditing(1)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 1 && editing === 1 && (
                    <div className="mt-4">
                      <ProjectBuilder initial={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {m.module === 3 && project.approach && editing !== 3 && (
                    <>
                      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                        <div>
                          <dt className="text-[13px] text-muted">Підхід</dt>
                          <dd className="mt-0.5 leading-snug">{project.approach.kind}</dd>
                        </div>
                        <div>
                          <dt className="text-[13px] text-muted">Каденція</dt>
                          <dd className="mt-0.5 leading-snug">{project.approach.cadence}</dd>
                        </div>
                      </dl>
                      <button type="button" onClick={() => setEditing(3)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 3 && editing === 3 && (
                    <div className="mt-4">
                      <ApproachEditor project={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {m.module === 4 && project.invest && editing !== 4 && (
                    <>
                      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
                        <div>
                          <dt className="text-[13px] text-muted">Вердикт</dt>
                          <dd className="mt-0.5 leading-snug">{project.invest.verdict}</dd>
                        </div>
                        <div>
                          <dt className="text-[13px] text-muted">Якщо нічого не робити</dt>
                          <dd className="mt-0.5 leading-snug">{project.invest.alternative}</dd>
                        </div>
                        <div>
                          <dt className="text-[13px] text-muted">Мета</dt>
                          <dd className="mt-0.5 leading-snug">{project.invest.goal}</dd>
                        </div>
                      </dl>
                      <button type="button" onClick={() => setEditing(4)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 4 && editing === 4 && (
                    <div className="mt-4">
                      <InvestEditor project={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {m.module === 5 && project.people && editing !== 5 && (
                    <>
                      <PeopleList people={project.people} />
                      <button type="button" onClick={() => setEditing(5)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 5 && editing === 5 && (
                    <div className="mt-4">
                      <PeopleEditor project={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {m.module === 6 && project.rules && editing !== 6 && (
                    <>
                      <RulesList rules={project.rules} />
                      <button type="button" onClick={() => setEditing(6)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 6 && editing === 6 && (
                    <div className="mt-4">
                      <RulesEditor project={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {m.module === 7 && project.scope && editing !== 7 && (
                    <>
                      <ScopeList scope={project.scope} />
                      <button type="button" onClick={() => setEditing(7)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 7 && editing === 7 && (
                    <div className="mt-4">
                      <ScopeEditor project={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {m.module === 8 && project.schedule && editing !== 8 && (
                    <>
                      <ScheduleList schedule={project.schedule} />
                      <button type="button" onClick={() => setEditing(8)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 8 && editing === 8 && (
                    <div className="mt-4">
                      <ScheduleEditor project={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {m.module === 9 && project.budget && editing !== 9 && (
                    <>
                      <BudgetList budget={project.budget} />
                      <button type="button" onClick={() => setEditing(9)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 9 && editing === 9 && (
                    <div className="mt-4">
                      <BudgetEditor project={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {m.module === 10 && project.team && editing !== 10 && (
                    <>
                      <TeamList team={project.team} />
                      <button type="button" onClick={() => setEditing(10)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 10 && editing === 10 && (
                    <div className="mt-4">
                      <TeamEditor project={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {m.module === 11 && project.risks && editing !== 11 && (
                    <>
                      <RisksList project={project} risks={project.risks} />
                      <button type="button" onClick={() => setEditing(11)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 11 && editing === 11 && (
                    <div className="mt-4">
                      <RisksEditor project={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {m.module === 12 && project.quality && editing !== 12 && (
                    <>
                      <QualityList project={project} quality={project.quality} />
                      <button type="button" onClick={() => setEditing(12)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 12 && editing === 12 && (
                    <div className="mt-4">
                      <QualityEditor project={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {m.module === 13 && project.board && editing !== 13 && (
                    <>
                      <BoardList board={project.board} />
                      <button type="button" onClick={() => setEditing(13)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 13 && editing === 13 && (
                    <div className="mt-4">
                      <BoardEditor project={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {m.module === 14 && project.benefit && editing !== 14 && (
                    <>
                      <BenefitList benefit={project.benefit} />
                      <button type="button" onClick={() => setEditing(14)} className={`${chip} mt-4 print:hidden`}>
                        Змінити
                      </button>
                    </>
                  )}
                  {m.module === 14 && editing === 14 && (
                    <div className="mt-4">
                      <BenefitEditor project={project} onSaved={() => setEditing(null)} />
                    </div>
                  )}
                  {!ok && <p className="mt-1 text-sm text-muted">Відкриється в завданні модуля {m.module}.</p>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {authEnabled && user && <FeedbackPanel project={project} userId={user.id} />}

      <div className="mt-8 rounded-[4px] bg-foreground/[0.05] p-4 print:hidden">
        <SaveStatus />
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => download(project)} className={chip}>
            Зберегти файлом
          </button>
          {importButton}
          <button type="button" onClick={() => window.print()} className={chip}>
            Друкувати або PDF
          </button>
        </div>
        {importNote}
      </div>
    </div>
  );
}
