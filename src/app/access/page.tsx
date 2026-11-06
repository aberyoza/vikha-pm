import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AccessPanel } from "@/components/access/access-panel";
import { authEnabled } from "@/lib/auth";
import { FIRST_PAID_MODULE, paywallEnabled } from "@/lib/paywall";

export const metadata: Metadata = {
  title: `Доступ до модулів ${FIRST_PAID_MODULE}–14`,
  robots: { index: false, follow: false },
};

export default function Page() {
  if (!authEnabled || !paywallEnabled) notFound();
  return (
    <main className="mx-auto max-w-[640px] px-4 py-10 sm:px-8 md:py-14">
      <h1 className="mb-8 font-display text-4xl font-semibold tracking-tight">Доступ до модулів {FIRST_PAID_MODULE}–14</h1>
      <Suspense fallback={null}>
        <AccessPanel />
      </Suspense>
    </main>
  );
}
