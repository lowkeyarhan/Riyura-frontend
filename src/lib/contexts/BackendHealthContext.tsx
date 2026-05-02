"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { usePathname } from "next/navigation";

type HealthStatus = "idle" | "checking" | "up" | "down";

interface BackendHealthContextType {
  status: HealthStatus;
  isUp: boolean;
  isChecking: boolean;
  retry: () => void;
}

const BackendHealthContext = createContext<
  BackendHealthContextType | undefined
>(undefined);

export function BackendHealthProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const [status, setStatus] = useState<HealthStatus>("idle");
  const hasCheckedRef = useRef(false);

  const isPublic =
    pathname === "/" ||
    pathname?.startsWith("/landing") ||
    pathname?.startsWith("/auth");

  const checkHealth = useCallback(async () => {
    setStatus("checking");
    try {
      const res = await fetch("/api/test/health", { cache: "no-store" });
      const data = await res.json();
      setStatus(data?.status === "UP" ? "up" : "down");
    } catch {
      setStatus("down");
    }
  }, []);

  useEffect(() => {
    if (authLoading || !user || isPublic) {
      setStatus("idle");
      hasCheckedRef.current = false;
      return;
    }

    if (!hasCheckedRef.current) {
      hasCheckedRef.current = true;
      checkHealth();
    }
  }, [authLoading, user, isPublic, checkHealth]);

  const retry = useCallback(() => {
    hasCheckedRef.current = false;
    checkHealth();
  }, [checkHealth]);

  return (
    <BackendHealthContext.Provider
      value={{
        status,
        isUp: status === "up",
        isChecking: status === "checking",
        retry,
      }}
    >
      {children}
    </BackendHealthContext.Provider>
  );
}

export function useBackendHealth() {
  const context = useContext(BackendHealthContext);
  if (!context)
    throw new Error(
      "useBackendHealth must be used within BackendHealthProvider",
    );
  return context;
}
