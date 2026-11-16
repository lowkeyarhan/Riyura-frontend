# Riyura Frontend — Code Audit

**What this repo does:** This is the Next.js frontend for Riyura, a streaming site. It handles discovery, details, playback through third-party iframe providers, watchlists, watch history, Gemini recommendations, and watch parties. A separate Spring backend at `BACKEND_URL` owns the data; this app is mostly a client UI plus a thin BFF (backend-for-frontend) under `app/api/`.

**Assumed load:** A consumer streaming site with many concurrent viewers, not a single-user tool. The public landing/auth pages get anonymous traffic; the protected pages get logged-in viewers, often several tabs per user. The Next server is a proxy, not the source of truth, so connection leaks and request races matter more than raw CPU.

**How I checked:** I read the routes, hooks, components, configs, README, and deploy files end to end. `tsc --noEmit` passes and `next build` reports 0 errors and 0 warnings. That only proves the code compiles: ESLint is broken, there are no tests, and the build does not exercise runtime behavior. `npm audit` reports 2 high and 1 moderate vulnerabilities, all through the unused `ngrok` package.

---

## Must fix

### 1. Auth and onboarding are enforced only in the browser, and a missing profile row gets stuck

- **What this is:** `AuthGate` (`src/components/layout/AuthGate.tsx:22-68`) checks the Supabase session and the `profiles.onboarded` flag in a client effect. It is mounted in the root layout. There is no `proxy.ts`/`middleware.ts` and no server-side session check.
- **Problem:** If the `profiles` row is missing (for example, the signup trigger failed), `.single()` returns an error, `onboarded` stays `null`, and the public-route redirect never runs. A logged-in user with no profile sits on `/landing` forever. On protected routes, onboarding is never required at all, so the same user can use `/home` without a profile. Separately, protected pages render their shell before the client redirect fires.
- **Fix:** Treat a missing profile as `onboarded = false` and always enforce `!onboarded → /onboarding` for logged-in users. Add `proxy.ts` (Next 16's renamed middleware; `middleware.ts` still works) using the already-installed `@supabase/ssr` to refresh the session and redirect unauthenticated requests for protected paths. Keep the client gate as a fallback, not the only gate.
- **If we skip it:** New users with a failed profile insert land in the wrong flow and can use the app un-onboarded; direct URL access shows protected UI before any check.

### 2. Watch progress accepts forged `postMessage` events from any origin

- **What this is:** `useWatchProgress` (`src/hooks/player/useWatchProgress.ts`) listens to `window.message` and turns player events into watch progress.
- **Problem:** The Syntherion and Dormannu branches accept any message from any origin (lines 97-142). The vidlink branch uses `event.origin.includes("vidlink")` (lines 73-74), so `https://evil-vidlink.example` passes. Any window that can frame or open the app can set `latestProgressRef`, and that value is later written to watch history and Continue Watching.
- **Fix:** Use an exact origin allowlist per provider and check `event.source === playerIframe.current?.contentWindow`. Pass the player iframe ref into the hook. Remove the `includes` check.
- **If we skip it:** A malicious site can corrupt the user's watch history and resume position.

### 3. The SSE proxy never closes the upstream backend connection

- **What this is:** `app/api/watchalong/party/events/route.ts` proxies the backend's Server-Sent Events stream to the browser.
- **Problem:** The upstream `fetch` at line 31 has no `signal`. When the browser closes the tab or the client aborts, the Next route ends but the backend stream stays open until the backend times out. Each abandoned party tab leaves a live backend connection.
- **Fix:** Pass `signal: request.signal` to the `fetch`. One line.
- **If we skip it:** Normal tab churn accumulates dead SSE connections on the backend until it runs out of threads or connections.

### 4. Party pages double-prefix already-normalized backdrop URLs

- **What this is:** The player API routes normalize `backdrop_path` to a full TMDB URL (`app/api/player/movie/[id]/route.ts:24-26` and the TV equivalent).
- **Problem:** Three party components prepend the TMDB base again: `app/party/movie/page.tsx:75-76`, `app/party/tv/page.tsx:94-95`, and `src/components/party/PartyHostControls.tsx:53-54`. The result is `https://image.tmdb.org/t/p/w1280https://image.tmdb.org/t/p/w500/...`, which 404s. Party backgrounds and sidebar thumbnails are broken.
- **Fix:** Use the normalized URL directly. If a different size is needed, normalize to `w1280`/`original` in the API route, not in the component. Remove the manual prefixes in all three places.
- **If we skip it:** Every watch party shows the fallback image instead of the movie backdrop.

### 5. Banner actions are broken: wrong route, add-only watchlist, title-based lookup

- **What this is:** `src/components/media/Banner.tsx` renders the home hero and its Continue Watching cards.
- **Problem:** (a) TV Continue Watching pushes `/player/tvshow/:id` (line 453), but the real route is `/watch/tvshow/:id`, so the click 404s. (b) The watchlist button only POSTs (lines 352-398), so it can add but never remove; unlike the detail pages, there is no undo from the banner. (c) Continue Watching is matched by `title` (line 438), so two different titles with the same name open the wrong item.
- **Fix:** Change the route to `/watch/tvshow/...`; make the watchlist button a real toggle (check the item's watchlist state or use the POST response to switch to DELETE); match by `tmdbId` + `mediaType` instead of `title`.
- **If we skip it:** TV Continue Watching is dead, the watchlist button cannot undo, and duplicate titles open the wrong media.

### 6. Watchlist state does not match what the server did

- **What this is:** Two watchlist code paths update local state incorrectly.
- **Problem:** `useTVShowDetails.toggleWatchlist` (`src/hooks/details/useTVShowDetails.ts:110-122`) deletes the item but never calls `setIsWatchlisted(false)`, so the button stays in "remove" state and a second click sends DELETE again. `useWatchlist.removeItem` (`src/hooks/profile/useWatchlist.ts:58`) filters by `tmdbId` only, so deleting a movie also hides a TV show with the same TMDB id; the API call correctly includes `media_type`.
- **Fix:** Add `setIsWatchlisted(false)` and a success notification after a successful DELETE. Filter the optimistic removal by both `tmdbId` and `mediaType`, and use the functional `setItems` form.
- **If we skip it:** Users see the wrong watchlist state, and removing one title makes an unrelated title disappear until refresh.

### 7. A quick Home tab switch can permanently mark a section as loaded with empty data

- **What this is:** `src/hooks/home/useHomeData.ts` lazily loads TV and anime rows when the user selects a tab.
- **Problem:** `fetchMedia` catches `AbortError` and returns empty results (lines 64-74). When the user switches tabs quickly, cleanup aborts the request, but the async function continues: it writes the empty arrays and adds the tab to `loadedSections` (line 179). The effect then refuses to retry because the tab is "loaded". The tab stays blank until a full page reload.
- **Fix:** After the `await`, return early if `controller.signal.aborted` before any `setState`. Do the same in the anime branch and only clear `isTabSwitching` when the request was not aborted.
- **If we skip it:** A quick tab switch leaves Home with permanently empty rows.

### 8. Search results can be overwritten by an older request

- **What this is:** `src/hooks/useSearchData.ts` fetches search pages and updates the result list.
- **Problem:** There is no `AbortController` or request id (lines 105-146). Type "bat" then "batman"; if the first response arrives last, it overwrites the second. `lastQuery`, `page`, and the URL no longer match what is on screen.
- **Fix:** Keep an `AbortController` in a ref, abort the previous request before each fetch, and ignore `AbortError`. Add a request id if the abort still races.
- **If we skip it:** Users see results for a query they no longer typed, and pagination mixes pages.

### 9. Party create/join failures leave an infinite spinner

- **What this is:** `useWatchParty` creates or joins a party when the page loads.
- **Problem:** On a non-OK response, `create` (line 587) and `join` (line 615) just `return`. `partyId` and `streamUrl` stay `null`, so the page shows the loading spinner forever with no error or retry.
- **Fix:** Show a notification with the backend error, then navigate back to the player or show a Retry button. Do not leave the loading state.
- **If we skip it:** A wrong or expired party code looks like an infinite load.

### 10. Watch party progress is pushed every 5 minutes and participants never follow it

- **What this is:** The host's progress sync in `src/hooks/party/useWatchParty.ts`.
- **Problem:** The host pushes progress every 5 minutes (`PROGRESS_PUSH_INTERVAL_MS`, line 15), while `WATCH_PARTY.md` says every ~5 seconds. Participants store `partyState.progress` but never seek to it; only a provider change calls `syncPlayer` (lines 423-451). Participants drift minutes behind and never catch up.
- **Fix:** Push every ~5 seconds (or on pause/seek). On `PARTY_STATE_UPDATED`, seek the participant's player when the difference is above a few seconds, or reload the iframe with the host's `startAt`. If the provider cannot seek, reload the iframe.
- **If we skip it:** Watch parties are not actually in sync.

---

## Should fix

### 11. ESLint is broken and there are no tests or CI

- **What this is:** The quality gates.
- **Problem:** `npm run lint` fails with `ERR_MODULE_NOT_FOUND`: `eslint.config.mjs:2` imports `eslint-config-next/core-web-vitals`, but `package.json:49` pins `eslint-config-next` to `^0.2.4`, which is a different package and has no such export. Next 16 does not run ESLint during `next build`, so the build passes while lint is dead. There is no test script, no test file, and no CI config.
- **Fix:** Install `eslint-config-next@16` (matching Next) and run `npm run lint` in CI. Add Vitest + Testing Library and one test each for the search race, the watchlist toggle, and a failed party join. Keep it small; one good test per risky path is enough.
- **If we skip it:** Regressions like the ones in this report pass the build and nobody catches them until users do.

### 12. Nine home API routes are near-copies

- **What this is:** `app/api/home/**` contains nine section routes (now-playing, popular, trending, upcoming × movie/TV, plus trending/anime) that are almost identical.
- **Problem:** Each is about 36 lines and differs only in the backend path and error text. They hardcode `limit: 12` and ignore the client's query string. `app/api/profile/recommendations/route.ts:7-10` also reimplements `getAuthHeader` instead of using `src/lib/server/routeUtils.ts`.
- **Fix:** Replace the nine routes with one dynamic route `app/api/home/[section]/[type]/route.ts` and a small map from URL segment to backend path. Keep the public URLs unchanged. Use `routeUtils` in the recommendations route.
- **If we skip it:** Every new home row or backend rename touches nine files, and they drift apart.

### 13. The landing page ships 26 MB of unoptimized images and nine font imports

- **What this is:** `app/landing/page.tsx` and `app/globals.css`.
- **Problem:** `public/landing-page` is 26 MB. `ParallaxImg` is a raw `<motion.img>` (`app/landing/page.tsx:35-45`), so the ~20 images use no `next/image`, no lazy loading, and no width/height. `app/globals.css:1-9` has nine Google Fonts `@import`s, including Montserrat twice; Outfit and Space Grotesk are imported but unused. All of this loads on the first visit.
- **Fix:** Use `next/image` for the cards (or at least `loading="lazy" decoding="async"` plus explicit dimensions), compress to WebP/AVIF, and keep only the hero eager. Replace the font imports with `next/font` or one `<link>` for the families actually used (Be Vietnam Pro, Montserrat, Pinyon Script, Bruno Ace, DM Sans, Inter Tight).
- **If we skip it:** The landing page is slow on mobile and the font imports block first paint.

### 14. Dead files, dead config, and 14 unused packages

- **What this is:** Code and dependencies that are not imported anywhere.
- **Problem:** `AnimeExploreSkeleton.tsx` (58 lines), `InfoRow.tsx` (24), `Pagination.tsx` (108), and `useStreamUrls.ts` (94) are unused; the last one targets `/api/stream-urls`, which does not exist. Fourteen packages are unused: `@fortawesome/*` (3), `@react-three/fiber`, `@react-three/drei`, `@stomp/stompjs`, `sockjs-client`, `@types/sockjs-client`, `mathjs`, `ngrok`, `class-variance-authority`, `tailwind-merge`, `maath`, and `tailwindcss-animate`. `tailwind.config.js` is ignored by Tailwind v4 because `app/globals.css` has no `@config`. `bannerData` in `useHomeData` is defined and set but never read. `npm audit` reports 2 high and 1 moderate vulnerabilities, all through `ngrok`.
- **Fix:** Delete the files and packages. Remove `tailwind.config.js` or add `@config` if it is meant to be used. Delete `bannerData`.
- **If we skip it:** Slower installs, a larger dependency tree, known CVEs from `ngrok`, and dead code that points at a route that does not exist.
- **Lean:** about -550 lines and -14 dependencies possible (this finding plus the home-route merge).

### 15. Detail pages show a Rickroll trailer and a Share button that does nothing

- **What this is:** The trailer modal and Share button on both detail pages.
- **Problem:** The iframe source is `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1` for every title (`app/details/movie/[id]/page.tsx:81`, `app/details/tvshow/[id]/page.tsx:84`). The Share button has no `onClick` (`movie:167`, `TV:167`). The user cannot watch the real trailer or share the page.
- **Fix:** Use the trailer key from the details response (`videos.results`) and hide the button when there is none. Implement Share with `navigator.share` and a clipboard fallback.
- **If we skip it:** Two prominent buttons are fake.

### 16. Footer links, the newsletter, and social icons are placeholders

- **What this is:** `src/components/layout/Footer.tsx`.
- **Problem:** The footer links to ten routes that do not exist: `/movies`, `/tv`, `/anime`, `/trending`, `/history`, `/premium`, `/help`, `/terms`, `/privacy`, `/contact`. The newsletter form only clears the input (`Footer.tsx:11-14`), and the social icons point to `#` (`Footer.tsx:127-129`). Clicking any of them 404s or does nothing.
- **Fix:** Point links to real pages (`/explore`, `/watchlist`, `/profile`), remove or disable the rest, wire the newsletter to a backend endpoint or remove the form, and use real social URLs.
- **If we skip it:** Users hit 404s and the email form silently loses signups.

### 17. No error page, no 404 page, no per-page metadata, and almost everything is client-rendered

- **What this is:** The Next.js app structure.
- **Problem:** There is no `app/error.tsx`, `app/global-error.tsx`, or `app/not-found.tsx`. Only the root layout exports `metadata`. Fifteen of the sixteen `page.tsx` files are `"use client"`, so they cannot export metadata or fetch data on the server. A render error shows Next's default page; a bad URL shows the default 404; every page shares the same title and description in search and social previews.
- **Fix:** Add the three route files. Split the detail pages into a server page that exports `generateMetadata` and a client child. Add static metadata to home, explore, and search. Do this gradually, starting with details and landing.
- **If we skip it:** Crashes and 404s look unbranded, and shared links have no title or image.

### 18. Profile stats only count the first page of history, and movies are counted differently from series

- **What this is:** `src/hooks/profile/useProfileData.ts`.
- **Problem:** It fetches only `/api/profile/history?page=0` (line 111) and computes the stat cards from that page. The endpoint is paginated. The movie count also counts duplicate history rows, while the series count dedupes by `tmdbId` (lines 22-28), so the two numbers use different rules.
- **Fix:** Add a backend stats endpoint or fetch all pages before computing. Dedupe movies by `tmdbId` the same way as series.
- **If we skip it:** Profile stats undercount and disagree with the watch history list.

### 19. The fallback images referenced everywhere do not exist

- **What this is:** The placeholder assets.
- **Problem:** `public/placeholder-image.jpg` and `public/images/placeholder-poster.png` are used as fallbacks in at least six files (`MediaCard.tsx:66`, `MoviesTvMediaGrid.tsx:22`, `RecommendationCard.tsx:129`, `useProfileData.ts:18`, `Banner.tsx:48`, `EpisodeBrowser.tsx:25`) but neither file exists. Any media with a missing poster or backdrop renders a broken image icon.
- **Fix:** Add the two files (small WebP/JPEG) or replace the string fallbacks with a shared `<PosterFallback>` component that renders a CSS gradient and the title. Add `onError` to remote images.
- **If we skip it:** Broken images are visible on Home, Search, Explore, Watchlist, Profile, and episode lists.

### 20. The smooth-scroll animation loop is never cancelled

- **What this is:** `src/components/ui/SmoothScroll.tsx`.
- **Problem:** The recursive `requestAnimationFrame` loop (lines 28-33) is never cancelled. Cleanup destroys Lenis but the loop keeps running and calls `lenis.raf` on a destroyed instance every frame. On mobile this drains battery; in dev Strict Mode it stacks loops.
- **Fix:** Save the id from `requestAnimationFrame` and call `cancelAnimationFrame` in cleanup, or pass `autoRaf: true` to Lenis and let it manage the loop.
- **If we skip it:** The landing page leaves a permanent animation loop running after navigation.

---

## Smaller items (not ranked)

These are real but lower-impact than the twenty above. Each has a one-line fix.

| Where | Issue | Fix |
|---|---|---|
| `src/lib/contexts/NotificationContext.tsx:56` | IDs use `Date.now()`, so two notifications in the same millisecond share an id and one timeout cancels the other. | Use `crypto.randomUUID()`. |
| `src/hooks/useExploreData.ts:74` | `hasMore` is true whenever the page is non-empty; if the backend repeats a page, dedup adds nothing and infinite scroll loops forever. | Stop when no new items were added. |
| `src/hooks/useSearchData.ts:6,136` | `RESULTS_PER_PAGE = 15` is a guess; if the backend page size differs, "load more" stops early or never. | Return `hasMore` from the backend or use the actual page size. |
| `src/hooks/useSearchData.ts:175` | Restoring from a URL fetches every page up to the current one sequentially. | Fetch only the current page, or use `Promise.all`. |
| `app/party/tv/page.tsx:55,68` | `currentTimeRef.current` is used in a callback before it is destructured from the hook at line 68. Works today, but a reorder breaks it. | Move the destructure above the callback. |
| `app/party/movie/page.tsx:18-22` | The movie party uses a hardcoded provider list instead of the player hook's server list, so backend provider changes are ignored. | Use the same `servers`/`filteredServers` pattern as the TV party. |
| `src/hooks/home/useHomeData.ts:35,61,124` | `bannerData` is defined and set to `{ items: [] }` but never read. | Delete it. |
| `src/lib/auth/supabase.ts:13-22` | Missing Supabase env vars are replaced with a placeholder URL/key; the app builds and then auth fails at runtime. | Fail fast at startup or show a clear config error. |
| `app/api/test/health/route.ts` | Unauthenticated health proxy. | Remove it from production or protect it. |
| `next.config.ts` (no `headers()`) | No CSP, HSTS, `X-Content-Type-Options`, or `Referrer-Policy`; Caddy adds none either. No rate limiting on the BFF routes. | Add security headers and rate limiting at the edge. |
| `src` and `app` | 34 `console.log`/`debug`/`info` calls, mostly in `useWatchParty`, are noisy in production. | Remove them or gate them behind `NODE_ENV !== "production"`. |
| `next.config.ts:5,25,32-37` | `reactStrictMode: false` hides double-effect bugs; `dangerouslyAllowSVG: true`; hardcoded private IPs and a temporary pinggy tunnel in `allowedDevOrigins`. | Enable strict mode, allow SVG only from a trusted source, and move dev origins to env/config. |
| `docker-compose.yml:6,13` | Runs the `dev` target with bind mounts and `NODE_ENV=development`; this is not a production compose file. | Add a prod compose using `target: runner` (the Dockerfile already has it). |
| `README.md` | Documents `src/dto`, `/api/stream-urls`, `/api/movie/[id]`, AES-256-GCM, `TMDB_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ENCRYPTION_KEY`, and server-side `getUser()` that do not exist. | Rewrite it to match the actual BFF and env vars. |
| `app/onboarding/page.tsx:15` | Says "AES-256-GCM encrypted"; no encryption code exists in this repo. | Remove the claim or confirm the backend does it. |
| `next-env.d.ts:3` | Imports `./.next/dev/types/routes.d.ts`; a fresh clone without `.next` can fail `tsc`. | Run `next typegen` before `tsc`, or let Next regenerate the file. |
| `src/lib/utils/color.ts` | `extractColors` silently returns `[]` for CORS-tainted images, so the gradient fallback is invisible. | Log once in dev or extract colors server-side. |
| `src/hooks/details/useMovieDetails.ts` / `useTVShowDetails.ts`, `useMoviePlayer.ts` / `useTVShowPlayer.ts` | Near-copies; a fix in one often misses the other, as the watchlist bug shows. | Merge into one hook parameterized by media type, or share the watchlist logic. |
| `src/hooks/party/useWatchParty.ts` (696 lines) | Mixes SSE, chat, heartbeat, progress, and host migration; hard to test. | Split by job (SSE, chat, timers) without changing the public hook. |

---

## Verdict

**Not healthy.** Fix the auth gate, party sync, watchlist state, and request races first; then repair lint/tests and delete the dead code.

**Lean:** about -550 lines and -14 dependencies possible.

**Not checked:** the Spring backend, Supabase schema/RLS/triggers, and the third-party player providers (Ironlink, Syntherion, Dormannu, Nanovue). I did not run a browser or E2E tests, so the findings come from code reading plus `tsc`, `next build`, and `npm audit`. I did not measure the landing page on a real device; the 26 MB is disk size. I did not audit the deployment (Caddy/TLS/DNS) beyond the config files, or transitive code inside `node_modules` beyond `npm audit`.
