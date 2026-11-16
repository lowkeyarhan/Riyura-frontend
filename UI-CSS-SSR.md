# Addendum: CSS duplication, UI cost, and current SSR

### A. CSS duplication and where it costs

1. **Three glass recipes plus two copies of the same shadow.** `.apple-glass` (`app/globals.css:82-90`), `.glass-card-pro` (`114-122`), and `.apple-glass-navbar-pill` (`386-402`) all repeat the same translucent white background, 28-40px backdrop blur, 1px border, inset highlight, and drop shadow. `.btn-primary` (`256-273`) and `.ai-footer` (`143-156`) repeat the same inset highlight and shadow again. `.glass-card-pro`, `.glass-reflection`, `.engraved-badge`, and `.engraved-text-metallic` have **zero** references in TSX, so they are dead CSS. **Fix:** one `.glass` class with CSS variables for background, border, and blur; delete the four unused classes. This removes roughly 100 lines and stops the recipes drifting apart.

2. **`backdrop-filter: blur(40px)` is used on almost everything.** There are 58 `apple-glass` elements in TSX, 21 `backdrop-blur-*` utility uses, and 10 inline `backdropFilter: "blur(40px)"` blocks. The worst is `MediaCard.tsx:104-110`: every poster card on Home, Explore, Search, and Watchlist gets its own 40px backdrop blur. Home can mount 30-40 cards at once, so the GPU is asked to blur the backdrop 30-40 times per frame while scrolling. This is the largest UI cost in the app, not the landing page. **Fix:** remove `backdropFilter` from `MediaCard`, `RecommendationCard`, the player sidebars, and `PartyHostControls`; use a solid translucent background (`bg-black/30` or `bg-white/[0.04]`) plus a border. Keep real glass for the navbar, the modal, and a few hero panels. Add `@media (max-width: 768px) { .apple-glass { backdrop-filter: none; } }` as a cheap mobile win.

3. **Inline styles duplicate Tailwind classes.** The `ServerRow` component in `MoviePlayerSidebar.tsx` and `TVShowPlayerSidebar.tsx` sets `border`, `boxShadow`, `backdropFilter`, and `backgroundColor` inline while the `className` already sets `border`, `shadow-inner`, and conditional `bg`/`border` classes. The inline style wins, so the class logic is dead. `PartyHostControls.tsx` repeats the same glass style block six times (lines 78-79, 113-114, 164-165, 199-200, 225-226, 266-267). `app/party/movie/page.tsx:144-151` repeats `border`, `boxShadow`, and `aspectRatio` that the class already sets. There are 130 `style={{` blocks in total; the layout/glass ones are the ones to delete. **Fix:** keep one source of truth per property. Prefer the CSS class for glass, and keep inline style only for values that are truly dynamic (gradient colors from `extractColors`).

4. **Font families are repeated instead of using the two existing classes.** `.font-heading` and `.font-paragraph` exist (`globals.css:124-130`), but `.badge:221`, `.btn-primary:265`, `.lang-selector:313`, `.copyright:347`, `.footer-cta h2:248`, and `.brand-logo:302` each repeat `font-family: "Inter Tight"` or `"DM Sans"`. Components repeat `style={{ fontFamily: "Be Vietnam Pro, sans-serif" }}` (`app/home/page.tsx:56`, `MoviesTvMediaGrid.tsx:35,42,77`) and the landing page repeats the `SF` stack and `Pinyon Script` inline. **Fix:** define `--font-heading` and `--font-body` in `@theme`, use the two classes, and delete the repeated declarations. That also makes the font imports easier to trim.

5. **`SkeletonTheme` is repeated 11 times.** The same `baseColor="#1a1d26"` and `highlightColor="#2a2d36"` appear in 11 files, and `HomeSkeleton` nests two themes. **Fix:** one `SkeletonTheme` at the root (or a tiny `SkeletonProvider`) and remove the local wrappers. Minor, but it removes duplicated props and context providers.

6. **Dead theme tokens and dead CSS.** `--color-gray-icon`, `--color-yellow`, `--color-purple-500`, `--color-pink-600`, `--spacing-18`, `--color-dark-light`, `--color-dark-hover`, `--color-gray-secondary`, and `--background` are defined but never used outside their definition. Delete them. `tailwind.config.js` is also ignored by Tailwind v4 because `globals.css` has no `@config`; delete the file or wire it up. The unused classes in item 1 go too.

7. **`zoom-content` implements the same responsive rule twice.** The CSS media query (`globals.css:378-383`) and the JS resize handler (`app/landing/page.tsx:56-69,80-83`) both scale the landing page to an 800px canvas with the non-standard `zoom` property. This forces a fixed layout, makes text blurry, and triggers a React re-render on every resize. **Fix:** delete the JS state and the `.zoom-content` rule; use normal Tailwind breakpoints and fluid widths.

### B. UI and resource optimizations, biggest win first

1. **Remove backdrop blur from cards and lists.** See A2. This is the cheapest change with the largest GPU/compositor effect. Solid translucent backgrounds look almost the same at these opacity levels.

2. **Replace full-screen `filter: blur(...)` blobs with radial gradients.** These create large offscreen buffers: `app/home/page.tsx:39-40` (`blur-[140px]`/`blur-[160px]`), `app/auth/page.tsx:150-151`, `ServersDownModal.tsx:38-39` (`blur-[120px]`/`blur-[130px]`), `app/party/movie/page.tsx:128`, `app/party/tv/page.tsx:186`, `app/profile/page.tsx:156`, `app/watch/movie/[id]/page.tsx:131`, `app/watch/tvshow/[id]/page.tsx:149` (all `blur(80px)`), `Footer.tsx:20` (`blur-[80px]`), and `.footer-glow` (`globals.css:172`, `blur(200px)`). A `radial-gradient` with soft alpha stops gives the same glow without the blur pass. On mobile, reduce or remove them.

3. **Fix the landing page images.** `public/landing-page` is 26 MB, and `ParallaxImg` (`app/landing/page.tsx:35-45`) is a raw `<motion.img>` used about 20 times with no `loading="lazy"`, no `width`/`height`, and no responsive sizes. Decoded bitmaps are the biggest browser RAM cost: a large image can hold several MB per decoded copy, and 20 of them can reach tens to hundreds of MB. **Fix:** convert to WebP/AVIF, use `next/image` with `sizes`, lazy-load everything below the fold, and keep parallax on a handful of key images instead of all 20. This cuts network, decode memory, and scroll work at once.

4. **Do not load the three.js hero on mobile or low-end devices.** The largest client chunk is 516 KB and contains the `WebGLRenderer` used by `LiquidEther` (`app/landing/page.tsx:26-29`). It pauses when offscreen (good), but it still downloads and initializes WebGL, textures, and buffers. **Fix:** replace the hero with a CSS gradient/video, or gate the dynamic import behind `window.matchMedia("(min-width: 1024px)")`, `prefers-reduced-motion`, and a hardware check. Load it after idle, not during first paint.

5. **Consolidate animation libraries.** The app ships Framer Motion (85 `motion.` usages in 14 files) and GSAP (`SplitText.tsx`, `MagicBento.tsx`). GSAP is only used on the landing page. **Fix:** replace `SplitText` and the spotlight tween with CSS or Framer Motion, then remove `gsap`, `@gsap/react`, and the SplitText plugin. One animation runtime is smaller and easier to reason about.

6. **Use one spotlight, not three.** `GlobalSpotlight` (`MagicBento.tsx:381-478`) adds a `document.mousemove` listener that, on every mouse move, calls `getBoundingClientRect()` for every `.card` in its grid and runs GSAP tweens. The landing page mounts three of them (`app/landing/page.tsx:374,573,776`), so there are three global handlers doing layout reads on every move. **Fix:** one page-level spotlight, throttled with `requestAnimationFrame`, disabled on touch and `prefers-reduced-motion`. The default `MagicBento` export and its `cardData` (lines 42-79, 508-629) are unused; only `GlobalSpotlight` is imported, so delete the dead component.

7. **Create one auth context.** `useAuth` is called in 15 components/hooks. Each call creates its own `supabase.auth.getSession()` request and its own `onAuthStateChange` subscription (`src/hooks/useAuth.ts:7-28`). On a protected page with both navbars, `AuthGate`, `BackendHealthProvider`, and a page hook, that is 5-6 subscriptions and 5-6 copies of `user`/`loading`. **Fix:** one `AuthProvider` at the root; `useAuth` reads context. This also fixes the inconsistent loading states and makes the navbar duplication cheaper. `AuthGate.tsx:96-103` mounts both `Navbar` and `MobileNavbar` and hides one with CSS; render one responsive component instead.

8. **Cancel the SmoothScroll frame loop.** Already finding 20. After leaving `/landing`, the recursive `requestAnimationFrame` keeps calling `lenis.raf` on a destroyed instance. One line in cleanup.

9. **Stop keeping two full-screen banner images alive.** `Banner.tsx:492-513` uses `AnimatePresence mode="sync"` for the background, so the exiting and entering full-screen images stay mounted during the crossfade. It also puts `will-change-transform` on a 136vw-wide layer, which promotes a compositor layer larger than the viewport. **Fix:** use one background layer with an opacity crossfade, remove `will-change`, and preload only the next slide.

10. **Use one `SkeletonTheme`.** See A5. Small, but it removes 11 duplicated providers.

11. **Avoid the duplicate navbar mount.** See B7. Both navbars hydrate on every protected page, and both call `useAuth`. One responsive navbar saves DOM, effects, and one auth subscription.

12. **Move first-paint data to the server.** See the SSR section. This is the biggest structural win: it removes the client fetch waterfall, the skeleton flash, and the duplicate data held in client state. It is also the largest change, so do it after the cheap GPU/RAM fixes.

### C. Current SSR status

The build output (Next 16.4.5, Turbopack) classifies the routes like this:

- **Static (○), prerendered as HTML at build:** `/`, `/auth`, `/auth/callback`, `/explore`, `/home`, `/landing`, `/onboarding`, `/party/movie`, `/party/tv`, `/profile`, `/search`, `/watchlist`.
- **Dynamic (ƒ), server-rendered on demand:** `/details/movie/[id]`, `/details/tvshow/[id]`, `/watch/movie/[id]`, `/watch/tvshow/[id]`.
- **All API routes are dynamic:** every handler under `app/api/**` exports `dynamic = "force-dynamic"`.

What that means in practice:

- `app/page.tsx` is the only real server component with logic; it redirects to `/landing`. `app/layout.tsx` is a server component, but it only renders global metadata and client providers.
- Every other page is `"use client"`. The static routes are prerendered shells (skeletons/empty containers) and then hydrated. The dynamic routes are rendered on demand, but they also render only the client shell; no page fetches data on the server.
- All data comes from client hooks after hydration. There are 40 `fetch` calls under `src/hooks`, so the first paint is a skeleton and the real data arrives in a second round trip. There is no `generateMetadata`, `generateStaticParams`, `revalidate`, server action, or server-side auth check anywhere in `app/`.
- There is no `proxy.ts`/`middleware.ts`, so auth redirects happen after hydration too.

So the honest label is **CSR with prerendered shells**, not true SSR. The server serves the HTML shell and proxies API calls; it does not render user data, metadata, or auth decisions. The static shell is good for TTFB, but the client still downloads the full JS bundle, hydrates, and then fetches. The landing page is the extreme case: static HTML, then 2.1 MB of JS chunks, 26 MB of images, three.js, GSAP, and Framer Motion.

What true SSR would buy: data in the first HTML (no skeleton waterfall), per-page title/OG tags, less client JS if the fetching moves to the server, and server-side auth redirects. What it costs: a server wrapper + client view for each page, more server work, and careful caching. Start with the detail pages (already dynamic) and then `/home` and `/explore`.

### D. Recommended order

1. Remove backdrop blur from cards/lists; replace the big blur blobs with radial gradients. Low risk, large GPU win.
2. One auth provider and one responsive navbar. Medium risk, large subscription/DOM win.
3. Landing: convert images, drop three.js on mobile, remove the GSAP/spotlight duplication, fix SmoothScroll. Medium risk, largest network/RAM win.
4. Add server data for details and home. Large change, largest UX/SEO win.
5. CSS cleanup: one glass class, delete unused classes/tokens, one `SkeletonTheme`, font tokens. Low risk, maintainability win.
