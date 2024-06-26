import * as api from "@tzkt/sdk-api";
import {
  DefaultNetworks,
  GHOSTNET,
  MAINNET,
  mockContractAddress,
  mockImplicitAddress,
} from "@umami/tezos";
import axios from "axios";

import {
  getNetworksForContracts,
  getPendingOperations,
  getRelevantMultisigContracts,
  parseMultisig,
} from "./helpers";
import { type RawTzktMultisigContract } from "./types";

const mockedAxios = jest.spyOn(axios, "get");

const mockedContractsGet = jest.spyOn(api, "contractsGet");

const tzktGetSameMultisigsResponse: RawTzktMultisigContract[] = [
  {
    address: mockContractAddress(0).pkh,
    storage: { threshold: "2", pending_ops: 0, signers: [mockImplicitAddress(0).pkh] },
  },
  {
    address: mockContractAddress(2).pkh,
    storage: { threshold: "2", pending_ops: 1, signers: [mockImplicitAddress(2).pkh] },
  },
];

describe("multisig helpers", () => {
  describe.each(DefaultNetworks)("on $name", network => {
    describe("getRelevantMultisigContracts", () => {
      it("fetches multisig contracts", async () => {
        mockedContractsGet.mockResolvedValue(tzktGetSameMultisigsResponse as any);

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

    describe("getPendingOperations", () => {
      it("handles empty multisigs", async () => {
        const result = await getPendingOperations([], network);

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

        const result = await getPendingOperations(
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
          limit: 3,
        },
        { baseUrl: MAINNET.tzktApiUrl }
      );
      expect(mockedContractsGet).toHaveBeenCalledWith(
        {
          address: {
            in: ["pkh1,pkh2,pkh3"],
          },
          select: { fields: ["address"] },
          limit: 3,
        },
        { baseUrl: GHOSTNET.tzktApiUrl }
      );
    });

    it("transforms api responses into map with data", async () => {
      mockedContractsGet.mockImplementation((...args) => {
        if (args[1]!.baseUrl === MAINNET.tzktApiUrl) {
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

    it("returns empty map for empty contracts list", async () => {
      mockedContractsGet.mockImplementation((...args) => {
        if (args[1]!.baseUrl === MAINNET.tzktApiUrl) {
          return Promise.resolve(["pkh1", "pkh3", "pkh4"] as any);
        } else {
          return Promise.resolve(["pkh2", "pkh5"] as any);
        }
      });

      const result = await getNetworksForContracts([MAINNET, GHOSTNET], []);

      expect(result).toEqual(new Map());
    });
  });
});
