import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MediaType } from "@/src/props/global/mediaType";
import { WatchHistoryAddRequest, WatchHistoryItem } from "@/src/dto/media";
import { ApiResponse } from "@/src/dto/api";
const VALID_STREAMS = new Set([
  "syntherionmovie",
  "ironlinkmovie",
  "dormannumovie",
  "nanovuemovie",
  "syntheriontv",
  "ironlinktv",
  "dormannutv",
  "nanovuetv",
]);

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

    const { data: dbData, error } = await supabase
      .from("watch_history")
      .select("*")
      .eq("user_id", user.id)
      .order("watched_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    const data = dbData as WatchHistoryItem[];

    // Use ApiResponse wrapper for consistent response format
    const response: ApiResponse<WatchHistoryItem[]> = {
      success: true,
      data,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching watch history:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.warn(
        "⚠️ Watch History: Blocked request with missing/invalid token",
      );
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

    const body: WatchHistoryAddRequest = await req.json();
    const {
      tmdb_id,
      media_type,
      stream_id,
      title,
      poster_path,
      backdrop_path,
      release_date,
      season_number,
      episode_number,
      episode_name,
      episode_length,
      duration_sec = 0,
    } = body;

    // Get user_id from authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user_id = user.id;

    if (!user_id || !tmdb_id || !title || !media_type || !stream_id) {
      console.error("❌ Watch History: Missing required fields in payload");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!VALID_STREAMS.has(stream_id)) {
      console.error(`❌ Watch History: Invalid stream source: ${stream_id}`);
      return NextResponse.json({ error: "Invalid Stream ID" }, { status: 400 });
    }

    console.log("📥 Received watch history request:", {
      tmdb_id,
      title,
      media_type,
      stream_id,
      duration_sec,
      season: season_number,
      episode: episode_number,
    });

    // 1. Check for existing record first
    const { data: existing } = await supabase
      .from("watch_history")
      .select("id, duration_sec, season_number, episode_number")
      .match({ user_id, tmdb_id, media_type })
      .maybeSingle();

    let finalDuration = duration_sec;

    // --- Duration Logic ---
    if (existing) {
      console.log("🔄 Found existing record, updating:", {
        id: existing.id,
        old_duration: existing.duration_sec,
        new_duration: duration_sec,
        old_season: existing.season_number,
        old_episode: existing.episode_number,
      });

      const isSameContext =
        media_type === MediaType.Movie ||
        (existing.season_number === season_number &&
          existing.episode_number === episode_number);

      if (isSameContext) {
        finalDuration += existing.duration_sec || 0;
        console.log("✅ Same context - adding duration:", finalDuration);
      } else {
        console.log("🔄 Different episode/season - resetting duration");
      }
    } else {
      console.log("✨ Creating new watch history record");
    }

    const payload = {
      user_id,
      tmdb_id,
      media_type,
      stream_id,
      title,
      poster_path,
      backdrop_path,
      release_date,
      season_number,
      episode_number,
      episode_name,
      episode_length,
      duration_sec: finalDuration,
      watched_at: new Date().toISOString(),
    };

    let query;

    if (existing?.id) {
      // Update existing record using ID selector
      console.log("📝 Updating existing record with ID:", existing.id);
      query = supabase
        .from("watch_history")
        .update(payload)
        .eq("id", existing.id);
    } else {
      // Insert new record (ID is generated by DB)
      console.log("📝 Inserting new record");
      query = supabase.from("watch_history").insert(payload);
    }

    const { data, error } = await query.select().single();

    if (error) {
      console.error("❌ Supabase Write Error:", error.message);
      throw error;
    }

    console.log("✅ Watch history saved successfully:", {
      id: data.id,
      title: data.title,
      media_type: data.media_type,
      duration_sec: data.duration_sec,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("🔥 Critical Error in Watch History API:", err.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
