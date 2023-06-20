import axios from "axios";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { tzktGetBigMapKeysResponseType } from "../../utils/tzkt/types";
import { TezosNetwork } from "@airgap/tezos";
import { getOperationsForMultisigs, getRelevantMultisigContracts } from "./helpers";
import { tzktGetSameMultisigsResponse } from "../../mocks/tzktResponse";
import { parseImplicitPkh } from "../../types/Address";
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("multisig helpers", () => {
  test("getRelevantMultisigContracts", async () => {
    const mockResponse = {
      data: tzktGetSameMultisigsResponse,
    };
    mockedAxios.get.mockResolvedValue(mockResponse);
    const result = await getRelevantMultisigContracts(
      TezosNetwork.GHOSTNET,
      new Set([mockImplicitAddress(0).pkh])
    );

    expect(result).toEqual([
      {
        address: mockContractAddress(0).pkh,
        balance: 0,
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

    const result = await getOperationsForMultisigs(
      TezosNetwork.GHOSTNET,
      tzktGetSameMultisigsResponse
    );

    tzktGetSameMultisigsResponse.forEach(res => {
      const {
        storage: { pending_ops },
      } = res;

      expect(mockedAxios.get).toBeCalledWith(
        `https://api.ghostnet.tzkt.io/v1/bigmaps/${pending_ops}/keys?active=true`
      );
    });

    expect(result).toEqual([
      {
        address: mockContractAddress(0),
        balance: "0",
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
        balance: "10",
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
