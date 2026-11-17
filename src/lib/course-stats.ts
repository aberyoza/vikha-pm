import type { CourseModule } from "@/content/course";

// One student as `admin_course_stats()` returns them: no name, email or id.
export type StudentStats = {
  registered_at: string;
  experience: string | null;
  access_basis: string | null;
  lessons: string[];
  games: string[];
  feedback_sent: boolean;
  last_active_at: string | null;
};

export type ModuleFunnel = {
  module: CourseModule;
  started: number;
  readAll: number;
  game: number;
  stopped: number;
};

export type CourseFunnel = {
  registered: number;
  modules: ModuleFunnel[];
  feedbackSent: number;
  completed: number;
};

// The author's target: a tenth of registered students finish the course.
export const COMPLETION_TARGET = 10;
// A student with no lesson read, game finished or passport change for this long
// has stopped at their furthest module.
export const STOPPED_AFTER_DAYS = 14;
const DAY = 24 * 60 * 60 * 1000;

// The course is complete once the games of all modules are finished
// (the author's decision of 2026-11-17, docs/backlog-2026-11.md).
export function courseFunnel(students: StudentStats[], modules: CourseModule[], now: number): CourseFunnel {
  const funnel = modules.map((module) => ({ module, started: 0, readAll: 0, game: 0, stopped: 0 }));
  let feedbackSent = 0;
  let completed = 0;

  for (const s of students) {
    // Only lessons of the current program count: a renamed lesson isn't read.
    const read = new Set(s.lessons);
    const games = new Set(s.games);
    let furthest = -1;
    let gamesDone = 0;

    modules.forEach((m, i) => {
      const lessonsRead = m.lessons.filter((l) => read.has(`${m.slug}/${l.slug}`)).length;
      const game = games.has(m.slug);
      if (lessonsRead > 0) funnel[i].started++;
      if (m.lessons.length > 0 && lessonsRead === m.lessons.length) funnel[i].readAll++;
      if (game) {
        funnel[i].game++;
        gamesDone++;
      }
      if (lessonsRead > 0 || game) furthest = i;
    });

    const done = modules.length > 0 && gamesDone === modules.length;
    if (done) completed++;
    if (s.feedback_sent) feedbackSent++;

    const idle = !s.last_active_at || now - Date.parse(s.last_active_at) > STOPPED_AFTER_DAYS * DAY;
    if (!done && furthest >= 0 && idle) funnel[furthest].stopped++;
  }

  return { registered: students.length, modules: funnel, feedbackSent, completed };
}

// Percent of the registered students, or a dash when there is no one to count.
export function percentOf(n: number, registered: number) {
  return registered === 0 ? "—" : `${Math.round((n / registered) * 100)}%`;
}
