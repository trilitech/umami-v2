import { TezosToolkit } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { operationsToWalletParams } from "./params";
import { Operation, makeMultisigProposeOperation } from "../../types/Operation";
import { AccountOperations } from "../../components/sendForm/types";

export const executeAccountOperations = async (
  { type, operations, sender }: AccountOperations,
  tezosToolkit: TezosToolkit
): Promise<{
  hash: string;
}> => {
  const ops =
    type === "implicit" ? operations : [makeMultisigProposeOperation(sender.address, operations)];

  return executeOperations(ops, tezosToolkit).then(({ opHash }) => ({ hash: opHash }));
};

export const executeOperations = async (
  operations: Operation[],
  tezosToolkit: TezosToolkit
): Promise<BatchWalletOperation> => {
  const params = operationsToWalletParams(operations);
  return tezosToolkit.wallet.batch(params).send();
};
