import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { decryptApiKey } from "@/src/lib/utils/encryption";
import {
  GeminiRecommendationItem,
  GeminiRecommendationResponse,
} from "@/src/dto/ui/profile";
import { MediaType } from "@/src/props/global/mediaType";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// --- Helper Functions ---

/**
 * Calculates user watch statistics for the prompt
 */
function calculateUserAnalytics(history: any[]) {
  let totalWatchTimeSec = 0;
  const typeCount = { movie: 0, tv: 0, anime: 0 };
  const genreCount: Record<string, number> = {};

  history.forEach((item) => {
    // 1. Duration
    if (item.duration_sec) {
      totalWatchTimeSec += item.duration_sec;
    }

    // 2. Type Distribution
    // Determine type (simple heuristic, can be refined if DB has precise 'anime' tag)
    // For now assuming the standard types
    if (item.media_type === "movie") typeCount.movie++;
    else if (item.media_type === "tv") {
      // Check for common anime keywords if we don't have explicit type
      // But adhering to strict TMDB types 'tv' is used for both
      // We'll rely on the history items if they have that metadata, otherwise default to TV
      typeCount.tv++;
    }

    // 3. Recency (Implicit in the sort order of input history, but good to know)
  });

  const totalHours = Math.round(totalWatchTimeSec / 3600);

  return {
    totalHours,
    typeCount,
    lastWatched: history[0]?.title || "None",
  };
}

/**
 * Generates the prompt string using the ORIGINAL System Prompt + New Analytics
 */
function buildGeminiPrompt(
  history: any[],
  watchlist: any[],
  analytics: { totalHours: number; typeCount: any; lastWatched: string },
): string {
  const watchedTitles =
    history
      .map(
        (i) =>
          `${i.title} (${i.media_type}) - Watched for ${(
            (i.duration_sec || 0) / 60
          ).toFixed(0)} mins`,
      )
      .join("\n") || "None";
  const watchlistTitles =
    watchlist.map((i) => `${i.title} (${i.media_type})`).join(", ") || "None";

  return `You are an elite cinematic curator and recommendation engine, capable of deep psychographic analysis of media consumption. Your goal is to provide highly personalized, non-generic recommendations by analyzing the "DNA" (pacing, tone, visual style, narrative complexity) of the user's viewing history and watchlist.

**USER ANALYTICS:**
- Total Watch Time: ~${analytics.totalHours} hours
- Recent Obsession: ${analytics.lastWatched}
- Context: User has significant investment in the content listed. High watch time on specific titles indicates deep interest.

**INPUT DATA:**
User Watch History (with watch duration):
${watchedTitles}

User Watchlist:
${watchlistTitles}

**ANALYSIS PROTOCOL:**
1. **Pattern Recognition:** Identify distinct clusters in the user's taste (e.g., "Dark Psychological Thrillers," "Feel-good Slice of Life," "Hard Scifi"). Prioritize genres/styles where the user has high watch time.
2. **Bridge Strategy:** Do not just match genres. Match *elements*. If they watched "Inception," don't just recommend "Sci-Fi"; recommend movies with "unreliable narrators" or "dream logic."
3. **Novelty vs. Comfort:** Balance high-fidelity matches (very similar to history) with high-quality adjacencies (expanding their horizon).

**CATEGORY DEFINITIONS (STRICT):**
- **Movie:** Feature-length films (Live action or animated).
- **TV:** Live-action series or Western animation (e.g., Arcane, Rick and Morty). NOT Anime.
- **Anime:** Strictly Japanese animation series (Ovas/Series).

**OUTPUT REQUIREMENTS:**
Generate EXACTLY 12 recommendations divided strictly as follows:
- 4 Movies
- 4 Regular TV Shows
- 4 Anime TV Shows

**FORMATTING RULES:**
- **Title:** Must match the official TMDB/IMDb listing.
- **Reason:** Must be hyper-specific and relatable. Mention watch time if relevant (e.g., "Since you spent 2 hours watching X...").
- **Genre:** Primary 2-3 genres.
- Return ONLY the JSON array with exactly 12 items (4 movies, 4 tv shows, 4 anime), no additional text.

**JSON STRUCTURE:**
[
  {
    "title": "String",
    "type": "movie",
    "reason": "String (Specific connection to user's history)",
    "genre": "String"
  },
  ... (repeat for all 12 items)
]

Return ONLY the JSON array with exactly 12 items (4 movies, 4 tv shows, 4 anime), no additional text.`;
}

/**
 * Search TMDB for a specific title and format the result
 */
async function fetchTmdbData(
  item: GeminiRecommendationItem,
): Promise<GeminiRecommendationResponse | null> {
  try {
    // TMDB classifies Anime as TV
    const searchType = item.type === "anime" ? "tv" : item.type;
    const url = `https://api.themoviedb.org/3/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      item.title,
    )}`;

    const res = await fetch(url);
    const data = await res.json();
    const result = data.results?.[0];

    if (!result) {
      console.warn(`⚠️ [TMDB] No match found for: ${item.title}`);
      return null;
    }

    // Fetch extra details for TV shows (Seasons count AND Episodes)
    let seasons = null;
    let episodes = null;

    if (searchType === "tv") {
      const detailsRes = await fetch(
        `https://api.themoviedb.org/3/tv/${result.id}?api_key=${TMDB_API_KEY}`,
      );
      if (detailsRes.ok) {
        const details = await detailsRes.json();
        seasons = details.number_of_seasons;
        episodes = details.number_of_episodes;
      }
    }

    return {
      tmdb_id: result.id,
      title: result.title || result.name || item.title,
      media_type:
        item.type === "anime"
          ? MediaType.TV
          : item.type === "movie"
            ? MediaType.Movie
            : MediaType.TV,
      poster_path: result.poster_path,
      backdrop_path: result.backdrop_path,
      vote_average: result.vote_average,
      release_date: result.release_date || result.first_air_date || null,
      number_of_seasons: seasons,
      number_of_episodes: episodes, // Added this field
      reason: item.reason,
      genre: item.genre,
    };
  } catch (error) {
    console.error(`❌ [TMDB] Error fetching ${item.title}:`, error);
    return null;
  }
}

// --- Main API Route ---

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    // 1. Auth Check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader)
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 },
      );

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });

    // 2. Try database first (if not forcing refresh)
    if (!forceRefresh) {
      const { data: dbRecommendations } = await supabase
        .from("recommendations")
        .select("*")
        .eq("user_id", user.id)
        .order("generated_at", { ascending: false });

      if (dbRecommendations && dbRecommendations.length > 0) {
        console.log(`✅ [Recommendations] Serving from DB for user ${user.id}`);
        return NextResponse.json({
          success: true,
          recommendations: dbRecommendations,
          source: "database",
        });
      }
    }

    // 3. Generate new recommendations
    console.log(`🔄 [Recommendations] Generating new for user ${user.id}`);

    // Parallel Data Fetching (Optimized)
    const [keyRes, historyRes, watchlistRes] = await Promise.all([
      supabase
        .from("gemini_api_keys")
        .select("encrypted_key, iv, auth_tag")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("watch_history")
        .select("title, media_type, duration_sec, watched_at")
        .eq("user_id", user.id)
        .order("watched_at", { ascending: false })
        .limit(20), // Increased limit for better analysis
      supabase
        .from("watchlist")
        .select("title, media_type")
        .eq("user_id", user.id)
        .limit(10),
    ]);

    if (keyRes.error || !keyRes.data) {
      return NextResponse.json(
        { error: "Gemini API key not found in settings." },
        { status: 400 },
      );
    }

    // 4. Decrypt API Key
    let geminiApiKey = "";
    try {
      geminiApiKey = decryptApiKey(
        keyRes.data.encrypted_key,
        keyRes.data.iv,
        keyRes.data.auth_tag,
      );
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to decrypt API key." },
        { status: 500 },
      );
    }

    // 5. Call Gemini AI
    const analytics = calculateUserAnalytics(historyRes.data || []);
    const prompt = buildGeminiPrompt(
      historyRes.data || [],
      watchlistRes.data || [],
      analytics,
    );

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    // Clear key from memory immediately
    geminiApiKey = "";

    if (!geminiRes.ok) {
      console.error(`❌ [Gemini] API Error: ${geminiRes.status}`);
      return NextResponse.json(
        { error: "AI Service Unavailable" },
        { status: 500 },
      );
    }

    // 6. Parse Gemini Response
    const geminiData = await geminiRes.json();
    const textResponse =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const finishReason = geminiData.candidates?.[0]?.finishReason;

    console.log(
      `📝 [Gemini] Raw response length: ${textResponse.length} chars`,
    );

    let geminiRecommendations: GeminiRecommendationItem[];
    try {
      // Direct JSON parse since we requested responseMimeType: "application/json"
      geminiRecommendations = JSON.parse(textResponse);
      console.log(
        `✅ [Gemini] Parsed ${geminiRecommendations.length} recommendations`,
      );
    } catch (parseError) {
      // Fallback manual parsing if strict JSON mode failed or wasn't supported by model version
      console.warn(
        "⚠️ [Gemini] Direct JSON parse failed, attempting cleanup...",
      );
      let jsonString = textResponse.replace(/```(?:json)?|```/g, "").trim();
      try {
        geminiRecommendations = JSON.parse(jsonString);
      } catch (e) {
        console.error("❌ [Gemini] JSON Parse Error");
        throw new Error("Invalid JSON format from AI");
      }
    }

    if (
      !Array.isArray(geminiRecommendations) ||
      geminiRecommendations.length === 0
    ) {
      throw new Error("No valid recommendations received from AI");
    }

    // Warn if we got fewer than expected (might be truncated)
    if (geminiRecommendations.length < 12) {
      console.warn(
        `⚠️ [Gemini] Received ${geminiRecommendations.length}/12 recommendations (may be truncated)`,
      );
    }

    // 7. TMDB Enrichment (Parallelized for Speed)
    const validResults: GeminiRecommendationResponse[] = [];
    const BATCH_SIZE = 6; // Process 6 requests in parallel

    for (let i = 0; i < geminiRecommendations.length; i += BATCH_SIZE) {
      const batch = geminiRecommendations.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((rec) => fetchTmdbData(rec)),
      );

      for (const res of batchResults) {
        if (res) validResults.push(res);
      }
    }

    // 8. Delete old recommendations and save new ones to DB
    if (validResults.length > 0) {
      // Delete old recommendations
      await supabase.from("recommendations").delete().eq("user_id", user.id);

      // Insert new recommendations
      const dbRecords = validResults.map((rec) => ({
        user_id: user.id,
        tmdb_id: rec.tmdb_id,
        title: rec.title,
        media_type: rec.media_type,
        poster_path: rec.poster_path,
        backdrop_path: rec.backdrop_path,
        vote_average: rec.vote_average,
        release_date: rec.release_date,
        number_of_seasons: rec.number_of_seasons,
        number_of_episodes: rec.number_of_episodes, // Added
        reason: rec.reason,
        genre: rec.genre,
      }));

      const { error: insertError } = await supabase
        .from("recommendations")
        .insert(dbRecords);

      if (insertError) {
        console.error("❌ [Recommendations] DB Insert Error:", insertError);
      } else {
        console.log(`✅ [Recommendations] Saved ${validResults.length} to DB`);
      }
    }

    return NextResponse.json({
      success: true,
      recommendations: validResults,
      generatedAt: new Date().toISOString(),
      source: "generated",
    });
  } catch (error: any) {
    console.error("🔥 [Critical Error]", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
