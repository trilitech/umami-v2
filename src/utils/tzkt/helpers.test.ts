import { buildTzktUrl } from "./helpers";
import { GHOSTNET, MAINNET } from "../../types/Network";

test("buildTzktUrl returns the right value for a given network", () => {
  expect(buildTzktUrl(GHOSTNET, "mockAddress")).toEqual("https://ghostnet.tzkt.io/mockAddress");
  expect(buildTzktUrl(MAINNET, "mockAddress")).toEqual("https://tzkt.io/mockAddress");
});
