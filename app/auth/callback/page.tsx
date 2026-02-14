"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/auth/supabase";
import { ensureUserProfile } from "@/src/lib/db/database";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Authenticating...");
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double-execution in React Strict Mode
    if (processedRef.current) return;
    processedRef.current = true;

    const finalizeAuth = async () => {
      try {
        console.log("🔍 Checking for existing session...");

        // 1. Immediate check: Handles cases where the session is already processed from the URL
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

        // 2. Event Listener: Listens for the SIGNED_IN event triggered by the OAuth code exchange
        console.log(
          "⏳ No session found yet, waiting for auth state change...",
        );

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log(`📣 Auth Event Received: ${event}`);
          if (event === "SIGNED_IN" && session) {
            subscription.unsubscribe(); // Clean up immediately after success
            await handleSession(session);
          } else if (event === "SIGNED_OUT") {
            setStatus("Authentication failed. Redirecting...");
            setTimeout(() => router.replace("/auth"), 2000);
          }
        });

        // 3. Robust Fallback Timeout: Fixes the "stuck" issue by properly awaiting the session check
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
      // Short delay to ensure database triggers have finished creating the profile row
      await new Promise((r) => setTimeout(r, 800));

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        console.log("🆕 Profile not found, performing manual profile sync...");
        await ensureUserProfile({
          uid: session.user.id,
          email: session.user.email!,
          displayName:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            "User",
          photoURL:
            session.user.user_metadata?.avatar_url ||
            session.user.user_metadata?.picture,
        });
        router.replace("/onboarding");
      } else if (!profile.onboarded) {
        router.replace("/onboarding");
      } else {
        console.log("🚀 Profile ready, heading home.");
        router.replace("/home");
      }
    } catch (e) {
      console.error("⚠️ Profile verification warning:", e);
      // Fallback: If profile check fails, we still let them in as they ARE authenticated
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
