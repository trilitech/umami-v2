import { multisigActions } from "./multisigsSlice";
import { mockContractAddress, mockMultisigAccount } from "../../../mocks/factories";
import { multisigOperation, multisigs } from "../../../mocks/multisig";
import { Multisig } from "../../multisig/types";
import { store } from "../store";

describe("Multisig reducer", () => {
  describe("default values", () => {
    it("store should initialize with empty state", () => {
      expect(store.getState().multisigs).toEqual({ items: [], pendingOperations: {} });
    });
  });

  describe("setMultisigs", () => {
    it("should set new multisigs", () => {
      store.dispatch(multisigActions.setMultisigs(multisigs));
      expect(store.getState().multisigs).toEqual({
        items: multisigs.map((m, i) => ({
          ...m,
          label: `Multisig Account ${i}`,
          type: "multisig",
        })),
        pendingOperations: {},
      });
    });

    it("should set default label for new multisigs", () => {
      const oldMultisigs = [multisigs[0], multisigs[1]];
      const newMultisigs = multisigs;
      store.dispatch(multisigActions.setMultisigs(oldMultisigs));
      store.dispatch(multisigActions.setMultisigs(newMultisigs));
      expect(store.getState().multisigs).toEqual({
        items: newMultisigs.map((m, i) => ({
          ...m,
          label: `Multisig Account ${i}`,
          type: "multisig",
        })),
        pendingOperations: {},
      });
    });
  });

  describe("setName", () => {
    it("should not do anything if account does not exist", () => {
      const account = mockMultisigAccount(0);
      store.dispatch(multisigActions.setMultisigs([account as Multisig]));
      store.dispatch(
        multisigActions.setName({
          newName: "new name",
          account: { ...account, address: mockContractAddress(2) },
        })
      );

      expect(store.getState().multisigs.items).toEqual([account]);
    });

    it("should update the label", () => {
      const account = mockMultisigAccount(0);
      store.dispatch(multisigActions.setMultisigs([account as Multisig]));
      store.dispatch(
        multisigActions.setName({
          newName: "new name",
          account,
        })
      );

      expect(store.getState().multisigs.items).toEqual([{ ...account, label: "new name" }]);
    });
  });

  describe("setPendingOperations", () => {
    it("should build mapping for multisig operations", () => {
      const operation1 = multisigOperation;
      const operation2 = { ...multisigOperation, id: "2" };
      const operation3 = { ...multisigOperation, bigmapId: 1 };
      store.dispatch(multisigActions.setPendingOperations([operation1, operation2, operation3]));
      expect(store.getState().multisigs).toEqual({
        items: [],
        pendingOperations: {
          "0": [
            {
              approvals: [
                {
                  pkh: "pkh",
                  type: "implicit",
                },
              ],
              bigmapId: 0,
              id: "1",
              rawActions:
                '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"005fd0a7ece135cecfd71fcf78cf6656d5047fb980"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"100000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
            },
            {
              approvals: [
                {
                  pkh: "pkh",
                  type: "implicit",
                },
              ],
              bigmapId: 0,
              id: "2",
              rawActions:
                '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"005fd0a7ece135cecfd71fcf78cf6656d5047fb980"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"100000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
            },
          ],
          "1": [
            {
              approvals: [
                {
                  pkh: "pkh",
                  type: "implicit",
                },
              ],
              bigmapId: 1,
              id: "1",
              rawActions:
                '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"005fd0a7ece135cecfd71fcf78cf6656d5047fb980"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"100000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
            },
          ],
        },
      });
    });
  });
});
