"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, CloudOff } from "lucide-react";
import { useBackendHealth } from "@/src/lib/contexts/BackendHealthContext";

export function ServersDownModal() {
  const { status, retry } = useBackendHealth();

  // Prevent background scrolling while modal is visible
  useEffect(() => {
    if (status === "down") {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [status]);

  return (
    <AnimatePresence>
      {status === "down" && (
        <motion.div
          key="servers-down"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

          {/* Atmosphere blobs — same palette as the rest of the site */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 top-8 h-[70vw] w-[80vw] rounded-full bg-cyan-500/15 blur-[120px] sm:-left-32 sm:top-16 sm:h-[55vh] sm:w-[55vw] sm:bg-cyan-500/10 sm:blur-[140px]" />
            <div className="absolute -right-20 bottom-0 h-[80vw] w-[75vw] rounded-full bg-orange-500/15 blur-[130px] sm:-right-24 sm:h-[60vh] sm:w-[50vw] sm:bg-orange-500/10 sm:blur-[160px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.55)_100%)]"></div>
          </div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-4 w-full max-w-sm rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.7)] p-5 md:p-10 text-center overflow-hidden"
          >
            {/* Inner top highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Icon */}
            <div className="mb-10 flex justify-center">
              <div className="relative">
                {/* Icon ring */}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <CloudOff
                    className="h-9 w-9 text-white/60"
                    strokeWidth={1.5}
                  />
                  {/* Zzz decoration */}
                  <div className="absolute -top-1 -right-1 flex flex-col items-start leading-none opacity-40">
                    <span className="text-[11px] font-bold text-white">z</span>
                    <span className="translate-x-2 text-[9px] font-bold text-white">
                      z
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="mb-10 space-y-3">
              <h2 className="text-2xl font-medium tracking-tight text-white/95">
                Resting Briefly
              </h2>
              <p className="text-[14px] leading-relaxed text-white/40 font-light max-w-[260px] mx-auto">
                Our systems are taking a short breath. We&apos;ll be back to
                serve you in just a moment.
              </p>
            </div>

            {/* Button */}
            <button
              onClick={retry}
              className="group relative w-full inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-white/90 active:scale-[0.98] transition-all duration-300 h-14 rounded-3xl md:rounded-2xl text-sm font-semibold"
            >
              <RefreshCw className="w-4 h-4 transition-transform duration-700 group-hover:rotate-180" />
              Try Again
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
