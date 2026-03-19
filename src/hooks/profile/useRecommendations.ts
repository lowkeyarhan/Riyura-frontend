import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import type { RecommendationProp } from "@/src/props/profile/recommendation";

interface RecommendationsData {
  recommendations: RecommendationProp[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useRecommendations(
  userId: string | undefined,
  hasApiKey: boolean,
): RecommendationsData {
  const [recommendations, setRecommendations] = useState<RecommendationProp[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchRecommendations = useCallback(
    async (forceRefresh = false) => {
      if (!userId || !hasApiKey || isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setIsLoading(true);
        setError(null);

        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const url = forceRefresh
          ? "/api/profile/recommendations?refresh=true"
          : "/api/profile/recommendations";

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setRecommendations(data.recommendations ?? []);
        } else {
          const errorData = await res.json();
          setError(errorData.error || "Failed to load recommendations");
        }
      } catch {
        setError("Failed to load recommendations");
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [userId, hasApiKey],
  );

  useEffect(() => {
    if (!userId || !hasApiKey) return;
    fetchRecommendations();
  }, [userId, hasApiKey]);

  const refresh = useCallback(() => {
    fetchRecommendations(true);
  }, [fetchRecommendations]);

  return { recommendations, isLoading, error, refresh };
}
