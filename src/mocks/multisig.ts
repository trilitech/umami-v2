import { parseContractPkh, parseImplicitPkh } from "../types/Address";
import { Multisig, MultisigOperation } from "../utils/multisig/types";
import { mockImplicitAddress } from "./factories";

export const multisigs: Multisig[] = [
  {
    address: parseContractPkh("KT1NYUDvzv85i4558nbgUEpMY8thJG3XDSeB"),
    threshold: 2,
    signers: [mockImplicitAddress(3)],
    pendingOperationsBigmapId: 0,
  },
  {
    address: parseContractPkh("KT1JG7wmGuXi7Sdf3eqATscVmhqyyT3Q8Xjg"),
    threshold: 1,
    signers: [mockImplicitAddress(1), mockImplicitAddress(2)],
    pendingOperationsBigmapId: 0,
  },
  {
    address: parseContractPkh("KT1FDgmFVfKe19nk73nA8sTmW8rE1WUahG3K"),
    threshold: 1,
    signers: [
      parseImplicitPkh("tz1Te4MXuNYxyyuPqmAQdnKwkD8ZgSF9M7d6"),
      parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
    ],
    pendingOperationsBigmapId: 0,
  },
];

export const multisigOperation: MultisigOperation = {
  id: "1",
  bigmapId: 0,
  rawActions:
    '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"005fd0a7ece135cecfd71fcf78cf6656d5047fb980"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"100000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
  approvals: [{ type: "implicit", pkh: "pkh" }],
};

export const pendingOps: MultisigOperation[] = [
  {
    id: "1",
    rawActions:
      '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"00e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"1000000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
    approvals: [{ type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" }],
    bigmapId: 3,
  },
  {
    id: "2",
    rawActions:
      '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"0057c264d6d7f7257cd3d8096150b0d8be60577ca7"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"3000000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
    approvals: [{ type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" }],
    bigmapId: 3,
  },
];
