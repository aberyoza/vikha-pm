"use client";

import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { MilestoneMark } from "@/components/logo";
import { MILESTONES, VALUE_STEPS } from "@/content/my-project";
import { parseProject, saveProject, useMyProject, type MyProject } from "@/lib/my-project";
import { ApproachEditor } from "./project-approach";
import { InvestEditor } from "./project-invest";
import { ProjectBuilder } from "./project-builder";

const chip = "rounded-md bg-foreground/[0.07] px-3 py-2 text-sm font-medium press hover:bg-foreground/[0.12]";
const primary = "rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground press hover:brightness-110";

// Modules add their milestones here as their games get a project step.
const isDone = (p: MyProject, module: number) =>
  module === 1 ? !!p.name : module === 3 ? !!p.approach : module === 4 ? !!p.invest : false;

function download(p: MyProject) {
  const blob = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "vikha-my-project.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

// The reader's project as one page: a milestone per module, filled as they go.
export function ProjectPassport({ titles, startHref }: { titles: Record<number, string>; startHref: string }) {
  const project = useMyProject();
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
      Завантажити з файлу
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

  const done = MILESTONES.filter((m) => isDone(project, m.module)).length;

  return (
    <div>
      <div className="rounded-[6px] bg-surface p-5 sm:p-8">
        <p className="text-muted">
          {project.what} для {project.who}
        </p>
        <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h2>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <ol className="flex flex-wrap gap-1.5" aria-label="Віхи проєкту">
            {MILESTONES.map((m) => (
              <li key={m.module} title={`Модуль ${m.module}: ${m.name}`}>
                <span
                  className={`block size-3 rotate-45 rounded-[2px] ${isDone(project, m.module) ? "bg-accent" : "bg-foreground/15"}`}
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
          const ok = isDone(project, m.module);
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
                  {!ok && <p className="mt-1 text-sm text-muted">Відкриється в завданні модуля {m.module}.</p>}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 rounded-[4px] bg-foreground/[0.05] p-4 print:hidden">
        <p className="max-w-[60ch] text-sm leading-relaxed text-muted">
          Проєкт зберігається лише в цьому браузері. Збережи його файлом, щоб не загубити або перенести на інший
          пристрій. Коли з&apos;явиться кабінет, проєкт переїде туди.
        </p>
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
