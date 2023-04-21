import axios from "axios";
import {
  getBakers,
  getLastDelegation,
  getTezosPriceInUSD,
  getTezTransfers,
  getTokens,
  getTokenTransfers,
} from "./fetch";
import {
  tokensGetTokenBalances,
  operationsGetTransactions,
  tokensGetTokenTransfers,
} from "@tzkt/sdk-api";
import { bakersUrl, coincapUrl, tzktUrls } from "./consts";
import { mockPkh } from "../../mocks/factories";
import { TezosNetwork } from "@airgap/tezos";
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
  test("getBakers", async () => {
    const mockResponse = {
      data: [
        {
          address: "tz1gfArv665EUkSg2ojMBzcbfwuPxAvqPvjo",
          name: "Kraken Baker",
          logo: "https://services.tzkt.io/v1/avatars/tz1gfArv665EUkSg2ojMBzcbfwuPxAvqPvjo",
          balance: 7011211.558821,
          stakingBalance: 20857605.698361,
          stakingCapacity: 70112115.58821,
          maxStakingBalance: 70112115.58821,
          freeSpace: 49254509.88984901,
          fee: 0,
          minDelegation: 0,
          payoutDelay: 6,
          payoutPeriod: 1,
          openForDelegation: true,
          estimatedRoi: 0.055,
          serviceType: "exchange",
          serviceHealth: "active",
          payoutTiming: "no_data",
          payoutAccuracy: "no_data",
          insuranceCoverage: 0,
        },
      ],
    };
    mockedAxios.get.mockResolvedValue(mockResponse);
    const result = await getBakers();
    expect(mockedAxios.get).toBeCalledWith(bakersUrl);
    expect(result).toEqual(mockResponse.data);
  });

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

  test("getTokens", async () => {
    await getTokens(mockPkh(0), TezosNetwork.GHOSTNET);
    expect(tokensGetTokenBalances).toBeCalledWith(
      {
        account: { eq: mockPkh(0) },
      },
      { baseUrl: tzktUrls[TezosNetwork.GHOSTNET] }
    );
  });

  test("getTezTransfers", async () => {
    await getTezTransfers(mockPkh(0), TezosNetwork.GHOSTNET);
    expect(operationsGetTransactions).toBeCalledWith(
      {
        anyof: { fields: ["sender", "target"], eq: mockPkh(0) },
        sort: { desc: "level" },
        limit: 10,
      },
      {
        baseUrl: tzktUrls[TezosNetwork.GHOSTNET],
      }
    );
  });

  test("getTokenTransfers", async () => {
    await getTokenTransfers(mockPkh(0), TezosNetwork.GHOSTNET);
    expect(tokensGetTokenTransfers).toBeCalledWith(
      {
        anyof: { fields: ["from", "to"], eq: mockPkh(0) },
        sort: { desc: "level" },
        limit: 10,
      },
      {
        baseUrl: tzktUrls[TezosNetwork.GHOSTNET],
      }
    );
  });

  test("getLastDelegation", async () => {
    const res = await getLastDelegation(mockPkh(0), TezosNetwork.GHOSTNET);
    expect(res).toEqual({ type: "delegation" });
  });
});
