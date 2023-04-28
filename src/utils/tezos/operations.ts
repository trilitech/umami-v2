import { TezosNetwork } from "@airgap/tezos";
import { DelegateOperation, TransactionOperation } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { OperationValue } from "../../components/sendForm/types";
import { makeFA2TransferMethod, makeToolkitWithSigner } from "./helpers";
import { operationValuesToWalletParams } from "./params";
import { FA2TokenTransferParams } from "./types";

export const delegate = async (
  senderPkh: string,
  bakerPkh: string | undefined,
  sk: string,
  network: TezosNetwork
): Promise<DelegateOperation> => {
  const Tezos = await makeToolkitWithSigner(sk, network);
  return Tezos.contract.setDelegate({
    source: senderPkh,
    delegate: bakerPkh,
  });
};

export const transferFA2Token = async (
  params: FA2TokenTransferParams,
  sk: string,
  network: TezosNetwork
): Promise<TransactionOperation> => {
  const Tezos = await makeToolkitWithSigner(sk, network);
  const transferMethod = await makeFA2TransferMethod(params, Tezos);
  return transferMethod.send();
};

export const transferTez = async (
  recipient: string,
  amount: number,
  sk: string,
  network: TezosNetwork
): Promise<TransactionOperation> => {
  const Tezos = await makeToolkitWithSigner(sk, network);
  return Tezos.contract.transfer({ to: recipient, amount });
};

export const submitBatch = async (
  operation: OperationValue[],
  sk: string,
  network: TezosNetwork
): Promise<BatchWalletOperation> => {
  const Tezos = await makeToolkitWithSigner(sk, network);
  const params = await operationValuesToWalletParams(operation, Tezos);
  return Tezos.wallet.batch(params).send();
};
