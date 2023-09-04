import { TezosToolkit } from "@taquito/taquito";
import { makeMultisigProposeOperation } from "../../types/Operation";
import { AccountOperations } from "../../components/sendForm/types";
import { operationsToWalletParams } from "./helpers";

export const executeOperations = async (
  { type, operations, sender }: AccountOperations,
  tezosToolkit: TezosToolkit
): Promise<{
  opHash: string;
}> => {
  const ops =
    type === "implicit" ? operations : [makeMultisigProposeOperation(sender.address, operations)];

  const params = operationsToWalletParams(ops);
  return tezosToolkit.wallet.batch(params).send();
};
