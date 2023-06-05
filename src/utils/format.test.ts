import { truncate } from "./format";

describe("truncate", () => {
  it("should leave the text untouched if it's shorter than the limit", () => {
    expect(truncate("some text", 20)).toEqual("some text");
  });

  it("should shrink the text to fit into the limit", () => {
    expect(truncate("some text", 5)).toEqual("so...");
  });
});
