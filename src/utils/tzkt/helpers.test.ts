import { TezosNetwork } from "../../types/Network";
import { buildTzktAddressUrl } from "./helpers";

test("buildTzktUrl returns the right value for a given network", () => {
  expect(buildTzktAddressUrl(TezosNetwork.GHOSTNET, "mockAddress")).toEqual(
    "https://ghostnet.tzkt.io/mockAddress"
  );
  expect(buildTzktAddressUrl(TezosNetwork.MAINNET, "mockAddress")).toEqual(
    "https://tzkt.io/mockAddress"
  );
});
