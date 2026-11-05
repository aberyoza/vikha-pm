import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FeedbackReply } from "@/components/feedback/my-feedback";
import { authEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Фідбек автора",
  robots: { index: false, follow: false },
};

export default function Page() {
  if (!authEnabled) notFound();
  return (
    <main className="mx-auto max-w-[880px] px-4 py-10 sm:px-8 md:py-14">
      <h1 className="mb-6 font-display text-4xl font-semibold tracking-tight">Фідбек автора</h1>
      <Suspense fallback={null}>
        <FeedbackReply />
      </Suspense>
    </main>
  );
}
