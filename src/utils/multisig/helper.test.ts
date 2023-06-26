import axios from "axios";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { getOperationsForMultisigs, getRelevantMultisigContracts } from "./helpers";
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
        network,
        new Set([mockImplicitAddress(0).pkh])
      );

      expect(result).toEqual([
        {
          address: mockContractAddress(0).pkh,
          storage: {
            pending_ops: 0,
            signers: [mockImplicitAddress(0).pkh],
            threshold: "2",
          },
        },
      ]);
    });

    test("getOperationsForMultisigs", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          {
            active: true,
            key: "0",
            value: { actions: "action0", approvals: [mockImplicitAddress(0).pkh] },
          },
        ],
      });
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          {
            active: true,
            key: "1",
            value: { actions: "action1", approvals: [mockImplicitAddress(1).pkh] },
          },
          {
            active: true,
            key: "2",
            value: { actions: "action2", approvals: [mockImplicitAddress(2).pkh] },
          },
        ],
      });

      // chunk size is set to 1 to be able to mock the responses properly (e.g. sequential execution)
      const result = await getOperationsForMultisigs(network, tzktGetSameMultisigsResponse, 1);

      tzktGetSameMultisigsResponse.forEach(res => {
        const {
          storage: { pending_ops },
        } = res;

        expect(mockedAxios.get).toBeCalledWith(
          `https://api.${network}.tzkt.io/v1/bigmaps/${pending_ops}/keys?active=true`
        );
      });

      expect(result).toEqual([
        {
          address: mockContractAddress(0),
          pendingOperations: [
            {
              approvals: [mockImplicitAddress(0)],
              key: "0",
              rawActions: "action0",
            },
          ],
          signers: [mockImplicitAddress(0)],
          threshold: 2,
        },
        {
          address: mockContractAddress(10),
          pendingOperations: [
            {
              approvals: [mockImplicitAddress(1)],
              key: "1",
              rawActions: "action1",
            },
            {
              approvals: [mockImplicitAddress(2)],
              key: "2",
              rawActions: "action2",
            },
          ],
          signers: [mockImplicitAddress(10)],
          threshold: 2,
        },
      ]);
    });
  });
});
