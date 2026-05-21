import { PartyParticipant } from "@/src/props/party/watchParty";

const AVATAR_COLORS = [
  "#F97316",
  "#6366F1",
  "#22C55E",
  "#EC4899",
  "#8B5CF6",
  "#14B8A6",
  "#F59E0B",
];

/** Deterministic color derived from a user ID */
export function colorForId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

/** Format an ISO timestamp to HH:MM */
export function fmtTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** First letter of a participant's display name for avatar fallback */
export function initials(p: PartyParticipant): string {
  return (p.username ?? p.userId).charAt(0).toUpperCase();
}
