import axios from "axios";
import {
  getAccounts,
  getCombinedOperations,
  getDelegations,
  getLastDelegation,
  getOriginations,
  getTezosPriceInUSD,
  getTezTransfers,
  getTokenBalances,
  getTokenTransfers,
  getTransactions,
} from "./fetch";
import {
  accountsGet,
  operationsGetDelegations,
  operationsGetOriginations,
  operationsGetTransactions,
  tokensGetTokenBalances,
  tokensGetTokenTransfers,
} from "@tzkt/sdk-api";
import { coincapUrl } from "./consts";
import { mockImplicitAddress } from "../../mocks/factories";
import { DefaultNetworks } from "../../types/Network";
import { sortBy } from "lodash";
jest.mock("axios");

jest.mock("@tzkt/sdk-api", () => {
  return {
    tokensGetTokenBalances: jest.fn(),
    operationsGetTransactions: jest.fn(),
    operationsGetDelegations: jest.fn(),
    operationsGetOriginations: jest.fn(),
    tokensGetTokenTransfers: jest.fn(),
    accountsGet: jest.fn(),
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("tezos utils fetch", () => {
  describe.each(DefaultNetworks)("on $name", network => {
    test("getTezosPriceInUSD", async () => {
      const mockResponse = {
        data: {
          data: {
            id: "tezos",
            rank: "45",
            symbol: "XTZ",
            name: "Tezos",
            supply: "934953037.6018340000000000",
            maxSupply: null,
            marketCapUsd: "973524588.0822762611894168",
            volumeUsd24Hr: "11804202.6168944408092813",
            priceUsd: "1.0412550672912714",
            changePercent24Hr: "-1.7557594377565521",
            vwap24Hr: "1.0421183688213239",
            explorer: "https://tzkt.io/",
          },
        },
      };
      mockedAxios.get.mockResolvedValue(mockResponse);
      const result = await getTezosPriceInUSD();
      expect(mockedAxios.get).toBeCalledWith(`${coincapUrl}/tezos`);
      expect(result).toEqual(mockResponse.data.data.priceUsd);
    });

    test("getTokenBalances", async () => {
      await getTokenBalances([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network);
      expect(tokensGetTokenBalances).toBeCalledWith(
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

    test("getTezTransfers", async () => {
      await getTezTransfers(mockImplicitAddress(0).pkh, network);
      expect(operationsGetTransactions).toBeCalledWith(
        {
          anyof: { fields: ["sender", "target"], eq: mockImplicitAddress(0).pkh },
          sort: { desc: "level" },
          limit: 10,
        },
        {
          baseUrl: network.tzktApiUrl,
        }
      );
    });

    test("getTokenTransfers", async () => {
      await getTokenTransfers([1, 2, 3], network);
      expect(tokensGetTokenTransfers).toBeCalledWith(
        {
          transactionId: { in: ["1,2,3"] },
        },
        {
          baseUrl: network.tzktApiUrl,
        }
      );
    });

    test("getLastDelegation", async () => {
      jest.mocked(operationsGetDelegations).mockResolvedValue([
        { id: 2, type: "delegation" },
        { id: 1, type: "delegation" },
      ]);
      const res = await getLastDelegation(mockImplicitAddress(0).pkh, network);

      expect(res).toEqual({ id: 2, type: "delegation" });
    });

    test("getAccounts", async () => {
      await getAccounts([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network);

      expect(jest.mocked(accountsGet)).toBeCalledWith(
        {
          address: {
            in: ["tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h,tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf"],
          },
          select: { fields: ["address,balance,delegationLevel"] },
        },
        { baseUrl: network.tzktApiUrl }
      );
    });

    test("getDelegations", async () => {
      await getDelegations([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network, {
        sort: { desc: "id" },
        limit: 100,
        offset: { cr: 123 },
      });

      expect(jest.mocked(operationsGetDelegations)).toBeCalledWith(
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
      await getOriginations([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network, {
        sort: { asc: "id" },
        limit: 100,
        offset: { cr: 123 },
      });

      expect(jest.mocked(operationsGetOriginations)).toBeCalledWith(
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
      await getTransactions([mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh], network, {
        sort: { asc: "id" },
        limit: 100,
        offset: { cr: 123 },
      });

      expect(jest.mocked(operationsGetTransactions)).toBeCalledWith(
        {
          offset: { cr: 123 },
          limit: 100,
          anyof: {
            fields: ["sender", "target"],
            in: ["tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h,tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf"],
          },
          sort: { asc: "id" },
        },
        { baseUrl: network.tzktApiUrl }
      );
    });

    describe("getCombinedOperations", () => {
      describe("request options", () => {
        beforeEach(() => {
          jest.mocked(operationsGetTransactions).mockResolvedValue([]);
          jest.mocked(operationsGetDelegations).mockResolvedValue([]);
          jest.mocked(operationsGetOriginations).mockResolvedValue([]);
        });

        describe("lastId", () => {
          it("uses the provided value", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network, { lastId: 1234 });
            expect(jest.mocked(operationsGetTransactions)).toBeCalledWith(
              expect.objectContaining({ offset: { cr: 1234 } }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(jest.mocked(operationsGetDelegations)).toBeCalledWith(
              expect.objectContaining({ offset: { cr: 1234 } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(operationsGetOriginations)).toBeCalledWith(
              expect.objectContaining({ offset: { cr: 1234 } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
          });

          it("doesn't define the offset if none is provided", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network);
            expect(jest.mocked(operationsGetTransactions)).toBeCalledWith(
              expect.objectContaining({ offset: undefined }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(jest.mocked(operationsGetDelegations)).toBeCalledWith(
              expect.objectContaining({ offset: undefined }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(operationsGetOriginations)).toBeCalledWith(
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
            expect(jest.mocked(operationsGetTransactions)).toBeCalledWith(
              expect.objectContaining({ limit: 123 }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(jest.mocked(operationsGetDelegations)).toBeCalledWith(
              expect.objectContaining({ limit: 123 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(operationsGetOriginations)).toBeCalledWith(
              expect.objectContaining({ limit: 123 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
          });

          it("defines a default limit if none is provided", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network);
            expect(jest.mocked(operationsGetTransactions)).toBeCalledWith(
              expect.objectContaining({ limit: 100 }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(jest.mocked(operationsGetDelegations)).toBeCalledWith(
              expect.objectContaining({ limit: 100 }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(operationsGetOriginations)).toBeCalledWith(
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
            expect(jest.mocked(operationsGetTransactions)).toBeCalledWith(
              expect.objectContaining({ sort: { asc: "id" } }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(jest.mocked(operationsGetDelegations)).toBeCalledWith(
              expect.objectContaining({ sort: { asc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(operationsGetOriginations)).toBeCalledWith(
              expect.objectContaining({ sort: { asc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
          });

          it("defines a default sort if none is provided", async () => {
            await getCombinedOperations([mockImplicitAddress(0).pkh], network);
            expect(jest.mocked(operationsGetTransactions)).toBeCalledWith(
              expect.objectContaining({ sort: { desc: "id" } }),
              { baseUrl: network.tzktApiUrl }
            );
            expect(jest.mocked(operationsGetDelegations)).toBeCalledWith(
              expect.objectContaining({ sort: { desc: "id" } }),
              {
                baseUrl: network.tzktApiUrl,
              }
            );
            expect(jest.mocked(operationsGetOriginations)).toBeCalledWith(
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
          const transactions = [{ id: 7 }, { id: 8 }, { id: 9 }];

          jest.mocked(operationsGetTransactions).mockResolvedValue(transactions as any);
          jest.mocked(operationsGetDelegations).mockResolvedValue(delegations as any);
          jest.mocked(operationsGetOriginations).mockResolvedValue(originations as any);

          const res = await getCombinedOperations([mockImplicitAddress(0).pkh], network, {
            limit: 3,
          });
          expect(res).toEqual(transactions.reverse());
        });

        test("results are interleaved", async () => {
          const delegations = [{ id: 1 }, { id: 21 }, { id: 51 }];
          const originations = [{ id: 2 }, { id: 4 }, { id: 55 }];
          const transactions = [{ id: 5 }, { id: 8 }, { id: 15 }];

          jest.mocked(operationsGetTransactions).mockResolvedValue(transactions as any);
          jest.mocked(operationsGetDelegations).mockResolvedValue(delegations as any);
          jest.mocked(operationsGetOriginations).mockResolvedValue(originations as any);

          const res = await getCombinedOperations([mockImplicitAddress(0).pkh], network, {
            limit: 5,
          });
          expect(res).toEqual([{ id: 55 }, { id: 51 }, { id: 21 }, { id: 15 }, { id: 8 }]);

          const res2 = await getCombinedOperations([mockImplicitAddress(0).pkh], network, {
            limit: 500,
          });
          expect(res2).toEqual(
            sortBy([...originations, ...delegations, ...transactions], o => -o.id)
          );
        });

        test("with ascending sort", async () => {
          const delegations = [{ id: 1 }, { id: 21 }, { id: 51 }];
          const originations = [{ id: 2 }, { id: 4 }, { id: 55 }];
          const transactions = [{ id: 5 }, { id: 8 }, { id: 15 }];

          jest.mocked(operationsGetTransactions).mockResolvedValue(transactions as any);
          jest.mocked(operationsGetDelegations).mockResolvedValue(delegations as any);
          jest.mocked(operationsGetOriginations).mockResolvedValue(originations as any);

          const res = await getCombinedOperations([mockImplicitAddress(0).pkh], network, {
            limit: 5,
            sort: "asc",
          });
          expect(res).toEqual([{ id: 1 }, { id: 2 }, { id: 4 }, { id: 5 }, { id: 8 }]);

          const res2 = await getCombinedOperations([mockImplicitAddress(0).pkh], network, {
            limit: 500,
            sort: "asc",
          });
          expect(res2).toEqual(
            sortBy([...originations, ...delegations, ...transactions], o => o.id)
          );
        });
      });
    });
  });
});
