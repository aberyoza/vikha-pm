"use client";

import { useSyncExternalStore } from "react";
import type { ValueStep } from "@/content/my-project";

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
