import { multisigOperation, multisigs } from "../../../mocks/multisig";
import store from "../store";
import { multisigActions } from "./multisigsSlice";

describe("Multisig reducer", () => {
  describe("default values", () => {
    it("store should initialize with empty state", () => {
      expect(store.getState().multisigs).toEqual({ items: [], pendingOperations: {}, labels: {} });
    });
  });

  describe("setMultisigs", () => {
    it("should set new multisigs", () => {
      const multisig = multisigs[0];
      store.dispatch(multisigActions.setMultisigs([multisig]));
      expect(store.getState().multisigs).toEqual({
        items: [multisig],
        pendingOperations: {},
        labels: {},
      });
    });
  });

  describe("setDefaultNames", () => {
    it("should set the default labels for all of the multisig accounts", () => {
      store.dispatch(multisigActions.setMultisigs(multisigs));
      store.dispatch(multisigActions.setDefaultNames());
      expect(store.getState().multisigs.labels).toEqual({
        [multisigs[0].address.pkh]: "Multisig Account 0",
        [multisigs[1].address.pkh]: "Multisig Account 1",
        [multisigs[2].address.pkh]: "Multisig Account 2",
      });
    });
  });

  describe("setName", () => {
    it("should update the label", () => {
      const multisig = multisigs[0];
      store.dispatch(multisigActions.setMultisigs([multisig]));
      store.dispatch(
        multisigActions.setName({
          label: "new name",
          pkh: multisig.address.pkh,
        })
      );

      expect(store.getState().multisigs.labels).toEqual({
        [multisig.address.pkh]: "new name",
      });
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
        labels: {},
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
