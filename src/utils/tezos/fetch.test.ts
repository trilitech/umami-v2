import axios from "axios";
import {
  getAccounts,
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
import { mockImplicitAddress } from "../../mocks/factories";
import { TezosNetwork } from "@airgap/tezos";
import { SupportedNetworks } from "../network";
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
    await getTokens(mockImplicitAddress(0).pkh, TezosNetwork.GHOSTNET);
    expect(tokensGetTokenBalances).toBeCalledWith(
      {
        account: { eq: mockImplicitAddress(0).pkh },
        balance: { gt: "0" },
      },
      { baseUrl: tzktUrls[TezosNetwork.GHOSTNET] }
    );
  });

  test("getTezTransfers", async () => {
    await getTezTransfers(mockImplicitAddress(0).pkh, TezosNetwork.GHOSTNET);
    expect(operationsGetTransactions).toBeCalledWith(
      {
        anyof: { fields: ["sender", "target"], eq: mockImplicitAddress(0).pkh },
        sort: { desc: "level" },
        limit: 10,
      },
      {
        baseUrl: tzktUrls[TezosNetwork.GHOSTNET],
      }
    );
  });

  test("getTokenTransfers", async () => {
    await getTokenTransfers(mockImplicitAddress(0).pkh, TezosNetwork.GHOSTNET);
    expect(tokensGetTokenTransfers).toBeCalledWith(
      {
        anyof: { fields: ["from", "to"], eq: mockImplicitAddress(0).pkh },
        sort: { desc: "level" },
        limit: 10,
      },
      {
        baseUrl: tzktUrls[TezosNetwork.GHOSTNET],
      }
    );
  });

  test("getLastDelegation", async () => {
    const res = await getLastDelegation(mockImplicitAddress(0).pkh, TezosNetwork.GHOSTNET);
    expect(res).toEqual({ type: "delegation" });
  });

  test("getAccounts", async () => {
    SupportedNetworks.forEach(async network => {
      mockedAxios.get.mockResolvedValue({
        data: [
          { address: mockImplicitAddress(0).pkh, balance: 12345 },
          { address: mockImplicitAddress(1).pkh, balance: 123456 },
        ],
      });
      const addresses = [mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh];
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
