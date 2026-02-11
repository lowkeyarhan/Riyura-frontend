import { supabase } from "@/src/lib/auth/supabase";
import {
  MediaType,
  WatchHistoryDbItem,
  WatchlistDbItem,
  WatchlistRequest,
  WatchHistoryRequest,
} from "@/src/dto/media";

// Profile Functions ----
export async function ensureUserProfile(user: {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}) {
  const now = new Date().toISOString();

  // First check if profile exists
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.uid)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  if (!data) {
    // Profile doesn't exist, create it
    const profile = {
      id: user.uid,
      email: user.email,
      display_name: user.displayName,
      photo_url: user.photoURL,
      onboarded: false,
      last_login: now,
    };

    // Use upsert instead of insert to handle race conditions
    const { data: insertedData, error: insertError } = await supabase
      .from("profiles")
      .upsert(profile, { onConflict: "id" })
      .select()
      .single();

    if (insertError) throw insertError;
    return insertedData;
  }

  // Update last login
  const { data: updatedData } = await supabase
    .from("profiles")
    .update({ last_login: now })
    .eq("id", user.uid)
    .select()
    .single();

  return updatedData || data;
}

// Add a movie or TV show to watchlist
export async function addToWatchlist(userId: string, item: WatchlistRequest) {
  console.log("📌 [addToWatchlist] Adding item:", {
    userId,
    tmdb_id: item.tmdb_id,
    title: item.title,
    media_type: item.media_type,
    seasons: item.number_of_seasons,
    episodes: item.number_of_episodes,
  });

  const { data, error } = await supabase
    .from("watchlist")
    .insert({
      user_id: userId,
      ...item,
    })
    .select()
    .single();

  if (error) {
    console.error("❌ [addToWatchlist] Error:", {
      message: error.message,
      code: error.code,
      details: error.details,
    });
    throw error;
  }

  console.log("✅ [addToWatchlist] Successfully added:", data);
  return data as WatchlistDbItem;
}

// Remove from watchlist
export async function removeFromWatchlist(
  userId: string,
  tmdbId: number,
  mediaType: MediaType,
) {
  console.log("🗑️ [removeFromWatchlist] Removing item:", {
    userId,
    tmdbId,
    mediaType,
  });

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", userId)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType);

  if (error) {
    console.error("❌ [removeFromWatchlist] Error:", error.message);
    throw error;
  }

  console.log("✅ [removeFromWatchlist] Successfully removed");
}

// Get user's watchlist
export async function getWatchlist(userId: string): Promise<WatchlistDbItem[]> {
  console.log("📋 [getWatchlist] Fetching watchlist for user:", userId);

  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", userId)
    .order("added_at", { ascending: false });

  if (error) {
    console.error("❌ [getWatchlist] Error:", error.message);
    throw error;
  }

  console.log("✅ [getWatchlist] Found items:", data?.length || 0);
  return data || [];
}

// Check if item is in watchlist
export async function isInWatchlist(
  userId: string,
  tmdbId: number,
  mediaType: MediaType,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", userId)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType)
    .maybeSingle();

  if (error) {
    console.error("❌ [isInWatchlist] Error:", error.message);
    throw error;
  }

  const inWatchlist = !!data;
  console.log(`🔍 [isInWatchlist] Item ${tmdbId} in watchlist:`, inWatchlist);
  return inWatchlist;
}

// Get watchlist by type
export async function getWatchlistByType(
  userId: string,
  mediaType: MediaType,
): Promise<WatchlistDbItem[]> {
  console.log(
    `🎬 [getWatchlistByType] Fetching ${mediaType} watchlist for user:`,
    userId,
  );

  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", userId)
    .eq("media_type", mediaType)
    .order("added_at", { ascending: false });

  if (error) {
    console.error("❌ [getWatchlistByType] Error:", error.message);
    throw error;
  }

  console.log(
    `✅ [getWatchlistByType] Found ${mediaType} items:`,
    data?.length || 0,
  );
  return data || [];
}

// Add to watch history
export async function addToWatchHistory(
  userId: string,
  item: WatchHistoryRequest,
) {
  const { data, error } = await supabase
    .from("watch_history")
    .insert({
      user_id: userId,
      ...item,
    })
    .select()
    .single();

  if (error) throw error;

  return data as WatchHistoryDbItem;
}

// Get watch history
export async function getWatchHistory(
  userId: string,
): Promise<WatchHistoryDbItem[]> {
  const { data, error } = await supabase
    .from("watch_history")
    .select("*")
    .eq("user_id", userId)
    .order("watched_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get recently watched (last N items)
export async function getRecentlyWatched(
  userId: string,
  limit = 10,
): Promise<WatchHistoryDbItem[]> {
  const { data, error } = await supabase
    .from("watch_history")
    .select("*")
    .eq("user_id", userId)
    .order("watched_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Mark user as onboarded
export async function markUserAsOnboarded(userId: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ onboarded: true })
    .eq("id", userId);

  if (error) {
    console.error("Failed to update onboarded status:", error);
    throw error;
  }
}

// Remove from watch history
export async function removeFromWatchHistory(
  userId: string,
  historyId: number,
) {
  const { error } = await supabase
    .from("watch_history")
    .delete()
    .eq("user_id", userId)
    .eq("id", historyId);

  if (error) throw error;
}
