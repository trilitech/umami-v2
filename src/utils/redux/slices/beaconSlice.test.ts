import { beaconActions } from "./beaconSlice";
import {
  mockMnemonicAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../../mocks/factories";
import { store } from "../store";

describe("Beacon slice", () => {
  const DAPP_ID_1 = "test-dAppId-0";
  const DAPP_ID_2 = "test-dAppId-1";

  const pkh1 = mockMnemonicAccount(0).address.pkh;
  const pkh2 = mockSocialAccount(1).address.pkh;
  const pkh3 = mockSecretKeyAccount(2).address.pkh;

  it("is initialized with empty state by default", () => {
    expect(store.getState().beacon).toEqual({});
  });

  it("adds new connections", () => {
    store.dispatch(beaconActions.addConnection({ dAppId: DAPP_ID_1, accountPkh: pkh1 }));
    store.dispatch(beaconActions.addConnection({ dAppId: DAPP_ID_2, accountPkh: pkh2 }));

    expect(store.getState().beacon).toEqual({
      [DAPP_ID_1]: pkh1,
      [DAPP_ID_2]: pkh2,
    });
  });

  it("removes connections", () => {
    store.dispatch(beaconActions.addConnection({ dAppId: DAPP_ID_1, accountPkh: pkh1 }));
    store.dispatch(beaconActions.addConnection({ dAppId: DAPP_ID_2, accountPkh: pkh2 }));

    store.dispatch(beaconActions.removeConnection({ dAppId: DAPP_ID_1 }));

    expect(store.getState().beacon).toEqual({
      [DAPP_ID_2]: pkh2,
    });
  });

  it("replaces connections with the same dAppId", () => {
    store.dispatch(beaconActions.addConnection({ dAppId: DAPP_ID_1, accountPkh: pkh1 }));
    store.dispatch(beaconActions.addConnection({ dAppId: DAPP_ID_2, accountPkh: pkh2 }));

    store.dispatch(beaconActions.addConnection({ dAppId: DAPP_ID_1, accountPkh: pkh3 }));

    expect(store.getState().beacon).toEqual({
      [DAPP_ID_1]: pkh3,
      [DAPP_ID_2]: pkh2,
    });
  });

  it("resets the state", () => {
    store.dispatch(beaconActions.addConnection({ dAppId: DAPP_ID_1, accountPkh: pkh1 }));
    store.dispatch(beaconActions.addConnection({ dAppId: DAPP_ID_2, accountPkh: pkh2 }));

    store.dispatch(beaconActions.reset());

    expect(store.getState().beacon).toEqual({});
  });
});
