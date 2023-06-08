import { decode } from "./decodeLambda";
import {
  simpleFa1,
  simpleTez,
  tezAndTezard,
  tezAndTezardWithInvalidDataInBetween,
  tezzard,
  threeTez,
} from "./storageExamples";

describe("decodeLambda", () => {
  test("invalid michelsonJSON batch (no head)", () => {
    const singleTezNoHead = [
      {
        prim: "PUSH",
        args: [
          { prim: "key_hash" },
          { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" },
        ],
      },
      { prim: "IMPLICIT_ACCOUNT" },
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "732000" }] },
      { prim: "UNIT" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
    ];

    expect(() => decode(singleTezNoHead)).toThrowError(
      /Invalid literal value/i
    );
  });

  test("batch with a single tez transaction", () => {
    const result = decode(simpleTez);

    expect(result).toEqual([
      {
        amount: "220000",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        type: "tez",
      },
    ]);
  });

  test("batch with a single FA2 transaction", () => {
    const result = decode(tezzard);
    const expected = [
      {
        amount: "1",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        sender: "KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm",
        tokenId: "6",
        type: "fa2",
      },
    ];
    expect(result).toEqual(expected);
  });

  test("batch with a single FA1 transaction", () => {
    const result = decode(simpleFa1);
    const expected = [
      {
        amount: "300",
        contract: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
        recipient: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        sender: "KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm",
        type: "fa1.2",
      },
    ];
    expect(result).toEqual(expected);
  });

  test("batch with three tez", () => {
    const result = decode(threeTez);
    const expected = [
      {
        amount: "1000",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        type: "tez",
      },
      {
        amount: "2000",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        type: "tez",
      },
      {
        amount: "3000",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        type: "tez",
      },
    ];
    expect(result).toEqual(expected);
  });

  test("batch with three tez transactions but 1st one is malformed and ignored", () => {
    const invalidThreeTez = JSON.parse(JSON.stringify(threeTez));
    invalidThreeTez[3] = { foo: "bar" };
    const result = decode(invalidThreeTez);
    const expected = [
      {
        amount: "2000",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        type: "tez",
      },
      {
        amount: "3000",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        type: "tez",
      },
    ];
    expect(result).toEqual(expected);
  });

  test("batch with tez, tezard, tez", () => {
    const result = decode(tezAndTezard);
    const expected = [
      {
        amount: "732000",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        type: "tez",
      },
      {
        amount: "77",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        sender: "KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm",
        tokenId: "6",
        type: "fa2",
      },
      {
        amount: "220000",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        type: "tez",
      },
    ];
    expect(result).toEqual(expected);
  });

  test("invalid values in between valid tokens are ignored", () => {
    const result = decode(tezAndTezardWithInvalidDataInBetween);
    const expected = [
      {
        amount: "732000",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        type: "tez",
      },
      {
        amount: "77",
        contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        sender: "KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm",
        tokenId: "6",
        type: "fa2",
      },
      {
        amount: "220000",
        recipient: "tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6",
        type: "tez",
      },
    ];
    expect(result).toEqual(expected);
  });
});
