# Riyura Frontend

Next.js (App Router) frontend for **Riyura** — a streaming discovery + playback experience with profiles, watchlist, watch history, and Gemini-powered recommendations.

## Contents

- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Repository structure](#repository-structure)
- [Architecture (layers)](#architecture-layers)
  - [UI + routing layer (`app/`)](#ui--routing-layer-app)
  - [BFF/API layer (`app/api/`)](#bffapi-layer-appapi)
  - [Hooks layer (`src/hooks/`)](#hooks-layer-srchooks)
  - [Lib layer (`src/lib/`)](#lib-layer-srclib)
  - [DTOs + “props” types (`src/dto/`, `src/props/`)](#dtos--props-types-srcdto-srcprops)
- [Data flow (end-to-end)](#data-flow-end-to-end)
- [SSR / SSG / CSR behavior](#ssr--ssg--csr-behavior)
- [Performance optimizations](#performance-optimizations)
- [Environment variables](#environment-variables)
- [Running locally](#running-locally)
- [Key internal routes](#key-internal-routes)
- [Troubleshooting](#troubleshooting)

## Overview

This project is structured around a simple idea:

- **Client UI** renders pages and components and calls internal Next.js routes.
- **Internal API routes** act as a BFF (Backend-for-Frontend), proxying to:
  - a separate backend (`BACKEND_URL`) for home/search/explore lists, and
  - **TMDB** directly for certain detail endpoints (e.g. movie details),
  - **Supabase** for user-scoped data (profile, watchlist, watch history, Gemini key storage).

Global app concerns (auth gating, notifications, backend health detection, chunk-load error handling) are mounted once in `app/layout.tsx`.

## Tech stack

- **Framework**: Next.js `^16.1.1` (App Router), React `^19.2.0`, TypeScript
- **Styling**: Tailwind CSS v4 (`tailwindcss`, `tailwindcss-animate`), utility helpers (`clsx`, `tailwind-merge`, `class-variance-authority`)
- **Data fetching**: `fetch` (client ↔ internal APIs) + `axios` (internal APIs ↔ backend)
- **Auth & data**: Supabase (`@supabase/supabase-js`)
- **UI/animation**: `framer-motion`, `lucide-react`, Font Awesome
- **3D/visuals (where used)**: `three`, `@react-three/fiber`, `@react-three/drei`, `maath`
- **Analytics**: `@vercel/analytics`

## Repository structure

High-level:

```text
app/
  layout.tsx               # global providers + gates
  page.tsx                 # redirects to /landing
  home/                    # main authenticated home experience
  explore/                 # explore catalog
  search/                  # search UI (URL-driven)
  details/                 # details pages (movie, tv show)
  watch/                   # watch pages (movie, tv show)
  profile/                 # profile page (stats, watchlist, continue watching)
  onboarding/              # onboarding flow
  auth/                    # auth + callback
  api/                     # BFF routes (backend/TMDB/Supabase)

src/
  components/              # UI components, layouts, skeletons
  hooks/                   # composable data + behavior hooks
  lib/                     # clients, config, contexts, utilities
  dto/                     # API/DB response DTOs shared across layers
  props/                   # UI-focused prop types (cards, explore, search)
```

## Architecture (layers)

### UI + routing layer (`app/`)

- **App Router pages** live under `app/**/page.tsx`.
- Pages can be **Server Components by default**, but many in this codebase explicitly opt into client rendering via `"use client"` (for router usage, client-side fetching, animations, etc.).
- **Loading states** are implemented via `app/**/loading.tsx` for route-level skeletons.

Global composition happens in `app/layout.tsx`:

- **`ChunkErrorHandler` + `ChunkErrorBoundary`**: handle and surface chunk-load errors.
- **`NotificationProvider`**: global toasts/notifications.
- **`BackendHealthProvider`**: pings `/api/test/health` and surfaces server-down UI (via `ServersDownModal`).
- **`AuthGate`**: protects non-public routes and redirects:
  - unauthenticated users → `/auth`
  - authenticated but not onboarded → `/onboarding`
  - authenticated + onboarded landing/public visits → `/home`

### BFF/API layer (`app/api/`)

Internal route handlers provide a stable contract to the UI and keep secrets server-side.

Patterns used:

- **Proxying to the backend** using `backendClient` (Axios) from `src/lib/axios.ts`
  - Example: `/api/home/trending/movies` → `backendClient.get("/movies/trending")`
- **Calling TMDB directly** when needed (e.g. `/api/movie/[id]` uses `TMDB_API_KEY`)
- **Supabase-authenticated routes** for user data
  - Many routes accept `Authorization: Bearer <access_token>` and use `supabase.auth.getUser()` server-side to resolve the user.
- **Dynamic rendering for “live” data**:
  - Several routes export `export const dynamic = "force-dynamic";` to disable caching and ensure fresh data.

Security notes reflected in code:

- **Gemini API key storage** uses AES-256-GCM encryption (`ENCRYPTION_KEY`) before storing in Supabase.
- **Stream URL retrieval** uses `SUPABASE_SERVICE_ROLE_KEY` so the `stream_urls` table can remain private (bypassing RLS in a controlled server-only route).

### Hooks layer (`src/hooks/`)

Hooks centralize reusable behavior and provide a stable interface for components.

Key hooks:

- **`useAuth`**: reads initial session + subscribes to auth changes; exposes `user`, `loading`, `firstName`, `avatarUrl`, `signOut`.
- **`useProfileData`**: fetches `/api/profile` once per user with concurrency locking; returns `continueWatching`, `watchlist`, `stats`, and a `refetch`.
- **`useWatchlist`**: fetches `/api/profile/watchlist`; provides `removeItem` with **optimistic UI** + revert on failure.
- **`useWatchHistory`**: deletes history items via `/api/profile/history?id=...`.
- **Player hooks**
  - **`useMoviePlayer`** and **`useTVShowPlayer`** fetch details and track watch duration; persist watch history on unmount via `/api/profile/history` using `keepalive: true`.
- **`useStreamUrls`**: loads stream servers via `/api/stream-urls` and generates playback links.
- **`useGeminiApiKey`**: reads/saves/deletes the user’s encrypted Gemini key via `/api/profile/gemini`.
- **`useRecommendations`**: loads Gemini recommendations with a strict “single-flight” lock and supports `refresh()`.
- **`useSearchData`**: URL-driven search state (query/page/sort/tab) with back/forward restore; fetches `/api/search`.
- **`useTrendingData`**: fetches a small trending set for highlights.
- **`usePlaceholderAnimation`**: lightweight animated placeholder cycling.
- **`useVideasyPlayerMessages`**: listens to `postMessage` events from the Videasy player origin for future progress integration.

### Lib layer (`src/lib/`)

- **`src/lib/axios.ts`**
  - `backendClient`: talks to the separate backend at `BACKEND_URL` (defaults to `http://localhost:8080/api`)
  - `apiClient`: generic client for relative/internal calls (baseURL `""`)
- **`src/lib/auth/supabase.ts`**: browser Supabase client using `NEXT_PUBLIC_*` env vars.
- **`src/lib/contexts/*`**
  - `NotificationContext`: global notification queue with auto-dismiss
  - `BackendHealthContext`: checks backend health when the user is authenticated and not on public routes
- **`src/lib/config.ts`**: image base URL configuration (TMDB by default).
- **`src/lib/tmdb-images.ts`**: normalizes poster/backdrop paths to avoid malformed TMDB URLs.
- **`src/lib/utils/encryption.ts`**: AES-256-GCM encryption utilities for server-side key handling.
- **`src/lib/db/database.ts`**: Supabase table helpers for profiles/watchlist/watch history (used by UI/services where appropriate).

### DTOs + “props” types (`src/dto/`, `src/props/`)

This repo intentionally separates:

- **DTOs (`src/dto/`)**: shapes used across APIs/DB responses and internal route handlers (e.g. `WatchHistoryItem`, `ApiResponse<T>`).
- **UI props (`src/props/`)**: component/page-level props with UI-friendly naming (e.g. `MediaCardProp`, search/explore prop models).

This helps keep the BFF and UI layers typed without over-coupling UI components to raw backend payloads.

## Data flow (end-to-end)

Typical flows:

- **Home / Explore / Search**
  - UI pages (often client components) call `/api/home/*`, `/api/explore`, `/api/search`
  - These route handlers proxy to `BACKEND_URL` and normalize images before returning to the UI.

- **Details pages**
  - For movie details, UI calls `/api/movie/[id]`
  - That route calls TMDB directly with `TMDB_API_KEY` and merges details + credits + similar into one response.

- **Playback**
  - Watch pages obtain stream servers via `/api/stream-urls`
  - Players track local watch duration
  - On unmount, they `POST /api/profile/history` using the user’s Supabase access token.

- **Profile**
  - UI calls `/api/profile` (authorized)
  - Route handler reads watch history and watchlist from Supabase and returns:
    - “Continue Watching” items with computed progress %
    - stats aggregates (movies/series/hours)

- **Gemini personalization**
  - UI stores an encrypted Gemini key via `/api/profile/gemini` (authorized; encrypted using `ENCRYPTION_KEY`)
  - Recommendations load from `/api/profile/recommendations` via `useRecommendations`.

## SSR / SSG / CSR behavior

This codebase uses **Next.js App Router**, so “SSR” behavior is a combination of:

- **Server Components** (default in `app/`) where no `"use client"` is present
- **Client Components** where `"use client"` is declared (common here for interactive pages)
- **Route handlers** in `app/api/**/route.ts` (server-only execution)

What you’ll see in practice:

- Many pages (e.g. `app/home/page.tsx`) are **client-rendered** and fetch data from internal APIs with `cache: "no-store"`, effectively treating most UI data as **runtime/CSR**.
- Some API routes explicitly opt into runtime freshness with `export const dynamic = "force-dynamic"`.
- `app/page.tsx` uses `redirect("/landing")`, which is executed on the server at navigation time.

If you want more SSR:

- Move data fetching into Server Components and call internal BFF helpers directly (or call the backend from the server), then pass the result down to client components.
- Leverage `fetch` caching (`force-cache`, `revalidate`) where data can be safely cached.

## Performance optimizations

Optimizations already present in the repo:

- **Image optimization**
  - `next.config.ts` configures `images.remotePatterns` for TMDB, Google avatars, Unsplash.
  - WebP is preferred and `minimumCacheTTL` is set.
  - `src/lib/tmdb-images.ts` normalizes malformed poster/backdrop paths to reduce 404s and wasted retries.

- **Package import optimization**
  - `experimental.optimizePackageImports` enabled for `lucide-react` and `framer-motion`.

- **Skeleton-first UX**
  - Route-level `loading.tsx` plus component skeletons under `src/components/skeletons/` reduce layout shifts and keep perceived performance high.

- **Avoiding duplicate network calls**
  - Hooks like `useRecommendations`, `useProfileData` use “single-flight” locks via refs to prevent concurrent duplicate fetches.

- **Abortable requests**
  - Home page uses `AbortController` to cancel in-flight tab switch loads.

- **Optimistic updates**
  - Watchlist removal updates the UI immediately and reverts on failure.

- **Navigation prefetch + transitions**
  - `AuthGate` uses `router.prefetch(...)` and `startTransition(...)` to reduce route-change jank and mitigate chunk race conditions.

## Environment variables

Create `.env.local` in the project root.

- **Backend**
  - `BACKEND_URL` (default in code: `http://localhost:8080/api`)

- **TMDB**
  - `TMDB_API_KEY` (server-only, used by `/api/movie/[id]` and other TMDB-direct routes)

- **Supabase (public)**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- **Supabase (server-only)**
  - `SUPABASE_SERVICE_ROLE_KEY` (used by `/api/stream-urls`)

- **Gemini key encryption (server-only)**
  - `ENCRYPTION_KEY` (**required**): 64-character hex string (32 bytes) used for AES-256-GCM.

- **Images (optional)**
  - `NEXT_PUBLIC_IMAGE_BASE_URL` (defaults to `https://image.tmdb.org/t/p`)

## Running locally

Install deps:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

## Running with Docker (Local Development & HTTPS)

You can run the entire frontend stack (app + HTTPS reverse proxy) using Docker Compose. This setup binds the application to `https://riyura.localhost` using Caddy for local SSL certificate management and includes resource usage caps to keep CPU/RAM usage optimized.

### 1. Prerequisites

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 2. Startup

To build and spin up the containers:

```bash
docker compose up --build
```

The services will start:

- **`riyura-web`**: Next.js development server (runs inside the container, hot reload active, max 1.5 CPUs & 1GB RAM limits).
- **`riyura-caddy`**: Caddy reverse proxy serving HTTPS at `https://riyura.localhost` (max 0.5 CPUs & 128MB RAM limits).

### 3. Setup Local HTTPS Trust

Caddy will automatically issue a self-signed SSL/TLS certificate for `riyura.localhost`. To trust it locally on macOS:

1. Copy the Root CA certificate from the running Caddy container:
   ```bash
   docker compose cp riyura-caddy:/data/caddy/pki/authorities/local/root.crt ./caddy-root.crt
   ```
2. Open **Keychain Access** on macOS.
3. Drag `caddy-root.crt` into the **System** keychain.
4. Double-click the certificate in Keychain Access, expand the **Trust** section, and change "When using this certificate" to **Always Trust**.
5. Restart your browser. Now, `https://riyura.localhost` will show a valid secure HTTPS lock icon.

### 4. CORS Backend Changes

Since you are serving the frontend from `https://riyura.localhost`, make sure to update your **backend server's CORS configuration**:

- Add `https://riyura.localhost` to the allowed origins list in your backend.

### 5. Managing Dependencies

If you change `package.json` (such as installing new npm packages), rebuild the image to ensure the cached container layers are updated:

```bash
docker compose build --no-cache riyura-web
```

## Key internal routes

Not exhaustive, but the most important ones:

- **Health**
  - `GET /api/test/health` → proxies to backend `/test/health` (dynamic, no-store in client)

- **Home**
  - `GET /api/home/*` → proxies to backend list endpoints and normalizes images

- **Search / Explore**
  - `GET /api/search?q=&page=&sort_by=`
  - `GET /api/explore?page=&genres=&language=`

- **Details**
  - `GET /api/movie/[id]` → TMDB details + credits + similar
  - `GET /api/tvshow/[id]`, `GET /api/tvshow/[id]/season/[seasonId]` (present in repo)

- **Streaming servers**
  - `GET /api/stream-urls?media_type=Movie|TV` → server-only Supabase (service role)

- **User data (authorized)**
  - `GET/POST/DELETE /api/profile/watchlist`
  - `GET/POST/DELETE /api/profile/history` (watch history with duration aggregation + stream validation)
  - `GET /api/profile`

- **Gemini (authorized)**
  - `GET/POST/DELETE /api/profile/gemini` (encrypted key storage)
  - `GET /api/profile/recommendations` (present in repo)

## Troubleshooting

- **“Unauthorized” from `/api/*` routes**
  - Ensure you’re signed in and the client is passing `Authorization: Bearer <token>` (most user-data routes require it).
  - Ensure `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly.

- **Encryption errors when saving Gemini key**
  - Set `ENCRYPTION_KEY` to a **64-char hex string**.
  - Encryption runs server-side in route handlers; missing/invalid key will throw.

- **No stream servers / `/api/stream-urls` fails**
  - Ensure `SUPABASE_SERVICE_ROLE_KEY` is configured.
  - Verify the Supabase table `stream_urls` contains active rows (`is_active = true`).

- **Backend “DOWN” modal**
  - Confirm the backend is running at `BACKEND_URL`.
  - `/api/test/health` returns `503` with `{ status: "DOWN" }` when the backend is unreachable.

- **TMDB errors on detail pages**
  - Confirm `TMDB_API_KEY` is set.
  - TMDB detail routes will return `500` if the key is missing.
