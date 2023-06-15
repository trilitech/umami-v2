import { DelegateOperation, TransactionOperation, TransferParams } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { OperationValue } from "../../components/sendForm/types";
import {
  makeFA12TransferMethod,
  makeFA2TransferMethod,
  makeMultisigApproveOrExecuteMethod,
  makeMultisigProposeMethod,
  makeToolkitWithSigner,
} from "./helpers";
import { SignerConfig } from "../../types/SignerConfig";
import { operationValuesToWalletParams } from "./params";
import {
  FA12TransferMethodArgs,
  FA2TransferMethodArgs,
  MultisigApproveOrExecuteMethodArgs,
  MultisigProposeMethodArgs,
} from "./types";

export const delegate = async (
  senderPkh: string,
  bakerPkh: string | undefined,
  config: SignerConfig
): Promise<DelegateOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  return Tezos.contract.setDelegate({
    source: senderPkh,
    delegate: bakerPkh,
  });
};

export const transferFA2Token = async (
  params: FA2TransferMethodArgs,
  config: SignerConfig
): Promise<TransactionOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  const transferMethod = await makeFA2TransferMethod(params, Tezos);
  return transferMethod.send();
};

export const transferFA12Token = async (
  params: FA12TransferMethodArgs,
  config: SignerConfig
): Promise<TransactionOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  const transferMethod = await makeFA12TransferMethod(params, Tezos);
  return transferMethod.send();
};

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
  operation: OperationValue[],
  config: SignerConfig
): Promise<BatchWalletOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  const params = await operationValuesToWalletParams(operation, Tezos);
  return Tezos.wallet.batch(params).send();
};
