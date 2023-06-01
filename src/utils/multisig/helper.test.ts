import axios from "axios";
import { mockContract, mockPkh } from "../../mocks/factories";
import { tzktGetSameMultisigsResponseType } from "../tzkt/types";
import { filterMultisigs, getMultisigsWithPendingOps } from "./helpers";
import { tzktGetBigMapKeysResponseType } from "../../utils/tzkt/types";
import { TezosNetwork } from "@airgap/tezos";
jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("multisig helpers", () => {
  test("makeMultisigLookups", async () => {
    const accounts = new Set([mockPkh(0), mockPkh(1), mockPkh(2)]);
    const multisigs: tzktGetSameMultisigsResponseType = [
      {
        balance: 0,
        address: mockContract(0),
        storage: { signers: [mockPkh(0)], threshold: "3", pending_ops: 0 },
      },
      {
        balance: 0,
        address: mockContract(1),
        storage: {
          signers: [mockPkh(0), mockPkh(2), mockPkh(3)],
          threshold: "3",
          pending_ops: 1,
        },
      },
      {
        balance: 0,
        address: mockContract(2),
        storage: {
          signers: [mockPkh(3), mockPkh(4), mockPkh(5)],
          threshold: "3",
          pending_ops: 2,
        },
      },
    ];

    const { accountToMultisigs, multiSigToSigners } = filterMultisigs(
      accounts,
      multisigs
    );

    expect(multiSigToSigners).toEqual({
      [mockContract(0)]: [mockPkh(0)],
      [mockContract(1)]: [mockPkh(0), mockPkh(2), mockPkh(3)],
    });

    expect(accountToMultisigs).toEqual({
      [mockPkh(0)]: [
        { address: mockContract(0), pendingOpsId: 0, threshold: 3 },
        { address: mockContract(1), pendingOpsId: 1, threshold: 3 },
      ],
      [mockPkh(2)]: [
        { address: mockContract(1), pendingOpsId: 1, threshold: 3 },
      ],
    });
  });

  test("getMultisigsWithPendingOps", async () => {
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
    const multisigs = [
      { address: mockContract(0), threshold: 2, pendingOpsId: 0 },
      { address: mockContract(1), threshold: 2, pendingOpsId: 1 },
    ];
    const result = await getMultisigsWithPendingOps(
      TezosNetwork.GHOSTNET,
      multisigs
    );
    multisigs.forEach((m) => {
      expect(mockedAxios.get).toBeCalledWith(
        `https://api.ghostnet.tzkt.io/v1/bigmaps/${m.pendingOpsId}/keys`
      );
    });

    expect(result).toEqual([
      {
        address: mockContract(0),
        pendingOps: [
          {
            approvals: ["tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf"],
            key: "1",
            rawActions: "action1",
          },
        ],
        threshold: 2,
      },
      {
        address: mockContract(1),
        pendingOps: [
          {
            approvals: ["tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf"],
            key: "1",
            rawActions: "action1",
          },
        ],
        threshold: 2,
      },
    ]);
  });
});
