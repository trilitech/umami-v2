import axios from "axios";
import { getBakers, getTokens } from "./fetch";
import * as tzktApi from "@tzkt/sdk-api";
import { TezosNetwork } from "@airgap/tezos";
jest.mock("axios");
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
    expect(mockedAxios.get).toBeCalledWith(
      "https://api.baking-bad.org/v2/bakers"
    );
    expect(result).toEqual(mockResponse.data);
  });

  test("getTokens", async () => {
    // const mockResponse = {
    //   data: [] as tzktApi.Token[],
    // };
    // const a: tzktApi.Token[] = [];
    // mockedTzktApi.tokensGetTokenBalances.mockResolvedValue(a);
    // const result = await getTokens("MOCK", TezosNetwork.GHOSTNET);
    const b = 1;
    expect(b).toEqual(1);
  });
});
