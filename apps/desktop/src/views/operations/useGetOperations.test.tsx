import { type TzktCombinedOperation } from "@umami/tzkt";

import { filterDuplicatedTokenTransfers } from "./useGetOperations";
import {
  delegationFixture,
  originationFixture,
  tokenTransferFixture,
  transactionFixture,
} from "../../components/OperationTile/testUtils";

test("filterDuplicatedTokenTransfers", () => {
  const operations: TzktCombinedOperation[] = [
    transactionFixture({ id: 0 }),
    delegationFixture({ id: 1 }),
    transactionFixture({ id: 2 }),
    originationFixture({ id: 3 }),
    tokenTransferFixture({ id: 4, transactionId: 1 }),
    tokenTransferFixture({ id: 5, originationId: 3 }),
    originationFixture({ id: 6 }),
    delegationFixture({ id: 7 }),
    tokenTransferFixture({ id: 8, transactionId: 9 }),
    transactionFixture({ id: 9 }),
  ];

  expect(filterDuplicatedTokenTransfers(operations)).toEqual([
    transactionFixture({ id: 0 }),
    delegationFixture({ id: 1 }),
    transactionFixture({ id: 2 }),
    originationFixture({ id: 3 }),
    tokenTransferFixture({ id: 5, originationId: 3 }),
    originationFixture({ id: 6 }),
    delegationFixture({ id: 7 }),
    transactionFixture({ id: 9 }),
  ]);
});
