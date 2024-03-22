import axios from "axios";

import {
  getExistingContractAddresses,
  getPendingOperationsForMultisigs,
  getRelevantMultisigContracts,
  parseMultisig,
} from "./helpers";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { tzktGetSameMultisigsResponse } from "../../mocks/tzktResponse";
import { DefaultNetworks } from "../../types/Network";
jest.mock("axios");
jest.unmock("../tezos");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("multisig helpers", () => {
  describe.each(DefaultNetworks)("on $name", network => {
    describe("getRelevantMultisigContracts", () => {
      it("fetches multisig contracts", async () => {
        const mockResponse = {
          data: tzktGetSameMultisigsResponse,
        };
        mockedAxios.get.mockResolvedValue(mockResponse);

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

    describe("getExistingContractAddresses", () => {
      it("fetches existing contract addresses", async () => {
        const mockResponse = {
          data: tzktGetSameMultisigsResponse,
        };
        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await getExistingContractAddresses(
          network,
          new Set([
            mockContractAddress(0).pkh,
            mockContractAddress(1).pkh,
            mockContractAddress(2).pkh,
          ])
        );

        expect(result).toEqual([mockContractAddress(0).pkh, mockContractAddress(2).pkh]);
      });
    });

    describe("getPendingOperationsForMultisigs", () => {
      it("handles empty multisigs", async () => {
        const result = await getPendingOperationsForMultisigs([], network);

        expect(mockedAxios.get).toHaveBeenCalledTimes(0);
        expect(result).toEqual([]);
      });

      it("fetches pending operations for multisigs", async () => {
        mockedAxios.get.mockResolvedValueOnce({
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

        expect(mockedAxios.get).toHaveBeenCalledWith(
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
});
