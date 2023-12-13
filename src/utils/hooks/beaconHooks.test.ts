import { renderHook } from "@testing-library/react";

import {
  useAddConnection,
  useGetConnectedAccount,
  useRemoveConnection,
  useResetConnections,
} from "./beaconHooks";
import { mockMnemonicAccount, mockSocialAccount } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import { beaconActions } from "../redux/slices/beaconSlice";
import { store } from "../redux/store";

const dAppId1 = "test-dAppId-0";
const dAppId2 = "test-dAppId-1";

const pkh1 = mockMnemonicAccount(0).address.pkh;
const pkh2 = mockSocialAccount(1).address.pkh;

describe("useGetConnectedAccount", () => {
  it("returns undefined when no connection for dAppId is stored", () => {
    const view = renderHook(() => useGetConnectedAccount(dAppId1), {
      wrapper: ReduxStore,
    });

    expect(view.result.current).toBeUndefined();
  });

  it("returns connected account pkh by given dAppId", () => {
    store.dispatch(beaconActions.addConnection({ dAppId: dAppId1, accountPkh: pkh1 }));
    store.dispatch(beaconActions.addConnection({ dAppId: dAppId2, accountPkh: pkh2 }));

    const view = renderHook(() => useGetConnectedAccount(dAppId2), {
      wrapper: ReduxStore,
    });

    expect(view.result.current).toEqual(pkh2);
  });
});

describe("useResetConnections", () => {
  it("removes all connections from BeaconSlice", () => {
    store.dispatch(beaconActions.addConnection({ dAppId: dAppId1, accountPkh: pkh1 }));
    store.dispatch(beaconActions.addConnection({ dAppId: dAppId2, accountPkh: pkh2 }));

    const { result: resetBeaconSlice } = renderHook(() => useResetConnections(), {
      wrapper: ReduxStore,
    });
    resetBeaconSlice.current();

    expect(store.getState().beacon).toEqual({});
  });
});

describe("useAddConnection", () => {
  it("adds connection to BeaconSlice", () => {
    store.dispatch(beaconActions.addConnection({ dAppId: dAppId1, accountPkh: pkh1 }));

    const { result: addConnection } = renderHook(() => useAddConnection(), {
      wrapper: ReduxStore,
    });
    addConnection.current(dAppId2, pkh2);

    expect(store.getState().beacon).toEqual({
      [dAppId1]: pkh1,
      [dAppId2]: pkh2,
    });
  });

  it("overrides connection with the same dAppId", () => {
    store.dispatch(beaconActions.addConnection({ dAppId: dAppId1, accountPkh: pkh1 }));

    const { result: addConnection } = renderHook(() => useAddConnection(), {
      wrapper: ReduxStore,
    });
    addConnection.current(dAppId1, pkh2);

    expect(store.getState().beacon).toEqual({
      [dAppId1]: pkh2,
    });
  });
});

describe("useRemoveConnection", () => {
  it("removes connection from BeaconSlice", () => {
    store.dispatch(beaconActions.addConnection({ dAppId: dAppId1, accountPkh: pkh1 }));
    store.dispatch(beaconActions.addConnection({ dAppId: dAppId2, accountPkh: pkh2 }));

    const { result: removeConnection } = renderHook(() => useRemoveConnection(), {
      wrapper: ReduxStore,
    });
    removeConnection.current(dAppId2);

    expect(store.getState().beacon).toEqual({
      [dAppId1]: pkh1,
    });
  });
});
