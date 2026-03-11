import axios from "axios";
import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await backendClient.get("/banner");
    return NextResponse.json(response.data);
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
