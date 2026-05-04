import { useState, useEffect, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client, StompSubscription } from "@stomp/stompjs";
import { supabase } from "@/src/lib/auth/supabase";
import { MediaType } from "@/src/props/global/mediaType";
import {
  WatchPartyState,
  WatchPartyChatMessage,
  WatchPartyEvent,
  SyncAction,
} from "@/src/props/party/watchParty";
import { backendClient } from "@/src/lib/axios";

const BACKEND_WS_URL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`
  : "http://localhost:8080/ws";

interface UseWatchPartyProps {
  partyId?: string | null;
  mediaType: MediaType;
  tmdbId: number;
  seasonNo?: number;
  episodeNo?: number;
  providerId?: string;
  startAt?: number;
}

export interface RemoteSyncCommand {
  startAt: number;
  action: SyncAction;
  partyStartedAt?: number;
  timestamp: number;
}

export function useWatchParty({
  partyId: initialPartyId,
  mediaType,
  tmdbId,
  seasonNo = 0,
  episodeNo = 0,
  providerId = "vidsrc",
  startAt = 0,
}: UseWatchPartyProps) {
  const [partyId, setPartyId] = useState<string | null>(initialPartyId || null);
  const [partyState, setPartyState] = useState<WatchPartyState | null>(null);
  const [messages, setMessages] = useState<WatchPartyChatMessage[]>([]);
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [strictSync, setStrictSync] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [remoteSyncCommand, setRemoteSyncCommand] =
    useState<RemoteSyncCommand | null>(null);

  // ─── Refs so closures always see latest values ────────────────────────────
  const stompClientRef = useRef<Client | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentUserIdRef = useRef<string | undefined>(currentUserId);
  const isHostRef = useRef(false);
  // currentTime ref is updated externally by the player page
  const currentTimeRef = useRef(0);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);

  // ─── Auth helpers ─────────────────────────────────────────────────────────
  const getAuthToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  const getUserId = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id;
  };

  // ─── Core WS publish (ref-based, always fresh) ───────────────────────────
  const publishRef = useRef<(dest: string, body?: object) => void>(() => {
    console.warn("WatchParty [WS]: publish called before client ready");
  });

  const publishFn = useCallback(
    (destination: string, body: object = {}) => {
      const client = stompClientRef.current;
      if (client && client.connected && partyId) {
        const fullDest = `/app/party/${partyId}${destination}`;
        console.log(`WatchParty [WS Action]: → ${fullDest}`, body);
        client.publish({ destination: fullDest, body: JSON.stringify(body) });
      } else {
        console.warn(
          `WatchParty [WS Action]: Cannot send to ${destination} — WS not connected.`,
        );
      }
    },
    [partyId],
  );

  useEffect(() => {
    publishRef.current = publishFn;
  }, [publishFn]);

  // ─── Incoming event handler (ref to avoid stale closures in subscriptions) ─
  const handleIncomingEventRef = useRef<(envelope: WatchPartyEvent) => void>(
    () => {},
  );

  handleIncomingEventRef.current = (envelope: WatchPartyEvent) => {
    console.log(`WatchParty [WS Event] ← ${envelope.event}`, envelope.payload);

    switch (envelope.event) {
      case "USER_JOINED":
        console.log(`[INFO] User ${envelope.payload?.userId} joined the party`);
        if (envelope.payload?.participantIds) {
          setParticipantIds(envelope.payload.participantIds);
        }
        break;

      case "USER_LEFT":
        console.log(`[INFO] User ${envelope.payload?.userId} disconnected`);
        if (envelope.payload?.participantIds) {
          setParticipantIds(envelope.payload.participantIds);
        }
        break;

      case "NEW_HOST_ASSIGNED":
        console.log(
          `[INFO] User ${envelope.payload?.newHostId} is the new host`,
        );
        if (envelope.payload?.newHostId) {
          const meIsHost =
            envelope.payload.newHostId === currentUserIdRef.current;
          setIsHost(meIsHost);
          isHostRef.current = meIsHost;
        }
        break;

      case "CHAT":
        setMessages((prev) => [
          ...prev,
          envelope.payload as WatchPartyChatMessage,
        ]);
        break;

      case "SYNC":
        // Directed sync (response to request-sync or auto host push)
        console.log(
          `[SYNC] startAt=${envelope.payload?.startAt}s  action=${envelope.payload?.action}  partyStartedAt=${envelope.payload?.partyStartedAt}`,
        );
        setRemoteSyncCommand({
          startAt: envelope.payload?.startAt ?? 0,
          action: envelope.payload?.action ?? "SEEK",
          partyStartedAt: envelope.payload?.partyStartedAt,
          timestamp: envelope.timestamp ?? Date.now(),
        });
        break;

      case "FORCE_PAUSE":
        console.log(`[INFO] Party paused: ${envelope.payload?.reason}`);
        setRemoteSyncCommand({
          startAt: envelope.payload?.startAt ?? 0,
          action: "PAUSE",
          timestamp: envelope.timestamp ?? Date.now(),
        });
        break;

      case "RESUME":
        console.log(`[INFO] Party resumed: ${envelope.payload?.reason}`);
        setRemoteSyncCommand({
          startAt: envelope.payload?.startAt ?? 0,
          action: "PLAY",
          timestamp: envelope.timestamp ?? Date.now(),
        });
        break;

      case "STRICT_SYNC_TOGGLED":
        console.log(
          `[INFO] Strict sync is now ${envelope.payload?.strictSync ? "ON" : "OFF"}`,
        );
        setStrictSync(Boolean(envelope.payload?.strictSync));
        break;

      case "HEARTBEAT_ACK":
        // Silent ack — logged by heartbeat subscription
        break;

      case "PARTY_CLOSED":
        console.log(`[INFO] Party closed: ${envelope.payload?.reason}`);
        window.alert(
          `This party has been closed: ${envelope.payload?.reason ?? "due to inactivity."}`,
        );
        window.location.href = "/";
        break;

      case "ERROR":
        console.error(
          `WatchParty [ERROR] ${envelope.payload?.message ?? JSON.stringify(envelope.payload)}`,
        );
        break;

      default:
        console.log(
          `[EVENT: ${envelope.event}] → ${JSON.stringify(envelope.payload)}`,
        );
    }
  };

  // ─── 1. Initialise Party (create or join) ─────────────────────────────────
  useEffect(() => {
    const initParty = async () => {
      const userId = await getUserId();
      setCurrentUserId(userId);
      currentUserIdRef.current = userId;

      const token = await getAuthToken();
      if (!token) {
        console.error(
          "WatchParty [REST]: No auth token found. Cannot init party.",
        );
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        if (!initialPartyId) {
          // HOST: create party
          console.log(
            `WatchParty [REST]: Creating new party… tmdbId=${tmdbId} mediaType=${mediaType}`,
          );
          const res = await backendClient.post(
            `/party/create`,
            { tmdbId, mediaType, seasonNo, episodeNo, providerId, startAt },
            { headers },
          );

          if (res.data.success && res.data.partyId) {
            console.log(
              `WatchParty [REST]: Party created → ${res.data.partyId}`,
            );
            setPartyId(res.data.partyId);
            // Persist partyId in URL without reload
            const url = new URL(window.location.href);
            url.searchParams.set("party", res.data.partyId);
            window.history.replaceState(null, "", url.toString());
          } else {
            console.error(
              "WatchParty [REST]: Failed to create party",
              res.data,
            );
          }
        } else {
          // PARTICIPANT: use existing partyId
          console.log(
            `WatchParty [REST]: Joining existing party ${initialPartyId}`,
          );
          setPartyId(initialPartyId);
        }
      } catch (err) {
        console.error("WatchParty [REST]: Error initializing party", err);
      }
    };

    initParty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialPartyId,
    tmdbId,
    mediaType,
    seasonNo,
    episodeNo,
    providerId,
    startAt,
  ]);

  // ─── 2. Fetch State + Connect WS once partyId is set ─────────────────────
  useEffect(() => {
    if (!partyId) return;

    let isActive = true;

    const setupConnection = async () => {
      const token = await getAuthToken();
      const userId = await getUserId();
      if (!token || !userId) {
        console.error("WatchParty [WS]: Missing token or userId, aborting.");
        return;
      }

      // Fetch initial party state
      try {
        console.log(`WatchParty [REST]: Fetching state for party ${partyId}…`);
        const res = await backendClient.get(`/party/${partyId}/state`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && res.data.data) {
          const state: WatchPartyState = res.data.data;
          console.log("WatchParty [REST]: State fetched →", state);

          if (isActive) {
            setPartyState(state);
            setMessages(state.recentChat ?? []);
            setParticipantIds(state.participantIds ?? []);
            setStrictSync(state.strictSync ?? false);
            const meIsHost = state.hostId === userId;
            setIsHost(meIsHost);
            isHostRef.current = meIsHost;
          }
        }
      } catch (err) {
        console.error("WatchParty [REST]: Error fetching state", err);
        return;
      }

      // Connect STOMP
      console.log("WatchParty [WS]: Initialising STOMP client…");
      const client = new Client({
        webSocketFactory: () => new SockJS(BACKEND_WS_URL),
        connectHeaders: { Authorization: `Bearer ${token}` },
        debug: (str) => {
          // Only log non-heartbeat lines to reduce noise
          if (!str.includes(">>>") || str.includes("SEND")) return;
          console.debug("WatchParty [STOMP]:", str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        console.log("WatchParty [WS]: Connection established ✓");
        if (isActive) setIsConnected(true);

        // Subscribe: party broadcast topic
        client.subscribe(`/topic/party/${partyId}`, (msg) => {
          handleIncomingEventRef.current(JSON.parse(msg.body));
        });

        // Subscribe: directed sync (sent directly to this user by server)
        client.subscribe(`/user/queue/sync`, (msg) => {
          const parsed = JSON.parse(msg.body);
          console.log(
            `WatchParty [DIRECTED SYNC] startAt=${parsed.payload?.startAt}s  partyStartedAt=${parsed.payload?.partyStartedAt}`,
          );
          handleIncomingEventRef.current(parsed);
        });

        // Subscribe: server error messages
        client.subscribe(`/user/queue/error`, (msg) => {
          const parsed = JSON.parse(msg.body);
          console.error(
            `WatchParty [ERROR QUEUE] ${parsed.payload?.message ?? JSON.stringify(parsed)}`,
          );
        });

        // Subscribe: heartbeat ack
        client.subscribe(`/user/queue/heartbeat-ack`, () => {
          console.log("WatchParty [HEARTBEAT ACK] Received ✓");
        });

        // Send JOIN
        console.log("WatchParty [WS]: Sending JOIN command…");
        client.publish({
          destination: `/app/party/${partyId}/join`,
          body: "{}",
        });

        // 5-second heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          console.log("WatchParty [WS]: Sending heartbeat →");
          client.publish({
            destination: `/app/party/${partyId}/heartbeat-ws`,
            body: "{}",
          });
        }, 5000);

        // 30-second automatic host push-sync
        autoSyncIntervalRef.current = setInterval(() => {
          if (isHostRef.current) {
            const t = currentTimeRef.current;
            console.log(
              `WatchParty [AUTO SYNC]: Host push-sync → startAt=${t.toFixed(2)}s`,
            );
            client.publish({
              destination: `/app/party/${partyId}/sync`,
              body: JSON.stringify({
                startAt: t,
                clientTime: Date.now(),
                action: "SEEK",
              }),
            });
          }
        }, 30_000);
      };

      client.onStompError = (frame) => {
        console.error(
          "WatchParty [WS]: STOMP error →",
          frame.headers["message"],
          frame.body,
        );
      };

      client.onWebSocketClose = () => {
        console.warn("WatchParty [WS]: WebSocket closed.");
        if (isActive) setIsConnected(false);
        if (heartbeatIntervalRef.current)
          clearInterval(heartbeatIntervalRef.current);
        if (autoSyncIntervalRef.current)
          clearInterval(autoSyncIntervalRef.current);
      };

      client.activate();
      stompClientRef.current = client;
    };

    setupConnection();

    return () => {
      isActive = false;
      if (heartbeatIntervalRef.current)
        clearInterval(heartbeatIntervalRef.current);
      if (autoSyncIntervalRef.current)
        clearInterval(autoSyncIntervalRef.current);
      if (stompClientRef.current) {
        console.log("WatchParty [WS]: Deactivating client…");
        stompClientRef.current.deactivate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyId]);

  // ─── Exposed Actions ──────────────────────────────────────────────────────
  const sendChat = useCallback((text: string) => {
    console.log(`WatchParty [CHAT]: Sending → "${text}"`);
    publishRef.current("/chat", { text });
  }, []);

  const pushSync = useCallback((syncStartAt: number, action: SyncAction) => {
    console.log(
      `WatchParty [SYNC]: Pushing → startAt=${syncStartAt}s action=${action}`,
    );
    publishRef.current("/sync", {
      startAt: syncStartAt,
      clientTime: Date.now(),
      action,
    });
  }, []);

  const requestSync = useCallback(() => {
    console.log("WatchParty [SYNC]: Participant requesting sync from host…");
    publishRef.current("/request-sync");
  }, []);

  const notifyBuffering = useCallback(() => {
    console.log("WatchParty [BUFFERING]: Emitted Buffering Flag: Active");
    publishRef.current("/buffering");
  }, []);

  const notifyBufferingComplete = useCallback(() => {
    console.log("WatchParty [BUFFERING]: Emitted Buffering Flag: Resolved");
    publishRef.current("/buffering-complete");
  }, []);

  const toggleStrictSync = useCallback(() => {
    console.log("WatchParty [HOST]: Emitted Toggle Strict Mode");
    publishRef.current("/toggle-strict-sync");
  }, []);

  return {
    partyId,
    partyState,
    messages,
    participantIds,
    isHost,
    strictSync,
    isConnected,
    currentUserId,
    remoteSyncCommand,
    /** Assign this ref.current = player.currentTime in your player's time-update handler */
    currentTimeRef,

    sendChat,
    pushSync,
    requestSync,
    notifyBuffering,
    notifyBufferingComplete,
    toggleStrictSync,
  };
}
