import axios from "axios";

import { getAllMultiSigContracts, getExistingContracts, getPendingOperations } from "./fetch";
import { mockImplicitAddress } from "../../mocks/factories";
import { ghostMultisigContracts } from "../../mocks/tzktResponse";
import { GHOSTNET } from "../../types/Network";

jest.mock("axios");
jest.unmock("../tezos");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("multisig fetch", () => {
  const expectedMockedMultisigContracts = [
    {
      address: "KT1Mqvf7bnYe4Ty2n7ZbGkdbebCd4WoTJUUp",
      storage: {
        pending_ops: 216411,
        signers: ["tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3", "tz1dyX3B1CFYa2DfdFLyPtiJCfQRUgPVME6E"],
        threshold: "1",
      },
    },
    {
      address: "KT1VwWbTMRN5uX4bfxCcpJnPP6iAhboqhGZr",
      storage: {
        pending_ops: 219458,
        signers: [
          "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
          "tz1VTfGqp34NypRQJmjNiPrCTG5TRonevsmf",
          "tz1g2pCYFonfHXqjNCJNnGRy6MamDPdon4oS",
        ],
        threshold: "2",
      },
    },
    {
      address: "KT1Vdhz4izz7LASWU4tTLu3GBsvhJ8ULSi3G",
      storage: {
        pending_ops: 219535,
        signers: ["tz1RVPjF88wjiZ7JhxvmLPRm6TTR9MHPAFPd", "tz1ajzeMEzKxM9H4keBxoD1JSQy3iGRoHPg5"],
        threshold: "1",
      },
    },
  ];

  describe("getAllMultiSigContracts", () => {
    it("fetches all multisig contracts", async () => {
      mockedAxios.get.mockResolvedValue({ data: ghostMultisigContracts });

      const result = await getAllMultiSigContracts(GHOSTNET);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${GHOSTNET.tzktApiUrl}/v1/contracts?typeHash=1963879877&codeHash=-1890025422&includeStorage=true&limit=10000`
      );
      expect(
        result.map(({ address, storage: { pending_ops, signers, threshold } }) => ({
          address,
          storage: { pending_ops, signers, threshold },
        }))
      ).toEqual(expectedMockedMultisigContracts);
    });
  });

  describe("getExistingContracts", () => {
    it("fetches contracts existing in the given network by address list", async () => {
      mockedAxios.get.mockResolvedValue({ data: ghostMultisigContracts });

      const result = await getExistingContracts(GHOSTNET, ["pkh1", "pkh2", "pkh3"]);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${GHOSTNET.tzktApiUrl}/v1/contracts?typeHash=1963879877&codeHash=-1890025422&includeStorage=true&limit=10000&address.in=pkh1,pkh2,pkh3`
      );
      expect(
        result.map(({ address, storage: { pending_ops, signers, threshold } }) => ({
          address,
          storage: { pending_ops, signers, threshold },
        }))
      ).toEqual(expectedMockedMultisigContracts);
    });
  });

  describe("getPendingOperations", () => {
    it("fetches pending operation", async () => {
      mockedAxios.get.mockResolvedValue({
        data: [
          {
            bigmap: 1,
            active: true,
            key: "2",
            value: { actions: "action2", approvals: [mockImplicitAddress(0).pkh] },
          },
        ],
      });

      const result = await getPendingOperations([1], GHOSTNET);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${GHOSTNET.tzktApiUrl}/v1/bigmaps/keys?active=true&bigmap.in=1&limit=10000`
      );
      expect(result).toEqual([
        {
          active: true,
          bigmap: 1,
          key: "2",
          value: { actions: "action2", approvals: ["tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h"] },
        },
      ]);
    });

    it("handles empty bigMaps", async () => {
      const result = await getPendingOperations([], GHOSTNET);
      expect(mockedAxios.get).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);
    });
  });
});
