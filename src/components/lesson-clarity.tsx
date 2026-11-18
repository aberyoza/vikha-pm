"use client";

import { useId, useRef, useState } from "react";
import {
  CLARITY_COMMENT_MAX,
  commentLength,
  sendClarity,
  useSavedClarity,
  type SavedClarity,
} from "@/lib/lesson-clarity";

const SEND_ERROR = "Не вдалося надіслати. Спробуйте ще раз";
const ANSWER_LABEL = { yes: "Так", unclear: "Не зовсім" } as const;

const button =
  "rounded-md bg-foreground/[0.07] px-4 py-2 font-medium press enabled:hover:bg-foreground/[0.12] disabled:opacity-50";
const textButton =
  "font-medium underline decoration-border decoration-2 underline-offset-[6px] transition-colors duration-200 enabled:hover:decoration-accent disabled:opacity-50";
const field =
  "w-full rounded-[4px] bg-foreground/[0.07] px-3 py-2 text-base leading-relaxed outline-none focus-visible:outline-2 focus-visible:outline-accent";

type Stage = "ask" | "comment" | "thanks" | null;

// «Чи зрозумілий урок?» after «Головне з уроку» (story 14). Quiet on purpose:
// no panel and no filled button, the pager below stays the lesson's one call
// to action. Answering doesn't touch lesson progress.
export function LessonClarity({ moduleSlug, lessonSlug }: { moduleSlug: string; lessonSlug: string }) {
  const id = useId();
  const saved = useSavedClarity(moduleSlug, lessonSlug);
  const [stage, setStage] = useState<Stage>(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  // «Не зовсім» is saved at once, so it counts even if the reader leaves the form.
  const early = useRef<Promise<boolean> | null>(null);

  const view = stage ?? (saved ? "saved" : "ask");
  const length = commentLength(comment);
  const tooLong = length > CLARITY_COMMENT_MAX;

  const send = async (answer: SavedClarity) => {
    setBusy(true);
    setFailed(false);
    const ok = await sendClarity(moduleSlug, lessonSlug, answer);
    setBusy(false);
    if (!ok) return setFailed(true);
    setStage("thanks");
  };

  const answerYes = () => send({ answer: "yes" });

  const answerUnclear = () => {
    setFailed(false);
    setComment(saved?.answer === "unclear" ? (saved.comment ?? "") : "");
    early.current = saved?.answer === "unclear" ? null : sendClarity(moduleSlug, lessonSlug, { answer: "unclear" });
    setStage("comment");
  };

  const submit = async () => {
    const text = comment.trim();
    setBusy(true);
    // The early save must land first, or it could overwrite the comment.
    await early.current;
    early.current = null;
    return send(text ? { answer: "unclear", comment: text } : { answer: "unclear" });
  };

  const skip = async () => {
    if (saved?.answer === "unclear" && !early.current) return setStage("thanks");
    setBusy(true);
    const ok = (await early.current) ?? false;
    setBusy(false);
    if (ok) return setStage("thanks");
    early.current = null;
    return send({ answer: "unclear" });
  };

  const change = () => {
    setFailed(false);
    setStage("ask");
  };

  return (
    <section aria-labelledby={`${id}-q`} className="mt-12 print:hidden">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <h2 id={`${id}-q`} className="font-display text-xl font-semibold">
          Чи зрозумілий урок?
        </h2>
        {view === "ask" && (
          <div className="flex gap-2">
            <button type="button" onClick={answerYes} disabled={busy} className={button}>
              Так
            </button>
            <button type="button" onClick={answerUnclear} disabled={busy} className={button}>
              Не зовсім
            </button>
          </div>
        )}
        {view === "thanks" && (
          <p className="flex items-center gap-4">
            <span role="status">Дякуємо!</span>
            <button type="button" onClick={change} className={textButton}>
              Змінити
            </button>
          </p>
        )}
        {view === "saved" && saved && (
          <p className="flex items-center gap-4">
            <span>Ваша відповідь: «{ANSWER_LABEL[saved.answer]}»</span>
            <button type="button" onClick={change} className={textButton}>
              Змінити
            </button>
          </p>
        )}
      </div>

      {view === "comment" && (
        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor={`${id}-c`} className="block font-medium">
              Що було незрозуміло?
            </label>
            <p id={`${id}-h`} className="mt-1 text-sm text-muted">
              Не пишіть тут імен, телефонів чи пошти
            </p>
            <textarea
              id={`${id}-c`}
              value={comment}
              rows={4}
              aria-describedby={`${id}-h ${id}-n`}
              aria-invalid={tooLong || undefined}
              onChange={(e) => setComment(e.target.value)}
              className={`${field} mt-2`}
            />
            <p id={`${id}-n`} className={`mt-1 text-[13px] tabular-nums ${tooLong ? "font-medium text-foreground" : "text-muted"}`}>
              {length} з {CLARITY_COMMENT_MAX}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <button type="button" onClick={submit} disabled={busy || tooLong} className={button}>
              Надіслати
            </button>
            <button type="button" onClick={skip} disabled={busy} className={textButton}>
              Пропустити
            </button>
          </div>
        </div>
      )}

      {failed && (
        <p role="alert" className="mt-3 text-sm">
          {SEND_ERROR}
        </p>
      )}
    </section>
  );
}
