import { TezosToolkit, TransactionOperation } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { Account } from "../../types/Account";
import { Operation } from "../../types/Operation";
import { makeMultisigApproveOrExecuteMethod, makeMultisigProposeMethod } from "./helpers";
import { operationsToWalletParams } from "./params";
import { MultisigApproveOrExecuteMethodArgs, MultisigProposeMethodArgs } from "./types";

export const proposeMultisigLambda = async (
  params: MultisigProposeMethodArgs,
  tezosToolkit: TezosToolkit
): Promise<TransactionOperation> => {
  const proposeMethod = await makeMultisigProposeMethod(params, tezosToolkit);
  return proposeMethod.send();
};

export const approveOrExecuteMultisigOperation = async (
  params: MultisigApproveOrExecuteMethodArgs,
  tezosToolkit: TezosToolkit
): Promise<TransactionOperation> => {
  const approveOrExecuteMethod = await makeMultisigApproveOrExecuteMethod(params, tezosToolkit);
  return approveOrExecuteMethod.send();
};

export const submitBatch = async (
  operation: Operation[],
  sender: Account,
  tezosToolkit: TezosToolkit
): Promise<BatchWalletOperation> => {
  const params = await operationsToWalletParams(operation, sender);
  return tezosToolkit.wallet.batch(params).send();
};
