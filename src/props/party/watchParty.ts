import { MediaType } from "../global/mediaType";

export interface CreatePartyRequest {
  tmdbId: number;
  mediaType: MediaType;
  seasonNo: number;
  episodeNo: number;
  providerId: string;
  startAt: number;
}

export interface CreatePartyResponse {
  success: boolean;
  partyId?: string;
  message?: string;
}

export interface WatchPartyChatMessage {
  senderId: string;
  senderDisplayName: string;
  senderProfilePhoto: string;
  text: string;
  serverTime: number;
  isSystemMessage?: boolean;
}

export interface WatchPartyState {
  partyId: string;
  hostId: string;
  tmdbId: number;
  mediaType: MediaType;
  seasonNo: number;
  episodeNo: number;
  providerId: string;
  startAt: number;
  partyStartedAt: number;
  strictSync: boolean;
  participantIds: string[];
  recentChat: WatchPartyChatMessage[];
  serverTime: number;
}

export interface WatchPartyStateResponse {
  success: boolean;
  data?: WatchPartyState;
  message?: string;
}

export type WatchPartyEventType =
  | "USER_JOINED"
  | "USER_LEFT"
  | "NEW_HOST_ASSIGNED"
  | "CHAT"
  | "SYNC"
  | "FORCE_PAUSE"
  | "RESUME"
  | "STRICT_SYNC_TOGGLED"
  | "HEARTBEAT_ACK"
  | "PARTY_CLOSED"
  | "PROVIDER_CHANGED"
  | "ERROR";

export interface WatchPartyEvent {
  event: WatchPartyEventType;
  payload: any;
  senderId: string;
  timestamp: number;
}

export type SyncAction = "SEEK" | "PLAY" | "PAUSE" | "UPDATE";

export interface SyncPayload {
  startAt: number;
  clientTime: number;
  action: SyncAction;
}
