import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MediaType } from "@/src/props/global/mediaType";
import { WatchlistCheckResponse } from "@/src/dto/media";

export const dynamic = "force-dynamic";

function createAuthedSupabaseClient(authHeader: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get("tmdbId");
  const mediaTypeParam = searchParams.get("mediaType");

  if (!tmdbId || !mediaTypeParam) {
    return NextResponse.json(
      { error: "Missing tmdbId or mediaType" },
      { status: 400 },
    );
  }

  const mediaType =
    mediaTypeParam === "movie" || mediaTypeParam === MediaType.Movie
      ? MediaType.Movie
      : MediaType.TV;

  // Get auth token from header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    const response: WatchlistCheckResponse = { exists: false };
    return NextResponse.json(response);
  }

  const supabase = createAuthedSupabaseClient(authHeader);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    const response: WatchlistCheckResponse = { exists: false };
    return NextResponse.json(response);
  }

  const { data, error } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType)
    .maybeSingle();

  if (error) {
    console.error("Error checking watchlist:", error);
  }

  const exists = !!data;

  const response: WatchlistCheckResponse = { exists };
  return NextResponse.json(response);
}
