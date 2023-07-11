import { TransactionOperation, TransferParams } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { RawOperation } from "../../types/RawOperation";
import { SignerConfig } from "../../types/SignerConfig";
import {
  makeMultisigApproveOrExecuteMethod,
  makeMultisigProposeMethod,
  makeToolkitWithSigner,
} from "./helpers";
import { operationsToWalletParams } from "./params";
import { MultisigApproveOrExecuteMethodArgs, MultisigProposeMethodArgs } from "./types";

export const transferMutez = async (
  recipient: string,
  amount: number,
  config: SignerConfig,
  parameter?: TransferParams["parameter"]
): Promise<TransactionOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  return Tezos.contract.transfer({
    to: recipient,
    amount: amount,
    parameter,
    mutez: true,
  });
};

export const proposeMultisigLambda = async (
  params: MultisigProposeMethodArgs,
  config: SignerConfig
): Promise<TransactionOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  const proposeMethod = await makeMultisigProposeMethod(params, Tezos);
  return proposeMethod.send();
};

export const approveOrExecuteMultisigOperation = async (
  params: MultisigApproveOrExecuteMethodArgs,
  config: SignerConfig
): Promise<TransactionOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  const approveOrExecuteMethod = await makeMultisigApproveOrExecuteMethod(params, Tezos);
  return approveOrExecuteMethod.send();
};

export const submitBatch = async (
  operation: RawOperation[],
  config: SignerConfig
): Promise<BatchWalletOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  const params = await operationsToWalletParams(operation, Tezos);
  return Tezos.wallet.batch(params).send();
};
