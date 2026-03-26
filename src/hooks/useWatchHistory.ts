import { useState } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import { MediaType } from "@/src/props/global/mediaType";

interface WatchHistoryData {
  deleteHistoryItem: (tmdbId: number, mediaType: MediaType) => Promise<boolean>;
  isDeleting: boolean;
}

export function useWatchHistory(): WatchHistoryData {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteHistoryItem = async (
    tmdbId: number,
    mediaType: MediaType,
  ): Promise<boolean> => {
    try {
      setIsDeleting(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error("No session found");
        return false;
      }

      console.log("🗑️ Removing watch history item", { tmdbId, mediaType });
      const res = await fetch("/api/profile/history", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tmdb_id: tmdbId, media_type: mediaType }),
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("❌ Failed to remove history item", {
          status: res.status,
          payload,
        });
        throw new Error("Failed to remove from history");
      }

      console.log("✅ History item removed", payload);

      return true;
    } catch (error) {
      console.error("Failed to remove history item:", error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteHistoryItem,
    isDeleting,
  };
}
