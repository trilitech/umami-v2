import { TezosNetwork } from "@airgap/tezos";
import { Estimate, TezosToolkit } from "@taquito/taquito";
import { OperationValue } from "../../components/sendForm/types";
import { nodeUrls } from "./consts";
import { DummySigner } from "./dummySigner";

import {
  makeFA12TransferMethod,
  makeFA2TransferMethod,
  makeToolkitWithDummySigner,
} from "./helpers";
import { operationValuesToBatchParams } from "./params";
import { FA12TokenTransferParams, FA2TokenTransferParams } from "./types";

export const estimateTezTransfer = async (
  senderPkh: string,
  recipient: string,
  amount: number,
  senderPk: string,
  network: TezosNetwork
): Promise<Estimate> => {
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
): Promise<Estimate> => {
  const Tezos = makeToolkitWithDummySigner(senderPk, params.sender, network);

  const transferMethod = await makeFA2TransferMethod(params, Tezos);

  return Tezos.estimate.transfer(transferMethod.toTransferParams());
};

export const estimateFA12transfer = async (
  params: FA12TokenTransferParams,
  senderPk: string,
  network: TezosNetwork
): Promise<Estimate> => {
  const Tezos = makeToolkitWithDummySigner(senderPk, params.sender, network);

  const transferMethod = await makeFA12TransferMethod(params, Tezos);

  return Tezos.estimate.transfer(transferMethod.toTransferParams());
};

export const estimateDelegation = async (
  senderPkh: string,
  bakerPkh: string | undefined,
  senderPk: string,
  network: TezosNetwork
): Promise<Estimate> => {
  const Tezos = new TezosToolkit(nodeUrls[network]);
  Tezos.setProvider({
    signer: new DummySigner(senderPk, senderPkh),
  });

  return Tezos.estimate.setDelegate({ source: senderPkh, delegate: bakerPkh });
};

export const estimateBatch = async (
  operations: OperationValue[],
  pkh: string,
  pk: string,
  network: TezosNetwork
): Promise<Estimate[]> => {
  const batch = await operationValuesToBatchParams(operations, pk, network);

  const Tezos = makeToolkitWithDummySigner(pk, pkh, network);

  return Tezos.estimate.batch(batch);
};
