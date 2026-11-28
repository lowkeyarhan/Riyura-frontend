import axios from "axios";
import { NextResponse } from "next/server";

// Extracts a valid "Bearer <token>" Authorization header from an incoming Request.
export function getAuthHeader(request: Request): string | null {
  const header = request.headers.get("Authorization");
  return header?.startsWith("Bearer ") ? header : null;
}

// Standard 401 Unauthorized response.
export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Converts an Axios or unknown error into a NextResponse.
export function handleBackendError(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 502;
    return NextResponse.json(
      { error: error.response?.data?.error ?? fallbackMessage },
      { status: status >= 400 ? status : 502 },
    );
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

// Parses the request JSON body. Returns the parsed value, or a 400 NextResponse
export async function parseJsonBody<T>(
  request: Request,
): Promise<T | NextResponse> {
  try {
    return (await request.json()) as T;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}

// Forwards a non-200 backend response status/message as a NextResponse.
export function handleNonSuccessStatus(
  status: number,
  data: Record<string, unknown>,
  fallbackMessage: string,
  successStatuses: number[] = [200],
): NextResponse | null {
  if (status === 401) {
    return unauthorizedResponse();
  }
  if (!successStatuses.includes(status)) {
    return NextResponse.json(
      { error: (data?.error as string) ?? fallbackMessage },
      { status },
    );
  }
  return null;
}
