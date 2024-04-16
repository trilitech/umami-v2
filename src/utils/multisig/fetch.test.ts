import * as api from "@tzkt/sdk-api";
import axios from "axios";

import { getAllMultiSigContracts, getExistingContracts, getPendingOperations } from "./fetch";
import { mockImplicitAddress } from "../../mocks/factories";
import { ghostMultisigContracts } from "../../mocks/tzktResponse";
import { DefaultNetworks, GHOSTNET } from "../../types/Network";

jest.unmock("../tezos");

const mockedAxios = jest.spyOn(axios, "get");

const mockedContractsGet = jest.spyOn(api, "contractsGet");

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
      mockedAxios.mockResolvedValue({ data: ghostMultisigContracts });
      const result = await getAllMultiSigContracts(GHOSTNET);

      expect(mockedAxios).toHaveBeenCalledTimes(1);
      expect(mockedAxios).toHaveBeenCalledWith(
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
    it.each(DefaultNetworks)(
      "on $name calls contractsGet with correct arguments",
      async network => {
        mockedContractsGet.mockResolvedValue(["pkh1", "pkh3"] as any);

        await getExistingContracts(["pkh1", "pkh2", "pkh3"], network);

        expect(mockedContractsGet).toHaveBeenCalledWith(
          {
            address: {
              in: ["pkh1,pkh2,pkh3"],
            },
            select: { fields: ["address"] },
            limit: 3,
          },
          { baseUrl: network.tzktApiUrl }
        );
      }
    );

    it("extracts contract addresses from the api response", async () => {
      mockedContractsGet.mockResolvedValue(["pkh1", "pkh3"] as any);

      const result = await getExistingContracts(["pkh1", "pkh2", "pkh3"], GHOSTNET);

      expect(result).toEqual(["pkh1", "pkh3"]);
    });
  });

  describe("getPendingOperations", () => {
    it("fetches pending operation", async () => {
      mockedAxios.mockResolvedValue({
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
      expect(mockedAxios).toHaveBeenCalledWith(
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
      expect(mockedAxios).toHaveBeenCalledTimes(0);
      expect(result).toEqual([]);
    });
  });
});
