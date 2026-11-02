"use client";

import { useSyncExternalStore } from "react";
import type { Person, ValueStep } from "@/content/my-project";

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
  updatedAt: string;
};

const KEY = "vikha-my-project";
// `storage` fires only in other tabs, so this tab announces its own writes.
const EVENT = "vikha-my-project-change";

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
};
const readRaw = () => {
  try {
    return localStorage.getItem(KEY);
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
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Private mode or storage disabled: nothing to keep it in.
  }
  window.dispatchEvent(new Event(EVENT));
}

// The raw string is the snapshot, so React compares it by value.
export function useMyProject() {
  return parseProject(useSyncExternalStore(subscribe, readRaw, () => null));
}
