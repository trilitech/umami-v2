import { TezosNetwork } from "@airgap/tezos";
import { Estimate } from "@taquito/taquito";
import { BatchOperation } from "../../components/sendForm/types";
import {
  makeMultisigApproveOrExecuteMethod,
  makeMultisigProposeMethod,
  makeToolkitWithDummySigner,
} from "./helpers";
import { operationValuesToBatchParams } from "./params";
import { MultisigApproveOrExecuteMethodArgs, MultisigProposeMethodArgs } from "./types";

export const estimateMultisigPropose = async (
  params: MultisigProposeMethodArgs,
  senderPk: string,
  senderPkh: string,
  network: TezosNetwork
): Promise<Estimate> => {
  const Tezos = makeToolkitWithDummySigner(senderPk, senderPkh, network);

  const propseMethod = await makeMultisigProposeMethod(params, Tezos);

  return Tezos.estimate.transfer(propseMethod.toTransferParams());
};

export const estimateMultisigApproveOrExecute = async (
  params: MultisigApproveOrExecuteMethodArgs,
  senderPk: string,
  senderPkh: string,
  network: TezosNetwork
): Promise<Estimate> => {
  const Tezos = makeToolkitWithDummySigner(senderPk, senderPkh, network);

  const approveOrExecuteMethod = await makeMultisigApproveOrExecuteMethod(params, Tezos);

  return Tezos.estimate.transfer(approveOrExecuteMethod.toTransferParams());
};

export const estimateBatch = async (
  operations: BatchOperation[],
  pkh: string,
  pk: string,
  network: TezosNetwork
): Promise<Estimate[]> => {
  const batch = await operationValuesToBatchParams(operations, pk, network);

  const Tezos = makeToolkitWithDummySigner(pk, pkh, network);

  return Tezos.estimate.batch(batch);
};
