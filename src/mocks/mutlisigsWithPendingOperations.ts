import { MultisigWithPendingOperations } from "../utils/multisig/types";
import { mockPkh } from "./factories";

export const multisigs: MultisigWithPendingOperations[] = [
  {
    address: "KT1NYUDvzv85i4558nbgUEpMY8thJG3XDSeB",
    threshold: 2,
    signers: ["tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6", "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"],
    balance: "0",
    pendingOperations: [],
  },
  {
    address: "KT1JG7wmGuXi7Sdf3eqATscVmhqyyT3Q8Xjg",
    threshold: 1,
    signers: [mockPkh(1), mockPkh(9)],
    balance: "50000",
    pendingOperations: [],
  },
  {
    address: "KT1FDgmFVfKe19nk73nA8sTmW8rE1WUahG3K",
    threshold: 1,
    signers: ["tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6", "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"],
    balance: "190000",
    pendingOperations: [
      {
        key: "1",
        rawActions:
          '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"005fd0a7ece135cecfd71fcf78cf6656d5047fb980"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"100000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
        approvals: ["tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"],
      },
    ],
  },
];
