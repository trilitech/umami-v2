import { InMemorySigner } from "@taquito/signer";
import axios from "axios";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { FA12Transfer, FA2Transfer } from "../../types/Operation";
import { tzktUrls } from "./consts";
import {
  addressExists,
  getPkAndPkhFromSk,
  makeFA12TransactionParameter,
  makeFA2TransactionParameter,
} from "./helpers";
jest.mock("@taquito/signer");
jest.mock("@taquito/taquito");
jest.mock("./fakeSigner");
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
    const result = await addressExists(mockImplicitAddress(0).pkh);
    expect(mockedAxios.get).toBeCalledWith(
      `${tzktUrls.mainnet}/v1/accounts/${mockImplicitAddress(0).pkh}`
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
    const result = await addressExists(mockImplicitAddress(0).pkh);
    expect(mockedAxios.get).toBeCalledWith(
      `${tzktUrls.mainnet}/v1/accounts/${mockImplicitAddress(0).pkh}`
    );
    expect(result).toEqual(false);
  });

  describe("token transfers", () => {
    test("makeFA2TransactionParameter", () => {
      const operation: FA2Transfer = {
        type: "fa2",
        amount: "10",
        tokenId: "5",
        recipient: mockImplicitAddress(0),
        contract: mockContractAddress(1),
        sender: mockContractAddress(2),
      };

      expect(makeFA2TransactionParameter(operation)).toEqual({
        entrypoint: "transfer",
        value: [
          {
            prim: "Pair",
            args: [
              {
                string: mockContractAddress(2).pkh,
              },
              [
                {
                  prim: "Pair",
                  args: [
                    {
                      string: mockImplicitAddress(0).pkh,
                    },
                    {
                      prim: "Pair",
                      args: [
                        {
                          int: "5",
                        },
                        {
                          int: "10",
                        },
                      ],
                    },
                  ],
                },
              ],
            ],
          },
        ],
      });
    });

    test("makeFA12TransactionParameter", () => {
      const operation: FA12Transfer = {
        type: "fa1.2",
        amount: "110",
        recipient: mockImplicitAddress(1),
        contract: mockContractAddress(2),
        tokenId: "0",
        sender: mockContractAddress(1),
      };

      expect(makeFA12TransactionParameter(operation)).toEqual({
        entrypoint: "transfer",
        value: {
          prim: "Pair",
          args: [
            {
              string: mockContractAddress(1).pkh,
            },
            {
              prim: "Pair",
              args: [
                {
                  string: mockImplicitAddress(1).pkh,
                },
                {
                  int: "110",
                },
              ],
            },
          ],
        },
      });
    });
  });
});
