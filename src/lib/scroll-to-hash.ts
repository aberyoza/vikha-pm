"use client";

import { useEffect } from "react";

// Blocks that read the browser's storage appear only after hydration, so on a
// link with #id the browser has already scrolled to the spot before they were
// there. Scroll once more when `ready` turns true.
export function useScrollToHash(ready: boolean) {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (ready && id) document.getElementById(id)?.scrollIntoView();
  }, [ready]);
}
