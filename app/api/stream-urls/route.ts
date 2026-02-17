import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaTypeParam = searchParams.get("media_type"); // 'movie', 'tv', 'Movie', or 'TV'

    // Use service role key to bypass RLS and keep table private
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    let query = supabase
      .from("stream_urls")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: true });

    // Normalize to DB enum values (Movie, TV) and filter if specified
    const dbMediaType =
      mediaTypeParam === "movie" || mediaTypeParam === "Movie"
        ? "Movie"
        : mediaTypeParam === "tv" || mediaTypeParam === "TV"
          ? "TV"
          : null;
    if (dbMediaType) {
      query = query.or(`media_type.eq.${dbMediaType},media_type.eq.both`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching stream URLs:", error);
      return NextResponse.json(
        { error: "Failed to fetch stream URLs" },
        { status: 500 },
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error in stream-urls API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
