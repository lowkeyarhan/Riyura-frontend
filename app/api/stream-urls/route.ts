import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaType = searchParams.get("media_type"); // 'movie' or 'tv'

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

    // Filter by media type if specified
    if (mediaType && (mediaType === "movie" || mediaType === "tv")) {
      query = query.or(`media_type.eq.${mediaType},media_type.eq.both`);
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
