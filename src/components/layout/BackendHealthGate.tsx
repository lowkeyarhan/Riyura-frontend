"use client";

import { useBackendHealth } from "@/src/lib/contexts/BackendHealthContext";

export function BackendHealthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, shouldBlockProtectedContent } = useBackendHealth();

  if (shouldBlockProtectedContent) {
    if (status === "down") return null;

    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </main>
    );
  }

  return <>{children}</>;
}
