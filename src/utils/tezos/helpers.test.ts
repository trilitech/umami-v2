import { InMemorySigner } from "@taquito/signer";
import axios from "axios";
import { mockPkh } from "../../mocks/factories";
import { tzktUrls } from "./consts";
import { addressExists, getPkAndPkhFromSk } from "./helpers";
jest.mock("@taquito/signer");
jest.mock("@taquito/taquito");
jest.mock("./dummySigner");
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockSk = "mockSk";
describe("tezos utils helpers", () => {
  test("getPkAndPkhFromSk", async () => {
    await getPkAndPkhFromSk(mockSk);
    expect(InMemorySigner).toBeCalledTimes(1);
  });

  test("addressExists for non empty response", async () => {
    const mockResponse = {
      data: {
        type: "user",
      },
    };
    mockedAxios.get.mockResolvedValue(mockResponse);
    const result = await addressExists(mockPkh(0));
    expect(mockedAxios.get).toBeCalledWith(
      `${tzktUrls.mainnet}/v1/accounts/${mockPkh(0)}`
    );
    expect(result).toEqual(true);
  });

  test("addressExists returns false for empty response", async () => {
    const mockResponse = {
      data: {
        type: "empty",
      },
    };
    mockedAxios.get.mockResolvedValue(mockResponse);
    const result = await addressExists(mockPkh(0));
    expect(mockedAxios.get).toBeCalledWith(
      `${tzktUrls.mainnet}/v1/accounts/${mockPkh(0)}`
    );
    expect(result).toEqual(false);
  });

  // test("makeToolkitWithSigner", async () => {
  //   makeToolkitWithSigner(mockSk, TezosNetwork.GHOSTNET);
  //   expect(TezosToolkit).toBeCalledTimes(1);
  //   expect(InMemorySigner).toBeCalledTimes(1);
  // });

  // test("makeToolkitWithDummySigner", async () => {
  //   makeToolkitWithDummySigner(mockPk(0), mockPkh(0), TezosNetwork.GHOSTNET);
  //   expect(DummySigner).toBeCalledTimes(1);
  //   expect(TezosToolkit).toBeCalledTimes(1);
  // });
});
