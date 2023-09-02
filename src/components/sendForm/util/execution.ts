import { TezosToolkit } from "@taquito/taquito";
import { makeMultisigProposeOperation } from "../../../types/Operation";
import { FormOperations } from "../types";
import { submitBatch } from "../../../utils/tezos/operations";

export const makeTransfer = async (
  { type, operations, sender }: FormOperations,
  tezosToolkit: TezosToolkit
): Promise<{
  hash: string;
}> => {
  const ops =
    type === "implicit" ? operations : [makeMultisigProposeOperation(sender.address, operations)];

  return submitBatch(ops, tezosToolkit).then(({ opHash }) => ({ hash: opHash }));
};
