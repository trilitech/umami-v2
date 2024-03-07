import { NetworkType } from "@airgap/beacon-wallet";

import {
  useAddConnection,
  useGetConnectedAccounts,
  useGetConnectionNetworkType,
  useRemoveConnection,
  useResetConnections,
} from "./beaconHooks";
import {
  mockMnemonicAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../mocks/factories";
import { renderHook } from "../../mocks/testUtils";
import { RawPkh } from "../../types/Address";
import { beaconActions } from "../redux/slices/beaconSlice";
import { store } from "../redux/store";

const dAppId1 = "test-dAppId-0";
const dAppId2 = "test-dAppId-1";

const pkh1 = mockMnemonicAccount(0).address.pkh;
const pkh2 = mockSocialAccount(1).address.pkh;
const pkh3 = mockSecretKeyAccount(2).address.pkh;

const addConnection = (dAppId: string, accountPkh: RawPkh, networkType: NetworkType) =>
  store.dispatch(beaconActions.addConnection({ dAppId, accountPkh, networkType }));

describe("useGetConnectedAccounts", () => {
  it("returns empty list when no connection for dAppId is stored", () => {
    const {
      result: { current: getConnectedAccounts },
    } = renderHook(() => useGetConnectedAccounts());

    expect(getConnectedAccounts(dAppId2)).toEqual([]);
  });

  it("returns connected accounts by given dAppId", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);
    addConnection(dAppId2, pkh3, NetworkType.CUSTOM);

    const {
      result: { current: getConnectedAccounts },
    } = renderHook(() => useGetConnectedAccounts());

    expect(getConnectedAccounts(dAppId2)).toEqual([pkh2, pkh3]);
  });
});

describe("useGetConnectionNetworkType", () => {
  it("returns networkType by given dAppId & accountPkh", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);
    addConnection(dAppId2, pkh3, NetworkType.CUSTOM);

    const {
      result: { current: getConnectionNetworkType },
    } = renderHook(() => useGetConnectionNetworkType());

    expect(getConnectionNetworkType(dAppId2, pkh3)).toEqual(NetworkType.CUSTOM);
  });
});

describe("useResetConnections", () => {
  it("removes all connections from BeaconSlice", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);

    const {
      result: { current: resetBeaconSlice },
    } = renderHook(() => useResetConnections());
    resetBeaconSlice();

    expect(store.getState().beacon).toEqual({});
  });
});

describe("useAddConnection", () => {
  it("adds connection to BeaconSlice", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);

    const {
      result: { current: addConnectionHook },
    } = renderHook(() => useAddConnection());
    addConnectionHook(dAppId2, pkh3, NetworkType.CUSTOM);

    expect(store.getState().beacon).toEqual({
      [dAppId1]: { [pkh1]: NetworkType.MAINNET },
      [dAppId2]: {
        [pkh2]: NetworkType.GHOSTNET,
        [pkh3]: NetworkType.CUSTOM,
      },
    });
  });

  it("overrides connection with the same dAppId & accountPkh", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);

    const {
      result: { current: addConnectionHook },
    } = renderHook(() => useAddConnection());
    addConnectionHook(dAppId1, pkh1, NetworkType.CUSTOM);

    expect(store.getState().beacon).toEqual({
      [dAppId1]: { [pkh1]: NetworkType.CUSTOM },
      [dAppId2]: { [pkh2]: NetworkType.GHOSTNET },
    });
  });
});

describe("useRemoveConnection", () => {
  it("removes connection from BeaconSlice", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);
    addConnection(dAppId1, pkh3, NetworkType.CUSTOM);

    const {
      result: { current: removeConnection },
    } = renderHook(() => useRemoveConnection());
    removeConnection(dAppId1);

    expect(store.getState().beacon).toEqual({
      [dAppId2]: { [pkh2]: NetworkType.GHOSTNET },
    });
  });
});
