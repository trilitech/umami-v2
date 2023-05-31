import { mockContract, mockPkh } from "../../mocks/factories";
import { tzktGetSameMultisigsResponseType } from "../tzkt/types";
import { filterMultisigs } from "./helpers";

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
        { address: mockContract(0), pendingOps: 0, threshold: 3 },
        { address: mockContract(1), pendingOps: 1, threshold: 3 },
      ],
      [mockPkh(2)]: [{ address: mockContract(1), pendingOps: 1, threshold: 3 }],
    });
  });
});
