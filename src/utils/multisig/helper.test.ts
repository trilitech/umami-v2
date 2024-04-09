import * as api from "@tzkt/sdk-api";
import axios from "axios";

import {
  getNetworksForContracts,
  getPendingOperationsForMultisigs,
  getRelevantMultisigContracts,
  parseMultisig,
} from "./helpers";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { tzktGetSameMultisigsResponse } from "../../mocks/tzktResponse";
import { DefaultNetworks, GHOSTNET, MAINNET } from "../../types/Network";
jest.deepUnmock("../tezos");
jest.unmock("../tezos/helpers");
jest.unmock("../tezos/fetch");

const mockedAxios = jest.spyOn(axios, "get");

const mockedContractsGet = jest.spyOn(api, "contractsGet");

describe("multisig helpers", () => {
  describe.each(DefaultNetworks)("on $name", network => {
    describe("getRelevantMultisigContracts", () => {
      it("fetches multisig contracts", async () => {
        const mockResponse = {
          data: tzktGetSameMultisigsResponse,
        };
        mockedAxios.mockResolvedValue(mockResponse);

        const result = await getRelevantMultisigContracts(
          new Set([mockImplicitAddress(0).pkh]),
          network
        );

        expect(result).toEqual([
          {
            address: mockContractAddress(0),
            pendingOperationsBigmapId: 0,
            signers: [mockImplicitAddress(0)],
            threshold: 2,
          },
        ]);
      });
    });

    describe("getPendingOperationsForMultisigs", () => {
      it("handles empty multisigs", async () => {
        const result = await getPendingOperationsForMultisigs([], network);

        expect(mockedAxios).toHaveBeenCalledTimes(0);
        expect(result).toEqual([]);
      });

      it("fetches pending operations for multisigs", async () => {
        mockedAxios.mockResolvedValueOnce({
          data: [
            {
              bigmap: 0,
              active: true,
              key: "1",
              value: { actions: "action1", approvals: [mockImplicitAddress(1).pkh] },
            },
            {
              bigmap: 1,
              active: true,
              key: "2",
              value: { actions: "action2", approvals: [mockImplicitAddress(2).pkh] },
            },
          ],
        });

        const result = await getPendingOperationsForMultisigs(
          tzktGetSameMultisigsResponse.map(parseMultisig),
          network
        );

        expect(mockedAxios).toHaveBeenCalledWith(
          `${network.tzktApiUrl}/v1/bigmaps/keys?active=true&bigmap.in=0,1&limit=10000`
        );
        expect(result).toEqual([
          {
            approvals: [
              {
                pkh: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
                type: "implicit",
              },
            ],
            id: "1",
            bigmapId: 0,
            rawActions: "action1",
          },
          {
            approvals: [
              {
                pkh: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
                type: "implicit",
              },
            ],
            id: "2",
            bigmapId: 1,
            rawActions: "action2",
          },
        ]);
      });
    });
  });

  describe("getNetworksForContracts", () => {
    it("calls contractsGet with correct arguments", async () => {
      mockedContractsGet.mockResolvedValue(["pkh1", "pkh3"] as any);

      await getNetworksForContracts([MAINNET, GHOSTNET], ["pkh1", "pkh2", "pkh3"]);

      expect(mockedContractsGet).toHaveBeenCalledTimes(2);
      expect(mockedContractsGet).toHaveBeenCalledWith(
        {
          address: {
            in: ["pkh1,pkh2,pkh3"],
          },
          select: { fields: ["address"] },
        },
        { baseUrl: MAINNET.tzktApiUrl }
      );
      expect(mockedContractsGet).toHaveBeenCalledWith(
        {
          address: {
            in: ["pkh1,pkh2,pkh3"],
          },
          select: { fields: ["address"] },
        },
        { baseUrl: GHOSTNET.tzktApiUrl }
      );
    });

    it("transforms api responses into map with data", async () => {
      mockedContractsGet.mockImplementation((...args) => {
        if (args[1].baseUrl === MAINNET.tzktApiUrl) {
          return Promise.resolve(["pkh1", "pkh3"] as any);
        } else {
          return Promise.resolve(["pkh2"] as any);
        }
      });

      const result = await getNetworksForContracts([MAINNET, GHOSTNET], ["pkh1", "pkh2", "pkh3"]);

      expect(result).toEqual(
        new Map([
          ["pkh1", MAINNET.name],
          ["pkh2", GHOSTNET.name],
          ["pkh3", MAINNET.name],
        ])
      );
    });
  });
});
