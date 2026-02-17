import { useState, useEffect } from "react";

export interface StreamUrl {
  id: string;
  name: string;
  base_url: string;
  media_type: "movie" | "tv" | "both";
  quality: string;
  is_active: boolean;
  priority: number;
}

export interface StreamServer {
  id: string;
  name: string;
  quality: string;
  link: string;
}

export function useStreamUrls(mediaType: "movie" | "tv") {
  const [streamUrls, setStreamUrls] = useState<StreamUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreamUrls = async () => {
      try {
        setLoading(true);
        const dbMediaType = mediaType === "movie" ? "Movie" : "TV";
        const response = await fetch(
          `/api/stream-urls?media_type=${dbMediaType}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch stream URLs");
        }

        const data = await response.json();

        if (data && data.length > 0) {
          console.log(
            `Loaded ${data.length} stream URLs from database for ${mediaType}`,
          );
          setStreamUrls(data);
          setError(null);
        } else {
          console.warn("No stream URLs found in database");
          setStreamUrls([]);
          setError("No stream URLs available");
        }
      } catch (err) {
        console.error("Error fetching stream URLs:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setStreamUrls([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamUrls();
  }, [mediaType]);

  const generateMovieLinks = (tmdbId: string): StreamServer[] => {
    return streamUrls.map((url) => ({
      id: url.id,
      name: url.name,
      quality: url.quality || "HD",
      link: `${url.base_url}/movie/${tmdbId}`,
    }));
  };

  const generateTVLinks = (
    tmdbId: string,
    season: number,
    episode: number,
  ): StreamServer[] => {
    return streamUrls.map((url) => ({
      id: url.id,
      name: url.name,
      quality: url.quality || "HD",
      link: `${url.base_url}/tv/${tmdbId}/${season}/${episode}`,
    }));
  };

  return {
    streamUrls,
    loading,
    error,
    generateMovieLinks,
    generateTVLinks,
  };
}
