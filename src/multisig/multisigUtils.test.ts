/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TezosNetwork } from "@airgap/tezos";
import {
  ContractMethod,
  ContractProvider,
  TransferParams,
} from "@taquito/taquito";
import { mockContract, mockPkh } from "../mocks/factories";
import { fakeTezosUtils } from "../mocks/fakeTezosUtils";
import {
  FA12_TRANSFER_ARG_TYPES,
  FA2_TRANSFER_ARG_TYPES,
  makeBatchLambda,
  makeLambda,
} from "./multisigUtils";

// Originated multisig contract
const multisigContract = "KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm";

const MOCK_FA2_MICHELSON_PARAM = {
  parameter: {
    value: [{ prim: "mock" }],
    entrypoint: "transfer",
  },
  to: "",
  amount: 0,
} as TransferParams;

const MOCK_FA12_MICHELSON_PARAM = {
  parameter: {
    value: [{ prim: "mock" }],
    entrypoint: "transfer",
  },
  to: "",
  amount: 0,
} as TransferParams;

beforeEach(() => {
  fakeTezosUtils.makeFA2TransferMethod.mockResolvedValue({
    toTransferParams: () => MOCK_FA2_MICHELSON_PARAM,
  } as ContractMethod<ContractProvider>);

  fakeTezosUtils.makeFA12TransferMethod.mockResolvedValue({
    toTransferParams: () => MOCK_FA12_MICHELSON_PARAM,
  } as ContractMethod<ContractProvider>);
});

describe("makeLambda", () => {
  describe("tez", () => {
    it("can send transactions to users", async () => {
      const MUTEZ_AMOUNT = "652423";

      const result = await makeLambda(
        {
          type: "tez",
          amount: MUTEZ_AMOUNT,
          recipient: mockPkh(0),
        },
        TezosNetwork.GHOSTNET
      );
      expect(result).toEqual([
        { prim: "DROP" },
        { args: [{ prim: "operation" }], prim: "NIL" },
        ...singleTez(MUTEZ_AMOUNT, mockPkh(0)),
      ]);
    });

    it("can send transactions to contracts", async () => {
      const MUTEZ_AMOUNT = "652423";

      const result = await makeLambda(
        {
          type: "tez",
          amount: MUTEZ_AMOUNT,
          recipient: mockContract(0),
        },
        TezosNetwork.GHOSTNET
      );

      expect(result).toEqual([
        { prim: "DROP" },
        { args: [{ prim: "operation" }], prim: "NIL" },
        ...singleTezContract(MUTEZ_AMOUNT, mockContract(0)),
      ]);
    });
  });

  test("fa1.2", async () => {
    const AMOUNT = "4536";
    const result = await makeLambda(
      {
        type: "fa1.2",
        amount: AMOUNT,
        recipient: mockPkh(0),
        contract: mockContract(0),
        sender: multisigContract,
      },
      TezosNetwork.GHOSTNET
    );

    expect(result).toEqual([
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...fa12Lambda(mockContract(0)),
    ]);
  });

  test("fa2", async () => {
    const AMOUNT = "4536";
    const MOCK_TOKEN_ID = "7";
    const result = await makeBatchLambda(
      [
        {
          type: "fa2",
          amount: AMOUNT,
          recipient: mockPkh(0),
          contract: mockContract(0),
          sender: multisigContract,
          tokenId: MOCK_TOKEN_ID,
        },
      ],
      TezosNetwork.GHOSTNET
    );

    expect(result).toEqual([
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...fa2Lambda(mockContract(0)),
    ]);
  });

  describe("delegation", () => {
    it("can set a delegate", async () => {
      const result = await makeLambda(
        {
          type: "delegation",
          recipient: mockPkh(0),
        },
        TezosNetwork.GHOSTNET
      );
      expect(result).toEqual([
        { prim: "DROP" },
        { args: [{ prim: "operation" }], prim: "NIL" },
        ...setDelegationLambda(mockPkh(0)),
      ]);
    });

    it("can unset a delegate", async () => {
      const emptyStringResult = await makeLambda(
        {
          type: "delegation",
          recipient: "",
        },
        TezosNetwork.GHOSTNET
      );

      expect(emptyStringResult).toEqual([
        { prim: "DROP" },
        { args: [{ prim: "operation" }], prim: "NIL" },
        ...dropDelegationLambda,
      ]);

      const undefinedResult = await makeLambda(
        { type: "delegation" },
        TezosNetwork.GHOSTNET
      );

      expect(undefinedResult).toEqual([
        { prim: "DROP" },
        { args: [{ prim: "operation" }], prim: "NIL" },
        ...dropDelegationLambda,
      ]);
    });
  });
});

describe("makeBatchLambda", () => {
  test("one operation batch", async () => {
    const MUTEZ_AMOUNT_1 = "652421";

    const result = await makeBatchLambda(
      [
        {
          type: "tez",
          amount: MUTEZ_AMOUNT_1,
          recipient: mockPkh(0),
        },
      ],
      TezosNetwork.GHOSTNET
    );

    const expected = [
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...singleTez(MUTEZ_AMOUNT_1, mockPkh(0)),
    ];
    expect(result).toEqual(expected);
  });

  test("all kinds of operations batch", async () => {
    const MOCK_TEZ_AMOUNT = "55555";
    const MOCK_TEZ_AMOUNT2 = "55556";
    const result = await makeBatchLambda(
      [
        { type: "tez", amount: MOCK_TEZ_AMOUNT, recipient: mockPkh(1) },
        {
          type: "tez",
          amount: MOCK_TEZ_AMOUNT2,
          recipient: mockContract(0),
        },
        {
          type: "fa2",
          amount: "1",
          recipient: mockPkh(0),
          contract: mockContract(0),
          sender: multisigContract,
          tokenId: "123",
        },
        {
          type: "fa1.2",
          amount: "1",
          recipient: mockPkh(0),
          contract: mockContract(1),
          sender: multisigContract,
        },
        {
          type: "delegation",
          recipient: mockPkh(1),
        },
        { type: "delegation" },
      ],
      TezosNetwork.GHOSTNET
    );

    const expected = [
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...singleTez(MOCK_TEZ_AMOUNT, mockPkh(1)),
      ...singleTezContract(MOCK_TEZ_AMOUNT2, mockContract(0)),
      ...fa2Lambda(mockContract(0)),
      ...fa12Lambda(mockContract(1)),
      ...setDelegationLambda(mockPkh(1)),
      ...dropDelegationLambda,
    ];
    expect(result).toEqual(expected);
  });
});

const fa2Lambda = (contract: string) => {
  return [
    {
      args: [{ prim: "address" }, { string: contract + "%transfer" }],
      prim: "PUSH",
    },
    { args: [FA2_TRANSFER_ARG_TYPES], prim: "CONTRACT" },
    [{ prim: "IF_NONE", args: [[{ prim: "UNIT" }, { prim: "FAILWITH" }], []] }],
    { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
    {
      args: [FA2_TRANSFER_ARG_TYPES, MOCK_FA2_MICHELSON_PARAM.parameter?.value],
      prim: "PUSH",
    },
    { prim: "TRANSFER_TOKENS" },
    { prim: "CONS" },
  ];
};

const singleTez = (amount: string, recipient: string) => {
  return [
    {
      args: [{ prim: "key_hash" }, { string: recipient }],
      prim: "PUSH",
    },
    { prim: "IMPLICIT_ACCOUNT" },
    { args: [{ prim: "mutez" }, { int: amount }], prim: "PUSH" },
    { prim: "UNIT" },
    { prim: "TRANSFER_TOKENS" },
    { prim: "CONS" },
  ];
};

const singleTezContract = (amount: string, recipient: string) => {
  return [
    {
      prim: "PUSH",
      args: [{ prim: "address" }, { string: recipient }],
    },
    { prim: "CONTRACT", args: [{ prim: "unit" }] },
    [
      {
        prim: "IF_NONE",
        args: [[[{ prim: "UNIT" }, { prim: "FAILWITH" }]], []],
      },
    ],
    { prim: "PUSH", args: [{ prim: "mutez" }, { int: amount }] },
    { prim: "UNIT" },
    { prim: "TRANSFER_TOKENS" },
    { prim: "CONS" },
  ];
};

const fa12Lambda = (contract: string) => {
  return [
    {
      args: [{ prim: "address" }, { string: contract + "%transfer" }],
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
      args: [
        FA12_TRANSFER_ARG_TYPES,
        MOCK_FA12_MICHELSON_PARAM.parameter?.value,
      ],
      prim: "PUSH",
    },
    { prim: "TRANSFER_TOKENS" },
    { prim: "CONS" },
  ];
};

const setDelegationLambda = (recipient: string) => {
  return [
    {
      prim: "PUSH",
      args: [{ prim: "key_hash" }, { string: recipient }],
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
