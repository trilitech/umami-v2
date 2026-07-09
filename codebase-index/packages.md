# Packages Index

All shared libraries live under `packages/` and are published-style workspace packages named `@umami/*`. They build with tsup (dual CJS/ESM output to `dist/`) unless noted. Layering (low → high): config → utils/crypto → tezos/tzkt → core/multisig → state → components/data-polling.

> Note: `packages/ui` and `packages/mobile-components` are empty leftover directories (no `package.json`, only stale build artifacts) — not real workspace packages.

## @umami/utils — `packages/utils`

General utility functions and error handling. No @umami dependencies.

- `src/ErrorContext.ts` — custom error type carrying context for error reporting
- `src/TezosRpcErrors.ts` — parsing/classification of Tezos RPC errors
- `src/providers/` — provider utilities
- External: bignumber.js, lodash, sanitize-html

## @umami/crypto — `packages/crypto`

Cryptographic primitives: AES encryption/decryption and key derivation (used to encrypt wallet data at rest). No @umami dependencies.

- `src/KDF.ts` — key derivation function
- `src/AES.ts`, `src/AES_MODE.ts` — AES encryption
- `src/mobile/` — React Native implementations backed by `react-native-quick-crypto`
- Dual entry points: main export for web, `/react-native` export for mobile

## @umami/tezos — `packages/tezos`

Tezos blockchain primitives: addresses, networks, derivation paths, signers.

- `src/Address.ts` — address validation/parsing (implicit, contract, smart rollup)
- `src/Network.ts`, `src/constants.ts` — network configs, standard derivation paths, key prefixes
- `src/derivationPathUtils.ts` — BIP44 derivation path handling
- `src/format.ts`, `src/helpers.ts`, `src/fetch.ts` — formatting and RPC helpers
- `src/fakeSigner.ts` — fake signer used for estimation (returns fixed signature)
- Depends on: @umami/utils. External: @taquito/* (incl. ledger-signer), @ledgerhq/hw-transport-webusb

## @umami/tzkt — `packages/tzkt`

Typed client for the TzKT indexer API with rate limiting and retries.

- `src/fetch.ts` — typed fetch functions for TzKT endpoints
- `src/schemas.ts`, `src/types.ts` — zod schemas / TS types mirroring TzKT responses
- `src/withRateLimit.ts` — rate-limiting decorator (promise-semaphore)
- Depends on: @umami/tezos. External: @tzkt/sdk-api, promise-retry, zod

## @umami/chains — `packages/chains`

Chain-specific indexer wrappers (currently Tezos via TzKT) with retries and concurrency control.

- `src/indexers/tezos/` — Tezos indexers
- Depends on: @umami/tezos. External: @tzkt/sdk-api, zod

## @umami/multisig — `packages/multisig`

Tezos multisig contract logic: detection, decoding, and pending-operation handling.

- `src/contract.ts` — multisig contract deployment/utilities
- `src/decoding.ts` — Micheline decoding of multisig payloads (`UnrecognizedMichelsonError.ts` for failures)
- `src/fetch.ts` — fetch multisig state from chain
- `src/types.ts`, `src/schemas.ts` — types and zod schemas
- Depends on: @umami/tezos, @umami/tzkt

## @umami/social-auth — `packages/social-auth`

Social login via Torus CustomAuth (Google, Facebook, X/Twitter, Reddit, Email). No @umami dependencies.

- `src/Auth.ts` — base Auth class; provider subclasses in `GoogleAuth.ts`, `FacebookAuth.ts`, `TwitterAuth.ts`, `RedditAuth.ts`, `EmailAuth.ts`
- `src/forIDP.ts` — factory selecting the provider implementation
- `src/parseTorusRedirectParams.ts` — OAuth redirect parsing
- External: @toruslabs/customauth

## @umami/core — `packages/core`

Core wallet domain logic: accounts, operations, tokens, estimation/execution, Beacon utilities.

- `src/Account.ts` — account types (mnemonic, ledger, secret_key, social, multisig)
- `src/Operation.ts`, `src/AccountOperations.ts` — operation model
- `src/estimate.ts`, `src/execute.ts` — fee estimation and operation execution
- `src/Token.ts`, `src/TokenBalance.ts` — FA1.2/FA2 token model
- `src/Delegate.ts` — delegation logic
- `src/beaconUtils.ts`, `src/decodeBeaconPayload.ts` — Beacon dApp protocol helpers
- `src/Contact.ts` — address book contacts
- Depends on: @umami/social-auth, @umami/tezos, @umami/tzkt, @umami/utils. External: @taquito/*, @tezos-x/octez.connect-wallet

## @umami/state — `packages/state`

Redux store: slices, thunks, hooks, encrypted persistence, and dApp-connection state.

- `src/store.ts`, `src/reducer.ts` — store assembly and persistence config
- `src/slices/` — accounts, assets, batches, beacon, contacts, errors, multisigs, networks, tokens, protocolSettings, walletConnect, announcement, session
- `src/thunks/` — complex async flows (secretKeyAccount, changeMnemonicPassword, estimateAndUpdateBatch, renameAccount)
- `src/hooks/` — typed dispatch/selector hooks plus domain hooks (accounts, assets, beacon, walletconnect, operations…)
- `src/migrations.ts` — redux-persist migrations for schema evolution
- `src/walletConnect/WalletKit.ts` — WalletConnect (Reown WalletKit) integration
- `src/utils/localEncryptionKey.ts` — encryption key management for persisted state
- Depends on: @umami/core, @umami/crypto, @umami/multisig, @umami/social-auth, @umami/tezos, @umami/tzkt. External: @reduxjs/toolkit, redux-persist (+transform-encrypt), @walletconnect/*, @tezos-x/octez.connect-wallet

## @umami/data-polling — `packages/data-polling`

React hooks that poll chain/indexer data and push it into the Redux store (TanStack Query based).

- `src/useDataPolling.ts` — orchestrator combining all pollers
- Pollers: `usePollAccountStates`, `usePollTokenBalances`, `usePollPendingOperations`, `usePollMultisigs`, `usePollBakers`, `usePollUnstakeRequests`, `usePollBlock`, `usePollConversionRate`, `usePollProtocolSettings`
- `src/useGetOperations.tsx` — operation history fetching
- `src/useReactQueryErrorHandler.ts` — centralized query error handling
- Depends on: @umami/core, @umami/multisig, @umami/state, @umami/tezos, @umami/tzkt

## @umami/components — `packages/components`

Shared React (Chakra UI) components and hooks used by desktop/web apps.

- `src/components/` — DynamicDisclosure (modal/drawer system), AddressPill, MnemonicAutocomplete, ReactIdenticon…
- `src/hooks/` — usePasswordValidation, useStepHistory, useToggleMnemonic…
- `src/utils/validationSchemes` — zod form validation schemas
- Depends on: @umami/core, @umami/tezos, @umami/tzkt (+ state/multisig/test-utils in devDeps). External: @chakra-ui/react, react-hook-form, zod, zxcvbn, bip39

## @umami/test-utils — `packages/test-utils`

Shared test fixtures and helpers.

- `src/fixtures/` — FA1.2/FA2/NFT tokens, TzKT responses, wallet backup files (V1/V2/V2.1)
- `src/render.ts` — custom render with Redux store
- `src/mockStorage.ts`, `src/mockLocation.ts`, `src/fileUploadMock.ts` — browser API mocks

## @umami/passkey — `packages/passkey`

Stub/placeholder for future WebAuthn/passkey support (minimal `src/types`, no real implementation yet).

## Config packages

- **@umami/eslint-config** — shared ESLint config (`index.js`): TS + React + Chakra + Jest/testing-library plugins, import ordering, inline type imports
- **@umami/jest-config** — shared Jest preset (`jest.config.ts`): jsdom, 70% coverage thresholds, asset mocks, babel-jest
- **@umami/typescript-config** — base `tsconfig.json` for all packages

## Dependency layering

```
typescript-config / eslint-config / jest-config     (tooling)
utils   crypto   social-auth                        (foundation, no @umami deps)
tezos ── tzkt ── chains                             (blockchain primitives)
core ── multisig                                    (domain logic)
state                                               (redux store, persistence)
components   data-polling                           (UI + data layer for apps)
```
