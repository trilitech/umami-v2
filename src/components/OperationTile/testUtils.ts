import {
  mockContractAddress,
  mockImplicitAccount,
  mockImplicitAddress,
  mockLedgerAccount,
} from "../../mocks/factories";
import { CODE_HASH, TYPE_HASH } from "../../utils/multisig/fetch";
import { DelegationOperation, OriginationOperation, TransactionOperation } from "../../utils/tezos";

export const transactionFixture = (props: Partial<TransactionOperation>): TransactionOperation => ({
  amount: 1,
  target: { address: mockImplicitAccount(0).address.pkh },
  sender: { address: mockImplicitAccount(1).address.pkh },
  hash: "test-hash",
  counter: 1234,
  id: 56789,
  level: 4321,
  timestamp: "2021-01-02T00:00:00.000Z",
  type: "transaction",
  ...props,
});

export const contractCallFixture = (props: Partial<TransactionOperation>) =>
  transactionFixture({
    target: { address: mockContractAddress(0).pkh },
    parameter: { entrypoint: "test-entrypoint" },
    ...props,
  });

export const originationFixture = (props: Partial<OriginationOperation>): OriginationOperation => ({
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
  ...props,
});

export const delegationFixture = (props: Partial<DelegationOperation>): DelegationOperation => ({
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
  ...props,
});
