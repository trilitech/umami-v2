import {
  blocksGet,
  operationsGetByHash,
  operationsGetDelegations,
  operationsGetOriginations,
  operationsGetTransactions,
  quotesGetLast,
  tokensGetTokenBalances,
  tokensGetTokenTransfers,
} from "@tzkt/sdk-api";
import { DefaultNetworks, mockImplicitAddress } from "@umami/tezos";
import { sortBy } from "lodash";

import {
  getAccounts,
  getCombinedOperations,
  getDelegations,
  getLatestBlock,
  getOperationsByHash,
  getOriginations,
  getRelatedTokenTransfers,
  getStakingOperations,
  getTezosPriceInUSD,
  getTokenBalances,
  getTokenTransfers,
  getTransactions,
} from "./fetch";

jest.mock("@tzkt/sdk-api", () => ({
  tokensGetTokenBalances: jest.fn(),
  operationsGetTransactions: jest.fn(),
  operationsGetDelegations: jest.fn(),
  operationsGetOriginations: jest.fn(),
  tokensGetTokenTransfers: jest.fn(),
  quotesGetLast: jest.fn(),
  blocksGet: jest.fn(),
  operationsGetByHash: jest.fn(),
}));

describe("tezos utils fetch", () => {
  describe.each([DefaultNetworks[0]])("on $name", network => {
    test("getTezosPriceInUSD", async () => {
      jest.mocked(quotesGetLast).mockResolvedValue({ usd: 1000000 });

      await expect(getTezosPriceInUSD()).resolves.toBe(1000000);

      expect(quotesGetLast).toHaveBeenCalledTimes(1);
    });

    test("getTokenBalances", async () => {
      jest.mocked(tokensGetTokenBalances).mockResolvedValue([]);
      await getTokenBalances([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network);
      expect(tokensGetTokenBalances).toHaveBeenCalledWith(
        {
          account: { in: [`${mockImplicitAddress(0).pkh},${mockImplicitAddress(1).pkh}`] },
          balance: { gt: "0" },
          limit: 10000,
        },
        {
          baseUrl: network.tzktApiUrl,
        }
      );
    });

    describe("getRelatedTokenTransfers", () => {
      it("doesn't call API if the transactionsIds is empty", async () => {
        jest.mocked(tokensGetTokenTransfers);
        expect(await getRelatedTokenTransfers([], network)).toEqual([]);
        expect(tokensGetTokenTransfers).not.toHaveBeenCalled();
      });

      it("calls tokensGetTokenTransfers", async () => {
        jest.mocked(tokensGetTokenTransfers).mockResolvedValue([]);
        await getRelatedTokenTransfers([1, 2, 3], network);
        expect(tokensGetTokenTransfers).toHaveBeenCalledWith(
          {
            transactionId: { in: ["1,2,3"] },
          },
          {
            baseUrl: network.tzktApiUrl,
          }
        );
      });
    });

    test("getLatestBlock", async () => {
      jest.mocked(blocksGet).mockResolvedValue([{ level: 123, cycle: 5 }]);

      const res = await getLatestBlock(network);

      expect(res).toEqual({ level: 123, cycle: 5 });
    });

    test("getAccounts", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        json: () => Promise.resolve([]),
      } as Response);
      await getAccounts([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network);

      expect(fetch).toHaveBeenCalledWith(
        `${network.tzktApiUrl}/v1/accounts?address.in=tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h%2Ctz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf` +
          "&select.fields=address%2Cbalance%2Cdelegate%2CstakedBalance%2CunstakedBalance%2CrollupBonds%2CsmartRollupBonds"
      );
    });

    test("getStakingOperations", async () => {
      jest.spyOn(global, "fetch").mockResolvedValue({
        json: () =>
          Promise.resolve([
            {
              type: "staking",
              id: 287926408708096,
              level: 6077470,
              action: "staked",
            },

            {
              type: "staking",
              id: 287926408708096,
              level: 6077470,
              action: "unstaked",
            },

            {
              type: "staking",
              id: 287926408708096,
              level: 6077470,
              action: "finalized",
            },
          ]),
      } as Response);

      const result = await getStakingOperations(
        [mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh],
        network,
        { limit: 100, offset: { cr: 1 }, sort: { asc: "id" } }
      );

      expect(fetch).toHaveBeenCalledWith(
        `${network.tzktApiUrl}/v1/operations/staking?limit=100` +
          "&sender.in=tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h%2Ctz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf&sort.asc=id&offset.cr=1"
      );

      expect(result).toEqual([
        {
          id: 287926408708096,
          level: 6077470,
          action: "staked",
          type: "staked",
        },

        {
          id: 287926408708096,
          level: 6077470,
          action: "unstaked",
          type: "unstaked",
        },

        {
          id: 287926408708096,
          level: 6077470,
          action: "finalized",
          type: "finalized",
        },
      ]);
    });

    test("getDelegations", async () => {
      jest.mocked(operationsGetDelegations).mockResolvedValue([]);
      await getDelegations([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network, {
        sort: { desc: "id" },
        limit: 100,
        offset: { cr: 123 },
      });

      expect(operationsGetDelegations).toHaveBeenCalledWith(
        {
          offset: { cr: 123 },
          limit: 100,
          sender: {
            in: ["tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h,tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf"],
          },
          sort: { desc: "id" },
        },
        { baseUrl: network.tzktApiUrl }
      );
    });

    test("getOriginations", async () => {
      jest.mocked(operationsGetOriginations).mockResolvedValue([]);
      await getOriginations([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network, {
        sort: { asc: "id" },
        limit: 100,
        offset: { cr: 123 },
      });

      expect(operationsGetOriginations).toHaveBeenCalledWith(
        {
          offset: { cr: 123 },
          limit: 100,
          sender: {
            in: ["tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h,tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf"],
          },
          sort: { asc: "id" },
        },
        { baseUrl: network.tzktApiUrl }
      );
    });

    test("getTransactions", async () => {
      jest.mocked(operationsGetTransactions).mockResolvedValue([]);
      await getTransactions([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network, {
        sort: { asc: "id" },
        limit: 100,
        offset: { cr: 123 },
      });

      expect(operationsGetTransactions).toHaveBeenCalledWith(
        {
          offset: { cr: 123 },
          limit: 100,
          anyof: {
            fields: ["sender", "target", "initiator"],
            in: ["tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h,tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf"],
          },
          sort: { asc: "id" },
        },
        { baseUrl: network.tzktApiUrl }
      );
    });

    test("getTokenTransfers", async () => {
      jest.mocked(tokensGetTokenTransfers).mockResolvedValue([]);
      await getTokenTransfers([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network, {
        sort: { asc: "id" },
        limit: 100,
        offset: { cr: 123 },
      });

      expect(tokensGetTokenTransfers).toHaveBeenCalledWith(
        {
          offset: { cr: 123 },
          limit: 100,
          anyof: {
            fields: ["from", "to"],
            in: ["tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h,tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf"],
          },
          sort: { asc: "id" },
        },
        { baseUrl: network.tzktApiUrl }
      );
    });

    it("getOperationsByHash", async () => {
      jest.mocked(operationsGetByHash).mockResolvedValue([]);
      await getOperationsByHash("hash1", network);
      expect(operationsGetByHash).toHaveBeenCalledWith(
        "hash1",
        {},
        { baseUrl: network.tzktApiUrl }
      );
    });

    describe("getCombinedOperations", () => {
      beforeEach(() => {
        jest.mocked(operationsGetTransactions).mockResolvedValue([]);
        jest.mocked(operationsGetDelegations).mockResolvedValue([]);
        jest.mocked(operationsGetOriginations).mockResolvedValue([]);
        jest.mocked(tokensGetTokenTransfers).mockResolvedValue([]);
        jest
          .spyOn(global, "fetch")
          .mockResolvedValue({ json: () => Promise.resolve([]) } as Response);
      });

      describe("request options", () => {
        describe("lastId", () => {
          it("uses the provided value", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network, { lastId: 1234 });
            expect(operationsGetTransactions).toHaveBeenCalledWith(
              expect.objectContaining({ offset: { cr: 1234 } }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(operationsGetDelegations).toHaveBeenCalledWith(
              expect.objectContaining({ offset: { cr: 1234 } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(operationsGetOriginations).toHaveBeenCalledWith(
              expect.objectContaining({ offset: { cr: 1234 } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(tokensGetTokenTransfers).toHaveBeenCalledWith(
              expect.objectContaining({ offset: { cr: 1234 } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
          });

          it("doesn't define the offset if none is provided", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network);
            expect(operationsGetTransactions).toHaveBeenCalledWith(
              expect.objectContaining({ offset: undefined }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(operationsGetDelegations).toHaveBeenCalledWith(
              expect.objectContaining({ offset: undefined }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(operationsGetOriginations).toHaveBeenCalledWith(
              expect.objectContaining({ offset: undefined }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(tokensGetTokenTransfers).toHaveBeenCalledWith(
              expect.objectContaining({ offset: undefined }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
          });
        });

        describe("limit", () => {
          it("uses the provided value", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network, { limit: 123 });
            expect(operationsGetTransactions).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 123 }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(operationsGetDelegations).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 123 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(operationsGetOriginations).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 123 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );

            expect(tokensGetTokenTransfers).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 123 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
          });

          it("defines a default limit if none is provided", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network);
            expect(operationsGetTransactions).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 100 }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(operationsGetDelegations).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 100 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(operationsGetOriginations).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 100 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(tokensGetTokenTransfers).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 100 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
          });
        });

        describe("sort", () => {
          it("uses the provided value", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network, { sort: "asc" });
            expect(operationsGetTransactions).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { asc: "id" } }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(operationsGetDelegations).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { asc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(operationsGetOriginations).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { asc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(tokensGetTokenTransfers).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { asc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
          });

          it("defines a default sort if none is provided", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network);
            expect(operationsGetTransactions).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { desc: "id" } }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(operationsGetDelegations).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { desc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(operationsGetOriginations).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { desc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(tokensGetTokenTransfers).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { desc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
          });
        });
      });

      it("always returns the provided limit at most", async () => {
        const operations = [];
        for (let i = 11; i > 0; i--) {
          operations.push({ id: i });
        }
        jest.mocked(operationsGetTransactions).mockResolvedValue([]);
        jest.mocked(operationsGetDelegations).mockResolvedValue([]);
        jest.mocked(tokensGetTokenTransfers).mockResolvedValue([]);
        jest.mocked(operationsGetOriginations).mockResolvedValue(operations as any);

        const res = await getCombinedOperations([mockImplicitAddress(0).pkh], network, {
          limit: 5,
        });
        expect(res).toEqual(operations.slice(0, 5));

        const res2 = await getCombinedOperations([mockImplicitAddress(0).pkh], network, {
          limit: 11,
        });
        expect(res2).toEqual(operations);
      });

      describe("responses alignment", () => {
        test("the most recent records come from one source", async () => {
          const delegations = [{ id: 1 }, { id: 2 }, { id: 3 }];
          const originations = [{ id: 4 }, { id: 5 }, { id: 6 }];
          const transactions = [{ id: 7 }, { id: 8 }, { id: 10 }];
          const tokenTransfers = [{ id: 9 }, { id: 11 }];

          jest.mocked(operationsGetTransactions).mockResolvedValue(transactions as any);
          jest.mocked(operationsGetDelegations).mockResolvedValue(delegations as any);
          jest.mocked(operationsGetOriginations).mockResolvedValue(originations as any);
          jest.mocked(tokensGetTokenTransfers).mockResolvedValue(tokenTransfers as any);

          const res = await getCombinedOperations([mockImplicitAddress(0).pkh], network, {
            limit: 3,
          });
          expect(res).toEqual([
            { id: 11, type: "token_transfer" },
            { id: 10 },
            { id: 9, type: "token_transfer" },
          ]);
        });

        test("results are interleaved", async () => {
          const delegations = [{ id: 1 }, { id: 21 }, { id: 51 }];
          const originations = [{ id: 2 }, { id: 55 }];
          const transactions = [{ id: 5 }, { id: 8 }];
          const tokenTransfers = [{ id: 15 }, { id: 4 }];

          jest.mocked(operationsGetTransactions).mockResolvedValue(transactions as any);
          jest.mocked(operationsGetDelegations).mockResolvedValue(delegations as any);
          jest.mocked(operationsGetOriginations).mockResolvedValue(originations as any);
          jest.mocked(tokensGetTokenTransfers).mockResolvedValue(tokenTransfers as any);

          const res = await getCombinedOperations([mockImplicitAddress(0).pkh], network, {
            limit: 5,
          });
          expect(res).toEqual([
            { id: 55 },
            { id: 51 },
            { id: 21 },
            { id: 15, type: "token_transfer" },
            { id: 8 },
          ]);

          const res2 = await getCombinedOperations([mockImplicitAddress(0).pkh], network, {
            limit: 500,
          });
          expect(res2).toEqual(
            sortBy(
              [
                ...originations,
                ...delegations,
                ...transactions,
                ...[
                  { id: 15, type: "token_transfer" },
                  { id: 4, type: "token_transfer" },
                ],
              ],
              o => -o.id
            )
          );
        });

        test("with ascending sort", async () => {
          const delegations = [{ id: 1 }, { id: 21 }, { id: 51 }];
          const originations = [{ id: 2 }, { id: 4 }, { id: 55 }];
          const transactions = [{ id: 5 }, { id: 8 }, { id: 15 }];
          const tokenTransfers = [{ id: 0 }, { id: 88 }];

          jest.mocked(operationsGetTransactions).mockResolvedValue(transactions as any);
          jest.mocked(operationsGetDelegations).mockResolvedValue(delegations as any);
          jest.mocked(operationsGetOriginations).mockResolvedValue(originations as any);
          jest.mocked(tokensGetTokenTransfers).mockResolvedValue(tokenTransfers as any);

          const res = await getCombinedOperations([mockImplicitAddress(0).pkh], network, {
            limit: 5,
            sort: "asc",
          });
          expect(res).toEqual([
            { id: 0, type: "token_transfer" },
            { id: 1 },
            { id: 2 },
            { id: 4 },
            { id: 5 },
          ]);

          const res2 = await getCombinedOperations([mockImplicitAddress(0).pkh], network, {
            limit: 500,
            sort: "asc",
          });
          expect(res2).toEqual(
            sortBy(
              [
                { id: 0, type: "token_transfer" },
                { id: 88, type: "token_transfer" },
                ...originations,
                ...delegations,
                ...transactions,
              ],
              o => o.id
            )
          );
        });
      });
    });
  });
});
