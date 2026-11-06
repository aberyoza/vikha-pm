import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminAccess } from "@/components/access/admin-access";
import { authEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Доступ до курсу",
  robots: { index: false, follow: false },
};

export default function Page() {
  if (!authEnabled) notFound();
  return (
    <main className="mx-auto max-w-[880px] px-4 py-10 sm:px-8 md:py-14">
      <Suspense fallback={null}>
        <AdminAccess />
      </Suspense>
    </main>
  );
}
