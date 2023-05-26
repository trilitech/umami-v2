import BigNumber from "bignumber.js";
import { getTotalTezBalance } from "./accountUtils";

describe("getTotalTezBalance", () => {
  test("getTotalTEzBalance returns the right value", () => {
    const result = getTotalTezBalance({
      foo: "40",
      bar: undefined,
      baz: "60",
    });

    expect(result).toEqual(new BigNumber(100));
  });

  test("these edge cases should return null", () => {
    expect(getTotalTezBalance({})).toEqual(null);
    expect(
      getTotalTezBalance({
        foo: undefined,
        bar: undefined,
      })
    ).toEqual(null);
  });
});
