import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminAccess } from "@/components/access/admin-access";

export const metadata: Metadata = {
  title: "Доступ до курсу",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminAccess />
    </Suspense>
  );
}
