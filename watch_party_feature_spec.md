# Watch Party — Complete Feature Flow & Architecture

**Frontend implementation reference for the Riyura watch party system.**  
This document describes every state, event, action, and lifecycle step as they exist in the codebase.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Data Model](#2-data-model)
3. [Party Creation — Host Flow](#3-party-creation--host-flow)
4. [Party Join — Participant Flow](#4-party-join--participant-flow)
5. [WebSocket Lifecycle](#5-websocket-lifecycle)
6. [Heartbeat System](#6-heartbeat-system)
7. [Playback Synchronisation](#7-playback-synchronisation)
8. [Server / Provider Switching](#8-server--provider-switching)
9. [Chat](#9-chat)
10. [Buffering Coordination](#10-buffering-coordination)
11. [Strict Sync Mode](#11-strict-sync-mode)
12. [Host Reassignment](#12-host-reassignment)
13. [Party Closure](#13-party-closure)
14. [Complete Event Dictionary](#14-complete-event-dictionary)
15. [Frontend State & Refs Reference](#15-frontend-state--refs-reference)
16. [REST API Contracts](#16-rest-api-contracts)
17. [WebSocket Action Contracts](#17-websocket-action-contracts)

---

## 1. Overview

A Watch Party is a **shared, synchronised media session** tied to a single TMDB title. One user is the **Host** (controls playback source of truth) and everyone else is a **Participant**.

The system uses:

- **REST** for session creation and initial state hydration.
- **SockJS + STOMP WebSocket** for real-time sync, chat, and presence.
- **Redis-backed party state** on the backend (mutable on every sync push).

The frontend hook is `useWatchParty` (`src/hooks/party/useWatchParty.ts`), consumed by two page components:

- `app/party/movie/page.tsx`
- `app/party/tv/page.tsx`

---

## 2. Data Model

### Party State (returned by `GET /api/party/{partyId}/state`)

| Field            | Type                      | Description                                              |
| ---------------- | ------------------------- | -------------------------------------------------------- |
| `partyId`        | `string (UUID)`           | Unique identifier for the party                          |
| `hostId`         | `string (UUID)`           | Supabase user ID of the current host                     |
| `tmdbId`         | `number`                  | TMDB content identifier                                  |
| `mediaType`      | `"Movie" \| "TV"`         | Content type                                             |
| `seasonNo`       | `number`                  | Season number — **`0` for movies**                       |
| `episodeNo`      | `number`                  | Episode number — **`0` for movies**                      |
| `providerId`     | `string`                  | Active stream server name (e.g. `"VidSrc"`, `"nanovue"`) |
| `startAt`        | `number`                  | Last-known playback position in **seconds** (decimal)    |
| `partyStartedAt` | `number`                  | Unix timestamp (ms) when party was created               |
| `strictSync`     | `boolean`                 | Whether strict sync mode is active                       |
| `participantIds` | `string[]`                | Array of active participant user IDs                     |
| `recentChat`     | `WatchPartyChatMessage[]` | Last N chat messages (pre-loaded for new joiners)        |
| `serverTime`     | `number`                  | Server-side Unix timestamp at response time              |

### Chat Message

| Field                | Type      | Description                            |
| -------------------- | --------- | -------------------------------------- |
| `senderId`           | `string`  | User ID or `"system"`                  |
| `senderDisplayName`  | `string`  | Display name                           |
| `senderProfilePhoto` | `string`  | Avatar URL (may be empty)              |
| `text`               | `string`  | Message content                        |
| `serverTime`         | `number`  | Unix timestamp (ms)                    |
| `isSystemMessage`    | `boolean` | If `true`, rendered as a centered pill |

### Sync Command (sent to backend by host)

```json
{
  "startAt": 125.5,
  "clientTime": 1672531200000,
  "action": "SEEK",
  "providerId": "VidSrc"
}
```

`action` values: `SEEK` | `PLAY` | `PAUSE` | `UPDATE`

---

## 3. Party Creation — Host Flow

### Trigger

User navigates to `/party/movie?movie={tmdbId}` or `/party/tv?tv={tmdbId}&s={season}&e={episode}` **without** a `party` query parameter.

### Steps

```
1. useWatchParty initialises
2. Auth token + userId fetched from Supabase
3. Reads currentTimeRef.current (host's current player position in seconds)
4. Reads currentProviderRef.current (active server name from the player hook)
5. POST /api/party/create with full payload:
   {
     tmdbId,
     mediaType,       // "Movie" or "TV"
     seasonNo,        // 0 for movies
     episodeNo,       // 0 for movies
     providerId,      // active server name
     startAt          // current playback position (floored to integer)
   }
6. Response: { success: true, partyId: "uuid" }
7. partyId stored in state
8. URL updated: window.history.replaceState → adds ?party={partyId}
9. Host copies invite link and shares it
```

### Invite Link Format

```
https://riyura.app/party/movie?movie=12345&party=abc-uuid
https://riyura.app/party/tv?tv=12345&s=1&e=3&party=abc-uuid
```

> **Important:** `seasonNo` and `episodeNo` must be sent as `0` (not `null`) for movies because the backend DTO requires integer values.

---

## 4. Party Join — Participant Flow

### Trigger

User opens an invite link that includes `?party={partyId}`.

### Steps

```
1. useWatchParty sees initialPartyId is set → skip party creation
2. Auth token + userId fetched
3. GET /api/party/{partyId}/state
   → Returns full party state including providerId and startAt
4. State applied to React state:
   - setPartyState(state)
   - setMessages(state.recentChat)
   - setParticipantIds(state.participantIds)
   - setStrictSync(state.strictSync)
   - setProviderId(state.providerId)     ← server to use
   - setIsHost(state.hostId === userId)  ← always false for participant
5. If state.startAt > 0:
   setRemoteSyncCommand({
     startAt: state.startAt,
     action: "SEEK",
     providerId: state.providerId,
     timestamp: Date.now()
   })
   → This immediately queues a player seek before WS even connects
6. STOMP WebSocket connects
7. Subscriptions established (see §5)
8. JOIN command sent → backend broadcasts USER_JOINED
9. HOST receives USER_JOINED → auto-pushes live /sync after 800ms delay
   → Participant receives SYNC event with host's exact live position
10. Player iframe rebuilds with ?start={startAt}&t={startAt}
```

### Participant Server Switch

When `providerId` from party state differs from the local default:

```
setProviderId(state.providerId) in useWatchParty
→ page useEffect watches providerId
→ finds matching server index in servers[]
→ setActiveServerIndex(idx)
→ activeServer.url changes
→ stream URL useEffect fires
→ new iframe URL built with startAt embedded
```

---

## 5. WebSocket Lifecycle

### Connection Setup

- **URL:** `${NEXT_PUBLIC_BACKEND_URL}/ws` (SockJS)
- **STOMP connect headers:** `{ Authorization: "Bearer {jwt}" }`
- **Reconnect delay:** 5 seconds (auto-reconnect on drop)
- **STOMP heartbeat:** 4000ms incoming / 4000ms outgoing

### Subscriptions (established on `onConnect`)

| Destination                 | Purpose                                                       |
| --------------------------- | ------------------------------------------------------------- |
| `/topic/party/{partyId}`    | All broadcast events (chat, sync, joins, etc.)                |
| `/user/queue/sync`          | Private directed sync (join auto-sync, request-sync response) |
| `/user/queue/error`         | Private error messages from the server                        |
| `/user/queue/heartbeat-ack` | Server acknowledgment of heartbeat                            |

### Connection Sequence

```
onConnect fired
  → subscribe /topic/party/{partyId}
  → subscribe /user/queue/sync
  → subscribe /user/queue/error
  → subscribe /user/queue/heartbeat-ack
  → publish /app/party/{partyId}/join  (body: {})
  → start heartbeat interval (5s)
  → start auto-sync interval (30s, host only)
```

### Disconnect / Cleanup

On component unmount or WS close:

- Heartbeat interval cleared
- Auto-sync interval cleared
- STOMP client deactivated
- Server auto-kicks users who miss heartbeats

---

## 6. Heartbeat System

**Purpose:** Keeps the WebSocket session alive and prevents the backend from treating the user as a zombie/disconnected.

### Host + Participant — both send heartbeat

```
Every 5 seconds:
  publish /app/party/{partyId}/heartbeat-ws  (body: {})
  ↓
Backend responds privately:
  /user/queue/heartbeat-ack  → logged silently, no UI change
```

> If a user misses enough heartbeats, the backend fires `USER_LEFT` and removes them from `participantIds`.

---

## 7. Playback Synchronisation

### 7.1 Initial Sync on Join

Sequence (two-path guarantee):

**Path A — REST state (fires before WS connects):**

```
GET /party/{partyId}/state → state.startAt > 0
→ setRemoteSyncCommand({ startAt: state.startAt, action: "SEEK", providerId })
→ player useEffect applies startAt to iframe URL immediately
```

**Path B — Host auto-push on USER_JOINED (fires ~1s after WS connects):**

```
HOST receives USER_JOINED on /topic/party/{partyId}
→ setTimeout 800ms
→ publish /app/party/{partyId}/sync {
    startAt: currentTimeRef.current,   ← live position
    action: "SEEK",
    providerId: currentProviderRef.current,
    clientTime: Date.now()
  }
→ Backend broadcasts SYNC to /topic/party/{partyId}
→ Participant receives SYNC → setRemoteSyncCommand
→ Player iframe rebuilds with ?start={startAt}&t={startAt}
```

Path B overrides Path A with the exact live position, ensuring the participant is perfectly in sync.

### 7.2 Host Manual Push Sync

Triggered when host presses the **"Host Sync → Push"** button.

```
handlePushSync():
  t = getLatestProgress()   ← current player time from postMessage
  pushSync(t, "SEEK")
  ↓
publish /app/party/{partyId}/sync {
  startAt: t,
  action: "SEEK",
  providerId: currentProviderRef.current,
  clientTime: Date.now()
}
→ All participants receive SYNC → player seeks to t
→ Backend persists startAt + providerId to party state (after Bug 3 is fixed)
```

### 7.3 Host Background Auto-Sync

```
Every 30 seconds (host only):
  t = currentTimeRef.current
  provider = currentProviderRef.current
  publish /app/party/{partyId}/sync {
    startAt: t,
    action: "SEEK",
    providerId: provider,
    clientTime: Date.now()
  }
→ All participants receive SYNC
→ Backend persists updated startAt (keeps party state fresh for late joiners)
```

> The auto-sync uses `action: "SEEK"` (not `"UPDATE"`) to ensure all clients apply it.

### 7.4 Participant Request Sync

Triggered when participant presses **"Player Sync → Request"** button.

```
requestSync():

  LAYER 1 — Immediate local fallback:
    snapshot = partyStateRef.current   ← REST snapshot from join
    if snapshot.startAt > 0:
      setRemoteSyncCommand({
        startAt: snapshot.startAt,
        action: "SEEK",
        providerId: snapshot.providerId
      })
    → Player seeks to last-known party position immediately

  LAYER 2 — Live host response (via SYNC_REQUESTED):
    publish /app/party/{partyId}/request-sync  (body: {})
    ↓
    Backend broadcasts SYNC_REQUESTED to /topic/party/{partyId}
    ↓
    HOST receives SYNC_REQUESTED:
      → publish /app/party/{partyId}/sync {
          startAt: currentTimeRef.current,  ← exact live position
          action: "SEEK",
          providerId: currentProviderRef.current
        }
    ↓
    All participants (including requester) receive SYNC → seek to live position
```

Layer 1 is instantaneous (local state). Layer 2 arrives ~100–400ms later and overrides with the exact live timestamp.

### 7.5 How the Player Applies a Sync

When `remoteSyncCommand` state changes, the player page `useEffect` fires:

```
if action === "SEEK" || "PLAY":
  new URL(activeServer.url)
  url.searchParams.set("start", Math.floor(startAt))
  url.searchParams.set("t", Math.floor(startAt))
  setStreamUrl(url.toString())          ← new key → iframe reloads
  currentTimeRef.current = startAt
  setProgress(startAt)

if action === "PAUSE":
  (iframe-based player — pause is not directly controllable;
   FORCE_PAUSE is used for buffering coordination instead)
```

The `key={streamUrl}` on the `<iframe>` forces a full reload at the new position.

### 7.6 Server Switch + Seek (Atomic)

When a SYNC event carries a `providerId` different from the current server:

```
SYNC event received:
  if event.providerId !== currentProviderId:
    setProviderId(event.providerId)
    ↓
    page useEffect [providerId]:
      idx = servers.findIndex(s => s.name === event.providerId)
      setActiveServerIndex(idx)
      ↓
      activeServer.url changes
      ↓
      stream URL useEffect [activeServer.url]:
        pendingStart = remoteSyncCommand.startAt
        if pendingStart > 0:
          embed startAt in new URL → setStreamUrl
          → iframe reloads at correct position on new server
```

The `remoteSyncCommand` is still in state when the server switches, so the seek is applied automatically on the new server's URL.

---

## 8. Server / Provider Switching

### Host switches server

```
Host clicks a server button in the UI
→ setActiveServerIndex(idx)
→ useEffect [activeServerIndex, isHost]:
    changeProvider(servers[idx].name)
    ↓
    currentProviderRef.current = servers[idx].name
    publish /app/party/{partyId}/change-provider
      { providerId: servers[idx].name }
    ↓
    Backend broadcasts PROVIDER_CHANGED { providerId }
    ↓
    All participants receive PROVIDER_CHANGED:
      setProviderId(event.providerId)
      ↓
      page useEffect finds matching server index
      setActiveServerIndex(idx)
```

### Host auto-broadcast on activeServer change

```
useEffect [activeServer.name, currentProviderRef]:
  currentProviderRef.current = activeServer.name
```

This keeps the ref in sync so the next sync push carries the correct provider.

---

## 9. Chat

```
User types in chat input → presses Enter or "Send"
  sendChat(text)
  → publish /app/party/{partyId}/chat { text }
  → Backend broadcasts CHAT event to /topic/party/{partyId}
  → All users receive CHAT → message appended to messages[]
  → Chat window auto-scrolls to bottom (messagesEndRef)
```

System messages (joins, leaves, host changes, sync mode changes) are injected into `messages[]` with `isSystemMessage: true` and rendered as centered pills.

---

## 10. Buffering Coordination

Allows a participant whose internet is slow to pause the party for everyone.

### Start buffering

```
User clicks "Buffering → On"
→ notifyBuffering()
→ publish /app/party/{partyId}/buffering  {}
→ Backend: if buffering threshold reached → broadcasts FORCE_PAUSE
→ All clients: remoteSyncCommand = { action: "PAUSE", startAt: current }
→ System message: "Party paused for buffering"
```

### End buffering

```
User clicks "Buffering → Off"
→ notifyBufferingComplete()
→ publish /app/party/{partyId}/buffering-complete  {}
→ Backend: when all users ready → broadcasts RESUME
→ All clients: remoteSyncCommand = { action: "PLAY", startAt: current }
→ System message: "Party resumed"
```

---

## 11. Strict Sync Mode

Host-only toggle. When ON, participants cannot independently seek.

```
Host clicks "Strict → On/Off"
→ toggleStrictSync()
→ publish /app/party/{partyId}/toggle-strict-sync  {}
→ Backend broadcasts STRICT_SYNC_TOGGLED { strictSync: boolean }
→ All clients: setStrictSync(boolean)
→ System message: "Strict sync is now ON/OFF"
→ UI: participant seek bars hidden when strictSync === true
```

---

## 12. Host Reassignment

When the host disconnects or leaves, the backend automatically assigns a new host.

```
Backend detects host disconnection
→ picks new host from participantIds (first remaining participant)
→ broadcasts NEW_HOST_ASSIGNED { newHostId, newHostName }
↓
All clients receive NEW_HOST_ASSIGNED:
  meIsHost = (newHostId === currentUserId)
  setIsHost(meIsHost)
  isHostRef.current = meIsHost
  System message: "{name} is now the host"
↓
New host sees host controls enabled
New host's auto-sync interval activates (isHostRef.current = true)
```

---

## 13. Party Closure

```
Backend determines party is over:
  - Host leaves and no remaining participants
  - Inactivity timeout
→ broadcasts PARTY_CLOSED { reason }
↓
All clients:
  window.alert("This party has been closed: {reason}")
  window.location.href = "/"
```

---

## 14. Complete Event Dictionary

### Incoming from `/topic/party/{partyId}` (broadcast)

| Event                 | Payload fields                                       | Frontend action                                |
| --------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| `USER_JOINED`         | `userId`, `userName`, `participantIds[]`             | Update participant list; HOST auto-pushes sync |
| `USER_LEFT`           | `userId`, `userName`, `participantIds[]`             | Update participant list                        |
| `NEW_HOST_ASSIGNED`   | `newHostId`, `newHostName`                           | Update isHost; show system message             |
| `CHAT`                | Full `WatchPartyChatMessage` object                  | Append to messages                             |
| `SYNC`                | `startAt`, `action`, `providerId?`, `partyStartedAt` | Switch server if needed; seek player           |
| `SYNC_REQUESTED`      | `requesterId`                                        | HOST only: publish live `/sync`                |
| `FORCE_PAUSE`         | `startAt`, `reason`                                  | Pause player; show system message              |
| `RESUME`              | `startAt`, `reason`                                  | Resume player; show system message             |
| `STRICT_SYNC_TOGGLED` | `strictSync: boolean`                                | Update strict mode state                       |
| `PROVIDER_CHANGED`    | `providerId`                                         | Switch server; show system message             |
| `PARTY_CLOSED`        | `reason`                                             | Alert + redirect to `/`                        |

### Incoming from `/user/queue/sync` (private)

| Event  | Payload fields                                       | Frontend action        |
| ------ | ---------------------------------------------------- | ---------------------- |
| `SYNC` | `startAt`, `action`, `providerId?`, `partyStartedAt` | Same as broadcast SYNC |

### Incoming from `/user/queue/heartbeat-ack` (private)

| Event           | Payload | Frontend action |
| --------------- | ------- | --------------- |
| `HEARTBEAT_ACK` | (empty) | Logged silently |

### Incoming from `/user/queue/error` (private)

| Event   | Payload   | Frontend action   |
| ------- | --------- | ----------------- |
| `ERROR` | `message` | Logged to console |

---

## 15. Frontend State & Refs Reference

### `useWatchParty` — React State

| State               | Type                        | Description                                       |
| ------------------- | --------------------------- | ------------------------------------------------- |
| `partyId`           | `string \| null`            | Active party UUID                                 |
| `partyState`        | `WatchPartyState \| null`   | Full party state from REST                        |
| `messages`          | `WatchPartyChatMessage[]`   | All chat + system messages                        |
| `participantIds`    | `string[]`                  | Active participant user IDs                       |
| `providerId`        | `string`                    | Current active server name (drives server switch) |
| `isHost`            | `boolean`                   | Whether current user is the host                  |
| `strictSync`        | `boolean`                   | Strict sync mode active                           |
| `isConnected`       | `boolean`                   | WebSocket connected                               |
| `currentUserId`     | `string \| undefined`       | Supabase user ID of self                          |
| `remoteSyncCommand` | `RemoteSyncCommand \| null` | Latest sync command to apply to player            |

### `useWatchParty` — Refs

| Ref                    | Type                                        | Description                                                                         |
| ---------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------- |
| `currentTimeRef`       | `MutableRefObject<number>`                  | **Updated by the player page** via `onProgress`. Used by auto-sync and manual push. |
| `currentProviderRef`   | `MutableRefObject<string>`                  | **Updated by the player page** when server changes. Carried in all sync pushes.     |
| `partyStateRef`        | `MutableRefObject<WatchPartyState \| null>` | Snapshot of REST state. Used as fallback in request-sync.                           |
| `isHostRef`            | `MutableRefObject<boolean>`                 | Mirror of `isHost` state. Readable inside WS closures.                              |
| `currentUserIdRef`     | `MutableRefObject<string \| undefined>`     | Mirror of `currentUserId`. Readable inside WS closures.                             |
| `stompClientRef`       | `MutableRefObject<Client \| null>`          | Active STOMP client instance.                                                       |
| `heartbeatIntervalRef` | `MutableRefObject<NodeJS.Timeout \| null>`  | 5-second heartbeat timer.                                                           |
| `autoSyncIntervalRef`  | `MutableRefObject<NodeJS.Timeout \| null>`  | 30-second host auto-sync timer.                                                     |

### Player Page Responsibilities

The player pages (`app/party/movie/page.tsx`, `app/party/tv/page.tsx`) must:

1. **Keep `currentTimeRef` updated** via `useWatchProgress.onProgress`:

   ```ts
   onProgress: (sec) => {
     currentTimeRef.current = sec;
   };
   ```

2. **Keep `currentProviderRef` updated** whenever the active server changes:

   ```ts
   useEffect(() => {
     if (activeServer?.name) currentProviderRef.current = activeServer.name;
   }, [activeServer?.name]);
   ```

3. **Apply `remoteSyncCommand`** by rebuilding the iframe URL with `?start=&t=`.

4. **Embed `startAt` when the server URL changes** (server switch while a sync is pending):
   ```ts
   // if remoteSyncCommand.startAt > 0 → embed it in the new server URL
   ```

---

## 16. REST API Contracts

### Create Party

```
POST /api/party/create
Authorization: Bearer {jwt}

Body:
{
  "tmdbId": 12345,
  "mediaType": "Movie",    // "Movie" | "TV"
  "seasonNo": 0,           // MUST be 0 for movies (not null)
  "episodeNo": 0,          // MUST be 0 for movies (not null)
  "providerId": "VidSrc",  // active server name
  "startAt": 120           // current playback position (integer seconds)
}

Response:
{
  "success": true,
  "partyId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Fetch Party State

```
GET /api/party/{partyId}/state
Authorization: Bearer {jwt}

Response:
{
  "success": true,
  "data": {
    "partyId": "550e8400-...",
    "hostId": "user-uuid",
    "tmdbId": 12345,
    "mediaType": "Movie",
    "seasonNo": 0,
    "episodeNo": 0,
    "providerId": "VidSrc",
    "startAt": 125.5,
    "partyStartedAt": 1715370000000,
    "strictSync": false,
    "participantIds": ["user-a-uuid", "user-b-uuid"],
    "recentChat": [...],
    "serverTime": 1715370125000
  }
}
```

---

## 17. WebSocket Action Contracts

All actions are published to `/app/party/{partyId}/{action}`.

### Join

```
Destination: /app/party/{partyId}/join
Body: {}
```

### Sync (host push)

```
Destination: /app/party/{partyId}/sync
Body:
{
  "startAt": 125.5,
  "clientTime": 1715370125000,
  "action": "SEEK",            // SEEK | PLAY | PAUSE | UPDATE
  "providerId": "VidSrc"
}
```

### Request Sync (participant)

```
Destination: /app/party/{partyId}/request-sync
Body: {}
```

### Chat

```
Destination: /app/party/{partyId}/chat
Body: { "text": "Hey everyone!" }
```

### Heartbeat

```
Destination: /app/party/{partyId}/heartbeat-ws
Body: {}
```

### Buffering

```
Destination: /app/party/{partyId}/buffering           // start
Destination: /app/party/{partyId}/buffering-complete  // end
Body: {}
```

### Strict Sync Toggle (host)

```
Destination: /app/party/{partyId}/toggle-strict-sync
Body: {}
```

### Change Provider (host)

```
Destination: /app/party/{partyId}/change-provider
Body: { "providerId": "nanovue" }
```

---

## Appendix — Timing Diagram (Join Flow)

```
TIME    PARTICIPANT                 BACKEND                     HOST
─────────────────────────────────────────────────────────────────────
 0ms    GET /party/{id}/state ──►
 50ms                        ◄── state { startAt:125, provider:"X" }
 50ms   setRemoteSyncCommand(125)
 50ms   player iframe → ?start=125  [Path A seek]
 80ms   WS connects
 90ms   /join ──────────────────►
 90ms                            broadcast USER_JOINED ──────►
 90ms                                                         recv USER_JOINED
890ms   [800ms delay]                                         publish /sync {
890ms                                                           startAt: 127.3,
890ms                                                           provider: "X"
890ms                                                         }
890ms                            broadcast SYNC ─────────────►
890ms   ◄── SYNC { startAt:127.3 }
890ms   setRemoteSyncCommand(127.3)
890ms   player iframe → ?start=127  [Path B seek — overrides A]
```

Path B always wins with the fresher live position.
