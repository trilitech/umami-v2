import { TezosNetwork } from "@airgap/tezos";
import { buildTzktAddressUrl } from "./helpers";

test("buildTzktUrl returns the right value for a givent network", () => {
  expect(buildTzktAddressUrl(TezosNetwork.GHOSTNET, "mockAddress")).toEqual(
    "https://ghostnet.tzkt.io/mockAddress"
  );
  expect(buildTzktAddressUrl(TezosNetwork.MAINNET, "mockAddress")).toEqual(
    "https://tzkt.io/mockAddress"
  );
});
