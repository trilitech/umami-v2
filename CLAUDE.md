# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Umami is a Tezos wallet by Trilitech. pnpm + Turborepo monorepo: shared `@umami/*` libraries in `packages/`, deployable apps in `apps/` (Electron desktop, web SPA, Expo mobile, embeddable iframe, static OAuth redirect page). Node `>=20 <21`, pnpm `>=9.7`.

A detailed codebase index lives in [codebase-index/](codebase-index/README.md) (packages, apps, architecture, dev workflow). Note: `docs/` is gitignored in this repo — don't put committed documentation there.

## Commands

```bash
pnpm install                 # setup (turbo should be installed globally)
pnpm build                   # build everything (turbo)
pnpm dev:desktop | dev:web | dev:mobile
pnpm test                    # all tests (excludes mobile & web)
turbo test --filter=@umami/core            # one package (builds deps first)
cd packages/core && pnpm test --testPathPattern=Account.test.ts   # single file
cd packages/core && pnpm test:watch        # watch mode (DEV=true, no coverage)
pnpm ci                      # check-types + lint:ci + format:ci + check-circular-deps
pnpm lint && pnpm format     # auto-fix lint & prettier
pnpm check-types
pnpm test:e2e                # cucumber+playwright vs docker tzkt sandbox (needs Docker)
pnpm --filter @umami/web storybook   # NOTE: root "pnpm storybook" script is broken (targets non-existent @umami/storybook)
```

- Inside a package, prefer `turbo test` over `pnpm test` so dependencies get built first.
- Jest: jsdom, 70% coverage thresholds (disabled when `DEV=true`), bail on first failure. Preset shared from `packages/jest-config`.
- ESLint/Prettier: double quotes, inline type imports (`import { type X }`), enforced import group ordering, `eqeqeq`, unused vars need `_` prefix. Shared configs in `packages/eslint-config`, `packages/typescript-config`.

## Architecture

Package layering (each layer only depends on layers above it):

1. **Tooling**: `eslint-config`, `jest-config`, `typescript-config`
2. **Foundation** (no @umami deps): `utils` (ErrorContext), `crypto` (PBKDF2 + AES at-rest encryption; separate `/react-native` entry), `social-auth` (Torus login → secp256k1 secret key)
3. **Blockchain**: `tezos` (addresses, networks, derivation paths, **`makeToolkit` signer factory** — InMemorySigner/LedgerSigner/FakeSigner), `tzkt` (rate-limited TzKT indexer client), `chains`
4. **Domain**: `core` (Account & Operation types, `estimate.ts`/`execute.ts`), `multisig` (contract logic, Michelson lambda decoding)
5. **State**: `state` (Redux Toolkit store)
6. **App layer**: `components` (shared Chakra UI), `data-polling` (React Query pollers feeding Redux)

Key cross-cutting flows:

- **Accounts** (`packages/core/src/Account.ts`): discriminated union on `type` — `mnemonic` | `ledger` | `secret_key` | `social` | `multisig`. All except multisig are "implicit" accounts.
- **Operation flow**: build `AccountOperations` → `estimate()` (toolkit with FakeSigner, taquito batch estimation, auto-reveal) → sign via `makeToolkit(signerConfig)` → `executeOperations()` broadcasts. Multisig operations are compiled to Michelson lambdas and wrapped in a `propose` contract call; signers approve/execute later.
- **State persistence** (`packages/state/src/reducer.ts`): redux-persist with two persist configs (root + accounts), encrypted via `redux-persist-transform-encrypt` with a password-derived key. **Changing any persisted slice shape requires a migration in `packages/state/src/migrations.ts` and a version bump** (currently v9, async migrations). `initializePersistence(store, password)` activates persistence after login.
- **Data freshness**: `packages/data-polling` polls TzKT at ~block time (12s) via React Query and dispatches into Redux; UI reads only from Redux hooks (`packages/state/src/hooks/`).
- **dApp connections**: Beacon (`beacon` slice + `apps/web/src/components/beacon/useHandleBeaconMessage.tsx`) and WalletConnect (`packages/state/src/walletConnect/WalletKit.ts`).
- **Desktop specifics**: hash-based router (required for packaged Electron), `umami://` deeplinks for social auth.

## Gotchas

- Empty leftover directories — ignore, don't document or import: `apps/server`, `apps/universal`, `packages/ui`, `packages/mobile-components`. `packages/passkey` is a stub.
- Mobile (`@umami/mobile`) and web are excluded from root `test`/`format`/`ci` turbo filters.
- Taquito is pinned to a beta (`23.0.0-beta.0`, Seoul protocol support) — keep versions consistent across packages.
- `.npmrc` uses hoisted node-linker for Expo compatibility; don't change it casually.
- E2E requires the docker sandbox (`docker-compose.yaml`: tezbox node + TzKT indexer); health is gated on Alice's initial 50000 tez balance.
