"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/use-session";

const trigger = "rounded-md px-3 py-2 text-[15px] font-medium transition-colors duration-200 hover:bg-foreground/[0.07]";
const item = "block w-full rounded-[4px] px-3 py-2 text-left text-[15px] transition-colors duration-200 hover:bg-foreground/[0.07]";

// The sign-in button for a guest, the account menu for a student.
export function AccountMenu() {
  const user = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  // Holds the place until the session is known, so the header doesn't jump.
  if (user === undefined) return <span aria-hidden className={`${trigger} invisible`}>Увійти</span>;

  if (!user) {
    return (
      <Link href={`/login?next=${encodeURIComponent(pathname)}`} className={trigger}>
        Увійти
      </Link>
    );
  }

  const signOut = async () => {
    setOpen(false);
    await createClient().auth.signOut();
    router.refresh();
  };

  return (
    <div ref={box} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={trigger}>
        Акаунт
      </button>
      {open && (
        <div role="menu" className="absolute top-full right-0 z-20 mt-1 w-44 rounded-[6px] bg-surface-raised p-1 shadow-lg">
          <Link role="menuitem" href="/cabinet" onClick={() => setOpen(false)} className={item}>
            Мій кабінет
          </Link>
          <button type="button" role="menuitem" onClick={signOut} className={item}>
            Вийти
          </button>
        </div>
      )}
    </div>
  );
}
