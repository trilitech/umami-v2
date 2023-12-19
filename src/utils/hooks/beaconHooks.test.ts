import { NetworkType } from "@airgap/beacon-wallet";
import { renderHook } from "@testing-library/react";

import {
  useAddConnection,
  useGetConnectionInfo,
  useRemoveConnection,
  useResetConnections,
} from "./beaconHooks";
import { mockMnemonicAccount, mockSocialAccount } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import { RawPkh } from "../../types/Address";
import { beaconActions } from "../redux/slices/beaconSlice";
import { store } from "../redux/store";

const dAppId1 = "test-dAppId-0";
const dAppId2 = "test-dAppId-1";

const pkh1 = mockMnemonicAccount(0).address.pkh;
const pkh2 = mockSocialAccount(1).address.pkh;

const addConnection = (dAppId: string, accountPkh: RawPkh, networkType: NetworkType) =>
  store.dispatch(beaconActions.addConnection({ dAppId, accountPkh, networkType }));

const connectionInfo = (accountPkh: RawPkh, networkType: NetworkType) => ({
  accountPkh,
  networkType,
});

describe("useGetConnectedAccount", () => {
  it("returns undefined when no connection for dAppId is stored", () => {
    const view = renderHook(() => useGetConnectionInfo(dAppId1), {
      wrapper: ReduxStore,
    });

    expect(view.result.current).toBeUndefined();
  });

  it("returns connected account pkh by given dAppId", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);

    const view = renderHook(() => useGetConnectionInfo(dAppId2), {
      wrapper: ReduxStore,
    });

    expect(view.result.current).toEqual(connectionInfo(pkh2, NetworkType.GHOSTNET));
  });
});

describe("useResetConnections", () => {
  it("removes all connections from BeaconSlice", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);

    const {
      result: { current: resetBeaconSlice },
    } = renderHook(() => useResetConnections(), {
      wrapper: ReduxStore,
    });
    resetBeaconSlice();

    expect(store.getState().beacon).toEqual({});
  });
});

describe("useAddConnection", () => {
  it("adds connection to BeaconSlice", () => {
    addConnection(dAppId1, pkh1, NetworkType.GHOSTNET);

    const {
      result: { current: addConnectionHook },
    } = renderHook(() => useAddConnection(), {
      wrapper: ReduxStore,
    });
    addConnectionHook(dAppId2, pkh2, NetworkType.MAINNET);

    expect(store.getState().beacon).toEqual({
      [dAppId1]: connectionInfo(pkh1, NetworkType.GHOSTNET),
      [dAppId2]: connectionInfo(pkh2, NetworkType.MAINNET),
    });
  });

  it("overrides connection with the same dAppId", () => {
    addConnection(dAppId1, pkh1, NetworkType.GHOSTNET);

    const {
      result: { current: addConnectionHook },
    } = renderHook(() => useAddConnection(), {
      wrapper: ReduxStore,
    });
    addConnectionHook(dAppId1, pkh2, NetworkType.MAINNET);

    expect(store.getState().beacon).toEqual({
      [dAppId1]: connectionInfo(pkh2, NetworkType.MAINNET),
    });
  });
});

describe("useRemoveConnection", () => {
  it("removes connection from BeaconSlice", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);

    const {
      result: { current: removeConnection },
    } = renderHook(() => useRemoveConnection(), {
      wrapper: ReduxStore,
    });
    removeConnection(dAppId2);

    expect(store.getState().beacon).toEqual({
      [dAppId1]: connectionInfo(pkh1, NetworkType.MAINNET),
    });
  });
});
