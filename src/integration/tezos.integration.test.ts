import { TezosNetwork } from "@airgap/tezos";
import { OperationValue } from "../components/sendForm/types";
import { toBatchOperation } from "../components/sendForm/utils/toRawOperation";
import { devPublicKeys0, devPublicKeys1 } from "../mocks/devSignerKeys";
import { ghostFA12, ghostFA2, ghostTezzard } from "../mocks/tokens";

import { estimateBatch, operationValuesToBatchParams } from "../utils/tezos";

jest.unmock("../utils/tezos");

const pk0 = devPublicKeys0.pk;
const pkh0 = devPublicKeys0.pkh;
const pkh1 = devPublicKeys1.pkh;

describe("Tezos utils", () => {
  describe("Batch", () => {
    test("batchParams are generated correctly for tez, tez with params, FA1.2, FA2 contracts and delegations", async () => {
      const input: OperationValue[] = [
        {
          type: "tez",
          value: {
            amount: "3",
            sender: pkh0,
            recipient: pkh1,
          },
        },
        {
          type: "tez",

          value: {
            amount: "2",
            sender: pkh0,
            recipient: pkh1,
            parameter: {
              entrypoint: "fulfill_ask",
              value: {
                prim: "Pair",
                args: [{ int: "1232832" }, { prim: "None" }],
              },
            },
          },
        },
        {
          type: "delegation",
          value: {
            sender: pkh0,
            recipient: pkh1,
          },
        },
        {
          type: "token",
          data: ghostTezzard,
          value: {
            sender: pkh0,
            recipient: pkh1,
            amount: "1",
          },
        },
        {
          type: "token",
          data: ghostFA12,
          value: {
            sender: pkh0,
            recipient: pkh1,
            amount: "1",
          },
        },
        {
          type: "token",
          data: ghostFA2,
          value: {
            sender: pkh0,
            recipient: pkh1,
            amount: "2",
          },
        },
      ];

      const result = await operationValuesToBatchParams(
        input.map(toBatchOperation),
        pk0,
        TezosNetwork.GHOSTNET
      );
      expect(result).toEqual([
        {
          amount: 3,
          kind: "transaction",
          mutez: true,
          to: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        },
        {
          amount: 2,
          kind: "transaction",
          to: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
          mutez: true,
          parameter: {
            entrypoint: "fulfill_ask",
            value: {
              prim: "Pair",
              args: [{ int: "1232832" }, { prim: "None" }],
            },
          },
        },
        {
          delegate: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
          kind: "delegation",
          source: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        },
        {
          amount: 0,
          fee: undefined,
          gasLimit: undefined,
          kind: "transaction",
          mutez: false,
          parameter: {
            entrypoint: "transfer",
            value: [
              {
                args: [
                  { string: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
                  [
                    {
                      args: [
                        { string: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6" },
                        { args: [{ int: "6" }, { int: "1" }], prim: "Pair" },
                      ],
                      prim: "Pair",
                    },
                  ],
                ],
                prim: "Pair",
              },
            ],
          },
          source: undefined,
          storageLimit: undefined,
          to: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        },
        {
          amount: 0,
          fee: undefined,
          gasLimit: undefined,
          kind: "transaction",
          mutez: false,
          parameter: {
            entrypoint: "transfer",
            value: {
              args: [
                {
                  string: pkh0,
                },
                {
                  args: [
                    {
                      string: pkh1,
                    },
                    {
                      int: "1",
                    },
                  ],
                  prim: "Pair",
                },
              ],
              prim: "Pair",
            },
          },
          source: undefined,
          storageLimit: undefined,
          to: ghostFA12.contract,
        },

        {
          amount: 0,
          fee: undefined,
          gasLimit: undefined,
          kind: "transaction",
          mutez: false,
          parameter: {
            entrypoint: "transfer",
            value: [
              {
                args: [
                  { string: pkh0 },
                  [
                    {
                      args: [
                        { string: pkh1 },
                        { args: [{ int: "1" }, { int: "2" }], prim: "Pair" },
                      ],
                      prim: "Pair",
                    },
                  ],
                ],
                prim: "Pair",
              },
            ],
          },
          source: undefined,
          storageLimit: undefined,
          to: ghostFA2.contract,
        },
      ]);
    });

    describe("Estimations", () => {
      test("Batch estimation works with batches containg tez, FA1.2 and FA2 tokens on ghostnet", async () => {
        const input: OperationValue[] = [
          {
            type: "tez",
            value: {
              amount: "1",
              sender: pkh0,
              recipient: pkh1,
            },
          },
          {
            type: "token",
            data: ghostTezzard,
            value: {
              sender: pkh0,
              recipient: pkh1,
              amount: "1",
            },
          },
          {
            type: "token",
            data: ghostFA12,
            value: {
              sender: pkh0,
              recipient: pkh1,
              amount: "1",
            },
          },
          {
            type: "token",
            data: ghostFA2,
            value: {
              sender: pkh0,
              recipient: pkh1,
              amount: "1",
            },
          },
        ];

        const ghostnetResult = await estimateBatch(
          input.map(toBatchOperation),
          pkh0,
          pk0,
          TezosNetwork.GHOSTNET
        );

        for (let i = 0; i < ghostnetResult.length; i += 1) {
          expect(ghostnetResult[i]).toHaveProperty("suggestedFeeMutez");
        }
      });

      test("Batch estimation works with batches containg tez on mainnet", async () => {
        const input: OperationValue[] = [
          {
            type: "tez",
            value: {
              amount: "100",
              sender: pkh0,
              recipient: pkh1,
            },
          },
          {
            type: "tez",
            value: {
              amount: "200",
              sender: pkh0,
              recipient: pkh1,
            },
          },
        ];
        const mainnetResult = await estimateBatch(
          input.map(toBatchOperation),
          pkh0,
          pk0,
          TezosNetwork.MAINNET
        );

        expect(mainnetResult).toHaveLength(2);

        expect(mainnetResult[0]).toHaveProperty("suggestedFeeMutez");
        expect(mainnetResult[1]).toHaveProperty("suggestedFeeMutez");
      });

      test("Batch estimation works with batches containing delegations on mainnet", async () => {
        const input: OperationValue[] = [
          {
            type: "delegation",

            value: {
              sender: pkh0,
              recipient: "tz1fXRwGcgoz81Fsksx9L2rVD5wE6CpTMkLz",
            },
          },
        ];
        const mainnetResult = await estimateBatch(
          input.map(toBatchOperation),
          pkh0,
          pk0,
          TezosNetwork.MAINNET
        );

        expect(mainnetResult).toHaveLength(1);

        expect(mainnetResult[0]).toHaveProperty("suggestedFeeMutez");
      });

      test("Batch estimation fails with insuficient funds on mainnet", async () => {
        const input: OperationValue[] = [
          {
            type: "tez",
            value: {
              amount: "9999999",
              sender: pkh0,
              recipient: pkh1,
            },
          },
          {
            type: "delegation",

            value: {
              sender: pkh0,
              recipient: "tz1fXRwGcgoz81Fsksx9L2rVD5wE6CpTMkLz",
            },
          },
        ];
        const estimation = estimateBatch(
          input.map(toBatchOperation),
          pkh0,
          pk0,
          TezosNetwork.MAINNET
        );

        await expect(estimation).rejects.toThrow(/tez.subtraction_underflow/i);
      });
    });
  });
});
