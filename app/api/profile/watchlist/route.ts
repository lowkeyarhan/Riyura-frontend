import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MediaType } from "@/src/props/global/mediaType";
import { WatchlistItem } from "@/src/dto/media";
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
  const typeParam = searchParams.get("type");
  // Normalize to DB enum (Movie, TV)
  const type: MediaType | "all" | null =
    typeParam === "movie" || typeParam === MediaType.Movie
      ? MediaType.Movie
      : typeParam === "tv" || typeParam === MediaType.TV
        ? MediaType.TV
        : typeParam === "all"
          ? "all"
          : null;

  // Get auth token from header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    console.error("[API /api/profile/watchlist GET] No Authorization header");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAuthedSupabaseClient(authHeader);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error(
      "[API /api/profile/watchlist GET] Auth error:",
      authError?.message,
    );
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
    console.error(
      "[API /api/profile/watchlist GET] Database error:",
      error.message,
    );
    throw error;
  }

  return NextResponse.json(data as WatchlistItem[]);
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAuthedSupabaseClient(authHeader);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      tmdb_id,
      title,
      media_type: mediaTypeParam,
      poster_path,
      release_date,
      vote,
      number_of_seasons,
      number_of_episodes,
    } = body;

    if (!tmdb_id || !title || !mediaTypeParam) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const media_type: MediaType =
      mediaTypeParam === "movie" || mediaTypeParam === MediaType.Movie
        ? MediaType.Movie
        : MediaType.TV;

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAuthedSupabaseClient(authHeader);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const tmdbId = searchParams.get("tmdbId");
    const mediaTypeParam = searchParams.get("mediaType");

    if (!tmdbId || !mediaTypeParam) {
      return NextResponse.json(
        { error: "Missing tmdbId or mediaType" },
        { status: 400 },
      );
    }

    const mediaType: MediaType =
      mediaTypeParam === "movie" || mediaTypeParam === MediaType.Movie
        ? MediaType.Movie
        : MediaType.TV;

    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", user.id)
      .eq("tmdb_id", tmdbId)
      .eq("media_type", mediaType);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
