import axios from "axios";
import { mockContract, mockPkh } from "../../mocks/factories";
import { tzktGetBigMapKeysResponseType } from "../../utils/tzkt/types";
import { TezosNetwork } from "@airgap/tezos";
import {
  buildAccountToMultisigsMap,
  getOperationsForMultisigs,
  getRelevantMultisigContracts,
} from "./helpers";
import { tzktGetSameMultisigsResponse } from "../../mocks/tzktResponse";
import { MultisigWithOperations } from "./types";
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("multisig helpers", () => {
  test("buildAccountToMultisigsMap", async () => {
    const accounts = new Set([mockPkh(0), mockPkh(1), mockPkh(2)]);
    const multisigs: MultisigWithOperations[] = [
      {
        balance: "1",
        address: mockContract(0),
        signers: [mockPkh(0)],
        threshold: 1,
        operations: [],
      },
      {
        balance: "0",
        address: mockContract(1),
        signers: [mockPkh(0), mockPkh(1), mockPkh(3)],
        threshold: 3,
        operations: [],
      },
    ];
    const result = buildAccountToMultisigsMap(multisigs, accounts);
    expect(result).toEqual({
      [mockPkh(1)]: [
        {
          address: mockContract(1),
          balance: "0",
          operations: [],
          signers: [mockPkh(0), mockPkh(1), mockPkh(3)],
          threshold: 3,
        },
      ],
      [mockPkh(0)]: [
        {
          address: mockContract(0),
          balance: "1",
          operations: [],
          signers: [mockPkh(0)],
          threshold: 1,
        },
        {
          address: mockContract(1),
          balance: "0",
          operations: [],
          signers: [mockPkh(0), mockPkh(1), mockPkh(3)],
          threshold: 3,
        },
      ],
    });
  });

  test("getRelevantMultisigContracts", async () => {
    const mockResponse = {
      data: tzktGetSameMultisigsResponse,
    };
    mockedAxios.get.mockResolvedValue(mockResponse);
    const result = await getRelevantMultisigContracts(
      TezosNetwork.GHOSTNET,
      new Set([mockPkh(0)])
    );

    expect(result).toEqual([
      {
        address: mockContract(0),
        balance: 0,
        storage: {
          pending_ops: 0,
          signers: [mockPkh(0)],
          threshold: "2",
        },
      },
    ]);
  });

  test("getOperationsForMultisigs", async () => {
    const mockResponse = {
      data: [
        {
          active: false,
          key: "0",
          value: { actions: "action0", approvals: [mockPkh(0)] },
        },
        {
          active: true,
          key: "1",
          value: { actions: "action1", approvals: [mockPkh(1)] },
        },
      ] as tzktGetBigMapKeysResponseType,
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await getOperationsForMultisigs(
      TezosNetwork.GHOSTNET,
      tzktGetSameMultisigsResponse
    );

    tzktGetSameMultisigsResponse.forEach((res) => {
      const {
        storage: { pending_ops },
      } = res;

      expect(mockedAxios.get).toBeCalledWith(
        `https://api.ghostnet.tzkt.io/v1/bigmaps/${pending_ops}/keys`
      );
    });

    expect(result).toEqual([
      {
        address: mockContract(0),
        balance: "0",
        operations: [
          {
            active: false,
            approvals: [mockPkh(0)],
            key: "0",
            rawActions: "action0",
          },
          {
            active: true,
            approvals: [mockPkh(1)],
            key: "1",
            rawActions: "action1",
          },
        ],
        signers: [mockPkh(0)],
        threshold: 2,
      },
      {
        address: mockContract(10),
        balance: "10",
        operations: [
          {
            active: false,
            approvals: [mockPkh(0)],
            key: "0",
            rawActions: "action0",
          },
          {
            active: true,
            approvals: [mockPkh(1)],
            key: "1",
            rawActions: "action1",
          },
        ],
        signers: ["tz1W2hEsS1mj7dHPZ6267eeM4HDWJoG3s13n"],
        threshold: 2,
      },
    ]);
  });
});
