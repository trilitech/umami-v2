export const simpleTez = [
  { prim: "DROP" },
  { prim: "NIL", args: [{ prim: "operation" }] },
  {
    prim: "PUSH",
    args: [
      { prim: "key_hash" },
      { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" },
    ],
  },
  { prim: "IMPLICIT_ACCOUNT" },
  { prim: "PUSH", args: [{ prim: "mutez" }, { int: "220000" }] },
  { prim: "UNIT" },
  { prim: "TRANSFER_TOKENS" },
  { prim: "CONS" },
];

export const threeTez = [
  { prim: "DROP" },
  { prim: "NIL", args: [{ prim: "operation" }] },
  {
    prim: "PUSH",
    args: [
      { prim: "key_hash" },
      { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" },
    ],
  },
  { prim: "IMPLICIT_ACCOUNT" },
  { prim: "PUSH", args: [{ prim: "mutez" }, { int: "1000" }] },
  { prim: "UNIT" },
  { prim: "TRANSFER_TOKENS" },
  { prim: "CONS" },
  {
    prim: "PUSH",
    args: [
      { prim: "key_hash" },
      { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" },
    ],
  },
  { prim: "IMPLICIT_ACCOUNT" },
  { prim: "PUSH", args: [{ prim: "mutez" }, { int: "2000" }] },
  { prim: "UNIT" },
  { prim: "TRANSFER_TOKENS" },
  { prim: "CONS" },
  {
    prim: "PUSH",
    args: [
      { prim: "key_hash" },
      { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" },
    ],
  },
  { prim: "IMPLICIT_ACCOUNT" },
  { prim: "PUSH", args: [{ prim: "mutez" }, { int: "3000" }] },
  { prim: "UNIT" },
  { prim: "TRANSFER_TOKENS" },
  { prim: "CONS" },
];

export const tezzard = [
  { prim: "DROP" },
  { prim: "NIL", args: [{ prim: "operation" }] },
  {
    prim: "PUSH",
    args: [
      { prim: "address" },
      { bytes: "0156cb5559a8d8c945944e71edec63dd04a8e76b87007472616e73666572" },
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
  {
    prim: "IF_NONE",
    args: [
      [{ prim: "UNIT" }, { prim: "FAILWITH" }],
      [
        { prim: "PUSH", args: [{ prim: "mutez" }, { int: "1" }] },
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
                        {
                          bytes: "000057c264d6d7f7257cd3d8096150b0d8be60577ca7",
                        },
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
      ],
    ],
  },
];

export const tezAndTezard = [
  { prim: "DROP" },
  { prim: "NIL", args: [{ prim: "operation" }] },
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
  {
    prim: "PUSH",
    args: [
      { prim: "address" },
      { bytes: "0156cb5559a8d8c945944e71edec63dd04a8e76b87007472616e73666572" },
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
  {
    prim: "IF_NONE",
    args: [
      [{ prim: "UNIT" }, { prim: "FAILWITH" }],
      [
        { prim: "PUSH", args: [{ prim: "mutez" }, { int: "77" }] },
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
                        {
                          bytes: "000057c264d6d7f7257cd3d8096150b0d8be60577ca7",
                        },
                        { prim: "Pair", args: [{ int: "6" }, { int: "77" }] },
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
      ],
    ],
  },
  {
    prim: "PUSH",
    args: [
      { prim: "key_hash" },
      { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" },
    ],
  },
  { prim: "IMPLICIT_ACCOUNT" },
  { prim: "PUSH", args: [{ prim: "mutez" }, { int: "220000" }] },
  { prim: "UNIT" },
  { prim: "TRANSFER_TOKENS" },
  { prim: "CONS" },
];

export const tezAndTezardWithInvalidDataInBetween = [
  { prim: "DROP" },
  { prim: "NIL", args: [{ prim: "operation" }] },
  "skip this",
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
  "skip that",
  {
    prim: "PUSH",
    args: [
      { prim: "address" },
      { bytes: "0156cb5559a8d8c945944e71edec63dd04a8e76b87007472616e73666572" },
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
  {
    prim: "IF_NONE",
    args: [
      [{ prim: "UNIT" }, { prim: "FAILWITH" }],
      [
        { prim: "PUSH", args: [{ prim: "mutez" }, { int: "77" }] },
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
                        {
                          bytes: "000057c264d6d7f7257cd3d8096150b0d8be60577ca7",
                        },
                        { prim: "Pair", args: [{ int: "6" }, { int: "77" }] },
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
      ],
    ],
  },
  { foo: "bar" },
  "skip this",
  { foo: "bar" },
  {
    prim: "PUSH",
    args: [
      { prim: "key_hash" },
      { bytes: "0057c264d6d7f7257cd3d8096150b0d8be60577ca7" },
    ],
  },
  { prim: "IMPLICIT_ACCOUNT" },
  { prim: "PUSH", args: [{ prim: "mutez" }, { int: "220000" }] },
  { prim: "UNIT" },
  { prim: "TRANSFER_TOKENS" },
  { prim: "CONS" },
  "goodbye",
  "goodbye",
];

export const simpleFa1 = [
  { prim: "DROP" },
  { prim: "NIL", args: [{ prim: "operation" }] },
  {
    prim: "PUSH",
    args: [
      { prim: "address" },
      { bytes: "01d7270a1dd9a8b9ee6b48380fb60dc36a7cd521bb007472616e73666572" },
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
  {
    prim: "IF_NONE",
    args: [
      [{ prim: "UNIT" }, { prim: "FAILWITH" }],
      [
        { prim: "PUSH", args: [{ prim: "mutez" }, { int: "300" }] },
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
                  args: [
                    { bytes: "0000e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e" },
                    { int: "300" },
                  ],
                },
              ],
            },
          ],
        },
        { prim: "TRANSFER_TOKENS" },
        { prim: "CONS" },
      ],
    ],
  },
];
