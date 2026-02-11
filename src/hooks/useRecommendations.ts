import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/src/lib/auth/supabase";

interface RecommendationsData {
  recommendations: any[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useRecommendations(
  userId: string | undefined,
  hasApiKey: boolean,
): RecommendationsData {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recommendationsFetchingRef = useRef(false);

  // Shared fetch function with strict locking
  const fetchRecommendations = useCallback(
    async (forceRefresh = false) => {
      if (!userId || !hasApiKey) return;

      // Prevent duplicate calls if already fetching
      if (recommendationsFetchingRef.current) {
        console.log(`🚫 [Recommendations] Already fetching, skipping call`);
        return;
      }

      try {
        recommendationsFetchingRef.current = true;
        setIsLoading(true);
        setError(null);

        console.log(`🎬 [Recommendations] Fetching for user: ${userId}`);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const res = await fetch("/api/gemini/recommendations", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setRecommendations(data.recommendations || []);
            console.log(
              `✅ [Recommendations] Fetched ${
                data.recommendations?.length || 0
              } recommendations`,
            );
          } else {
            const errorData = await res.json();
            setError(errorData.error || "Failed to load recommendations");
            console.error(`❌ [Recommendations] Error:`, errorData.error);
          }
        }
      } catch (err) {
        console.error(`🔥 [Recommendations] Failed:`, err);
        setError("Failed to load recommendations");
      } finally {
        setIsLoading(false);
        recommendationsFetchingRef.current = false;
      }
    },
    [userId, hasApiKey],
  );

  // Initial Load
  useEffect(() => {
    if (!userId || !hasApiKey) return;
    fetchRecommendations();
  }, [userId, hasApiKey]);

  // Expose refresh function for manual refresh
  const refresh = useCallback(() => {
    fetchRecommendations(true);
  }, [fetchRecommendations]);

  return {
    recommendations,
    isLoading,
    error,
    refresh,
  };
}
