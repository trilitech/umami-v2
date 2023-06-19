import { TezosNetwork } from "@airgap/tezos";
import { Estimate } from "@taquito/taquito";
import { OperationValue } from "../../components/sendForm/types";
import {
  makeMultisigApproveOrExecuteMethod,
  makeMultisigProposeMethod,
  makeToolkitWithDummySigner,
} from "./helpers";
import { operationValuesToBatchParams } from "./params";
import { MultisigApproveOrExecuteMethodArgs, MultisigProposeMethodArgs } from "./types";

export const estimateMultisigPropose = async (
  params: MultisigProposeMethodArgs,
  senderPkh: string,
  network: TezosNetwork
): Promise<Estimate> => {
  const Tezos = makeToolkitWithDummySigner(senderPkh, network);

  const propseMethod = await makeMultisigProposeMethod(params, Tezos);

  return Tezos.estimate.transfer(propseMethod.toTransferParams());
};

export const estimateMultisigApproveOrExecute = async (
  params: MultisigApproveOrExecuteMethodArgs,
  senderPkh: string,
  network: TezosNetwork
): Promise<Estimate> => {
  const Tezos = makeToolkitWithDummySigner(senderPkh, network);

  const approveOrExecuteMethod = await makeMultisigApproveOrExecuteMethod(params, Tezos);

  return Tezos.estimate.transfer(approveOrExecuteMethod.toTransferParams());
};

export const estimateBatch = async (
  operations: OperationValue[],
  pkh: string,
  network: TezosNetwork
): Promise<Estimate[]> => {
  const batch = await operationValuesToBatchParams(operations, network);

  const Tezos = makeToolkitWithDummySigner(pkh, network);

  return Tezos.estimate.batch(batch);
};
