/* istanbul ignore file */
import { type TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";

import { type EstimatedAccountOperations } from "./AccountOperations";
import { operationsToWalletParams } from "./helpers";

export const executeOperations = async (
  operations: EstimatedAccountOperations,
  tezosToolkit: TezosToolkit
): Promise<BatchWalletOperation> => {
  const params = operationsToWalletParams(operations);

  return tezosToolkit.wallet.batch(params).send();
};
