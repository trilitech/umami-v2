# Umami v2 Codebase Index

Umami is a Tezos wallet by Trilitech, shipped as desktop (Electron), web (SPA), and mobile (Expo) apps built from shared `@umami/*` packages in a pnpm + Turborepo monorepo.

| Document | Contents |
|---|---|
| [dev-workflow.md](./dev-workflow.md) | Commands (build/test/lint/e2e), turbo/jest/eslint setup, CI, docker sandbox |
| [packages.md](./packages.md) | Every `packages/*` library: purpose, key modules, dependencies, layering |
| [apps.md](./apps.md) | Every `apps/*` application: platform, run/build/test, structure |
| [architecture.md](./architecture.md) | Cross-cutting: account model, redux state & encrypted persistence, operation signing flow, polling, multisig, social auth, Beacon/WalletConnect |

## Repo map

```
apps/
  desktop/               Electron wallet (React + Vite)
  desktop-e2e/           Cucumber + Playwright e2e suite for desktop
  web/                   Browser wallet SPA (+ Storybook)
  mobile/                Expo / React Native wallet (Tamagui)
  embed-iframe/          Embeddable wallet iframe for dApps
  embed-iframe-mainnet/  Mainnet deployment wrapper of embed-iframe
  oauth/                 Static OAuth redirect page (social login handoff)
  server/, universal/    EMPTY leftovers — ignore
packages/
  core/                  Domain logic: accounts, operations, estimate/execute
  state/                 Redux store, slices, thunks, encrypted persistence
  tezos/                 Tezos primitives: addresses, networks, signer factory
  tzkt/                  TzKT indexer API client (rate-limited)
  chains/                Chain indexer wrappers
  multisig/              Multisig contract logic
  crypto/                AES + PBKDF2 encryption (web & react-native)
  social-auth/           Torus social login (Google, FB, X, Reddit, Email)
  data-polling/          React Query pollers feeding Redux
  components/            Shared Chakra UI components/hooks
  utils/                 Generic utils & error context
  test-utils/            Test fixtures and helpers
  passkey/               Stub (future WebAuthn)
  eslint-config/, jest-config/, typescript-config/   Shared tooling configs
  ui/, mobile-components/  EMPTY leftovers — ignore
```
