import { mockImplicitAccount, mockLedgerAccount } from "@umami/core";
import { CODE_HASH, TYPE_HASH } from "@umami/multisig";
import { uUSD } from "@umami/test-utils";
import { mockContractAddress, mockImplicitAddress } from "@umami/tezos";
import {
  type DelegationOperation,
  type FinalizeUnstakeOperation,
  type OriginationOperation,
  type RawTzktTokenTransfer,
  type StakeOperation,
  type TokenTransferOperation,
  type TransactionOperation,
  type UnstakeOperation,
} from "@umami/tzkt";

export const transactionFixture = (
  props?: Partial<TransactionOperation>
): TransactionOperation => ({
  amount: 1,
  target: { address: mockImplicitAccount(0).address.pkh },
  sender: { address: mockImplicitAccount(1).address.pkh },
  hash: "test-hash",
  counter: 1234,
  id: 56789,
  level: 4321,
  timestamp: "2021-01-02T00:00:00.000Z",
  type: "transaction",
  status: "applied",
  ...props,
});

export const contractCallFixture = (props?: Partial<TransactionOperation>) =>
  transactionFixture({
    target: { address: mockContractAddress(0).pkh },
    parameter: { entrypoint: "test-entrypoint" },
    ...props,
  });

export const originationFixture = (
  props?: Partial<OriginationOperation>
): OriginationOperation => ({
  hash: "test-hash",
  counter: 1234,
  id: 56789,
  level: 4321,
  type: "origination",
  sender: { address: mockLedgerAccount(0).address.pkh },
  timestamp: "2021-01-02T00:00:00.000Z",
  originatedContract: {
    address: mockContractAddress(0).pkh,
    typeHash: TYPE_HASH,
    codeHash: CODE_HASH,
  },
  status: "applied",
  ...props,
});

export const delegationFixture = (props?: Partial<DelegationOperation>): DelegationOperation => ({
  hash: "test-hash",
  counter: 1234,
  id: 56789,
  level: 4321,
  type: "delegation",
  sender: { address: mockLedgerAccount(0).address.pkh },
  timestamp: "2021-01-02T00:00:00.000Z",
  newDelegate: {
    address: mockImplicitAddress(1).pkh,
  },
  amount: 5,
  status: "applied",
  ...props,
});

export const tokenTransferFixture = (
  props?: Partial<RawTzktTokenTransfer>
): TokenTransferOperation =>
  ({
    type: "token_transfer",
    amount: "500",
    transactionId: 56789,
    id: 278346,
    level: 10,
    from: { address: mockImplicitAccount(0).address.pkh },
    to: { address: mockImplicitAccount(1).address.pkh },
    token: uUSD(mockLedgerAccount(0).address).token,
    ...props,
  }) as TokenTransferOperation;

export const stakeFixture = (props?: Partial<StakeOperation>): StakeOperation => ({
  hash: "test-hash",
  counter: 1234,
  id: 56789,
  level: 4321,
  type: "stake",
  sender: { address: mockLedgerAccount(0).address.pkh },
  timestamp: "2021-01-02T00:00:00.000Z",
  baker: {
    address: mockImplicitAddress(1).pkh,
  },
  amount: 5,
  status: "applied",
  ...props,
});

export const unstakeFixture = (props?: Partial<UnstakeOperation>): UnstakeOperation => ({
  hash: "test-hash",
  counter: 1234,
  id: 56789,
  level: 4321,
  type: "unstake",
  sender: { address: mockLedgerAccount(0).address.pkh },
  timestamp: "2021-01-02T00:00:00.000Z",
  baker: {
    address: mockImplicitAddress(1).pkh,
  },
  amount: 10,
  status: "applied",
  ...props,
});

export const finalizeUnstakeFixture = (
  props?: Partial<FinalizeUnstakeOperation>
): FinalizeUnstakeOperation => ({
  hash: "test-hash",
  counter: 1234,
  id: 56789,
  level: 4321,
  type: "finalize",
  sender: { address: mockLedgerAccount(0).address.pkh },
  timestamp: "2021-01-02T00:00:00.000Z",
  amount: 15,
  status: "applied",
  ...props,
});
