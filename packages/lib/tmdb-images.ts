const TMDB_BASE = "https://image.tmdb.org/t/p";
const VALID_SIZE_PATTERN = /\/t\/p\/(original|w\d+)\//;

export function normalizeTmdbImageUrl(
  path: string | null | undefined,
  size: "w500" | "w780" | "original" = "w500",
): string {
  if (!path || typeof path !== "string") return "";

  const trimmed = path.trim();
  if (!trimmed) return "";

  if (VALID_SIZE_PATTERN.test(trimmed)) return trimmed;

  if (trimmed.includes("image.tmdb.org/t/p/")) {
    return trimmed.replace(
      "image.tmdb.org/t/p/",
      `image.tmdb.org/t/p/${size}/`,
    );
  }

  if (!trimmed.startsWith("http")) {
    const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${TMDB_BASE}/${size}${normalized}`;
  }

  return trimmed;
}

export function normalizeMediaCardPoster(item: {
  poster_path?: string | null;
  [key: string]: unknown;
}) {
  if (!item || typeof item !== "object") return item;
  const poster = item.poster_path;
  if (poster) {
    return { ...item, poster_path: normalizeTmdbImageUrl(poster, "w500") };
  }
  return item;
}

export function normalizeBannerItem(item: {
  backdrop_path?: string | null;
  poster_path?: string | null;
  [key: string]: unknown;
}) {
  if (!item || typeof item !== "object") return item;
  const updates: Record<string, string> = {};
  if (item.backdrop_path) {
    updates.backdrop_path = normalizeTmdbImageUrl(
      item.backdrop_path,
      "original",
    );
  }
  if (item.poster_path) {
    updates.poster_path = normalizeTmdbImageUrl(item.poster_path, "w500");
  }
  return Object.keys(updates).length ? { ...item, ...updates } : item;
}
