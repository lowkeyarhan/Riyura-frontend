import { NextResponse } from "next/server";
import { getCachedData } from "@/src/lib/cache";
import { MediaGridItem } from "@/src/dto/ui/card";
import { TMDBBaseListItem, TMDBListResponse } from "@/src/dto/tmdb/common";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const maxItems = limit ? parseInt(limit) : 12;

  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing TMDB_API_KEY in environment variables" },
      { status: 500 },
    );
  }

  try {
    const data = await getCachedData(
      `popular:tv`,
      async () => {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`,
          {
            headers: { accept: "application/json" },
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch popular TV shows: ${response.status}`,
          );
        }

        return (await response.json()) as TMDBListResponse<TMDBBaseListItem>;
      },
      { ttl: 3600 },
    );

    // Data is already parsed from cache or fetch

    // Genre IDs to exclude: Talk (10767), Reality (10764), Kids (10762), Soap (10766), Animation (16)
    const excludedGenres = [10767, 10764, 10762, 10766, 16];

    // Map to MediaGridItem and sanitize
    const items: MediaGridItem[] = Array.isArray(data?.results)
      ? data.results
          .filter((show) => show.poster_path) // Only items with posters
          .filter(
            (show) =>
              !show.genre_ids?.some((genreId) =>
                excludedGenres.includes(genreId),
              ),
          ) // Exclude unwanted genres
          .slice(0, maxItems) // Limit items
          .map((show) => ({
            id: show.id,
            title: show.title,
            name: show.name,
            poster_path: show.poster_path,
            vote_average: Number(show.vote_average || 0),
            release_date: show.release_date,
            first_air_date: show.first_air_date,
            overview: show.overview || "",
            media_type: "tv",
          }))
      : [];

    return NextResponse.json({ results: items });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Something went wrong" },
      { status: 500 },
    );
  }
}
