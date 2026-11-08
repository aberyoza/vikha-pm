"use client";

import { useEffect, useRef } from "react";
import { markLessonRead } from "@/lib/lesson-progress";

// Less than this on the page means the reader only skimmed to the bottom.
const MIN_TIME_ON_PAGE = 15_000;

// Sits right after the lesson text. The lesson counts as read once its end is on
// screen, and the reader has spent some time on the page.
export function LessonReadMark({ moduleSlug, lessonSlug }: { moduleSlug: string; lessonSlug: string }) {
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = end.current;
    if (!element) return;
    const openedAt = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      clearTimeout(timer);
      if (!entry.isIntersecting) return;
      timer = setTimeout(() => {
        markLessonRead(moduleSlug, lessonSlug);
        observer.disconnect();
      }, Math.max(0, openedAt + MIN_TIME_ON_PAGE - Date.now()));
    });
    observer.observe(element);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [moduleSlug, lessonSlug]);

  return <div ref={end} aria-hidden className="h-px" />;
}
