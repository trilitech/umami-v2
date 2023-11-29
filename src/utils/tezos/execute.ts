import { TezosToolkit } from "@taquito/taquito";

import { operationsToWalletParams } from "./helpers";
import { AccountOperations } from "../../types/AccountOperations";

export const executeOperations = async (
  operations: AccountOperations,
  tezosToolkit: TezosToolkit
): Promise<{
  opHash: string;
}> => {
  const params = operationsToWalletParams(operations);
  return tezosToolkit.wallet.batch(params).send();
};
