import { TezosNetwork } from "@airgap/tezos";
import { OperationValue } from "../components/sendForm/types";
import { devPublicKeys0, devPublicKeys1 } from "../mocks/devSignerKeys";
import { ghostFA12, ghostFA2, ghostTezzard } from "../mocks/tokens";
import { parseContractPkh, parseImplicitPkh } from "../types/Address";
import { FakeToolkitConfig } from "../types/ToolkitConfig";

import { estimateBatch, operationValuesToBatchParams } from "../utils/tezos";

jest.unmock("../utils/tezos");

const pk0 = devPublicKeys0.pk;
const pkh0 = parseImplicitPkh(devPublicKeys0.pkh);
const pkh1 = parseImplicitPkh(devPublicKeys1.pkh);

const dummySignerConfig0: FakeToolkitConfig = {
  type: "fake",
  pkh: pkh0.pkh,
  pk: pk0,
  network: TezosNetwork.MAINNET,
};

describe("Tezos utils", () => {
  describe("Batch", () => {
    test("batchParams are generated correctly for tez, tez with params, FA1.2, FA2 contracts and delegations", async () => {
      const input: OperationValue[] = [
        {
          type: "tez",
          amount: "3",
          recipient: pkh1,
        },
        {
          type: "tez",

          amount: "2",
          recipient: pkh1,
          parameter: {
            entrypoint: "fulfill_ask",
            value: {
              prim: "Pair",
              args: [{ int: "1232832" }, { prim: "None" }],
            },
          },
        },
        {
          type: "delegation",
          recipient: pkh1,
        },
        {
          type: "fa2",
          data: ghostTezzard,
          sender: pkh0,
          recipient: pkh1,
          amount: "1",
          contract: parseContractPkh(ghostTezzard.contract),
          tokenId: ghostTezzard.tokenId,
        },
        {
          type: "fa1.2",
          data: ghostFA12,
          sender: pkh0,
          recipient: pkh1,
          amount: "1",
          contract: parseContractPkh(ghostFA12.contract),
          tokenId: "0",
        },
        {
          type: "fa2",
          data: ghostFA2,
          sender: pkh0,
          recipient: pkh1,
          amount: "2",
          contract: parseContractPkh(ghostFA2.contract),
          tokenId: ghostFA2.tokenId,
        },
      ];

      const result = await operationValuesToBatchParams(input, dummySignerConfig0);
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
        const ghostnetResult = await estimateBatch(
          [
            {
              type: "tez",
              amount: "1",
              recipient: pkh1,
            },
            {
              type: "fa2",
              data: ghostTezzard,
              sender: pkh0,
              recipient: pkh1,
              amount: "1",
              contract: parseContractPkh(ghostTezzard.contract),
              tokenId: ghostTezzard.tokenId,
            },
            {
              type: "fa1.2",
              data: ghostFA12,
              sender: pkh0,
              recipient: pkh1,
              amount: "1",
              contract: parseContractPkh(ghostFA12.contract),
              tokenId: "0",
            },
            {
              type: "fa2",
              data: ghostFA2,
              sender: pkh0,
              recipient: pkh1,
              amount: "1",
              contract: parseContractPkh(ghostFA2.contract),
              tokenId: ghostFA2.tokenId,
            },
          ],
          { ...dummySignerConfig0, network: TezosNetwork.GHOSTNET }
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
              amount: "100",
              recipient: pkh1,
            },
            {
              type: "tez",
              amount: "200",
              recipient: pkh1,
            },
          ],
          dummySignerConfig0
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
              recipient: parseImplicitPkh("tz1fXRwGcgoz81Fsksx9L2rVD5wE6CpTMkLz"),
            },
          ],

          dummySignerConfig0
        );

        expect(mainnetResult).toHaveLength(1);

        expect(mainnetResult[0]).toHaveProperty("suggestedFeeMutez");
      });

      test("Batch estimation fails with insuficient funds on mainnet", async () => {
        const estimation = estimateBatch(
          [
            {
              type: "tez",
              amount: "9999999",
              recipient: pkh1,
            },
            {
              type: "delegation",

              recipient: parseImplicitPkh("tz1fXRwGcgoz81Fsksx9L2rVD5wE6CpTMkLz"),
            },
          ],
          dummySignerConfig0
        );

        await expect(estimation).rejects.toThrow(/tez.subtraction_underflow/i);
      });
    });
  });
});
