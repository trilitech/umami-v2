import { TezosNetwork } from "@airgap/tezos";
import { mockBaker } from "../../mocks/factories";
import assetsSlice from "../store/assetsSlice";
import { store } from "../store/store";

describe("useBakerList", () => {
  it("should return bakers on mainnet", () => {
    store.dispatch(assetsSlice.actions.updateNetwork(TezosNetwork.MAINNET));
    store.dispatch(assetsSlice.actions.updateBakers([mockBaker(1), mockBaker(2)]));
  });

  it("should return empty list on ghostnet", () => {
    store.dispatch(assetsSlice.actions.updateNetwork(TezosNetwork.GHOSTNET));
    store.dispatch(assetsSlice.actions.updateBakers([mockBaker(1), mockBaker(2)]));
  });
});
