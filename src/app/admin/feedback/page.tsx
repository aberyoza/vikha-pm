import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminFeedback } from "@/components/feedback/admin-feedback";
import { authEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Запити на фідбек",
  robots: { index: false, follow: false },
};

export default function Page() {
  if (!authEnabled) notFound();
  return (
    <main className="mx-auto max-w-[880px] px-4 py-10 sm:px-8 md:py-14">
      <Suspense fallback={null}>
        <AdminFeedback />
      </Suspense>
    </main>
  );
}
