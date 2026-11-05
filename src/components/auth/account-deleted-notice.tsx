"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const isDeleted = () => new URLSearchParams(window.location.search).get("deleted") === "1";

// Read from the address in the browser, so the home page stays fully static.
export function AccountDeletedNotice() {
  const deleted = useSyncExternalStore(subscribe, isDeleted, () => false);
  if (!deleted) return null;
  return (
    <p role="status" className="mx-auto mt-6 max-w-[1200px] rounded-[4px] bg-accent-soft p-3 leading-relaxed">
      Акаунт видалено
    </p>
  );
}
