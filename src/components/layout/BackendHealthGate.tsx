"use client";

import { useBackendHealth } from "@/src/lib/contexts/BackendHealthContext";

export function BackendHealthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useBackendHealth();

  return <>{children}</>;
}
