"use client";

import { MILESTONES, VALUE_STEPS } from "@/content/my-project";
import { isMilestoneDone } from "@/lib/milestones";
import type { MyProject } from "@/lib/my-project";
import { BenefitList } from "./project-benefit";
import { BoardList } from "./project-board";
import { BudgetList } from "./project-budget";
import { PeopleList } from "./project-people";
import { QualityList } from "./project-quality";
import { RisksList } from "./project-risks";
import { RulesList } from "./project-rules";
import { ScheduleList } from "./project-schedule";
import { ScopeList } from "./project-scope";
import { TeamList } from "./project-team";

function Fields({ rows }: { rows: { name: string; value: string }[] }) {
  return (
    <dl className="mt-3 grid gap-3 sm:grid-cols-3">
      {rows.map((r) => (
        <div key={r.name}>
          <dt className="text-[13px] text-muted">{r.name}</dt>
          <dd className="mt-0.5 leading-snug">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// A passport to read, as it was sent: no buttons, only the filled milestones.
export function ProjectView({ project }: { project: MyProject }) {
  return (
    <div>
      <p className="text-muted">
        {project.what} для {project.who}
      </p>
      <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight">{project.name}</h3>
      <ol className="mt-4 space-y-3">
        {MILESTONES.filter((m) => isMilestoneDone(project, m.module)).map((m) => (
          <li key={m.module} className="rounded-[4px] bg-background p-4">
            <h4 className="font-display text-lg font-semibold">{m.name}</h4>
            {m.module === 1 && <Fields rows={VALUE_STEPS.map((s) => ({ name: s.name, value: project.value[s.key] }))} />}
            {m.module === 3 && project.approach && (
              <Fields
                rows={[
                  { name: "Підхід", value: project.approach.kind },
                  { name: "Каденція", value: project.approach.cadence },
                ]}
              />
            )}
            {m.module === 4 && project.invest && (
              <Fields
                rows={[
                  { name: "Вердикт", value: project.invest.verdict },
                  { name: "Якщо нічого не робити", value: project.invest.alternative },
                  { name: "Мета", value: project.invest.goal },
                ]}
              />
            )}
            {m.module === 5 && project.people && <PeopleList people={project.people} />}
            {m.module === 6 && project.rules && <RulesList rules={project.rules} />}
            {m.module === 7 && project.scope && <ScopeList scope={project.scope} />}
            {m.module === 8 && project.schedule && <ScheduleList schedule={project.schedule} />}
            {m.module === 9 && project.budget && <BudgetList budget={project.budget} />}
            {m.module === 10 && project.team && <TeamList team={project.team} />}
            {m.module === 11 && project.risks && <RisksList project={project} risks={project.risks} />}
            {m.module === 12 && project.quality && <QualityList project={project} quality={project.quality} />}
            {m.module === 13 && project.board && <BoardList board={project.board} />}
            {m.module === 14 && project.benefit && <BenefitList benefit={project.benefit} />}
          </li>
        ))}
      </ol>
    </div>
  );
}
