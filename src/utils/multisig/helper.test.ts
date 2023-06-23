import axios from "axios";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { tzktGetBigMapKeysResponseType } from "../../utils/tzkt/types";
import { getOperationsForMultisigs, getRelevantMultisigContracts } from "./helpers";
import { tzktGetSameMultisigsResponse } from "../../mocks/tzktResponse";
import { parseImplicitPkh } from "../../types/Address";
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
      const mockResponse = {
        data: [
          {
            active: true,
            key: "0",
            value: { actions: "action0", approvals: [mockImplicitAddress(0).pkh] },
          },
          {
            active: true,
            key: "1",
            value: { actions: "action1", approvals: [mockImplicitAddress(1).pkh] },
          },
        ] as tzktGetBigMapKeysResponseType,
      };
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getOperationsForMultisigs(network, tzktGetSameMultisigsResponse);

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
            {
              approvals: [mockImplicitAddress(1)],
              key: "1",
              rawActions: "action1",
            },
          ],
          signers: [mockImplicitAddress(0)],
          threshold: 2,
        },
        {
          address: mockContractAddress(10),
          pendingOperations: [
            {
              approvals: [mockImplicitAddress(0)],
              key: "0",
              rawActions: "action0",
            },
            {
              approvals: [mockImplicitAddress(1)],
              key: "1",
              rawActions: "action1",
            },
          ],
          signers: [parseImplicitPkh("tz1W2hEsS1mj7dHPZ6267eeM4HDWJoG3s13n")],
          threshold: 2,
        },
      ]);
    });
  });
});
