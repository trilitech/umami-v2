import { ExtendedPeerInfo, NetworkType } from "@airgap/beacon-wallet";
import { waitFor } from "@testing-library/react";

import { useRemoveDependenciesAndMultisigs } from "./removeAccountDependenciesHooks";
import { mockImplicitAccount, mockMultisigAccount, mockTezOperation } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { multisigOperation } from "../../mocks/multisig";
import { act, renderHook } from "../../mocks/testUtils";
import { makeAccountOperations } from "../../types/AccountOperations";
import { GHOSTNET, MAINNET } from "../../types/Network";
import { WalletClient } from "../beacon/WalletClient";
import { assetsActions } from "../redux/slices/assetsSlice";
import { batchesActions } from "../redux/slices/batches";
import { beaconActions } from "../redux/slices/beaconSlice";
import { multisigActions } from "../redux/slices/multisigsSlice";
import { store } from "../redux/store";

beforeEach(() => {
  jest.spyOn(WalletClient, "getPeers").mockResolvedValue([]);
});

describe("useRemoveDependenciesAndMultisigs", () => {
  describe("without dependant multisigs", () => {
    const account0 = mockImplicitAccount(0);
    const account1 = mockImplicitAccount(1);
    const account2 = mockImplicitAccount(2);

    it("removes batches related to the given accounts", () => {
      const accountOperations1 = makeAccountOperations(account0, mockImplicitAccount(0), [
        mockTezOperation(0),
        mockTezOperation(1),
      ]);
      const accountOperations2 = makeAccountOperations(account1, mockImplicitAccount(1), [
        mockTezOperation(1),
        mockTezOperation(3),
      ]);
      const accountOperations3 = makeAccountOperations(account2, mockImplicitAccount(2), [
        mockTezOperation(0),
      ]);
      store.dispatch(batchesActions.add({ operations: accountOperations1, network: MAINNET }));
      store.dispatch(batchesActions.add({ operations: accountOperations2, network: MAINNET }));
      store.dispatch(batchesActions.add({ operations: accountOperations3, network: GHOSTNET }));

      const {
        result: { current: removeAccountsDependencies },
      } = renderHook(() => useRemoveDependenciesAndMultisigs());
      act(() => removeAccountsDependencies([account1, account2]));

      expect(store.getState().batches[MAINNET.name]).toEqual([accountOperations1]);
      expect(store.getState().batches[GHOSTNET.name]).toEqual([]);
    });

    describe("for peers", () => {
      const peersData: ExtendedPeerInfo[] = [
        {
          name: "dApp-1",
          publicKey: "e15835f5b7bb7fae5a3ddbe3c71b3cdd9ee0a5ea2586f04e7669e9040f61810c",
          senderId: "2MqUhvyAJy3UY",
          type: "p2p-pairing-request",
          id: "test-id-1",
          version: "v1",
        },
        {
          name: "dApp-2",
          publicKey: "e15835f5b7bb7fae5a3ddbe3c71b3cdd9ee0a5ea2586f04e7669e9040f61810b",
          senderId: "2UJwaEUy23W3g",
          type: "p2p-pairing-request",
          id: "test-id-2",
          version: "v1.5",
        },
        {
          name: "dApp-3",
          publicKey: "e15835f5b7bb7fae5a3ddbe3c71b3cdd9ee0a5ea2586f04e7669e9040f61810a",
          senderId: "3obHXJP1D8QrB",
          type: "p2p-pairing-request",
          id: "test-id-3",
          version: "v2",
        },
      ];
      const connections = [
        {
          dAppId: peersData[0].senderId,
          accountPkh: account0.address.pkh,
          networkType: NetworkType.MAINNET,
        },
        {
          dAppId: peersData[1].senderId,
          accountPkh: account1.address.pkh,
          networkType: NetworkType.GHOSTNET,
        },
        {
          dAppId: peersData[2].senderId,
          accountPkh: account2.address.pkh,
          networkType: NetworkType.CUSTOM,
        },
      ];

      beforeEach(() => {
        connections.forEach(connection => {
          store.dispatch(beaconActions.addConnection(connection));
        });
        jest.spyOn(WalletClient, "getPeers").mockResolvedValue(peersData as any);
        jest.spyOn(WalletClient, "removePeer").mockResolvedValue();
      });

      it("sends delete requests through the beacon api", async () => {
        const {
          result: { current: removeAccountsDependencies },
        } = renderHook(() => useRemoveDependenciesAndMultisigs());

        act(() => removeAccountsDependencies([account0, account2]));

        await waitFor(() => expect(WalletClient.removePeer).toHaveBeenCalledTimes(2));
        expect(WalletClient.removePeer).toHaveBeenCalledWith(peersData[0]);
        expect(WalletClient.removePeer).toHaveBeenCalledWith(peersData[2]);
      });

      it("removes related connections from the beacon slice", () => {
        const {
          result: { current: removeAccountsDependencies },
        } = renderHook(() => useRemoveDependenciesAndMultisigs());

        act(() => removeAccountsDependencies([account0, account2]));

        expect(store.getState().beacon).toEqual({
          [connections[1].dAppId]: {
            accountPkh: connections[1].accountPkh,
            networkType: connections[1].networkType,
          },
        });
      });
    });

    it("removes assets data directly related to the given accounts", () => {
      store.dispatch(
        assetsActions.updateTezBalance([
          { address: account0.address.pkh, balance: 11, delegationLevel: 1 },
          { address: account1.address.pkh, balance: 22, delegationLevel: 2 },
          { address: account2.address.pkh, balance: 33, delegationLevel: 3 },
        ])
      );

      const {
        result: { current: removeAccountsDependencies },
      } = renderHook(() => useRemoveDependenciesAndMultisigs());
      act(() => removeAccountsDependencies([account0, account2]));

      expect(store.getState().assets.balances.mutez).toEqual({
        [account1.address.pkh]: "22",
      });
      expect(store.getState().assets.delegationLevels).toEqual({
        [account1.address.pkh]: 2,
      });
    });
  });

  describe("with dependant multisigs", () => {
    // Only account2 is considered not to be removed.
    const account0 = mockImplicitAccount(0); // account not in storage, being deleted
    const account1 = mockImplicitAccount(1); // account in storage, being deleted
    const account2 = mockImplicitAccount(2); // account in storage, not being deleted
    const account3 = mockImplicitAccount(3); // account not in storage, not being deleted

    // Only multisig1 is considered not to be removed.
    const multisig0 = mockMultisigAccount(0, [account0.address, account1.address]);
    const multisig1 = mockMultisigAccount(1, [
      account1.address,
      account2.address,
      account3.address,
    ]);
    const multisig2 = mockMultisigAccount(2, [account3.address]);

    beforeEach(() => [account1, account2, multisig0, multisig1, multisig2].forEach(addAccount));

    it("does not removes multisigs from the storage", () => {
      const {
        result: { current: removeMultisigs },
      } = renderHook(() => useRemoveDependenciesAndMultisigs());

      act(() => removeMultisigs([account0, account1]));

      expect(store.getState().multisigs.items).toEqual([multisig0, multisig1, multisig2]);
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
      } = renderHook(() => useRemoveDependenciesAndMultisigs());

      act(() => removeMultisigs([account0, account1]));

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
      } = renderHook(() => useRemoveDependenciesAndMultisigs());

      act(() => removeMultisigs([account0, account1]));

      expect(store.getState().multisigs.pendingOperations).toEqual({
        "1": [
          { ...multisigOperation, id: "2", bigmapId: 1 },
          { ...multisigOperation, id: "3", bigmapId: 1 },
        ],
      });
    });

    it("removes batches related to the obsolete multisig accounts", () => {
      const accountOperations1 = makeAccountOperations(multisig0, mockImplicitAccount(0), [
        mockTezOperation(0),
        mockTezOperation(1),
      ]);
      const accountOperations2 = makeAccountOperations(multisig1, mockImplicitAccount(1), [
        mockTezOperation(1),
        mockTezOperation(3),
      ]);
      const accountOperations3 = makeAccountOperations(multisig2, mockImplicitAccount(2), [
        mockTezOperation(0),
      ]);
      store.dispatch(batchesActions.add({ operations: accountOperations1, network: MAINNET }));
      store.dispatch(batchesActions.add({ operations: accountOperations2, network: MAINNET }));
      store.dispatch(batchesActions.add({ operations: accountOperations3, network: GHOSTNET }));

      const {
        result: { current: removeAccountsDependencies },
      } = renderHook(() => useRemoveDependenciesAndMultisigs());
      act(() => removeAccountsDependencies([account0, account1]));

      expect(store.getState().batches[MAINNET.name]).toEqual([accountOperations2]);
      expect(store.getState().batches[GHOSTNET.name]).toEqual([]);
    });

    it("removes assets data directly related to the obsolete multisig accounts", () => {
      store.dispatch(
        assetsActions.updateTezBalance([
          { address: multisig0.address.pkh, balance: 11, delegationLevel: 1 },
          { address: multisig1.address.pkh, balance: 22, delegationLevel: 2 },
          { address: multisig2.address.pkh, balance: 33, delegationLevel: 3 },
        ])
      );

      const {
        result: { current: removeAccountsDependencies },
      } = renderHook(() => useRemoveDependenciesAndMultisigs());
      act(() => removeAccountsDependencies([account0, account1]));

      expect(store.getState().assets.balances.mutez).toEqual({
        [multisig1.address.pkh]: "22",
      });
      expect(store.getState().assets.delegationLevels).toEqual({
        [multisig1.address.pkh]: 2,
      });
    });
  });
});
