import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";
import { normalizeBannerItem } from "@/src/lib/tmdb-images";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await backendClient.get("/banner");
    const data = response.data;
    if (Array.isArray(data?.items) && data.items.length > 0) {
      const normalizedItems = data.items.map(normalizeBannerItem);
      return NextResponse.json({ ...data, items: normalizedItems });
    }
    return NextResponse.json(data ?? { items: [] });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Banner backend error:",
        error.response?.status,
        typeof error.response?.data === "string"
          ? error.response.data.slice(0, 200)
          : error.message,
      );
      return NextResponse.json(
        { error: "Failed to fetch banner content" },
        { status: 502 },
      );
    }

    console.error("Banner API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner content" },
      { status: 500 },
    );
  }
}
