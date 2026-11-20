import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLessons } from "@/components/admin-lessons";

export const metadata: Metadata = {
  title: "Уроки",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminLessons />
    </Suspense>
  );
}
