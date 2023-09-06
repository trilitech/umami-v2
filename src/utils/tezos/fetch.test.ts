import axios from "axios";
import {
  getAccounts,
  getLastDelegation,
  getTezosPriceInUSD,
  getTezTransfers,
  getTokenBalances,
  getTokenTransfers,
} from "./fetch";
import { operationsGetTransactions, tokensGetTokenTransfers } from "@tzkt/sdk-api";
import { coincapUrl, tzktUrls } from "./consts";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { hedgehoge, tzBtsc } from "../../mocks/fa12Tokens";
import { uUSD } from "../../mocks/fa2Tokens";
import { DefaultNetworks } from "../../types/Network";
jest.mock("axios");

jest.mock("@tzkt/sdk-api", () => {
  return {
    tokensGetTokenBalances: jest.fn(() => {}),
    operationsGetTransactions: jest.fn(() => {}),
    tokensGetTokenTransfers: jest.fn(() => {}),
    operationsGetDelegations: () => Promise.resolve([{ type: "delegation" }]),
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("tezos utils fetch", () => {
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
    DefaultNetworks.forEach(async network => {
      const response = [
        hedgehoge(mockImplicitAddress(0)),
        uUSD(mockImplicitAddress(1)),
        uUSD(mockImplicitAddress(2)),
        tzBtsc(mockContractAddress(0)),
      ];
      mockedAxios.get.mockResolvedValue({ data: response });
      const addresses = [
        mockImplicitAddress(0).pkh,
        mockImplicitAddress(1).pkh,
        mockContractAddress(0).pkh,
      ];
      const res = await getTokenBalances(addresses, network);
      expect(mockedAxios.get).toBeCalledWith(
        `https://api.${network}.tzkt.io/v1/tokens/balances?account.in=${addresses.join(
          ","
        )}&balance.gt=0`
      );

      expect(res).toEqual(response);
    });
  });

  test("getTezTransfers", async () => {
    await getTezTransfers(mockImplicitAddress(0).pkh, "ghostnet");
    expect(operationsGetTransactions).toBeCalledWith(
      {
        anyof: { fields: ["sender", "target"], eq: mockImplicitAddress(0).pkh },
        sort: { desc: "level" },
        limit: 10,
      },
      {
        baseUrl: tzktUrls["ghostnet"],
      }
    );
  });

  test("getTokenTransfers", async () => {
    await getTokenTransfers(mockImplicitAddress(0).pkh, "ghostnet");
    expect(tokensGetTokenTransfers).toBeCalledWith(
      {
        anyof: { fields: ["from", "to"], eq: mockImplicitAddress(0).pkh },
        sort: { desc: "level" },
        limit: 10,
      },
      {
        baseUrl: tzktUrls["ghostnet"],
      }
    );
  });

  test("getLastDelegation", async () => {
    const res = await getLastDelegation(mockImplicitAddress(0).pkh, "ghostnet");
    expect(res).toEqual({ type: "delegation" });
  });

  test("getAccounts", async () => {
    DefaultNetworks.forEach(async network => {
      mockedAxios.get.mockResolvedValue({
        data: [
          { address: mockImplicitAddress(0).pkh, balance: 12345 },
          { address: mockImplicitAddress(1).pkh, balance: 123456 },
        ],
      });
      const addresses = [
        mockImplicitAddress(0).pkh,
        mockImplicitAddress(1).pkh,
        mockContractAddress(0).pkh,
      ];
      const res = await getAccounts(addresses, network);
      expect(mockedAxios.get).toBeCalledWith(
        `https://api.${network}.tzkt.io/v1/accounts?address.in=${addresses.join(
          ","
        )}&select=address,balance`
      );

      expect(res).toEqual([
        { address: mockImplicitAddress(0).pkh, balance: 12345 },
        { address: mockImplicitAddress(1).pkh, balance: 123456 },
      ]);
    });
  });
});
