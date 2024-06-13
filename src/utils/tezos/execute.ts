import { type TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";

import { operationsToWalletParams } from "./helpers";
import { type EstimatedAccountOperations } from "../../types/AccountOperations";

export const executeOperations = async (
  operations: EstimatedAccountOperations,
  tezosToolkit: TezosToolkit
): Promise<BatchWalletOperation> => {
  const params = operationsToWalletParams(operations);

  return tezosToolkit.wallet.batch(params).send();
};
