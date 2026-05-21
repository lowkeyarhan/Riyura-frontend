"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) supabase.auth.signOut();
      setUser(error ? null : (session?.user ?? null));
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Derive commonly used auth presentation fields
  const firstName = useMemo(() => {
    const displayName =
      user?.user_metadata?.display_name || user?.user_metadata?.full_name;
    if (!displayName) return null;
    return displayName.trim().split(/\s+/)[0];
  }, [user?.user_metadata]);

  const fullName = useMemo(() => {
    return (
      user?.user_metadata?.display_name ||
      user?.user_metadata?.full_name ||
      null
    );
  }, [user?.user_metadata]);

  const avatarUrl =
    user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, firstName, fullName, avatarUrl, signOut } as const;
}
