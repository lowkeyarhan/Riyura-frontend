import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/auth/supabase";
import { MediaType } from "@/src/dto/media";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as MediaType | "all" | null;

  // Get auth token from header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let query = supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

  if (type && type !== "all") {
    query = query.eq("media_type", type);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map to UI friendly format if needed, matching WatchlistPageItem
  const formattedData = data.map((item) => ({
    id: item.tmdb_id, // Map tmdb_id to id for UI
    tmdbId: item.tmdb_id,
    title: item.title,
    poster: item.poster_path, // Map poster_path to poster
    year: item.release_date ? new Date(item.release_date).getFullYear() : null,
    rating: item.vote,
    type: item.media_type,
    seasons: item.number_of_seasons,
    episodes: item.number_of_episodes,
    addedAt: item.added_at,
  }));

  return NextResponse.json(formattedData);
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      tmdb_id,
      title,
      media_type,
      poster_path,
      release_date,
      vote,
      number_of_seasons,
      number_of_episodes,
    } = body;

    if (!tmdb_id || !title || !media_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("watchlist")
      .upsert(
        {
          user_id: user.id,
          tmdb_id,
          title,
          media_type,
          poster_path,
          release_date,
          vote,
          number_of_seasons,
          number_of_episodes,
        },
        { onConflict: "user_id, tmdb_id, media_type" },
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const tmdbId = searchParams.get("tmdbId");
    const mediaType = searchParams.get("mediaType");

    if (!tmdbId || !mediaType) {
      return NextResponse.json(
        { error: "Missing tmdbId or mediaType" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("tmdb_id", tmdbId)
      .eq("media_type", mediaType);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
