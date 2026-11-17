import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SignupForm } from "@/components/auth/signup-form";
import { authEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Реєстрація",
  robots: { index: false, follow: false },
};

export default function Page() {
  if (!authEnabled) notFound();
  return (
    <main className="mx-auto max-w-[560px] px-4 py-10 sm:px-8 md:py-14">
      <h1 className="mb-8 font-display text-4xl font-semibold tracking-tight">Реєстрація</h1>
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </main>
  );
}
