"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/auth/supabase";
import { ensureUserProfile } from "@/src/lib/db/database";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Authenticating...");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const finalizeAuth = async () => {
      try {
        // 1. Listen for the auth state change (More reliable than getSession + timeout)
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          await handleSession(session);
          return;
        }

        // If no session yet, setup a listener for the event that fires after code exchange
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === "SIGNED_IN" && session) {
            await handleSession(session);
          } else if (event === "SIGNED_OUT") {
            // Only redirect if we are sure it failed after a grace period
            setTimeout(() => {
              setStatus("Authentication failed. Redirecting...");
              router.replace("/auth");
            }, 3000);
          }
        });

        // Fallback: If nothing happens after 5 seconds, redirect
        setTimeout(() => {
          if (!supabase.auth.getSession().then(({ data }) => data.session)) {
            setStatus("No session detected. Please try again.");
            setTimeout(() => router.replace("/auth"), 2000);
          }
        }, 5000);

      } catch (error: any) {
        console.error("Auth Error:", error);
        setStatus(`Error: ${error.message}`);
      }
    };

    finalizeAuth();
  }, [router]);

  const handleSession = async (session: any) => {
    setStatus("Finalizing profile...");

    // Check/Create Profile
    try {
      // Wait a tiny bit for triggers (optional but helps)
      await new Promise(r => setTimeout(r, 500));

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!profile) {
        // Manual fallback if trigger failed
        await ensureUserProfile({
          uid: session.user.id,
          email: session.user.email!,
          displayName: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          photoURL: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
        });
        router.replace("/onboarding");
      } else if (!profile.onboarded) {
        router.replace("/onboarding");
      } else {
        router.replace("/home");
      }
    } catch (e) {
      console.error("Profile check failed", e);
      // Even if profile check fails, let them in, AuthGate will handle the rest
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