import { NetworkType } from "@airgap/beacon-wallet";

import { beaconActions } from "./beaconSlice";
import {
  mockMnemonicAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../../mocks/factories";
import { RawPkh } from "../../../types/Address";
import { store } from "../store";

describe("Beacon slice", () => {
  const dAppId1 = "test-dAppId-0";
  const dAppId2 = "test-dAppId-1";

  const pkh1 = mockMnemonicAccount(0).address.pkh;
  const pkh2 = mockSocialAccount(1).address.pkh;
  const pkh3 = mockSecretKeyAccount(2).address.pkh;

  const addConnection = (dAppId: string, accountPkh: RawPkh, networkType: NetworkType) =>
    store.dispatch(beaconActions.addConnection({ dAppId, accountPkh, networkType }));

  it("is initialized with empty state by default", () => {
    expect(store.getState().beacon).toEqual({});
  });

  it("adds new connections", () => {
    store.dispatch(
      beaconActions.addConnection({
        dAppId: dAppId1,
        accountPkh: pkh1,
        networkType: NetworkType.MAINNET,
      })
    );
    store.dispatch(
      beaconActions.addConnection({
        dAppId: dAppId2,
        accountPkh: pkh2,
        networkType: NetworkType.GHOSTNET,
      })
    );

    expect(store.getState().beacon).toEqual({
      [dAppId1]: { [pkh1]: NetworkType.MAINNET },
      [dAppId2]: { [pkh2]: NetworkType.GHOSTNET },
    });
  });

  it("can store multiple connections with the same dAppId", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);

    store.dispatch(
      beaconActions.addConnection({
        dAppId: dAppId1,
        accountPkh: pkh3,
        networkType: NetworkType.CUSTOM,
      })
    );

    expect(store.getState().beacon).toEqual({
      [dAppId1]: { [pkh1]: NetworkType.MAINNET, [pkh3]: NetworkType.CUSTOM },
      [dAppId2]: { [pkh2]: NetworkType.GHOSTNET },
    });
  });

  it("removes account record on removing connection", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);
    addConnection(dAppId1, pkh3, NetworkType.CUSTOM);

    store.dispatch(beaconActions.removeConnection({ dAppId: dAppId1, accountPkh: pkh1 }));

    expect(store.getState().beacon).toEqual({
      [dAppId1]: { [pkh3]: NetworkType.CUSTOM },
      [dAppId2]: { [pkh2]: NetworkType.GHOSTNET },
    });
  });

  it("removes dApp record on removing connections", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);

    store.dispatch(beaconActions.removeConnection({ dAppId: dAppId1, accountPkh: pkh1 }));

    expect(store.getState().beacon).toEqual({
      [dAppId2]: { [pkh2]: NetworkType.GHOSTNET },
    });
  });

  it("replace connections with the same dAppId & accountPkh", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);

    store.dispatch(
      beaconActions.addConnection({
        dAppId: dAppId1,
        accountPkh: pkh1,
        networkType: NetworkType.CUSTOM,
      })
    );

    expect(store.getState().beacon).toEqual({
      [dAppId1]: { [pkh1]: NetworkType.CUSTOM },
      [dAppId2]: { [pkh2]: NetworkType.GHOSTNET },
    });
  });

  it("resets the state", () => {
    addConnection(dAppId1, pkh1, NetworkType.MAINNET);
    addConnection(dAppId2, pkh2, NetworkType.GHOSTNET);

    store.dispatch(beaconActions.reset());

    expect(store.getState().beacon).toEqual({});
  });
});
