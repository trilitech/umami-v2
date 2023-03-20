import BigNumber from "bignumber.js";
import { getTotalBalance } from "./accountUtils";

describe("getTotalBalance", () => {
  test("getTotalBalance returns the right value", () => {
    const result = getTotalBalance({
      foo: {
        tez: new BigNumber(40),
        tokens: [],
      },
      bar: {
        tez: null,
        tokens: [],
      },
      baz: {
        tez: new BigNumber(60),
        tokens: [],
      },
    });

    expect(result).toEqual(new BigNumber(100));
  });

  test("these edge cases should return null", () => {
    expect(getTotalBalance({})).toEqual(null);
    expect(
      getTotalBalance({
        foo: {
          tokens: [],
          tez: null,
        },
        bar: {
          tokens: [],
          tez: null,
        },
      })
    ).toEqual(null);
  });
});
