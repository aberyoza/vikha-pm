import type { CourseModule, Lesson } from "@/content/course";

// Below this many answers a lesson's share says little: it goes to the end of
// the list with «Мало відповідей».
export const FEW_ANSWERS = 5;

// One row of admin_lesson_clarity().
export type ClarityCount = { module: string; lesson: string; yes: number; unclear: number };

export type LessonClarityRow = {
  module: CourseModule;
  lesson: Lesson;
  yes: number;
  unclear: number;
  total: number;
  // Share of «Не зовсім», 0–1; null without answers.
  share: number | null;
  few: boolean;
};

export const lessonKey = (moduleSlug: string, lessonSlug: string) => `${moduleSlug}/${lessonSlug}`;

export const formatShare = (share: number | null) => (share === null ? "—" : `${Math.round(share * 100)}%`);

// Every published lesson with its counts, the most unclear first. Lessons with
// fewer than FEW_ANSWERS answers come last, in the same order among themselves.
// Answers to lessons no longer in the program are left out.
export function lessonClarityRows(counts: ClarityCount[], modules: CourseModule[]): LessonClarityRow[] {
  const byLesson = new Map(counts.map((c) => [lessonKey(c.module, c.lesson), c]));
  const rows: LessonClarityRow[] = modules
    .filter((m) => m.published)
    .flatMap((m) =>
      m.lessons.map((lesson) => {
        const c = byLesson.get(lessonKey(m.slug, lesson.slug));
        const yes = Number(c?.yes ?? 0);
        const unclear = Number(c?.unclear ?? 0);
        const total = yes + unclear;
        return { module: m, lesson, yes, unclear, total, share: total ? unclear / total : null, few: total < FEW_ANSWERS };
      }),
    );
  // Array.prototype.sort is stable, so equal rows keep the course order.
  return rows.sort((a, b) => Number(a.few) - Number(b.few) || (b.share ?? -1) - (a.share ?? -1));
}
