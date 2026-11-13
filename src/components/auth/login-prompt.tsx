"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { chip } from "@/components/assignment/game-kit";
import { authEnabled } from "@/lib/auth";
import { useSession } from "@/lib/use-session";

// Offered at moments when there is something to save, never in the middle of a level.
export function LoginPrompt({ text }: { text: string }) {
  const user = useSession();
  const pathname = usePathname();
  const [closed, setClosed] = useState(false);
  if (!authEnabled || user !== null || closed) return null;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[4px] bg-accent-soft p-4">
      <p className="min-w-0 flex-1 basis-56 leading-relaxed">{text}</p>
      <Link href={`/login?next=${encodeURIComponent(pathname)}`} className={chip(false)}>
        Увійти
      </Link>
      <button type="button" onClick={() => setClosed(true)} className="text-sm text-muted underline underline-offset-4">
        Не зараз
      </button>
    </div>
  );
}
