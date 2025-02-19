import { formatTezAmountMin0Decimals, formatUsdAmount, prettyTezAmount, truncate } from "./format";

describe("truncate", () => {
  it("should leave the text untouched if it's shorter than the limit", () => {
    expect(truncate("some text", 20)).toEqual("some text");
  });

  it("should shrink the text to fit into the limit", () => {
    expect(truncate("some text", 5)).toEqual("so...");
  });
});

test("prettyTezAmount displays 6 digits after the decimal point", () => {
  expect(prettyTezAmount("1000000")).toBe("1.000000 ꜩ");
  expect(prettyTezAmount("123")).toBe("0.000123 ꜩ");
  expect(prettyTezAmount("10000123")).toBe("10.000123 ꜩ");
  expect(prettyTezAmount("1000000123")).toBe("1,000.000123 ꜩ");
});

test("formatTezAmountMin0Decimals displays 0 decimals", () => {
  expect(formatTezAmountMin0Decimals("1000000")).toBe("1 ꜩ");
  expect(formatTezAmountMin0Decimals("123")).toBe("0.000123 ꜩ");
  expect(formatTezAmountMin0Decimals("10001230")).toBe("10.00123 ꜩ");
  expect(formatTezAmountMin0Decimals("1000012300")).toBe("1,000.0123 ꜩ");
});

test("formatUsdAmount displays USD currency", () => {
  expect(formatUsdAmount("1000000")).toBe("$1,000,000.00");
  expect(formatUsdAmount("12.3")).toBe("$12.30");
  expect(formatUsdAmount("100012.30")).toBe("$100,012.30");
  expect(formatUsdAmount("1000012.300")).toBe("$1,000,012.30");
});
