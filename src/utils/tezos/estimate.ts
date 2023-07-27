import { Estimate } from "@taquito/taquito";
import { ImplicitAccount } from "../../types/Account";
import { Operation } from "../../types/Operation";
import { TezosNetwork } from "../../types/TezosNetwork";
import {
  makeMultisigApproveOrExecuteMethod,
  makeMultisigProposeMethod,
  makeToolkit,
} from "./helpers";
import { operationsToBatchParams } from "./params";
import { MultisigApproveOrExecuteMethodArgs, MultisigProposeMethodArgs } from "./types";

export const estimateMultisigPropose = async (
  params: MultisigProposeMethodArgs,
  signer: ImplicitAccount,
  network: TezosNetwork
): Promise<Estimate> => {
  const tezosToolkit = await makeToolkit({ type: "fake", signer, network });

  const propseMethod = await makeMultisigProposeMethod(params, tezosToolkit);

  return tezosToolkit.estimate.transfer(propseMethod.toTransferParams());
};

export const estimateMultisigApproveOrExecute = async (
  params: MultisigApproveOrExecuteMethodArgs,
  signer: ImplicitAccount,
  network: TezosNetwork
): Promise<Estimate> => {
  const tezosToolkit = await makeToolkit({ type: "fake", signer, network });

  const approveOrExecuteMethod = await makeMultisigApproveOrExecuteMethod(params, tezosToolkit);

  return tezosToolkit.estimate.transfer(approveOrExecuteMethod.toTransferParams());
};

export const estimateBatch = async (
  operations: Operation[],
  signer: ImplicitAccount,
  network: TezosNetwork
): Promise<Estimate[]> => {
  const batch = operationsToBatchParams(operations);

  const tezosToolkit = await makeToolkit({ type: "fake", signer, network });

  return tezosToolkit.estimate.batch(batch);
};
