# Riyura Frontend Agent Context

Single source of truth for Claude Code, Codex, and other AI coding agents. Read this first, keep it concise, and update it only when durable project structure or conventions change.

## Global Agent Rules

- Work efficiently: inspect only the files needed for the task and avoid loading large files unless necessary.
- Follow existing Next.js App Router, TypeScript, hook, component, API route, and Tailwind patterns.
- Write clean, optimized, well formatted TypeScript and React code.
- Use single-line comments only when they clarify non-obvious logic; avoid comments that restate the code.
- Preserve user edits and unrelated work; never overwrite or revert without explicit instruction.
- Prefer typed interfaces and existing prop models over `any`.
- Keep client/server boundaries explicit: use `"use client"` only for browser APIs, hooks, state, effects, router, or animation.
- Browser code should call internal `/api/*` routes when auth, secrets, backend proxying, or response normalization are involved.
- Use `npm run lint` after meaningful TS/React/API changes and `npm run build` after broad routing, config, or data-contract changes.

## Project Snapshot

- App: Riyura frontend, a streaming discovery and playback experience with profile, watchlist, watch history, watch party, and Gemini recommendations.
- Stack: Next.js 16, React 19, TypeScript strict mode, Tailwind CSS v4, Supabase, Axios, Framer Motion, GSAP, lucide-react, Font Awesome, Three.js.
- Package manager: npm.
- Path alias: `@/*` maps to the repository root.

## Codebase Graph

### Root Configuration And Docs

| Path                 | Responsibility                                                                |
| -------------------- | ----------------------------------------------------------------------------- |
| `AGENTS.md`          | Agent entrypoint: rules, commands, architecture summary, and RTK usage.       |
| `.claude/claude.md`  | Shared AI-agent memory, conventions, and full codebase graph.                 |
| `README.md`          | Human-facing project overview, architecture notes, env vars, and local setup. |
| `WATCH_PARTY.md`     | Watch party feature documentation and operational notes.                      |
| `package.json`       | npm scripts, dependency manifest, and project metadata.                       |
| `package-lock.json`  | Locked npm dependency graph for reproducible installs.                        |
| `app/web/tsconfig.json`      | TypeScript compiler options, strict mode, JSX mode, and path aliases.         |
| `app/web/eslint.config.mjs`  | ESLint flat config using Next core-web-vitals and TypeScript rules.           |
| `app/web/next.config.ts`     | Next.js runtime, image, and package optimization configuration.               |
| `app/web/postcss.config.mjs` | PostCSS setup for Tailwind CSS processing.                                    |
| `app/web/next-env.d.ts`      | Next.js generated TypeScript environment declarations.                        |

### Static Assets

| Path                | Responsibility               |
| ------------------- | ---------------------------- |
| `app/web/app/favicon.ico`   | Browser favicon for the app. |
| `public/vercel.svg` | Default Vercel SVG asset.    |

`public/` is the single shared static-asset root. The Next.js app serves it through the `app/web/public -> ../../public` symlink, and React Native can bundle the same files by adding the repo root to Metro `watchFolders`.

### App Shell And Global Styles

| Path              | Responsibility                                                             |
| ----------------- | -------------------------------------------------------------------------- |
| `app/web/app/layout.tsx`  | Root layout, global providers, guards, analytics, and shared app chrome.   |
| `app/web/app/page.tsx`    | Root route entry that redirects users to the landing experience.           |
| `app/web/app/globals.css` | Global Tailwind imports, base styles, shared animations, and app-wide CSS. |

### Pages And Route Loading States

| Path                                | Responsibility                                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `app/web/app/landing/page.tsx`              | Public landing page for unauthenticated or first-time visitors.                                |
| `app/web/app/home/page.tsx`                 | Authenticated home page with banner, trending, popular, upcoming, and now-playing content.     |
| `app/web/app/home/loading.tsx`              | Skeleton state for the home route.                                                             |
| `app/web/app/explore/page.tsx`              | Explore catalog page with filters and paginated media browsing.                                |
| `app/web/app/explore/loading.tsx`           | Skeleton state for the explore route.                                                          |
| `app/web/app/search/page.tsx`               | Search page with URL-driven query, filters, results, and trending fallback.                    |
| `app/web/app/search/loading.tsx`            | Skeleton state for the search route.                                                           |
| `app/web/app/details/loading.tsx`           | Shared skeleton state for details routes.                                                      |
| `app/web/app/details/movie/[id]/page.tsx`   | Movie detail page for metadata, cast, similar items, and actions.                              |
| `app/web/app/details/tvshow/[id]/page.tsx`  | TV show detail page for metadata, seasons, similar items, and actions.                         |
| `app/web/app/watch/movie/[id]/page.tsx`     | Movie playback page with player layout, stream selection, and history tracking.                |
| `app/web/app/watch/movie/[id]/loading.tsx`  | Skeleton state for movie playback.                                                             |
| `app/web/app/watch/tvshow/[id]/page.tsx`    | TV playback page with episode browsing, stream selection, and history tracking.                |
| `app/web/app/watch/tvshow/[id]/loading.tsx` | Skeleton state for TV playback.                                                                |
| `app/web/app/profile/page.tsx`              | Profile dashboard for user stats, continue watching, watchlist, recommendations, and settings. |
| `app/web/app/profile/loading.tsx`           | Skeleton state for the profile route.                                                          |
| `app/web/app/watchlist/page.tsx`            | Dedicated watchlist page with filters and media grid.                                          |
| `app/web/app/watchlist/loading.tsx`         | Skeleton state for the watchlist route.                                                        |
| `app/web/app/onboarding/page.tsx`           | Onboarding flow for collecting initial user preferences.                                       |
| `app/web/app/auth/page.tsx`                 | Authentication page and Supabase sign-in flow.                                                 |
| `app/web/app/auth/callback/page.tsx`        | Supabase auth callback handler.                                                                |
| `app/web/app/party/movie/page.tsx`          | Movie watch party room/player page.                                                            |
| `app/web/app/party/tv/page.tsx`             | TV watch party room/player page.                                                               |

### Internal API Routes

| Path                                            | Responsibility                                                                    |
| ----------------------------------------------- | --------------------------------------------------------------------------------- |
| `app/web/app/api/test/health/route.ts`                  | Health-check endpoint used by backend availability UI.                            |
| `app/web/app/api/home/banner/route.ts`                  | Returns home hero/banner content.                                                 |
| `app/web/app/api/home/trending/movies/route.ts`         | Proxies or returns trending movie content for home sections.                      |
| `app/web/app/api/home/trending/tv/route.ts`             | Proxies or returns trending TV content for home sections.                         |
| `app/web/app/api/home/trending/anime/route.ts`          | Proxies or returns trending anime content for home sections.                      |
| `app/web/app/api/home/popular/movies/route.ts`          | Proxies or returns popular movie content.                                         |
| `app/web/app/api/home/popular/tv/route.ts`              | Proxies or returns popular TV content.                                            |
| `app/web/app/api/home/now-playing/movies/route.ts`      | Proxies or returns currently playing movies.                                      |
| `app/web/app/api/home/now-playing/tv/route.ts`          | Proxies or returns currently airing TV content.                                   |
| `app/web/app/api/home/upcoming/movies/route.ts`         | Proxies or returns upcoming movie content.                                        |
| `app/web/app/api/home/upcoming/tv/route.ts`             | Proxies or returns upcoming TV content.                                           |
| `app/web/app/api/explore/route.ts`                      | Explore endpoint for filtered catalog browsing.                                   |
| `app/web/app/api/search/route.ts`                       | Search endpoint for media queries and result pagination.                          |
| `app/web/app/api/details/[type]/[id]/route.ts`          | Dynamic detail endpoint for movie or TV metadata.                                 |
| `app/web/app/api/details/[type]/[id]/similiar/route.ts` | Similar-media endpoint for detail pages.                                          |
| `app/web/app/api/player/movie/[id]/route.ts`            | Movie player detail endpoint used by playback UI.                                 |
| `app/web/app/api/player/tv/[id]/route.ts`               | TV player detail endpoint used by playback UI.                                    |
| `app/web/app/api/stream/movie/route.ts`                 | Movie stream server/link endpoint.                                                |
| `app/web/app/api/stream/tv/route.ts`                    | TV stream server/link endpoint.                                                   |
| `app/web/app/api/profile/route.ts`                      | Aggregated profile endpoint for stats, watchlist, history, and continue watching. |
| `app/web/app/api/profile/history/route.ts`              | Watch history create, update, fetch, or delete endpoint.                          |
| `app/web/app/api/profile/watchlist/route.ts`            | Watchlist create, fetch, and remove endpoint.                                     |
| `app/web/app/api/profile/key/route.ts`                  | User API key storage endpoint for recommendation integrations.                    |
| `app/web/app/api/profile/recommendations/route.ts`      | Gemini-powered recommendation endpoint.                                           |
| `app/web/app/api/profile/onboard/route.ts`              | Onboarding preference persistence endpoint.                                       |
| `app/web/app/api/watchalong/party/create/route.ts`      | Creates watch party sessions.                                                     |
| `app/web/app/api/watchalong/party/join/route.ts`        | Joins users to existing watch party sessions.                                     |
| `app/web/app/api/watchalong/party/leave/route.ts`       | Removes users from watch party sessions.                                          |
| `app/web/app/api/watchalong/party/[id]/route.ts`        | Fetches or manages a specific watch party.                                        |
| `app/web/app/api/watchalong/party/[id]/sync/route.ts`   | Synchronizes playback state for a specific party.                                 |
| `app/web/app/api/watchalong/party/chat/route.ts`        | Sends or retrieves watch party chat messages.                                     |
| `app/web/app/api/watchalong/party/events/route.ts`      | Provides party event polling or streaming.                                        |
| `app/web/app/api/watchalong/party/heartbeat/route.ts`   | Tracks participant presence and liveness.                                         |
| `app/web/app/api/watchalong/party/progress/route.ts`    | Persists or broadcasts party playback progress.                                   |

### Shared Packages

Packages are imported through the `@riyura/*` aliases in `app/web/tsconfig.json`. Dependency rule: `app/web/app/` and `app/web/src/` may import packages, packages must never import `@/src` or `@/app`. Platform-specific code (Next, Supabase SSR, DOM, browser storage) stays in the web app. `packages/ui-web` is web-only React DOM/Tailwind; React Native needs `packages/ui-native` plus shared design tokens, not a move of these components.

| Path                                              | Responsibility                                                   |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| `packages/props/index.ts`                         | Barrel exports for shared DTO and type models (all prop models). |
| `packages/props/**`                               | Universal media, profile, party, and request-body types.         |
| `packages/lib/tmdb-images.ts`                     | TMDB image path normalization helpers.                           |
| `packages/lib/contexts/NotificationContext.tsx`   | Global notification queue and provider (pure React).             |
| `packages/lib/utils/format.ts`                    | Formatting helpers for dates, durations, labels, and numbers.    |
| `packages/lib/utils/party.ts`                     | Watch party utility helpers.                                     |
| `packages/hooks/usePlaceholderAnimation.ts`       | Rotating placeholder text behavior (pure React).                 |
| `packages/api/client.ts`                          | Platform-agnostic fetch client with base URL and bearer token.   |
| `packages/api/index.ts`                           | Barrel exports for the shared API client.                        |
| `packages/ui-web/ChunkErrorBoundary.tsx`          | React error boundary for chunk-load and render failures.         |
| `packages/ui-web/PageBackdrop.tsx`                | Shared page backdrop decoration.                                 |
| `packages/ui-web/PlayerLayout.tsx`                | Shared player page layout frame.                                 |
| `packages/ui-web/SearchIcons.tsx`                 | Search-related icon helpers.                                     |
| `packages/ui-web/SearchHero.tsx`                  | Search page header and primary search presentation.              |
| `packages/ui-web/FilterTabs.tsx`                  | Search tab/filter controls.                                      |
| `packages/ui-web/EmptyState.tsx`                  | Empty search result state.                                       |
| `packages/ui-web/TrendingCardSkeleton.tsx`        | Trending card loading skeleton.                                  |
| `packages/ui-web/MediaCardSkeleton.tsx`           | Media card loading skeleton.                                     |
| `packages/ui-web/WatchlistHeader.tsx`             | Watchlist title, summary, and filter controls.                   |
| `packages/ui-web/ErrorScreen.tsx`                 | Reusable error screen.                                           |
| `packages/ui-web/Notification.tsx`                | Toast/notification display component.                            |

### Layout Components

| Path                                           | Responsibility                                                 |
| ---------------------------------------------- | -------------------------------------------------------------- |
| `app/web/src/components/layout/AuthGate.tsx`           | Route protection and auth/onboarding redirects.                |
| `app/web/src/components/layout/ChunkErrorHandler.tsx`  | Global listener for failed dynamic chunks and reload recovery. |
| `app/web/src/components/layout/Navbar.tsx`             | Desktop navigation bar.                                        |
| `app/web/src/components/layout/MobileNavbar.tsx`       | Mobile navigation bar.                                         |
| `app/web/src/components/layout/Footer.tsx`             | Shared page footer.                                            |

### Media Components

| Path                                            | Responsibility                                              |
| ----------------------------------------------- | ----------------------------------------------------------- |
| `app/web/src/components/media/Banner.tsx`               | Home hero banner with featured media details and actions.   |
| `app/web/src/components/media/MediaCard.tsx`            | Reusable movie/TV/anime card for catalog grids.             |
| `app/web/src/components/media/MoviesTvMediaGrid.tsx`    | Grid renderer for movie and TV media lists.                 |
| `app/web/src/components/media/AnimeMediaGrid.tsx`       | Grid renderer tailored for anime media lists.               |
| `app/web/src/components/media/ContextMenu.tsx`          | Media card context actions such as watchlist or navigation. |
| `app/web/src/components/media/ContinueWatchingCard.tsx` | Generic continue-watching card for media progress.          |
| `app/web/src/components/media/RecommendationCard.tsx`   | Recommendation item card.                                   |

### Search Components

| Path                                             | Responsibility                                      |
| ------------------------------------------------ | --------------------------------------------------- |
| `app/web/src/components/search/SearchBar.tsx`            | Search input component.                             |
| `app/web/src/components/search/SearchResultsSection.tsx` | Search results list/grid section.                   |
| `app/web/src/components/search/TrendingSection.tsx`      | Trending fallback or discovery section for search.  |
| `app/web/src/components/search/TrendingCard.tsx`         | Individual trending media card.                     |

### Player Components

| Path                                            | Responsibility                                                   |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| `app/web/src/components/player/MoviePlayerSidebar.tsx`  | Movie playback sidebar with metadata and controls.               |
| `app/web/src/components/player/TVShowPlayerSidebar.tsx` | TV playback sidebar with metadata, season, and episode controls. |
| `app/web/src/components/player/EpisodeBrowser.tsx`      | Episode selection browser for TV playback.                       |

### Profile Components

| Path                                                 | Responsibility                                                    |
| ---------------------------------------------------- | ----------------------------------------------------------------- |
| `app/web/src/components/profile/ProfileHeader.tsx`           | Profile identity header and user summary.                         |
| `app/web/src/components/profile/StatBadge.tsx`               | Small profile statistic badge.                                    |
| `app/web/src/components/profile/ContinueWatchingSection.tsx` | Profile continue-watching section wrapper.                        |
| `app/web/src/components/profile/ContinueWatchingCard.tsx`    | Profile-specific continue-watching card.                          |
| `app/web/src/components/profile/WatchlistSection.tsx`        | Profile watchlist preview section.                                |
| `app/web/src/components/profile/RecommendationsSection.tsx`  | Profile recommendation list and refresh UI.                       |
| `app/web/src/components/profile/GeminiApiKeyInput.tsx`       | API key input and persistence control for Gemini recommendations. |
| `app/web/src/components/profile/SettingsSection.tsx`         | Profile settings panel and account controls.                      |
| `app/web/src/components/profile/SettingsLink.tsx`            | Reusable settings navigation/action row.                          |

### Watchlist Components

| Path                                           | Responsibility                                 |
| ---------------------------------------------- | ---------------------------------------------- |
| `app/web/src/components/watchlist/WatchlistGrid.tsx`   | Watchlist grid renderer.                       |

### Watch Party Components

| Path                                         | Responsibility                               |
| -------------------------------------------- | -------------------------------------------- |
| `app/web/src/components/party/PartyChatPanel.tsx`    | Watch party chat UI.                         |
| `app/web/src/components/party/PartyHostControls.tsx` | Host playback and party management controls. |

### Skeleton Components

| Path                                                    | Responsibility                       |
| ------------------------------------------------------- | ------------------------------------ |
| `app/web/src/components/skeletons/HomeSkeleton.tsx`             | Full home page loading skeleton.     |
| `app/web/src/components/skeletons/BannerSkeleton.tsx`           | Banner loading skeleton.             |
| `app/web/src/components/skeletons/HomeMediaGridSkeleton.tsx`    | Home media grid loading skeleton.    |

| `app/web/src/components/skeletons/SearchSkeleton.tsx`           | Search page loading skeleton.        |
| `app/web/src/components/skeletons/ExploreSkeleton.tsx`          | Explore page loading skeleton.       |
| `app/web/src/components/skeletons/DetailsSkeleton.tsx`          | Details page loading skeleton.       |
| `app/web/src/components/skeletons/PlayerSkeleton.tsx`           | Playback page loading skeleton.      |
| `app/web/src/components/skeletons/ProfileSkeleton.tsx`          | Profile page loading skeleton.       |
| `app/web/src/components/skeletons/ContinueWatchingSkeleton.tsx` | Continue-watching loading skeleton.  |
| `app/web/src/components/skeletons/WatchlistSkeleton.tsx`        | Watchlist loading skeleton.          |

### Generic UI Components

| Path                                     | Responsibility                                     |
| ---------------------------------------- | -------------------------------------------------- |
| `app/web/src/components/ui/FloatingNavbar.tsx`   | Floating navigation UI variant.                    |
| `app/web/src/components/ui/LiquidEther.tsx`      | Animated visual background/effect component.       |
| `app/web/src/components/ui/MagicBento.tsx`       | Bento-style interactive visual layout component.   |
| `app/web/src/components/ui/ServersDownModal.tsx` | Modal shown when backend services are unavailable. |
| `app/web/src/components/ui/SmoothScroll.tsx`     | Smooth scrolling behavior wrapper.                 |
| `app/web/src/components/ui/SplitText.tsx`        | Text splitting/animation helper component.         |
| `app/web/src/components/ui/DevModeBadge.tsx`     | Development-mode badge (web-only).                  |

### Hooks

| Path                                      | Responsibility                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| `app/web/src/hooks/useAuth.ts`                    | Supabase session state, auth subscription, user metadata, and sign-out.   |
| `app/web/src/hooks/useExploreData.ts`             | Explore page filters, fetching, pagination, and state.                    |
| `app/web/src/hooks/useSearchData.ts`              | URL-driven search state, result fetching, and browser navigation restore. |
| `app/web/src/hooks/useWatchlistFilters.ts`        | Watchlist filter and derived list state.                                  |
| `app/web/src/hooks/home/useHomeData.ts`           | Home page section data fetching and state.                                |
| `app/web/src/hooks/home/useTrendingData.ts`       | Trending media data fetching.                                             |
| `app/web/src/hooks/details/useMovieDetails.ts`    | Movie detail data fetching and state.                                     |
| `app/web/src/hooks/details/useTVShowDetails.ts`   | TV show detail data fetching and state.                                   |
| `app/web/src/hooks/player/useMoviePlayer.ts`      | Movie player data, lifecycle, progress, and history persistence.          |
| `app/web/src/hooks/player/useTVShowPlayer.ts`     | TV player data, episode state, progress, and history persistence.         |
| `app/web/src/hooks/player/useWatchProgress.ts`    | Watch progress calculations and persistence helpers.                      |
| `app/web/src/hooks/profile/useProfileData.ts`     | Aggregated profile data fetching with refetch support.                    |
| `app/web/src/hooks/profile/useWatchlist.ts`       | Watchlist fetching and optimistic item removal.                           |
| `app/web/src/hooks/profile/useWatchHistory.ts`    | Watch history mutation helpers.                                           |
| `app/web/src/hooks/profile/useGeminiApiKey.ts`    | Gemini API key read, save, and delete behavior.                           |
| `app/web/src/hooks/profile/useRecommendations.ts` | Gemini recommendation fetching, single-flight locking, and refresh.       |
| `app/web/src/hooks/party/useWatchParty.ts`        | Watch party state, sync, chat, presence, and host actions.                |

### Library And Context Files

| Path                                        | Responsibility                                                |
| ------------------------------------------- | ------------------------------------------------------------- |
| `app/web/src/lib/axios.ts`                          | Axios clients for backend and internal API calls.             |
| `app/web/src/lib/api.ts`                            | Web API client instance (`@riyura/api/client` + Supabase auth). |
| `app/web/src/lib/config.ts`                         | Shared runtime config such as image base URLs.                |
| `app/web/src/lib/auth/supabase.ts`                  | Browser Supabase client initialization.                       |
| `app/web/src/lib/auth/getSession.ts`                | Session retrieval helper.                                     |
| `app/web/src/lib/server/routeUtils.ts`              | Shared server route response and error utilities.             |
| `app/web/src/lib/constants/explore.ts`              | Explore page filter, sort, genre, and option constants.       |
| `app/web/src/lib/contexts/ApiKeyContext.tsx`        | API key state context for recommendation features.            |
| `app/web/src/lib/contexts/BackendHealthContext.tsx` | Backend health polling and availability context.              |
| `app/web/src/lib/utils/color.ts`                    | Color utility helpers.                                        |
| `app/web/src/lib/app-env.ts`                        | Web app environment resolution (`NEXT_PUBLIC_APP_ENV`).       |
| `app/web/src/lib/error-page-behavior.ts`            | Web error page redirect policy.                               |
| `app/web/src/lib/routes.ts`                         | Web route builders such as details paths.                     |

### Prop And Type Models

All prop and request-body models now live in `packages/props/**` (see Shared Packages). Import them through `@riyura/props/*` or the `@riyura/props` barrel.

## Durable Memory Notes

- `AGENTS.md` is the agent entrypoint (rules, commands, RTK usage). Keep this file as the full file-by-file codebase graph and update it when files are added, moved, or deleted.
- When adding files, update the relevant codebase graph section with a one-line responsibility.
- When changing conventions, add a short durable note here instead of preserving chat transcripts.
- Mobile plan: `app/mobile` is React Native, distributed as a signed Android APK via GitHub Releases (no stores), calls the Spring backend directly, and sends `X-Client-Version`; backend changes stay additive/versioned.
