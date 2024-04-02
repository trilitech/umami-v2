import { useGetPendingMultisigOperations, useRemoveObsoleteMultisigs } from "./multisigHooks";
import { useRemoveAccountsDependencies } from "./removeAccountDependenciesHooks";
import {
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../mocks/factories";
import { multisigOperation, multisigs } from "../../mocks/multisig";
import { act, renderHook } from "../../mocks/testUtils";
import { multisigToAccount } from "../multisig/helpers";
import { accountsSlice } from "../redux/slices/accountsSlice";
import { multisigActions } from "../redux/slices/multisigsSlice";
import { store } from "../redux/store";

jest.mock("./removeAccountDependenciesHooks");
jest.unmock("../tezos");

const mockedUseRemoveAccountsDependencies = jest.mocked(useRemoveAccountsDependencies);
const mockedRemoveAccountsDependencies = jest.fn();

describe("multisigHooks", () => {
  beforeEach(() => {
    mockedUseRemoveAccountsDependencies.mockReturnValue(mockedRemoveAccountsDependencies);
  });

  it("useGetSortedMultisigPendingOperations sorts operations by id", () => {
    const operation1 = multisigOperation;
    const operation2 = { ...multisigOperation, id: "2" };
    store.dispatch(multisigActions.setMultisigs(multisigs));
    store.dispatch(multisigActions.setPendingOperations([operation1, operation2]));
    const { result: getMultisigOperationsRef } = renderHook(() =>
      useGetPendingMultisigOperations()
    );
    expect(getMultisigOperationsRef.current(multisigToAccount(multisigs[0], "label1"))).toEqual([
      {
        id: "2",
        bigmapId: 0,
        rawActions:
          '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"005fd0a7ece135cecfd71fcf78cf6656d5047fb980"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"100000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
        approvals: [
          {
            pkh: "pkh",
            type: "implicit",
          },
        ],
      },
      {
        id: "1",
        bigmapId: 0,
        rawActions:
          '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"005fd0a7ece135cecfd71fcf78cf6656d5047fb980"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"100000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
        approvals: [
          {
            pkh: "pkh",
            type: "implicit",
          },
        ],
      },
    ]);
  });

  describe("useRemoveObsoleteMultisigs", () => {
    const acc0 = mockMnemonicAccount(0);
    const acc1 = mockSocialAccount(1);
    const acc2 = mockLedgerAccount(2);
    const acc3 = mockSecretKeyAccount(3);
    const multisig0 = mockMultisigAccount(0, [acc0.address, acc1.address]);
    const multisig1 = mockMultisigAccount(1, [acc1.address, acc2.address, acc3.address]);
    const multisig2 = mockMultisigAccount(2, [acc3.address]);

    beforeEach(() => {
      store.dispatch(accountsSlice.actions.addAccount(acc2));
      store.dispatch(multisigActions.setMultisigs([multisig0, multisig1, multisig2]));
    });

    it("removes multisigs from the storage", () => {
      const {
        result: { current: removeMultisigs },
      } = renderHook(() => useRemoveObsoleteMultisigs());

      act(() => removeMultisigs());

      expect(store.getState().multisigs.items).toEqual([multisig1]);
    });

    it("removes multisig labels from the storage", () => {
      store.dispatch(
        multisigActions.addMultisigLabel({ pkh: multisig0.address.pkh, label: "Multisig 0" })
      );
      store.dispatch(
        multisigActions.addMultisigLabel({ pkh: multisig1.address.pkh, label: "Multisig 1" })
      );
      store.dispatch(
        multisigActions.addMultisigLabel({ pkh: multisig2.address.pkh, label: "Multisig 2" })
      );
      const {
        result: { current: removeMultisigs },
      } = renderHook(() => useRemoveObsoleteMultisigs());

      act(() => removeMultisigs());

      expect(store.getState().multisigs.labelsMap).toEqual({
        [multisig1.address.pkh]: "Multisig 1",
      });
    });

    it("removes multisig pending operations from the storage", () => {
      // pendingOperationsBigmapId is the same as multisig's index
      store.dispatch(
        multisigActions.setPendingOperations([
          { ...multisigOperation, id: "0", bigmapId: 0 },
          { ...multisigOperation, id: "1", bigmapId: 0 },
          { ...multisigOperation, id: "2", bigmapId: 1 },
          { ...multisigOperation, id: "3", bigmapId: 1 },
          { ...multisigOperation, id: "4", bigmapId: 2 },
        ])
      );
      const {
        result: { current: removeMultisigs },
      } = renderHook(() => useRemoveObsoleteMultisigs());

      act(() => removeMultisigs());

      expect(store.getState().multisigs.pendingOperations).toEqual({
        "1": [
          { ...multisigOperation, id: "2", bigmapId: 1 },
          { ...multisigOperation, id: "3", bigmapId: 1 },
        ],
      });
    });

    it("calls removeAccountsDependencies", () => {
      const {
        result: { current: removeMultisigs },
      } = renderHook(() => useRemoveObsoleteMultisigs());

      act(() => removeMultisigs());

      expect(mockedRemoveAccountsDependencies).toHaveBeenCalledWith([multisig0, multisig2]);
    });
  });
});
