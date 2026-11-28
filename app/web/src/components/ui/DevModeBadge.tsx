"use client";

import { isDevMode } from "@/src/lib/app-env";

export default function DevModeBadge() {
  if (!isDevMode()) return null;

  return (
    <div className="pointer-events-none fixed left-3 top-3 z-[9999] rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
      Dev
    </div>
  );
}
