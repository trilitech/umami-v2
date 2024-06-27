import { mockMultisigAccount } from "@umami/core";
import { multisigOperationFixture, multisigsFixture } from "@umami/multisig";
import { mockContractAddress } from "@umami/tezos";

import { multisigActions } from "./multisigs";
import { store } from "../store";
import { addTestAccount } from "../testHelpers";

describe("Multisig reducer", () => {
  describe("default values", () => {
    it("store should initialize with empty state", () => {
      expect(store.getState().multisigs).toEqual({
        items: [],
        pendingOperations: {},
        labelsMap: {},
      });
    });
  });

  describe("setMultisigs", () => {
    it("should set new multisigs", () => {
      store.dispatch(multisigActions.setMultisigs(multisigsFixture));
      expect(store.getState().multisigs.items).toEqual(
        multisigsFixture.map((multisig, i) => ({
          ...multisig,
          label: `Multisig Account ${i}`,
          type: "multisig",
        }))
      );
    });

    it("should set default label for new multisigs", () => {
      const oldMultisigs = [multisigsFixture[0], multisigsFixture[1]];
      const newMultisigs = multisigsFixture;
      store.dispatch(multisigActions.setMultisigs(oldMultisigs));
      store.dispatch(multisigActions.setMultisigs(newMultisigs));
      expect(store.getState().multisigs.items).toEqual(
        newMultisigs.map((multisig, i) => ({
          ...multisig,
          label: `Multisig Account ${i}`,
          type: "multisig",
        }))
      );
    });

    it("sets the predefined label for new multisigs", () => {
      const multisig = multisigsFixture[0];

      store.dispatch(
        multisigActions.addMultisigLabel({ pkh: multisig.address.pkh, label: "test label" })
      );

      store.dispatch(multisigActions.setMultisigs([multisig]));

      expect(store.getState().multisigs.items).toEqual([
        {
          ...multisig,
          label: "test label",
          type: "multisig",
        },
      ]);
    });
  });

  describe("setName", () => {
    it("should not do anything if account does not exist", () => {
      const account = mockMultisigAccount(0);
      addTestAccount(account);
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
      addTestAccount(account);
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
      const operation1 = multisigOperationFixture;
      const operation2 = { ...multisigOperationFixture, id: "2" };
      const operation3 = { ...multisigOperationFixture, bigmapId: 1 };
      store.dispatch(multisigActions.setPendingOperations([operation1, operation2, operation3]));
      expect(store.getState().multisigs.pendingOperations).toEqual({
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
      });
    });
  });

  describe("addMultisigLabel", () => {
    it("sets the multisig label", () => {
      const { pkh } = mockContractAddress(0);
      store.dispatch(multisigActions.addMultisigLabel({ pkh, label: "test label" }));

      expect(store.getState().multisigs.labelsMap).toEqual({ [pkh]: "test label" });
    });
  });

  describe("removeMultisigsData", () => {
    beforeEach(() => {
      store.dispatch(
        multisigActions.setMultisigs([
          mockMultisigAccount(0),
          mockMultisigAccount(1),
          mockMultisigAccount(2),
        ])
      );
    });

    it("does not removes multisigs", () => {
      store.dispatch(
        multisigActions.removeMultisigsData([
          mockContractAddress(0).pkh,
          mockContractAddress(2).pkh,
        ])
      );

      expect(store.getState().multisigs.items).toEqual([
        mockMultisigAccount(0),
        mockMultisigAccount(1),
        mockMultisigAccount(2),
      ]);
    });

    it("removes labels", () => {
      store.dispatch(
        multisigActions.addMultisigLabel({ pkh: mockContractAddress(0).pkh, label: "Multisig 0" })
      );
      store.dispatch(
        multisigActions.addMultisigLabel({ pkh: mockContractAddress(1).pkh, label: "Multisig 1" })
      );

      store.dispatch(
        multisigActions.removeMultisigsData([
          mockContractAddress(0).pkh,
          mockContractAddress(2).pkh,
        ])
      );

      expect(store.getState().multisigs.labelsMap).toEqual({
        [mockContractAddress(1).pkh]: "Multisig 1",
      });
    });

    it("removes pending operations", () => {
      // pending operations for multisig 0 (bigmapId: 0)
      const operation1 = multisigOperationFixture;
      const operation2 = { ...multisigOperationFixture, id: "2" };
      // pending operation for multisig 1
      const operation3 = { ...multisigOperationFixture, bigmapId: 1 };
      store.dispatch(multisigActions.setPendingOperations([operation1, operation2, operation3]));

      store.dispatch(
        multisigActions.removeMultisigsData([
          mockContractAddress(0).pkh,
          mockContractAddress(2).pkh,
        ])
      );

      expect(store.getState().multisigs.pendingOperations).toEqual({
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
      });
    });
  });
});
