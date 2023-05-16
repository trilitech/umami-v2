import { TezosNetwork } from "@airgap/tezos";
import { OperationValue } from "../components/sendForm/types";
import { publicKeys1, publicKeys2 } from "../mocks/publicKeys";
import {
  ghostFA12,
  ghostFA12WithOwner,
  ghostFA2,
  ghostTezzard,
} from "../mocks/tokens";

import {
  estimateBatch,
  estimateFA12transfer,
  estimateFA2transfer,
  operationValuesToBatchParams,
} from "../utils/tezos";
import { BigNumber } from "bignumber.js";

const pk1 = publicKeys1.pk;
const pkh1 = publicKeys1.pkh;
const pkh2 = publicKeys2.pkh;

describe("Tezos utils", () => {
  describe("Batch", () => {
    test("batchParams are generated correctly for tez, tez with params, FA1.2, FA2 contracts and delegations", async () => {
      const input: OperationValue[] = [
        {
          type: "tez",
          value: {
            amount: new BigNumber(3),
            sender: pkh1,
            recipient: pkh2,
          },
        },
        {
          type: "tez",
          value: {
            amount: new BigNumber(2),
            sender: pkh1,
            recipient: pkh2,
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
            sender: pkh1,
            recipient: pkh2,
          },
        },
        {
          type: "token",
          data: ghostTezzard,
          value: {
            sender: pkh1,
            recipient: pkh2,
            amount: new BigNumber(1),
          },
        },
        {
          type: "token",
          data: ghostFA12,
          value: {
            sender: pkh1,
            recipient: pkh2,
            amount: new BigNumber(1),
          },
        },
        {
          type: "token",
          data: ghostFA2,
          value: {
            sender: pkh1,
            recipient: pkh2,
            amount: new BigNumber(2),
          },
        },
      ];

      const result = await operationValuesToBatchParams(
        input,
        pk1,
        TezosNetwork.GHOSTNET
      );
      expect(result).toEqual([
        {
          amount: 3,
          kind: "transaction",
          to: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        },
        {
          amount: 2,
          kind: "transaction",
          to: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
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
                  string: pkh1,
                },
                {
                  args: [
                    {
                      string: pkh2,
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
                  { string: pkh1 },
                  [
                    {
                      args: [
                        { string: pkh2 },
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
      test("FA2 estimation returns the right value on ghostnet", async () => {
        const result = await estimateFA2transfer(
          {
            amount: new BigNumber(1),
            contract: ghostTezzard.contract,
            recipient: pkh2,
            sender: pkh1,
            tokenId: ghostTezzard.tokenId,
          },
          pk1,
          TezosNetwork.GHOSTNET
        );

        expect(result).toHaveProperty("suggestedFeeMutez");
      });

      test("FA12 estimation returns the right value on ghostnet", async () => {
        const result = await estimateFA12transfer(
          {
            amount: new BigNumber(1),
            contract: ghostFA12WithOwner.contract,
            recipient: pkh2,
            sender: ghostFA12WithOwner.owner,
          },
          "TEST_PK",
          TezosNetwork.GHOSTNET
        );

        expect(result).toHaveProperty("suggestedFeeMutez");
      });

      test("Batch estimation works with batches containg tez, FA1.2 and FA2 tokens on ghostnet", async () => {
        const ghostnetResult = await estimateBatch(
          [
            {
              type: "tez",
              value: {
                amount: new BigNumber(1),
                sender: pkh1,
                recipient: pkh2,
              },
            },
            {
              type: "token",
              data: ghostTezzard,
              value: {
                sender: pkh1,
                recipient: pkh2,
                amount: new BigNumber(1),
              },
            },
            {
              type: "token",
              data: ghostFA12,
              value: {
                sender: pkh1,
                recipient: pkh2,
                amount: new BigNumber(1),
              },
            },
            {
              type: "token",
              data: ghostFA2,
              value: {
                sender: pkh1,
                recipient: pkh2,
                amount: new BigNumber(1),
              },
            },
          ],
          pkh1,
          pk1,
          TezosNetwork.GHOSTNET
        );

        for (let i = 0; i < ghostnetResult.length; i += 1) {
          expect(ghostnetResult[i]).toHaveProperty("suggestedFeeMutez");
        }
      });

      test("Batch estimation works with batches containg tez on mainnet", async () => {
        const mainnetResult = await estimateBatch(
          [
            {
              type: "tez",
              value: {
                amount: new BigNumber(0.0001),
                sender: pkh1,
                recipient: pkh2,
              },
            },
            {
              type: "tez",
              value: {
                amount: new BigNumber(0.0002),
                sender: pkh1,
                recipient: pkh2,
              },
            },
          ],
          pkh1,
          pk1,
          TezosNetwork.MAINNET
        );

        expect(mainnetResult).toHaveLength(2);

        expect(mainnetResult[0]).toHaveProperty("suggestedFeeMutez");
        expect(mainnetResult[1]).toHaveProperty("suggestedFeeMutez");
      });

      test("Batch estimation works with batches containing delegations on mainnet", async () => {
        const mainnetResult = await estimateBatch(
          [
            {
              type: "delegation",

              value: {
                sender: pkh1,
                recipient: "tz1fXRwGcgoz81Fsksx9L2rVD5wE6CpTMkLz",
              },
            },
          ],
          pkh1,
          pk1,
          TezosNetwork.MAINNET
        );

        expect(mainnetResult).toHaveLength(1);

        expect(mainnetResult[0]).toHaveProperty("suggestedFeeMutez");
      });

      test("Batch estimation fails with insuficient funds on mainnet", async () => {
        const estimation = estimateBatch(
          [
            {
              type: "tez",
              value: {
                amount: new BigNumber(9999999),
                sender: pkh1,
                recipient: pkh2,
              },
            },
            {
              type: "delegation",

              value: {
                sender: pkh1,
                recipient: "tz1fXRwGcgoz81Fsksx9L2rVD5wE6CpTMkLz",
              },
            },
          ],
          pkh1,
          pk1,
          TezosNetwork.MAINNET
        );

        await expect(estimation).rejects.toThrow(/tez.subtraction_underflow/i);
      });
    });
  });

  describe("Single transfers", () => {
    test("FA2 estimation returns the right value on ghostnet", async () => {
      const result = await estimateFA2transfer(
        {
          amount: new BigNumber(1),
          contract: ghostTezzard.contract,
          recipient: pkh2,
          sender: pkh1,
          tokenId: ghostTezzard.tokenId,
        },
        pk1,
        TezosNetwork.GHOSTNET
      );

      expect(result).toHaveProperty("suggestedFeeMutez");
    });
  });
});
