import { mockContractAddress, mockImplicitAccount } from "../../mocks/factories";
import { TransactionOperation } from "../../utils/tezos";

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
