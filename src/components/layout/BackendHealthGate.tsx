"use client";

import { useBackendHealth } from "@/src/lib/contexts/BackendHealthContext";
import ErrorScreen from "@/src/components/ui/ErrorScreen";

export function BackendHealthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, shouldBlockProtectedContent } = useBackendHealth();

  if (shouldBlockProtectedContent) {
    if (status === "down") return null;

    return (
      <ErrorScreen
        hero={
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        }
        title="Connecting"
        description="Checking service availability."
      />
    );
  }

  return <>{children}</>;
}
