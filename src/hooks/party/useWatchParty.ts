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
  /** The server/provider the host is currently using. Passed at create time and updated whenever host switches server. */
  providerId?: string;
  /** The current playback position in seconds at party creation time (host only). */
  startAt?: number;
}

export interface RemoteSyncCommand {
  /** Playback position in seconds */
  startAt: number;
  action: SyncAction;
  /** The server/provider the host is currently using — may be undefined for older events */
  providerId?: string;
  partyStartedAt?: number;
  timestamp: number;
}

export function useWatchParty({
  partyId: initialPartyId,
  mediaType,
  tmdbId,
  seasonNo = 0,
  episodeNo = 0,
  providerId: initialProviderId = "vidsrc",
  startAt = 0,
}: UseWatchPartyProps) {
  const [partyId, setPartyId] = useState<string | null>(initialPartyId || null);
  const [partyState, setPartyState] = useState<WatchPartyState | null>(null);
  const [messages, setMessages] = useState<WatchPartyChatMessage[]>([]);
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [providerId, setProviderId] = useState<string>(initialProviderId);
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
  // The active server name from the player — updated externally by the page
  const currentProviderRef = useRef<string>(initialProviderId);
  // Snapshot of the last-fetched party state (used as fallback for request-sync)
  const partyStateRef = useRef<WatchPartyState | null>(null);

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
        setMessages((prev) => [
          ...prev,
          {
            senderId: "system",
            senderDisplayName: "System",
            senderProfilePhoto: "",
            text: `${envelope.payload?.userName || "Someone"} joined the party`,
            serverTime: envelope.timestamp || Date.now(),
            isSystemMessage: true,
          },
        ]);
        // ── HOST auto-push: when a new user joins, immediately broadcast the
        // host's current position so the joiner gets synced without relying on
        // the backend's (potentially stale) party state startAt.
        if (isHostRef.current) {
          const t = currentTimeRef.current;
          const provider = currentProviderRef.current;
          console.log(
            `WatchParty [AUTO SYNC on JOIN]: Host pushing → startAt=${t.toFixed(2)}s  provider=${provider}`,
          );
          // Small delay so the joining user's topic subscription is confirmed
          setTimeout(() => {
            publishRef.current("/sync", {
              startAt: t,
              clientTime: Date.now(),
              action: "SEEK",
              providerId: provider,
            });
          }, 800);
        }
        break;

      case "USER_LEFT":
        console.log(`[INFO] User ${envelope.payload?.userId} disconnected`);
        if (envelope.payload?.participantIds) {
          setParticipantIds(envelope.payload.participantIds);
        }
        setMessages((prev) => [
          ...prev,
          {
            senderId: "system",
            senderDisplayName: "System",
            senderProfilePhoto: "",
            text: `${envelope.payload?.userName || "Someone"} left the party`,
            serverTime: envelope.timestamp || Date.now(),
            isSystemMessage: true,
          },
        ]);
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
        setMessages((prev) => [
          ...prev,
          {
            senderId: "system",
            senderDisplayName: "System",
            senderProfilePhoto: "",
            text: `${envelope.payload?.newHostName || "Someone"} is now the host`,
            serverTime: envelope.timestamp || Date.now(),
            isSystemMessage: true,
          },
        ]);
        break;

      case "CHAT":
        setMessages((prev) => [
          ...prev,
          envelope.payload as WatchPartyChatMessage,
        ]);
        break;

      case "PROVIDER_CHANGED":
        console.log(
          `[INFO] Provider changed to ${envelope.payload?.providerId}`,
        );
        if (envelope.payload?.providerId) {
          setProviderId(envelope.payload.providerId);
          setMessages((prev) => [
            ...prev,
            {
              senderId: "system",
              senderDisplayName: "System",
              senderProfilePhoto: "",
              text: `Host changed the source to ${envelope.payload?.providerId}`,
              serverTime: envelope.timestamp || Date.now(),
              isSystemMessage: true,
            },
          ]);
        }
        break;

      case "SYNC": {
        // SEEK / PLAY / PAUSE / UPDATE — all trigger a player seek
        // "UPDATE" is used by the background auto-push; it should still seek participants
        const startAt = envelope.payload?.startAt ?? 0;
        const rawAction: SyncAction = envelope.payload?.action ?? "SEEK";
        // Normalise UPDATE → SEEK so player pages always apply it
        const action: SyncAction = rawAction === "UPDATE" ? "SEEK" : rawAction;
        const payloadProviderId: string | undefined =
          envelope.payload?.providerId;

        console.log(
          `[SYNC] startAt=${startAt}s  action=${rawAction}→${action}  provider=${payloadProviderId ?? "n/a"}  partyStartedAt=${envelope.payload?.partyStartedAt}`,
        );

        // If the event also carries a provider, update state so player switches server first
        if (payloadProviderId && payloadProviderId !== providerId) {
          setProviderId(payloadProviderId);
        }

        setRemoteSyncCommand({
          startAt,
          action,
          providerId: payloadProviderId,
          partyStartedAt: envelope.payload?.partyStartedAt,
          timestamp: envelope.timestamp ?? Date.now(),
        });
        break;
      }

      case "FORCE_PAUSE":
        console.log(`[INFO] Party paused: ${envelope.payload?.reason}`);
        setRemoteSyncCommand({
          startAt: envelope.payload?.startAt ?? 0,
          action: "PAUSE",
          timestamp: envelope.timestamp ?? Date.now(),
        });
        setMessages((prev) => [
          ...prev,
          {
            senderId: "system",
            senderDisplayName: "System",
            senderProfilePhoto: "",
            text: envelope.payload?.reason
              ? `Party paused: ${envelope.payload.reason}`
              : "Party paused for buffering",
            serverTime: envelope.timestamp || Date.now(),
            isSystemMessage: true,
          },
        ]);
        break;

      case "RESUME":
        console.log(`[INFO] Party resumed: ${envelope.payload?.reason}`);
        setRemoteSyncCommand({
          startAt: envelope.payload?.startAt ?? 0,
          action: "PLAY",
          timestamp: envelope.timestamp ?? Date.now(),
        });
        setMessages((prev) => [
          ...prev,
          {
            senderId: "system",
            senderDisplayName: "System",
            senderProfilePhoto: "",
            text: "Party resumed",
            serverTime: envelope.timestamp || Date.now(),
            isSystemMessage: true,
          },
        ]);
        break;

      case "STRICT_SYNC_TOGGLED":
        console.log(
          `[INFO] Strict sync is now ${envelope.payload?.strictSync ? "ON" : "OFF"}`,
        );
        setStrictSync(Boolean(envelope.payload?.strictSync));
        setMessages((prev) => [
          ...prev,
          {
            senderId: "system",
            senderDisplayName: "System",
            senderProfilePhoto: "",
            text: `Strict sync is now ${envelope.payload?.strictSync ? "ON" : "OFF"}`,
            serverTime: envelope.timestamp || Date.now(),
            isSystemMessage: true,
          },
        ]);
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

      // ── Sent by backend when a participant presses "Request Sync".
      // The HOST responds by pushing their current timestamp to everyone.
      // Requires backend to broadcast SYNC_REQUESTED to /topic/party/{id}
      // instead of (or in addition to) the private /user/queue/sync response.
      case "SYNC_REQUESTED":
        if (isHostRef.current) {
          const t = currentTimeRef.current;
          const provider = currentProviderRef.current;
          console.log(
            `WatchParty [SYNC_REQUESTED]: Host responding → startAt=${t.toFixed(2)}s  provider=${provider}`,
          );
          publishRef.current("/sync", {
            startAt: t,
            clientTime: Date.now(),
            action: "SEEK",
            providerId: provider,
          });
        }
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
          // Use the current player time and provider at the moment of creation
          const hostStartAt =
            currentTimeRef.current > 0 ? currentTimeRef.current : startAt;
          const hostProviderId =
            currentProviderRef.current || initialProviderId;

          console.log(
            `WatchParty [REST]: Creating new party… tmdbId=${tmdbId} mediaType=${mediaType} providerId=${hostProviderId} startAt=${hostStartAt}`,
          );
          const res = await backendClient.post(
            `/party/create`,
            {
              tmdbId,
              mediaType,
              seasonNo,
              episodeNo,
              providerId: hostProviderId,
              startAt: Math.floor(hostStartAt),
            },
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
  }, [initialPartyId, tmdbId, mediaType, seasonNo, episodeNo]);

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
            partyStateRef.current = state; // keep ref in sync for request-sync fallback
            setMessages(state.recentChat ?? []);
            setParticipantIds(state.participantIds ?? []);
            setStrictSync(state.strictSync ?? false);

            const meIsHost = state.hostId === userId;
            setIsHost(meIsHost);
            isHostRef.current = meIsHost;

            // Apply provider from party state for BOTH host & participants
            if (state.providerId) {
              setProviderId(state.providerId);
              currentProviderRef.current = state.providerId;
            }

            // For participants: inject the party's startAt + server as an
            // initial remote sync command so the player seeks on first render.
            // The backend also sends a SYNC via /user/queue/sync on JOIN, but
            // setting it here ensures it fires even before WS connects.
            if (!meIsHost && state.startAt != null && state.startAt > 0) {
              console.log(
                `WatchParty [REST]: Participant initial seek → startAt=${state.startAt}s  provider=${state.providerId}`,
              );
              setRemoteSyncCommand({
                startAt: state.startAt,
                action: "SEEK",
                providerId: state.providerId,
                timestamp: Date.now(),
              });
            }
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

        // 30-second automatic host push-sync (background resilience)
        // Uses SEEK so participants always apply the timestamp
        autoSyncIntervalRef.current = setInterval(() => {
          if (isHostRef.current) {
            const t = currentTimeRef.current;
            const provider = currentProviderRef.current;
            console.log(
              `WatchParty [AUTO SYNC]: Host background push → startAt=${t.toFixed(2)}s  provider=${provider}`,
            );
            client.publish({
              destination: `/app/party/${partyId}/sync`,
              body: JSON.stringify({
                startAt: t,
                clientTime: Date.now(),
                action: "SEEK",
                providerId: provider,
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

  /**
   * Push a manual sync to all participants.
   * Always includes the current provider so participants switch server if needed.
   */
  const pushSync = useCallback((syncStartAt: number, action: SyncAction) => {
    const provider = currentProviderRef.current;
    console.log(
      `WatchParty [SYNC]: Pushing → startAt=${syncStartAt}s action=${action}  provider=${provider}`,
    );
    publishRef.current("/sync", {
      startAt: syncStartAt,
      clientTime: Date.now(),
      action,
      providerId: provider,
    });
  }, []);

  /**
   * Participant: request a sync from the host.
   * - Immediately applies the party state's startAt as a local fallback so
   *   the player seeks to at least the last-known position even if the backend
   *   returns a stale 0.
   * - Sends the WS message so the backend can broadcast SYNC_REQUESTED and
   *   the host will push their exact live position.
   */
  const requestSync = useCallback(() => {
    console.log("WatchParty [SYNC]: Participant requesting sync from host…");
    // Local fallback: apply the party state's last-known startAt + provider
    const snapshot = partyStateRef.current;
    if (snapshot && snapshot.startAt > 0) {
      console.log(
        `WatchParty [SYNC]: Applying party-state fallback → startAt=${snapshot.startAt}s  provider=${snapshot.providerId}`,
      );
      if (
        snapshot.providerId &&
        snapshot.providerId !== currentProviderRef.current
      ) {
        setProviderId(snapshot.providerId);
      }
      setRemoteSyncCommand({
        startAt: snapshot.startAt,
        action: "SEEK",
        providerId: snapshot.providerId,
        timestamp: Date.now(),
      });
    }
    // Also send WS message — backend should broadcast SYNC_REQUESTED to topic
    // so the host picks it up and pushes their exact live position
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

  const changeProvider = useCallback((newProviderId: string) => {
    console.log(
      `WatchParty [HOST]: Emitted Change Provider → ${newProviderId}`,
    );
    // Update our ref so the next auto-sync / manual push carries the new provider
    currentProviderRef.current = newProviderId;
    publishRef.current("/change-provider", { providerId: newProviderId });
  }, []);

  return {
    partyId,
    partyState,
    messages,
    participantIds,
    providerId,
    isHost,
    strictSync,
    isConnected,
    currentUserId,
    remoteSyncCommand,
    /** Assign this ref.current = player.currentTime in your player's time-update handler */
    currentTimeRef,
    /**
     * Update this ref whenever the active server/provider name changes on the HOST side.
     * Used by auto-sync and manual push-sync to include the correct provider.
     */
    currentProviderRef,

    sendChat,
    pushSync,
    requestSync,
    notifyBuffering,
    notifyBufferingComplete,
    toggleStrictSync,
    changeProvider,
  };
}
