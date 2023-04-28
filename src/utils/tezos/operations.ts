import { TezosNetwork } from "@airgap/tezos";
import { DelegateOperation, TransactionOperation } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { OperationValue } from "../../components/sendForm/types";
import {
  makeFA12TransferMethod,
  makeFA2TransferMethod,
  makeToolkitWithSigner,
} from "./helpers";
import { SignerConfig, SignerType } from "../../types/SignerConfig";
import { operationValuesToWalletParams } from "./params";
import { FA12TokenTransferParams, FA2TokenTransferParams } from "./types";

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
  params: FA2TokenTransferParams,
  config: SignerConfig
): Promise<TransactionOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  const transferMethod = await makeFA2TransferMethod(params, Tezos);
  return transferMethod.send();
};

export const transferFA12Token = async (
  params: FA12TokenTransferParams,
  sk: string,
  network: TezosNetwork
): Promise<TransactionOperation> => {
  const c: SignerConfig = { sk, type: SignerType.SK, network };
  const Tezos = await makeToolkitWithSigner(c);
  const transferMethod = await makeFA12TransferMethod(params, Tezos);
  return transferMethod.send();
};

export const transferTez = async (
  recipient: string,
  amount: number,
  config: SignerConfig
): Promise<TransactionOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  return Tezos.contract.transfer({ to: recipient, amount });
};

export const submitBatch = async (
  operation: OperationValue[],
  config: SignerConfig
  ): Promise<BatchWalletOperation> => {
  const Tezos = await makeToolkitWithSigner(config);
  const params = await operationValuesToWalletParams(operation, Tezos);
  return Tezos.wallet.batch(params).send();
};
