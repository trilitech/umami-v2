import { TezosToolkit } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { operationsToWalletParams } from "./params";
import { Operation } from "../../types/Operation";

export const submitBatch = async (
  operations: Operation[],
  tezosToolkit: TezosToolkit
): Promise<BatchWalletOperation> => {
  const params = operationsToWalletParams(operations);
  return tezosToolkit.wallet.batch(params).send();
};
