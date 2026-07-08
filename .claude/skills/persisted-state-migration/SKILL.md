---
name: persisted-state-migration
description: Safely change Redux state in @umami/state — adding/renaming fields in slices, writing redux-persist migrations, bumping the store version. Use whenever a change touches packages/state slices or persisted data shape.
---

# Changing persisted Redux state

`@umami/state` persists user data (accounts, keys, contacts, batches…) with redux-persist, encrypted via `redux-persist-transform-encrypt`. Users upgrade in place — **any shape change to persisted state without a migration corrupts real wallets.**

## Key files

- `packages/state/src/migrations.ts` — `VERSION` (single shared number), `mainStoreMigrations`, `accountsMigrations`
- `packages/state/src/reducer.ts` — two persist configs: root store and accounts store (separate encryption), both use `createAsyncMigrate` and the same `VERSION`
- `packages/state/src/slices/` — the slices themselves

## Decision: does my change need a migration?

- New/renamed/removed field in a **persisted** slice → YES
- Slice in the root persist blacklist (`assets`, `tokens`, `protocolSettings`, `accounts` — repopulated at runtime or persisted separately) → root migrations don't apply, but `accounts` changes need an `accountsMigrations` entry
- Pure logic/selector/hook change, no shape change → NO

## Procedure

1. Change the slice + its `initialState`.
2. Bump `VERSION` in `migrations.ts` (once — it's shared by both stores).
3. Add an entry keyed by the NEW version number to `mainStoreMigrations` and/or `accountsMigrations`. Whichever map you don't change still needs no entry — missing keys are skipped, but confirm which store owns your slice by reading `reducer.ts`.
4. Write the migration with immer (`produce(state, draft => …)`) like existing ones; use `identity` if a store needs no transformation for this version. Async migrations are supported (see migration `6` fetching contract networks).
5. Test: existing migration tests live in `packages/state/src/__tests__`/alongside `migrations.ts` — add a case feeding the old shape and asserting the new one. `@umami/test-utils` has versioned backup fixtures (`src/fixtures/backups/`) for realistic old states.
6. Backups: if the persisted shape appears in wallet backup files, check the backup import path (`test-utils` fixtures V1/V2/V2.1) still works.

## Gotchas

- Migration state is `any` and pre-encryption-decrypted; never import slice types into migrations (old shapes won't match current types).
- `accounts` slice holds encrypted `seedPhrases`/`secretKeys` — migrations there run on decrypted structure but be careful never to log it.
- `initializePersistence(store, password)` only activates persistence after login; dev flows without login won't exercise migrations — test explicitly.
