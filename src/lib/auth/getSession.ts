import { supabase } from "./supabase";
import type { Session } from "@supabase/supabase-js";

/**
 * Returns the current Supabase session, or null if there is no active session.
 * Use this instead of calling `supabase.auth.getSession()` directly in hooks.
 */
export async function getSupabaseSession(): Promise<Session | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
