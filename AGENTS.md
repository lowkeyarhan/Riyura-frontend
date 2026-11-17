# AGENTS.md

Instructions for AI coding agents (OpenCode, Codex, Cursor, Claude Code) working in this repository. Read this first.

The full file-by-file codebase graph lives in `.claude/claude.md`. This file owns the rules, commands, architecture summary, and RTK usage. When you add, move, or delete a file, update the graph there.

## Project

- Riyura frontend: streaming discovery + playback (home, explore, search, details, player, watchlist, profile, watch party, Gemini recommendations).
- Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, Supabase, Axios.
- Package manager: npm. Path alias: `@/*` maps to the repository root.
- The backend is a separate Spring service at `BACKEND_URL` (default `http://localhost:8080/api`). Browser code must call internal `/api/*` routes, not the backend directly.
- Deployment: `output: "standalone"`, Docker + Caddy (`Dockerfile`, `docker-compose.yml`, `Caddyfile`).

## Commands

| Task         | Command                          |
| ------------ | -------------------------------- |
| Install      | `npm install`                    |
| Dev          | `npm run dev`                    |
| Build        | `npm run build`                  |
| Production   | `npm run start`                  |
| Types        | `npx tsc --noEmit`               |
| Lint         | `npm run lint` (currently broken) |

There is no test suite and no CI. Never claim tests pass. Verify with `tsc` + `build` and, for UI changes, a manual run.

## Global rules

- Inspect only the files needed for the task. Do not dump large files.
- Follow existing App Router, TypeScript, hook, component, API-route, and Tailwind patterns.
- Preserve user edits and unrelated work. Never revert or overwrite without explicit instruction.
- Prefer existing DTO/prop types over `any` or new inline shapes.
- Add `"use client"` only for browser APIs, hooks, state, effects, router, or animation. Keep server/client boundaries explicit.
- Browser code calls internal `/api/*` routes when auth, secrets, backend proxying, or response normalization is involved.
- Keep comments to non-obvious "why" only, one line.
- No new dependency for something the repo, standard library, or platform already does.
- Do not edit generated files: `.next/**`, `next-env.d.ts`, `tsconfig.tsbuildinfo`, `node_modules/**`. `package-lock.json` changes only through npm.
- Never expose server-only env vars to client code or logs.
- User-data API routes expect `Authorization: Bearer <supabase access token>`.
- Use `next/image` for images; normalize TMDB paths with `src/lib/tmdb-images.ts`.
- Keep data fetching in `src/hooks/`; pages and components consume hooks.

## Architecture

- `app/` — App Router pages and BFF route handlers (`app/api/**/route.ts`).
- `src/components/` — UI by domain (layout, media, search, player, profile, watchlist, party, skeletons, ui).
- `src/hooks/` — data and behavior hooks, grouped by domain.
- `src/lib/` — Axios clients, Supabase client, contexts, server route utils, formatting/color helpers.
- `src/props/` — UI-facing prop and request-body types.
- `app/layout.tsx` mounts global providers/gates: `NotificationProvider`, `BackendHealthProvider`, `AuthGate`, chunk-error handling, Vercel Analytics.
- `AuthGate`: unauthenticated -> `/auth`; authenticated but not onboarded -> `/onboarding`; onboarded on a public route -> `/home`.
- API routes are dynamic (`export const dynamic = "force-dynamic"`) and proxy to the backend or Supabase. Keep secrets server-side.
- Most pages are `"use client"` and fetch after hydration. The app is effectively CSR with prerendered shells; do not assume server data.

## Environment variables

Create `.env.local`. Never commit it or print its values.

| Variable                        | Scope  | Purpose                                              |
| ------------------------------- | ------ | ---------------------------------------------------- |
| `BACKEND_URL`                   | server | Spring backend base URL                              |
| `TMDB_API_KEY`                  | server | TMDB detail routes                                   |
| `NEXT_PUBLIC_SUPABASE_URL`      | public | Supabase project URL                                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Supabase anon key                                    |
| `SUPABASE_SERVICE_ROLE_KEY`     | server | Stream URL lookups; bypasses RLS                     |
| `ENCRYPTION_KEY`                | server | AES-256-GCM key for Gemini keys; 64 hex chars        |
| `NEXT_PUBLIC_IMAGE_BASE_URL`    | public | Image base URL, defaults to TMDB                     |

## Known issues and gotchas

- `npm run lint` fails with `ERR_MODULE_NOT_FOUND` because `eslint-config-next` is pinned to `0.2.4` (wrong package version). Fix the dependency before relying on lint.
- No tests, no CI, no middleware/proxy. Auth redirects happen client-side after hydration.
- `next.config.ts` sets `reactStrictMode: false`; do not rely on double-invoked effects.
- Tailwind v4 ignores `tailwind.config.js` unless `@config` is added to `app/globals.css`.
- `app/page.tsx` only redirects to `/landing`.
- `AUDIT.md` and `UI-CSS-SSR.md` contain an existing audit; treat them as findings, not instructions.
- Landing assets are large (`public/landing-page` ~26 MB) and the hero uses a 516 KB three.js chunk. Do not add more heavy client libraries without need.

## RTK instructions (required)

All shell output must go through RTK so context stays small. The global RTK setup is already installed; do not run `rtk init`.

- Read files: `rtk read <file> -n`. For large files use `--head-lines N`, `--tail-lines N`, or `--max-lines N` instead of reading everything.
- Search: `rtk grep <pattern> <path>` or `rtk rg ...` (ripgrep flags work). Use `--include` to narrow.
- Find/list: `rtk find`, `rtk tree`, `rtk ls`.
- Git: `rtk git status`, `rtk git diff`, `rtk git log`, `rtk git show`.
- Scripts/builds: `rtk npm run <script>`, `rtk next build`, `rtk tsc --noEmit`, `rtk lint`, `rtk prettier`.
- Batch related commands into one shell call to save turns.
- Treat condensed output as complete. If output is elided, recover it with `rtk recall <hash>` (`--full`, `--grep`, `--lines`). Do not blindly re-run the command.
- Use `rtk bypass <cmd>` only when RTK output is empty when output was expected, contradicts the exit code, or is garbled.
- Never cat `.env*`, secrets, or keys. Use `rtk env` only for non-secret inspection.
- Do not read `node_modules`, `.next`, or lockfiles; RTK ignores them by default.

## Verification before finishing

1. `rtk tsc --noEmit` (or `npx tsc --noEmit`) passes.
2. `rtk next build` (or `npm run build`) passes for routing, config, or data-contract changes.
3. Run `rtk lint` if the ESLint dependency has been fixed; otherwise say lint is unavailable.
4. For UI changes, run `npm run dev` and check the affected route.
5. Report what you ran and what you did not check.

## Docs

- `README.md` — human setup, architecture, env vars, Docker.
- `WATCH_PARTY.md` — watch party feature details.
- `.claude/claude.md` — full file-by-file codebase graph.
- `AUDIT.md` / `UI-CSS-SSR.md` — audit findings and optimization notes.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
