/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TezosNetwork } from "@airgap/tezos";
import {
  ContractMethod,
  ContractProvider,
  MANAGER_LAMBDA,
  TransferParams,
} from "@taquito/taquito";
import axios from "axios";
import { mockContract } from "../mocks/factories";
import { fakeTezosUtils } from "../mocks/fakeTezosUtils";
import { ghotnetThezard } from "../mocks/nftTokens";
import { publicKeys2, publicKeys3 } from "../mocks/publicKeys";
import { makeLamba } from "./multisigUtils";

jest.mock("axios");
// Originated multisig contract
const multisigContract = "KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm";

const fakeGet = axios.get as jest.Mock;

const MOCK_FA2_MICHELSON_PARAM = {
  parameter: {
    value: [{ prim: "mock" }],
    entrypoint: "specialTransfer",
  },
  to: "",
  amount: 0,
} as TransferParams;

const MOCK_FA12_MICHELSON_PARAM = {
  parameter: {
    value: [{ prim: "mock" }],
    entrypoint: "specialFa1Transfer",
  },
  to: "",
  amount: 0,
} as TransferParams;

const MOCK_RPC_PARAM_INFO = { mock: "rpcInfo" };

beforeEach(() => {
  fakeGet.mockResolvedValue({ data: MOCK_RPC_PARAM_INFO });
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

    const result = await makeLamba(
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

    // For good measure test that we get the same result as the lambda generated with Taquito
    const lambdaWithTaquito = MANAGER_LAMBDA.transferImplicit(
      publicKeys3.pkh,
      Number(MUTEZ_AMOUNT)
    );

    expect(lambdaWithTaquito).toEqual(result);

    expect(result).toEqual(expected);
  });

  test("batch of tez transactions", async () => {
    const MUTEZ_AMOUNT_1 = "652421";
    const MUTEZ_AMOUNT_2 = "652422";

    const result = await makeLamba(
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
    const result = await makeLamba(
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
    const result = await makeLamba(
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
        args: [
          { prim: "address" },
          { string: `${mockContract(0)}%specialTransfer` },
        ],
        prim: "PUSH",
      },
      { args: [MOCK_RPC_PARAM_INFO], prim: "CONTRACT" },
      {
        args: [
          [{ prim: "UNIT" }, { prim: "FAILWITH" }],
          [
            { args: [{ prim: "mutez" }, { int: AMOUNT }], prim: "PUSH" },
            {
              args: [
                MOCK_RPC_PARAM_INFO,
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
    const result = await makeLamba(
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
        args: [
          { prim: "address" },
          { string: mockContract(0) + "%specialFa1Transfer" },
        ],
        prim: "PUSH",
      },
      { args: [{ mock: "rpcInfo" }], prim: "CONTRACT" },
      {
        args: [
          [{ prim: "UNIT" }, { prim: "FAILWITH" }],
          [
            { args: [{ prim: "mutez" }, { int: AMOUNT }], prim: "PUSH" },
            {
              args: [
                MOCK_RPC_PARAM_INFO,
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
    const result = await makeLamba(
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
      { string: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob%specialTransfer" },
    ],
    prim: "PUSH",
  },
  { args: [{ mock: "rpcInfo" }], prim: "CONTRACT" },
  {
    args: [
      [{ prim: "UNIT" }, { prim: "FAILWITH" }],
      [
        { args: [{ prim: "mutez" }, { int: "1" }], prim: "PUSH" },
        {
          args: [
            MOCK_RPC_PARAM_INFO,
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
