import { MILESTONES } from "@/content/my-project";
import type { MyProject } from "@/lib/my-project";

// Modules add their milestones here as their games get a project step.
export const isMilestoneDone = (p: MyProject, module: number) => {
  const fields: Record<number, unknown> = {
    1: p.name,
    3: p.approach,
    4: p.invest,
    5: p.people,
    6: p.rules,
    7: p.scope,
    8: p.schedule,
    9: p.budget,
    10: p.team,
    11: p.risks,
    12: p.quality,
    13: p.board,
    14: p.benefit,
  };
  return !!fields[module];
};

export const doneMilestones = (p: MyProject) => MILESTONES.filter((m) => isMilestoneDone(p, m.module)).length;
