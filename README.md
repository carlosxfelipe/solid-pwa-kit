# Solid PWA Kit

> **⚠️ THIS PROJECT IS CURRENTLY UNDER DEVELOPMENT.**

Web preview: [https://solid-pwa-kit.netlify.app/users](https://solid-pwa-kit.netlify.app/users)

A standalone **Progressive Web App (PWA)** web starter template built with **Solid 2.0**, **`@solidjs/router` v2**, **Material 3 color presets**, and **`vite-plugin-pwa`** (Workbox).

Created with the official Solid 2.0 CLI:

```bash
npx create-solid@latest --solid -p solid-pwa-kit -t basic --ts --no-ssr --no-devtools
```

## Features

- **Solid 2.0 (`solid-js` 2.0.x):** Uses Solid 2.0 primitives (`createSignal`, `createMemo`, split 2-arg `createEffect(compute, apply)`, `onSettled`, `<Loading>`, `<Errored>`, `<Ctx value={...}>`, and `flush()`).
- **File-System Routing (`@solidjs/router` v2 + `filesystem-routing`):** Typed `paths` helper, `intentPreload()`, and route-level `query()` data loading (`src/routes/users/[id].tsx`).
- **PWA Ready (`vite-plugin-pwa` + `workbox-window`):**
  - Web App Manifest (`manifest.webmanifest`) with `any` and `maskable` icons (`192x192`, `512x512`) and app shortcuts.
  - Workbox Service Worker (`sw.js`) precaching static assets with `navigateFallback: '/index.html'`.
  - Reactive PWA context (`src/pwa/pwa-context.tsx`) tracking online/offline status, `beforeinstallprompt` install flow, and SW update/offline-ready toast (`PwaUpdateToast`).
- **Material 3 Theme Presets (`src/theme/`):**
  - `custom_blue` (default) and `deep_purple` presets, supporting **Light**, **Dark**, and **System** modes persisted in `localStorage`.
- **Responsive Shell (`src/App.tsx`):**
  - Persistent bottom navigation bar on mobile (with `env(safe-area-inset-bottom)`) and navigation rail on desktop (`>= 840px`).
- **Core UI Kit (`src/components/core/`):**
  - `AppButton`, `AppHeader`, `AppBannerCard`, `AppListCard`, `AppTextField`, `AppSwitch`, `AppSegmentedSwitcher`, `AppAvatar`, `AppBottomSheet`, `AppEmptyState`, `AppSearchHeader`, `AppIcon`, `SnackbarProvider`, `ThemeSwitcher`, `ThemePresetSwitcher`.

## Scripts

```bash
npm run dev       # Start Vite dev server (http://localhost:3000)
npm run web       # Alias for npm run dev
npm run build     # Build static PWA + service worker into dist/client
npm run serve     # Preview production PWA build locally
npm run test      # Run Vitest + @solidjs/diagnostics suite
npm run lint      # Lint with oxlint (eslint-plugin-solid v2 rules)
npm run typecheck # Run tsc --noEmit
```

### Using as a Template

Run `./rename.sh` to rename the package, PWA manifest, document metadata, `localStorage` keys, route titles, and README heading:

```bash
./rename.sh my-app
# or specify display name and PWA short name explicitly:
./rename.sh habit-tracker "Habit Tracker" "Habits"
```

## Authentication Toggle

By default, `REQUIRE_AUTH` in `src/auth/auth-context.tsx` is `false` so all tabs (`Home`, `Explore`, `Users`, `Profile`) open immediately. Set `REQUIRE_AUTH = true` to guard the shell behind `/login`.

## Deploy on Netlify

`netlify.toml` is already configured for static PWA hosting:

- **Build command:** `npm run build`
- **Publish directory:** `dist/client` (where `@solidjs/vite-plugin` emits the static bundle, `index.html`, `manifest.webmanifest`, and `sw.js`)
- **Node version:** `22` (satisfies `solid-js` 2.0 `>=22.12.0` and `vite` 8)
- **SPA fallback:** `/* -> /index.html` (`200`) for client-side routes (`/explore`, `/profile`, `/users/:id`, `/login`)
- **PWA headers:** `no-cache` on `/sw.js` and `/registerSW.js`, `application/manifest+json` on `/manifest.webmanifest`, and immutable caching on `/assets/*`
