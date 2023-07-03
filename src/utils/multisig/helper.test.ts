import axios from "axios";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import {
  getPendingOperationsForMultisigs,
  getRelevantMultisigContracts,
  parseMultisig,
} from "./helpers";
import { tzktGetSameMultisigsResponse } from "../../mocks/tzktResponse";
import { SupportedNetworks } from "../network";
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("multisig helpers", () => {
  SupportedNetworks.forEach(async network => {
    test("getRelevantMultisigContracts", async () => {
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
          pendingOperations: 0,
          signers: [mockImplicitAddress(0)],
          threshold: 2,
        },
      ]);
    });

    test("getPendingOperationsForMultisigs", async () => {
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

      expect(mockedAxios.get).toBeCalledWith(
        `https://api.${network}.tzkt.io/v1/bigmaps/keys?active=true&bigmap.in=0,1`
      );

      expect(result).toEqual([
        {
          approvals: [
            {
              pkh: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
              type: "implicit",
            },
          ],
          id: 0,
          key: "1",
          rawActions: "action1",
        },
        {
          approvals: [
            {
              pkh: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
              type: "implicit",
            },
          ],
          id: 1,
          key: "2",
          rawActions: "action2",
        },
      ]);
    });
  });
});
