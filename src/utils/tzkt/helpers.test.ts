import { GHOSTNET, MAINNET } from "../../types/Network";
import { buildTzktAddressUrl } from "./helpers";

test("buildTzktUrl returns the right value for a given network", () => {
  expect(buildTzktAddressUrl(GHOSTNET, "mockAddress")).toEqual(
    "https://ghostnet.tzkt.io/mockAddress"
  );
  expect(buildTzktAddressUrl(MAINNET, "mockAddress")).toEqual("https://tzkt.io/mockAddress");
});
