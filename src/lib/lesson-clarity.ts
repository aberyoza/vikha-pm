"use client";

import { useSyncExternalStore } from "react";
import { lessonKey } from "@/lib/lesson-progress";
import { supabaseEnv } from "@/lib/supabase/env";

// «Чи зрозумілий урок?» (story 14). The answer is anonymous: a random id kept in
// this browser stands in for the reader, so that one browser has one answer per
// lesson and can change it. The id never goes to the account.
const BROWSER_ID_KEY = "vikha-browser-id";
const ANSWERS_KEY = "vikha-lesson-clarity";
// `storage` fires only in other tabs, so this tab announces its own writes.
const CLARITY_EVENT = "vikha-clarity-change";

export const CLARITY_COMMENT_MAX = 500;

export type ClarityAnswer = "yes" | "unclear";
export type SavedClarity = { answer: ClarityAnswer; comment?: string };

// Code points, the way the database counts with char_length().
export const commentLength = (text: string) => Array.from(text).length;

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const parseAnswers = (raw: string | null): Record<string, SavedClarity> => {
  try {
    const parsed: unknown = JSON.parse(raw ?? "null");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, v]) => (v?.answer === "yes" || v?.answer === "unclear") && (v.comment === undefined || typeof v.comment === "string"),
      ),
    ) as Record<string, SavedClarity>;
  } catch {
    return {};
  }
};

// A new id if this browser has none yet; null when storage is off, because an
// id that isn't kept would add a new answer on every visit.
function browserId() {
  const existing = read(BROWSER_ID_KEY);
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
  try {
    const id = crypto.randomUUID();
    localStorage.setItem(BROWSER_ID_KEY, id);
    return localStorage.getItem(BROWSER_ID_KEY) === id ? id : null;
  } catch {
    return null;
  }
}

function remember(key: string, saved: SavedClarity) {
  try {
    localStorage.setItem(ANSWERS_KEY, JSON.stringify({ ...parseAnswers(read(ANSWERS_KEY)), [key]: saved }));
  } catch {
    // Storage disabled: the answer is saved, the browser just won't show it again.
  }
  window.dispatchEvent(new Event(CLARITY_EVENT));
}

// Saves or changes this browser's answer. Sent with the public key only, never
// with the session of a signed-in student, so the row can't be tied to a person.
// False on any failure, including a database without the migration yet.
export async function sendClarity(moduleSlug: string, lessonSlug: string, saved: SavedClarity) {
  const browser = browserId();
  if (!browser) return false;
  try {
    const { url, key } = supabaseEnv();
    const response = await fetch(`${url}/rest/v1/rpc/answer_lesson_clarity`, {
      method: "POST",
      headers: { apikey: key, "content-type": "application/json" },
      body: JSON.stringify({
        browser,
        module_slug: moduleSlug,
        lesson_slug: lessonSlug,
        answer_value: saved.answer,
        comment_text: saved.comment ?? null,
      }),
    });
    if (!response.ok) return false;
  } catch {
    return false;
  }
  remember(lessonKey(moduleSlug, lessonSlug), saved);
  return true;
}

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener(CLARITY_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(CLARITY_EVENT, cb);
  };
};

// The answer this browser gave to a lesson; null on the server and in the first
// paint, so that lesson pages stay static.
export function useSavedClarity(moduleSlug: string, lessonSlug: string): SavedClarity | null {
  const raw = useSyncExternalStore(subscribe, () => read(ANSWERS_KEY), () => null);
  return parseAnswers(raw)[lessonKey(moduleSlug, lessonSlug)] ?? null;
}
