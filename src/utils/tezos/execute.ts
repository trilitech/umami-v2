import { TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";

import { operationsToWalletParams } from "./helpers";
import { EstimatedAccountOperations } from "../../types/AccountOperations";

export const executeOperations = async (
  operations: EstimatedAccountOperations,
  tezosToolkit: TezosToolkit
): Promise<BatchWalletOperation> => {
  const params = operationsToWalletParams(operations);

  // TODO: remove after testing
  console.log(params);
  return tezosToolkit.wallet.batch(params).send();
};
