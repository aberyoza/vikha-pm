"use client";

import { useMemo, useSyncExternalStore } from "react";
import { GAME_EVENT } from "@/lib/my-project";

// The browser keeps which lessons were read; the account gets a copy through
// cloud-sync. Lessons never become unread, so two devices simply add up.
export const LESSONS_KEY = "vikha-lessons-read";
// `storage` fires only in other tabs, so this tab announces its own writes.
export const LESSON_EVENT = "vikha-lesson-change";

const GAME_SLUGS = Array.from({ length: 14 }, (_, k) => `module-${String(k + 1).padStart(2, "0")}`);
const VALID_KEY = /^module-\d{2}\/[a-z0-9-]{1,80}$/;

export type ReadLessons = Record<string, string>;

export const lessonKey = (moduleSlug: string, lessonSlug: string) => `${moduleSlug}/${lessonSlug}`;

export const parseReadLessons = (raw: string | null): ReadLessons => {
  try {
    const parsed: unknown = JSON.parse(raw ?? "null");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(([key, at]) => VALID_KEY.test(key) && typeof at === "string" && !Number.isNaN(Date.parse(at))),
    ) as ReadLessons;
  } catch {
    return {};
  }
};

const readRaw = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

export function markLessonRead(moduleSlug: string, lessonSlug: string) {
  const all = parseReadLessons(readRaw(LESSONS_KEY));
  const key = lessonKey(moduleSlug, lessonSlug);
  if (all[key]) return;
  try {
    localStorage.setItem(LESSONS_KEY, JSON.stringify({ ...all, [key]: new Date().toISOString() }));
  } catch {
    // Private mode or storage disabled: the lesson still reads, it just isn't counted.
    return;
  }
  window.dispatchEvent(new Event(LESSON_EVENT));
}

const isGameDone = (slug: string) => {
  try {
    return !!JSON.parse(readRaw(`vikha-assignment-${slug}`) ?? "null")?.completedAt;
  } catch {
    return false;
  }
};

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener(LESSON_EVENT, cb);
  window.addEventListener(GAME_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(LESSON_EVENT, cb);
    window.removeEventListener(GAME_EVENT, cb);
  };
};

const SEPARATOR = "\n";
const snapshot = () => [GAME_SLUGS.filter(isGameDone).join(","), readRaw(LESSONS_KEY) ?? ""].join(SEPARATOR);
const serverSnapshot = () => SEPARATOR;

// Empty on the server and in the first paint, so that pages stay static.
export function useCourseProgress() {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return useMemo(() => {
    const at = raw.indexOf(SEPARATOR);
    return {
      games: new Set(raw.slice(0, at).split(",").filter(Boolean)),
      read: parseReadLessons(raw.slice(at + 1) || null),
    };
  }, [raw]);
}

export type ModuleOutline = { slug: string; lessons: string[]; game: boolean };

// Where the student stopped: the furthest module with any progress, or the one
// after it once that module is finished. -1 for someone who hasn't started.
export function currentModuleIndex(outline: ModuleOutline[], read: ReadLessons, games: Set<string>) {
  const isDone = (m: ModuleOutline, lesson: string) => !!read[lessonKey(m.slug, lesson)];
  for (let i = outline.length - 1; i >= 0; i--) {
    const m = outline[i];
    const lessonsDone = m.lessons.filter((l) => isDone(m, l)).length;
    const gameDone = games.has(m.slug);
    if (lessonsDone === 0 && !gameDone) continue;
    const finished = lessonsDone === m.lessons.length && (!m.game || gameDone);
    const next = outline.findIndex((x, k) => k > i && x.lessons.length > 0);
    return finished && next >= 0 ? next : i;
  }
  return -1;
}
