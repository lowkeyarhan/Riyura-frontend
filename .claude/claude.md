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
| `.claude/claude.md`  | Shared AI-agent memory, conventions, and full codebase graph.                 |
| `README.md`          | Human-facing project overview, architecture notes, env vars, and local setup. |
| `WATCH_PARTY.md`     | Watch party feature documentation and operational notes.                      |
| `package.json`       | npm scripts, dependency manifest, and project metadata.                       |
| `package-lock.json`  | Locked npm dependency graph for reproducible installs.                        |
| `tsconfig.json`      | TypeScript compiler options, strict mode, JSX mode, and path aliases.         |
| `eslint.config.mjs`  | ESLint flat config using Next core-web-vitals and TypeScript rules.           |
| `next.config.ts`     | Next.js runtime, image, and package optimization configuration.               |
| `postcss.config.mjs` | PostCSS setup for Tailwind CSS processing.                                    |
| `tailwind.config.js` | Tailwind theme and utility configuration.                                     |
| `next-env.d.ts`      | Next.js generated TypeScript environment declarations.                        |

### Static Assets

| Path                | Responsibility               |
| ------------------- | ---------------------------- |
| `app/favicon.ico`   | Browser favicon for the app. |
| `public/vercel.svg` | Default Vercel SVG asset.    |

### App Shell And Global Styles

| Path              | Responsibility                                                             |
| ----------------- | -------------------------------------------------------------------------- |
| `app/layout.tsx`  | Root layout, global providers, guards, analytics, and shared app chrome.   |
| `app/page.tsx`    | Root route entry that redirects users to the landing experience.           |
| `app/globals.css` | Global Tailwind imports, base styles, shared animations, and app-wide CSS. |

### Pages And Route Loading States

| Path                                | Responsibility                                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `app/landing/page.tsx`              | Public landing page for unauthenticated or first-time visitors.                                |
| `app/home/page.tsx`                 | Authenticated home page with banner, trending, popular, upcoming, and now-playing content.     |
| `app/home/loading.tsx`              | Skeleton state for the home route.                                                             |
| `app/explore/page.tsx`              | Explore catalog page with filters and paginated media browsing.                                |
| `app/explore/loading.tsx`           | Skeleton state for the explore route.                                                          |
| `app/search/page.tsx`               | Search page with URL-driven query, filters, results, and trending fallback.                    |
| `app/search/loading.tsx`            | Skeleton state for the search route.                                                           |
| `app/details/loading.tsx`           | Shared skeleton state for details routes.                                                      |
| `app/details/movie/[id]/page.tsx`   | Movie detail page for metadata, cast, similar items, and actions.                              |
| `app/details/tvshow/[id]/page.tsx`  | TV show detail page for metadata, seasons, similar items, and actions.                         |
| `app/watch/movie/[id]/page.tsx`     | Movie playback page with player layout, stream selection, and history tracking.                |
| `app/watch/movie/[id]/loading.tsx`  | Skeleton state for movie playback.                                                             |
| `app/watch/tvshow/[id]/page.tsx`    | TV playback page with episode browsing, stream selection, and history tracking.                |
| `app/watch/tvshow/[id]/loading.tsx` | Skeleton state for TV playback.                                                                |
| `app/profile/page.tsx`              | Profile dashboard for user stats, continue watching, watchlist, recommendations, and settings. |
| `app/profile/loading.tsx`           | Skeleton state for the profile route.                                                          |
| `app/watchlist/page.tsx`            | Dedicated watchlist page with filters and media grid.                                          |
| `app/watchlist/loading.tsx`         | Skeleton state for the watchlist route.                                                        |
| `app/onboarding/page.tsx`           | Onboarding flow for collecting initial user preferences.                                       |
| `app/auth/page.tsx`                 | Authentication page and Supabase sign-in flow.                                                 |
| `app/auth/callback/page.tsx`        | Supabase auth callback handler.                                                                |
| `app/party/movie/page.tsx`          | Movie watch party room/player page.                                                            |
| `app/party/tv/page.tsx`             | TV watch party room/player page.                                                               |

### Internal API Routes

| Path                                            | Responsibility                                                                    |
| ----------------------------------------------- | --------------------------------------------------------------------------------- |
| `app/api/test/health/route.ts`                  | Health-check endpoint used by backend availability UI.                            |
| `app/api/home/banner/route.ts`                  | Returns home hero/banner content.                                                 |
| `app/api/home/trending/movies/route.ts`         | Proxies or returns trending movie content for home sections.                      |
| `app/api/home/trending/tv/route.ts`             | Proxies or returns trending TV content for home sections.                         |
| `app/api/home/trending/anime/route.ts`          | Proxies or returns trending anime content for home sections.                      |
| `app/api/home/popular/movies/route.ts`          | Proxies or returns popular movie content.                                         |
| `app/api/home/popular/tv/route.ts`              | Proxies or returns popular TV content.                                            |
| `app/api/home/now-playing/movies/route.ts`      | Proxies or returns currently playing movies.                                      |
| `app/api/home/now-playing/tv/route.ts`          | Proxies or returns currently airing TV content.                                   |
| `app/api/home/upcoming/movies/route.ts`         | Proxies or returns upcoming movie content.                                        |
| `app/api/home/upcoming/tv/route.ts`             | Proxies or returns upcoming TV content.                                           |
| `app/api/explore/route.ts`                      | Explore endpoint for filtered catalog browsing.                                   |
| `app/api/search/route.ts`                       | Search endpoint for media queries and result pagination.                          |
| `app/api/details/[type]/[id]/route.ts`          | Dynamic detail endpoint for movie or TV metadata.                                 |
| `app/api/details/[type]/[id]/similiar/route.ts` | Similar-media endpoint for detail pages.                                          |
| `app/api/player/movie/[id]/route.ts`            | Movie player detail endpoint used by playback UI.                                 |
| `app/api/player/tv/[id]/route.ts`               | TV player detail endpoint used by playback UI.                                    |
| `app/api/stream/movie/route.ts`                 | Movie stream server/link endpoint.                                                |
| `app/api/stream/tv/route.ts`                    | TV stream server/link endpoint.                                                   |
| `app/api/profile/route.ts`                      | Aggregated profile endpoint for stats, watchlist, history, and continue watching. |
| `app/api/profile/history/route.ts`              | Watch history create, update, fetch, or delete endpoint.                          |
| `app/api/profile/watchlist/route.ts`            | Watchlist create, fetch, and remove endpoint.                                     |
| `app/api/profile/key/route.ts`                  | User API key storage endpoint for recommendation integrations.                    |
| `app/api/profile/recommendations/route.ts`      | Gemini-powered recommendation endpoint.                                           |
| `app/api/profile/onboard/route.ts`              | Onboarding preference persistence endpoint.                                       |
| `app/api/watchalong/party/create/route.ts`      | Creates watch party sessions.                                                     |
| `app/api/watchalong/party/join/route.ts`        | Joins users to existing watch party sessions.                                     |
| `app/api/watchalong/party/leave/route.ts`       | Removes users from watch party sessions.                                          |
| `app/api/watchalong/party/[id]/route.ts`        | Fetches or manages a specific watch party.                                        |
| `app/api/watchalong/party/[id]/sync/route.ts`   | Synchronizes playback state for a specific party.                                 |
| `app/api/watchalong/party/chat/route.ts`        | Sends or retrieves watch party chat messages.                                     |
| `app/api/watchalong/party/events/route.ts`      | Provides party event polling or streaming.                                        |
| `app/api/watchalong/party/heartbeat/route.ts`   | Tracks participant presence and liveness.                                         |
| `app/api/watchalong/party/progress/route.ts`    | Persists or broadcasts party playback progress.                                   |

### Layout Components

| Path                                           | Responsibility                                                 |
| ---------------------------------------------- | -------------------------------------------------------------- |
| `src/components/layout/AuthGate.tsx`           | Route protection and auth/onboarding redirects.                |
| `src/components/layout/BackendHealthGate.tsx`  | Backend health UI gate and server-down modal trigger.          |
| `src/components/layout/ChunkErrorBoundary.tsx` | React error boundary for chunk-load and render failures.       |
| `src/components/layout/ChunkErrorHandler.tsx`  | Global listener for failed dynamic chunks and reload recovery. |
| `src/components/layout/Navbar.tsx`             | Desktop navigation bar.                                        |
| `src/components/layout/MobileNavbar.tsx`       | Mobile navigation bar.                                         |
| `src/components/layout/Footer.tsx`             | Shared page footer.                                            |

### Media Components

| Path                                            | Responsibility                                              |
| ----------------------------------------------- | ----------------------------------------------------------- |
| `src/components/media/Banner.tsx`               | Home hero banner with featured media details and actions.   |
| `src/components/media/MediaCard.tsx`            | Reusable movie/TV/anime card for catalog grids.             |
| `src/components/media/MoviesTvMediaGrid.tsx`    | Grid renderer for movie and TV media lists.                 |
| `src/components/media/AnimeMediaGrid.tsx`       | Grid renderer tailored for anime media lists.               |
| `src/components/media/ContextMenu.tsx`          | Media card context actions such as watchlist or navigation. |
| `src/components/media/ContinueWatchingCard.tsx` | Generic continue-watching card for media progress.          |
| `src/components/media/RecommendationCard.tsx`   | Recommendation item card.                                   |

### Search Components

| Path                                             | Responsibility                                      |
| ------------------------------------------------ | --------------------------------------------------- |
| `src/components/search/SearchHero.tsx`           | Search page header and primary search presentation. |
| `src/components/search/SearchBar.tsx`            | Search input component.                             |
| `src/components/search/SearchIcons.tsx`          | Search-related icon helpers.                        |
| `src/components/search/FilterTabs.tsx`           | Search tab/filter controls.                         |
| `src/components/search/SearchResultsSection.tsx` | Search results list/grid section.                   |
| `src/components/search/SearchResultCard.tsx`     | Individual search result card.                      |
| `src/components/search/TrendingSection.tsx`      | Trending fallback or discovery section for search.  |
| `src/components/search/TrendingCard.tsx`         | Individual trending media card.                     |
| `src/components/search/EmptyState.tsx`           | Empty search result state.                          |

### Player Components

| Path                                            | Responsibility                                                   |
| ----------------------------------------------- | ---------------------------------------------------------------- |
| `src/components/player/PlayerLayout.tsx`        | Shared player page layout and primary playback frame.            |
| `src/components/player/MoviePlayerSidebar.tsx`  | Movie playback sidebar with metadata and controls.               |
| `src/components/player/TVShowPlayerSidebar.tsx` | TV playback sidebar with metadata, season, and episode controls. |
| `src/components/player/EpisodeBrowser.tsx`      | Episode selection browser for TV playback.                       |

### Profile Components

| Path                                                 | Responsibility                                                    |
| ---------------------------------------------------- | ----------------------------------------------------------------- |
| `src/components/profile/ProfileHeader.tsx`           | Profile identity header and user summary.                         |
| `src/components/profile/StatBadge.tsx`               | Small profile statistic badge.                                    |
| `src/components/profile/ContinueWatchingSection.tsx` | Profile continue-watching section wrapper.                        |
| `src/components/profile/ContinueWatchingCard.tsx`    | Profile-specific continue-watching card.                          |
| `src/components/profile/WatchlistSection.tsx`        | Profile watchlist preview section.                                |
| `src/components/profile/RecommendationsSection.tsx`  | Profile recommendation list and refresh UI.                       |
| `src/components/profile/GeminiApiKeyInput.tsx`       | API key input and persistence control for Gemini recommendations. |
| `src/components/profile/SettingsSection.tsx`         | Profile settings panel and account controls.                      |
| `src/components/profile/SettingsLink.tsx`            | Reusable settings navigation/action row.                          |

### Watchlist Components

| Path                                           | Responsibility                                 |
| ---------------------------------------------- | ---------------------------------------------- |
| `src/components/watchlist/WatchlistHeader.tsx` | Watchlist title, summary, and filter controls. |
| `src/components/watchlist/WatchlistGrid.tsx`   | Watchlist grid renderer.                       |

### Watch Party Components

| Path                                         | Responsibility                               |
| -------------------------------------------- | -------------------------------------------- |
| `src/components/party/PartyChatPanel.tsx`    | Watch party chat UI.                         |
| `src/components/party/PartyHostControls.tsx` | Host playback and party management controls. |

### Skeleton Components

| Path                                                    | Responsibility                       |
| ------------------------------------------------------- | ------------------------------------ |
| `src/components/skeletons/HomeSkeleton.tsx`             | Full home page loading skeleton.     |
| `src/components/skeletons/BannerSkeleton.tsx`           | Banner loading skeleton.             |
| `src/components/skeletons/HomeMediaGridSkeleton.tsx`    | Home media grid loading skeleton.    |
| `src/components/skeletons/MediaCardSkeleton.tsx`        | Media card loading skeleton.         |
| `src/components/skeletons/TrendingCardSkeleton.tsx`     | Trending card loading skeleton.      |
| `src/components/skeletons/SearchSkeleton.tsx`           | Search page loading skeleton.        |
| `src/components/skeletons/SearchCardSkeleton.tsx`       | Search result card loading skeleton. |
| `src/components/skeletons/ExploreSkeleton.tsx`          | Explore page loading skeleton.       |
| `src/components/skeletons/AnimeExploreSkeleton.tsx`     | Anime explore loading skeleton.      |
| `src/components/skeletons/DetailsSkeleton.tsx`          | Details page loading skeleton.       |
| `src/components/skeletons/PlayerSkeleton.tsx`           | Playback page loading skeleton.      |
| `src/components/skeletons/ProfileSkeleton.tsx`          | Profile page loading skeleton.       |
| `src/components/skeletons/ContinueWatchingSkeleton.tsx` | Continue-watching loading skeleton.  |
| `src/components/skeletons/WatchlistSkeleton.tsx`        | Watchlist loading skeleton.          |

### Generic UI Components

| Path                                     | Responsibility                                     |
| ---------------------------------------- | -------------------------------------------------- |
| `src/components/ui/FloatingNavbar.tsx`   | Floating navigation UI variant.                    |
| `src/components/ui/InfoRow.tsx`          | Reusable label/value information row.              |
| `src/components/ui/LiquidEther.tsx`      | Animated visual background/effect component.       |
| `src/components/ui/MagicBento.tsx`       | Bento-style interactive visual layout component.   |
| `src/components/ui/Notification.tsx`     | Toast/notification display component.              |
| `src/components/ui/Pagination.tsx`       | Reusable pagination control.                       |
| `src/components/ui/ServersDownModal.tsx` | Modal shown when backend services are unavailable. |
| `src/components/ui/SmoothScroll.tsx`     | Smooth scrolling behavior wrapper.                 |
| `src/components/ui/SplitText.tsx`        | Text splitting/animation helper component.         |

### Hooks

| Path                                      | Responsibility                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| `src/hooks/useAuth.ts`                    | Supabase session state, auth subscription, user metadata, and sign-out.   |
| `src/hooks/useExploreData.ts`             | Explore page filters, fetching, pagination, and state.                    |
| `src/hooks/useSearchData.ts`              | URL-driven search state, result fetching, and browser navigation restore. |
| `src/hooks/useWatchlistFilters.ts`        | Watchlist filter and derived list state.                                  |
| `src/hooks/usePlaceholderAnimation.ts`    | Rotating placeholder text behavior.                                       |
| `src/hooks/home/useHomeData.ts`           | Home page section data fetching and state.                                |
| `src/hooks/home/useTrendingData.ts`       | Trending media data fetching.                                             |
| `src/hooks/details/useMovieDetails.ts`    | Movie detail data fetching and state.                                     |
| `src/hooks/details/useTVShowDetails.ts`   | TV show detail data fetching and state.                                   |
| `src/hooks/player/useMoviePlayer.ts`      | Movie player data, lifecycle, progress, and history persistence.          |
| `src/hooks/player/useTVShowPlayer.ts`     | TV player data, episode state, progress, and history persistence.         |
| `src/hooks/player/useStreamUrls.ts`       | Stream server URL loading and playback link generation.                   |
| `src/hooks/player/useWatchProgress.ts`    | Watch progress calculations and persistence helpers.                      |
| `src/hooks/profile/useProfileData.ts`     | Aggregated profile data fetching with refetch support.                    |
| `src/hooks/profile/useWatchlist.ts`       | Watchlist fetching and optimistic item removal.                           |
| `src/hooks/profile/useWatchHistory.ts`    | Watch history mutation helpers.                                           |
| `src/hooks/profile/useGeminiApiKey.ts`    | Gemini API key read, save, and delete behavior.                           |
| `src/hooks/profile/useRecommendations.ts` | Gemini recommendation fetching, single-flight locking, and refresh.       |
| `src/hooks/party/useWatchParty.ts`        | Watch party state, sync, chat, presence, and host actions.                |

### Library And Context Files

| Path                                        | Responsibility                                                |
| ------------------------------------------- | ------------------------------------------------------------- |
| `src/lib/axios.ts`                          | Axios clients for backend and internal API calls.             |
| `src/lib/config.ts`                         | Shared runtime config such as image base URLs.                |
| `src/lib/tmdb-images.ts`                    | TMDB image path normalization helpers.                        |
| `src/lib/auth/supabase.ts`                  | Browser Supabase client initialization.                       |
| `src/lib/auth/getSession.ts`                | Session retrieval helper.                                     |
| `src/lib/server/routeUtils.ts`              | Shared server route response and error utilities.             |
| `src/lib/constants/explore.ts`              | Explore page filter, sort, genre, and option constants.       |
| `src/lib/contexts/ApiKeyContext.tsx`        | API key state context for recommendation features.            |
| `src/lib/contexts/BackendHealthContext.tsx` | Backend health polling and availability context.              |
| `src/lib/contexts/NotificationContext.tsx`  | Global notification queue and provider.                       |
| `src/lib/utils/color.ts`                    | Color utility helpers.                                        |
| `src/lib/utils/format.ts`                   | Formatting helpers for dates, durations, labels, and numbers. |
| `src/lib/utils/party.ts`                    | Watch party utility helpers.                                  |

### Prop And Type Models

| Path                                    | Responsibility                                          |
| --------------------------------------- | ------------------------------------------------------- |
| `src/props/index.ts`                    | Barrel exports for shared prop models.                  |
| `src/props/banner/banner.ts`            | Banner component and data prop types.                   |
| `src/props/explore/explore.ts`          | Explore page data, filter, and option types.            |
| `src/props/global/mediaCard.ts`         | Shared media card prop types.                           |
| `src/props/global/mediaType.ts`         | Shared media type unions and helpers.                   |
| `src/props/global/provider.ts`          | Shared provider prop types.                             |
| `src/props/movie/movieDetail.ts`        | Movie detail data types.                                |
| `src/props/movie/moviePlayer.ts`        | Movie player data and prop types.                       |
| `src/props/tv/tvDetail.ts`              | TV detail data types.                                   |
| `src/props/tv/tvPlayer.ts`              | TV player data and prop types.                          |
| `src/props/search/search.ts`            | Search page and result types.                           |
| `src/props/party/watchParty.ts`         | Watch party session, chat, participant, and sync types. |
| `src/props/profile/profile.ts`          | Profile aggregate and user summary types.               |
| `src/props/profile/continueWatching.ts` | Continue-watching item types.                           |
| `src/props/profile/history.ts`          | Watch history item types.                               |
| `src/props/profile/onboarding.ts`       | Onboarding form and preference types.                   |
| `src/props/profile/recommendation.ts`   | Recommendation item and response types.                 |
| `src/props/request-body/index.ts`       | Barrel exports for API request body types.              |
| `src/props/request-body/history.ts`     | Watch history request body types.                       |
| `src/props/request-body/watchlist.ts`   | Watchlist request body types.                           |

## Durable Memory Notes

- Keep this file as the only agent instruction file unless the user explicitly asks for split files again.
- When adding files, update the relevant codebase graph section with a one-line responsibility.
- When changing conventions, add a short durable note here instead of preserving chat transcripts.
