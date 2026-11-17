"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const isSetupRef = useRef(false);

  useEffect(() => {
    if (isSetupRef.current) return;
    isSetupRef.current = true;

    // We do not start Lenis on SSR, only on client
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Industry-standard subtle exponential ease out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      autoRaf: true,
    });

    return () => {
      isSetupRef.current = false;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
