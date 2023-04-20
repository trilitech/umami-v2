import { TezosNetwork } from "@airgap/tezos";
import { Signer, TezosToolkit } from "@taquito/taquito";
import { TransactionValues } from "../../components/sendForm/types";
import { nodeUrls } from "./consts";
import { DummySigner } from "./dummySigner";
import { makeContract, makeToolkitWithDummySigner } from "./helpers";
import { transactionValuesToBatchParams } from "./params";
import { FA2TokenTransferParams } from "./types";

export const estimateTezTransfer = async (
  senderPkh: string,
  recipient: string,
  amount: number,
  senderPk: string,
  network: TezosNetwork
) => {
  const Tezos = makeToolkitWithDummySigner(senderPk, senderPkh, network);
  return Tezos.estimate.transfer({
    to: recipient,
    amount: amount,
  });
};

export const estimateFA2transfer = async (
  params: FA2TokenTransferParams,
  senderPk: string,
  network: TezosNetwork
) => {
  const Tezos = makeToolkitWithDummySigner(senderPk, params.sender, network);

  const contractInstance = await makeContract(params, Tezos);

  return Tezos.estimate.transfer(contractInstance.toTransferParams());
};

export const estimateDelegation = async (
  senderPkh: string,
  bakerPkh: string | undefined,
  senderPk: string,
  network: TezosNetwork
) => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  Tezos.setProvider({
    signer: new DummySigner(senderPk, senderPkh) as any as Signer,
  });

  return Tezos.estimate.setDelegate({ source: senderPkh, delegate: bakerPkh });
};

export const estimateBatch = async (
  transactions: TransactionValues[],
  pkh: string,
  pk: string,
  network: TezosNetwork
) => {
  const batch = await transactionValuesToBatchParams(transactions, pk, network);

  const Tezos = await makeToolkitWithDummySigner(pk, pkh, network);

  return Tezos.estimate.batch(batch);
};
