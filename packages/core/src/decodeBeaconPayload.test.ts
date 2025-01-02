import { SigningType } from "@airgap/beacon-wallet";

import { decodeBeaconPayload, getSigningTypeFromPayload } from "./decodeBeaconPayload";

describe("decodeBeaconPayload", () => {
  it("returns an error message if the payload is not a valid utf8", () => {
    const payload =
      "05010000004354657a6f73205369676e6564204d6573736167653a20496e76616c696420555446383a20c380c2afc3bfc3bec3bd3b204e6f6e7072696e7461626c653a20000115073b";

    expect(getSigningTypeFromPayload(payload)).toEqual(SigningType.MICHELINE);
    expect(decodeBeaconPayload(payload, SigningType.MICHELINE)).toEqual({
      result: payload,
      error: "Cannot parse Beacon payload",
    });
  });

  it("decodes a valid payload with '0501' prefix and padding", () => {
    const payload =
      "05010000004254657a6f73205369676e6564204d6573736167653a206d79646170702e636f6d20323032312d30312d31345431353a31363a30345a2048656c6c6f20776f726c6421";
    const expected = "Tezos Signed Message: mydapp.com 2021-01-14T15:16:04Z Hello world!";

    expect(getSigningTypeFromPayload(payload)).toEqual(SigningType.MICHELINE);
    expect(decodeBeaconPayload(payload, SigningType.MICHELINE)).toEqual({ result: expected });
  });

  it.each([SigningType.MICHELINE, SigningType.OPERATION])(
    "throws without a valid prefix for %s",
    signingType => {
      const payload =
        "010000004254657a6f73205369676e6564204d6573736167653a206d79646170702e636f6d20323032312d30312d31345431353a31363a30345a2048656c6c6f20776f726c6421";

      expect(decodeBeaconPayload(payload, signingType)).toEqual({
        error: "Cannot parse Beacon payload",
        result:
          "010000004254657a6f73205369676e6564204d6573736167653a206d79646170702e636f6d20323032312d30312d31345431353a31363a30345a2048656c6c6f20776f726c6421",
      });
    }
  );

  it("decodes a raw payload", () => {
    const payload =
      "54657a6f73205369676e6564204d6573736167653a206d79646170702e636f6d20323032312d30312d31345431353a31363a30345a2048656c6c6f20776f726c6421";
    const expected = {
      result: "Tezos Signed Message: mydapp.com 2021-01-14T15:16:04Z Hello world!",
    };
    expect(getSigningTypeFromPayload(payload)).toEqual(SigningType.RAW);
    expect(decodeBeaconPayload(payload, SigningType.RAW)).toEqual(expected);
  });

  it("parses a Michelson expression", () => {
    const raw =
      "95564d877fe9b5d1f90ad501799e63d25ed0f676381b7b4678f404c9e1d8bd9a6c00e7cf51bc4b6068aae1f385c22c85ec281eba46ecac02ddfd940580bd3fe0d403c096b1020000e7cf51bc4b6068aae1f385c22c85ec281eba46ec00";
    const result = JSON.stringify({
      branch: "BLr3xAWdfd7BEnhUXU7vzcTBMy52upMWLiLDvwd8VdHyzKnmho4",
      contents: [
        {
          kind: "transaction",
          source: "tz1gmj9EBXqQqQBmEVaCHBfunPJ67N82YJcz",
          fee: "300",
          counter: "10829533",
          gas_limit: "1040000",
          storage_limit: "60000",
          amount: "5000000",
          destination: "tz1gmj9EBXqQqQBmEVaCHBfunPJ67N82YJcz",
        },
      ],
    });

    expect(getSigningTypeFromPayload(raw)).toEqual(SigningType.RAW);
    expect(decodeBeaconPayload(raw, SigningType.RAW)).toEqual({ result });
  });

  it("returns original payload if length is invalid", () => {
    const payload = "050100000053254657a6f73205369676e6564204d6573736167653a20696e76616c69642e";
    expect(decodeBeaconPayload(payload, SigningType.RAW)).toEqual({
      result: payload,
      error: "Cannot parse Beacon payload",
    });
  });

  it("can parse a message without a body", () => {
    const invalidPayload = "0501000000";
    expect(decodeBeaconPayload(invalidPayload, SigningType.RAW)).toEqual({
      result: '{"branch":"JJhMAmr4o7mqnC","contents":[]}',
    });
  });

  it("handles an empty payload", () => {
    const emptyPayload = "";
    expect(getSigningTypeFromPayload(emptyPayload)).toEqual(SigningType.RAW);
    expect(decodeBeaconPayload(emptyPayload, SigningType.RAW)).toEqual({
      result: emptyPayload,
    });
  });

  it("handles a payload with non-hex characters", () => {
    const nonHexPayload = "0301ZZZZ";
    expect(getSigningTypeFromPayload(nonHexPayload)).toEqual(SigningType.OPERATION);
    expect(decodeBeaconPayload(nonHexPayload, SigningType.OPERATION)).toEqual({
      error: "Cannot parse Beacon payload",
      result: nonHexPayload,
    });
  });

  it("handles OPERATION payload", () => {
    const emptyPayload = "";
    expect(getSigningTypeFromPayload(emptyPayload)).toEqual(SigningType.RAW);
    expect(decodeBeaconPayload(emptyPayload, SigningType.RAW)).toEqual({
      result: "",
    });
  });
});
