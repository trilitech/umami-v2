import { decodePayload } from "./decodePayload";

describe("decodePayload", () => {
  it("decodes a valid payload with '0501' prefix and padding", () => {
    const payload =
      "05010000004254657a6f73205369676e6564204d6573736167653a206d79646170702e636f6d20323032312d30312d31345431353a31363a30345a2048656c6c6f20776f726c6421";
    const expected = "Tezos Signed Message: mydapp.com 2021-01-14T15:16:04Z Hello world!";
    expect(decodePayload(payload)).toEqual(expected);
  });

  it("decodes a payload without '0501' prefix", () => {
    const payload =
      "54657a6f73205369676e6564204d6573736167653a206d79646170702e636f6d20323032312d30312d31345431353a31363a30345a2048656c6c6f20776f726c6421";
    const expected = "Tezos Signed Message: mydapp.com 2021-01-14T15:16:04Z Hello world!";
    expect(decodePayload(payload)).toEqual(expected);
  });

  it("returns original payload if length is invalid", () => {
    const payload = "05010000005254657a6f73205369676e6564204d6573736167653a20696e76616c69642e";
    expect(decodePayload(payload)).toEqual(payload);
  });

  it("returns original payload if an error occurs during decoding", () => {
    const invalidPayload = "0501000000";
    expect(decodePayload(invalidPayload)).toEqual(invalidPayload);
  });

  it("handles an empty payload", () => {
    const emptyPayload = "";
    expect(decodePayload(emptyPayload)).toEqual(emptyPayload);
  });

  it("handles a payload with non-hex characters", () => {
    const nonHexPayload = "0501ZZZZ";
    expect(decodePayload(nonHexPayload)).toEqual(nonHexPayload);
  });
});
