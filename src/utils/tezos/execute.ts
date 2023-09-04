import { TezosToolkit } from "@taquito/taquito";
import { AccountOperations } from "../../components/sendForm/types";
import { operationsToWalletParams } from "./helpers";

export const executeOperations = async (
  operations: AccountOperations,
  tezosToolkit: TezosToolkit
): Promise<{
  opHash: string;
}> => {
  const params = operationsToWalletParams(operations);
  return tezosToolkit.wallet.batch(params).send();
};
