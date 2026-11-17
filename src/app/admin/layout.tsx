import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin-shell";
import { authEnabled } from "@/lib/auth";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!authEnabled) notFound();
  return (
    <Suspense fallback={null}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
