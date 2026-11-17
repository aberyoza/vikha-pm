import type { Metadata } from "next";
import { AdminStats } from "@/components/admin-stats";

export const metadata: Metadata = {
  title: "Статистика",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminStats />;
}
