/**
 * This is the Michelson that is compiled from the following contract
 * https://github.com/SamREye/tezos-multisig-managed-onchain
 */

export const contract = [
  {
    prim: "storage",
    args: [
      {
        prim: "pair",
        args: [
          {
            prim: "address",
            annots: ["%owner"],
          },
          {
            prim: "pair",
            args: [
              {
                prim: "set",
                args: [
                  {
                    prim: "address",
                  },
                ],
                annots: ["%signers"],
              },
              {
                prim: "pair",
                args: [
                  {
                    prim: "nat",
                    annots: ["%threshold"],
                  },
                  {
                    prim: "pair",
                    args: [
                      {
                        prim: "nat",
                        annots: ["%last_op_id"],
                      },
                      {
                        prim: "pair",
                        args: [
                          {
                            prim: "big_map",
                            args: [
                              {
                                prim: "nat",
                              },
                              {
                                prim: "pair",
                                args: [
                                  {
                                    prim: "lambda",
                                    args: [
                                      {
                                        prim: "unit",
                                      },
                                      {
                                        prim: "list",
                                        args: [
                                          {
                                            prim: "operation",
                                          },
                                        ],
                                      },
                                    ],
                                    annots: ["%actions"],
                                  },
                                  {
                                    prim: "set",
                                    args: [
                                      {
                                        prim: "address",
                                      },
                                    ],
                                    annots: ["%approvals"],
                                  },
                                ],
                              },
                            ],
                            annots: ["%pending_ops"],
                          },
                          {
                            prim: "big_map",
                            args: [
                              {
                                prim: "string",
                              },
                              {
                                prim: "bytes",
                              },
                            ],
                            annots: ["%metadata"],
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
    ],
  },
  {
    prim: "parameter",
    args: [
      {
        prim: "or",
        args: [
          {
            prim: "or",
            args: [
              {
                prim: "or",
                args: [
                  {
                    prim: "bytes",
                    annots: ["%set_metadata_uri"],
                  },
                  {
                    prim: "unit",
                    annots: ["%default"],
                  },
                ],
              },
              {
                prim: "or",
                args: [
                  {
                    prim: "lambda",
                    args: [
                      {
                        prim: "unit",
                      },
                      {
                        prim: "list",
                        args: [
                          {
                            prim: "operation",
                          },
                        ],
                      },
                    ],
                    annots: ["%propose"],
                  },
                  {
                    prim: "nat",
                    annots: ["%approve"],
                  },
                ],
              },
            ],
          },
          {
            prim: "nat",
            annots: ["%execute"],
          },
        ],
      },
    ],
  },
  {
    prim: "code",
    args: [
      [
        {
          prim: "NIL",
          args: [
            {
              prim: "operation",
            },
          ],
        },
        {
          prim: "DIG",
          args: [
            {
              int: "1",
            },
          ],
        },
        {
          prim: "UNPAIR",
        },
        {
          prim: "DIP",
          args: [
            {
              int: "1",
            },
            [
              {
                prim: "UNPAIR",
                args: [
                  {
                    int: "6",
                  },
                ],
              },
            ],
          ],
        },
        {
          prim: "IF_LEFT",
          args: [
            [
              {
                prim: "IF_LEFT",
                args: [
                  [
                    {
                      prim: "IF_LEFT",
                      args: [
                        [
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "2",
                              },
                            ],
                          },
                          {
                            prim: "SENDER",
                          },
                          {
                            prim: "COMPARE",
                          },
                          {
                            prim: "EQ",
                          },
                          {
                            prim: "NOT",
                          },
                          {
                            prim: "IF",
                            args: [
                              [
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string: "INVALID_CALLER",
                                    },
                                  ],
                                },
                                {
                                  prim: "FAILWITH",
                                },
                              ],
                              [],
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "7",
                              },
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "2",
                              },
                            ],
                          },
                          {
                            prim: "SOME",
                          },
                          {
                            prim: "PUSH",
                            args: [
                              {
                                prim: "string",
                              },
                              {
                                string: "",
                              },
                            ],
                          },
                          {
                            prim: "UPDATE",
                          },
                          {
                            prim: "DIP",
                            args: [
                              {
                                int: "1",
                              },
                              [
                                {
                                  prim: "DIG",
                                  args: [
                                    {
                                      int: "6",
                                    },
                                  ],
                                },
                                {
                                  prim: "DROP",
                                  args: [
                                    {
                                      int: "1",
                                    },
                                  ],
                                },
                              ],
                            ],
                          },
                          {
                            prim: "DUG",
                            args: [
                              {
                                int: "6",
                              },
                            ],
                          },
                          {
                            prim: "DROP",
                            args: [
                              {
                                int: "1",
                              },
                            ],
                          },
                          {
                            prim: "PAIR",
                            args: [
                              {
                                int: "6",
                              },
                            ],
                          },
                          {
                            prim: "DIG",
                            args: [
                              {
                                int: "1",
                              },
                            ],
                          },
                          {
                            prim: "PAIR",
                          },
                        ],
                        [
                          {
                            prim: "DROP",
                            args: [
                              {
                                int: "1",
                              },
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "3",
                              },
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "3",
                              },
                            ],
                          },
                          {
                            prim: "SIZE",
                          },
                          {
                            prim: "COMPARE",
                          },
                          {
                            prim: "GE",
                          },
                          {
                            prim: "NOT",
                          },
                          {
                            prim: "IF",
                            args: [
                              [
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string:
                                        "FUNDING BLOCKED SINCE PARAMS ARE INVALID",
                                    },
                                  ],
                                },
                                {
                                  prim: "FAILWITH",
                                },
                              ],
                              [],
                            ],
                          },
                          {
                            prim: "PAIR",
                            args: [
                              {
                                int: "6",
                              },
                            ],
                          },
                          {
                            prim: "DIG",
                            args: [
                              {
                                int: "1",
                              },
                            ],
                          },
                          {
                            prim: "PAIR",
                          },
                        ],
                      ],
                    },
                  ],
                  [
                    {
                      prim: "IF_LEFT",
                      args: [
                        [
                          {
                            prim: "PUSH",
                            args: [
                              {
                                prim: "mutez",
                              },
                              {
                                int: "0",
                              },
                            ],
                          },
                          {
                            prim: "AMOUNT",
                          },
                          {
                            prim: "COMPARE",
                          },
                          {
                            prim: "EQ",
                          },
                          {
                            prim: "NOT",
                          },
                          {
                            prim: "IF",
                            args: [
                              [
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string:
                                        "TO FUND CONTRACT, PLEASE USE THE DEFAULT ENTRYPOINT",
                                    },
                                  ],
                                },
                                {
                                  prim: "FAILWITH",
                                },
                              ],
                              [],
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "3",
                              },
                            ],
                          },
                          {
                            prim: "SENDER",
                          },
                          {
                            prim: "MEM",
                          },
                          {
                            prim: "NOT",
                          },
                          {
                            prim: "IF",
                            args: [
                              [
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string: "ONLY FOR SIGNERS",
                                    },
                                  ],
                                },
                                {
                                  prim: "FAILWITH",
                                },
                              ],
                              [],
                            ],
                          },
                          {
                            prim: "PUSH",
                            args: [
                              {
                                prim: "nat",
                              },
                              {
                                int: "1",
                              },
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "6",
                              },
                            ],
                          },
                          {
                            prim: "ADD",
                          },
                          {
                            prim: "DIP",
                            args: [
                              {
                                int: "1",
                              },
                              [
                                {
                                  prim: "DIG",
                                  args: [
                                    {
                                      int: "4",
                                    },
                                  ],
                                },
                                {
                                  prim: "DROP",
                                  args: [
                                    {
                                      int: "1",
                                    },
                                  ],
                                },
                              ],
                            ],
                          },
                          {
                            prim: "DUG",
                            args: [
                              {
                                int: "4",
                              },
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "6",
                              },
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "6",
                              },
                            ],
                          },
                          {
                            prim: "MEM",
                          },
                          {
                            prim: "IF",
                            args: [
                              [
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string: "pending_ops",
                                    },
                                  ],
                                },
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string: "KEY_EXISTS",
                                    },
                                  ],
                                },
                                {
                                  prim: "PAIR",
                                },
                                {
                                  prim: "FAILWITH",
                                },
                              ],
                              [
                                {
                                  prim: "DUP",
                                  args: [
                                    {
                                      int: "6",
                                    },
                                  ],
                                },
                                {
                                  prim: "EMPTY_SET",
                                  args: [
                                    {
                                      prim: "address",
                                    },
                                  ],
                                },
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "bool",
                                    },
                                    {
                                      prim: "True",
                                    },
                                  ],
                                },
                                {
                                  prim: "SENDER",
                                },
                                {
                                  prim: "UPDATE",
                                },
                                {
                                  prim: "DUP",
                                  args: [
                                    {
                                      int: "3",
                                    },
                                  ],
                                },
                                {
                                  prim: "PAIR",
                                },
                                {
                                  prim: "SOME",
                                },
                                {
                                  prim: "DUP",
                                  args: [
                                    {
                                      int: "7",
                                    },
                                  ],
                                },
                                {
                                  prim: "UPDATE",
                                },
                                {
                                  prim: "DIP",
                                  args: [
                                    {
                                      int: "1",
                                    },
                                    [
                                      {
                                        prim: "DIG",
                                        args: [
                                          {
                                            int: "5",
                                          },
                                        ],
                                      },
                                      {
                                        prim: "DROP",
                                        args: [
                                          {
                                            int: "1",
                                          },
                                        ],
                                      },
                                    ],
                                  ],
                                },
                                {
                                  prim: "DUG",
                                  args: [
                                    {
                                      int: "5",
                                    },
                                  ],
                                },
                              ],
                            ],
                          },
                          {
                            prim: "DROP",
                            args: [
                              {
                                int: "1",
                              },
                            ],
                          },
                          {
                            prim: "PAIR",
                            args: [
                              {
                                int: "6",
                              },
                            ],
                          },
                          {
                            prim: "DIG",
                            args: [
                              {
                                int: "1",
                              },
                            ],
                          },
                          {
                            prim: "PAIR",
                          },
                        ],
                        [
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "6",
                              },
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "2",
                              },
                            ],
                          },
                          {
                            prim: "GET",
                          },
                          {
                            prim: "IF_NONE",
                            args: [
                              [
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string: "INVALID OP ID",
                                    },
                                  ],
                                },
                                {
                                  prim: "FAILWITH",
                                },
                              ],
                              [],
                            ],
                          },
                          {
                            prim: "PUSH",
                            args: [
                              {
                                prim: "mutez",
                              },
                              {
                                int: "0",
                              },
                            ],
                          },
                          {
                            prim: "AMOUNT",
                          },
                          {
                            prim: "COMPARE",
                          },
                          {
                            prim: "EQ",
                          },
                          {
                            prim: "NOT",
                          },
                          {
                            prim: "IF",
                            args: [
                              [
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string:
                                        "TO FUND CONTRACT, PLEASE USE THE DEFAULT ENTRYPOINT",
                                    },
                                  ],
                                },
                                {
                                  prim: "FAILWITH",
                                },
                              ],
                              [],
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "4",
                              },
                            ],
                          },
                          {
                            prim: "SENDER",
                          },
                          {
                            prim: "MEM",
                          },
                          {
                            prim: "NOT",
                          },
                          {
                            prim: "IF",
                            args: [
                              [
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string: "ONLY FOR SIGNERS",
                                    },
                                  ],
                                },
                                {
                                  prim: "FAILWITH",
                                },
                              ],
                              [],
                            ],
                          },
                          {
                            prim: "DUP",
                          },
                          {
                            prim: "CDR",
                          },
                          {
                            prim: "SENDER",
                          },
                          {
                            prim: "MEM",
                          },
                          {
                            prim: "IF",
                            args: [
                              [
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string: "ALREADY APPROVED",
                                    },
                                  ],
                                },
                                {
                                  prim: "FAILWITH",
                                },
                              ],
                              [],
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "7",
                              },
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "8",
                              },
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "4",
                              },
                            ],
                          },
                          {
                            prim: "GET",
                          },
                          {
                            prim: "IF_NONE",
                            args: [
                              [
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string: "pending_ops",
                                    },
                                  ],
                                },
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string: "ASSET_NOT_FOUND",
                                    },
                                  ],
                                },
                                {
                                  prim: "PAIR",
                                },
                                {
                                  prim: "FAILWITH",
                                },
                              ],
                              [],
                            ],
                          },
                          {
                            prim: "UNPAIR",
                          },
                          {
                            prim: "SWAP",
                          },
                          {
                            prim: "DROP",
                            args: [
                              {
                                int: "1",
                              },
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "9",
                              },
                            ],
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "5",
                              },
                            ],
                          },
                          {
                            prim: "GET",
                          },
                          {
                            prim: "IF_NONE",
                            args: [
                              [
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string: "pending_ops",
                                    },
                                  ],
                                },
                                {
                                  prim: "PUSH",
                                  args: [
                                    {
                                      prim: "string",
                                    },
                                    {
                                      string: "ASSET_NOT_FOUND",
                                    },
                                  ],
                                },
                                {
                                  prim: "PAIR",
                                },
                                {
                                  prim: "FAILWITH",
                                },
                              ],
                              [],
                            ],
                          },
                          {
                            prim: "CDR",
                          },
                          {
                            prim: "PUSH",
                            args: [
                              {
                                prim: "bool",
                              },
                              {
                                prim: "True",
                              },
                            ],
                          },
                          {
                            prim: "SENDER",
                          },
                          {
                            prim: "UPDATE",
                          },
                          {
                            prim: "SWAP",
                          },
                          {
                            prim: "PAIR",
                          },
                          {
                            prim: "SOME",
                          },
                          {
                            prim: "DUP",
                            args: [
                              {
                                int: "4",
                              },
                            ],
                          },
                          {
                            prim: "UPDATE",
                          },
                          {
                            prim: "DIP",
                            args: [
                              {
                                int: "1",
                              },
                              [
                                {
                                  prim: "DIG",
                                  args: [
                                    {
                                      int: "6",
                                    },
                                  ],
                                },
                                {
                                  prim: "DROP",
                                  args: [
                                    {
                                      int: "1",
                                    },
                                  ],
                                },
                              ],
                            ],
                          },
                          {
                            prim: "DUG",
                            args: [
                              {
                                int: "6",
                              },
                            ],
                          },
                          {
                            prim: "DROP",
                            args: [
                              {
                                int: "2",
                              },
                            ],
                          },
                          {
                            prim: "PAIR",
                            args: [
                              {
                                int: "6",
                              },
                            ],
                          },
                          {
                            prim: "DIG",
                            args: [
                              {
                                int: "1",
                              },
                            ],
                          },
                          {
                            prim: "PAIR",
                          },
                        ],
                      ],
                    },
                  ],
                ],
              },
            ],
            [
              {
                prim: "DUP",
                args: [
                  {
                    int: "6",
                  },
                ],
              },
              {
                prim: "DUP",
                args: [
                  {
                    int: "2",
                  },
                ],
              },
              {
                prim: "GET",
              },
              {
                prim: "IF_NONE",
                args: [
                  [
                    {
                      prim: "PUSH",
                      args: [
                        {
                          prim: "string",
                        },
                        {
                          string: "INVALID OP ID",
                        },
                      ],
                    },
                    {
                      prim: "FAILWITH",
                    },
                  ],
                  [],
                ],
              },
              {
                prim: "PUSH",
                args: [
                  {
                    prim: "mutez",
                  },
                  {
                    int: "0",
                  },
                ],
              },
              {
                prim: "AMOUNT",
              },
              {
                prim: "COMPARE",
              },
              {
                prim: "EQ",
              },
              {
                prim: "NOT",
              },
              {
                prim: "IF",
                args: [
                  [
                    {
                      prim: "PUSH",
                      args: [
                        {
                          prim: "string",
                        },
                        {
                          string:
                            "TO FUND CONTRACT, PLEASE USE THE DEFAULT ENTRYPOINT",
                        },
                      ],
                    },
                    {
                      prim: "FAILWITH",
                    },
                  ],
                  [],
                ],
              },
              {
                prim: "DUP",
                args: [
                  {
                    int: "4",
                  },
                ],
              },
              {
                prim: "SENDER",
              },
              {
                prim: "MEM",
              },
              {
                prim: "NOT",
              },
              {
                prim: "IF",
                args: [
                  [
                    {
                      prim: "PUSH",
                      args: [
                        {
                          prim: "string",
                        },
                        {
                          string: "ONLY FOR SIGNERS",
                        },
                      ],
                    },
                    {
                      prim: "FAILWITH",
                    },
                  ],
                  [],
                ],
              },
              {
                prim: "DUP",
                args: [
                  {
                    int: "5",
                  },
                ],
              },
              {
                prim: "DUP",
                args: [
                  {
                    int: "2",
                  },
                ],
              },
              {
                prim: "CDR",
              },
              {
                prim: "SIZE",
              },
              {
                prim: "COMPARE",
              },
              {
                prim: "GE",
              },
              {
                prim: "NOT",
              },
              {
                prim: "IF",
                args: [
                  [
                    {
                      prim: "PUSH",
                      args: [
                        {
                          prim: "string",
                        },
                        {
                          string: "NOT YET APPROVED",
                        },
                      ],
                    },
                    {
                      prim: "FAILWITH",
                    },
                  ],
                  [],
                ],
              },
              {
                prim: "DUP",
                args: [
                  {
                    int: "7",
                  },
                ],
              },
              {
                prim: "DUP",
                args: [
                  {
                    int: "3",
                  },
                ],
              },
              {
                prim: "GET",
              },
              {
                prim: "IF_NONE",
                args: [
                  [
                    {
                      prim: "PUSH",
                      args: [
                        {
                          prim: "string",
                        },
                        {
                          string: "pending_ops",
                        },
                      ],
                    },
                    {
                      prim: "PUSH",
                      args: [
                        {
                          prim: "string",
                        },
                        {
                          string: "ASSET_NOT_FOUND",
                        },
                      ],
                    },
                    {
                      prim: "PAIR",
                    },
                    {
                      prim: "FAILWITH",
                    },
                  ],
                  [],
                ],
              },
              {
                prim: "CAR",
              },
              {
                prim: "PUSH",
                args: [
                  {
                    prim: "unit",
                  },
                  {
                    prim: "Unit",
                  },
                ],
              },
              {
                prim: "EXEC",
              },
              {
                prim: "DIP",
                args: [
                  {
                    int: "1",
                  },
                  [
                    {
                      prim: "DIG",
                      args: [
                        {
                          int: "8",
                        },
                      ],
                    },
                    {
                      prim: "DROP",
                      args: [
                        {
                          int: "1",
                        },
                      ],
                    },
                  ],
                ],
              },
              {
                prim: "DUG",
                args: [
                  {
                    int: "8",
                  },
                ],
              },
              {
                prim: "DUP",
                args: [
                  {
                    int: "7",
                  },
                ],
              },
              {
                prim: "NONE",
                args: [
                  {
                    prim: "pair",
                    args: [
                      {
                        prim: "lambda",
                        args: [
                          {
                            prim: "unit",
                          },
                          {
                            prim: "list",
                            args: [
                              {
                                prim: "operation",
                              },
                            ],
                          },
                        ],
                      },
                      {
                        prim: "set",
                        args: [
                          {
                            prim: "address",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                prim: "DUP",
                args: [
                  {
                    int: "4",
                  },
                ],
              },
              {
                prim: "UPDATE",
              },
              {
                prim: "DIP",
                args: [
                  {
                    int: "1",
                  },
                  [
                    {
                      prim: "DIG",
                      args: [
                        {
                          int: "6",
                        },
                      ],
                    },
                    {
                      prim: "DROP",
                      args: [
                        {
                          int: "1",
                        },
                      ],
                    },
                  ],
                ],
              },
              {
                prim: "DUG",
                args: [
                  {
                    int: "6",
                  },
                ],
              },
              {
                prim: "DROP",
                args: [
                  {
                    int: "2",
                  },
                ],
              },
              {
                prim: "PAIR",
                args: [
                  {
                    int: "6",
                  },
                ],
              },
              {
                prim: "DIG",
                args: [
                  {
                    int: "1",
                  },
                ],
              },
              {
                prim: "PAIR",
              },
            ],
          ],
        },
      ],
    ],
  },
];

export const makeStorageJSON = (
  owner: string,
  signers: string[],
  threshold: string
) => {
  return {
    owner,
    signers,
    threshold,
    last_op_id: "0",
    pending_ops: [],
    metadata: [],
  };
};

/**
 *  Don't know why v1 uses michelson for storage. Since Taquito supports JSON.
 *  We could just use JSON instead of passing MichelsonJSON.
 */
export const makeStorageMichelsonJSON = (
  owner: string,
  signers: string[],
  threshold: string
) => {
  // TODO
  // Mandatory:
  // Signers have to be sorted like follows (v1 code snippet)
  //   signers->SortArray.stableSortInPlaceBy((a, b) =>
  //    (a :> string)->ReTaquitoUtils.b58decode->String.compare((b :> string)->ReTaquitoUtils.b58decode)
  //  )
  return {
    prim: "Pair",
    args: [
      {
        string: owner,
      },
      {
        prim: "Pair",
        args: [
          signers.map((signer) => ({ string: signer })),
          {
            prim: "Pair",
            args: [
              {
                int: threshold,
              },
              {
                prim: "Pair",
                args: [
                  {
                    int: "0",
                  },
                  {
                    prim: "Pair",
                    args: [[], []],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};
