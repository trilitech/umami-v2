/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TezosNetwork } from "@airgap/tezos";
import {
  ContractMethod,
  ContractProvider,
  TransferParams,
} from "@taquito/taquito";
import { mockContract } from "../mocks/factories";
import { fakeTezosUtils } from "../mocks/fakeTezosUtils";
import { ghotnetThezard } from "../mocks/nftTokens";
import { publicKeys2, publicKeys3 } from "../mocks/publicKeys";
import {
  FA12_TRANSFER_ARG_TYPES,
  FA2_TRANSFER_ARG_TYPES,
  makeBatchLambda,
} from "./multisigUtils";

jest.mock("axios");
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

describe("Multisig makeLambda", () => {
  test("simple tez transaction", async () => {
    const MUTEZ_AMOUNT = "652423";

    const result = await makeBatchLambda(
      [
        {
          type: "tez",
          amount: MUTEZ_AMOUNT,
          recipient: publicKeys3.pkh,
        },
      ],
      TezosNetwork.GHOSTNET
    );

    const expected = [
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...singleTez(MUTEZ_AMOUNT, publicKeys3.pkh),
    ];

    expect(result).toEqual(expected);
  });

  test("batch of tez transactions", async () => {
    const MUTEZ_AMOUNT_1 = "652421";
    const MUTEZ_AMOUNT_2 = "652422";

    const result = await makeBatchLambda(
      [
        {
          type: "tez",
          amount: MUTEZ_AMOUNT_1,
          recipient: publicKeys3.pkh,
        },
        {
          type: "tez",
          amount: MUTEZ_AMOUNT_2,
          recipient: publicKeys2.pkh,
        },
      ],
      TezosNetwork.GHOSTNET
    );

    const expected = [
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...singleTez(MUTEZ_AMOUNT_1, publicKeys3.pkh),
      ...singleTez(MUTEZ_AMOUNT_2, publicKeys2.pkh),
    ];
    expect(result).toEqual(expected);
  });

  test("single NFT", async () => {
    const result = await makeBatchLambda(
      [
        {
          type: "fa2",
          amount: "1",
          recipient: publicKeys3.pkh,
          contract: ghotnetThezard!.token!.contract!.address!,
          sender: multisigContract,
          tokenId: ghotnetThezard!.token!.tokenId!,
        },
      ],
      TezosNetwork.GHOSTNET
    );

    expect(result).toEqual([
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...thezardSingleLambda,
    ]);
  });

  test("fa2 tokens", async () => {
    const AMOUNT = "4536";
    const MOCK_TOKEN_ID = "7";
    const result = await makeBatchLambda(
      [
        {
          type: "fa2",
          amount: AMOUNT,
          recipient: publicKeys3.pkh,
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
      {
        args: [{ prim: "address" }, { string: `${mockContract(0)}%transfer` }],
        prim: "PUSH",
      },
      { args: [FA2_TRANSFER_ARG_TYPES], prim: "CONTRACT" },
      {
        args: [
          [{ prim: "UNIT" }, { prim: "FAILWITH" }],
          [
            {
              args: [
                FA2_TRANSFER_ARG_TYPES,
                MOCK_FA2_MICHELSON_PARAM.parameter?.value,
              ],
              prim: "PUSH",
            },
            { prim: "TRANSFER_TOKENS" },
            { prim: "CONS" },
          ],
        ],
        prim: "IF_NONE",
      },
    ]);
  });

  test("fa1", async () => {
    const AMOUNT = "4536";
    const result = await makeBatchLambda(
      [
        {
          type: "fa1.2",
          amount: AMOUNT,
          recipient: publicKeys3.pkh,
          contract: mockContract(0),
          sender: multisigContract,
        },
      ],
      TezosNetwork.GHOSTNET
    );

    const expected = [
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      {
        args: [{ prim: "address" }, { string: mockContract(0) + "%transfer" }],
        prim: "PUSH",
      },
      { args: [FA12_TRANSFER_ARG_TYPES], prim: "CONTRACT" },
      {
        args: [
          [{ prim: "UNIT" }, { prim: "FAILWITH" }],
          [
            {
              args: [
                FA12_TRANSFER_ARG_TYPES,
                MOCK_FA12_MICHELSON_PARAM.parameter?.value,
              ],
              prim: "PUSH",
            },
            { prim: "TRANSFER_TOKENS" },
            { prim: "CONS" },
          ],
        ],
        prim: "IF_NONE",
      },
    ];

    expect(result).toEqual(expected);
  });
  test("batch with NFT and tez", async () => {
    const MOCK_TEZ_AMOUNT = "55555";
    const result = await makeBatchLambda(
      [
        { type: "tez", amount: MOCK_TEZ_AMOUNT, recipient: publicKeys2.pkh },

        {
          type: "fa2",
          amount: "1",
          recipient: publicKeys3.pkh,
          contract: ghotnetThezard!.token!.contract!.address!,
          sender: multisigContract,
          tokenId: ghotnetThezard!.token!.tokenId!,
        },
      ],
      TezosNetwork.GHOSTNET
    );

    const expected = [
      { prim: "DROP" },
      { args: [{ prim: "operation" }], prim: "NIL" },
      ...singleTez(MOCK_TEZ_AMOUNT, publicKeys2.pkh),
      ...thezardSingleLambda,
    ];
    expect(result).toEqual(expected);
  });
});

const thezardSingleLambda = [
  {
    args: [
      { prim: "address" },
      { string: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob%transfer" },
    ],
    prim: "PUSH",
  },
  { args: [FA2_TRANSFER_ARG_TYPES], prim: "CONTRACT" },
  {
    args: [
      [{ prim: "UNIT" }, { prim: "FAILWITH" }],
      [
        {
          args: [
            FA2_TRANSFER_ARG_TYPES,
            MOCK_FA2_MICHELSON_PARAM.parameter?.value,
          ],
          prim: "PUSH",
        },
        { prim: "TRANSFER_TOKENS" },
        { prim: "CONS" },
      ],
    ],
    prim: "IF_NONE",
  },
];

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
