import { renderHook } from "@testing-library/react";

import { useGetConnectedAccount } from "./beaconHooks";
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
