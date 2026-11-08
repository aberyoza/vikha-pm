"use client";

import { useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";
import { LESSON_EVENT, LESSONS_KEY, parseReadLessons } from "@/lib/lesson-progress";
import { GAME_EVENT, PROJECT_EVENT, PROJECT_KEY, parseProject, type MyProject } from "@/lib/my-project";

// The browser keeps the working copy, the account keeps the shared one. `base`
// remembers the passport both agreed on last, which tells a newer version from a
// conflict without trusting the clocks of two devices.
const BASE_KEY = "vikha-sync-base";
const PUSH_DELAY = 800;

const GAME_MODULES = Array.from({ length: 14 }, (_, k) => `module-${String(k + 1).padStart(2, "0")}`);
const gameKey = (slug: string) => `vikha-assignment-${slug}`;

type Base = { userId: string; passport: string; serverAt: string };
type GameResult = { best: number; completedAt?: string };

export type SyncConflict = { local: MyProject; cloud: MyProject; cloudAt: string };
export type SyncState = { status: "idle" | "saving" | "saved" | "failed" | "conflict"; savedAt?: string; conflict?: SyncConflict };

let state: SyncState = { status: "idle" };
const listeners = new Set<() => void>();
const setState = (next: SyncState) => {
  state = next;
  listeners.forEach((l) => l());
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const IDLE: SyncState = { status: "idle" };
export const useSyncState = () => useSyncExternalStore(subscribe, () => state, () => IDLE);

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const remove = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage disabled: there is nothing to remove.
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage disabled: the account still has the data.
  }
};

// Postgres reorders the keys of jsonb, so documents are compared with sorted keys.
const canon = (v: unknown): string =>
  JSON.stringify(v, (_k, x) =>
    x && typeof x === "object" && !Array.isArray(x)
      ? Object.fromEntries(Object.entries(x as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
      : x,
  );

const readBase = (userId: string): Base | null => {
  try {
    const b = JSON.parse(read(BASE_KEY) ?? "null") as Base | null;
    return b?.userId === userId ? b : null;
  } catch {
    return null;
  }
};

// Writes coming from the account must not count as new local changes.
let applying = false;
const applyLocal = (fn: () => void, event: string) => {
  applying = true;
  fn();
  window.dispatchEvent(new Event(event));
  applying = false;
};

const readGame = (slug: string): GameResult | null => {
  try {
    return JSON.parse(read(gameKey(slug)) ?? "null") as GameResult | null;
  } catch {
    return null;
  }
};

const earliest = (a?: string | null, b?: string | null) => {
  if (!a || !b) return a ?? b ?? undefined;
  return new Date(a) < new Date(b) ? a : b;
};

// The better result of both sides ends up on both sides.
async function syncGames(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("game_results").select("module, best, completed_at");
  if (error) throw error;
  const cloud = new Map((data ?? []).map((r) => [r.module as string, r]));
  const upload: { user_id: string; module: string; best: number; completed_at: string | null }[] = [];

  for (const slug of GAME_MODULES) {
    const local = readGame(slug);
    const remote = cloud.get(slug);
    if (!local && !remote) continue;
    const best = Math.max(local?.best ?? 0, remote?.best ?? 0);
    const completedAt = earliest(local?.completedAt, remote?.completed_at);
    if (!local || local.best !== best || local.completedAt !== completedAt) {
      applyLocal(() => write(gameKey(slug), JSON.stringify({ best, completedAt })), GAME_EVENT);
    }
    if (!remote || remote.best !== best || earliest(remote.completed_at, completedAt) !== remote.completed_at) {
      upload.push({ user_id: userId, module: slug, best, completed_at: completedAt ?? null });
    }
  }
  if (upload.length > 0) {
    const { error: saveError } = await supabase.from("game_results").upsert(upload);
    if (saveError) throw saveError;
  }
}

// A lesson read on any device counts on all of them.
async function syncLessons(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("lesson_progress").select("module, lesson, read_at");
  if (error) throw error;
  const local = parseReadLessons(read(LESSONS_KEY));
  const cloud = new Map((data ?? []).map((r) => [`${r.module}/${r.lesson}`, r.read_at as string]));

  const missingHere = [...cloud].filter(([key]) => !local[key]);
  if (missingHere.length > 0) {
    applyLocal(() => write(LESSONS_KEY, JSON.stringify({ ...local, ...Object.fromEntries(missingHere) })), LESSON_EVENT);
  }
  const upload = Object.entries(local)
    .filter(([key]) => !cloud.has(key))
    .map(([key, readAt]) => {
      const [module, lesson] = key.split("/");
      return { user_id: userId, module, lesson, read_at: readAt };
    });
  if (upload.length > 0) {
    const { error: saveError } = await supabase.from("lesson_progress").upsert(upload, { ignoreDuplicates: true });
    if (saveError) throw saveError;
  }
}

const remember = (userId: string, passport: string, serverAt: string) => {
  write(BASE_KEY, JSON.stringify({ userId, passport, serverAt } satisfies Base));
  setState({ status: "saved", savedAt: serverAt });
};

const takeCloud = (userId: string, project: MyProject, text: string, serverAt: string) => {
  applyLocal(() => write(PROJECT_KEY, JSON.stringify(project)), PROJECT_EVENT);
  remember(userId, text, serverAt);
};

async function insertPassport(userId: string, local: MyProject) {
  const { data, error } = await createClient().from("project_passports").insert({ user_id: userId, data: local }).select("updated_at").single();
  if (error) throw error;
  remember(userId, canon(local), data.updated_at);
}

// Returns false when the account changed in between, so the caller looks again.
async function updatePassport(userId: string, local: MyProject, seenAt: string) {
  const { data, error } = await createClient().from("project_passports").update({ data: local }).eq("user_id", userId).eq("updated_at", seenAt).select("updated_at");
  if (error) throw error;
  if (!data || data.length === 0) return false;
  remember(userId, canon(local), data[0].updated_at);
  return true;
}

async function syncPassport(userId: string, attempt = 0): Promise<void> {
  const { data: row, error } = await createClient().from("project_passports").select("data, updated_at").maybeSingle();
  if (error) throw error;

  const local = parseProject(read(PROJECT_KEY));
  const cloud = row ? parseProject(JSON.stringify(row.data)) : null;
  if (row && !cloud) throw new Error("Unreadable passport in the account");

  if (!local && !cloud) return setState({ status: "saved" });
  if (local && !cloud) return insertPassport(userId, local);
  if (!local && cloud) return takeCloud(userId, cloud, canon(cloud), row!.updated_at);

  const localText = canon(local);
  const cloudText = canon(cloud);
  const base = readBase(userId);
  if (localText === cloudText) return remember(userId, cloudText, row!.updated_at);
  if (base?.passport === localText) return takeCloud(userId, cloud!, cloudText, row!.updated_at);
  if (base?.passport === cloudText) {
    const saved = await updatePassport(userId, local!, row!.updated_at);
    if (!saved && attempt === 0) return syncPassport(userId, 1);
    if (!saved) throw new Error("The passport keeps changing");
    return;
  }
  setState({ status: "conflict", conflict: { local: local!, cloud: cloud!, cloudAt: row!.updated_at } });
}

// One run at a time: later requests wait for the run in progress.
let queue: Promise<unknown> = Promise.resolve();
const run = (userId: string) => {
  const next = queue.then(async () => {
    if (state.status !== "conflict") setState({ ...state, status: "saving" });
    try {
      const supabase = createClient();
      // No profile means no consent yet, and nothing goes to the server before it.
      const { data: profile, error } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle();
      if (error) throw error;
      if (!profile) return setState({ status: "idle" });
      // A failure on one side must not hold back the other.
      const saved = (sync: Promise<void>) =>
        sync.then(
          () => true,
          () => false,
        );
      const games = await saved(syncGames(userId));
      const lessons = await saved(syncLessons(userId));
      await syncPassport(userId);
      if (!games || !lessons) setState({ ...state, status: "failed" });
    } catch {
      setState({ ...state, status: "failed" });
    }
  });
  queue = next;
  return next;
};

let activeUser: string | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

export function startCloudSync(userId: string) {
  activeUser = userId;
  const push = () => {
    if (applying) return;
    clearTimeout(timer);
    timer = setTimeout(() => run(userId), PUSH_DELAY);
  };
  const refresh = () => {
    if (document.visibilityState === "visible") run(userId);
  };
  const again = () => run(userId);

  window.addEventListener(PROJECT_EVENT, push);
  window.addEventListener(GAME_EVENT, push);
  window.addEventListener(LESSON_EVENT, push);
  window.addEventListener("online", again);
  window.addEventListener(SYNC_REQUEST, again);
  document.addEventListener("visibilitychange", refresh);
  run(userId);

  return () => {
    clearTimeout(timer);
    activeUser = null;
    window.removeEventListener(PROJECT_EVENT, push);
    window.removeEventListener(GAME_EVENT, push);
    window.removeEventListener(LESSON_EVENT, push);
    window.removeEventListener("online", again);
    window.removeEventListener(SYNC_REQUEST, again);
    document.removeEventListener("visibilitychange", refresh);
    setState({ status: "idle" });
  };
}

const SYNC_REQUEST = "vikha-sync-request";
// The first save of a profile opens the way to the server.
export const requestSync = () => window.dispatchEvent(new Event(SYNC_REQUEST));

// Sends what is waiting and says whether the account has everything.
export async function flushCloudSync() {
  if (!activeUser) return true;
  clearTimeout(timer);
  await run(activeUser);
  return state.status === "saved" || state.status === "idle";
}

export async function resolveConflict(side: "local" | "cloud") {
  const conflict = state.conflict;
  const userId = activeUser;
  if (!conflict || !userId) return;
  setState({ status: "saving" });
  try {
    if (side === "cloud") return takeCloud(userId, conflict.cloud, canon(conflict.cloud), conflict.cloudAt);
    const saved = await updatePassport(userId, conflict.local, conflict.cloudAt);
    if (!saved) await run(userId);
    else applyLocal(() => {}, PROJECT_EVENT);
  } catch {
    setState({ status: "conflict", conflict });
  }
}

export const forgetSyncBase = () => remove(BASE_KEY);

// After signing out, nothing personal stays on a device that may be shared.
export function clearCourseData() {
  applyLocal(() => remove(PROJECT_KEY), PROJECT_EVENT);
  applyLocal(() => GAME_MODULES.forEach((m) => remove(gameKey(m))), GAME_EVENT);
  applyLocal(() => remove(LESSONS_KEY), LESSON_EVENT);
  forgetSyncBase();
}
