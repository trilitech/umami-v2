import { ExtendedPeerInfo, NetworkType } from "@airgap/beacon-wallet";
import { waitFor } from "@testing-library/react";

import { useRemoveAccountsDependencies } from "./removeAccountDependenciesHooks";
import { mockImplicitAccount, mockMnemonicAccount, mockTezOperation } from "../../mocks/factories";
import { dispatchMockAccounts } from "../../mocks/helpers";
import { act, renderHook } from "../../mocks/testUtils";
import { makeAccountOperations } from "../../types/AccountOperations";
import { GHOSTNET, MAINNET } from "../../types/Network";
import { WalletClient } from "../beacon/WalletClient";
import { batchesActions } from "../redux/slices/batches";
import { beaconActions } from "../redux/slices/beaconSlice";
import { store } from "../redux/store";

beforeEach(() => {
  jest.spyOn(WalletClient, "getPeers").mockResolvedValue([]);
});

describe("useRemoveAccountsDependencies", () => {
  it("removes batches related to the given accounts", () => {
    const accountOperations1 = makeAccountOperations(
      mockImplicitAccount(1),
      mockImplicitAccount(1),
      [mockTezOperation(0), mockTezOperation(1)]
    );
    const accountOperations2 = makeAccountOperations(
      mockImplicitAccount(2),
      mockImplicitAccount(2),
      [mockTezOperation(1), mockTezOperation(3)]
    );
    const accountOperations3 = makeAccountOperations(
      mockImplicitAccount(3),
      mockImplicitAccount(3),
      [mockTezOperation(0)]
    );
    store.dispatch(batchesActions.add({ operations: accountOperations1, network: MAINNET }));
    store.dispatch(batchesActions.add({ operations: accountOperations2, network: MAINNET }));
    store.dispatch(batchesActions.add({ operations: accountOperations3, network: GHOSTNET }));

    const {
      result: { current: removeAccountsDependencies },
    } = renderHook(() => useRemoveAccountsDependencies());
    removeAccountsDependencies([mockImplicitAccount(2), mockImplicitAccount(3)]);

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
        accountPkh: mockMnemonicAccount(1).address.pkh,
        networkType: NetworkType.MAINNET,
      },
      {
        dAppId: peersData[1].senderId,
        accountPkh: mockMnemonicAccount(2).address.pkh,
        networkType: NetworkType.GHOSTNET,
      },
      {
        dAppId: peersData[2].senderId,
        accountPkh: mockMnemonicAccount(3).address.pkh,
        networkType: NetworkType.CUSTOM,
      },
    ];

    beforeEach(() => {
      dispatchMockAccounts([
        mockMnemonicAccount(1),
        mockMnemonicAccount(2),
        mockMnemonicAccount(3),
      ]);
      connections.forEach(connection => {
        store.dispatch(beaconActions.addConnection(connection));
      });
      jest.spyOn(WalletClient, "getPeers").mockResolvedValue(peersData as any);
      jest.spyOn(WalletClient, "removePeer").mockResolvedValue();
    });

    it("sends delete requests through the beacon api", async () => {
      const {
        result: { current: removeAccountsDependencies },
      } = renderHook(() => useRemoveAccountsDependencies());

      act(() => removeAccountsDependencies([mockImplicitAccount(1), mockImplicitAccount(3)]));

      await waitFor(() => expect(WalletClient.removePeer).toHaveBeenCalledTimes(2));
      expect(WalletClient.removePeer).toHaveBeenCalledWith(peersData[0]);
      expect(WalletClient.removePeer).toHaveBeenCalledWith(peersData[2]);
    });

    it("removes related connections from the beacon slice", () => {
      const {
        result: { current: removeAccountsDependencies },
      } = renderHook(() => useRemoveAccountsDependencies());

      act(() => removeAccountsDependencies([mockImplicitAccount(1), mockImplicitAccount(3)]));

      expect(store.getState().beacon).toEqual({
        [connections[1].dAppId]: {
          accountPkh: connections[1].accountPkh,
          networkType: connections[1].networkType,
        },
      });
    });
  });
});
