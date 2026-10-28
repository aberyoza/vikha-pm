"use client";

import Link from "next/link";
import { useState } from "react";
import { chip, primary } from "@/components/assignment/game-kit";
import { MILESTONES } from "@/content/my-project";
import { useMyProject } from "@/lib/my-project";
import { ProjectBuilder } from "./project-builder";

// End of the module 1 game: start the own project, or show the one in progress.
export function ProjectBonus() {
  const project = useMyProject();
  const [building, setBuilding] = useState(false);

  return (
    <div className="mt-10 rounded-[4px] bg-foreground/[0.05] p-4 sm:p-5">
      {building ? (
        <>
          <h3 className="mb-4 font-display text-2xl font-semibold tracking-tight">Твій проєкт</h3>
          <ProjectBuilder initial={project} onSaved={() => setBuilding(false)} />
        </>
      ) : project ? (
        <>
          <p className="text-[13px] text-muted">Твій проєкт</p>
          <p className="mt-0.5 font-display text-xl font-semibold">{project.name}</p>
          <p className="mt-2 max-w-[60ch] leading-relaxed text-muted">
            Перша віха проєкту поставлена: зрозуміло, що створюєш, для кого і навіщо. Наступну додаси в завданні модуля
            3. Усього їх {MILESTONES.length}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/my-project" className={chip(false)}>
              Паспорт проєкту
            </Link>
            <button type="button" onClick={() => setBuilding(true)} className={chip(false)}>
              Змінити
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="font-medium">Бонус: почни свій проєкт</p>
          <p className="mt-1 max-w-[60ch] leading-relaxed text-muted">
            Хвилина з підказками: крутиш барабани «що» і «для кого» і збираєш ланцюжок цінності. Проєкт піде з тобою
            через увесь курс, і кожен модуль додасть до нього віху.
          </p>
          <button type="button" onClick={() => setBuilding(true)} className={`${primary} mt-4`}>
            Зібрати проєкт
          </button>
        </>
      )}
    </div>
  );
}
