import { decode, parseRawMichelson } from "./decodeLambda";
import type { MichelsonV1Expression } from "@taquito/rpc";
import { parseContractPkh, parseImplicitPkh } from "../../types/Address";
import { UnrecognizedMichelsonError } from "./UnrecognizedMichelsonError";

describe("decodeLambda", () => {
  test("invalid michelsonJSON batch (no head)", () => {
    const singleTezNoHead = [
      {
        prim: "PUSH",
        args: [{ prim: "key_hash" }, { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" }],
      },
      { prim: "IMPLICIT_ACCOUNT" },
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "732000" }] },
      { prim: "UNIT" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
    ];

    expect(() => decode(singleTezNoHead)).toThrowError(/Invalid literal value/i);
  });

  test("simple tez", () => {
    const input = [
      { prim: "DROP" },
      { prim: "NIL", args: [{ prim: "operation" }] },
      {
        prim: "PUSH",
        args: [{ prim: "key_hash" }, { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" }],
      },
      { prim: "IMPLICIT_ACCOUNT" },
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "910000" }] },
      { prim: "UNIT" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
    ];
    expect(decode(input)).toEqual([
      {
        amount: "910000",
        recipient: parseImplicitPkh("tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6"),
        type: "tez",
      },
    ]);
  });

  test("tez to contract", () => {
    const input = [
      { prim: "DROP" },
      { prim: "NIL", args: [{ prim: "operation" }] },
      {
        prim: "PUSH",
        args: [
          { prim: "address" },
          {
            bytes: "0156cb5559a8d8c945944e71edec63dd04a8e76b87007472616e73666572",
          },
        ],
      },
      { prim: "CONTRACT", args: [{ prim: "unit" }] },
      [
        {
          prim: "IF_NONE",
          args: [[[{ prim: "UNIT" }, { prim: "FAILWITH" }]], []],
        },
      ],
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "5" }] },
      { prim: "UNIT" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
    ];
    expect(decode(input)).toEqual([
      {
        type: "tez",
        amount: "5",
        recipient: parseContractPkh("KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob"),
      },
    ]);
  });

  test("simple fa2", () => {
    const input = [
      { prim: "DROP" },
      { prim: "NIL", args: [{ prim: "operation" }] },
      {
        prim: "PUSH",
        args: [
          { prim: "address" },
          {
            bytes: "0156cb5559a8d8c945944e71edec63dd04a8e76b87007472616e73666572",
          },
        ],
      },
      {
        prim: "CONTRACT",
        args: [
          {
            prim: "list",
            args: [
              {
                prim: "pair",
                args: [
                  { prim: "address", annots: ["%from_"] },
                  {
                    prim: "list",
                    annots: ["%txs"],
                    args: [
                      {
                        prim: "pair",
                        args: [
                          { prim: "address", annots: ["%to_"] },
                          {
                            prim: "pair",
                            args: [
                              { prim: "nat", annots: ["%token_id"] },
                              { prim: "nat", annots: ["%amount"] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      [
        {
          prim: "IF_NONE",
          args: [[{ prim: "UNIT" }, { prim: "FAILWITH" }], []],
        },
      ],
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
      {
        prim: "PUSH",
        args: [
          {
            prim: "list",
            args: [
              {
                prim: "pair",
                args: [
                  { prim: "address", annots: ["%from_"] },
                  {
                    prim: "list",
                    annots: ["%txs"],
                    args: [
                      {
                        prim: "pair",
                        args: [
                          { prim: "address" },
                          {
                            prim: "pair",
                            args: [
                              { prim: "nat", annots: ["%token_id"] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          [
            {
              prim: "Pair",
              args: [
                { bytes: "018e368c2083bdaef3199bae317d6c967c21d947b300" },
                [
                  {
                    prim: "Pair",
                    args: [
                      { bytes: "0000e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e" },
                      { prim: "Pair", args: [{ int: "6" }, { int: "1" }] },
                    ],
                  },
                ],
              ],
            },
          ],
        ],
      },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
    ];
    const result = decode(input);
    const expected = [
      {
        amount: "1",
        contract: parseContractPkh("KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob"),
        recipient: parseImplicitPkh("tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS"),
        sender: parseContractPkh("KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm"),
        tokenId: "6",
        type: "fa2",
      },
    ];
    expect(result).toEqual(expected);
  });

  test("multiple tez", () => {
    const input = [
      { prim: "DROP" },
      { prim: "NIL", args: [{ prim: "operation" }] },
      {
        prim: "PUSH",
        args: [{ prim: "key_hash" }, { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" }],
      },
      { prim: "IMPLICIT_ACCOUNT" },
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "20000" }] },
      { prim: "UNIT" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
      {
        prim: "PUSH",
        args: [{ prim: "key_hash" }, { bytes: "00e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e" }],
      },
      { prim: "IMPLICIT_ACCOUNT" },
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "33333" }] },
      { prim: "UNIT" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
    ];

    expect(decode(input)).toEqual([
      {
        amount: "20000",
        recipient: parseImplicitPkh("tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6"),
        type: "tez",
      },
      {
        amount: "33333",
        recipient: parseImplicitPkh("tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS"),
        type: "tez",
      },
    ]);
  });

  test("tez and fa2", () => {
    const input = [
      { prim: "DROP" },
      { prim: "NIL", args: [{ prim: "operation" }] },
      {
        prim: "PUSH",
        args: [{ prim: "key_hash" }, { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" }],
      },
      { prim: "IMPLICIT_ACCOUNT" },
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "600000" }] },
      { prim: "UNIT" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
      {
        prim: "PUSH",
        args: [
          { prim: "address" },
          {
            bytes: "0156cb5559a8d8c945944e71edec63dd04a8e76b87007472616e73666572",
          },
        ],
      },
      {
        prim: "CONTRACT",
        args: [
          {
            prim: "list",
            args: [
              {
                prim: "pair",
                args: [
                  { prim: "address", annots: ["%from_"] },
                  {
                    prim: "list",
                    annots: ["%txs"],
                    args: [
                      {
                        prim: "pair",
                        args: [
                          { prim: "address", annots: ["%to_"] },
                          {
                            prim: "pair",
                            args: [
                              { prim: "nat", annots: ["%token_id"] },
                              { prim: "nat", annots: ["%amount"] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      [
        {
          prim: "IF_NONE",
          args: [[{ prim: "UNIT" }, { prim: "FAILWITH" }], []],
        },
      ],
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
      {
        prim: "PUSH",
        args: [
          {
            prim: "list",
            args: [
              {
                prim: "pair",
                args: [
                  { prim: "address", annots: ["%from_"] },
                  {
                    prim: "list",
                    annots: ["%txs"],
                    args: [
                      {
                        prim: "pair",
                        args: [
                          { prim: "address", annots: ["%to_"] },
                          {
                            prim: "pair",
                            args: [
                              { prim: "nat", annots: ["%token_id"] },
                              { prim: "nat", annots: ["%amount"] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          [
            {
              prim: "Pair",
              args: [
                { bytes: "018e368c2083bdaef3199bae317d6c967c21d947b300" },
                [
                  {
                    prim: "Pair",
                    args: [
                      { bytes: "0000e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e" },
                      { prim: "Pair", args: [{ int: "6" }, { int: "1" }] },
                    ],
                  },
                ],
              ],
            },
          ],
        ],
      },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
      {
        prim: "PUSH",
        args: [{ prim: "key_hash" }, { bytes: "00e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e" }],
      },
      { prim: "IMPLICIT_ACCOUNT" },
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "33333" }] },
      { prim: "UNIT" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
    ];

    expect(decode(input)).toEqual([
      {
        amount: "600000",
        recipient: parseImplicitPkh("tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6"),
        type: "tez",
      },
      {
        amount: "1",
        contract: parseContractPkh("KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob"),
        recipient: parseImplicitPkh("tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS"),
        sender: parseContractPkh("KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm"),
        tokenId: "6",
        type: "fa2",
      },
      {
        amount: "33333",
        recipient: parseImplicitPkh("tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS"),
        type: "tez",
      },
    ]);
  });

  test("fa1", () => {
    const input = [
      { prim: "DROP" },
      { prim: "NIL", args: [{ prim: "operation" }] },
      {
        prim: "PUSH",
        args: [
          { prim: "address" },
          {
            bytes: "01d7270a1dd9a8b9ee6b48380fb60dc36a7cd521bb007472616e73666572",
          },
        ],
      },
      {
        prim: "CONTRACT",
        args: [
          {
            prim: "pair",
            args: [
              { prim: "address", annots: [":from"] },
              {
                prim: "pair",
                args: [
                  { prim: "address", annots: [":to"] },
                  { prim: "nat", annots: [":value"] },
                ],
              },
            ],
          },
        ],
      },
      [
        {
          prim: "IF_NONE",
          args: [[{ prim: "UNIT" }, { prim: "FAILWITH" }], []],
        },
      ],
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
      {
        prim: "PUSH",
        args: [
          {
            prim: "pair",
            args: [
              { prim: "address", annots: [":from"] },
              {
                prim: "pair",
                args: [
                  { prim: "address", annots: [":to"] },
                  { prim: "nat", annots: [":value"] },
                ],
              },
            ],
          },
          {
            prim: "Pair",
            args: [
              { bytes: "018e368c2083bdaef3199bae317d6c967c21d947b300" },
              {
                prim: "Pair",
                args: [{ bytes: "0000e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e" }, { int: "300" }],
              },
            ],
          },
        ],
      },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
    ];

    expect(decode(input)).toEqual([
      {
        amount: "300",
        contract: parseContractPkh("KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe"),
        recipient: parseImplicitPkh("tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS"),
        sender: parseContractPkh("KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm"),
        type: "fa1.2",
      },
    ]);
  });

  test("tez, fa1 and fa2", () => {
    const input = [
      { prim: "DROP" },
      { prim: "NIL", args: [{ prim: "operation" }] },
      {
        prim: "PUSH",
        args: [{ prim: "key_hash" }, { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" }],
      },
      { prim: "IMPLICIT_ACCOUNT" },
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "100000" }] },
      { prim: "UNIT" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
      {
        prim: "PUSH",
        args: [
          { prim: "address" },
          {
            bytes: "01d7270a1dd9a8b9ee6b48380fb60dc36a7cd521bb007472616e73666572",
          },
        ],
      },
      {
        prim: "CONTRACT",
        args: [
          {
            prim: "pair",
            args: [
              { prim: "address", annots: [":from"] },
              {
                prim: "pair",
                args: [
                  { prim: "address", annots: [":to"] },
                  { prim: "nat", annots: [":value"] },
                ],
              },
            ],
          },
        ],
      },
      [
        {
          prim: "IF_NONE",
          args: [[{ prim: "UNIT" }, { prim: "FAILWITH" }], []],
        },
      ],
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
      {
        prim: "PUSH",
        args: [
          {
            prim: "pair",
            args: [
              { prim: "address", annots: [":from"] },
              {
                prim: "pair",
                args: [
                  { prim: "address", annots: [":to"] },
                  { prim: "nat", annots: [":value"] },
                ],
              },
            ],
          },
          {
            prim: "Pair",
            args: [
              { bytes: "018e368c2083bdaef3199bae317d6c967c21d947b300" },
              {
                prim: "Pair",
                args: [{ bytes: "0000e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e" }, { int: "300" }],
              },
            ],
          },
        ],
      },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
      {
        prim: "PUSH",
        args: [{ prim: "key_hash" }, { bytes: "005fd0a7ece135cecfd71fcf78cf6656d5047fb980" }],
      },
      { prim: "IMPLICIT_ACCOUNT" },
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "33333" }] },
      { prim: "UNIT" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
      {
        prim: "PUSH",
        args: [
          { prim: "address" },
          {
            bytes: "0156cb5559a8d8c945944e71edec63dd04a8e76b87007472616e73666572",
          },
        ],
      },
      {
        prim: "CONTRACT",
        args: [
          {
            prim: "list",
            args: [
              {
                prim: "pair",
                args: [
                  { prim: "address", annots: ["%from_"] },
                  {
                    prim: "list",
                    annots: ["%txs"],
                    args: [
                      {
                        prim: "pair",
                        args: [
                          { prim: "address", annots: ["%to_"] },
                          {
                            prim: "pair",
                            args: [
                              { prim: "nat", annots: ["%token_id"] },
                              { prim: "nat", annots: ["%amount"] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      [
        {
          prim: "IF_NONE",
          args: [[{ prim: "UNIT" }, { prim: "FAILWITH" }], []],
        },
      ],
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
      {
        prim: "PUSH",
        args: [
          {
            prim: "list",
            args: [
              {
                prim: "pair",
                args: [
                  { prim: "address", annots: ["%from_"] },
                  {
                    prim: "list",
                    annots: ["%txs"],
                    args: [
                      {
                        prim: "pair",
                        args: [
                          { prim: "address", annots: ["%to_"] },
                          {
                            prim: "pair",
                            args: [
                              { prim: "nat", annots: ["%token_id"] },
                              { prim: "nat", annots: ["%amount"] },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          [
            {
              prim: "Pair",
              args: [
                { bytes: "018e368c2083bdaef3199bae317d6c967c21d947b300" },
                [
                  {
                    prim: "Pair",
                    args: [
                      { bytes: "0000e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e" },
                      { prim: "Pair", args: [{ int: "6" }, { int: "1" }] },
                    ],
                  },
                ],
              ],
            },
          ],
        ],
      },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
    ];

    expect(decode(input)).toEqual([
      {
        amount: "100000",
        recipient: parseImplicitPkh("tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6"),
        type: "tez",
      },
      {
        amount: "300",
        contract: parseContractPkh("KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe"),
        recipient: parseImplicitPkh("tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS"),
        sender: parseContractPkh("KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm"),
        type: "fa1.2",
      },
      {
        amount: "33333",
        recipient: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
        type: "tez",
      },
      {
        amount: "1",
        contract: parseContractPkh("KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob"),
        recipient: parseImplicitPkh("tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS"),
        sender: parseContractPkh("KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm"),
        tokenId: "6",
        type: "fa2",
      },
    ]);
  });

  test("throws if cannot parse", () => {
    const input = [
      { prim: "DROP" },
      { prim: "NIL", args: [{ prim: "operation" }] },
      "hello",
      { foo: "bar" },
      {
        prim: "PUSH",
        args: [{ prim: "key_hash" }, { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" }],
      },
      { prim: "IMPLICIT_ACCOUNT" },
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "20000" }] },
      { prim: "UNIT" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
      "foo",
      { hello: "world" },
      {
        prim: "PUSH",
        args: [{ prim: "key_hash" }, { bytes: "00e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e" }],
      },
      { prim: "IMPLICIT_ACCOUNT" },
      { prim: "PUSH", args: [{ prim: "mutez" }, { int: "33333" }] },
      { prim: "UNIT" },
      { prim: "TRANSFER_TOKENS" },
      { prim: "CONS" },
      { bad: "data" },
      "bye",
    ];

    expect(() => decode(input as MichelsonV1Expression[])).toThrow();
  });

  test("remove delegate", () => {
    const input = [
      { prim: "DROP" },
      { prim: "NIL", args: [{ prim: "operation" }] },
      { prim: "NONE", args: [{ prim: "key_hash" }] },
      { prim: "SET_DELEGATE" },
      { prim: "CONS" },
    ];

    expect(decode(input)).toEqual([{ type: "delegation" }]);
  });

  test("set delegate", () => {
    const input = [
      { prim: "DROP" },
      { prim: "NIL", args: [{ prim: "operation" }] },
      {
        prim: "PUSH",
        args: [{ prim: "key_hash" }, { bytes: "0044b31e005479eba6449274d8c6dc423946f97607" }],
      },
      { prim: "SOME" },
      { prim: "SET_DELEGATE" },
      { prim: "CONS" },
    ];

    expect(decode(input)).toEqual([
      { type: "delegation", recipient: parseImplicitPkh("tz1RuHDSj9P7mNNhfKxsyLGRDahTX5QD1DdP") },
    ]);
  });

  test("decode should throw unrecognizedMichelson error", () => {
    const unrecognizableMichelson: MichelsonV1Expression[] = [
      { prim: "DROP" },
      {
        prim: "NIL",
        args: [
          {
            prim: "operation",
          },
        ],
      },
      {
        prim: "PUSH",
        args: [
          {
            prim: "address",
          },
          {
            bytes: "0156cb5559a8d8c945944e71edec63dd04a8e76b87007472616e73666572",
          },
        ],
      },
    ];

    expect(() => decode(unrecognizableMichelson)).toThrow(UnrecognizedMichelsonError);
  });

  test("parseRawMichelson decodes raw michelson", () => {
    const rawMichelson =
      '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"00e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"350000000000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"},{"prim":"PUSH","args":[{"prim":"address"},{"bytes":"01d7270a1dd9a8b9ee6b48380fb60dc36a7cd521bb007472616e73666572"}]},{"prim":"CONTRACT","args":[{"prim":"pair","args":[{"prim":"address","annots":[":from"]},{"prim":"pair","args":[{"prim":"address","annots":[":to"]},{"prim":"nat","annots":[":value"]}]}]}]},[{"prim":"IF_NONE","args":[[{"prim":"UNIT"},{"prim":"FAILWITH"}],[]]}],{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"0"}]},{"prim":"PUSH","args":[{"prim":"pair","args":[{"prim":"address","annots":[":from"]},{"prim":"pair","args":[{"prim":"address","annots":[":to"]},{"prim":"nat","annots":[":value"]}]}]},{"prim":"Pair","args":[{"bytes":"0156637790cdb23bc0a4c57d069d2e3577e5ed89a600"},{"prim":"Pair","args":[{"bytes":"0000e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e"},{"int":"2"}]}]}]},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"},{"prim":"PUSH","args":[{"prim":"address"},{"bytes":"01fc1beb979d7c8da00d6e5e22c297bcf541834607007472616e73666572"}]},{"prim":"CONTRACT","args":[{"prim":"list","args":[{"prim":"pair","args":[{"prim":"address","annots":["%from_"]},{"prim":"list","annots":["%txs"],"args":[{"prim":"pair","args":[{"prim":"address","annots":["%to_"]},{"prim":"pair","args":[{"prim":"nat","annots":["%token_id"]},{"prim":"nat","annots":["%amount"]}]}]}]}]}]}]},[{"prim":"IF_NONE","args":[[{"prim":"UNIT"},{"prim":"FAILWITH"}],[]]}],{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"0"}]},{"prim":"PUSH","args":[{"prim":"list","args":[{"prim":"pair","args":[{"prim":"address","annots":["%from_"]},{"prim":"list","annots":["%txs"],"args":[{"prim":"pair","args":[{"prim":"address","annots":["%to_"]},{"prim":"pair","args":[{"prim":"nat","annots":["%token_id"]},{"prim":"nat","annots":["%amount"]}]}]}]}]}]},[{"prim":"Pair","args":[{"bytes":"0156637790cdb23bc0a4c57d069d2e3577e5ed89a600"},[{"prim":"Pair","args":[{"bytes":"0000e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e"},{"prim":"Pair","args":[{"int":"0"},{"int":"3"}]}]}]]}]]},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]';
    expect(parseRawMichelson(rawMichelson)).toEqual([
      {
        amount: "350000000000",
        recipient: {
          pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
          type: "implicit",
        },
        type: "tez",
      },
      {
        amount: "2",
        recipient: {
          pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
          type: "implicit",
        },
        contract: {
          pkh: "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe",
          type: "contract",
        },

        sender: {
          pkh: "KT1GTYqMXwnsvqYwNGcTHcgqNRASuyM5TzY8",
          type: "contract",
        },
        type: "fa1.2",
      },
      {
        amount: "3",
        recipient: {
          pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
          type: "implicit",
        },
        contract: {
          pkh: "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ",
          type: "contract",
        },

        sender: {
          pkh: "KT1GTYqMXwnsvqYwNGcTHcgqNRASuyM5TzY8",
          type: "contract",
        },
        tokenId: "0",
        type: "fa2",
      },
    ]);
  });

  test("parseRawMichelson should throw unrecognizedMichelson error", () => {
    const unrecognizableRawMichelson =
      '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"address"},{"bytes":"0156cb5559a8d8c945944e71edec63dd04a8e76b87007472616e73666572"}]},{"prim":"CONTRACT","args":[{"prim":"list","args":[{"prim":"pair","args":[{"prim":"address","annots":["%from_"]},{"prim":"list","annots":["%txs"],"args":[{"prim":"pair","args":[{"prim":"address","annots":["%to_"]},{"prim":"pair","args":[{"prim":"nat","annots":["%token_id"]},{"prim":"nat","annots":["%amount"]}]}]}]}]}]}]},{"prim":"IF_NONE","args":[[{"prim":"UNIT"},{"prim":"FAILWITH"}],[{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"1"}]},{"prim":"PUSH","args":[{"prim":"list","args":[{"prim":"pair","args":[{"prim":"address","annots":["%from_"]},{"prim":"list","annots":["%txs"],"args":[{"prim":"pair","args":[{"prim":"address","annots":["%to_"]},{"prim":"pair","args":[{"prim":"nat","annots":["%token_id"]},{"prim":"nat","annots":["%amount"]}]}]}]}]}]},[{"prim":"Pair","args":[{"bytes":"018e368c2083bdaef3199bae317d6c967c21d947b300"},[{"prim":"Pair","args":[{"bytes":"000057c264d6d7f7257cd3d8096150b0d8be60577ca7"},{"prim":"Pair","args":[{"int":"6"},{"int":"1"}]}]}]]}]]},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]]}]';

    expect(() => parseRawMichelson(unrecognizableRawMichelson)).toThrow(UnrecognizedMichelsonError);
  });

  test("parseRawMichelson should throw syntax error", () => {
    const invalidJsonString = "{a:";

    expect(() => parseRawMichelson(invalidJsonString)).toThrow(SyntaxError);
  });
});
