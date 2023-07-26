import { mockContractAddress, mockImplicitAddress } from "../mocks/factories";
import { ContractAddress, ImplicitAddress, parseContractPkh } from "../types/Address";
import { FA12Operation, FA2Operation } from "../types/Operation";
import { makeFA12TransactionParameter, makeFA2TransactionParameter } from "../utils/tezos";
import {
  FA12_TRANSFER_ARG_TYPES,
  FA2_TRANSFER_ARG_TYPES,
  makeBatchLambda,
  makeLambda,
} from "./multisigUtils";

jest.unmock("../utils/tezos");

// Originated multisig contract
const multisigContractAddress = parseContractPkh("KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm");

describe("makeLambda", () => {
  describe("tez", () => {
    it("can send transactions to users", () => {
      const MUTEZ_AMOUNT = "652423";

      const result = makeLambda({
        type: "tez",
        amount: MUTEZ_AMOUNT,
        recipient: mockImplicitAddress(0),
      });
      expect(result).toEqual([
        { prim: "DROP" },
        { args: [{ prim: "operation" }], prim: "NIL" },
        ...singleTez(MUTEZ_AMOUNT, mockImplicitAddress(0)),
      ]);
    });

    it("can send transactions to contracts", () => {
      const MUTEZ_AMOUNT = "652423";

      const result = makeLambda({
        type: "tez",
        amount: MUTEZ_AMOUNT,
        recipient: mockContractAddress(0),
      });

      expect(result).toEqual([
        { prim: "DROP" },
        { args: [{ prim: "operation" }], prim: "NIL" },
        ...singleTezContract(MUTEZ_AMOUNT, mockContractAddress(0)),
      ]);
    });
  });

  test("fa1.2", () => {
    const AMOUNT = "4536";
    const operation: FA12Operation = {
      type: "fa1.2",
      amount: AMOUNT,
      recipient: mockImplicitAddress(0),
      contract: mockContractAddress(0),
      tokenId: "0",
      sender: multisigContractAddress,
    };
    const result = makeLambda(operation);

    expect(result).toEqual([
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...fa12Lambda(operation),
    ]);
  });

  test("fa2", () => {
    const AMOUNT = "4536";
    const MOCK_TOKEN_ID = "7";
    const operation: FA2Operation = {
      type: "fa2",
      amount: AMOUNT,
      recipient: mockImplicitAddress(0),
      contract: mockContractAddress(0),
      sender: multisigContractAddress,
      tokenId: MOCK_TOKEN_ID,
    };
    const result = makeBatchLambda([operation]);

    expect(result).toEqual([
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...fa2Lambda(operation),
    ]);
  });

  describe("delegation", () => {
    it("can set a delegate", () => {
      const result = makeLambda({
        type: "delegation",
        sender: multisigContractAddress,
        recipient: mockImplicitAddress(0),
      });
      expect(result).toEqual([
        { prim: "DROP" },
        { args: [{ prim: "operation" }], prim: "NIL" },
        ...setDelegationLambda(mockImplicitAddress(0)),
      ]);
    });

    it("can unset a delegate", () => {
      const result = makeLambda({
        type: "delegation",
        sender: multisigContractAddress,
        recipient: undefined,
      });

      expect(result).toEqual([
        { prim: "DROP" },
        { args: [{ prim: "operation" }], prim: "NIL" },
        ...dropDelegationLambda,
      ]);
    });
  });
});

describe("makeBatchLambda", () => {
  test("one operation batch", () => {
    const MUTEZ_AMOUNT_1 = "652421";

    const result = makeBatchLambda([
      {
        type: "tez",
        amount: MUTEZ_AMOUNT_1,
        recipient: mockImplicitAddress(0),
      },
    ]);

    const expected = [
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...singleTez(MUTEZ_AMOUNT_1, mockImplicitAddress(0)),
    ];
    expect(result).toEqual(expected);
  });

  test("all kinds of operations batch", () => {
    const MOCK_TEZ_AMOUNT = "55555";
    const MOCK_TEZ_AMOUNT2 = "55556";
    const fa2Operation: FA2Operation = {
      type: "fa2",
      amount: "1",
      recipient: mockImplicitAddress(0),
      contract: mockContractAddress(0),
      sender: multisigContractAddress,
      tokenId: "123",
    };
    const fa12Operation: FA12Operation = {
      type: "fa1.2",
      amount: "1",
      tokenId: "0",
      recipient: mockImplicitAddress(0),
      contract: mockContractAddress(1),
      sender: multisigContractAddress,
    };
    const result = makeBatchLambda([
      { type: "tez", amount: MOCK_TEZ_AMOUNT, recipient: mockImplicitAddress(1) },
      {
        type: "tez",
        amount: MOCK_TEZ_AMOUNT2,
        recipient: mockContractAddress(0),
      },
      fa2Operation,
      fa12Operation,
      {
        type: "delegation",
        sender: multisigContractAddress,
        recipient: mockImplicitAddress(1),
      },
      { type: "delegation", sender: multisigContractAddress, recipient: undefined },
    ]);

    const expected = [
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...singleTez(MOCK_TEZ_AMOUNT, mockImplicitAddress(1)),
      ...singleTezContract(MOCK_TEZ_AMOUNT2, mockContractAddress(0)),
      ...fa2Lambda(fa2Operation),
      ...fa12Lambda(fa12Operation),
      ...setDelegationLambda(mockImplicitAddress(1)),
      ...dropDelegationLambda,
    ];
    expect(result).toEqual(expected);
  });
});

const fa2Lambda = (operation: FA2Operation) => {
  return [
    {
      args: [{ prim: "address" }, { string: operation.contract.pkh + "%transfer" }],
      prim: "PUSH",
    },
    { args: [FA2_TRANSFER_ARG_TYPES], prim: "CONTRACT" },
    [{ prim: "IF_NONE", args: [[{ prim: "UNIT" }, { prim: "FAILWITH" }], []] }],
    { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
    {
      args: [FA2_TRANSFER_ARG_TYPES, makeFA2TransactionParameter(operation).value],
      prim: "PUSH",
    },
    { prim: "TRANSFER_TOKENS" },
    { prim: "CONS" },
  ];
};

const singleTez = (amount: string, recipient: ImplicitAddress) => {
  return [
    {
      args: [{ prim: "key_hash" }, { string: recipient.pkh }],
      prim: "PUSH",
    },
    { prim: "IMPLICIT_ACCOUNT" },
    { args: [{ prim: "mutez" }, { int: amount }], prim: "PUSH" },
    { prim: "UNIT" },
    { prim: "TRANSFER_TOKENS" },
    { prim: "CONS" },
  ];
};

const singleTezContract = (amount: string, recipient: ContractAddress) => {
  return [
    {
      prim: "PUSH",
      args: [{ prim: "address" }, { string: recipient.pkh }],
    },
    { prim: "CONTRACT", args: [{ prim: "unit" }] },
    {
      prim: "IF_NONE",
      args: [[{ prim: "UNIT" }, { prim: "FAILWITH" }], []],
    },
    { prim: "PUSH", args: [{ prim: "mutez" }, { int: amount }] },
    { prim: "UNIT" },
    { prim: "TRANSFER_TOKENS" },
    { prim: "CONS" },
  ];
};

const fa12Lambda = (operation: FA12Operation) => {
  return [
    {
      args: [{ prim: "address" }, { string: operation.contract.pkh + "%transfer" }],
      prim: "PUSH",
    },
    { args: [FA12_TRANSFER_ARG_TYPES], prim: "CONTRACT" },
    [
      {
        prim: "IF_NONE",
        args: [[{ prim: "UNIT" }, { prim: "FAILWITH" }], []],
      },
    ],
    { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
    {
      args: [FA12_TRANSFER_ARG_TYPES, makeFA12TransactionParameter(operation).value],
      prim: "PUSH",
    },
    { prim: "TRANSFER_TOKENS" },
    { prim: "CONS" },
  ];
};

const setDelegationLambda = (recipient: ImplicitAddress) => {
  return [
    {
      prim: "PUSH",
      args: [{ prim: "key_hash" }, { string: recipient.pkh }],
    },
    { prim: "SOME" },
    { prim: "SET_DELEGATE" },
    { prim: "CONS" },
  ];
};

const dropDelegationLambda = [
  { prim: "NONE", args: [{ prim: "key_hash" }] },
  { prim: "SET_DELEGATE" },
  { prim: "CONS" },
];
