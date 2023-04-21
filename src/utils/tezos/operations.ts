import { TezosNetwork } from "@airgap/tezos";
import { DelegateOperation, TransactionOperation } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { TransactionValues } from "../../components/sendForm/types";
import { makeContract, makeToolkitWithSigner } from "./helpers";
import { transactionValuesToWalletParams } from "./params";
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
  const contractInstance = await makeContract(params, Tezos);
  return contractInstance.send();
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
  transactions: TransactionValues[],
  sk: string,
  network: TezosNetwork
): Promise<BatchWalletOperation> => {
  const Tezos = await makeToolkitWithSigner(sk, network);
  const params = await transactionValuesToWalletParams(transactions, Tezos);
  return Tezos.wallet.batch(params).send();
};
