import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MediaType, WatchlistItem, WatchlistAddRequest } from "@/src/dto/media";
import { getCachedData, invalidateCache, setCachedData } from "@/src/lib/cache";

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
  const type = searchParams.get("type") as MediaType | "all" | null;

  // Get auth token from header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    console.error("[API /api/watchlist GET] No Authorization header");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAuthedSupabaseClient(authHeader);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("[API /api/watchlist GET] Auth error:", authError?.message);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Cache watchlist data for 2 minutes
  const cacheKey = `watchlist:${user.id}:${type || "all"}`;
  const items = await getCachedData(
    cacheKey,
    async () => {
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
          "[API /api/watchlist GET] Database error:",
          error.message,
        );
        throw error;
      }

      return data as WatchlistItem[];
    },
    { ttl: 86400 }, // 24 hours
  );

  return NextResponse.json(items);
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
    const body: WatchlistAddRequest = await request.json();
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

    // Instead of invalidating, fetch fresh data and update cache
    const { data: allWatchlist, error: fetchError } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });

    if (!fetchError && allWatchlist) {
      // Update 'all' cache
      await setCachedData(
        `watchlist:${user.id}:all`,
        allWatchlist as WatchlistItem[],
        120, // 2 minutes TTL
      );

      // Update media-type-specific cache
      const typeFiltered = allWatchlist.filter(
        (item: any) => item.media_type === media_type,
      );
      await setCachedData(
        `watchlist:${user.id}:${media_type}`,
        typeFiltered as WatchlistItem[],
        120,
      );
    }

    // Profile cache still needs invalidation as it has more complex data
    await invalidateCache(`profile:${user.id}`);
    await invalidateCache(
      `watchlist_check:${user.id}:${tmdb_id}:${media_type}`,
    );

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

    // Instead of invalidating, fetch fresh data and update cache
    const { data: allWatchlist, error: fetchError } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });

    if (!fetchError && allWatchlist) {
      // Update 'all' cache
      await setCachedData(
        `watchlist:${user.id}:all`,
        allWatchlist as WatchlistItem[],
        120, // 2 minutes TTL
      );

      // Update media-type-specific cache
      const typeFiltered = allWatchlist.filter(
        (item: any) => item.media_type === mediaType,
      );
      await setCachedData(
        `watchlist:${user.id}:${mediaType}`,
        typeFiltered as WatchlistItem[],
        120,
      );
    }

    // Profile cache still needs invalidation as it has more complex data
    await invalidateCache(`profile:${user.id}`);
    await invalidateCache(`watchlist_check:${user.id}:${tmdbId}:${mediaType}`);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
