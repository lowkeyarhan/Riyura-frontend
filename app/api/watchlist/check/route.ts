import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/auth/supabase";
import { WatchlistCheckResponse } from "@/src/dto/media";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get("tmdbId");
  const mediaType = searchParams.get("mediaType");

  if (!tmdbId || !mediaType) {
    return NextResponse.json(
      { error: "Missing tmdbId or mediaType" },
      { status: 400 },
    );
  }

  // Get auth token from header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    const response: WatchlistCheckResponse = { exists: false };
    return NextResponse.json(response);
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

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
    const response: WatchlistCheckResponse = { exists: false };
    return NextResponse.json(response);
  }

  const response: WatchlistCheckResponse = { exists: !!data };
  return NextResponse.json(response);
}
