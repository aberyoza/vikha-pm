import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NewPasswordForm } from "@/components/auth/new-password-form";
import { authEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Новий пароль",
  robots: { index: false, follow: false },
};

export default function Page() {
  if (!authEnabled) notFound();
  return (
    <main className="mx-auto max-w-[560px] px-4 py-10 sm:px-8 md:py-14">
      <h1 className="mb-8 font-display text-4xl font-semibold tracking-tight">Новий пароль</h1>
      <Suspense fallback={null}>
        <NewPasswordForm />
      </Suspense>
    </main>
  );
}
