"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/auth/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Authenticating...");
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const finalizeAuth = async () => {
      try {
        console.log("🔍 Checking for existing session...");

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          console.log("✅ Session found immediately.");
          await handleSession(session);
          return;
        }

        console.log(
          "⏳ No session found yet, waiting for auth state change...",
        );

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log(`📣 Auth Event Received: ${event}`);
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
            console.warn(
              "⚠️ Auth timeout: No session detected after 5 seconds.",
            );
            setStatus("Session not found. Please try again.");
            setTimeout(() => router.replace("/auth"), 1500);
          }
        }, 5000);
      } catch (error: any) {
        console.error("❌ Auth Callback Critical Error:", error);
        setStatus(`Error: ${error.message || "Something went wrong"}`);
        setTimeout(() => router.replace("/auth"), 3000);
      }
    };

    finalizeAuth();
  }, [router]);

  const handleSession = async (session: any) => {
    setStatus("Finalizing your profile...");
    console.log("👤 User ID:", session.user.id);

    try {
      const res = await fetch("/api/profile/onboard", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!res.ok) {
        console.warn("⚠️ Could not fetch onboarding status, sending to home.");
        router.replace("/home");
        return;
      }

      const { onboarded } = await res.json();

      if (!onboarded) {
        router.replace("/onboarding");
      } else {
        console.log("🚀 Profile ready, heading home.");
        router.replace("/home");
      }
    } catch (e) {
      console.error("⚠️ Profile verification warning:", e);
      router.replace("/home");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 font-medium tracking-wide animate-pulse">
        {status}
      </p>
    </div>
  );
}
