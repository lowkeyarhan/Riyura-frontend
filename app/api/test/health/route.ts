import { NextResponse } from "next/server";
import { backendClient } from "@/src/lib/axios";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await backendClient.get("/test/health", {
      timeout: 10000,
    });
    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json(
      {
        status: "DOWN",
        components: {},
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
