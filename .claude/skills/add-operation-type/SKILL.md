---
name: add-operation-type
description: Add or modify a Tezos operation type (transfer, delegation, stake, contract call…) end-to-end — core types, lambda conversion, estimation, execution, and UI send flow. Use when a task touches packages/core Operation/AccountOperations or the signing pipeline.
---

# Adding/changing an operation type

Operations flow through a fixed pipeline; a new operation type must be handled at every stage or it will fail at runtime (unions are switched exhaustively).

## Pipeline & touchpoints (in order)

1. **Type** — `packages/core/src/Operation.ts`: add the variant to the `Operation` union (existing: tez transfer, FA1.2/FA2 transfer, delegation, undelegation, origination, contract call, stake, unstake, finalize-unstake).
2. **Michelson lambda** — same file: `toLambda()` converts an operation to Michelson (MANAGER_LAMBDA) for the **multisig** path; `toBatchLambda()` wraps batches. If the operation can be proposed by a multisig, it needs a lambda; if not (e.g. staking may be implicit-only), throw explicitly.
3. **Batch params** — `packages/core/src/estimate.ts` / helpers converting `AccountOperations` → taquito batch params (`operationsToBatchParams`). Estimation runs on a toolkit with `FakeSigner` (`packages/tezos/src/fakeSigner.ts`) and auto-prepends a reveal for unrevealed accounts.
4. **Execution** — `packages/core/src/execute.ts`: `executeOperations()` → wallet params → `toolkit.wallet.batch().send()`.
5. **State** — batches of pending operations live in the `batches` slice (`packages/state/src/slices`), added via `estimateAndUpdateBatch` thunk.
6. **History/display** — TzKT types in `packages/tzkt` and operation rendering in the apps' Activity/Operations views must recognize the new kind (tzkt returns it with its own `type`).
7. **UI send flow** — desktop: `apps/desktop/src/components/SendFlow/`; web: `apps/web/src/components/` send flow. Each operation kind has a form component producing the core `Operation` object.
8. **dApp path** — if the operation can arrive from a dApp, extend the Beacon request → `Operation` conversion (`apps/web/src/components/beacon/useHandleBeaconMessage.tsx` and `packages/core/src/beaconUtils.ts`).

## Testing

- Unit-test lambda conversion and estimation in `packages/core` (fixtures in `@umami/test-utils`; `executeParams.ts` has estimate fixtures).
- `packages/tezos/src/fakeSigner.ts` lets estimation tests run without keys.
- For real-chain behavior use the e2e sandbox (see e2e-sandbox skill).

## Gotchas

- Keep `@taquito/*` versions identical across all packages (v25.x = Ushuaia/025), and `bignumber.js` on the same major as taquito's.
- Multisig proposals execute lambdas with the **contract** as sender; fees are paid by the proposing implicit account.
- Amounts are mutez strings/BigNumber (`bignumber.js`) — never JS floats. Formatting helpers live in `packages/tezos/src/format.ts`.
