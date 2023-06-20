/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TezosNetwork } from "@airgap/tezos";
import { ContractMethod, ContractProvider, TransferParams } from "@taquito/taquito";
import { mockContractAddress, mockImplicitAddress } from "../mocks/factories";
import { fakeTezosUtils } from "../mocks/fakeTezosUtils";
import { ContractAddress, ImplicitAddress, parseContractPkh } from "../types/Address";
import {
  FA12_TRANSFER_ARG_TYPES,
  FA2_TRANSFER_ARG_TYPES,
  makeBatchLambda,
  makeLambda,
} from "./multisigUtils";

// Originated multisig contract
const multisigContractAddress = parseContractPkh("KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm");

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
          recipient: mockImplicitAddress(0),
        },
        TezosNetwork.GHOSTNET
      );
      expect(result).toEqual([
        { prim: "DROP" },
        { args: [{ prim: "operation" }], prim: "NIL" },
        ...singleTez(MUTEZ_AMOUNT, mockImplicitAddress(0)),
      ]);
    });

    it("can send transactions to contracts", async () => {
      const MUTEZ_AMOUNT = "652423";

      const result = await makeLambda(
        {
          type: "tez",
          amount: MUTEZ_AMOUNT,
          recipient: mockContractAddress(0),
        },
        TezosNetwork.GHOSTNET
      );

      expect(result).toEqual([
        { prim: "DROP" },
        { args: [{ prim: "operation" }], prim: "NIL" },
        ...singleTezContract(MUTEZ_AMOUNT, mockContractAddress(0)),
      ]);
    });
  });

  test("fa1.2", async () => {
    const AMOUNT = "4536";
    const result = await makeLambda(
      {
        type: "fa1.2",
        amount: AMOUNT,
        recipient: mockImplicitAddress(0),
        contract: mockContractAddress(0),
        sender: multisigContractAddress,
      },
      TezosNetwork.GHOSTNET
    );

    expect(result).toEqual([
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...fa12Lambda(mockContractAddress(0)),
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
          recipient: mockImplicitAddress(0),
          contract: mockContractAddress(0),
          sender: multisigContractAddress,
          tokenId: MOCK_TOKEN_ID,
        },
      ],
      TezosNetwork.GHOSTNET
    );

    expect(result).toEqual([
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...fa2Lambda(mockContractAddress(0)),
    ]);
  });

  describe("delegation", () => {
    it("can set a delegate", async () => {
      const result = await makeLambda(
        {
          type: "delegation",
          recipient: mockImplicitAddress(0),
        },
        TezosNetwork.GHOSTNET
      );
      expect(result).toEqual([
        { prim: "DROP" },
        { args: [{ prim: "operation" }], prim: "NIL" },
        ...setDelegationLambda(mockImplicitAddress(0)),
      ]);
    });

    it("can unset a delegate", async () => {
      const result = await makeLambda(
        { type: "delegation", recipient: undefined },
        TezosNetwork.GHOSTNET
      );

      expect(result).toEqual([
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
          recipient: mockImplicitAddress(0),
        },
      ],
      TezosNetwork.GHOSTNET
    );

    const expected = [
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...singleTez(MUTEZ_AMOUNT_1, mockImplicitAddress(0)),
    ];
    expect(result).toEqual(expected);
  });

  test("all kinds of operations batch", async () => {
    const MOCK_TEZ_AMOUNT = "55555";
    const MOCK_TEZ_AMOUNT2 = "55556";
    const result = await makeBatchLambda(
      [
        { type: "tez", amount: MOCK_TEZ_AMOUNT, recipient: mockImplicitAddress(1) },
        {
          type: "tez",
          amount: MOCK_TEZ_AMOUNT2,
          recipient: mockContractAddress(0),
        },
        {
          type: "fa2",
          amount: "1",
          recipient: mockImplicitAddress(0),
          contract: mockContractAddress(0),
          sender: multisigContractAddress,
          tokenId: "123",
        },
        {
          type: "fa1.2",
          amount: "1",
          recipient: mockImplicitAddress(0),
          contract: mockContractAddress(1),
          sender: multisigContractAddress,
        },
        {
          type: "delegation",
          recipient: mockImplicitAddress(1),
        },
        { type: "delegation", recipient: undefined },
      ],
      TezosNetwork.GHOSTNET
    );

    const expected = [
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...singleTez(MOCK_TEZ_AMOUNT, mockImplicitAddress(1)),
      ...singleTezContract(MOCK_TEZ_AMOUNT2, mockContractAddress(0)),
      ...fa2Lambda(mockContractAddress(0)),
      ...fa12Lambda(mockContractAddress(1)),
      ...setDelegationLambda(mockImplicitAddress(1)),
      ...dropDelegationLambda,
    ];
    expect(result).toEqual(expected);
  });
});

const fa2Lambda = (address: ContractAddress) => {
  return [
    {
      args: [{ prim: "address" }, { string: address.pkh + "%transfer" }],
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

const fa12Lambda = (address: ContractAddress) => {
  return [
    {
      args: [{ prim: "address" }, { string: address.pkh + "%transfer" }],
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
      args: [FA12_TRANSFER_ARG_TYPES, MOCK_FA12_MICHELSON_PARAM.parameter?.value],
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
