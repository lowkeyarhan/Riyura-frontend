import { NextResponse } from "next/server";
import { TMDBDiscoverItem, TMDBListResponse } from "@/src/dto/tmdb/lists";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const MOVIE_GENRE_MAP: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Sci-Fi": 878,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

const TV_GENRE_MAP: Record<string, number> = {
  Action: 10759,
  Adventure: 10759,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 10765,
  History: 10768,
  Horror: 9648,
  Music: 10402,
  Mystery: 9648,
  Romance: 10766,
  "Sci-Fi": 10765,
  Thriller: 9648,
  War: 10768,
  Western: 37,
};

const buildApiParams = (
  page: string,
  genreNames: string[],
  genreMap: Record<string, number>,
) => {
  const genreIds = genreNames
    .map((name) => genreMap[name.trim()])
    .filter(Boolean)
    .join(",");

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY!,
    include_adult: "false",
    language: "en-US",
    sort_by: "popularity.desc",
    page,
  });

  if (genreIds) params.set("with_genres", genreIds);

  return params;
};

export async function GET(request: Request) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: "API Key missing" }, { status: 500 });
  }

  try {
    // 2. Parse URL Parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const mediaType = searchParams.get("mediaType") || "movie";
    const genreNames = searchParams.get("genres")?.split(",") || [];

    const movieParams = buildApiParams(page, genreNames, MOVIE_GENRE_MAP);
    const tvParams = buildApiParams(page, genreNames, TV_GENRE_MAP);

    // 4. Scenario A: Fetch "All" (Movies + TV mixed)
    if (mediaType === "all") {
      const [movieRes, tvRes] = await Promise.all([
        fetch(`${BASE_URL}/discover/movie?${movieParams}`),
        fetch(`${BASE_URL}/discover/tv?${tvParams}`),
      ]);

      if (!movieRes.ok || !tvRes.ok) {
        const movieError = !movieRes.ok
          ? `movie:${movieRes.status} ${movieRes.statusText}`
          : "";
        const tvError = !tvRes.ok
          ? `tv:${tvRes.status} ${tvRes.statusText}`
          : "";
        throw new Error(`TMDB Fetch Failed (${movieError} ${tvError})`.trim());
      }

      const [movies, tv] = (await Promise.all([
        movieRes.json(),
        tvRes.json(),
      ])) as [
        TMDBListResponse<TMDBDiscoverItem>,
        TMDBListResponse<TMDBDiscoverItem>,
      ];
      const combined = [];
      const maxLen = Math.max(movies.results.length, tv.results.length);

      for (let i = 0; i < maxLen; i++) {
        if (movies.results[i])
          combined.push({ ...movies.results[i], media_type: "movie" });
        if (tv.results[i])
          combined.push({ ...tv.results[i], media_type: "tv" });
      }

      const maxTotalPages = Math.max(
        movies.total_pages || 0,
        tv.total_pages || 0,
      );

      return NextResponse.json({
        results: combined.slice(0, 20), // Limit to 20 items per page
        page: parseInt(page),
        total_pages: maxTotalPages,
      });
    }

    // 5. Scenario B: Fetch Single Type (Movie OR TV)
    const response = await fetch(
      `${BASE_URL}/discover/${mediaType}?${
        mediaType === "tv" ? tvParams : movieParams
      }`,
    );

    if (!response.ok) {
      throw new Error(
        `TMDB Fetch Failed (${response.status} ${response.statusText})`,
      );
    }

    const data = (await response.json()) as TMDBListResponse<TMDBDiscoverItem>;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
