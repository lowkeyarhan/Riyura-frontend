"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/src/lib/auth/supabase";
import { MediaType } from "@/src/props/global/mediaType";
import {
  PartyState,
  PartyParticipant,
  ChatMessage,
  SyncResponse,
  SSEEnvelope,
} from "@/src/props/party/watchParty";

const BASE = "/api/watchalong/party";
const PROGRESS_PUSH_INTERVAL_MS = 5 * 60 * 1000;
const HEARTBEAT_INTERVAL_MS = 2.5 * 60 * 1000;
const SSE_RECONNECT_DELAY_MS = 3_000;
const SSE_MAX_RECONNECTS = 5;

interface UseWatchPartyProps {
  partyId?: string | null;
  mediaType: MediaType;
  tmdbId: number;
  seasonNo?: number;
  episodeNo?: number;
  providerId?: string;
}

export interface UseWatchPartyReturn {
  partyId: string | null;
  partyState: PartyState | null;
  participants: PartyParticipant[];
  messages: ChatMessage[];
  isHost: boolean;
  isConnected: boolean;
  currentUserId: string | undefined;
  streamUrl: string | null;
  currentTimeRef: React.MutableRefObject<number>;
  currentProviderRef: React.MutableRefObject<string>;
  sendChat: (content: string) => Promise<void>;
  leaveParty: () => Promise<void>;
  syncPlayer: () => Promise<SyncResponse | null>;
  pushProgress: (
    newProviderId?: string,
    currentProgress?: number,
  ) => Promise<void>;
}

export function useWatchParty({
  partyId: initialPartyId,
  mediaType,
  tmdbId,
  seasonNo = 0,
  episodeNo = 0,
  providerId: initialProviderId = "ironlink",
}: UseWatchPartyProps): UseWatchPartyReturn {
  const [partyId, setPartyId] = useState<string | null>(initialPartyId ?? null);
  const [partyState, setPartyState] = useState<PartyState | null>(null);
  const [participants, setParticipants] = useState<PartyParticipant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    console.log("[useWatchParty] streamUrl state updated to:", streamUrl);
  }, [streamUrl]);

  const isHostRef = useRef(false);
  const currentUserIdRef = useRef<string | undefined>(undefined);
  const partyIdRef = useRef<string | null>(initialPartyId ?? null);
  const sseAbortControllerRef = useRef<AbortController | null>(null);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);
  const isMountedRef = useRef(true);
  const isLeavingRef = useRef(false);

  const currentTimeRef = useRef<number>(0);
  const currentProviderRef = useRef<string>(initialProviderId);

  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);
  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);
  useEffect(() => {
    partyIdRef.current = partyId;
  }, [partyId]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getAuthToken = async (): Promise<string | null> => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("[WATCH PARTY] Auth session error:", error.message);
      return null;
    }
    return data.session?.access_token ?? null;
  };

  const getHeaders = async (): Promise<Record<string, string>> => {
    const token = await getAuthToken();
    if (!token)
      throw new Error("[WATCH PARTY] No auth token — user not signed in");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const getSSEHeaders = async (): Promise<Record<string, string>> => {
    const token = await getAuthToken();
    if (!token) throw new Error("[WATCH PARTY] No auth token for SSE");
    return {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
    };
  };

  const clearTimers = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const startHeartbeatTimer = useCallback((id: string) => {
    if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
    heartbeatTimerRef.current = setInterval(async () => {
      try {
        const headers = await getHeaders();
        await fetch(`${BASE}/heartbeat?partyId=${id}`, {
          method: "POST",
          headers,
        });
      } catch (err) {
        console.warn("[WATCH PARTY] Heartbeat failed:", err);
      }
    }, HEARTBEAT_INTERVAL_MS);
  }, []);

  const syncPlayer = useCallback(async (): Promise<SyncResponse | null> => {
    const id = partyIdRef.current;
    if (!id) {
      console.warn(
        "[WATCH PARTY] syncPlayer called but partyIdRef.current is empty",
      );
      return null;
    }
    console.log("[WATCH PARTY] syncPlayer initiated for party:", id);
    try {
      const headers = await getHeaders();
      const res = await fetch(`${BASE}/${id}/sync`, { headers });
      if (!res.ok) {
        console.error("[WATCH PARTY] syncPlayer response not ok:", res.status);
        return null;
      }
      const data: SyncResponse = await res.json();
      console.log("[WATCH PARTY] syncPlayer received data:", data);
      if (data.streamUrl && isMountedRef.current) {
        // Parse the stream URL and append a unique partySync timestamp.
        // This forces the iframe key/src to change, prompting a reload.
        try {
          const u = new URL(data.streamUrl);
          u.searchParams.set("partySync", Date.now().toString());
          const finalUrl = u.toString();
          console.log(
            "[WATCH PARTY] syncPlayer setting streamUrl state to:",
            finalUrl,
          );
          setStreamUrl(finalUrl);
        } catch {
          // If URL parsing fails, fallback to appending query param manually
          const separator = data.streamUrl.includes("?") ? "&" : "?";
          const finalUrl = `${data.streamUrl}${separator}partySync=${Date.now()}`;
          console.log(
            "[WATCH PARTY] syncPlayer setting streamUrl state (fallback) to:",
            finalUrl,
          );
          setStreamUrl(finalUrl);
        }
      } else {
        console.warn(
          "[WATCH PARTY] syncPlayer did not set streamUrl. data.streamUrl:",
          data.streamUrl,
          "isMounted:",
          isMountedRef.current,
        );
      }
      return data;
    } catch (err) {
      console.error("[WATCH PARTY] syncPlayer error:", err);
      return null;
    }
  }, []);

  const pushProgress = useCallback(
    async (newProviderId?: string, currentProgress?: number) => {
      const id = partyIdRef.current;
      if (!isHostRef.current || !id) return;

      if (newProviderId) {
        currentProviderRef.current = newProviderId;
        setPartyState((prev) =>
          prev ? { ...prev, providerId: newProviderId } : prev,
        );
      }

      if (currentProgress !== undefined) {
        currentTimeRef.current = currentProgress;
      }

      const progress = currentTimeRef.current;
      const provider = currentProviderRef.current;
      console.log(
        `[WATCH PARTY] Manual progress push → progress=${progress.toFixed(2)}s  provider=${provider}  partyId=${id}`,
      );
      try {
        const headers = await getHeaders();
        const res = await fetch(`${BASE}/progress`, {
          method: "POST",
          headers,
          body: JSON.stringify({ partyId: id, progress, providerId: provider }),
        });

        if (res.ok) {
          if (newProviderId) {
            await syncPlayer();
          }
        }
      } catch (err) {
        console.warn("[WATCH PARTY] Manual progress push failed:", err);
      }
    },
    [getHeaders, syncPlayer],
  );

  const startProgressTimer = useCallback(
    (id: string) => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      progressTimerRef.current = setInterval(async () => {
        if (!isHostRef.current || !id) return;
        const progress = currentTimeRef.current;
        const provider = currentProviderRef.current;
        console.log(
          `[WATCH PARTY] Auto progress push → progress=${progress.toFixed(2)}s  provider=${provider}  partyId=${id}`,
        );
        try {
          const headers = await getHeaders();
          await fetch(`${BASE}/progress`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              partyId: id,
              progress,
              providerId: provider,
            }),
          });
        } catch (err) {
          console.warn("[WATCH PARTY] Auto progress push failed:", err);
        }
      }, PROGRESS_PUSH_INTERVAL_MS);
    },
    [getHeaders],
  );

  const refreshParticipants = useCallback(async () => {
    const id = partyIdRef.current;
    if (!id) return;
    try {
      const headers = await getHeaders();
      const res = await fetch(`${BASE}/${id}`, { headers });
      if (!res.ok) return;
      const data: PartyState = await res.json();
      if (isMountedRef.current) {
        setParticipants(data.participants ?? []);
        setPartyState(data);
      }
    } catch (err) {
      console.error("[WATCH PARTY] refreshParticipants error:", err);
    }
  }, []);

  const cleanupLocalState = useCallback(() => {
    if (sseAbortControllerRef.current) {
      sseAbortControllerRef.current.abort();
      sseAbortControllerRef.current = null;
    }
    clearTimers();
    if (isMountedRef.current) {
      setPartyId(null);
      setPartyState(null);
      setParticipants([]);
      setMessages([]);
      setIsHost(false);
      setIsConnected(false);
      setStreamUrl(null);
    }
    isHostRef.current = false;
    partyIdRef.current = null;
    reconnectCountRef.current = 0;
  }, [clearTimers]);

  const handleSSEEventRef = useRef<(name: string, data: string) => void>(
    () => {},
  );

  handleSSEEventRef.current = (eventName: string, dataStr: string) => {
    let envelope: SSEEnvelope;
    try {
      envelope = JSON.parse(dataStr);
    } catch {
      return;
    }

    const { payload, eventType } = envelope;
    const typeToSwitch = eventType || eventName;

    console.log(`[WATCH PARTY] SSE Event received: ${typeToSwitch}`, payload);

    switch (typeToSwitch) {
      case "CONNECTED":
        if (isMountedRef.current) setIsConnected(true);
        reconnectCountRef.current = 0;
        break;

      case "USER_JOINED": {
        const username = payload?.username as string | undefined;
        if (username) {
          const sysMsg: ChatMessage = {
            id: `sys-${Date.now()}-${Math.random()}`,
            senderId: "system",
            senderName: "System",
            avatarUrl: null,
            content: `${username} joined`,
            sentAt: new Date().toISOString(),
            isSystem: true,
          };
          setMessages((prev) => [...prev, sysMsg]);
        }
        refreshParticipants();
        break;
      }

      case "USER_LEFT": {
        const leftUserId = payload?.userId as string | undefined;
        if (leftUserId) {
          const departedUser = participants.find(
            (p) => p.userId === leftUserId,
          );
          const name = departedUser?.username ?? "Someone";
          const sysMsg: ChatMessage = {
            id: `sys-${Date.now()}-${Math.random()}`,
            senderId: "system",
            senderName: "System",
            avatarUrl: null,
            content: `${name} left`,
            sentAt: new Date().toISOString(),
            isSystem: true,
          };
          setMessages((prev) => [...prev, sysMsg]);
        }
        refreshParticipants();
        break;
      }

      case "USER_EVICTED": {
        const evictedId = payload?.userId as string | undefined;
        if (evictedId && evictedId === currentUserIdRef.current) {
          cleanupLocalState();
          setTimeout(() => {
            if (typeof window !== "undefined") window.location.href = "/";
          }, 500);
          return;
        }
        refreshParticipants();
        break;
      }

      case "HOST_MIGRATED": {
        const newHostId = payload?.newHostId as string | undefined;
        const newHostName = payload?.newHostName as string | undefined;
        if (newHostName) {
          const sysMsg: ChatMessage = {
            id: `sys-${Date.now()}-${Math.random()}`,
            senderId: "system",
            senderName: "System",
            avatarUrl: null,
            content: `${newHostName} is the new host`,
            sentAt: new Date().toISOString(),
            isSystem: true,
          };
          setMessages((prev) => [...prev, sysMsg]);
        }
        if (!newHostId || !isMountedRef.current) break;
        const meIsHost = newHostId === currentUserIdRef.current;
        setIsHost(meIsHost);
        isHostRef.current = meIsHost;
        if (meIsHost && partyIdRef.current) {
          startProgressTimer(partyIdRef.current);
        } else {
          if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
            progressTimerRef.current = null;
          }
        }
        break;
      }

      case "PARTY_STATE_UPDATED": {
        const progress = payload?.progress as number | undefined;
        const updatedProvider = payload?.providerId as string | undefined;
        const newStreamUrl = payload?.streamUrl as string | undefined;
        if (isMountedRef.current && progress !== undefined) {
          const providerChanged =
            updatedProvider &&
            partyState?.providerId &&
            partyState.providerId !== updatedProvider;

          setPartyState((prev) =>
            prev
              ? {
                  ...prev,
                  progress,
                  providerId: updatedProvider ?? prev.providerId,
                }
              : prev,
          );
          if (newStreamUrl) {
            setStreamUrl(newStreamUrl);
          } else if (providerChanged && !isHostRef.current) {
            console.log(
              `[WATCH PARTY] Provider changed to ${updatedProvider}. Syncing player...`,
            );
            syncPlayer();
          }
        }
        break;
      }

      case "NEW_CHAT": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const msg = payload as any;
        if (isMountedRef.current && msg?.id) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg as ChatMessage];
          });
        }
        break;
      }

      case "HEARTBEAT":
        break;

      case "PARTY_ENDED":
        cleanupLocalState();
        setTimeout(() => {
          if (typeof window !== "undefined") window.location.href = "/";
        }, 2000);
        break;

      default:
        console.log(
          `[WATCH PARTY] Unrecognised SSE event: ${typeToSwitch}`,
          payload,
        );
    }
  };

  const connectSSE = useCallback(
    async (id: string) => {
      if (sseAbortControllerRef.current) sseAbortControllerRef.current.abort();
      const controller = new AbortController();
      sseAbortControllerRef.current = controller;
      const { signal } = controller;

      try {
        const headers = await getSSEHeaders();
        const res = await fetch(`${BASE}/events?partyId=${id}`, {
          signal,
          headers,
        });

        if (!res.ok) {
          if (isMountedRef.current) setIsConnected(false);
          return;
        }

        if (!res.body) return;

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let eventName = "message";
        let dataLine = "";

        signal.addEventListener("abort", () => reader.cancel(), { once: true });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const clean = line.trim();
            if (clean.startsWith("event:")) {
              eventName = clean.slice(6).trim();
            } else if (clean.startsWith("data:")) {
              dataLine = clean.slice(5).trim();
            } else if (clean === "" && dataLine) {
              handleSSEEventRef.current(eventName, dataLine);
              eventName = "message";
              dataLine = "";
            }
          }
        }

        if (!signal.aborted && isMountedRef.current) {
          if (reconnectCountRef.current < SSE_MAX_RECONNECTS) {
            reconnectCountRef.current++;
            setTimeout(() => connectSSE(id), SSE_RECONNECT_DELAY_MS);
          } else {
            if (isMountedRef.current) setIsConnected(false);
          }
        }
      } catch (err: unknown) {
        if ((err as Error)?.name === "AbortError") return;
        if (isMountedRef.current) setIsConnected(false);
        if (!signal.aborted && isMountedRef.current) {
          if (reconnectCountRef.current < SSE_MAX_RECONNECTS) {
            reconnectCountRef.current++;
            setTimeout(() => connectSSE(id), SSE_RECONNECT_DELAY_MS);
          }
        }
      }
    },
    [refreshParticipants, cleanupLocalState, startProgressTimer, clearTimers],
  );

  useEffect(() => {
    const initParty = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;
      const token = sessionData.session?.access_token;

      if (!userId || !token) return;

      setCurrentUserId(userId);
      currentUserIdRef.current = userId;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        if (!initialPartyId) {
          const res = await fetch(`${BASE}/create`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              mediaType,
              tmdbId,
              providerId: currentProviderRef.current,
              seasonNo,
              episodeNo,
            }),
          });

          if (!res.ok) return;

          const data: PartyState = await res.json();
          if (!isMountedRef.current) return;

          const url = new URL(window.location.href);
          url.searchParams.set("party", data.partyId);
          window.history.replaceState(null, "", url.toString());

          setPartyId(data.partyId);
          partyIdRef.current = data.partyId;
          setPartyState(data);
          setParticipants(data.participants ?? []);
          setMessages(data.recentMessages ?? []);
          setIsHost(true);
          isHostRef.current = true;
          setStreamUrl(data.streamUrl);

          startHeartbeatTimer(data.partyId);
          startProgressTimer(data.partyId);
          connectSSE(data.partyId);
        } else {
          const res = await fetch(`${BASE}/join`, {
            method: "POST",
            headers,
            body: JSON.stringify({ partyId: initialPartyId.toUpperCase() }),
          });

          if (!res.ok) return;

          const data: PartyState = await res.json();
          if (!isMountedRef.current) return;

          const meIsHost = data.hostId === userId;
          setPartyId(data.partyId);
          partyIdRef.current = data.partyId;
          setPartyState(data);
          setParticipants(data.participants ?? []);
          setMessages(data.recentMessages ?? []);
          setIsHost(meIsHost);
          isHostRef.current = meIsHost;
          setStreamUrl(data.streamUrl);

          startHeartbeatTimer(data.partyId);
          if (meIsHost) startProgressTimer(data.partyId);
          connectSSE(data.partyId);
        }
      } catch (err) {
        console.error("[WATCH PARTY] Initialisation error:", err);
      }
    };

    initParty();

    return () => {
      isMountedRef.current = false;
      cleanupLocalState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendChat = useCallback(async (content: string) => {
    const id = partyIdRef.current;
    if (!id || !content.trim()) return;
    const capped = content.trim().slice(0, 500);
    try {
      const headers = await getHeaders();
      const res = await fetch(`${BASE}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({ partyId: id, content: capped }),
      });
      if (!res.ok) console.warn("[WATCH PARTY] Chat send failed");
    } catch (err) {
      console.error("[WATCH PARTY] sendChat error:", err);
    }
  }, []);

  const leaveParty = useCallback(async () => {
    const id = partyIdRef.current;
    if (!id || isLeavingRef.current) return;
    isLeavingRef.current = true;
    try {
      const headers = await getHeaders();
      await fetch(`${BASE}/leave?partyId=${id}`, { method: "POST", headers });
    } catch (err) {
      console.warn("[WATCH PARTY] Leave request failed", err);
    } finally {
      cleanupLocalState();
      isLeavingRef.current = false;
    }
  }, [cleanupLocalState]);

  return {
    partyId,
    partyState,
    participants,
    messages,
    isHost,
    isConnected,
    currentUserId,
    streamUrl,
    currentTimeRef,
    currentProviderRef,
    sendChat,
    leaveParty,
    syncPlayer,
    pushProgress,
  };
}
