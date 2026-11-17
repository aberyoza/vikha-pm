import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin-overview";

export const metadata: Metadata = {
  title: "Адмінка",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminOverview />;
}
