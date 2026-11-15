"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, WifiOff } from "lucide-react";
import { useBackendHealth } from "@/src/lib/contexts/BackendHealthContext";
import ErrorScreen from "@/src/components/ui/ErrorScreen";

export function ServersDownModal() {
  const { status, isChecking, retry } = useBackendHealth();
  const wasDownRef = useRef(false);

  useEffect(() => {
    if (status === "down") wasDownRef.current = true;
    else if (status === "up" || status === "idle") wasDownRef.current = false;
  }, [status]);

  const isVisible = status === "down" || (isChecking && wasDownRef.current);

  useEffect(() => {
    if (!isVisible) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="servers-down"
          role="alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] overflow-y-auto bg-[#0a0e1a]"
        >
          <ErrorScreen
            hero={
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-2xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  <WifiOff
                    className="h-8 w-8 text-white/70"
                    strokeWidth={1.5}
                  />
                </div>
                <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#0a0e1a] bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.7)]" />
              </div>
            }
            title="We're reconnecting."
            description="Our servers are taking a short breather. Try again in a moment."
            actions={
              <>
                <button
                  onClick={retry}
                  disabled={isChecking}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95 disabled:opacity-60"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`}
                  />
                  {isChecking ? "Checking..." : "Try again"}
                </button>
                <Link
                  href="/landing"
                  className="apple-glass rounded-full px-6 py-3 text-sm font-medium text-white/70 transition hover:text-white active:scale-95"
                >
                  Back to landing
                </Link>
              </>
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
