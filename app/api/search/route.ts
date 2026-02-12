import { NextRequest, NextResponse } from "next/server";
import {
  TMDBListResponse,
  TMDBMultiSearchResult,
  TMDBPersonSearchResult,
  TMDBSearchResult,
} from "@/src/dto/tmdb/lists";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

type TMDBPersonCombinedCreditsResponse = {
  cast: Array<
    TMDBSearchResult & {
      character?: string;
      episode_count?: number;
    }
  >;
  crew: Array<
    TMDBSearchResult & {
      job?: string;
      department?: string;
    }
  >;
};

function isPersonResult(
  item: TMDBMultiSearchResult,
): item is TMDBPersonSearchResult {
  return (item as TMDBPersonSearchResult).media_type === "person";
}

function isMediaResult(item: TMDBMultiSearchResult): item is TMDBSearchResult {
  return (
    (item as TMDBSearchResult).media_type === "movie" ||
    (item as TMDBSearchResult).media_type === "tv"
  );
}

function dedupeMedia(items: TMDBSearchResult[]): TMDBSearchResult[] {
  const seen = new Set<string>();
  const out: TMDBSearchResult[] = [];
  for (const item of items) {
    const key = `${item.media_type}:${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const type = (searchParams.get("type") || "multi").toLowerCase();

    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { results: [], error: "Missing TMDB_API_KEY" },
        { status: 500 },
      );
    }

    if (!q || q.trim().length === 0) {
      return NextResponse.json({ results: [] }, { status: 200 });
    }

    const endpoint =
      type === "movie"
        ? "search/movie"
        : type === "tv"
          ? "search/tv"
          : "search/multi";

    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      q,
    )}&include_adult=false&page=1`;

    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = (await res.json()) as TMDBListResponse<TMDBMultiSearchResult>;

    if (!res.ok) {
      return NextResponse.json(
        { results: [], error: data?.status_message || "TMDB error" },
        { status: res.status },
      );
    }

    let results: TMDBSearchResult[] = [];
    const rawResults = Array.isArray(data?.results) ? data.results : [];

    if (endpoint === "search/multi") {
      const mediaResults = rawResults.filter(isMediaResult);
      const peopleResults = rawResults.filter(isPersonResult);

      // 1) Add direct movie/tv matches
      results.push(...mediaResults);

      // 2) Expand person matches into media via `known_for` (cheap, included in multi-search)
      const knownForMedia: TMDBSearchResult[] = [];
      for (const person of peopleResults) {
        const knownFor = Array.isArray(person.known_for)
          ? person.known_for
          : [];
        for (const item of knownFor) {
          if (item?.media_type === "movie" || item?.media_type === "tv") {
            knownForMedia.push(item as TMDBSearchResult);
          }
        }
      }
      results.push(...knownForMedia);

      // 3) Expand top people matches into media via combined credits (more accurate but more expensive)
      // Limit to avoid rate limits + latency.
      const topPeople = [...peopleResults]
        .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
        .slice(0, 2);

      if (topPeople.length > 0) {
        const creditFetches = topPeople.map(async (p) => {
          const creditsUrl = `https://api.themoviedb.org/3/person/${p.id}/combined_credits?api_key=${TMDB_API_KEY}&include_adult=false`;
          try {
            const creditsRes = await fetch(creditsUrl, {
              next: { revalidate: 60 },
            });
            if (!creditsRes.ok) return [] as TMDBSearchResult[];
            const credits =
              (await creditsRes.json()) as TMDBPersonCombinedCreditsResponse;

            const cast = Array.isArray(credits?.cast) ? credits.cast : [];
            const crew = Array.isArray(credits?.crew) ? credits.crew : [];

            // Keep only movie/tv items and take a small subset per person.
            const combined = [...cast, ...crew].filter(
              (c) => c?.media_type === "movie" || c?.media_type === "tv",
            );

            // Prefer more recent items; fall back to the original order.
            combined.sort((a, b) => {
              const dateA = a.release_date || a.first_air_date || "";
              const dateB = b.release_date || b.first_air_date || "";
              if (!dateA && !dateB) return 0;
              if (!dateA) return 1;
              if (!dateB) return -1;
              return dateB.localeCompare(dateA);
            });

            return combined.slice(0, 10);
          } catch {
            return [] as TMDBSearchResult[];
          }
        });

        const creditMedia = (await Promise.all(creditFetches)).flat();
        results.push(...creditMedia);
      }

      results = dedupeMedia(results);
    } else {
      // search/movie or search/tv
      results = rawResults.filter(isMediaResult);
    }

    // Sort by release date (newest first)
    results.sort((a, b) => {
      const dateA = a.release_date || a.first_air_date || "";
      const dateB = b.release_date || b.first_air_date || "";

      // If no dates, put them at the end
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      // Sort newest first (descending)
      return dateB.localeCompare(dateA);
    });

    return NextResponse.json({ results }, { status: 200 });
  } catch (e) {
    console.error("/api/search error", e);
    return NextResponse.json(
      { results: [], error: "Unexpected error" },
      { status: 500 },
    );
  }
}
