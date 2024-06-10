import { TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";

import { Estimation } from "./estimate";
import { operationsToWalletParams } from "./helpers";
import { AccountOperations } from "../../types/AccountOperations";

export const executeOperations = async (
  operations: AccountOperations,
  tezosToolkit: TezosToolkit,
  executeParams?: Estimation
): Promise<BatchWalletOperation> => {
  const params = operationsToWalletParams({ ...operations, executeParams });
  console.log(params);
  return tezosToolkit.wallet.batch(params).send();
};
