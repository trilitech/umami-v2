# Architecture

Cross-cutting concepts that span multiple packages. See [packages.md](./packages.md) and [apps.md](./apps.md) for per-module detail.

## Account model

Defined in `packages/core/src/Account.ts` as a discriminated union on `type`:

- `mnemonic` — BIP39 HD accounts; several accounts per seed phrase, linked by `seedFingerPrint`; curve selectable (ed25519, secp256k1, p256)
- `ledger` — hardware wallet accounts (derivation path template, WebUSB transport)
- `secret_key` — imported raw private key
- `social` — Torus/Web3Auth-derived key (Google, Facebook, X, Reddit, Email, Apple)
- `multisig` — contract-based account (threshold + signers), not an implicit account

Implicit accounts (everything except multisig) share `label`, `address`, `pk`. Operations from a multisig account are wrapped as proposals signed by an implicit signer.

## State management (`packages/state`)

- Redux Toolkit store; slices under `src/slices/`: accounts, assets, batches, beacon, contacts, errors, multisigs, networks, tokens, protocolSettings, walletConnect, announcement, session
- **Persistence**: redux-persist with **two persist configs** (`src/reducer.ts`) — a root config and a separate accounts config — encrypted with `redux-persist-transform-encrypt`. The encryption key is derived from the user's password (PBKDF2, see crypto section). Sensitive material (`seedPhrases`, `secretKeys`) is stored encrypted; assets/tokens are blacklisted from root persistence (repopulated by polling).
- **Migrations**: `src/migrations.ts`, currently at version 9, applied through `createAsyncMigrate`. Any change to persisted slice shape requires a new migration + version bump.
- **Store assembly**: `makeStore()` builds the store; `initializePersistence(store, password)` activates encrypted persistence after login. Apps wrap rendering in `PersistGate`.
- Complex flows live in `src/thunks/` (e.g. `changeMnemonicPassword`, `estimateAndUpdateBatch`); UI reads state through hooks in `src/hooks/`.

## Operations: intent → estimate → sign → broadcast

1. **Model** (`packages/core/src/Operation.ts`): `Operation` is a union — tez transfer, FA1.2/FA2 token transfer, delegation/undelegation, origination, contract call, stake/unstake/finalize-unstake. `AccountOperations` is either `ImplicitOperations` (signed directly) or `ProposalOperations` (multisig proposal).
2. **Estimation** (`packages/core/src/estimate.ts`): builds a toolkit with `FakeSigner` (`packages/tezos/src/fakeSigner.ts`), runs `taquito.estimate.batch(...)`, auto-prepends a reveal estimate for unrevealed accounts → `EstimatedAccountOperations`.
3. **Signing**: `makeToolkit(signerConfig)` in `packages/tezos/src/helpers.ts` is the signer factory — `InMemorySigner` for mnemonic/social/secret_key, `LedgerSigner` (WebUSB) for ledger, `FakeSigner` for estimation.
4. **Broadcast** (`packages/core/src/execute.ts`): `executeOperations()` converts to wallet params and sends via `toolkit.wallet.batch().send()`.
5. **Multisig path**: operations are compiled to Michelson lambdas (`toLambda` / `toBatchLambda` using MANAGER_LAMBDA) and wrapped in a `propose` contract call; other signers later `approve`/`execute` once the threshold is met (`packages/multisig`).

## Data fetching & polling

- `packages/tzkt` wraps `@tzkt/sdk-api` with rate limiting (`withRateLimit`) and retries: account states, token balances, combined operation history, bakers, staking ops, blocks.
- `packages/data-polling` exposes React Query hooks polling at block time (6s since Tallinn/024): `usePollAccountStates`, `usePollTokenBalances`, `usePollPendingOperations`, `usePollMultisigs`, `usePollBakers`, `usePollUnstakeRequests`, `usePollBlock`, `usePollConversionRate`, `usePollProtocolSettings`. `useDataPolling()` composes them all and dispatches results into Redux (`assetsActions.updateAccountStates` etc.).

## dApp connections

- **Beacon protocol via octez.connect** (`@tezos-x/octez.connect-wallet`, the renamed beacon-sdk fork maintained by Trilitech/Nomadic/Functori): connections stored in the `beacon` slice (dAppId → accountPkh + network). The web app's `apps/web/src/components/beacon/useHandleBeaconMessage.tsx` routes incoming messages: PermissionRequest → permission modal; OperationRequest → convert to internal `Operation`, estimate, open sign page; SignPayloadRequest → sign-payload modal. Responses go back via `WalletClient.respond()`.
- **WalletConnect**: `@reown/walletkit` integration in `packages/state/src/walletConnect/WalletKit.ts`, with a minimal `walletConnect` slice.

## Social auth

`packages/social-auth` uses Torus CustomAuth: provider subclasses (`GoogleAuth`, `FacebookAuth`, …) derive a secp256k1 secret key from the OAuth login and return it Taquito-encoded. `apps/oauth/public/redirect.html` completes the OAuth redirect and relays the result to the app (postMessage / `umami://` deeplink / BroadcastChannel). The resulting account is stored like any other implicit account.

## Crypto at rest (`packages/crypto`)

- PBKDF2-SHA256 key derivation: 600k iterations (V2), 10k retained for V1 backup compatibility
- AES via Web Crypto API; encrypted payload format `{ iv, salt, data }` (hex)
- React Native uses `react-native-quick-crypto` implementations under `src/mobile/` (exported as `@umami/crypto/react-native`)

## UI layering

- `packages/components` — shared, mostly Redux-free Chakra components/hooks (modal system `DynamicDisclosure`, AddressPill, form validation)
- App-level components (`apps/web/src/components`, `apps/desktop/src/components`) — Redux-connected views, send flow, Beacon/WalletConnect handling
- Theming: Chakra UI v2 + Emotion; each app carries its own theme/provider stack; mobile uses Tamagui instead
