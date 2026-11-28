import { useState } from "react";
import { getSupabaseSession } from "@/src/lib/auth/getSession";
import { api } from "@/src/lib/api";
import { MediaType } from "@riyura/props/global/mediaType";

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

      const session = await getSupabaseSession();
      if (!session) {
        console.error("No session found");
        return false;
      }

      const res = await api.request("/api/profile/history", {
        method: "DELETE",
        auth: true,
        body: { tmdb_id: tmdbId, media_type: mediaType },
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("Failed to remove history item", {
          status: res.status,
          payload,
        });
        throw new Error("Failed to remove from history");
      }

      return true;
    } catch (error) {
      console.error("Failed to remove history item:", error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteHistoryItem, isDeleting };
}
