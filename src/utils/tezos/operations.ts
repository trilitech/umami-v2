import { TransactionOperation, TransferParams } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { OperationValue } from "../../components/sendForm/types";
import { makeToolkit } from "../../types/ToolkitConfig";
import { ToolkitConfig } from "../../types/ToolkitConfig";
import { makeMultisigApproveOrExecuteMethod, makeMultisigProposeMethod } from "./helpers";
import { operationValuesToWalletParams } from "./params";
import { MultisigApproveOrExecuteMethodArgs, MultisigProposeMethodArgs } from "./types";

export const transferMutez = async (
  recipient: string,
  amount: number,
  config: ToolkitConfig,
  parameter?: TransferParams["parameter"]
): Promise<TransactionOperation> => {
  const signer = await makeToolkit(config);
  return signer.contract.transfer({
    to: recipient,
    amount: amount,
    parameter,
    mutez: true,
  });
};

export const proposeMultisigLambda = async (
  params: MultisigProposeMethodArgs,
  config: ToolkitConfig
): Promise<TransactionOperation> => {
  const signer = await makeToolkit(config);
  const proposeMethod = await makeMultisigProposeMethod(params, signer);
  return proposeMethod.send();
};

export const approveOrExecuteMultisigOperation = async (
  params: MultisigApproveOrExecuteMethodArgs,
  config: ToolkitConfig
): Promise<TransactionOperation> => {
  const signer = await makeToolkit(config);
  const approveOrExecuteMethod = await makeMultisigApproveOrExecuteMethod(params, signer);
  return approveOrExecuteMethod.send();
};

export const submitBatch = async (
  operation: OperationValue[],
  config: ToolkitConfig
): Promise<BatchWalletOperation> => {
  const signer = await makeToolkit(config);
  const params = await operationValuesToWalletParams(operation, signer);
  return signer.wallet.batch(params).send();
};
