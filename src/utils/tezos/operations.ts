import { TezosNetwork } from "@airgap/tezos";
import { TransactionValues } from "../../components/sendForm/types";
import { makeContract, makeToolkitWithSigner } from "./helpers";
import { transactionValuesToWalletParams } from "./params";
import { FA2TokenTransferParams } from "./types";

export const delegate = async (
  senderPkh: string,
  bakerPkh: string | undefined,
  sk: string,
  network: TezosNetwork
) => {
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
) => {
  const Tezos = await makeToolkitWithSigner(sk, network);
  const contractInstance = await makeContract(params, Tezos);
  return contractInstance.send();
};

export const transferTez = async (
  recipient: string,
  amount: number,
  sk: string,
  network: TezosNetwork
) => {
  const Tezos = await makeToolkitWithSigner(sk, network);
  return Tezos.contract.transfer({ to: recipient, amount });
};

export const submitBatch = async (
  transactions: TransactionValues[],
  sk: string,
  network: TezosNetwork
) => {
  const Tezos = await makeToolkitWithSigner(sk, network);
  const params = await transactionValuesToWalletParams(transactions, Tezos);
  return Tezos.wallet.batch(params).send();
};
