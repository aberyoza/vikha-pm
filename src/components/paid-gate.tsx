import type { ReactNode } from "react";
import { hasCourseAccess } from "@/lib/course-access";

// Must sit inside <Suspense>: reading the session keeps everything in here out
// of the prerendered page, and children aren't rendered at all without access.
export async function PaidGate({ paywall, children }: { paywall: ReactNode; children: ReactNode }) {
  return (await hasCourseAccess()) ? children : paywall;
}
