# Frontend Monorepo & Shared Packages Plan

> Status: web app moved under `app/web`, shared packages in place, shared API client done. Verified with `rtk tsc --noEmit -p app/web/tsconfig.json` and `rtk npm run build`.

**Goal:** One repo where the Next.js web app (`app/web`) and a future React Native app (`app/mobile`) share DTOs, pure logic, API calls, and platform-free behavior, with a strict dependency direction that prevents drift.

## Architecture Rules

1. **Dependency direction is one-way:** `app/web/app/` + `app/web/src/` → `packages/*`. A package must never import `@/src` or `@/app`.
2. **Packages are platform-agnostic.** No `next/*`, DOM, browser storage, Supabase SSR, or `NEXT_PUBLIC_*` inside `packages/`. Platform behavior is injected through adapters (auth, navigation, storage, API base URL).
3. **Package imports use the `@riyura/*` namespace** (`@riyura/props`, `@riyura/lib/*`, `@riyura/hooks/*`, `@riyura/api`, `@riyura/ui-web/*`). Metro gets the same mapping in `metro.config.js`.
4. **App code keeps `@/*`** for web-only modules.
5. **No speculative packages.** A package appears when it has real consumers.
6. **Naming tells the platform.** `ui-web` is React DOM/Tailwind; `ui-native` will be React Native primitives; shared tokens go in their own package.

## Layout

```
/
  app/
    web/                    # Next.js app (the deployed web frontend)
      app/                  # App Router pages + BFF route handlers
      src/                  # web-only code: auth, BFF utils, web hooks, web components
      public -> ../../public # symlink: Next serves the shared static assets
    mobile/                 # React Native app (reserved, Phase 3)
  packages/                 # shared, source-only packages (no build step)
    props/                  # DTO/type models
    lib/                    # pure logic + pure React contexts
    hooks/                  # platform-free hooks
    api/                    # shared HTTP client
    ui-web/                 # web-only UI components
  public/                   # single shared static-asset root
```

Why `app/web` and `app/mobile`: the top-level `app/` folder is the monorepo container, not the Next router. The Next router lives at `app/web/app`, so a React Native app can sit beside it without being scanned as routes.

Why one `public/`: there is one copy of the brand and landing assets. Next.js requires a `public` folder at its own project root, so `app/web/public` is a symlink to the shared `public/`. React Native can bundle the same files by adding the repo root to Metro `watchFolders`. Assets that are web-only (e.g. landing media consumed only by HTML/CSS) can stay there; native-only assets will live beside them and be excluded from the web build if needed.

## What Is Actually Shared

| Package | Contents | Shared with RN? |
| --- | --- | --- |
| `packages/props` | All DTO/UI prop and request-body types. | Yes — types only. |
| `packages/lib` | `tmdb-images`, `utils/format` (runtime/date/money), `utils/party`, `contexts/NotificationContext` (pure React). | Yes. |
| `packages/hooks` | `usePlaceholderAnimation` (React state/effects/timers only). | Yes. |
| `packages/api` | `createApiClient({ baseUrl, getAccessToken })`, `request(path, { auth, body })`. | Yes — RN passes an absolute URL and its own token provider. |
| `packages/ui-web` | 12 React DOM/Tailwind components. | No — DOM components cannot render on RN. |

Web-only code deliberately kept in `app/web/src`: Supabase SSR clients, `next/navigation` hooks, BFF route utilities, axios/backend wiring, `app-env` (`NEXT_PUBLIC_*`), error-page redirect policy, web route builders (`routes.ts`), DOM canvas/color helpers, lucide-icon constants, and every data hook that uses the router, browser history, SSE, or a relative `/api/*` URL.

## Bugs Found And Fixed

| Bug | Fix |
| --- | --- |
| `ApiKeyContext` / `BackendHealthContext` imported app hooks and `next/navigation` from inside a package (reverse dependency). | Moved back to `app/web/src/lib/contexts/`. |
| `color.ts` used DOM canvas; `constants/explore.ts` imported lucide icons; `config.ts` read `NEXT_PUBLIC_*`; `axios.ts` was web/server wiring. | Moved back to `app/web/src/lib/`. |
| `app-env.ts` read `NEXT_PUBLIC_APP_ENV`; `error-page-behavior.ts` encoded a Next redirect policy; `DevModeBadge` was a web badge. | Moved back to `app/web/src/lib/` and `app/web/src/components/ui/`. |
| `getDetailsPath` built `/details/*` web routes inside the shared lib. | Moved to `app/web/src/lib/routes.ts`; `packages/lib/utils/format.ts` is now pure formatting. |
| `packages/ui` was named as if it were cross-platform but is React DOM/Tailwind. | Renamed to `packages/ui-web`. |
| `app/web/public` was the only asset root, so mobile had no shared assets. | Assets moved to root `public/`; `app/web/public` is a symlink. |
| Web components imported moved components via relative paths (`./SearchIcons`, `../skeletons/TrendingCardSkeleton`). | Updated to `@riyura/ui-web/*`. |
| Deep `@/src/props/*` imports survived the move. | Rewritten to `@riyura/props/*`. |
| Packages imported each other through `@/packages/*`. | Rewritten to `@riyura/*`. |
| `useTrendingData` used a relative `fetch("/api/...")`. | Moved back to `app/web/src/hooks/home/`. |

## Mobile API Contract

- The RN app talks to the Spring backend directly (`https://riyura-backend-1.onrender.com/api` in production), so web deploys never gate mobile.
- The Next BFF stays for web-only needs (same-origin requests, error shaping). Anything both clients need — image normalization, error mapping — belongs in `packages/api` or the backend, not only in the BFF.
- Every request sends `X-Client-Version`; `createApiClient({ clientVersion })` sets it.
- Backend changes must be additive and versioned. Installed apps update on their own cadence; a `minSupportedVersion` response lets the app force an update when a break is unavoidable.
- Distribution: signed Android APK attached to a GitHub Release. No Play Store, no App Store. iOS is out of scope because it cannot install from GitHub without a store or TestFlight.
- Update check: `GET https://api.github.com/repos/<owner>/<repo>/releases/latest`, compare the release version with the installed `versionCode`, then download the APK asset. GitHub Releases is binary distribution, not OTA.

## Phases

### Phase 1 — monorepo + shared foundation (done)
- `app/web` is the Next.js project; `app/mobile` is reserved.
- `packages/props`, `packages/lib`, `packages/hooks`, `packages/ui-web` populated.
- `@riyura/*` tsconfig aliases and one-way dependency rule enforced.
- Root `public/` shared static assets; `app/web/public` symlink.
- Verified: `rtk tsc --noEmit -p app/web/tsconfig.json` and `rtk npm run build` pass; `/logo.png` and landing assets return 200 from `next start`.

### Phase 2a — shared API client (done)
- `packages/api/client.ts`: `createApiClient({ baseUrl, getAccessToken })`; `request(path, { auth, body, ...init })` returns the raw `Response` so existing parsing/error handling is preserved. Web instance: `app/web/src/lib/api.ts` (`baseUrl: ""` + Supabase access token).
- Migrated every data hook to `api.request`: home, trending, explore, search, movie/TV details, watchlist, history, profile, recommendations, Gemini key, both player hooks. `useWatchParty` stays on raw `fetch` (web-only SSE + browser history).
- Remaining endpoint-function extraction (per-domain typed functions) is still open; the client seam is in place.

### Phase 2b — adapters + shared hooks
- **Endpoint functions** per domain (`home`, `details`, `search`, `explore`, `profile`, `player`, `party`) returning `packages/props` types; hooks and BFF routes share them.
- **`AuthAdapter`**: `{ user, loading, getAccessToken, signOut }`; web adapter wraps Supabase, RN adapter wraps supabase-js + secure storage.
- **`NavigationAdapter`**: `{ push, replace, back, pathname, searchParams }`; web adapter wraps `next/navigation`, RN adapter wraps React Navigation. Removes `next/navigation` from shared hooks.
- **`StorageAdapter`**: `{ get, set, remove }`; web = `localStorage`, RN = SQLite (or AsyncStorage for simple keys).
- Migrate data hooks to `packages/hooks` using those adapters; keep web hooks as thin wrappers so page code does not change.

### Phase 3 — React Native app (`app/mobile`)
- Expo/React Native app with its own `package.json`, Metro config mapping `@riyura/*`, and the repo root in `watchFolders` for shared assets.
- Calls the Spring backend directly with `createApiClient({ baseUrl, getAccessToken, clientVersion })`; never through the Next BFF.
- Android-only distribution: signed APK attached to a GitHub Release. Update check hits the GitHub Releases API and compares the installed `versionCode`.
- Native UI libraries, SQLite for local data, offline queue.
- Reuse `packages/props`, `packages/lib`, `packages/api`, `packages/hooks`, and root `public/` assets.
- `packages/ui-native` for RN components; share design tokens with web.

### Phase 4 — shared design tokens + UI parity
- Token package (colors, spacing, typography) consumed by the web Tailwind config and the RN theme.
- Only then consider a cross-platform UI primitive layer.

## Verification

- `rtk tsc --noEmit -p app/web/tsconfig.json` — passes.
- `rtk npm run build` — passes (all routes compile; no route changes).
- Static assets through the symlink — `/logo.png`, `/placeholder-image.jpg`, `/landing-page/perf_card_3.png` return 200 from `next start`.
- No test suite or CI exists in this repo, so runtime behavior was not automatically tested. Manual smoke check recommended for `/home`, `/explore`, `/search`, `/details/*`, `/profile`, `/watchlist`.
- Lint is unavailable (known broken `eslint-config-next` dependency).
