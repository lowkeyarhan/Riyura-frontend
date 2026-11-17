"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/auth/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Authenticating...");
  const processedRef = useRef(false);

  const handleSession = useCallback(
    async (session: Session) => {
      setStatus("Finalizing your profile...");

      try {
        const res = await fetch("/api/profile/onboard", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!res.ok) {
          router.replace("/home");
          return;
        }

        const { onboarded } = await res.json();
        router.replace(onboarded ? "/home" : "/onboarding");
      } catch {
        router.replace("/home");
      }
    },
    [router],
  );

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const finalizeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          await handleSession(session);
          return;
        }

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "SIGNED_IN" && session) {
            subscription.unsubscribe();
            await handleSession(session);
          } else if (event === "SIGNED_OUT") {
            setStatus("Authentication failed. Redirecting...");
            setTimeout(() => router.replace("/auth"), 2000);
          }
        });

        setTimeout(async () => {
          const {
            data: { session: currentSession },
          } = await supabase.auth.getSession();
          if (!currentSession) {
            setStatus("Session not found. Please try again.");
            setTimeout(() => router.replace("/auth"), 1500);
          }
        }, 5000);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        setStatus(`Error: ${message}`);
        setTimeout(() => router.replace("/auth"), 3000);
      }
    };

    finalizeAuth();
  }, [router, handleSession]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 font-medium tracking-wide animate-pulse">
        {status}
      </p>
    </div>
  );
}
