import { buildTzktAddressUrl } from "./helpers";

test("buildTzktUrl returns the right value for a given network", () => {
  expect(buildTzktAddressUrl("ghostnet", "mockAddress")).toEqual(
    "https://ghostnet.tzkt.io/mockAddress"
  );
  expect(buildTzktAddressUrl("mainnet", "mockAddress")).toEqual("https://tzkt.io/mockAddress");
});
