"use client";

import { useSyncExternalStore } from "react";
import type { BoardColumn, Person, ProjectMetric, ProjectRisk, ValueStep } from "@/content/my-project";

// The reader's project lives in the browser until accounts exist. Each module
// adds its own field; `version` lets a later shape migrate old saves.
export type MyProject = {
  version: 1;
  what: string;
  who: string;
  name: string;
  value: Record<ValueStep, string>;
  // Module 3: answers to the approach questions and the chosen approach.
  approach?: { answers: number[]; kind: string; cadence: string };
  // Module 4: a tiny business case and its verdict.
  invest?: { answers: number[]; alternative: string; goal: string; verdict: string };
  // Module 5: a small stakeholder register.
  people?: Person[];
  // Module 6: who can say «stop» and what the reader decides alone.
  rules?: { sponsor: string; answers: number[] };
  // Module 7: the blocks of work and what stays out of the project.
  scope?: { blocks: string[]; out: string[] };
  // Module 8: the start, the milestones (week from the start) and three estimates of the end.
  schedule?: { start: string; milestones: { name: string; week: number }[]; a: number; m: number; b: number };
  // Module 9: a cost per block of work, the reserve in percent and how precise the estimate is.
  budget?: { items: { name: string; cost: number }[]; reserve: number; rough: boolean };
  // Module 10: the roles and, per block of work, who does it and who answers for it.
  team?: { roles: string[]; blocks: { name: string; r: string; a: string }[] };
  // Module 11: the three main risks.
  risks?: ProjectRisk[];
  // Module 12: three quality requirements and who may stop the launch.
  quality?: { metrics: ProjectMetric[]; stop: string };
  // Module 13: the method, the limit of work in progress, the rhythm and the first cards.
  board?: { method: string; limit: number; rhythm: string; cards: { name: string; column: BoardColumn }[] };
  // Module 14: the benefit, its measure, an early sign, when it is checked, by whom and what if it lags.
  benefit?: { value: string; metric: string; early: string; checks: number[]; owner: string; behind: string };
  updatedAt: string;
};

export const PROJECT_KEY = "vikha-my-project";
// `storage` fires only in other tabs, so this tab announces its own writes.
export const PROJECT_EVENT = "vikha-my-project-change";
// Game results changed in this tab.
export const GAME_EVENT = "vikha-game-change";

export const subscribeGames = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener(GAME_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(GAME_EVENT, cb);
  };
};

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener(PROJECT_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(PROJECT_EVENT, cb);
  };
};
const readRaw = () => {
  try {
    return localStorage.getItem(PROJECT_KEY);
  } catch {
    return null;
  }
};

export const parseProject = (raw: string | null): MyProject | null => {
  try {
    const p = raw ? JSON.parse(raw) : null;
    return p && p.version === 1 && typeof p.name === "string" && p.value ? (p as MyProject) : null;
  } catch {
    return null;
  }
};

export function saveProject(p: MyProject) {
  try {
    localStorage.setItem(PROJECT_KEY, JSON.stringify(p));
  } catch {
    // Private mode or storage disabled: nothing to keep it in.
  }
  window.dispatchEvent(new Event(PROJECT_EVENT));
}

// The raw string is the snapshot, so React compares it by value.
export function useMyProject() {
  return parseProject(useSyncExternalStore(subscribe, readRaw, () => null));
}
