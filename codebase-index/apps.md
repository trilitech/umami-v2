# Apps Index

Deployable applications live under `apps/`.

> Note: `apps/server` and `apps/universal` are empty leftover directories (no `package.json`) — not real apps.

## @umami/desktop — `apps/desktop`

The original Electron desktop wallet (macOS/Windows/Linux). React 18 + Redux + Chakra UI, bundled with Vite.

- Dev: `pnpm dev:desktop` (root) or `pnpm dev` inside the app — Vite dev server at 127.0.0.1:5173; `pnpm electron:start` runs Electron with live reload
- Build/package: `pnpm build`; `pnpm electron:package:mac|win|linux` (electron-builder.yml: DMG/ZIP, APPX, DEB/RPM; macOS signing via APPLE_TEAM_ID)
- Test: `pnpm test` (Jest, TZ=CET)
- Structure:
  - `src/index.tsx` — root with Redux store, PersistGate, Router
  - `src/Router.tsx` — hash-based routing (required in packaged Electron): `/home`, `/nfts`, `/operations`, `/tokens`, `/address-book`, `/settings`, `/help`, `/batch`
  - `src/views/` — feature views wrapped by `withSideMenu.tsx`
  - `src/components/` — SendFlow, BuyTez, AccountSelector, ErrorPage…
  - `src/utils/` — persistor, store, beacon provider, `useDeeplinkHandler` (umami:// deeplinks)
- Uses nearly all @umami/* packages

## @umami/web — `apps/web`

The primary browser wallet (app.umamiwallet.com style SPA). Vite + React 18 + Chakra UI; includes Storybook.

- Dev: `pnpm dev:web` (root); Storybook: `pnpm --filter @umami/web storybook` (port 6006)
- Test: `pnpm test` (Jest, TZ=CET)
- Structure:
  - `src/main.tsx` — provider stack: UmamiTheme → Redux/PersistGate → ErrorBoundary → ReactQuery → BrowserRouter → DynamicDisclosureProvider
  - `src/components/App/App.tsx` — routes between Welcome / SessionLogin / authenticated Layout
  - `src/Layout.tsx` — header, navbar (mobile bottom tabs), sidebar, main, footer
  - `src/views/` — Welcome, SessionLogin, Activity, Earn, NFTs, Tokens
  - `src/components/beacon/useHandleBeaconMessage.tsx` — Beacon dApp request routing
  - `src/utils/` — store, beacon/, sentry/, hotjar/
  - `.storybook/` — Storybook config (react-vite, Chakra addon, Chromatic)
- Deployment: Vercel (`vercel.json` with SPA rewrite + strict CSP); Sentry + Hotjar integrations

## @umami/mobile — `apps/mobile`

React Native wallet (iOS/Android) on Expo 52 + Expo Router + Tamagui.

- Dev: `pnpm start:mobile` (root) or inside app: `pnpm ios` / `pnpm android` / `pnpm web` (TAMAGUI_TARGET=native)
- Test: `pnpm test` (jest-expo preset). Excluded from root `test`/`format`/`ci` turbo filters.
- Structure:
  - `app/_layout.tsx` — Expo Router root: SplashScreen, PersistGate, Redux, ReactQuery, Tamagui
  - `app/(auth)/` — authenticated tab routes; `app/(onboarding)/` — onboarding/login
  - `screens/`, `components/`, `providers/`, `services/auth/`, `store/`
  - `ios/`, `android/` — native projects
- Config: `app.json` (scheme "umami", EAS project), `.env` needs `EXPO_PUBLIC_WEB3_AUTH_CLIENT_ID`
- Uses `@umami/crypto/react-native` entry (react-native-quick-crypto)

## @umami/embed-iframe — `apps/embed-iframe`

Embeddable wallet iframe for third-party dApps: social login, operation confirmation, and payload signing in modals — no full wallet UI. Vite + React.

- Dev/build: `pnpm dev` / `pnpm build` / `pnpm preview` (inside app)
- Structure: `src/main.tsx` → `EmbeddedComponent.tsx` with three modal contexts (Login, Operation, SignPayload) and matching `*ModalContent.tsx`; `src/ClientsPermissions.ts` gates client origins
- Deployed to Vercel with strict CSP
- Uses only @umami/core, @umami/social-auth, @umami/tezos

## @umami/embed-iframe-mainnet — `apps/embed-iframe-mainnet`

Thin mainnet variant that re-exports `@umami/embed-iframe` with mainnet config; separate Vercel deployment.

## @umami/oauth — `apps/oauth`

Static OAuth redirect handler: a single `public/redirect.html` that completes social-login redirects and hands the result back via `window.postMessage` (web popup), `umami://auth/...` deeplink (desktop), or BroadcastChannel (mobile/cross-tab). No build/test scripts.

## @umami/desktop-e2e — `apps/desktop-e2e`

Cucumber (Gherkin) + Playwright end-to-end suite for the desktop app, run against the local docker TzKT sandbox.

- Run: `pnpm test:e2e` (starts `turbo preview --filter=@umami/desktop` on :3000 via start-server-and-test, then cucumber-js); `pnpm test:e2e:focus` runs only `@focus`-tagged scenarios
- Structure: `src/features/` (.feature files), `src/steps/` (step definitions), `src/pages/` (page objects), `src/helpers/`
- `cucumber.cjs` — parallel 3 local / 2 CI, retry 2 on CI, failFast, HTML+JSON reports in `test-results/`
