import { TezosNetwork } from "@airgap/tezos";
import { tezzard } from "../mocks/nfts";
import { publicKeys1, publicKeys2 } from "../mocks/publicKeys";

import {
  estimateBatch,
  estimateFA2transfer,
  transactionValuesToBatchParams,
} from "../utils/tezos";

const pk1 = publicKeys1.pk;
const pkh1 = publicKeys1.pkh;
const pkh2 = publicKeys2.pkh;

describe("Tezos utils", () => {
  describe("Batch", () => {
    test("batchParams are generated correctly for tez, FA2 contracts and delegations", async () => {
      const result = await transactionValuesToBatchParams(
        [
          {
            type: "tez",
            values: {
              amount: 3,
              sender: pkh1,
              recipient: pkh2,
            },
          },
          {
            type: "delegation",
            values: {
              sender: pkh1,
              recipient: pkh2,
            },
          },
          {
            type: "nft",
            data: tezzard,
            values: {
              sender: pkh1,
              recipient: pkh2,
              amount: 1,
            },
          },
        ],
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
      ]);
    });

    describe("Estimations", () => {
      test("FA2 estimation returns the right value", async () => {
        const result = await estimateFA2transfer(
          {
            amount: 1,
            contract: tezzard.contract,
            recipient: pkh2,
            sender: pkh1,
            tokenId: tezzard.tokenId,
          },
          pk1,
          TezosNetwork.GHOSTNET
        );

        expect(result).toHaveProperty("suggestedFeeMutez");
      });

      test("Batch estimation works with batches containg tez, FA2 tokens and delegations on mainnet and ghostnet", async () => {
        const ghostnetResult = await estimateBatch(
          [
            {
              type: "tez",
              values: {
                amount: 1,
                sender: pkh1,
                recipient: pkh2,
              },
            },
            {
              type: "nft",
              data: tezzard,
              values: {
                sender: pkh1,
                recipient: pkh2,
                amount: 1,
              },
            },
          ],
          pkh1,
          pk1,
          TezosNetwork.GHOSTNET
        );

        expect(ghostnetResult[0]).toHaveProperty("suggestedFeeMutez");
        expect(ghostnetResult[1]).toHaveProperty("suggestedFeeMutez");

        const mainnetResult = await estimateBatch(
          [
            {
              type: "tez",
              values: {
                amount: 0.00001,
                sender: pkh1,
                recipient: pkh2,
              },
            },
            {
              type: "delegation",

              values: {
                sender: pkh1,
                recipient: "tz1fXRwGcgoz81Fsksx9L2rVD5wE6CpTMkLz",
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

      test("Batch estimation fails with insuficient funds", async () => {
        let errorMessage;
        try {
          await estimateBatch(
            [
              {
                type: "tez",
                values: {
                  amount: 9999999,
                  sender: pkh1,
                  recipient: pkh2,
                },
              },
              {
                type: "delegation",

                values: {
                  sender: pkh1,
                  recipient: "tz1fXRwGcgoz81Fsksx9L2rVD5wE6CpTMkLz",
                },
              },
            ],
            pkh1,
            pk1,
            TezosNetwork.MAINNET
          );
        } catch (error: any) {
          errorMessage = error.message;
        }

        expect(/tez.subtraction_underflow/i.test(errorMessage)).toEqual(true);
      });
    });
  });
});
