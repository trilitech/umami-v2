import { TezosToolkit } from "@taquito/taquito";
import { operationsToWalletParams } from "./params";
import { makeMultisigProposeOperation } from "../../types/Operation";
import { AccountOperations } from "../../components/sendForm/types";

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
