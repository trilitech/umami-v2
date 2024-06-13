import {
  accountsGet,
  blocksGet,
  operationsGetDelegations,
  operationsGetOriginations,
  operationsGetTransactions,
  quotesGetLast,
  tokensGetTokenBalances,
  tokensGetTokenTransfers,
} from "@tzkt/sdk-api";
import { sortBy } from "lodash";

import {
  getAccounts,
  getCombinedOperations,
  getDelegations,
  getLatestBlock,
  getOriginations,
  getRelatedTokenTransfers,
  getTezosPriceInUSD,
  getTokenBalances,
  getTokenTransfers,
  getTransactions,
} from "./fetch";
import { mockImplicitAddress } from "../../mocks/factories";
import { DefaultNetworks } from "../../types/Network";

jest.mock("axios");

jest.mock("@tzkt/sdk-api", () => ({
  tokensGetTokenBalances: jest.fn(),
  operationsGetTransactions: jest.fn(),
  operationsGetDelegations: jest.fn(),
  operationsGetOriginations: jest.fn(),
  tokensGetTokenTransfers: jest.fn(),
  accountsGet: jest.fn(),
  quotesGetLast: jest.fn(),
  blocksGet: jest.fn(),
}));

describe("tezos utils fetch", () => {
  describe.each(DefaultNetworks)("on $name", network => {
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

    test("getRelatedTokenTransfers", async () => {
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

    test("getLatestBlock", async () => {
      jest.mocked(blocksGet).mockResolvedValue([{ level: 123, cycle: 5 }]);

      const res = await getLatestBlock(network);

      expect(res).toEqual({ level: 123, cycle: 5 });
    });

    test("getAccounts", async () => {
      jest.mocked(accountsGet).mockResolvedValue([]);
      await getAccounts([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network);

      expect(jest.mocked(accountsGet)).toHaveBeenCalledWith(
        {
          address: {
            in: ["tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h,tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf"],
          },
          select: { fields: ["address,balance,delegate,stakedBalance,unstakedBalance"] },
        },
        { baseUrl: network.tzktApiUrl }
      );
    });

    test("getDelegations", async () => {
      jest.mocked(operationsGetDelegations).mockResolvedValue([]);
      await getDelegations([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network, {
        sort: { desc: "id" },
        limit: 100,
        offset: { cr: 123 },
      });

      expect(jest.mocked(operationsGetDelegations)).toHaveBeenCalledWith(
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

      expect(jest.mocked(operationsGetOriginations)).toHaveBeenCalledWith(
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

      expect(jest.mocked(operationsGetTransactions)).toHaveBeenCalledWith(
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

      expect(jest.mocked(tokensGetTokenTransfers)).toHaveBeenCalledWith(
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

    describe("getCombinedOperations", () => {
      beforeEach(() => {
        jest.mocked(operationsGetTransactions).mockResolvedValue([]);
        jest.mocked(operationsGetDelegations).mockResolvedValue([]);
        jest.mocked(operationsGetOriginations).mockResolvedValue([]);
        jest.mocked(tokensGetTokenTransfers).mockResolvedValue([]);
      });

      describe("request options", () => {
        describe("lastId", () => {
          it("uses the provided value", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network, { lastId: 1234 });
            expect(jest.mocked(operationsGetTransactions)).toHaveBeenCalledWith(
              expect.objectContaining({ offset: { cr: 1234 } }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(jest.mocked(operationsGetDelegations)).toHaveBeenCalledWith(
              expect.objectContaining({ offset: { cr: 1234 } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(operationsGetOriginations)).toHaveBeenCalledWith(
              expect.objectContaining({ offset: { cr: 1234 } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(tokensGetTokenTransfers)).toHaveBeenCalledWith(
              expect.objectContaining({ offset: { cr: 1234 } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
          });

          it("doesn't define the offset if none is provided", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network);
            expect(jest.mocked(operationsGetTransactions)).toHaveBeenCalledWith(
              expect.objectContaining({ offset: undefined }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(jest.mocked(operationsGetDelegations)).toHaveBeenCalledWith(
              expect.objectContaining({ offset: undefined }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(operationsGetOriginations)).toHaveBeenCalledWith(
              expect.objectContaining({ offset: undefined }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(tokensGetTokenTransfers)).toHaveBeenCalledWith(
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
            expect(jest.mocked(operationsGetTransactions)).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 123 }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(jest.mocked(operationsGetDelegations)).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 123 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(operationsGetOriginations)).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 123 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );

            expect(jest.mocked(tokensGetTokenTransfers)).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 123 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
          });

          it("defines a default limit if none is provided", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network);
            expect(jest.mocked(operationsGetTransactions)).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 100 }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(jest.mocked(operationsGetDelegations)).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 100 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(operationsGetOriginations)).toHaveBeenCalledWith(
              expect.objectContaining({ limit: 100 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(tokensGetTokenTransfers)).toHaveBeenCalledWith(
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
            expect(jest.mocked(operationsGetTransactions)).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { asc: "id" } }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(jest.mocked(operationsGetDelegations)).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { asc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(operationsGetOriginations)).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { asc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(tokensGetTokenTransfers)).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { asc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
          });

          it("defines a default sort if none is provided", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network);
            expect(jest.mocked(operationsGetTransactions)).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { desc: "id" } }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(jest.mocked(operationsGetDelegations)).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { desc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(operationsGetOriginations)).toHaveBeenCalledWith(
              expect.objectContaining({ sort: { desc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(tokensGetTokenTransfers)).toHaveBeenCalledWith(
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
