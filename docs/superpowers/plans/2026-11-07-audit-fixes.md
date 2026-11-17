# Audit Fixes Implementation Plan

> **For agentic workers:** Execute tasks in order, one commit per task. Verify with `rtk tsc --noEmit` and `rtk next build` before the final commit.

**Goal:** Fix the AUDIT.md findings that affect correctness, efficiency, and cleanup without breaking existing behavior.

**Architecture:** Keep the current App Router/BFF/hook structure. Merge only duplicated routes and delete dead code. No new dependencies except the corrected `eslint-config-next` version.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Supabase SSR, Tailwind v4.

**Spec:** `AUDIT.md`

## Global Constraints

- No new code comments.
- Preserve public URLs.
- Do not commit user-owned files: `.claude/claude.md`, `next-env.d.ts`, `AGENTS.md`, `AUDIT.md`, `UI-CSS-SSR.md`.
- Every task is one commit.

---

### Task 1: SSE proxy closes upstream on abort
- Modify: `app/api/watchalong/party/events/route.ts`
- Pass `signal: request.signal` to the upstream fetch.

### Task 2: Party backdrop URLs
- Modify: `app/party/movie/page.tsx`, `app/party/tv/page.tsx`, `src/components/party/PartyHostControls.tsx`
- Use already-normalized `backdrop_path` directly.

### Task 3: Watch progress origin validation
- Modify: `src/hooks/player/useWatchProgress.ts`, `app/party/movie/page.tsx`, `app/party/tv/page.tsx`, `src/hooks/player/useMoviePlayer.ts`, `src/hooks/player/useTVShowPlayer.ts` and player pages that call the hook.
- Add `playerIframeRef`, exact origin allowlist, `event.source` check.

### Task 4: Watchlist state
- Modify: `src/hooks/details/useTVShowDetails.ts`, `src/hooks/profile/useWatchlist.ts`
- Set `isWatchlisted(false)` + notification on delete; filter by `tmdbId` and `mediaType` with functional setState.

### Task 5: Banner actions
- Modify: `src/components/media/Banner.tsx`
- `/watch/tvshow` route, real watchlist toggle with status check, match Continue Watching by `tmdbId` + `mediaType`.

### Task 6: Home tab race
- Modify: `src/hooks/home/useHomeData.ts`
- Return early after await when aborted; only clear switching state when not aborted. Delete `bannerData`.

### Task 7: Search race
- Modify: `src/hooks/useSearchData.ts`
- Abort previous request via ref; ignore `AbortError`.

### Task 8: Party failures and sync
- Modify: `src/hooks/party/useWatchParty.ts`, `app/party/tv/page.tsx`
- Notify + leave loading state on create/join failure; 5s progress push; participant drift sync with cooldown; fix TV destructure order.

### Task 9: Auth cookies and gate
- Create: `proxy.ts`
- Modify: `src/components/layout/AuthGate.tsx`
- Refresh Supabase session via cookies and redirect unauthenticated protected paths server-side; missing profile means not onboarded; enforce onboarding on protected routes.

### Task 10: Merge home API routes
- Create: `app/api/home/[section]/[type]/route.ts`
- Delete: nine section route files.
- Modify: `app/api/profile/recommendations/route.ts` to use `routeUtils`.

### Task 11: Dead code and dependencies
- Delete unused components/hook, `tailwind.config.js`, unused packages.
- Keep `package-lock.json` npm-managed.

### Task 12: Fallback assets
- Add `public/placeholder-image.jpg`, `public/images/placeholder-poster.png`.

### Task 13: SmoothScroll loop
- Modify: `src/components/ui/SmoothScroll.tsx` to cancel the RAF loop.

### Task 14: Route error/404 pages
- Create: `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`.

### Task 15: Lint dependency
- Fix `eslint-config-next` to match Next 16; run lint.

### Task 16: Small correctness/cleanup batch
- Notification UUID, explore `hasMore`, health route removal, security headers, console logs, onboarding AES claim, footer links, profile movie dedupe, Supabase config fail-fast, party movie providers.
- Modify the owning files only.

### Task 17: Font imports
- Remove unused/duplicate Google Fonts imports in `app/globals.css`.

### Task 18: Verification
- `rtk tsc --noEmit`, `rtk next build`, `rtk lint`, manual route check.
