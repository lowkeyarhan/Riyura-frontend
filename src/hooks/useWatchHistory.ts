import { useState } from "react";
import { supabase } from "@/src/lib/auth/supabase";

interface WatchHistoryData {
  deleteHistoryItem: (itemId: number) => Promise<boolean>;
  isDeleting: boolean;
}

export function useWatchHistory(): WatchHistoryData {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteHistoryItem = async (itemId: number): Promise<boolean> => {
    try {
      setIsDeleting(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error("No session found");
        return false;
      }

      const res = await fetch(`/api/profile/history?id=${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to remove from history");

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
