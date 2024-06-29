import { prettyTezAmount, truncate } from "./format";

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
