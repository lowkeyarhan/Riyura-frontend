import { MediaType } from "../global/mediaType";

export interface PartyParticipant {
  userId: string;
  username: string;
  avatarUrl: string | null;
  /** True only for the current host of the party */
  host: boolean;
  joinedAt: string;
  lastHeartbeat: string;
}

export interface PartyState {
  partyId: string;
  hostId: string;
  mediaType: MediaType;
  tmdbId: number;
  seasonNo: number;
  episodeNo: number;
  providerId: string;
  streamUrl: string | null;
  progress: number;
  status: "ACTIVE" | "ENDED";
  createdAt: string;
  participants: PartyParticipant[];
  recentMessages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatarUrl: string | null;
  content: string;
  sentAt: string;
  isSystem?: boolean;
}

export interface SyncResponse {
  progress: number;
  providerId: string;
  streamUrl: string | null;
}

export type SSEEventType =
  | "CONNECTED"
  | "USER_JOINED"
  | "USER_LEFT"
  | "USER_EVICTED"
  | "HOST_MIGRATED"
  | "PARTY_STATE_UPDATED"
  | "NEW_CHAT"
  | "HEARTBEAT"
  | "PARTY_ENDED";

export interface SSEEnvelope {
  eventId: string;
  partyId: string;
  triggeredById: string;
  eventType: SSEEventType;
  payload: Record<string, any>;
  occurredAt: string;
}
