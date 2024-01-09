import { TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";

import { operationsToWalletParams } from "./helpers";
import { AccountOperations } from "../../types/AccountOperations";

export const executeOperations = async (
  operations: AccountOperations,
  tezosToolkit: TezosToolkit
): Promise<BatchWalletOperation> => {
  const params = operationsToWalletParams(operations);
  return tezosToolkit.wallet.batch(params).send();
};
