import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MediaType } from "@/src/props/global/mediaType";
import { ContinueWatchingItem, ProfileStat } from "@/src/dto/media";
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or Invalid Token" },
        { status: 401 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch watch history
    const { data: watchHistoryData, error: historyError } = await supabase
      .from("watch_history")
      .select("*")
      .eq("user_id", user.id)
      .order("watched_at", { ascending: false })
      .limit(10);

    if (historyError) throw historyError;

    // Fetch watchlist
    const { data: watchlistData, error: watchlistError } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });

    if (watchlistError) throw watchlistError;

    // Format watch history for Continue Watching using ContinueWatchingItem DTO
    const continueWatching: ContinueWatchingItem[] = (
      watchHistoryData || []
    ).map((item: any) => {
      const totalLength = item.episode_length || 7200;
      const progress = Math.min(
        100,
        Math.round((item.duration_sec / totalLength) * 100),
      );
      const remainingSeconds = Math.max(0, totalLength - item.duration_sec);

      return {
        id: item.id,
        tmdbId: item.tmdb_id,
        title: item.title,
        progress,
        image: item.backdrop_path
          ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
          : item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
        type:
          item.media_type === MediaType.Movie
            ? MediaType.Movie
            : item.episode_name
              ? `S${item.season_number} E${item.episode_number}: ${item.episode_name}`
              : `S${item.season_number} E${item.episode_number}`,
        year: item.release_date
          ? new Date(item.release_date).getFullYear()
          : null,
        remaining: `${Math.floor(remainingSeconds / 60)}m remaining`,
        mediaType: item.media_type,
        seasonNumber: item.season_number,
        episodeNumber: item.episode_number,
        streamId: item.stream_id,
      };
    });

    // Calculate stats using ProfileStat DTO
    const moviesCount = (watchHistoryData || []).filter(
      (i: any) => i.media_type === MediaType.Movie,
    ).length;
    const seriesCount = new Set(
      (watchHistoryData || [])
        .filter((i: any) => i.media_type !== MediaType.Movie)
        .map((i: any) => i.tmdb_id),
    ).size;
    const totalSeconds = (watchHistoryData || []).reduce(
      (acc: number, item: any) => acc + (item.duration_sec || 0),
      0,
    );
    const hoursCount = Math.round(totalSeconds / 3600);

    const stats: ProfileStat[] = [
      { label: "Movies", value: moviesCount.toString() },
      { label: "Series", value: seriesCount.toString() },
      { label: "Hours", value: hoursCount.toString() },
    ];

    // Build response data using ProfileData DTO
    const responseData = {
      continueWatching,
      watchlist: watchlistData || [],
      stats,
    };

    return NextResponse.json(
      {
        success: true,
        data: responseData,
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Error fetching profile data:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
