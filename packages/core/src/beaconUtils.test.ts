import { type PartialTezosOperation, TezosOperationType } from "@airgap/beacon-wallet";
import { mockContractAddress, mockImplicitAddress } from "@umami/tezos";
import { without } from "lodash";

import { makeAccountOperations } from "./AccountOperations";
import { partialOperationToOperation, toAccountOperations } from "./beaconUtils";
import { mockImplicitAccount, mockTezOperation } from "./testUtils";

const account = mockImplicitAccount(1);

describe("toAccountOperations", () => {
  it("throws if the list is empty", () => {
    expect(() => toAccountOperations([], account)).toThrow("Empty operation details!");
  });

  it("converts a list of partial operations to ImplicitOperations", () => {
    const operationDetails: PartialTezosOperation[] = [
      {
        kind: TezosOperationType.TRANSACTION,
        amount: "1",
        destination: mockImplicitAddress(2).pkh,
      },
      {
        kind: TezosOperationType.TRANSACTION,
        amount: "2",
        destination: mockImplicitAddress(2).pkh,
      },
    ];

    const operations = toAccountOperations(operationDetails, account);

    expect(operations).toEqual(
      makeAccountOperations(account, account, [
        { type: "tez", amount: "1", recipient: mockImplicitAddress(2) },
        { type: "tez", amount: "2", recipient: mockImplicitAddress(2) },
      ])
    );
  });
});

describe("partialOperationToOperation", () => {
  describe.each(
    without(
      Object.values(TezosOperationType),
      TezosOperationType.TRANSACTION,
      TezosOperationType.DELEGATION,
      TezosOperationType.ORIGINATION
    )
  )("for %s", kind => {
    it("throws an error", () => {
      const operation: PartialTezosOperation = { kind } as PartialTezosOperation;

      expect(() => partialOperationToOperation(operation, account)).toThrow(
        `Unsupported operation kind: ${kind}`
      );
    });
  });

  test("tez transaction", () => {
    const operation: PartialTezosOperation = {
      kind: TezosOperationType.TRANSACTION,
      amount: "1",
      destination: mockImplicitAddress(2).pkh,
    };

    const result = partialOperationToOperation(operation, account);

    expect(result).toEqual(mockTezOperation(1));
  });

  test("stake", () => {
    const operation: PartialTezosOperation = {
      kind: TezosOperationType.TRANSACTION,
      amount: "1",
      destination: mockImplicitAddress(2).pkh,
      parameters: {
        entrypoint: "stake",
        value: [{ prim: "UNIT" }],
      },
    };

    const result = partialOperationToOperation(operation, account);

    expect(result).toEqual({
      type: "stake",
      amount: "1",
      sender: mockImplicitAddress(2),
    });
  });

  test("unstake", () => {
    const operation: PartialTezosOperation = {
      kind: TezosOperationType.TRANSACTION,
      amount: "12",
      destination: mockImplicitAddress(2).pkh,
      parameters: {
        entrypoint: "unstake",
        value: [{ prim: "UNIT" }],
      },
    };

    const result = partialOperationToOperation(operation, account);

    expect(result).toEqual({
      type: "unstake",
      amount: "12",
      sender: mockImplicitAddress(2),
    });
  });

  test("finalize unstake", () => {
    const operation: PartialTezosOperation = {
      kind: TezosOperationType.TRANSACTION,
      destination: mockImplicitAddress(2).pkh,
      amount: "0",
      parameters: {
        entrypoint: "finalize_unstake",
        value: [{ prim: "UNIT" }],
      },
    };

    const result = partialOperationToOperation(operation, account);

    expect(result).toEqual({
      type: "finalize_unstake",
      sender: mockImplicitAddress(2),
    });
  });

  test("contract call", () => {
    const operation: PartialTezosOperation = {
      kind: TezosOperationType.TRANSACTION,
      amount: "1",
      destination: mockContractAddress(2).pkh,
      parameters: {
        entrypoint: "mockEntrypoint",
        value: [{ prim: "UNIT" }],
      },
    };

    const result = partialOperationToOperation(operation, account);

    expect(result).toEqual({
      type: "contract_call",
      amount: "1",
      contract: mockContractAddress(2),
      entrypoint: "mockEntrypoint",
      args: [{ prim: "UNIT" }],
    });
  });

  test("delegate", () => {
    const operation: PartialTezosOperation = {
      kind: TezosOperationType.DELEGATION,
      delegate: mockImplicitAddress(2).pkh,
    };

    const result = partialOperationToOperation(operation, account);

    expect(result).toEqual({
      type: "delegation",
      sender: account.address,
      recipient: mockImplicitAddress(2),
    });
  });

  test("undelegate", () => {
    const operation: PartialTezosOperation = {
      kind: TezosOperationType.DELEGATION,
    };

    const result = partialOperationToOperation(operation, account);

    expect(result).toEqual({ type: "undelegation", sender: account.address });
  });
});
